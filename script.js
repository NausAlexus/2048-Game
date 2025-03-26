document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('grid');
    const scoreElement = document.getElementById('score');
    const bestScoreElement = document.getElementById('best-score');
    const restartButton = document.getElementById('restart');
    const gameOverElement = document.getElementById('game-over');

    let board = [];
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let gameOver = false;

    // Инициализация игры
    const initGame = () => {
        board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        score = 0;
        gameOver = false;
        gameOverElement.classList.add('hidden');
        spawnNumber();
        spawnNumber();
        updateScore();
        render();
    };

    // Создание новой плитки
    const spawnNumber = () => {
        const emptyCells = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (board[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }

        if (emptyCells.length > 0) {
            const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[row][col] = Math.random() < 0.9 ? 2 : 4;
            return true;
        }
        return false;
    };

    // Отрисовка игрового поля
    const render = () => {
        gridElement.innerHTML = '';
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (board[row][col] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${board[row][col]} tile-move`;
                    tile.textContent = board[row][col];
                    cell.appendChild(tile);
                }
                gridElement.appendChild(cell);
            }
        }
    };

    // Обновление счета
    const updateScore = () => {
        scoreElement.textContent = score;
        if (score > bestScore) {
            bestScore = score;
            bestScoreElement.textContent = bestScore;
            localStorage.setItem('bestScore', bestScore);
        }
    };

    // Движение вверх
    const moveUp = () => {
        if (gameOver) return false;
        
        let moved = false;
        const newBoard = JSON.parse(JSON.stringify(board));

        for (let col = 0; col < 4; col++) {
            // Собираем ненулевые элементы столбца
            let column = newBoard.map(row => row[col]).filter(val => val !== 0);
            
            // Объединяем одинаковые плитки
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    score += column[i];
                    column.splice(i + 1, 1);
                    moved = true;
                }
            }

            // Дополняем нулями
            while (column.length < 4) column.push(0);

            // Обновляем столбец
            for (let row = 0; row < 4; row++) {
                if (newBoard[row][col] !== column[row]) moved = true;
                newBoard[row][col] = column[row];
            }
        }

        if (moved) {
            board = newBoard;
            spawnNumber();
            updateScore();
            checkGameOver();
            render();
        }
        return moved;
    };

    // Движение вниз (аналогично другим направлениям)
    const moveDown = () => {
        if (gameOver) return false;
        
        let moved = false;
        const newBoard = JSON.parse(JSON.stringify(board));

        for (let col = 0; col < 4; col++) {
            let column = newBoard.map(row => row[col]).filter(val => val !== 0);
            
            // Объединяем с конца
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    score += column[i];
                    column.splice(i - 1, 1);
                    moved = true;
                    i--; // Пропускаем следующий элемент
                }
            }

            // Дополняем нулями в начале
            while (column.length < 4) column.unshift(0);

            // Обновляем столбец
            for (let row = 0; row < 4; row++) {
                if (newBoard[row][col] !== column[row]) moved = true;
                newBoard[row][col] = column[row];
            }
        }

        if (moved) {
            board = newBoard;
            spawnNumber();
            updateScore();
            checkGameOver();
            render();
        }
        return moved;
    };

    const moveLeft = () => {
        if (gameOver) return false;
        
        let moved = false;
        const newBoard = JSON.parse(JSON.stringify(board));
    
        for (let row = 0; row < 4; row++) {
            // Собираем ненулевые элементы строки
            let line = newBoard[row].filter(val => val !== 0);
            
            // Объединяем одинаковые плитки
            for (let i = 0; i < line.length - 1; i++) {
                if (line[i] === line[i + 1]) {
                    line[i] *= 2;
                    score += line[i];
                    line.splice(i + 1, 1);
                    moved = true;
                }
            }
    
            // Дополняем нулями в конце
            while (line.length < 4) line.push(0);
    
            // Обновляем строку
            for (let col = 0; col < 4; col++) {
                if (newBoard[row][col] !== line[col]) moved = true;
                newBoard[row][col] = line[col];
            }
        }
    
        if (moved) {
            board = newBoard;
            spawnNumber();
            updateScore();
            checkGameOver();
            render();
        }
        return moved;
    };
    
    // Движение вправо
    const moveRight = () => {
        if (gameOver) return false;
        
        let moved = false;
        const newBoard = JSON.parse(JSON.stringify(board));
    
        for (let row = 0; row < 4; row++) {
            // Собираем ненулевые элементы строки (справа налево)
            let line = newBoard[row].filter(val => val !== 0).reverse();
            
            // Объединяем одинаковые плитки
            for (let i = 0; i < line.length - 1; i++) {
                if (line[i] === line[i + 1]) {
                    line[i] *= 2;
                    score += line[i];
                    line.splice(i + 1, 1);
                    moved = true;
                }
            }
    
            // Дополняем нулями в начале (так как reversed)
            while (line.length < 4) line.push(0);
    
            // Разворачиваем обратно и обновляем строку
            line = line.reverse();
            for (let col = 0; col < 4; col++) {
                if (newBoard[row][3 - col] !== line[3 - col]) moved = true;
                newBoard[row][col] = line[col];
            }
        }
    
        if (moved) {
            board = newBoard;
            spawnNumber();
            updateScore();
            checkGameOver();
            render();
        }
        return moved;
    };

    // Проверка окончания игры
    const checkGameOver = () => {
        // Проверка пустых клеток
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (board[row][col] === 0) return false;
            }
        }

        // Проверка возможных слияний
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const val = board[row][col];
                if ((col < 3 && val === board[row][col + 1]) || 
                    (row < 3 && val === board[row + 1][col])) {
                    return false;
                }
            }
        }

        gameOver = true;
        gameOverElement.classList.remove('hidden');
        return true;
    };

    // Обработчики событий
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        
        switch (e.key) {
            case 'ArrowUp': 
                moved = moveUp();
                break;
            case 'ArrowDown':
                moved = moveDown();
                break;
            case 'ArrowLeft':
                moved = moveLeft();
                break;
            case 'ArrowRight':
                moved = moveRight();
                break;
            default:
                return; // Игнорируем другие клавиши
        }
    });

    restartButton.addEventListener('click', initGame);

    // Инициализация игры
    initGame();
});



const moveLeft = () => {
    if (gameOver) return false;
    
    let moved = false;
    const newBoard = JSON.parse(JSON.stringify(board));
    const oldBoard = JSON.parse(JSON.stringify(board)); // Сохраняем старое состояние

    for (let row = 0; row < 4; row++) {
        let line = newBoard[row].filter(val => val !== 0);
        
        for (let i = 0; i < line.length - 1; i++) {
            if (line[i] === line[i + 1]) {
                line[i] *= 2;
                score += line[i];
                line.splice(i + 1, 1);
                moved = true;
            }
        }

        while (line.length < 4) line.push(0);
        
        for (let col = 0; col < 4; col++) {
            if (newBoard[row][col] !== line[col]) moved = true;
            newBoard[row][col] = line[col];
        }
    }

    if (moved) {
        // Добавляем анимацию перемещения
        animateTiles(oldBoard, newBoard, 'left');
        
        board = newBoard;
        setTimeout(() => {
            spawnNumber();
            updateScore();
            checkGameOver();
            render();
        }, 150); // Задержка для завершения анимации
    }
    return moved;
};

// Новая функция для анимации перемещения
const animateTiles = (oldBoard, newBoard, direction) => {
    // Временно отключаем стандартный рендеринг
    const tempRender = render;
    render = () => {};
    
    // Создаем карту старых позиций
    const oldPositions = {};
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const val = oldBoard[row][col];
            if (val !== 0) {
                if (!oldPositions[val]) oldPositions[val] = [];
                oldPositions[val].push({row, col});
            }
        }
    }
    
    // Создаем карту новых позиций
    const newPositions = {};
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const val = newBoard[row][col];
            if (val !== 0) {
                if (!newPositions[val]) newPositions[val] = [];
                newPositions[val].push({row, col});
            }
        }
    }
    
    // Восстанавливаем стандартный рендеринг
    render = tempRender;
};