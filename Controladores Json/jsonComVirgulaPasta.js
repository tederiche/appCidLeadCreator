const fs = require('fs');
const path = require('path');

// Caminho da pasta contendo os arquivos JSON
const folderPath = 'C:/Users/PREDATOR/Documents/SERVIDOR/arrumandoJson';

// Lista todos os arquivos na pasta
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Erro ao ler a pasta:', err);
    return;
  }

  // Itera sobre cada arquivo na pasta
  files.forEach(file => {
    // Verifica se o arquivo é um JSON
    if (path.extname(file).toLowerCase() === '.json') {
      const filePath = path.join(folderPath, file);

      // Lê o conteúdo do arquivo
      const jsonData = fs.readFileSync(filePath, 'utf8');

      try {
        // Remova qualquer caractere indesejado que pode estar causando problemas
        const cleanedData = jsonData.replace(/[\r\n]+/g, '');

        // Adicione vírgulas entre os objetos
        const formattedData = cleanedData.replace(/}({|$)/g, '},\n$1');

        // Envolvendo tudo em colchetes para formar um array JSON válido
        const finalJson = '[' + formattedData + ']';

        // Salva o JSON formatado no mesmo arquivo
        fs.writeFileSync(filePath, finalJson);

        console.log(`JSON formatado e salvo com sucesso: ${file}`);
      } catch (error) {
        console.error(`Erro ao analisar o JSON em ${file}:`, error.message);
      }
    }
  });
});
