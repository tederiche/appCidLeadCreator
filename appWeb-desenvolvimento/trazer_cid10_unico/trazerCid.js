const { MongoClient } = require('mongodb');
const fs = require('fs').promises;

const client = new MongoClient('mongodb://localhost:27017/empresaTest');

async function obterCIDsUnicos() {
    try {
        await client.connect();
        const database = client.db();
        const colecoes = await database.listCollections().toArray();

        const valoresCID10 = [];

        for (const colecaoInfo of colecoes) {
            const colecaoNome = colecaoInfo.name;
            const colecao = database.collection(colecaoNome);

            const resultado = await colecao.distinct('CID_10');
            valoresCID10.push(...resultado);
        }

        const valoresUnicos = [...new Set(valoresCID10)];

        // Salva os valores únicos em um arquivo JSON
        const jsonFileName = 'valoresUnicosCID10.json';
        await fs.writeFile(jsonFileName, JSON.stringify({ valoresUnicos }, null, 2));

        return jsonFileName; // Retorna o nome do arquivo
    } finally {
        await client.close();
    }
}

// Exemplo de uso
obterCIDsUnicos()
    .then((jsonFileName) => {
        console.log(`Valores únicos de CID_10 salvos em ${jsonFileName}`);
    })
    .catch((error) => {
        console.error('Erro ao obter e salvar valores únicos de CID_10', error);
    });
