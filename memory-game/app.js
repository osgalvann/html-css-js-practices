const moves = document.getElementById("movesCount");
const timerValue = document.getElementById("timer");
const startButton = document.getElementById("newGame");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".gameContainer");
const result = document.getElementById("result");
const control = document.querySelector(".gameOver");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

const items = [
    { name: "tigres", image: "img/tigres.png" },
    { name: "realMadrid", image: "img/real-madrid.png" },
    { name: "liverpool", image: "img/liverpool.png" },
    { name: "rayados", image: "img/rayados.png" },
    { name: "bayerMun", image: "img/bayern-m.png" },
    { name: "milan", image: "img/milan.png" },
    { name: "paris", image: "img/paris.png" },
    { name: "manCity", image: "img/mancity.png" },
    { name: "barcelona", image: "img/barcelona.png" },
    { name: "dortmund", image: "img/dortmund.png" },
    { name: "marsella", image: "img/marsella.png" },
    { name: "tottenham", image: "img/tottenham.png" }
];

//initial time
let seconds = 0;
let minutes = 0;

//initial mives and win count
let movesCount = 0;
let winCount = 0;

//start game
startButton.addEventListener("click", () => {
    console.log("click");
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    //controls amd buttons visibility
    control.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //Start timer
    interval = setInterval(timeGen, 1000);
    //initial moves
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
  });

  //stop game
  stopButton.addEventListener(
    "click",
    (stopGame = () => {
      control.classList.remove("hide");
      stopButton.classList.add("hide");
      startButton.classList.remove("hide");
      clearInterval(interval);
    })
  );

function timeGen() {
    seconds += 1;
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    //format time before displaying
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timerValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
}

function movesCounter() {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`;
}

function cardGenRandom(size = 4) {
    let auxArray = [...items];
    let cardsValues = [];
    //size should be double (4*4 matrix)/2 since pairs of objects would exist
    size = (size * size) / 2;
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * auxArray.length);
        cardsValues.push(auxArray[randomIndex]);
        auxArray.splice(randomIndex, 1);
    }
    return cardsValues;
}

function matrixGen(cardsValues, size = 4) {
    gameContainer.innerHTML = "";
    cardsValues = [...cardsValues, ...cardsValues];
    cardsValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
        */
        gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardsValues[i].name}">
     <div class="card-before">?</div>
     <div class="card-after">
     <img src="${cardsValues[i].image}" class="image"/></div>
     </div>`;
    }
    
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (!card.classList.contains("matched")) {
                card.classList.add("flipped");
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    movesCounter();
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue == secondCardValue) {
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = false;
                        winCount += 1;
                        if (winCount == Math.floor(cardsValues.length / 2)) {
                            result.innerHTML = `<h2>You Won</h2>
                            <h4>Moves: ${movesCount}</h4>`;
                            stopGame();
                        }
                    } else {
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900);
                    }
                }
            }
        });
    });
}


//Initialize values and func calls
function initializer() {
    result.innerText = "";
    winCount = 0;
    let cardsValues = cardGenRandom();
    matrixGen(cardsValues);
  };