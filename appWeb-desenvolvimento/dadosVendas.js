const express = require('express');
const path = require('path')
const fs = require('fs'); // Adicione esta linha para manipulação de arquivos
const { connectDatabase } = require('./db'); // Substitua pelo caminho real do seu módulo de conexão
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

const app = express();
const port = 3003;


const publicFolderPath = path.join(__dirname, 'public')
app.use(express.static(publicFolderPath)); // Servir arquivos estáticos da pasta 'public'
app.use(express.json());

// Rota para puxar dados
app.post('/puxarDados', async (req, res) => {
  try {
    const { nomeOperador, escolha } = req.body;
    console.log('Dados recebidos do front-end:', req.body);

    const { db, concluidoCollection, renegociarCollection } = await connectDatabase();
    let result;

    if (escolha === 'Concluido') {
      result = await concluidoCollection.find({ nomeOperador }).toArray();
    } else if (escolha === 'Renegociar') {
      result = await renegociarCollection.find({ nomeOperador }).toArray();
    }

    // Salvar os dados em um arquivo (assíncrono)
    const filePath = path.join(publicFolderPath, 'dadosVendedores', `${nomeOperador}_dados.json`);
    await writeFileAsync(filePath, JSON.stringify(result));

    // Enviar os dados como resposta
    res.json(result);
  } catch (error) {
    console.error('Erro ao puxar dados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


app.get('/vendedores.json', (req, res) => {
    const filePath = path.join(publicFolderPath, 'ano.json');
    res.sendFile(filePath);
});

app.get('/dias.json', (req, res) => {
    const filePath = path.join(publicFolderPath, 'dias.json');
    res.sendFile(filePath);
});

app.get('/mes.json', (req, res) => {
    const filePath = path.join(publicFolderPath, 'mes.json');
    res.sendFile(filePath);
});
app.get('/ano.json', (req, res) => {
    const filePath = path.join(publicFolderPath, 'ano.json');
    res.sendFile(filePath);
});

app.get('/vendasDados.html', (req, res) => {
    const filePath = path.join(publicFolderPath, 'vendasDados.html');
    res.sendFile(filePath);
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
