class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.scoreElement = document.getElementById("puntos");
    this.character = null;
    this.coins = [];
    this.score = 0;
    this.bricks = 2;//prompt("Introduce la cantidad de ladrillos que quieres:"); //Cantidad de elementos a romper en el escenario
    this.createScenary();
    this.addEvents();
    this.checkCollisions();
    this.updateScore();
  }

  createScenary() {
    this.character = new Character();
    this.container.appendChild(this.character.element);

    for (let i = 0; i < this.bricks; i++) {
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
          coin.animateFall();
          setTimeout(() => {
            this.container.removeChild(coin.element);
            this.coins.splice(index, 1);
            this.score++;
            this.updateScore();
            this.resetGame();
          }, 2000)
        }
      });
    }, 100);
  }

  updateScore() {
    this.scoreElement.textContent = `${this.score} broken of ${this.bricks}.`;
  }

  resetGame() {
    if (this.score === this.bricks){
      this.scoreElement.textContent = `You won.`;
      this.endSound();
      setTimeout(() => {
        this.scoreElement.textContent = `Reseting game...`;
      }, 500)
      setTimeout(() => {
        this.character.jumpSound(true);
        this.container.innerHTML = ""; // Limpiar el contenedor
        this.score = 0;
        this.updateScore();
        this.createScenary();
        this.bricks = 1;  //prompt("Introduce la cantidad de ladrillos que quieres:"); //Cantidad de elementos a romper en el escenario
        this.checkCollisions();
      }, 1000)
    }
  };

  endSound() {
    const audio = document.getElementById("audioEnd");
    audio.currentTime = 0;
    audio.play();
  };

}

class Character {
  constructor() {
    this.x = 650;
    this.y = 530;
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
      if (this.x + this.speed < 1335) this.x += this.speed; // Evitar que salga del contenedor
    } else if (event.key === "ArrowLeft" || event.key === "a") {
      if (this.x - this.speed > 0) this.x -= this.speed;
    } else if (event.key === "ArrowUp" || event.key === "w") {
      if (!this.jumping) this.jump();
    }

    this.updatePosition();

  }

  jump() {
    this.jumping = true;
    let maxHeight = this.y - 480;
    this.jumpSound(false); //Insercion de efecto de sonido salto.
    
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
      if (this.y < 530) {  // Suelo.
        this.y += 10;  // Caida por intervalo.
        this.updatePosition();
      } else {
        this.y = 530;
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

  jumpSound(end) {
    const audio = document.getElementById("audioJump");
    if (end == true) { //DETENCION DEL SONIDO AL FINAL DEL JUEGO
      console.log("Audio salto")
      audio.pause();
    }
    else {
    audio.currentTime = 0;
    audio.play();
    }

  };

}

class Coin {
  constructor() {
    this.x = Math.random() * 1300 + 50;
    this.y = Math.random() * 520 + 50;
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

  animateFall() {
    this.element.classList.add("coin-fall");
  }

}

const game = new Game();