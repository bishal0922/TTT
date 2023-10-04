const cells = document.querySelectorAll(".cell");
const board = Array(9).fill(null);
let currentPlayer = null; // Will be set once user picks an opponent

const turnInfo = document.getElementById("turnInfo");

const opponentSelector = document.getElementById("opponent");

let gameOver = false;

// reference to the Reset button
const resetButton = document.getElementById("resetButton");

// Function to reset the game
function resetGame() {
  currentPlayer = null;
  board.fill(null);
  cells.forEach((cell) => {
    cell.textContent = "";
    //new
    cell.classList.remove("winning-cell"); // remove the winning highlight
  });
  turnInfo.textContent = "Choose your opponent to start the game.";
  gameOver = false; // Reset the game state
  opponentSelector.value = "none";
}

resetButton.addEventListener("click", resetGame);

opponentSelector.addEventListener("change", function () {
  currentPlayer = "X"; // Reset to start with X
  board.fill(null); // Clear the board
  cells.forEach((cell) => (cell.textContent = "")); // Clear cell content
  if (opponentSelector.value === "ai") {
    turnInfo.textContent = "You are playing against Minimax AI. Your move!";
  } else {
    turnInfo.textContent = "You are playing against Random Joe. Your move!";
  }
});

function highlightWinningCells(winningCombo) {
  winningCombo.forEach((index) => {
    cells[index].classList.add("winning-cell");
  });
}

cells.forEach((cell) => {
  cell.addEventListener("click", function () {
    if (!currentPlayer || gameOver) return; // Don't proceed if no opponent is selected

    const index = cell.dataset.index;
    if (!board[index]) {
      board[index] = "X";
      cell.textContent = "X";

      // Check for a win after the player's move
      if (checkWin(board, "X")) {
        console.log("Player X (User) wins!");
        highlightWinningCells(getWinCombo(board, "X"))
        gameOver = true;

        setTimeout(function () {
          alert("You won, here's a cookie 🍪");
        }, 100);

        return; // Stop the game
      }

      if (opponentSelector.value === "ai") {
        const aiMove = minimax(board, "X").index;
        board[aiMove] = "O";
        cells[aiMove].textContent = "O";

        // Check for a win after the AI's move
        const winningCombo = getWinCombo(board, "O");

        if (winningCombo) {
          console.log(winningCombo);
          console.log("AI (Player O) wins!");
          //highlight the winning cells
          highlightWinningCells(winningCombo);
          gameOver = true;
          setTimeout(function () {
            alert("No way you lost to me😭, I'm coming for your job 😈");
          }, 100);

          return; // Stop the game
        }
        turnInfo.textContent = "Your move!";

      } else if (opponentSelector.value == "joe") {
        const joeMove = randomJoeMove(board);
        board[joeMove] = "O";
        cells[joeMove].textContent = "O";

        const winningCombo = getWinCombo(board, "O");
        if (winningCombo) {
          console.log(winningCombo);
          console.log("Random Joe (Player O) wins!");
          gameOver = true;

          setTimeout(function () {
            alert("Random Joe wins, Embarassing...");
          }, 100);
          return; // Stop the game
        }
        turnInfo.textContent = "Your move!";
      }
    }
  });
});

function randomJoeMove(board) {
  let availableMoves = [];
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) availableMoves.push(i);
  }
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function minimax(newBoard, player) {
  const availableMoves = getAvailableMoves(newBoard);

  if (checkWin(newBoard, "O")) {
    return { score: -10 };
  } else if (checkWin(newBoard, "X")) {
    return { score: 10 };
  } else if (availableMoves.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  for (let i = 0; i < availableMoves.length; i++) {
    const move = {};
    move.index = availableMoves[i];
    newBoard[availableMoves[i]] = player;

    if (player === "X") {
      const g = minimax(newBoard, "O");
      move.score = g.score;
    } else {
      const g = minimax(newBoard, "X");
      move.score = g.score;
    }

    newBoard[availableMoves[i]] = null;
    moves.push(move);
  }

  let bestMove;
  if (player === "X") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function getAvailableMoves(board) {
  const moves = [];
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) moves.push(i);
  }
  return moves;
}

function checkWin(board, player) {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < winningCombos.length; i++) {
    if (
      board[winningCombos[i][0]] === player &&
      board[winningCombos[i][1]] === player &&
      board[winningCombos[i][2]] === player
    ) {
      return true;
    }
  }
  return false;
}

function getWinCombo(board, player) {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < winningCombos.length; i++) {
    if (
      board[winningCombos[i][0]] === player &&
      board[winningCombos[i][1]] === player &&
      board[winningCombos[i][2]] === player
    ) {
      return winningCombos[i];
    }
  }
  return null;
}
