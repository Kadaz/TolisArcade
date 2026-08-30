# 🃏 Solitaire

A beautifully designed, premium Klondike Solitaire game built entirely in a **single file** using vanilla HTML, CSS, and JavaScript. 

No frameworks, no build tools, no servers, no ads, and no tracking. Just pure, uninterrupted gameplay that works flawlessly on both desktop and mobile devices.

[**🌍 Play the Live Demo Here**](https://jhatzimalis.github.io/solitaire)

[![Live Demo](https://img.shields.io/badge/demo-Live%20on%20GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://jhatzimalis.github.io/solitaire)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success?style=for-the-badge)

---

## ✨ Features

* **📱 Flawless Mobile Experience:** Dynamically scales to fit any screen size perfectly. Play comfortably in portrait or landscape mode with zero awkward scrolling.
* **🖱️ Smart Controls:** Supports both fluid drag-and-drop and quick tap-to-move (smart auto-move) logic.
* **🎨 Highly Customizable:** Features a beautiful, non-blocking drawer menu to customize your play space on the fly.
  * **8 Table Colours** (Including sleek Light and Dark modes).
  * **8 Card Colours**.
  * **8 Card Designs/Patterns** (Diagonal stripes, horizontal/vertical lines, solids, and elegant shadows).
* **⚡ Ultra-Smooth Animations:** Native 3D card flips, smart placeholder scaling, and buttery smooth sliding transitions.
* **⏱️ Stat Tracking:** Tracks your current time and saves your all-time Best Score securely to your browser.

---

## 🚀 How to Play

Because this project is entirely vanilla and self-contained, there is absolutely zero setup required. You have two ways to play:

1. **Play Live Online:**
   Simply visit the [GitHub Pages Live Demo](https://jhatzimalis.github.io/solitaire) to play immediately in your browser.

2. **Download & Play Offline:**
   Want to keep a copy on your computer forever? 
   * Click on the `index.html` file in this repository.
   * Click the "Download raw file" button.
   * Double-click the downloaded file to open it in any web browser. It works 100% offline!

---

## 🎮 Controls

* **Drag & Drop:** Click and hold a face-up card (or stack of cards) to drag it to a valid destination.
* **Tap to Auto-Move:** Simply tap/click a card. If there is a valid move available (favouring Foundation piles first, then Tableau piles), the card will slide there automatically.
* **Stock Pile:** Tap the top-left deck to draw new cards. When empty, tap the empty slot to recycle the waste pile.
* **Menu:** Tap the floating handle at the bottom of the screen to open the settings drawer without interrupting your game. You can still interact with the cards while the menu is open!

---

## 🛠️ Technology Stack

This project was an exercise in extreme minimalism and browser capabilities. It relies purely on the native web trifecta:

* **HTML5:** Semantic structure and layout.
* **CSS3:** Advanced CSS Variables for live-updating responsive math, 3D transforms (`preserve-3d`, `rotateY`), flexbox, and precise scroll containment.
* **Vanilla JavaScript (ES6+):** Complete game logic, drag/pointer event handling, touch decoupling, dynamic DOM manipulation, and `localStorage` integration.

---

## 💾 Privacy & Local Storage

This game entirely respects your privacy. It stores minimal data (your selected themes and your best time) securely in your browser's Local Storage. No data is ever sent to a server, and no cookies are used.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Designed for pure gameplay.*
