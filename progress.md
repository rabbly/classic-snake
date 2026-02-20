Original prompt: Build a classic Snake game in this repo.

## Notes
- Repository is empty except `.git`.
- Using vanilla HTML/CSS/JS to avoid adding dependencies and to keep the scope minimal.
- Plan: implement deterministic game logic in a standalone module, wire a small UI, and document run steps.

## Completed
- Added `index.html` and `styles.css` with a minimal board + HUD + controls layout.
- Added deterministic core logic in `src/snake-logic.js`:
  - movement and direction handling
  - growth on food
  - food placement excluding snake cells
  - wall/self collision
  - game-over/win mode transitions
- Added runtime controller in `src/main.js`:
  - keyboard + touch controls
  - timer-driven game loop
  - pause/resume and restart
  - score/status rendering
  - `window.render_game_to_text` and `window.advanceTime(ms)` hooks
- Added run + manual verification docs in `README.md`.

## Validation
- Added `package.json` (`type: module`) with a `test` script using Node's built-in runner.
- Added logic tests in `tests/snake-logic.test.js` for movement, reverse-direction guard, growth/score, wall collision, self collision, and food placement.
- Ran `npm test` successfully: 6 passed, 0 failed.
- Ran browser smoke automation with `develop-web-game` Playwright client after Playwright install:
  - Artifacts: `output/playwright/shot-0.png`, `output/playwright/state-0.json`
  - Console/page errors: none emitted for the HTTP run.
  - Final state snapshot confirms game loop and collision path executed (`mode: gameover`).
- A `file://` smoke run was attempted but intentionally ignored for validation due browser module CORS restrictions (expected for ES module pages without HTTP).

## TODO for next agent
- Optional: add a second Playwright scenario focused on guaranteed food pickup to verify growth/score change in browser-level smoke tests.
