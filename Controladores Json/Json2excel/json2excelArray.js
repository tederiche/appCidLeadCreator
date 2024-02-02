const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const jsonFolder = 'C:/Users/PREDATOR/Documents/SERVIDOR/GeradorDeExcel';
const jsonFiles = fs.readdirSync(jsonFolder).filter(file => file.endsWith('.json'));

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Dados');

// Function to flatten nested objects
const flattenObject = (obj, prefix = '') => {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
            Object.assign(result, flattenObject(value, `${prefix}${key}_`));
        } else {
            result[`${prefix}${key}`] = value;
        }
    }
    return result;
};

// Set to store all field names across all JSON files
const allFieldNames = new Set();

jsonFiles.forEach(jsonFile => {
    const jsonFilePath = path.join(jsonFolder, jsonFile);

    try {
        const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

        if (Array.isArray(jsonData) && jsonData.length > 0) {
            // Flatten nested objects within the "resultado" field
            const flattenedData = jsonData.map(obj => {
                if (obj.resultado && obj.resultado.length > 0) {
                    return { ...obj, ...flattenObject(obj.resultado[0], 'resultado_') };
                }
                return obj;
            });

            // Add all field names to the set
            flattenedData.forEach(objeto => {
                Object.keys(objeto).forEach(fieldName => {
                    allFieldNames.add(fieldName);
                });
            });

            // Add headers with all field names
            worksheet.addRow(Array.from(allFieldNames));

            // Add data rows
            flattenedData.forEach(objeto => {
                const row = Array.from(allFieldNames).map(fieldName => objeto[fieldName] || '');
                worksheet.addRow(row);
            });
        } else {
            console.error(`O arquivo JSON ${jsonFile} está vazio ou não é um array.`);
        }
    } catch (jsonError) {
        console.error(`Erro ao analisar o JSON do arquivo ${jsonFile}:`, jsonError);
    }
});

const excelOutputPath = 'Fratura_parte.xlsx';

workbook.xlsx.writeFile(excelOutputPath)
    .then(() => {
        console.log(`Conversão concluída. Arquivo Excel salvo em: ${excelOutputPath}`);
    })
    .catch(error => {
        console.error('Erro ao salvar o arquivo Excel:', error);
    });
