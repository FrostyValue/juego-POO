//CLASES

class Game {
    constructor() {
        this.container = document.getElementById("game-container");
        this.character = null;
        this.coins = [];
        this.score = 0;
        this.createScenary();
        this.addEvents();
    };

    createScenary() {
        this.character = new Character();
        this.container.appendChild(this.character.element);
        
        for(let i = 0; i < 8; i++) {
            const coin = new Coin();
            this.coins.push(coin);
            this.container.appendChild(coin.element);
        };

    };

    addEvents() {
        window.addEventListener("keydown",(e) => this.character.move(e));
        this.checkCollisions();
    };

    checkCollisions() {
        setInterval(() => {
            this.coins.forEach((coin, index) => {
                if (this.character.collisionWith(coin)){
                    this.container.removeChild(coin.element);
                    this.coins.splice(index, 1);
                };
            })
        });
    };

};

class Character {
    constructor() {

        };

        move() {

        };

        jump() {

        };

        fall() {

        };

        updatePosition() {

        };

        collisionWith() {

        };

};

class Coin {

};

const game = new Game();