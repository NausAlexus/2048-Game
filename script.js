const gridElement = document.getElementById('grid');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart');
let board = [];
let score = 0;

const createBoard = () => {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    spawnNumber();
    spawnNumber();
    render();
};

const spawnNumber = () => {
    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) emptyCells.push({ row, col });
        }
    }
    if (emptyCells.length > 0) {
        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
};

const render = () => {
    gridElement.innerHTML = '';
    board.forEach(row => {
        row.forEach(cell => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.textContent = cell !== 0 ? cell : '';
            cellElement.style.backgroundColor = getCellColor(cell);
            gridElement.appendChild(cellElement);
        });
    });
    scoreElement.textContent = score;
};

const getCellColor = (value) => {
    switch (value) {
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f67c5f';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#cdc1b4';
    }
};

const handleKeyPress = (event) => {
    switch (event.key) {
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
    }
};

const moveUp = () => {
    for (let col = 0; col < 4; col++) {
        let arr = [];
        for (let row = 0; row < 4; row++) {
            if (board[row][col] !== 0) arr.push(board[row][col]);
        }
        let merged = merge(arr);
        for (let row = 0; row < 4; row++) {
            board[row][col] = merged[row] || 0;
        }
    }
    spawnNumber();
    render();
};

const moveDown = () => {
    for (let col = 0; col < 4; col++) {
        let arr = [];
        for (let row = 3; row >= 0; row--) {
            if (board[row][col] !== 0) arr.push(board[row][col]);
        }
        let merged = merge(arr);
        for (let row = 0; row < 4; row++) {
            board[3 - row][col] = merged[row] || 0;
        }
    }
    spawnNumber();
    render();
};

const moveLeft = () => {
    for (let row = 0; row < 4; row++) {
        let arr = [];
        for (let col = 0; col < 4; col++) {
            if (board[row][col] !== 0) arr.push(board[row][col]);
        }
        let merged = merge(arr);
        for (let col = 0; col < 4; col++) {
            board[row][col] = merged[col] || 0;
        }
    }
    spawnNumber();
    render();
};

const moveRight = () => {
    for (let row = 0; row < 4; row++) {
        let arr = [];
        for (let col = 3; col >= 0; col--) {
            if (board[row][col] !== 0) arr.push(board[row][col]);
        }
        let merged = merge(arr);
        for (let col = 0; col < 4; col++) {
            board[row][3 - col] = merged[col] || 0;
        }
    }
    spawnNumber();
    render();
};

const merge = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === arr[i + 1]) {
            newArr.push(arr[i] * 2);
            score += arr[i] * 2;
            i++;
        } else {
            newArr.push(arr[i]);
        }
    }
    return newArr;
};

restartButton.addEventListener('click', createBoard);
document.addEventListener('keydown', handleKeyPress);

// Добавляем обработку свайпов
let startX, startY, endX, endY;

const handleTouchStart = (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
};

const handleTouchEnd = (event) => {
    endX = event.changedTouches[0].clientX;
    endY = event.changedTouches[0].clientY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            moveRight();
        } else {
            moveLeft();
        }
    } else {
        if (deltaY > 0) {
            moveDown();
        } else {
            moveUp();
        }
    }
};

gridElement.addEventListener('touchstart', handleTouchStart);
gridElement.addEventListener('touchend', handleTouchEnd);

createBoard();