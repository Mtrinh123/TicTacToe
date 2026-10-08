const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

// pathLength="100" lets the CSS use the same dash length for both shapes
const MARKS = {
  X: '<svg viewBox="0 0 100 100"><line x1="10" y1="10" x2="90" y2="90" pathLength="100"/><line x1="90" y1="10" x2="10" y2="90" pathLength="100"/></svg>',
  O: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" pathLength="100" transform="rotate(-90 50 50)"/></svg>',
};

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
let board, turn, over;

function winner(b) {
  for (const line of LINES) {
    const [a, c, d] = line;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { player: b[a], line };
  }
  return b.every(Boolean) ? { player: 'draw' } : null;
}

function reset() {
  board = Array(9).fill(null);
  turn = 'X';
  over = false;
  statusEl.textContent = "X's turn";
  statusEl.className = '';
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.setAttribute('aria-label', `Square ${i + 1}`);
    cell.addEventListener('click', () => play(i, cell));
    boardEl.append(cell);
  }
}

function play(i, cell) {
  if (over || board[i]) return;
  board[i] = turn;
  cell.innerHTML = MARKS[turn];
  cell.disabled = true;
  cell.setAttribute('aria-label', `Square ${i + 1}: ${turn}`);

  const result = winner(board);
  if (result) {
    over = true;
    statusEl.textContent = result.player === 'draw' ? "It's a draw!" : `${result.player} wins!`;
    statusEl.className = 'done';
    result.line?.forEach(j => boardEl.children[j].classList.add('win'));
    return;
  }
  turn = turn === 'X' ? 'O' : 'X';
  statusEl.textContent = `${turn}'s turn`;
}

document.getElementById('restart').addEventListener('click', reset);
reset();
