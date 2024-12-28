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

// Object resposible by manipulating the players.
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

// Object resposible by manipulating the game flow.
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

  function switchPlayer() {
    currentPlayer = currentPlayer == players[0] ? players[1] : players[0];
  }

  function playRound(row, col, marker) {
    if (Gameboard.isCellAvaiable(row, col)) {
      Gameboard.setBoardPiece(row, col, marker);

      if (getWinner(marker)) {
        console.log(`${marker} is the winner!`);
        Gameboard.resetBoard();
      }

      if (getDraw()) {
        console.log(`its a draw!`);
        Gameboard.resetBoard();
      };

      switchPlayer();
    }
  }

  return {
    getCurrentPlayer,
    switchPlayer,
    playRound,
    getWinner,
    getDraw,
  }
})();