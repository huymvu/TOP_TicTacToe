function Gameboard() {
    const rows = 3;
    const columns = 3;
    const gameboard = [];

    for (let i = 0; i < rows; i++) {
        gameboard[i] = [];
        for (let j = 0; j < columns; j++) {
            gameboard[i].push(Cell())
        }
    }

    const getBoard = () => gameboard;

    const playerMark = (row, column, player) => {
        gameboard[row][column].addMark(player);
    }

    const printBoard = () => {
        const boardWithCellValues = gameboard.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    }

    return {
        getBoard,
        playerMark,
        printBoard
    }
}

function Cell() {
    let value = 0;

    const addMark = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {
        addMark,
        getValue
    };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const gameboard = Gameboard();
    const arrayBoard = gameboard.getBoard();
    const players = [
        {
            name: playerOneName,
            mark: "X"
        },
        {
            name: playerTwoName,
            mark: "O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        gameboard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const checkRow = () => {
        for (let row = 0; row < arrayBoard[0].length; row++) {
            if (arrayBoard[row].every((cell) => cell.getValue() === "X")) {
                return true;
            }
        }
        return false;
    }

    const checkColumn = () => {
        for (let column = 0; column < arrayBoard[0].length; column++) {
            let count = 0;
            for (let row = 0; row < arrayBoard[0].length; row++) {
                if (arrayBoard[row][column].getValue() === "X") {
                    count++;
                }
            }
            if (count === arrayBoard[0].length) {
                return true;
            }
        }
        return false;
    }

    const checkDiag = () => {
        const downwardDiagMark = [];
        const upwardDiagMark = [];
        for (let row = 0; row < arrayBoard[0].length; row++) {
            for (let column = 0; column < arrayBoard[0].length; column++) {
                if (row === column) {
                    downwardDiagMark.push(arrayBoard[row][column].getValue())
                }
            }
        }

        for (let row = 0; row < arrayBoard[0].length; row++) {
            for (let column = 0; column < arrayBoard[0].length; column++) {
                if (row + column === arrayBoard[0].length - 1) {
                    upwardDiagMark.push(arrayBoard[row][column].getValue())
                }
            }
        }

        if (downwardDiagMark.every((cell) => cell === "X") || upwardDiagMark.every((cell) => cell === "X")) {
            return true;
        } else {
            return false
        }
    }

    const checkWin = () => {
        if (checkRow() === true || checkColumn() === true || checkDiag() === true) {
            return true;
        }
    }

    const checkTie = () => {
        if (arrayBoard.every((row) => row.every((cell) => cell.getValue() !== 0))) {
            return true;
        }
    }

    const playRound = (row, column) => {
        console.log(`${getActivePlayer().name} is marking row ${row} , column ${column}`);

        if (gameboard.getBoard()[row][column].getValue() !== 0) {
            console.log("Cell is not empty, please choose another cell");
            console.log(`${getActivePlayer().name} please try again`);
            return;
        }
        gameboard.playerMark(row, column, getActivePlayer().mark);
        if (checkWin() === true) {
            console.log("Player 1 (X mark) Win!");
            return;
        } else if (checkTie() === true) {
            console.log("Tie Game!");
            return;
        } else {
            switchPlayerTurn();
            printNewRound();
        }
    }

    printNewRound();
    return {
        playRound,
        getActivePlayer
    }
}


const game = GameController();
// const displayController = (() => {
//     const renderMessage = (message) => {
//         document.querySelector("#message").innerHTML = message;
//     }
//     return {
//         renderMessage
//     }
// })();

// const Gameboard = (function () {
//     const gameboard = ["", "", "", "", "", "", "", "", ""];

//     const render = () => {
//         let boardHTML = ""
//         gameboard.forEach((square, index) => {
//             boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
//         });
//         document.getElementById("gameboard").innerHTML = boardHTML;
//         const squares = document.querySelectorAll(".square");
//         squares.forEach((square) => {
//             square.addEventListener("click", Game.handleClick);
//         })
//     }

//     const update = (index, value) => {
//         gameboard[index] = value;
//         render();
//     }

//     const getGameboard = () => gameboard;

//     return {
//         render,
//         update,
//         getGameboard
//     }
// })();

// const createPlayer = (name, mark) => {
//     return {
//         name,
//         mark
//     }
// }

// const Game = (function () {
//     let players = [];
//     let currentPlayerIndex;
//     let gameOver;

//     const start = () => {
//         players = [
//             createPlayer(document.getElementById("player1").value, "X"),
//             createPlayer(document.getElementById("player2").value, "O")
//         ]
//         currentPlayerIndex = 0;
//         gameOver = false;
//         Gameboard.render();
//     }
//     const squares = document.querySelectorAll(".square");
//     squares.forEach((square) => {
//         square.addEventListener("click", handleClick);
//     })

//     const handleClick = (event) => {
//         if (gameOver) {
//             return;
//         }
//         //console.log(event.target.id)
//         let index = parseInt(event.target.id.split("-")[1]);
//         if (Gameboard.getGameboard()[index] !== "")
//             return;

//         Gameboard.update(index, players[currentPlayerIndex].mark);

//         if (checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)) {
//             gameOver = true;
//             // alert(`${players[currentPlayerIndex].name} won!`)
//             displayController.renderMessage(`${players[currentPlayerIndex].name} wins`)
//         } else if (checkForTie(Gameboard.getGameboard())) {
//             gameOver = true;
//             displayController.renderMessage(`It's tie`);
//         }

//         currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
//     }

//     const restart = () => {
//         for (let i = 0; i < 9; i++) {
//             Gameboard.update(i, "");
//         }
//         Gameboard.render();
//         gameOver = false;
//         document.querySelector("#message").innerHTML = "";
//     }

//     return {
//         start,
//         restart,
//         handleClick
//     }
// })();
// function checkForWin(board) {
//     const winningCombinations = [
//         [0, 1, 2],
//         [3, 4, 5],
//         [6, 7, 8],
//         [0, 3, 6],
//         [1, 4, 7],
//         [2, 5, 8],
//         [0, 4, 8],
//         [2, 4, 6]
//     ]
//     for (let i = 0; i < winningCombinations.length; i++) {
//         const [a, b, c] = winningCombinations[i];
//         if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//             return true;
//         }
//     }
//     return false;
// }

// function checkForTie(board) {
//     return board.every(cell => cell !== "")
// }
// const restartButton = document.getElementById("restart-button");
// restartButton.addEventListener("click", () => {
//     Game.restart();
// })

// const startButton = document.getElementById("start-button");
// startButton.addEventListener("click", () => {
//     Game.start();
// })

