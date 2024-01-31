function handleFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const content = event.target.result;
            console.log("arquivo", content);
            try {
                const jsonArray = JSON.parse(content);

                const idSet = new Set();
                let hasDuplicates = false;

                jsonArray.forEach((entry, index) => {
                    const colecao = entry.colecao;
                    const resultado = entry.resultado;

                    resultado.forEach(item => {
                        const id = item.ID;

                        if (idSet.has(id)) {
                            console.error(`Duplicate ID found at index ${index}: ${id}`);
                            hasDuplicates = true;
                        } else {
                            idSet.add(id);
                        }
                    });
                });

                if (!hasDuplicates) {
                    console.log("No duplicate IDs found.");
                }
            } catch (error) {
                console.error("Error parsing JSON:", error.message);
                console.error(error);
            }
        };

        reader.readAsText(file);
    } else {
        console.error("No file selected.");
    }
}
