document.addEventListener('DOMContentLoaded', () => {
    // console.log('hey')
    User.createUser()

})


class User {
    constructor(user){
        this.id = user.id;
        this.username = user.username;
        this.games = user.games;
    }


    static createUser() {
        // console.log('hey')
        let newUserForm = document.getElementById('new-user-form')
        newUserForm.addEventListener('submit', function(e){
            e.preventDefault()
            fetch('http://localhost:3000/api/v1/users', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept" : "application/json"
                },
                body: JSON.stringify({
                    user: {
                        username: e.target.children[1].value
                    }
                })
            })
            .then (resp => resp.json())
            .then(user => {
                let newUser = new User(user)
                // console.log(newUser)
                newUser.ready()
            })
        })
    }




        ready() {
            console.log('this is a new user')
        let overlays = Array.from(document.getElementsByClassName('overlay-text'));
        let cards = Array.from(document.getElementsByClassName('card'));
        let game = new MixOrMatch(15, cards, this.id);

            overlays.forEach(overlay => {
                overlay.addEventListener('click', () => {
                    overlay.classList.remove('visible');
                    game.startGame(this.id);
                
                });
            });
            cards.forEach(card => {
                card.addEventListener('click', () => {
                    game.flipCard(card);
                });
            });
        }
}









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
    constructor(totalTime,cards,totalPoints){
        this.totalTime = totalTime;
        this.cardsArray = cards;
        this.timeRemaining = totalTime
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.points = document.getElementById('points');
        this.audioController = new AudioController();
    }
    //this start game gets called more times
    startGame(){
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.pointsGained = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
        this.points.innerText = this.pointsGained;
    }

    hideCards() {
        this.cardsArray.forEach(card => { 
            card.classList.remove('visible');
            card.classList.remove('matched')
        });
    }

    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToCheck)
                this.checkForCardMatched(card);
            else 
            this.cardToCheck = card;
        }
    }

    checkForCardMatched(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMisMatch(card, this.cardToCheck);
         
            this.cardToCheck = null;
    }

    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.pointsGained++;
        this.points.innerText = this.pointsGained;
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
        this.victory();
    }

    cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible')
            card2.classList.remove('visible')
            this.busy = false;
        }, 1000);
    }

    getCardType(card){
        return card.getElementsByClassName('card-value')[0].src;
    }

    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
            this.gameOver();
        }, 1000);
    }

    gameOver() {
    clearInterval(this.countDown);
    this.audioController.gameover();
    document.getElementById('game-over-text').classList.add('visible');

}

    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }

    // fischer yates shuffling algorithm
    shuffleCards() {
        for(let i = this.cardsArray.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randomIndex].style.order = 1;
            this.cardsArray[i].style.order = randomIndex;
       }
    }

    canFlipCard(card) {
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck);
    }
}


// function ready() {
//     let overlays = Array.from(document.getElementsByClassName('overlay-text'));
//     let cards = Array.from(document.getElementsByClassName('card'));
//     let game = new MixOrMatch(10, cards);

//     overlays.forEach(overlay => {
//         overlay.addEventListener('click', () => {
//             overlay.classList.remove('visible');
//             game.startGame();
        
//         });
//     });
//     cards.forEach(card => {
//         card.addEventListener('click', () => {
//             game.flipCard(card);
//         });
//     });
// }

// if(document.readyState ==='loading') {
//     document.addEventListener('DOMContentLoaded', User.ready());
// } else {
// User.ready();
// }
