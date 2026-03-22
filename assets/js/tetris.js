const cv = document.getElementById('cv'),
  ctx = cv.getContext('2d'),
  grid = 20,
  w = 10,
  h = 24;
const shapes = [
  [1, 1, 1, 1],
  [1, 1, 1, 0, 1],
  [0, 1, 1, 1, 0],
  [1, 1, 0, 0, 1],
  [1, 1, 1, 1, 0, 0],
  [1, 1, 0, 0, 0, 1],
  [0, 1, 1, 0, 1]
];
let arena = Array.from({ length: h }, () => Array(w).fill(0)),
  piece,
  offset,
  drop = 0,
  game = true,
  colors = ['#0af', '#fa0', '#af0', '#f0a', '#0fa', '#a0f', '#ff0'];
function newPiece() {
  const s = shapes[(Math.random() * shapes.length) | 0],
    len = Math.sqrt(s.length);
  piece = [];
  for (let y = 0; y < len; y++) for (let x = 0; x < len; x++) s[y * len + x] && piece.push([x, y]);
  offset = [w / 2 - 1, 0];
}
function rotate() {
  piece.forEach((p) => {
    [p[0], p[1]] = [p[1], -p[0] + 2];
  });
  if (collide())
    piece.forEach((p) => {
      [p[0], p[1]] = [p[1], -p[0] + 2];
    });
}
function collide() {
  return piece.some(([x, y]) => {
    const px = x + offset[0],
      py = y + offset[1];
    return px < 0 || px >= w || py >= h || arena[py][px];
  });
}
function merge() {
  piece.forEach(([x, y]) => (arena[y + offset[1]][x + offset[0]] = 1 + sh));
  clear();
}
function clear() {
  for (let y = h - 1; y >= 0; y--)
    if (arena[y].every((v) => v)) {
      arena.splice(y, 1);
      arena.unshift(Array(w).fill(0));
      y++;
    }
}
function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 240, 480);
  arena.forEach((row, y) =>
    row.forEach(
      (v, x) =>
        v && ((ctx.fillStyle = colors[v - 1]), ctx.fillRect(x * grid, y * grid, grid - 1, grid - 1))
    )
  );
  piece.forEach(([x, y]) => {
    ctx.fillStyle = colors[sh];
    ctx.fillRect((x + offset[0]) * grid, (y + offset[1]) * grid, grid - 1, grid - 1);
  });
}
let sh;
newPiece();
sh = (Math.random() * colors.length) | 0;
function loop(time = 0) {
  if (!game) return;
  const dt = time - drop;
  if (dt > 500) {
    offset[1]++;
    if (collide()) {
      offset[1]--;
      merge();
      sh = (Math.random() * colors.length) | 0;
      newPiece();
      if (collide()) {
        game = false;
        alert('Game over');
      }
    }
    drop = time;
  }
  draw();
  requestAnimationFrame(loop);
}
addEventListener('keydown', (e) => {
  if (!game) return;
  if (e.key === 'ArrowLeft') {
    offset[0]--;
    if (collide()) offset[0]++;
  }
  if (e.key === 'ArrowRight') {
    offset[0]++;
    if (collide()) offset[0]--;
  }
  if (e.key === 'ArrowDown') {
    offset[1]++;
    if (collide()) {
      offset[1]--;
      merge();
      sh = (Math.random() * colors.length) | 0;
      newPiece();
    }
  }
  if (e.key === 'ArrowUp') rotate();
  draw();
});
loop();
