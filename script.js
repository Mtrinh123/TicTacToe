const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

const MARKS = {
  X: '<svg viewBox="0 0 100 100"><line x1="10" y1="10" x2="90" y2="90" pathLength="100"/><line x1="90" y1="10" x2="10" y2="90" pathLength="100"/></svg>',
  O: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" pathLength="100" transform="rotate(-90 50 50)"/></svg>',
};

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const historyEl = document.getElementById('history');
const modeEl = document.getElementById('mode');
let board, turn, over, aiTimer, score;

const vsComputer = () => modeEl.value !== 'human';
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// Each opponent keeps its own score. 2-player uses the original 'score' key so old scores carry over.
// localStorage can throw (private mode, blocked storage), so the score falls back to memory only
const scoreKey = () => modeEl.value === 'human' ? 'score' : `score-${modeEl.value}`;

function loadScore() {
  score = null;
  try { score = JSON.parse(localStorage.getItem(scoreKey())); } catch {}
  score ||= { X: 0, O: 0, draw: 0 };
  saveScore();
}

function saveScore() {
  try { localStorage.setItem(scoreKey(), JSON.stringify(score)); } catch {}
  for (const key in score) document.getElementById(`score-${key}`).textContent = score[key];
}

function winner(b) {
  for (const line of LINES) {
    const [a, c, d] = line;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { player: b[a], line };
  }
  return b.every(Boolean) ? { player: 'draw' } : null;
}


function minimax(b, player, depth = 0) {
  const r = winner(b);
  if (r) return { value: r.player === 'draw' ? 0 : r.player === 'O' ? 10 - depth : depth - 10 };
  let best = null;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = player;
    const { value } = minimax(b, player === 'O' ? 'X' : 'O', depth + 1);
    b[i] = null;
    if (!best || (player === 'O' ? value > best.value : value < best.value)) best = { value, index: i };
  }
  return best;
}
function bestMoves(b) {
  const scored = b.flatMap((v, i) => {
    if (v) return [];
    b[i] = 'O';
    const { value } = minimax(b, 'X', 1);
    b[i] = null;
    return [{ i, value }];
  });
  const top = Math.max(...scored.map(m => m.value));
  return scored.filter(m => m.value === top).map(m => m.i);
}

function computerMove() {
  const i = modeEl.value === 'easy'
    ? pick(board.flatMap((v, i) => v ? [] : [i]))
    : pick(bestMoves(board));
  play(i, boardEl.children[i]);
}

function setTurn(player) {
  turn = player;
  statusEl.textContent = `${turn}'s turn`;
  statusEl.className = '';
}

function reset() {
  clearTimeout(aiTimer);
  board = Array(9).fill(null);
  over = false;
  setTurn('X');
  historyEl.innerHTML = '';
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.setAttribute('aria-label', `Square ${i + 1}`);
    cell.addEventListener('click', () => {
      if (vsComputer() && turn === 'O') return; // computer's turn
      play(i, cell);
    });
    boardEl.append(cell);
  }
}

function play(i, cell) {
  if (over || board[i]) return;
  board[i] = turn;
  cell.innerHTML = MARKS[turn];
  cell.disabled = true;
  cell.setAttribute('aria-label', `Square ${i + 1}: ${turn}`);

  const li = document.createElement('li');
  li.textContent = `${turn}: row ${Math.floor(i / 3) + 1}, col ${i % 3 + 1}`;
  historyEl.append(li);

  const result = winner(board);
  if (result) {
    over = true;
    score[result.player]++;
    saveScore();
    statusEl.textContent = result.player === 'draw' ? "It's a draw!" : `${result.player} wins!`;
    statusEl.className = 'done';
    result.line?.forEach(j => boardEl.children[j].classList.add('win'));
    return;
  }
  setTurn(turn === 'X' ? 'O' : 'X');
  if (vsComputer() && turn === 'O') {
    statusEl.textContent = 'Computer is thinking';
    aiTimer = setTimeout(computerMove, 400);
  }
}

document.getElementById('restart').addEventListener('click', reset);
modeEl.addEventListener('change', () => {
  loadScore();
  reset();
});
document.getElementById('reset-score').addEventListener('click', () => {
  score = { X: 0, O: 0, draw: 0 };
  saveScore();
});
loadScore();
reset();
