# Tic Tac Toe
Welcome to my simple website to play a simple game of Tic Tac Toe!

It's a two-player game in the browser, written in HTML, CSS and JavaScript.

## Features

- Two players take turns as **X** and **O** on the same device
- The X and O marks animate as they're drawn
- The three squares that win the game are highlighted
- Spots a draw when the board fills up
- A **Restart** button to start a new game at any time
- Fits phone and desktop screens

## How to play

1. Open `index.html`.
2. X goes first. Click an empty square to place your mark.
3. Players take turns until one gets three in a row.
4. Click **Restart** to play again.


## Customizing the colours

All the colours are CSS variables at the top of `style.css`. Change them to restyle the whole site:

```css
:root {
  --bg: #1e1e28;     /* background */
  --panel: #2a2a38;  /* background gradient highlight */
  --grid: #5a5a6e;   /* board grid lines */
  --text: #eeeef5;   /* text */
  --x: #e65a5a;      /* X colour */
  --o: #5aa0e6;      /* O colour */
  --win: #f0dc64;    /* winning line and result text */
}
```

## Built with
- HTML5
- CSS3 (grid layout, custom properties, animations)
- JavaScript (no libraries)
