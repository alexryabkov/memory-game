const cards = document.querySelectorAll('.memory-card');
const movesSpan = document.getElementById('moves');
const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const gameFinishedMsg = document.querySelectorAll('.game-finished');
const restartButton = document.querySelector('.restart');
let firstFlipped, secondFlipped, totalSeconds, moves, openedCards, timerStarted, intervId;

function flipCard() {
  // Start timer if not done already
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }
  if (this === firstFlipped || (firstFlipped && secondFlipped)) return;
  this.querySelector('.back-face').hidden = true;
  if (!firstFlipped) {
    firstFlipped = this;
    return;
  }
  secondFlipped = this;
  setTimeout(checkMatch, 500);
}

function checkMatch() {
  movesSpan.innerHTML = ++moves;
  if (firstFlipped.classList[1] === secondFlipped.classList[1]) {
    [firstFlipped, secondFlipped].forEach(el => {
      el.classList.add('hidden-card');
    });
    openedCards += 2;
    if (openedCards >= cards.length) {
      // all cards are opened
      clearInterval(intervId);
      gameFinishedMsg.forEach(el => el.classList.add('visible'));
    }
  } else {
    [firstFlipped, secondFlipped].forEach(el => el
      .querySelector('.back-face').hidden = false);
  }
  [firstFlipped, secondFlipped] = [null, null];
}

function resetGame() {
  // reset timer and "moves" counter
  clearInterval(intervId);
  timerStarted = false;
  secondsSpan.innerHTML = '00';
  minutesSpan.innerHTML = '00';
  totalSeconds = 0;
  moves = 0;
  openedCards = 0;
  movesSpan.innerHTML = 0;
  [firstFlipped, secondFlipped] = [null, null];
  gameFinishedMsg.forEach(el => el.classList.remove('visible'));
  cards.forEach(el => {
    el.classList.remove('hidden-card');
    el.querySelector('.back-face').hidden = false;
  });
  // Shuffle cards
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
}

function pad(val) {
  let valString = val + '';
  return (valString.length < 2 ? '0' + valString : valString);
}

function setTime() {
  ++totalSeconds;
  secondsSpan.innerHTML = pad(totalSeconds % 60);
  minutesSpan.innerHTML = pad(parseInt(totalSeconds / 60));
}

function startTimer() {
  intervId = setInterval(setTime, 1000);
}

resetGame();
cards.forEach(card => card.addEventListener('click', flipCard));
restartButton.addEventListener('click', resetGame);
