const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
app.use(bodyParser.json());

// Configurando CORS para permitir solicitações de qualquer origem
app.use(cors({ origin: '*' }));

const publicFolderPath = path.join(__dirname, 'public');
app.use(express.static(publicFolderPath));

const client = new MongoClient('mongodb://localhost:27017/novoDB');

async function fazerPesquisa(nomeArquivo, CPF, objetosPorArquivo = 20000, limitePorConsulta = 100) {
    const leadsFolderPath = path.join(__dirname, 'leads');
    let resultadosPorColecao = [];

    try {
        await client.connect();
        const database = client.db();
        const colecoes = await database.listCollections().toArray();

        for (const colecaoInfo of colecoes) {
            const colecaoNome = colecaoInfo.name;
            const colecao = database.collection(colecaoNome);
            // Verificar se CPF é indefinida ou nula
            if (CPF === undefined || CPF === null) {
                console.error('parteNatLesao é indefinida ou nula');
                return;
            }

            // Extrair apenas os números da entrada
            const numerosCPF = CPF.match(/\d+/g);
            const query = {
                
                    CPF: { $regex: new RegExp('^' + numerosCPF.join('\\.') + '.*$') }
                
            };

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

    } catch (error) {
        console.error('Erro durante a pesquisa:', error);
        throw error;
    }
}

// Atualize a rota de pesquisa para aceitar
app.post('/pesquisaCPF', async (req, res) => {
    const { nomeArquivo, CPF, pagina = 1, itensPorPagina = 100 } = req.body;
    try {
        if (!nomeArquivo || !CPF) {
            return res.status(400).json({ error: 'Parâmetros inválidos' });
        }

        await fazerPesquisa(nomeArquivo, CPF); 

        // Você pode retornar uma mensagem de sucesso se necessário
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao executar pesquisa', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

function paginarResultados(resultados, pagina, itensPorPagina) {
    const startIndex = (pagina - 1) * itensPorPagina;
    const endIndex = startIndex + itensPorPagina;
    return resultados.slice(startIndex, endIndex);
}



app.get('/pesquisacpf.html', (req, res) => {
    const filePath = path.join(publicFolderPath, 'pesquisaCPF.html');
    res.sendFile(filePath);
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
