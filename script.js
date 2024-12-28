// Object responsible for manipulating the game board.
const Gameboard = (function(){
  
  let board = [];

  function getBoard() {
    return board;
  }

  function isCellAvaiable(row, col) {
    return !board[row][col];
  }
  
  function setBoardPiece(row, col, marker) {
    if (isCellAvaiable(row, col)) {
      board[row][col] = marker;
    }
  }

  // Sets the board to it initial state.
  function resetBoard() {
    board.splice(0, board.length);

    for (let row = 0; row < 3; row++) {
      board.push([]);
      
      for (let col = 0; col < 3; col++) {
        board[row].push("");
      }
    }
  }

  return {
    getBoard,
    isCellAvaiable,
    setBoardPiece,
    resetBoard
  }

})();

// Object responsible by manipulating the players.
const PlayerManager = (function(){
  
  const players = [];

  function getPlayers() {
    return players;
  }

  function createPlayer(marker) {
    players.push({marker});
  }

  return {
    getPlayers,
    createPlayer
  }
})();

// Object responsible by manipulating the game flow.
const GameController = (function(){

  // Set board to it initial state.
  Gameboard.resetBoard();

  // Create the two players of the game;
  PlayerManager.createPlayer("x");
  PlayerManager.createPlayer("o");

  let players = PlayerManager.getPlayers();
  let currentPlayer = players[0];

  function getWinner(marker) {
    const board = Gameboard.getBoard();

    // Check if marker fills an row.
    for (let row = 0; row < board.length; row++) {
      if (board[row][0] == marker &&
          board[row][1] == marker &&
          board[row][2] == marker) {
            return true;
      }
    }

    // Check if marker fills an column. 
    for (let col = 0; col < board.length; col++) {
      if (board[0][col] == marker &&
          board[1][col] == marker &&
          board[2][col] == marker) {
            return true;
      }
    }

    // Check if marker fills an diagonal.
    if (board[0][0] == marker &&
        board[1][1] == marker &&
        board[2][2] == marker) {
          return true;
    }

    if (board[0][2] == marker &&
        board[1][1] == marker &&
        board[2][0] == marker) {
          return true;
    }

    return false;
  }

  function getDraw() {
    for (const row of Gameboard.getBoard()) {
      for (col of row) {
        if (!col) return false;
      }
    }

    return true;
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function getPreviousPlayer() {
    return currentPlayer == players[0] ? players[1] : players[0];
  }

  function switchPlayer() {
    currentPlayer = currentPlayer == players[0] ? players[1] : players[0];
  }

  function playRound(row, col, marker) {
    if (Gameboard.isCellAvaiable(row, col)) {
      Gameboard.setBoardPiece(row, col, marker);

      switchPlayer();
    }
  }

  return {
    getPreviousPlayer,
    getCurrentPlayer,
    switchPlayer,
    playRound,
    getWinner,
    getDraw,
  }
})();

// Object responsible by rendering dinamically and interacting with GameController.
const ScreenController = (function(){

  const boardElement = document.querySelector(".board");
  const restartBtn = document.querySelector(".restart");
  const statusTitle = document.querySelector(".title");

  let canInteract = true;

  // Reset cellsView to it initial state.
  function resetBoardCells() {
    const boardRows = Array.from(boardElement.childNodes);

    for (let row = 0; row < boardRows.length; row++) {
      const boardCols = Array.from(boardRows[row].childNodes);

      for (let col = 0; col < boardCols.length; col++) {
        const boardCol = boardCols[col];
              boardCol.removeAttribute("style");
              boardCol.classList.remove("x", "o");
      }
    }
  }

  // Insert rows and columns in boardElement based in Gameboard.
  function updateBoardView() {
    Gameboard.resetBoard();

    const board = Gameboard.getBoard();
    
    for (let row = 0; row < board.length; row++) {
      const rowElement = document.createElement("div");
            rowElement.classList.add("row");
            rowElement.setAttribute("data-row", row);

      for (let col = 0; col < board[row].length; col++) {
        const colElement = document.createElement("div")
              colElement.classList.add("col");
              colElement.setAttribute("data-col", col);

        rowElement.appendChild(colElement);
      }

      boardElement.appendChild(rowElement);
    }
  }

  // Add listener to play the game when clicks in a cell.
  function configureCells() {
    const boardRows = Array.from(boardElement.childNodes);

    for (let row = 0; row < boardRows.length; row++) {
      const boardCols = Array.from(boardRows[row].childNodes);

      for (let col = 0; col < boardCols.length; col++) {
        const boardCol = boardCols[col];

        boardCol.addEventListener("click", (e)=>{
          
          const rowIndex = e.target.parentElement.getAttribute("data-row");
          const colIndex = e.target.getAttribute("data-col");

          // Check if cell is avaiable and play a round with its avaiable.
          if (Gameboard.isCellAvaiable(row, col) && canInteract) {
            
            // Add a image marker based on player marker value.
            switch (GameController.getCurrentPlayer().marker) {
              case "x": boardCol.classList.add("x"); break;
              case "o": boardCol.classList.add("o"); break;
            }

            statusTitle.textContent = `${GameController.getPreviousPlayer().marker} round's`

            GameController.playRound(rowIndex, colIndex, GameController.getCurrentPlayer().marker);
          }

          // Check if game ends with a winner or a draw and block user interaction.
          if (GameController.getWinner(GameController.getPreviousPlayer().marker)) {
            statusTitle.textContent = `${GameController.getPreviousPlayer().marker} wins!`;
            canInteract = false;
          }
          else if (GameController.getDraw()) {
            statusTitle.textContent = `its a draw!`;
            canInteract = false;
          };
        });

      }
    }
  }

  // Restart the gameboard and boardView to initial state.
  restartBtn.addEventListener("click", ()=>{
    statusTitle.textContent = `Tic Tac Toe`

    Gameboard.resetBoard();
              resetBoardCells();

    canInteract = true;
  });

  updateBoardView();
  configureCells();
})();