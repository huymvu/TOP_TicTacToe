(function gameIntro() {
    const startButton = document.querySelector('.start-button');
    const introPage = document.querySelector('.intro-page');
    const gameboardContainer = document.querySelector('.gameboard-container')
    const playerOneNameInput = document.getElementById('player-one-name');
    const playerTwoNameInput = document.getElementById('player-two-name');

    startButton.addEventListener('click', function () {
        const playerOneName = playerOneNameInput.value.trim();
        const playerTwoName = playerTwoNameInput.value.trim();
        console.log(playerOneName);

        introPage.style.display = 'none';

        // Display game board
        gameboardContainer.style.display = '';

        game.changePlayersName(playerOneName, playerTwoName);
        displayBoard.announce(`${game.getActivePlayer().name}'s turn.`);
    })

})();

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

    const resetBoard = () => {
        gameboard.map((row) => row.map((cell) => cell.resetValue()));
    }
    return {
        getBoard,
        playerMark,
        resetBoard
    }
}


function Cell() {
    let value = "";

    const addMark = (player) => {
        value = player;
    }

    const getValue = () => value;

    const resetValue = () => {
        value = "";
    };

    return {
        addMark,
        getValue,
        resetValue
    };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const gameboard = Gameboard();
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

    const changePlayersName = (playerOne, playerTwo) => {
        if (playerOne == "" || playerTwo == "") {
            players[0].name = "Player One";
            players[1].name = "Player Two";
        } else {
            players[0].name = playerOne;
            players[1].name = playerTwo;
        }

    };

    let gameEnded = false;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const checkRow = () => {
        for (let row = 0; row < gameboard.getBoard()[0].length; row++) {
            if (gameboard.getBoard()[row].every((cell) => cell.getValue() === getActivePlayer().mark)) {
                return true;
            }
        }
        return false;
    }

    const checkColumn = () => {
        for (let column = 0; column < gameboard.getBoard()[0].length; column++) {
            let count = 0;
            for (let row = 0; row < gameboard.getBoard()[0].length; row++) {
                if (gameboard.getBoard()[row][column].getValue() === getActivePlayer().mark) {
                    count++;
                }
            }
            if (count === gameboard.getBoard()[0].length) {
                return true;
            }
        }
        return false;
    }

    const checkDiag = () => {
        const downwardDiagMark = [];
        const upwardDiagMark = [];
        for (let row = 0; row < gameboard.getBoard()[0].length; row++) {
            for (let column = 0; column < gameboard.getBoard()[0].length; column++) {
                if (row === column) {
                    downwardDiagMark.push(gameboard.getBoard()[row][column].getValue())
                }
            }
        }

        for (let row = 0; row < gameboard.getBoard()[0].length; row++) {
            for (let column = 0; column < gameboard.getBoard()[0].length; column++) {
                if (row + column === gameboard.getBoard()[0].length - 1) {
                    upwardDiagMark.push(gameboard.getBoard()[row][column].getValue())
                }
            }
        }

        if (downwardDiagMark.every((cell) => cell === getActivePlayer().mark) || upwardDiagMark.every((cell) => cell === getActivePlayer().mark)) {
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
        if (gameboard.getBoard().every((row) => row.every((cell) => cell.getValue() !== ""))) {
            return true;
        }
    }
    const gameEnd = () => {
        gameEnded = true;
    }
    const gameStart = () => {
        gameEnded = false;
    }

    const playRound = (row, column) => {
        if (gameEnded) {
            return;
        };

        if (gameboard.getBoard()[row][column].getValue() !== "") {
            console.log("Cell is not empty, please choose another cell");
            console.log(`${getActivePlayer().name} please try again`);
            return;
        }
        gameboard.playerMark(row, column, getActivePlayer().mark);
        if (checkWin() === true) {
            console.log(`${getActivePlayer().name} win!`);
            gameEnd();
            return;
        } else if (checkTie() === true) {
            console.log("Tie Game!");
            gameEnd();
            return;
        } else {
            switchPlayerTurn();

        }
    }

    const resetBoard = () => {
        gameboard.resetBoard();
    }
    return {
        playRound,
        getActivePlayer,
        changePlayersName,
        getBoard: gameboard.getBoard(),
        resetBoard,
        checkWin,
        checkTie,
        gameStart
    };
}

(function ScreenController() {
    const game = GameController();
    const board = game.getBoard;
    const gameboardDiv = document.querySelector(".gameboard");
    const announceDiv = document.querySelector(".announce");
    const restartButton = document.querySelector(".restart-button");

    const updateScreen = () => {
        gameboardDiv.textContent = "";

        const activePlayer = game.getActivePlayer();
        announceDiv.textContent = `${activePlayer.name}'s turn...`

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue();
                gameboardDiv.appendChild(cellButton);
            })
        })

        if (game.checkWin() === true) {
            announceDiv.textContent = `${activePlayer.name} Win!`;
        } else if (game.checkTie() === true) {
            announceDiv.textContent = `Tie Game!`;
        }
    }

    const clickHandlerBoard = (e) => {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    gameboardDiv.addEventListener("click", clickHandlerBoard);

    const resetGame = () => {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => cell.textContent = "");
        game.resetBoard();
        game.gameStart();
    }
    restartButton.addEventListener("click", resetGame);

    updateScreen();
})();

