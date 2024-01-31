function lerCSV() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function(e) {
      const conteudo = e.target.result;
      const linhas = conteudo.split('\n');
      const headers = linhas[0].split(';');
      const jsonData = [];

      for (let i = 1; i < linhas.length; i++) {
        const colunas = linhas[i].split(';');
        const linha = {};

        for (let j = 0; j < headers.length; j++) {
          const header = headers[j];
          const value = colunas[j];
          linha[header] = value;
        }

        jsonData.push(linha);
      }

      const jsonDataString = JSON.stringify(jsonData, null, 2);

      // Criar um arquivo JSON para download
      const blob = new Blob([jsonDataString], { type: 'application/json;charset=utf-8' }); // Adicionando o charset para UTF-8
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'dados.json';
      link.click();
    };

    reader.readAsText(file, 'UTF-8'); // Especificando a codificação como UTF-8
  } else {
    alert('Selecione um arquivo CSV.');
  }
}

// Exemplo de chamada da função ao clicar em um botão
const botaoLerCSV = document.getElementById('botaoLerCSV'); // Supondo que existe um botão com o id 'botaoLerCSV'
botaoLerCSV.addEventListener('click', lerCSV);
