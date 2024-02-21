// main 3000
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { fazerPesquisa } = require('./pesquisa.js'); //Usando caminho relativo 3001
const { salvarResposta } = require('./cadastroVendas.js'); //Usando caminho relativo 3002
const { vendasController } = require('./dadosVendas.js'); //Usando caminho relativo 3003
const { pesquisaEstados } = require('./pesquisaporestado.js'); //Usando caminho relativo 3004
const { natPesquisa } = require('./natPesquisa.js'); //Usando caminho relativo 3005
const { todasVendas} = require('./todasVendas.js'); //porta 3008
const { pesquisaCPF} = require('./pesquisaCPF.js'); //porta 3006

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
    res.sendFile(filePath)
}
app.get('/diasafastado.html'),(req, res)=>{
    const filePath = path.join(__dirname, 'public', 'diasafastado.html')
    res.sendFile(filePath)
}
app.get('/todasvendas.html'),(req, res)=>{
    const filePath = path.join(__dirname, 'public', 'todasVendas.html')
    res.sendFile(filePath)
}
app.get('/pesquisacpf.html'),(req, res)=>{
    const filePath = path.join(__dirname, 'public', 'pesquisaCPF.html')
    res.sendFile(filePath)
}

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
