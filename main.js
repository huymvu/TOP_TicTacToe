// Function to handle the game initialization and start button click event
(function gameIntro() {
    // Get DOM elements
    const startButton = document.querySelector('.start-button');
    const introPage = document.querySelector('.intro-page');
    const gameboardContainer = document.querySelector('.gameboard-container')
    const playerOneNameInput = document.getElementById('player-one-name');
    const playerTwoNameInput = document.getElementById('player-two-name');

    // Event listener for the start button click
    startButton.addEventListener('click', function () {
        // Get player names from input fields
        const playerOneName = playerOneNameInput.value.trim();
        const playerTwoName = playerTwoNameInput.value.trim();

        // Hide intro page and display game board
        introPage.style.display = 'none';
        gameboardContainer.style.display = '';

        // Change player names in the game
        game.changePlayersName(playerOneName, playerTwoName);
        // Display current player turn 
        display.announce(`${game.getActivePlayer().name}'s turn...`);
    })
})();

// Function to create the game board
function Gameboard() {
    const rows = 3;
    const columns = 3;
    const gameboard = [];

    // Create the board matrix
    for (let i = 0; i < rows; i++) {
        gameboard[i] = [];
        for (let j = 0; j < columns; j++) {
            gameboard[i].push(Cell())
        }
    }

    // Get the game board
    const getBoard = () => gameboard;
    // Function to mark a cell with a player's mark

    const playerMark = (row, column, player) => {
        gameboard[row][column].addMark(player);
    }

    // Function to reset the game board
    const resetBoard = () => {
        gameboard.map((row) => row.map((cell) => cell.resetValue()));
    }
    return {
        getBoard,
        playerMark,
        resetBoard
    }
}

// Function to create a cell in the game board
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

// Function to control the game logic
function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    // Players information
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

    // Active player
    let activePlayer = players[0];

    // Function to change player names
    const changePlayersName = (playerOne, playerTwo) => {
        if (playerOne == "" || playerTwo == "") {
            players[0].name = "Player One";
            players[1].name = "Player Two";
        } else {
            players[0].name = playerOne;
            players[1].name = playerTwo;
        }

    };

    // Variable to track game end
    let gameEnded = false;

    // Function to switch player turn
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Function to get active player
    const getActivePlayer = () => activePlayer;

    // Function to check for winning row
    const checkRow = () => {
        for (let row = 0; row < gameboard.getBoard()[0].length; row++) {
            if (gameboard.getBoard()[row].every((cell) => cell.getValue() === getActivePlayer().mark)) {
                return true;
            }
        }
        return false;
    }

    // Function to check for winning column
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

    // Function to check for winning diagonal
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

    // Function to check for win
    const checkWin = () => {
        if (checkRow() === true || checkColumn() === true || checkDiag() === true) {
            return true;
        }
    }

    // Function to check for tie
    const checkTie = () => {
        if (gameboard.getBoard().every((row) => row.every((cell) => cell.getValue() !== ""))) {
            return true;
        }
    }

    // Function to end the game y switching the tracking variable
    const gameEnd = () => {
        gameEnded = true;
    }

    // Function to start the game by switching the tracking variable
    const gameStart = () => {
        gameEnded = false;
    }

    // Function to play a round
    const playRound = (row, column) => {
        if (gameEnded) {
            return;
        };

        if (gameboard.getBoard()[row][column].getValue() !== "") {
            display.announce("Cell is not empty, please choose another cell");
            display.announce(`${getActivePlayer().name} please try again`);
            return;
        }
        gameboard.playerMark(row, column, getActivePlayer().mark);
        if (checkWin() === true) {
            display.announce(`${activePlayer.name} Win!`);
            gameEnd();
            return;
        } else if (checkTie() === true) {
            display.announce(`Tie Game!`);
            gameEnd();
            return;
        } else {
            switchPlayerTurn();
        }
        display.announce(`${getActivePlayer().name}'s turn...`);
    }

    // Function to reset the game board
    const resetBoard = () => {
        gameboard.resetBoard();
    }

    // Return an object with the announce function to allow external access
    return {
        playRound,
        getActivePlayer,
        changePlayersName,
        resetBoard,
        checkWin,
        checkTie,
        gameStart
    };
}

// Function to control the screen interactions during the game
function ScreenController() {
    // Get the game board, gameboard div, announce div, and restart button
    const board = gameboard.getBoard();
    const gameboardDiv = document.querySelector(".gameboard");
    const announceDiv = document.querySelector(".announce");
    const restartButton = document.querySelector(".restart-button");

    // Function to update the screen based on the current state of the game board
    const updateScreen = () => {
        // Clear the gameboardDiv before updating
        gameboardDiv.textContent = "";

        // Iterate through the board and create buttons to represent each cell
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
    }

    // Event listener for clicks on the game board
    const clickHandlerBoard = (e) => {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        // Call playRound function when a cell is clicked
        game.playRound(selectedRow, selectedColumn);
        // Update the screen after each move
        updateScreen();
    }
    // Add event listener to the game board for clicks
    gameboardDiv.addEventListener("click", clickHandlerBoard);

    // Function to reset the game when the restart button is clicked
    const resetGame = () => {
        // Clear the contents of all cells
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => cell.textContent = "");
        // Reset the game board
        game.resetBoard();
        game.gameStart();
    }

    // Add event listener to the restart button
    restartButton.addEventListener("click", resetGame);

    // Function to display messages in the announce div
    function announce(message) {
        announceDiv.textContent = message;
    }

    // Initial update of the screen
    updateScreen();

    // Return an object with the announce function to allow external access
    return {
        announce,
    }
};

// Initialize the game board
const gameboard = Gameboard();
// Initialize the screen controller and get the announce function
const display = ScreenController();
// Initialize the game controller
const game = GameController();
