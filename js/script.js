//--------constants
const DISPLAY = {
    'X': ['X', 'https://i.imgur.com/gG6q8U7.png'],
    'O': ['O', 'https://i.imgur.com/wB9i5bI.png'],
}

//--------state variables
let board;
let turn;
let winner;
let totTurns;


//--------cached elements
const messageEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');
const tileEls = document.querySelectorAll('#board > div');

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

    tileEls.forEach(tile => {
        if (tile.firstChild) {
            tile.removeChild(tile.firstChild);
            tile.classList.remove('full');
        }
    });
    turn = 'X';
    totTurns = 0;
    winner = null;
    render();
}

function handleMove(e) {
    //ensure click is on correct element
    if (e.target.tagName.toLowerCase() !== 'div' || winner) return;
    //update board
    const rowIdx = e.target.id[3];
    const colIdx = e.target.id[1];
    //change value of square
    if (board[rowIdx][colIdx] === 'X' || board[rowIdx][colIdx] === 'O') return;
    board[rowIdx][colIdx] = turn;
    totTurns++;
    //remove hover functionality

    //switch turns
    turn === 'X' ? turn = 'O' : turn = 'X';
    //check for winner
    winner = getWinner();
    render();
}

function getWinner() {
    //check rows
    for (let row of board) {
        if (new Set(row).size === 1) return row[0];
    }
    //check columns
    for (let i = 0; i < 3; i++) {
        const col = new Set([board[0][i], board[1][i], board[2][i]]);
        if (col.size === 1) {
            return board[0][i];
        }
    }
    //Check diagonals
    const diag1 = new Set([board[0][0], board[1][1], board[2][2]]);
    if (diag1.size === 1) {
        return board[1][1];
    }
    const diag2 = new Set([board[0][2], board[1][1], board[2][0]]);
    if (diag2.size === 1) {
        return board[1][1];
    }

    //tie
    if (totTurns === 9) {
        return 'T';
    }

    return null;
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
            // cellEl.textContent = DISPLAY[cellVal];

            if (cellVal !== 0 && cellEl.children.length === 0) {
                cellEl.classList.add('full');
                const img = document.createElement('img');
                img.classList.add('.slide-in-fwd-bl');
                img.setAttribute('src', DISPLAY[cellVal][1]);
                cellEl.appendChild(img);
                img.style.height = '15vmin';
            }
        });
    });
}

function renderMessage() {
    if (winner === 'T') {
        messageEl.innerText = "It's a Tie!";
    } else if (winner) {
        messageEl.innerHTML = `${DISPLAY[winner][0]} Wins!`;
    } else {
        messageEl.innerHTML = `${DISPLAY[turn][0]}'s Turn`;
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