document.addEventListener('DOMContentLoaded', () => {
    const words = ['CASCO', 'ALCOHOLEMIA', 'SEMAFORO', 'SEÑAL', 'VELOCIDAD', 'CINTURON', 'CICLOVIA'];
    const gridSize = 15;
    const grid = [];
    const container = document.getElementById('word-search-container');
    const message = document.getElementById('message');
    const wordsList = document.getElementById('words-list');
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    let selectedCells = [];
    let selectedWord = '';
    let mouseIsDown = false;

    words.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        wordsList.appendChild(listItem);
    });

    for (let i = 0; i < gridSize; i++) {
        grid[i] = new Array(gridSize).fill('');
    }

    const placeWord = (word) => {
        const direction = Math.floor(Math.random() * 2);
        let row, col;
        let fits = false;

        while (!fits) {
            fits = true;
            if (direction === 0) {
                row = Math.floor(Math.random() * gridSize);
                col = Math.floor(Math.random() * (gridSize - word.length));
                for (let i = 0; i < word.length; i++) {
                    if (grid[row][col + i] !== '') {
                        fits = false;
                        break;
                    }
                }
            } else {
                row = Math.floor(Math.random() * (gridSize - word.length));
                col = Math.floor(Math.random() * gridSize);
                for (let i = 0; i < word.length; i++) {
                    if (grid[row + i][col] !== '') {
                        fits = false;
                        break;
                    }
                }
            }
        }

        if (direction === 0) {
            for (let i = 0; i < word.length; i++) {
                grid[row][col + i] = word[i];
            }
        } else {
            for (let i = 0; i < word.length; i++) {
                grid[row + i][col] = word[i];
            }
        }
    };

    words.forEach(placeWord);

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.textContent = grid[i][j];
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('mousedown', () => {
                mouseIsDown = true;
                selectCell(cell);
            });
            cell.addEventListener('mouseup', () => {
                mouseIsDown = false;
                checkWord();
            });
            cell.addEventListener('mouseover', () => {
                if (mouseIsDown) {
                    selectCell(cell);
                }
            });
            container.appendChild(cell);
        }
    }

    const selectCell = (cell) => {
        if (!cell.classList.contains('selected')) {
            cell.classList.add('selected');
            selectedCells.push(cell);
            selectedWord = selectedCells.map(c => c.textContent).join('');
        }
    };

    const showPopup = (text) => {
        popup.textContent = text;
        popup.style.display = 'block';
        overlay.style.display = 'block';
        setTimeout(() => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }, 2000);
    };

    const checkWord = () => {
        if (words.includes(selectedWord)) {
            selectedCells.forEach(cell => cell.classList.add('correct'));
            showPopup(`¡Correcto! Has encontrado la palabra: ${selectedWord}`);
        } else {
            selectedCells.forEach(cell => cell.classList.remove('selected'));
        }
        selectedCells = [];
        selectedWord = '';
    };

    document.addEventListener('mouseup', () => {
        mouseIsDown = false;
        checkWord();
    });
});
