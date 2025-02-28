// your code goes here
const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const statusText = document.getElementById('status');
const gameOverDiv = document.getElementById('gameOver');
const gameOverText = document.getElementById('gameOverText');
const restartButtons = document.querySelectorAll('.restart-btn');
let xTurn;

startGame();

restartButtons.forEach(button => {
    button.addEventListener('click', restartGame);
});

function startGame() {
    xTurn = true;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    board.style.pointerEvents = 'auto';
    gameOverDiv.classList.remove('show');
    setBoardHoverClass();
    updateStatus();
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = xTurn ? X_CLASS : O_CLASS;
    
    placeMark(cell, currentClass);
    
    if (checkWin(currentClass)) {
        endGame(false, currentClass);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        updateStatus();
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    xTurn = !xTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    board.classList.add(xTurn ? X_CLASS : O_CLASS);
}

function updateStatus() {
    statusText.textContent = `${xTurn ? "Player X's" : "Player O's"} Turn`;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function endGame(draw, winner) {
    board.style.pointerEvents = 'none';
    if (draw) {
        gameOverText.textContent = "Game Draw!";
    } else {
        gameOverText.textContent = `${winner.toUpperCase()} Wins!`;
        highlightWinningCombination(winner);
    }
    gameOverDiv.classList.add('show');
}

function highlightWinningCombination(winner) {
    const combination = WINNING_COMBINATIONS.find(comb =>
        comb.every(index => cellElements[index].classList.contains(winner))
    );
    
    if (combination) {
        combination.forEach(index => {
            cellElements[index].classList.add('winning-cell');
        });
    }
}

function restartGame() {
    cellElements.forEach(cell => cell.classList.remove('winning-cell'));
    startGame();
}
