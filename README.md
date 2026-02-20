# Snake

Minimal classic Snake game implemented with plain HTML/CSS/JS.

## Run

From this repo root:

```bash
python3 -m http.server 5173
```

Then open:

- `http://localhost:5173/index.html`

## Controls

- Arrow keys or `W/A/S/D`: move
- `Space`: pause/resume
- `R`: restart
- On-screen arrow buttons are available for touch/mobile use

## Manual Verification Checklist

- Movement works in all four directions with keyboard and on-screen controls.
- Snake grows by one segment and score increments when food is eaten.
- Game ends on wall collision.
- Game ends on self collision.
- Pause/resume stops and restarts tick updates.
- Restart resets score, snake length, and game-over state.
