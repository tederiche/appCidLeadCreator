const express = require('express');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const app = express();
const port = 3008;

// Configuração para servir arquivos estáticos da pasta "public"
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/css', express.static(path.join(__dirname, 'public', 'css')));

// Configuração para a rota principal servir o arquivo "index.html"
app.get('/todasvendas.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'todasVendas.html'));
});


app.get('/api/dados', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Levantamentos.xlsx');
    
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  
      const sheetName = 'Processado';
  
      if (workbook.SheetNames.includes(sheetName)) {
        const worksheet = workbook.Sheets[sheetName];
  
        // Limitar até a coluna H
        const data = [];
        const range = { s: { c: 0, r: 0 }, e: { c: 7, r: 0 } }; // H está na coluna de índice 7
        const options = { header: 1, range: range };
  
        for (let rowIndex = 0; ; rowIndex++) {
          range.s.r = rowIndex;
          range.e.r = rowIndex;
  
          const cell = worksheet[XLSX.utils.encode_cell({ c: range.s.c, r: range.s.r })];
          if (!cell || cell.v === undefined) {
            break; // Interrompe quando atinge a última linha com dados
          }
  
          const rowData = XLSX.utils.sheet_to_json(worksheet, options)[0];
          data.push(rowData);
        }
  
        res.json(data);
      } else {
        res.status(404).json({ error: 'A planilha não foi encontrada.' });
      }
    } catch (error) {
      console.error('Erro ao ler o arquivo:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  });

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
