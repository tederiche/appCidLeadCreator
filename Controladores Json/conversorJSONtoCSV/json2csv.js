const fs = require('fs');
const { Parser } = require('json2csv');

const dadosJson = require('../resultados.json');

// Configurar o parser
const json2csvParser = new Parser();
const csv = json2csvParser.parse(dadosJson);

// Salvar como CSV
fs.writeFileSync('resultado.csv', csv, 'utf-8');
