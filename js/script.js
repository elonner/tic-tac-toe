//--------state variables
let board;
let turn;
let winner;
let totTurns;

//--------object/classes
class Cell {
    constructor(value, element) {
        this.value = value;
        this.element = element;
        this.element.classList.remove(...this.element.classList);
        this.element.classList.add('hoverable');
        this.imgURL;
    }
}


//--------cached elements
const messageEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');
const xIconEl = document.getElementById('xIcon');
const oIconEl = document.getElementById('oIcon');

//--------event listeners
document.getElementById('board').addEventListener('click', handleMove);
playAgainBtn.addEventListener('click', init);


//--------functions;
init(); 

// Initialize all state, then call render()
function init() {

    //create board of rows
    board = [
        [], //row 0
        [], //row 1
        []  //row 2
    ];

    //add 3 empty Cells per row and grab the corresponding HTML element for cell.imgURL
    board.forEach((row, rowIdx) => {
        for (let i = 0; i < 3; i++) {
            const cellId = `c${i}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            //remove any added classes
            cellEl.classList.remove(...cellEl.classList);
            //remove any unwanted children
            cellEl.innerHTML = '';
            row.push(new Cell(0, cellEl));
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
    //store useful data
    const clickedCell = board[e.target.id[3]][e.target.id[1]];
    //if not already taken with X/O change value of cell and update cell object
    if (clickedCell.value === 'X' || clickedCell.value === 'O') return;
    clickedCell.value = turn; //X or O
    //add icon images
    if (turn ===  'X') { 
        clickedCell.imgURL = 'https://i.imgur.com/gG6q8U7.png';
    } else {
        clickedCell.imgURL = 'https://i.imgur.com/wB9i5bI.png';
    }
    //switch turns
    turn === 'X' ? turn = 'O' : turn = 'X';
    totTurns++;
    //check for winner
    winner = getWinner();
    render();
}

//returns the value of the winner (X/O/T or null)
function getWinner() {
    //check rows
    for (let i = 0; i < 3; i++) {
        const row = new Set([board[i][0].value, board[i][1].value, board[i][2].value]);
        if (!row.has(0) && row.size === 1) {
            return board[i][0].value;
        }
    }
    //check columns
    for (let i = 0; i < 3; i++) {
        const col = new Set([board[0][i].value, board[1][i].value, board[2][i].value]);
        if (!col.has(0) && col.size === 1) {
            return board[0][i].value;
        }
    }
    //Check diagonals
    const diag1 = new Set([board[0][0].value, board[1][1].value, board[2][2].value]);
    if (!diag1.has(0) && diag1.size === 1) {
        return board[1][1].value;
    }
    const diag2 = new Set([board[0][2].value, board[1][1].value, board[2][0].value]);
    if (!diag2.has(0) && diag2.size === 1) {
        return board[1][1].value;
    }

    //tie
    if (totTurns === 9) {
        return 'T';
    }

    //no winner
    return null;
}

function render() {
    renderBoard();
    renderMessage();
    renderControls();
}

function renderBoard() {
    board.forEach(rowCells => {
        rowCells.forEach(cell => {
            if (cell.value !== 0 && cell.element.children.length === 0) {
                //replace hoverable class wth X/O 
                cell.element.classList.replace('hoverable', cell.value); 
                //add image to show for X/O icon
                const img = document.createElement('img');
                img.setAttribute('src', cell.imgURL);
                cell.element.appendChild(img);
            }
        });
    });
}

function renderMessage() {
    if (winner === 'T') {
        messageEl.innerText = "It's a Tie!";
    } else if (winner) {
        messageEl.innerHTML = `${winner} Wins!`;
    } else {
        messageEl.innerHTML = `Turn: <span id="turnGlow">${turn}</span>`;
    }
}

function renderControls() {
    //if the game is over make sure no cells are clickable or hoverable
    if (winner) {
        board.forEach(rowCells => {
            rowCells.forEach(cell => {
                if (cell.value === 0) {
                    cell.element.classList.remove('hoverable');
                }
            });
        });
        //make button visible
        playAgainBtn.style.visibility = 'visible';
        //hide turn indicator icons
        xIconEl.style.visibility = 'hidden';
        xIconEl.style.height = '15vmin';
        oIconEl.style.visibility = 'hidden';
        oIconEl.style.height = '15vmin';

    } else {
        //keep button hidden and show turn indicator icons 
        playAgainBtn.style.visibility = 'hidden';
        xIconEl.style.visibility = 'visible';
        oIconEl.style.visibility = 'visible';
 
        //ake the X/O icon whose turn it is larger and brighter
        if (turn === 'X') {
            xIconEl.style.height = '30vmin';
            xIconEl.style.margin = '-25vmin 0';
            oIconEl.style.height = '15vmin';
            oIconEl.style.margin = '-10vmin 0';
            oIconEl.style.opacity = '50%';
            xIconEl.style.opacity = '100%';
            xIconEl.classList.add('currTurn');
            xIconEl.classList.add('animate__animated', 'animate__pulse');
            oIconEl.classList.remove('currTurn');
        } else {
            oIconEl.style.height = '30vmin';
            oIconEl.style.margin = '-25vmin 0';
            xIconEl.style.height = '15vmin';
            xIconEl.style.margin = '-10vmin 0';
            xIconEl.style.opacity = '50%';
            oIconEl.style.opacity = '100%';
            oIconEl.classList.add('currTurn');
            xIconEl.classList.remove('currTurn');
        }
    }
}