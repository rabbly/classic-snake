import {
  DIRECTIONS,
  createInitialState,
  setNextDirection,
  stepState,
} from "./snake-logic.js";

const config = {
  cols: 16,
  rows: 16,
  tickMs: 140,
};

const board = document.querySelector("#board");
const scoreEl = document.querySelector("#score");
const statusEl = document.querySelector("#status");
const restartBtn = document.querySelector("#restart-btn");
const pauseBtn = document.querySelector("#pause-btn");
const touchButtons = document.querySelectorAll("[data-dir]");
const swipeThreshold = 24;

let state = createInitialState(config);
let intervalId = null;
let touchStart = null;

function statusText(mode) {
  if (mode === "idle") return "Press any direction to start";
  if (mode === "paused") return "Paused";
  if (mode === "running") return "Use Arrow keys or WASD";
  if (mode === "gameover") return "Game Over";
  if (mode === "won") return "You Win";
  return "";
}

function applyDirection(name) {
  const direction = DIRECTIONS[name];
  if (!direction || state.mode === "gameover" || state.mode === "won") return;
  state = setNextDirection(state, direction);
  render();
}

function update() {
  state = stepState(state, config);
  render();
}

function startLoop() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    update();
    if (state.mode === "gameover" || state.mode === "won") {
      stopLoop();
    }
  }, config.tickMs);
}

function stopLoop() {
  if (!intervalId) return;
  clearInterval(intervalId);
  intervalId = null;
}

function togglePause() {
  if (state.mode === "gameover" || state.mode === "won" || state.mode === "idle") return;
  if (state.mode === "paused") {
    state = { ...state, mode: "running" };
    startLoop();
  } else {
    state = { ...state, mode: "paused" };
    stopLoop();
  }
  render();
}

function restart() {
  state = createInitialState(config);
  stopLoop();
  render();
}

function setBoardTemplate() {
  board.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${config.rows}, 1fr)`;
}

function renderBoard() {
  const snakeCells = new Set(state.snake.map((segment) => `${segment.x},${segment.y}`));
  const foodCell = state.food ? `${state.food.x},${state.food.y}` : null;
  const cells = [];

  for (let y = 0; y < config.rows; y += 1) {
    for (let x = 0; x < config.cols; x += 1) {
      const key = `${x},${y}`;
      let className = "cell";
      if (snakeCells.has(key)) className += " snake";
      if (foodCell === key) className += " food";
      cells.push(`<div class="${className}" role="gridcell"></div>`);
    }
  }

  board.innerHTML = cells.join("");
}

function render() {
  scoreEl.textContent = `${state.score}`;
  statusEl.textContent = statusText(state.mode);
  pauseBtn.textContent = state.mode === "paused" ? "Resume" : "Pause";
  renderBoard();
}

function renderGameToText() {
  return JSON.stringify({
    coordinateSystem: "origin=(0,0) top-left, +x right, +y down",
    mode: state.mode,
    direction: state.direction,
    snake: state.snake,
    food: state.food,
    score: state.score,
    board: { cols: config.cols, rows: config.rows },
  });
}

function handleDirectionInput(directionName) {
  const shouldStart = state.mode === "idle";
  applyDirection(directionName);
  if (shouldStart && state.mode === "running") {
    startLoop();
  }
}

function keyToDirection(key) {
  const normalized = key.toLowerCase();
  if (normalized === "arrowup" || normalized === "w") return "up";
  if (normalized === "arrowdown" || normalized === "s") return "down";
  if (normalized === "arrowleft" || normalized === "a") return "left";
  if (normalized === "arrowright" || normalized === "d") return "right";
  return null;
}

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    togglePause();
    return;
  }

  if (event.key.toLowerCase() === "r") {
    restart();
    return;
  }

  const directionName = keyToDirection(event.key);
  if (!directionName) return;

  event.preventDefault();
  handleDirectionInput(directionName);
});

restartBtn.addEventListener("click", restart);
pauseBtn.addEventListener("click", togglePause);

for (const button of touchButtons) {
  button.addEventListener("click", () => {
    handleDirectionInput(button.dataset.dir);
  });
}

board.addEventListener(
  "touchstart",
  (event) => {
    const touch = event.changedTouches[0];
    if (!touch) return;
    touchStart = { x: touch.clientX, y: touch.clientY };
  },
  { passive: true }
);

board.addEventListener(
  "touchmove",
  (event) => {
    if (!touchStart) return;
    event.preventDefault();
  },
  { passive: false }
);

board.addEventListener(
  "touchend",
  (event) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    touchStart = null;

    if (Math.abs(dx) < swipeThreshold && Math.abs(dy) < swipeThreshold) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      handleDirectionInput(dx > 0 ? "right" : "left");
      return;
    }

    handleDirectionInput(dy > 0 ? "down" : "up");
  },
  { passive: true }
);

board.addEventListener(
  "touchcancel",
  () => {
    touchStart = null;
  },
  { passive: true }
);

window.render_game_to_text = renderGameToText;
window.advanceTime = (ms) => {
  if (state.mode !== "running") return;
  const steps = Math.max(1, Math.floor(ms / config.tickMs));
  for (let i = 0; i < steps; i += 1) {
    state = stepState(state, config);
    if (state.mode === "gameover" || state.mode === "won") break;
  }
  render();
};

setBoardTemplate();
render();
