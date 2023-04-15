//--------constants
const DISPLAY = {
    'X': 'X',
    'O': 'O',
    '0': ''
}

//--------state variables
let board;
let turn;
let winner;


//--------cached elements
const messageEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');

//--------event listeners
document.getElementById('board').addEventListener('click', handleMove);
playAgainBtn.addEventListener('click', init);


//--------functions
init();

// Initialize all state, then call render()
function init() {

    board = [
        [0, 0, 0], //row 0
        [0, 0, 0], //row 1
        [0, 0, 0]  //row 2
    ];
    turn = 'X';
    winner = null;
    render();
}

function handleMove(e) {
    //ensure click is on correct element
    if (e.target.tagName.toLowerCase() !== 'div') return;
    //update board
    const rowIdx = e.target.id[3];
    const colIdx = e.target.id[1]
    board[rowIdx][colIdx] = turn;
    //switch turns
    turn === 'X' ? turn = 'O' : turn = 'X';
    //check for winner
    winner = getWinner(rowIdx, colIdx);
    render();
}

function getWinner(rowIdx, colIdx) {
    
}

function render() {
    renderBoard();
    renderMessage();
    //hide/show UI elements (controls)
    renderControls();
}

function renderBoard() {
    board.forEach((rowArr, rowIdx) => {
        rowArr.forEach((cellVal, colIdx) => {
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.textContent = DISPLAY[cellVal];
        });
    });
}

function renderMessage() {
    if (winner === 'T') {
        messageEl.innerText = "It's a Tie!";
    } else if (winner) {
        messageEl.innerHTML = `${DISPLAY[winner]} Wins!`;
    } else {
        messageEl.innerHTML = `${DISPLAY[turn]}'s Turn`;
    }
}

function renderControls() {
    if (winner) {
        playAgainBtn.style.visibility = 'visible';
        [...document.getElementsByTagName('p')].forEach(par => {
            par.style.visibility = 'hidden';
        });
        [...document.querySelectorAll('.tile')].forEach(tile => {
            tile.classList.remove('tile');
        });
    } else {
        playAgainBtn.style.visibility = 'hidden';
        [...document.getElementsByTagName('p')].forEach(par => {
            par.style.visibility = 'visible';
        });
        [...document.querySelectorAll('#board > div')].forEach(tile => {
            tile.classList.add('tile');
        });
    }
}