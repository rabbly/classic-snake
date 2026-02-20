export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function isOpposite(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0;
}

export function cellsToSet(snake) {
  return new Set(snake.map((segment) => `${segment.x},${segment.y}`));
}

export function randomInt(maxExclusive, rng = Math.random) {
  return Math.floor(rng() * maxExclusive);
}

export function placeFood(snake, cols, rows, rng = Math.random) {
  const occupied = cellsToSet(snake);
  const freeCells = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        freeCells.push({ x, y });
      }
    }
  }

  if (freeCells.length === 0) {
    return null;
  }

  return freeCells[randomInt(freeCells.length, rng)];
}

export function createInitialState(config, rng = Math.random) {
  const { cols, rows } = config;
  const startX = Math.floor(cols / 2);
  const startY = Math.floor(rows / 2);
  const snake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];
  const food = placeFood(snake, cols, rows, rng);

  return {
    snake,
    direction: { ...DIRECTIONS.right },
    nextDirection: { ...DIRECTIONS.right },
    food,
    score: 0,
    mode: "idle",
  };
}

export function setNextDirection(state, direction) {
  if (!direction || isOpposite(state.direction, direction)) {
    return state;
  }

  return {
    ...state,
    nextDirection: direction,
    mode: state.mode === "idle" ? "running" : state.mode,
  };
}

export function stepState(state, config, rng = Math.random) {
  if (state.mode !== "running") {
    return state;
  }

  const direction = state.nextDirection;
  const head = state.snake[0];
  const nextHead = {
    x: head.x + direction.x,
    y: head.y + direction.y,
  };
  const outOfBounds =
    nextHead.x < 0 ||
    nextHead.x >= config.cols ||
    nextHead.y < 0 ||
    nextHead.y >= config.rows;

  if (outOfBounds) {
    return { ...state, mode: "gameover" };
  }

  const oldTail = state.snake[state.snake.length - 1];
  const occupied = cellsToSet(state.snake.slice(0, -1));
  if (occupied.has(`${nextHead.x},${nextHead.y}`)) {
    return { ...state, mode: "gameover" };
  }

  const willEat =
    state.food && nextHead.x === state.food.x && nextHead.y === state.food.y;
  const movedSnake = [nextHead, ...state.snake.slice(0, -1)];
  let snake = movedSnake;
  let score = state.score;
  let food = state.food;

  if (willEat) {
    snake = [...movedSnake, oldTail];
    score += 1;
    food = placeFood(snake, config.cols, config.rows, rng);
  }

  const mode = food ? "running" : "won";

  return {
    ...state,
    direction,
    snake,
    score,
    food,
    mode,
  };
}
