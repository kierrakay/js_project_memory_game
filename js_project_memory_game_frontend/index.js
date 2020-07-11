class AudioController {
    constructor() {
        this.bgMusic = new Audio('Assets/Audio/happy.mp3');
        this.flipSound = new Audio('Assets/Audio/flipcard.wav');
        this.matchSound = new Audio('Assets/Audio/matched.mp3');
        this.victorySound = new Audio('Assets/Audio/victory.mp3');
        this.gameOverSound = new Audio('Assets/Audio/gameover.wav');
        this.bgMusic.volume = 0.12;
        this.bgMusic.loop = true;
       
    }

    startMusic() {
        this.bgMusic.play();
    }

    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }

    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameover() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

//this only gets called when you create a new object of this game
class MixOrMatch {
    constructor(totalTime,cards){
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }
    //this start game gets called more times
    startGame(){
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        this.shuffleCards();
    }

    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            //if statement
        }
    }
    // fischer yates shuffling algorithm
    shuffleCards() {
        for(let i = this.cardsArray.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randomIndex].style.order = 1;
            this.cardsArray[i].style.order = randomIndex;
;        }
    }

    canFlipCard(card) {
        return true;
        //can flip card if all of these are false which will result to a value of true
        // return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck);

    }
}


function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        
        });
    });
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

if(document.readyState ==='loading') {
    document.addEventListener('DOMContentLoaded',ready());
} else {
ready();
}

//