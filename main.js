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

    for (let i = 0; i < 8; i++) {
      const coin = new Coin();
      this.coins.push(coin);
      this.container.appendChild(coin.element);
    };
  };

  addEvents() {
    window.addEventListener("keydown", (e) => this.character.move(e));
    this.checkCollisions();
  };

  checkCollisions() {
    setInterval(() => {
      this.coins.forEach((coin, index) => {
        if (this.character.collisionWith(coin)) {
          this.container.removeChild(coin.element);
          this.coins.splice(index, 1);
        };
      });
    });
  };
};

class Character {
  constructor() {
    this.x = 50;
    this.y = 300;
    this.width = 50;
    this.height = 50;
    this.speed = 10;
    this.jumping = false;
    this.element = document.createElement("div");
    this.element.classList.add("personaje");
    this.updatePosition();
  };

  move(event) {

    if(event.key === "ArrowRight" || event.key == "d") {
        this.x += this.speed;
    }
    else if (event.key === "ArrowLeft" || event.key == "a"){
        this.x -= this.speed;
    }
    else if (event.key === "ArrowUp" || event.key == "w"){
        this.jump();
    }

    this.updatePosition();
// switch (event) {
//     case (event.key === "ArrowRight" || event.key == "d"):
//     this.x += this.speed;

//     case (event.key === "ArrowLeft" || event.key == "a"):
//     this.x -= this.speed;

//     case (event.key === "ArrowUp" || event.key == "w"):
//     this.jump();

//     this.updatePosition();
// }
  };

  jump() {
    this.jumping = true;
    let maxHeight = this.y - 100;
    const jump = setInterval(() => {
        if (this.y = maxHeight){
            this.y -= 9.8;
        }
        else {
            clearInterval(jump);
            this.fall();
        }
        this.updatePosition();
    }, 20);
  };

  fall() {};

  updatePosition() {};

  collisionWith() {};
}

class Coin {};

const game = new Game();
