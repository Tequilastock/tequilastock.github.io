/* ---------- sound toggle ---------- */
let audioCtx,
  on = !JSON.parse(localStorage.g2048Sound || 'true');
function ping(freq) {
  if (!on) return;
  audioCtx || (audioCtx = new (window.AudioContext || window.webkitAudioContext)());
  const o = audioCtx.createOscillator(),
    g = audioCtx.createGain();
  o.frequency.value = freq;
  o.connect(g).connect(audioCtx.destination);
  g.gain.setValueAtTime(0.25, audioCtx.currentTime);
  o.start();
  o.stop(audioCtx.currentTime + 0.1);
}
const sndBtn = document.getElementById('snd');
sndBtn.onclick = () => {
  on = !on;
  sndBtn.textContent = on ? '🔈' : '🔇';
  localStorage.g2048Sound = on;
};

/* ---------- game logic ---------- */
const cv = document.getElementById('cv'),
  ctx = cv.getContext('2d'),
  n = 4,
  size = cv.width / n;
const colors = {
  0: '#3c3a32',
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e'
};
let board,
  score,
  best = +(localStorage.g2048Best || 0),
  over = false;
const scoreEl = document.getElementById('score');
function updateScore() {
  scoreEl.textContent = `Score ${score} | Best ${best}`;
}
function empties() {
  const list = [];
  board.forEach((row, y) => row.forEach((v, x) => v === 0 && list.push([x, y])));
  return list;
}
function addTile() {
  const list = empties();
  if (!list.length) return;
  const [x, y] = list[(Math.random() * list.length) | 0];
  board[y][x] = Math.random() < 0.9 ? 2 : 4;
}
function reset() {
  board = Array.from({ length: n }, () => Array(n).fill(0));
  score = 0;
  over = false;
  addTile();
  addTile();
  updateScore();
  draw();
}
function slideRow(row) {
  const vals = row.filter((v) => v);
  for (let i = 0; i < vals.length - 1; i++) {
    if (vals[i] === vals[i + 1]) {
      vals[i] *= 2;
      score += vals[i];
      vals.splice(i + 1, 1);
      ping(440 + vals[i]);
    }
  }
  while (vals.length < n) vals.push(0);
  return vals;
}
function rotate(b) {
  const r = Array.from({ length: n }, () => Array(n).fill(0));
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) r[x][n - 1 - y] = b[y][x];
  return r;
}
function move(dir) {
  if (over) return;
  let b = board.map((r) => r.slice());
  let rotations = { left: 0, up: 1, right: 2, down: 3 }[dir];
  for (let i = 0; i < rotations; i++) b = rotate(b);
  const moved = b.map((row) => slideRow(row));
  let changed = JSON.stringify(moved) !== JSON.stringify(b);
  b = moved;
  for (let i = 0; i < (4 - rotations) % 4; i++) b = rotate(b);
  if (changed) {
    board = b;
    addTile();
    if (score > best) {
      best = score;
      localStorage.g2048Best = best;
    }
    updateScore();
    if (!empties().length && !movesLeft()) {
      over = true;
    }
  }
  draw();
}
function movesLeft() {
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const v = board[y][x];
      if ((x < n - 1 && v === board[y][x + 1]) || (y < n - 1 && v === board[y + 1][x])) return true;
    }
  return false;
}
function draw() {
  ctx.fillStyle = '#bbada0';
  ctx.fillRect(0, 0, cv.width, cv.height);
  board.forEach((row, y) =>
    row.forEach((v, x) => {
      ctx.fillStyle = colors[v] || '#3c3a32';
      ctx.fillRect(x * size + 4, y * size + 4, size - 8, size - 8);
      if (v) {
        ctx.fillStyle = v <= 4 ? '#776e65' : '#f9f6f2';
        ctx.font = `bold ${size / 3}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(v, x * size + size / 2, y * size + size / 2);
      }
    })
  );
  if (over) {
    ctx.fillStyle = '#000a';
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${size / 3}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game over', cv.width / 2, cv.height / 2);
  }
}

/* keyboard */
addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') move('up');
  if (e.key === 'ArrowDown') move('down');
  if (e.key === 'ArrowLeft') move('left');
  if (e.key === 'ArrowRight') move('right');
});

/* touch swipe */
let sx, sy;
cv.addEventListener(
  'touchstart',
  (e) => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  },
  { passive: true }
);
cv.addEventListener(
  'touchend',
  (e) => {
    const dx = e.changedTouches[0].clientX - sx,
      dy = e.changedTouches[0].clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
    else move(dy > 0 ? 'down' : 'up');
  },
  { passive: true }
);

/* buttons */
document.getElementById('reset').onclick = reset;
reset();
