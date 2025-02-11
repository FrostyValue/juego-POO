class Game {
    constructor() {
      this.container = document.getElementById("game-container");
      this.character = null;
      this.coins = [];
      this.score = 0;
      this.createScenery();
      this.addEvents();
      this.checkCollisions();
    }
  
    createScenery() {
      this.character = new Character();
      this.container.appendChild(this.character.element);
  
      for (let i = 0; i < 5; i++) {
        const coin = new Coin();
        this.coins.push(coin);
        this.container.appendChild(coin.element);
      }
    }
  
    addEvents() {
      window.addEventListener("keydown", (e) => this.character.move(e));
    }
  
    checkCollisions() {
      setInterval(() => {
        this.coins.forEach((coin, index) => {
          if (this.character.collisionWith(coin)) {
            this.container.removeChild(coin.element);
            this.coins.splice(index, 1);
            this.score++;
            console.log(`Score: ${this.score}`);
          }
        });
      }, 100);
    }
  }
  
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
    }
  
    move(event) {
      if (event.key === "ArrowRight" || event.key === "d") {
        if (this.x + this.speed < 750) this.x += this.speed; // Evitar que salga del contenedor
      } else if (event.key === "ArrowLeft" || event.key === "a") {
        if (this.x - this.speed > 0) this.x -= this.speed;
      } else if (event.key === "ArrowUp" || event.key === "w") {
        if (!this.jumping) this.jump();
      }
  
      this.updatePosition();
    }
  
    jump() {
      this.jumping = true;
      let maxHeight = this.y - 275;
      const jumpInterval = setInterval(() => {
        if (this.y > maxHeight) {
          this.y -= 10;
          this.updatePosition();
        } else {
          clearInterval(jumpInterval);
          this.fall();
        }
      }, 20);
    }
  
    fall() {
      const gravityInterval = setInterval(() => {
        if (this.y < 300) {
          this.y += 10;
          this.updatePosition();
        } else {
          clearInterval(gravityInterval);
          this.jumping = false;
        }
      }, 20);
    }
  
    updatePosition() {
      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;
    }
  
    collisionWith(object) {
      return (
        this.x < object.x + object.width &&
        this.x + this.width > object.x &&
        this.y < object.y + object.height &&
        this.y + this.height > object.y
      );
    }
  }
  
  class Coin {
    constructor() {
      this.x = Math.random() * 700 + 50;
      this.y = Math.random() * 250 + 50;
      this.width = 30;
      this.height = 30;
      this.element = document.createElement("div");
      this.element.classList.add("moneda");
      this.updatePosition();
    }
  
    updatePosition() {
      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;
    }
  }
  
  const game = new Game();
  