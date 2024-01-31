const fs = require('fs');
const ExcelJS = require('exceljs');

// Caminho do arquivo JSON de entrada
const jsonFilePath = '../SERVIDOR/M510_parte1.json';

// Ler o conteúdo do arquivo JSON
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo JSON:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);

        // Criar um novo workbook e adicionar uma planilha
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Dados');

        // Adicionar cabeçalhos de coluna com base nas chaves do JSON
        const headers = Object.keys(jsonData.objetos[0]);
        worksheet.addRow(headers);

        // Adicionar dados ao Excel
        jsonData.objetos.forEach(objeto => {
            const row = Object.values(objeto);
            worksheet.addRow(row);
        });

        // Especificar o caminho do arquivo Excel de saída
        const excelOutputPath = 'output.xlsx';

        // Salvar o arquivo Excel
        workbook.xlsx.writeFile(excelOutputPath)
            .then(() => {
                console.log(`Conversão concluída. Arquivo Excel salvo em: ${excelOutputPath}`);
            })
            .catch(error => {
                console.error('Erro ao salvar o arquivo Excel:', error);
            });
    } catch (jsonError) {
        console.error('Erro ao analisar o JSON:', jsonError);
    }
});