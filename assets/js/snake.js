/* ---------- sound toggle ---------- */
let audioCtx,
  on = !JSON.parse(localStorage.snakeSound || 'true');
function ping() {
  if (!on) return;
  audioCtx || (audioCtx = new (window.AudioContext || window.webkitAudioContext)());
  const o = audioCtx.createOscillator(),
    g = audioCtx.createGain();
  o.frequency.value = 660;
  o.connect(g).connect(audioCtx.destination);
  g.gain.setValueAtTime(0.3, audioCtx.currentTime);
  o.start();
  o.stop(audioCtx.currentTime + 0.12);
}
const sndBtn = document.getElementById('snd');
sndBtn.onclick = () => {
  on = !on;
  sndBtn.textContent = on ? '🔈' : '🔇';
  localStorage.snakeSound = on;
};

/* ---------- game logic ---------- */
const cv = document.getElementById('cv'),
  ctx = cv.getContext('2d'),
  size = 20,
  cells = cv.width / size;
let snake,
  dir,
  food,
  score,
  playing,
  paused = false,
  high = +(localStorage.snakeHigh || 0);
const scoreEl = document.getElementById('score');
function rnd() {
  return Math.floor(Math.random() * cells);
}
function placeFood() {
  food = [rnd(), rnd()];
}
function updateScore() {
  scoreEl.textContent = `Score ${score} | Best ${high}`;
}
function reset() {
  snake = [[10, 10]];
  dir = [1, 0];
  score = 0;
  playing = true;
  paused = false;
  placeFood();
  updateScore();
}
function step() {
  if (!playing || paused) return;
  const head = [snake[0][0] + dir[0], snake[0][1] + dir[1]];
  if (
    head[0] < 0 ||
    head[1] < 0 ||
    head[0] >= cells ||
    head[1] >= cells ||
    snake.some((s) => s[0] === head[0] && s[1] === head[1])
  ) {
    playing = false;
    if (score > high) {
      high = score;
      localStorage.snakeHigh = high;
    }
    updateScore();
    return;
  }
  snake.unshift(head);
  if (head[0] === food[0] && head[1] === food[1]) {
    score++;
    updateScore();
    placeFood();
    ping();
  } else snake.pop();
}
function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = '#0f0';
  snake.forEach(([x, y]) => ctx.fillRect(x * size, y * size, size - 2, size - 2));
  ctx.fillStyle = '#f00';
  ctx.fillRect(food[0] * size, food[1] * size, size - 2, size - 2);
}
function loop() {
  step();
  draw();
  setTimeout(loop, 100);
}

/* keyboard */
addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && dir[1] !== 1) dir = [0, -1];
  if (e.key === 'ArrowDown' && dir[1] !== -1) dir = [0, 1];
  if (e.key === 'ArrowLeft' && dir[0] !== 1) dir = [-1, 0];
  if (e.key === 'ArrowRight' && dir[0] !== -1) dir = [1, 0];
  if (e.key === 'p' || e.key === 'P') paused = !paused;
});

/* touch D-pad */
document.querySelectorAll('.padBtn[data-dir]').forEach((btn) => {
  btn.addEventListener(
    'touchstart',
    (e) => {
      e.preventDefault();
      const d = btn.dataset.dir;
      if (d === 'up' && dir[1] !== 1) dir = [0, -1];
      if (d === 'down' && dir[1] !== -1) dir = [0, 1];
      if (d === 'left' && dir[0] !== 1) dir = [-1, 0];
      if (d === 'right' && dir[0] !== -1) dir = [1, 0];
    },
    { passive: false }
  );
});

/* buttons */
document.getElementById('reset').onclick = reset;
reset();
loop();
