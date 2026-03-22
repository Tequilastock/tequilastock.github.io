/* ---------- audio ---------- */
let audioCtx,
  newPing,
  on = !JSON.parse(localStorage.flappySound || 'true');
function ping() {
  if (!on) return;
  audioCtx || (audioCtx = new (window.AudioContext || window.webkitAudioContext)());
  newPing = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  newPing.frequency.value = 880;
  newPing.connect(g).connect(audioCtx.destination);
  g.gain.setValueAtTime(0.25, audioCtx.currentTime);
  newPing.start();
  newPing.stop(audioCtx.currentTime + 0.15);
}
const btn = document.getElementById('snd');
btn.onclick = () => {
  on = !on;
  btn.textContent = on ? '🔈' : '🔇';
  localStorage.flappySound = on;
};
/* ---------- game ---------- */
const W = 320,
  H = 480,
  c = document.getElementById('c');
c.width = W;
c.height = H;
const ctx = c.getContext('2d'),
  g = 0.5,
  gap = 120,
  pipeW = 52,
  pipeGap = 160;
let y,
  v,
  score,
  pipes,
  playing,
  paused = false,
  high = +(localStorage.flappyHigh || 0);
function addPipe(x) {
  pipes.push({ x, h: 50 + Math.random() * 250 });
}
function reset() {
  y = 200;
  v = 0;
  score = 0;
  pipes = [];
  paused = false;
  [0, 1, 2].forEach((i) => addPipe(i * pipeGap + 400));
  playing = true;
  setMsg('Tap / Space | P pause');
}
function setMsg(t) {
  document.getElementById('msg').innerHTML = `${t}<br>Best ${high}`;
}
function draw() {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ff0';
  ctx.fillRect(60, y, 24, 24);
  ctx.fillStyle = '#090';
  pipes.forEach((p) => {
    ctx.fillRect(p.x, 0, pipeW, p.h);
    ctx.fillRect(p.x, p.h + gap, pipeW, H);
  });
  ctx.fillStyle = '#fff';
  ctx.fillText(score, 150, 40);
}
function update() {
  if (!playing || paused) return;
  v += g;
  y += v;
  pipes.forEach((p) => (p.x -= 2));
  if (pipes[0].x < -pipeW) {
    pipes.shift();
    addPipe(pipes.at(-1).x + pipeGap);
    score++;
    ping();
  }
  const p = pipes[0],
    hitX = 84 > p.x && 60 < p.x + pipeW,
    hitY = y < p.h || y + 24 > p.h + gap;
  if (y > H - 24 || (hitX && hitY)) {
    playing = false;
    if (score > high) {
      high = score;
      localStorage.flappyHigh = high;
    }
    setMsg('Game over—click to restart');
  }
}
addEventListener('keydown', (e) => {
  if (e.code === 'Space') v = -8;
  if (e.key === 'p' || e.key === 'P') {
    paused = !paused;
    setMsg(paused ? 'Paused — P to resume' : 'Tap / Space | P pause');
  }
});
addEventListener('mousedown', () => {
  playing ? (v = -8) : reset();
});
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
reset();
loop();
