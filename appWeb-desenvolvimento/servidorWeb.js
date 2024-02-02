const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { fazerPesquisa } = require('./pesquisa.js'); // Usando caminho relativo
const { salvarResposta } = require('./cadastroVendas.js'); // Usando caminho relativo
const { vendasController } = require('./dadosVendas.js'); //Usando caminho relativo
const { pesquisaEstados } = require('./pesquisaporestado.js'); //Usando caminho relativo
const { natPesquisa } = require('./natPesquisa.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // rotas complexas

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));


// Rota do primeiro arquivo
app.get('/pesquisa.html', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'pesquisa.html');
    res.sendFile(filePath);
});

// Rota do segundo arquivo
app.get('/vendas.html', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'vendas.html');
    res.sendFile(filePath);
});

// Rota do Terceiro arquivo
app.get('/dadosvendedores.html', (req, res)=>{
    const filePath = path.join(__dirname, 'public', 'dadosvendedores.html');
    res.sendFile(filePath)
});

//rota do Quarto arquivo
app.get('/pesquisaporestado.html', (req, res)=>{
    const filePath = path.join(__dirname, 'public', 'pesquisaporestado.html');
    res.sendFile(filePath)
});

app.get('/natpesquisa.html'),(req, res)=>{
    const filePath = path.join(__dirname, 'public', 'natpesquisa.html')
}

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
