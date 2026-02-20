import test from "node:test";
import assert from "node:assert/strict";

import {
  DIRECTIONS,
  createInitialState,
  placeFood,
  setNextDirection,
  stepState,
} from "../src/snake-logic.js";

const config = { cols: 8, rows: 8 };

test("moves one cell in current direction on each step", () => {
  let state = createInitialState(config, () => 0);
  state = setNextDirection(state, DIRECTIONS.right);
  state = stepState(state, config, () => 0);

  assert.equal(state.snake[0].x, Math.floor(config.cols / 2) + 1);
  assert.equal(state.snake[0].y, Math.floor(config.rows / 2));
  assert.equal(state.mode, "running");
});

test("rejects immediate reverse direction", () => {
  let state = createInitialState(config, () => 0);
  state = setNextDirection(state, DIRECTIONS.left);
  state = stepState(state, config, () => 0);

  assert.deepEqual(state.direction, DIRECTIONS.right);
});

test("grows and increments score when eating food", () => {
  const startX = Math.floor(config.cols / 2);
  const startY = Math.floor(config.rows / 2);
  const state = {
    snake: [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ],
    direction: { ...DIRECTIONS.right },
    nextDirection: { ...DIRECTIONS.right },
    food: { x: startX + 1, y: startY },
    score: 0,
    mode: "running",
  };

  const next = stepState(state, config, () => 0);
  assert.equal(next.snake.length, state.snake.length + 1);
  assert.equal(next.score, 1);
  assert.notEqual(next.food, null);
});

test("sets gameover on wall collision", () => {
  const state = {
    snake: [{ x: 0, y: 0 }],
    direction: { ...DIRECTIONS.left },
    nextDirection: { ...DIRECTIONS.left },
    food: { x: 3, y: 3 },
    score: 0,
    mode: "running",
  };

  const next = stepState(state, config, () => 0);
  assert.equal(next.mode, "gameover");
});

test("sets gameover on self collision", () => {
  const state = {
    snake: [
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 4, y: 2 },
      { x: 3, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
    direction: { ...DIRECTIONS.up },
    nextDirection: { ...DIRECTIONS.right },
    food: { x: 6, y: 6 },
    score: 0,
    mode: "running",
  };

  const next = stepState(state, config, () => 0);
  assert.equal(next.mode, "gameover");
});

test("placeFood never returns an occupied cell", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];
  const food = placeFood(snake, 4, 4, () => 0);
  assert.notDeepEqual(food, { x: 0, y: 0 });
  assert.notDeepEqual(food, { x: 1, y: 0 });
  assert.notDeepEqual(food, { x: 2, y: 0 });
});
