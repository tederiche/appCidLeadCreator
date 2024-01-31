const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// Pasta contendo os arquivos JSON
const jsonFolder = 'C:/Users/PREDATOR/Documents/SERVIDOR/';

// Lista de nomes de arquivos JSON a serem processados
const jsonFiles = ['M510_parte1.json', 'M510_parte2.json', 'M510_parte3.json', 'M510_parte4.json', 'M510_parte5.json', 'M510_parte6.json' ]; // Adicione mais arquivos conforme necessário

// Criar um novo workbook
const workbook = new ExcelJS.Workbook();

// Iterar sobre cada arquivo JSON na lista
jsonFiles.forEach(jsonFile => {
    // Ler o conteúdo do arquivo JSON
    const jsonFilePath = path.join(jsonFolder, jsonFile);
    const baseFileName = path.basename(jsonFilePath, path.extname(jsonFilePath));

    try {
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

        // Verificar se há pelo menos um objeto no array
        if (Array.isArray(jsonData) && jsonData.length > 0) {
            // Adicionar uma planilha para cada arquivo
            const worksheet = workbook.addWorksheet(baseFileName);

            // Adicionar cabeçalhos de coluna com base nas chaves do primeiro objeto
            const firstObject = jsonData[0];
            const headers = Object.keys(firstObject);
            worksheet.addRow(headers);

            // Adicionar dados ao Excel
            jsonData.forEach(objeto => {
                const row = Object.values(objeto);
                worksheet.addRow(row);
            });
        } else {
            console.error(`O arquivo JSON ${jsonFile} está vazio ou não é um array.`);
        }
    } catch (jsonError) {
        console.error(`Erro ao analisar o JSON do arquivo ${jsonFile}:`, jsonError);
    }
});

// Especificar o caminho do arquivo Excel de saída
const excelOutputPath = 'output_agrupado.xlsx';

// Salvar o arquivo Excel
workbook.xlsx.writeFile(excelOutputPath)
    .then(() => {
        console.log(`Conversão concluída. Arquivo Excel salvo em: ${excelOutputPath}`);
    })
    .catch(error => {
        console.error('Erro ao salvar o arquivo Excel:', error);
    });
