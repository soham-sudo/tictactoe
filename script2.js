const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
let circleTurn;


const winMessageElement = document.getElementById('winMessage');
const messageOverlay = document.getElementById('messageOverlay');
const restartButton = document.getElementById('restartButton');


const startGame = () => {
    circleTurn = false;
    cells.forEach(cell => {
        cell.classList.remove('circle', 'x');
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
};

restartButton.addEventListener('click', () => {
    messageOverlay.style.display = 'none';
    startGame();
});

startGame();





function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? 'circle' : 'x';
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (circleTurn) {
            const bestMove = getBestMove();
            placeMark(cells[bestMove], 'circle');
            if (checkWin('circle')) {
                endGame(false);
            } else if (isDraw()) {
                endGame(true);
            } else {
                swapTurns();
            }
        }
    }
}

function endGame(draw) {
    if (draw) {
        winMessageElement.innerText = 'Draw!';
    } else {
        winMessageElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
    }
    messageOverlay.style.display = 'flex';
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('circle');
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function checkWin(currentClass) {
    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < cells.length; i++) {
        if (!cells[i].classList.contains('x') && !cells[i].classList.contains('circle')) {
            cells[i].classList.add('circle');
            let score = minimax(cells, false);
            cells[i].classList.remove('circle');
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (!board[i].classList.contains('x') && !board[i].classList.contains('circle')) {
                board[i].classList.add('circle');
                let score = minimax(board, false);
                board[i].classList.remove('circle');
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < cells.length; i++) {
            if (!board[i].classList.contains('x') && !board[i].classList.contains('circle')) {
                board[i].classList.add('x');
                let score = minimax(board, true);
                board[i].classList.remove('x');
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    let winner = null;

    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    WINNING_COMBINATIONS.forEach(combination => {
        if (combination.every(index => cells[index].classList.contains('circle'))) {
            winner = 'circle';
        } else if (combination.every(index => cells[index].classList.contains('x'))) {
            winner = 'x';
        }
    });

    if (winner === 'circle') {
        return 'circle';
    } else if (winner === 'x') {
        return 'x';
    } else if (isDraw()) {
        return 'draw';
    } else {
        return null;
    }
}

const scores = {
    'x': -10,
    'circle': 10,
    'draw': 0
};
