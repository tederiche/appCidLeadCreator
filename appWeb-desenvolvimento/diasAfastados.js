const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Configurando CORS para permitir solicitações de qualquer origem
app.use(cors({ origin: '*' }));

const publicFolderPath = path.join(__dirname, 'public');
app.use(express.static(publicFolderPath));

const client = new MongoClient('mongodb://localhost:27017/novoDB');

async function fazerPesquisa(nomeArquivo, diasAfastado, objetosPorArquivo = 20000, limitePorConsulta = 100) {
    const leadsFolderPath = path.join(__dirname, 'leads');

    try {
        await client.connect();
        const database = client.db();
        const colecoes = await database.listCollections().toArray();

        const resultadosPorColecao = [];

        for (const colecaoInfo of colecoes) {
            const colecaoNome = colecaoInfo.name;
            const colecao = database.collection(colecaoNome);

            const valorDiasAfastado = parseInt(diasAfastado, 10);

            console.log('valorDiasAfastado:', valorDiasAfastado);

            const query = {
                $expr: {
                  $and: [
                    { $ne: ["$DIAS", ""] },  // Garante que o campo DIAS não está vazio
                    { $regexMatch: { input: "$DIAS", regex: /^\d+$/ } },  // Verifica se o campo DIAS é composto apenas por dígitos
                    { $gte: [{ $toInt: "$DIAS" }, valorDiasAfastado] }  // Converte e compara o valor como número
                  ]
                }
              };

            // Executar a lógica desejada usando a consulta
            const resultados = await colecao.find(query).toArray();
            resultadosPorColecao.push({ colecao: colecaoNome, resultados });

            let offset = 0;
            let limite = limitePorConsulta;

            const caminhoCompleto = path.join(leadsFolderPath, `${nomeArquivo}_${colecaoNome}`);
            await fs.promises.mkdir(leadsFolderPath, { recursive: true });

            let arquivoAtual = 1;
            let objetosNoArquivoAtual = 0;

            const getNextWriteStream = () => {
                const caminhoArquivo = `${caminhoCompleto}_${arquivoAtual}.json`;
                return fs.createWriteStream(caminhoArquivo, { flags: 'a' });
            };

            let writeStream = getNextWriteStream();
            writeStream.setMaxListeners(0);

            let cursor = colecao.find(query).skip(offset).limit(limite);

            while (true) {
                const documentos = await cursor.toArray();

                if (documentos.length === 0) {
                    break;
                }

                for (const documento of documentos) {
                    if (objetosNoArquivoAtual >= objetosPorArquivo) {
                        // Muda para o próximo arquivo
                        writeStream.end();
                        arquivoAtual++;
                        objetosNoArquivoAtual = 0;

                        // Adiciona esta linha para remover o limite de ouvintes para o evento 'drain'
                        writeStream.setMaxListeners(0);

                        writeStream = getNextWriteStream();
                    }

                    if (!writeStream.write(JSON.stringify({ colecao: colecaoNome, resultado: [documento] }, null, 2) + '\n')) {
                        // Se o buffer estiver cheio, aguarda o evento 'drain' para continuar escrevendo
                        await new Promise((resolve) => writeStream.once('drain', resolve));
                    }

                    objetosNoArquivoAtual++;
                }

                offset += limite;
                cursor = colecao.find(query).skip(offset).limit(limite);
            }

            // Encerra o stream após a conclusão
            writeStream.end();
        }

        return resultadosPorColecao;

    } catch (error) {
        console.error('Erro durante a pesquisa:', error);
        throw error;
    }
}

// Atualize a rota de pesquisa para aceitar
app.post('/diasafastado', async (req, res) => {
    const { nomeArquivo, diasAfastado, pagina = 1, itensPorPagina = 100 } = req.body;

    console.log('nomeArquivo recebido:', nomeArquivo);
    console.log('diasAfastado recebido:', diasAfastado);
    try {
        if (!nomeArquivo || !diasAfastado) {
            return res.status(400).json({ error: 'Parâmetros inválidos' });
        }

        const resultados = await fazerPesquisa(nomeArquivo, diasAfastado);

        // Enviar os resultados como resposta em JSON
        res.json({ success: true, resultados });
    } catch (error) {
        console.error('Erro ao executar pesquisa', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/diasafastado.html', (req, res) => {
    const filePath = path.join(publicFolderPath, 'diasafastado.html');
    res.sendFile(filePath);
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
