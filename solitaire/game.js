const suits = [
  { id: "hearts", symbol: "♥", color: "red" },
  { id: "diamonds", symbol: "♦", color: "red" },
  { id: "clubs", symbol: "♣", color: "black" },
  { id: "spades", symbol: "♠", color: "black" },
];

const ranks = [
  { label: "A", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
  { label: "J", value: 11 },
  { label: "Q", value: 12 },
  { label: "K", value: 13 },
];

const state = {
  stock: [],
  waste: [],
  foundations: [[], [], [], []],
  tableau: [[], [], [], [], [], [], []],
  moves: 0,
  startedAt: null,
  timerId: null,
  dragged: null,
  history: [],
};

const leaveWarningStorageKey = "classic-solitaire-skip-leave-warning";

const els = {
  stock: document.querySelector("#stock"),
  stockCount: document.querySelector("#stock-count"),
  waste: document.querySelector("#waste"),
  foundations: document.querySelector("#foundations"),
  tableau: document.querySelector("#tableau"),
  moves: document.querySelector("#moves"),
  timer: document.querySelector("#timer"),
  undo: document.querySelector("#undo"),
  newGame: document.querySelector("#new-game"),
  winDialog: document.querySelector("#win-dialog"),
  winSummary: document.querySelector("#win-summary"),
  playAgain: document.querySelector("#play-again"),
  skipLeaveWarning: document.querySelector("#skip-leave-warning"),
};

function createDeck() {
  return suits.flatMap((suit) =>
    ranks.map((rank) => ({
      id: `${rank.label}-${suit.id}`,
      suit: suit.id,
      symbol: suit.symbol,
      color: suit.color,
      rank: rank.label,
      value: rank.value,
      faceUp: false,
    }))
  );
}

function shuffle(deck) {
  const cards = [...deck];
  crypto.getRandomValues(new Uint32Array(cards.length)).forEach((random, index) => {
    const swapIndex = index + (random % (cards.length - index));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  });
  return cards;
}

function startGame() {
  clearInterval(state.timerId);
  const deck = shuffle(createDeck());
  state.stock = [];
  state.waste = [];
  state.foundations = [[], [], [], []];
  state.tableau = [[], [], [], [], [], [], []];
  state.moves = 0;
  state.startedAt = Date.now();
  state.dragged = null;
  state.history = [];

  for (let column = 0; column < 7; column += 1) {
    for (let row = 0; row <= column; row += 1) {
      const card = deck.pop();
      card.faceUp = row === column;
      state.tableau[column].push(card);
    }
  }

  state.stock = deck;
  state.timerId = setInterval(updateTimer, 1000);
  render();
}

function render() {
  renderStock();
  renderWaste();
  renderFoundations();
  renderTableau();
  els.moves.textContent = `${state.moves} ${state.moves === 1 ? "movimiento" : "movimientos"}`;
  els.undo.disabled = state.history.length === 0;
  updateTimer();
}

function renderStock() {
  els.stock.classList.toggle("has-cards", state.stock.length > 0);
  els.stockCount.textContent = String(state.stock.length);
  els.stock.setAttribute(
    "aria-label",
    state.stock.length > 0 ? `Robar carta, quedan ${state.stock.length}` : "Reiniciar descarte, mazo vacio"
  );
}

function renderWaste() {
  els.waste.replaceChildren();
  els.waste.dataset.source = "waste";
  const visibleCards = state.waste.slice(-3);
  const firstVisibleIndex = state.waste.length - visibleCards.length;

  visibleCards.forEach((card, visibleIndex) => {
    const cardIndex = firstVisibleIndex + visibleIndex;
    const isTopCard = cardIndex === state.waste.length - 1;
    const cardEl = createCardElement(
      card,
      { source: "waste", index: cardIndex },
      { interactive: isTopCard }
    );
    cardEl.style.left = `${visibleIndex * wasteSpread()}px`;
    cardEl.style.zIndex = String(visibleIndex + 1);
    els.waste.append(cardEl);
  });
  attachDropTarget(els.waste, "waste");
}

function renderFoundations() {
  els.foundations.replaceChildren();
  state.foundations.forEach((pile, index) => {
    const foundation = document.createElement("div");
    foundation.className = "pile foundation";
    foundation.dataset.foundation = String(index);
    foundation.dataset.suit = suits[index].id;
    foundation.setAttribute("aria-label", `Fundacion de ${suits[index].id}`);
    attachDropTarget(foundation, "foundation", index);

    const topCard = pile.at(-1);
    if (topCard) {
      foundation.append(createCardElement(topCard, { source: "foundation", pile: index, index: pile.length - 1 }));
    }
    els.foundations.append(foundation);
  });
}

function renderTableau() {
  els.tableau.replaceChildren();
  state.tableau.forEach((columnCards, columnIndex) => {
    const column = document.createElement("div");
    column.className = `column${columnCards.length === 0 ? " empty" : ""}`;
    column.dataset.column = String(columnIndex);
    column.setAttribute("aria-label", `Columna ${columnIndex + 1}`);
    attachDropTarget(column, "tableau", columnIndex);

    columnCards.forEach((card, cardIndex) => {
      const cardEl = createCardElement(card, {
        source: "tableau",
        column: columnIndex,
        index: cardIndex,
      });
      cardEl.style.top = `${cardIndex * stackOffset()}px`;
      column.append(cardEl);
    });

    els.tableau.append(column);
  });
}

function createCardElement(card, location, options = {}) {
  const interactive = options.interactive !== false;
  const cardEl = document.createElement("div");
  cardEl.className = `card ${card.color}${card.faceUp ? "" : " face-down"}`;
  cardEl.dataset.cardId = card.id;
  if (interactive) {
    cardEl.setAttribute("role", "button");
    cardEl.setAttribute("aria-label", card.faceUp ? `${card.rank} de ${card.suit}` : "Carta boca abajo");
  } else {
    cardEl.classList.add("preview");
    cardEl.setAttribute("aria-hidden", "true");
  }

  if (card.faceUp && interactive) {
    cardEl.draggable = canDrag(location);
    cardEl.innerHTML = `
      <span class="rank">${card.rank}</span>
      <span class="center-suit">${card.symbol}</span>
      <span class="suit">${card.symbol}</span>
    `;
    cardEl.addEventListener("click", (event) => {
      event.stopPropagation();
      autoMove(location);
    });
    cardEl.addEventListener("dragstart", (event) => onDragStart(event, location));
    cardEl.addEventListener("dragend", onDragEnd);
    cardEl.addEventListener("dblclick", () => autoFoundation(location));
  } else if (card.faceUp) {
    cardEl.innerHTML = `
      <span class="rank">${card.rank}</span>
      <span class="center-suit">${card.symbol}</span>
      <span class="suit">${card.symbol}</span>
    `;
  }

  return cardEl;
}

function attachDropTarget(element, type, index = null) {
  element.addEventListener("dragover", (event) => {
    if (canDrop(type, index)) {
      event.preventDefault();
      element.classList.add("drop-ok");
    }
  });
  element.addEventListener("dragleave", () => element.classList.remove("drop-ok"));
  element.addEventListener("drop", (event) => {
    event.preventDefault();
    element.classList.remove("drop-ok");
    moveDragged(type, index);
  });
}

function onDragStart(event, location) {
  state.dragged = buildMove(location);
  if (!state.dragged) {
    event.preventDefault();
    return;
  }
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", state.dragged.cards.map((card) => card.id).join(","));
  requestAnimationFrame(() => event.target.classList.add("dragging"));
}

function onDragEnd(event) {
  event.target.classList.remove("dragging");
  document.querySelectorAll(".drop-ok").forEach((el) => el.classList.remove("drop-ok"));
}

function buildMove(location) {
  if (location.source === "waste") {
    const card = state.waste.at(-1);
    return card ? { from: location, cards: [card] } : null;
  }

  if (location.source === "foundation") {
    const card = state.foundations[location.pile].at(-1);
    return card ? { from: location, cards: [card] } : null;
  }

  const column = state.tableau[location.column];
  const cards = column.slice(location.index);
  if (!cards.length || !cards.every((card) => card.faceUp) || !isValidSequence(cards)) {
    return null;
  }
  return { from: location, cards };
}

function canDrag(location) {
  return Boolean(buildMove(location));
}

function canDrop(type, index) {
  const move = state.dragged;
  if (!move) return false;
  if (type === "waste") return false;
  if (type === "foundation") return canMoveToFoundation(move.cards, index);
  if (type === "tableau") return canMoveToTableau(move.cards, index);
  return false;
}

function moveDragged(type, index) {
  if (!state.dragged || !canDrop(type, index)) return;
  saveHistory();
  const move = state.dragged;
  removeFromSource(move);

  if (type === "foundation") {
    state.foundations[index].push(move.cards[0]);
  } else {
    state.tableau[index].push(...move.cards);
  }

  afterMove();
}

function removeFromSource(move) {
  const { from, cards } = move;
  if (from.source === "waste") {
    state.waste.pop();
  } else if (from.source === "foundation") {
    state.foundations[from.pile].pop();
  } else {
    state.tableau[from.column].splice(from.index, cards.length);
  }
}

function canMoveToFoundation(cards, foundationIndex) {
  if (cards.length !== 1) return false;
  const card = cards[0];
  const pile = state.foundations[foundationIndex];
  const expectedSuit = suits[foundationIndex].id;
  if (card.suit !== expectedSuit) return false;
  if (pile.length === 0) return card.value === 1;
  return pile.at(-1).value + 1 === card.value;
}

function canMoveToTableau(cards, columnIndex) {
  const card = cards[0];
  const destination = state.tableau[columnIndex];
  const topCard = destination.at(-1);
  if (!topCard) return card.value === 13;
  return topCard.faceUp && topCard.color !== card.color && topCard.value === card.value + 1;
}

function isValidSequence(cards) {
  return cards.every((card, index) => {
    if (index === 0) return true;
    const previous = cards[index - 1];
    return previous.color !== card.color && previous.value === card.value + 1;
  });
}

function afterMove() {
  flipAvailableCards();
  state.moves += 1;
  state.dragged = null;
  render();
  checkWin();
}

function flipAvailableCards() {
  state.tableau.forEach((column) => {
    const topCard = column.at(-1);
    if (topCard && !topCard.faceUp) {
      topCard.faceUp = true;
    }
  });
}

function drawFromStock() {
  if (state.stock.length > 0) {
    saveHistory();
    const card = state.stock.pop();
    card.faceUp = true;
    state.waste.push(card);
    state.moves += 1;
  } else if (state.waste.length > 0) {
    saveHistory();
    state.stock = state.waste.reverse().map((card) => ({ ...card, faceUp: false }));
    state.waste = [];
    state.moves += 1;
  }
  render();
}

function autoFoundation(location) {
  const move = buildMove(location);
  if (!move || move.cards.length !== 1) return;
  const foundationIndex = state.foundations.findIndex((_, index) => canMoveToFoundation(move.cards, index));
  if (foundationIndex === -1) return;
  state.dragged = move;
  moveDragged("foundation", foundationIndex);
}

function autoMove(location) {
  const move = buildMove(location);
  if (!move) return;

  const tableauIndex = state.tableau.findIndex((_, index) => {
    return !isSameTableauSource(move, index) && canMoveToTableau(move.cards, index);
  });
  if (tableauIndex !== -1) {
    state.dragged = move;
    moveDragged("tableau", tableauIndex);
    return;
  }

  if (move.cards.length !== 1) return;
  const foundationIndex = state.foundations.findIndex((_, index) => canMoveToFoundation(move.cards, index));
  if (foundationIndex === -1) return;
  state.dragged = move;
  moveDragged("foundation", foundationIndex);
}

function isSameTableauSource(move, columnIndex) {
  return move.from.source === "tableau" && move.from.column === columnIndex;
}

function checkWin() {
  const completed = state.foundations.every((pile) => pile.length === 13);
  if (!completed) return;
  clearInterval(state.timerId);
  els.winSummary.textContent = `Has terminado en ${state.moves} movimientos y ${formatTime(elapsedSeconds())}.`;
  els.winDialog.showModal();
}

function hasFinishedGame() {
  return state.foundations.every((pile) => pile.length === 13);
}

function saveHistory() {
  state.history.push({
    stock: cloneCards(state.stock),
    waste: cloneCards(state.waste),
    foundations: state.foundations.map(cloneCards),
    tableau: state.tableau.map(cloneCards),
    moves: state.moves,
  });
}

function undoMove() {
  const previous = state.history.pop();
  if (!previous) return;
  state.stock = previous.stock;
  state.waste = previous.waste;
  state.foundations = previous.foundations;
  state.tableau = previous.tableau;
  state.moves = previous.moves;
  state.dragged = null;
  render();
}

function cloneCards(cards) {
  return cards.map((card) => ({ ...card }));
}

function updateTimer() {
  els.timer.textContent = formatTime(elapsedSeconds());
}

function elapsedSeconds() {
  if (!state.startedAt) return 0;
  return Math.floor((Date.now() - state.startedAt) / 1000);
}

function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function stackOffset() {
  return window.matchMedia("(max-width: 780px)").matches ? 22 : 30;
}

function wasteSpread() {
  return window.matchMedia("(max-width: 780px)").matches ? 18 : 30;
}

els.stock.addEventListener("click", drawFromStock);
els.undo.addEventListener("click", undoMove);
els.newGame.addEventListener("click", startGame);
els.playAgain.addEventListener("click", () => {
  els.winDialog.close();
  startGame();
});
els.skipLeaveWarning.checked = localStorage.getItem(leaveWarningStorageKey) === "true";
els.skipLeaveWarning.addEventListener("change", () => {
  localStorage.setItem(leaveWarningStorageKey, String(els.skipLeaveWarning.checked));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Tab" && !els.winDialog.open) {
    event.preventDefault();
    document.activeElement?.blur();
  }
});
window.addEventListener("beforeunload", (event) => {
  if (els.skipLeaveWarning.checked || hasFinishedGame()) return;
  event.preventDefault();
  event.returnValue = "Seguro que quieres abandonar la pagina? Perderas la partida.";
});
window.addEventListener("resize", render);

startGame();
