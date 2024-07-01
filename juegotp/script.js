document.addEventListener('DOMContentLoaded', () => {
    const words = ['CASCO', 'ALCOHOLEMIA', 'SEMAFORO', 'SEÑAL', 'VELOCIDAD', 'CINTURON', 'CICLOVIA'];
    const gridSize = 15;
    const grid = [];
    const container = document.getElementById('word-search-container');
    const message = document.getElementById('message');
    const wordsList = document.getElementById('words-list');
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    const timerElement = document.getElementById('timer');
    const startButton = document.getElementById('start-button');
    const intro = document.getElementById('intro');
    const game = document.getElementById('game');
    let selectedCells = [];
    let selectedWord = '';
    let mouseIsDown = false;
    let foundWords = 0;
    let timer;
    let elapsedTime = 0;

    // Rellena la lista de palabras
    words.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        listItem.dataset.word = word;
        wordsList.appendChild(listItem);
    });

    // Inicializa la cuadrícula
    for (let i = 0; i < gridSize; i++) {
        grid[i] = new Array(gridSize).fill('');
    }

    // Coloca una palabra en la cuadrícula
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

    // Coloca todas las palabras en la cuadrícula
    words.forEach(placeWord);

    // Rellena los espacios vacíos con letras aleatorias
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    // Crea la cuadrícula en el DOM
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
            cell.addEventListener('touchstart', (event) => {
                event.preventDefault();
                mouseIsDown = true;
                selectCell(cell);
            });
            cell.addEventListener('touchmove', (event) => {
                event.preventDefault();
                const touch = event.touches[0];
                const target = document.elementFromPoint(touch.clientX, touch.clientY);
                if (target && target.dataset.row && target.dataset.col) {
                    selectCell(target);
                }
            });
            cell.addEventListener('touchend', () => {
                mouseIsDown = false;
                checkWord();
            });
            container.appendChild(cell);
        }
    }

    // Selecciona una celda
    const selectCell = (cell) => {
        if (!cell.classList.contains('selected')) {
            cell.classList.add('selected');
            selectedCells.push(cell);
            selectedWord = selectedCells.map(c => c.textContent).join('');
        }
    };

    // Muestra un pop-up
    const showPopup = (text) => {
        popup.textContent = text;
        popup.style.display = 'block';
        overlay.style.display = 'block';
        setTimeout(() => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }, 2000);
    };

    // Verifica si la palabra es correcta
    const checkWord = () => {
        const wordIndex = words.indexOf(selectedWord);
        if (wordIndex !== -1) {
            selectedCells.forEach(cell => cell.classList.add('correct'));
            const listItem = document.querySelector(`[data-word="${selectedWord}"]`);
            listItem.style.textDecoration = 'line-through';
            foundWords++;
            if (foundWords === words.length) {
                clearInterval(timer);
                showPopup(`¡Felicidades! Encontraste todas las palabras en ${formatTime(elapsedTime)}.`);
            } else {
                showPopup(`¡Correcto! Has encontrado la palabra: ${selectedWord}`);
            }
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

    document.addEventListener('touchend', () => {
        mouseIsDown = false;
        checkWord();
    });

    // Cronómetro
    const startTimer = () => {
        timer = setInterval(() => {
            elapsedTime++;
            timerElement.textContent = formatTime(elapsedTime);
        }, 1000);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    startTimer();

    // Botón de inicio
    startButton.addEventListener('click', () => {
        intro.style.display = 'none';
        game.style.display = 'block';
        
    });
});