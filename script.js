// Object responsible for manipulating the game board
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
