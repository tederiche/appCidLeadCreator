const fs = require('fs');

// Caminho do arquivo JSON
const jsonFilePath = 'C:/Users/PREDATOR/Documents/SERVIDOR/appWeb-desenvolvimento/leads/Arquivos_parana_CAT-2012_2.json';


const jsonData = fs.readFileSync(jsonFilePath, 'utf8');

try {
  // Remova qualquer caractere indesejado que pode estar causando problemas
  const cleanedData = jsonData.replace(/[\r\n]+/g, '');

  // Adicione vírgulas entre os objetos
  const formattedData = cleanedData.replace(/}({|$)/g, '},\n$1');

  // Envolvendo tudo em colchetes para formar um array JSON válido
  const finalJson = '[' + formattedData + ']';

  // Salva o JSON formatado no mesmo arquivo
  fs.writeFileSync(jsonFilePath, finalJson);

  console.log('JSON formatado e salvo com sucesso.');
} catch (error) {
  console.error('Erro ao analisar o JSON:', error.message);
}
