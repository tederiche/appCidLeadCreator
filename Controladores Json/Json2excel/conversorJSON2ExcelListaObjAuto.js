const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// Pasta contendo os arquivos JSON
const jsonFolder = 'C:/Users/PREDATOR/Documents/SERVIDOR/GeradorDeExcel';

// Obter a lista de arquivos no diretório
const jsonFiles = fs.readdirSync(jsonFolder).filter(file => file.endsWith('.json'));

// Criar um novo workbook
const workbook = new ExcelJS.Workbook();

// Criar uma única planilha para todos os dados
const worksheet = workbook.addWorksheet('Dados');

// Iterar sobre cada arquivo JSON na lista
jsonFiles.forEach(jsonFile => {
    // Ler o conteúdo do arquivo JSON
    const jsonFilePath = path.join(jsonFolder, jsonFile);
    
    try {
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

        // Verificar se há pelo menos um objeto no array
        if (Array.isArray(jsonData) && jsonData.length > 0) {
            // Adicionar cabeçalhos de coluna na primeira iteração
            if (worksheet.rowCount === 1) {
                const firstObject = jsonData[0];
                const headers = Object.keys(firstObject);
                worksheet.addRow(headers);
            }

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
