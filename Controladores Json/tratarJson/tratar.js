function removerEspacos(objeto) {
    for (let chave in objeto) {
      if (typeof objeto[chave] === 'string') {
        objeto[chave] = objeto[chave].trim();
      }
    }
    return objeto;
  }
  
  function processarArquivo() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files || fileInput.files.length === 0) {
      alert('Por favor, selecione um arquivo JSON.');
      return;
    }
  
    const file = fileInput.files[0];
    const reader = new FileReader();
  
    reader.onload = function(event) {
      try {
        const jsonData = JSON.parse(event.target.result);
  
        const novoJson = jsonData.map(removerEspacos);
  
        const novoNomeArquivo = file.name.replace('.json', '_sem_espacos.json');
        const novoArquivoJSON = JSON.stringify(novoJson, null, 2);
  
        const downloadLink = document.createElement('a');
        downloadLink.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(novoArquivoJSON);
        downloadLink.download = novoNomeArquivo;
        downloadLink.click();
      } catch (error) {
        console.error('Erro ao processar o arquivo JSON:', error);
        alert('Erro ao processar o arquivo JSON.');
      }
    };
  
    reader.readAsText(file, 'UTF-8');
  }
  