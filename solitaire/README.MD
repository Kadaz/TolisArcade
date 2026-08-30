# Solitaire - HTML5 Game

This is a classic Solitaire game built entirely with HTML, CSS, and vanilla JavaScript. It's a fully-featured, single-player card game that runs in any modern web browser. The project is separated into logical files for easy maintenance and deployment.

[**Live Demo**](https://aashishchakravarty.github.io/solitaire)

## Features

- **Classic Rules**: Follows the standard rules of Solitaire.
- **Scoring System**: Earn points for successful moves and try to beat the high score, which is saved locally in your browser.
- **Interactive UI**: Smooth animations for card movements, flips, and auto-complete.
- **Helpful Features**:
  - **Undo**: Revert your last move.
  - **Hint**: Get a visual cue for a possible move.
  - **Auto-Complete**: Automatically finish the game when all cards are revealed.
- **Persistent State**: Your current game is saved automatically, so you can refresh the page and resume where you left off.
- **Responsive Design**: The game is playable on desktops, tablets, and mobile devices.
<!-- -   **Difficulty Levels**: Choose from three modes:
    -   **Easy**: Draw 1 card from the stock.
    -   **Medium**: Draw 3 cards with unlimited passes.
    -   **Hard**: Draw 3 cards with only three passes through the stock. -->

## How to Play

### Objective

The goal is to move all 52 cards to the four **Foundation** piles, one for each suit, in ascending order from Ace to King.

### Game Board

- **Tableau**: The seven columns of cards in the main playing area.
- **Foundations**: The four empty piles at the top right.
- **Stock Pile**: The face-down deck at the top left.
- **Waste Pile**: The face-up pile next to the stock.

### Controls

- **Click the Stock Pile**: To draw a card (or three, depending on difficulty) to the Waste Pile.
- **Drag and Drop**: Move cards between Tableau columns or to the Foundation piles.
  - Tableau stacks must be built in descending order and with alternating colors (e.g., a red 7 on a black 8).
- **Double-Click**: Automatically move a card to its corresponding Foundation pile if the move is valid.
- **Buttons**: Use the control buttons to start a new game, restart, undo a move, or get a hint.

<!-- ## File Structure

The project is organized into separate files for better code management:

```
/solitaire-game
|-- index.html       (The main menu/home page)
|-- game.html        (The game board page)
|-- css/
|   |-- style.css    (All CSS styles for the project)
|-- js/
    |-- game.js      (All JavaScript game logic)


``` -->

<!-- ## Deployment

This is a static website, so it can be deployed easily on any static hosting service.

### Recommended Free Options:

1.  **GitHub Pages**:

    - Create a new repository on GitHub.

    - Upload the entire `solitaire-game` folder to the repository.

    - In the repository settings, go to the "Pages" tab and enable Pages for your `main` branch.

    - Your game will be live at `your-username.github.io/repository-name`.

2.  **Netlify**:

    - Sign up for a free Netlify account.

    - Drag and drop the `solitaire-game` folder from your computer onto the Netlify dashboard.

    - Netlify will instantly deploy the site and provide you with a shareable URL. -->
