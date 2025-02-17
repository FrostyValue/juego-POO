class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.scoreElement = document.getElementById("puntos");
    this.resetButton = document.getElementById("resetButton");
    this.muteButton = document.getElementById("muteButton");
    this.containerText = document.getElementById("container-text");
    this.containerWidth = this.container.clientWidth;
    this.containerHeight = this.container.clientHeight;
    this.character = null;
    this.coins = [];
    this.score = 0;
    this.level = 1;
    this.asteroids = this.introduceAsteroids();
    this.mute = false;

    this.createScenary();
    this.addEvents();
    this.checkCollisions();
    this.updateScore();
    this.screenMuButtonEvent(this.muteButton);
    this.screenResButEvent(this.resetButton);
  }

  createScenary() {
    this.character = new Character();
    this.container.appendChild(this.character.element);

    for (let i = 0; i < this.asteroids; i++) {
      const coin = new Coin();
      this.coins.push(coin);
      this.container.appendChild(coin.element);
    }
  }

  addEvents() {
    window.addEventListener("keydown", (e) => {
      this.character.move(e);
      this.buttonEvent(e);
    });

    window.addEventListener("resize", () => {
      game.character.updatePosition();
      game.coins.forEach(coin => coin.updatePosition());
    });

  }

  // Logica de colisiones modificada para que no entre en conflicto con la animacion, si no se marca como cayendo y se deja 
  // la version anterior no contabiliza algunos asteroides, creandose un bug en el juego que impide su finalización.
  checkCollisions() {
    setInterval(() => {
      this.coins = this.coins.filter((coin) => {
        if (this.character.collisionWith(coin) && !coin.isFalling) { //Se comprueba que la moneda no esta cayendo a parte de la colision.
          coin.isFalling = true; //Aqui se marca que esta cayendo
          coin.animateFall();
          setTimeout(() => {
            this.container.removeChild(coin.element);
            this.score++;
            this.updateScore();
            this.finishGame();
          }, 2000);
          return false;
        }
        return true;
      });
    }, 100);
  }

  screenResButEvent(button) {
    button.addEventListener("click", () => {
      this.resetGame();
    });
  }

  screenMuButtonEvent(button) {
    button.addEventListener(`click`, () => {
      this.muteGame();
    });
  }

  buttonEvent(event) {
    //Resetea el juego con la r
    if (event.key == "r") {
      this.resetGame();
    }

    if (event.key == "m") {
        this.muteGame();
    }
  }

  updateScore() {
    this.scoreElement.textContent = `${this.score} asteroids broken of ${this.asteroids}.`;
  }

  finishGame() {
    if (this.score === this.asteroids) {
      if (this.level < 200) {
        this.level++;
        if (this.level % 25 === 0) {
          this.character.increaseSpeed();
        }
        this.resetGame(false);
      } else {
        this.containerText.textContent = `You completed all levels!`;
        this.endSound(this.mute);
        setTimeout(() => this.resetGame(true), 3000);
      }
    }
  }

  resetGame(fullReset) {
    this.containerText.textContent = `Restarting game...`;
    setTimeout(() => {
      this.character.jumpSound(true);
      this.container.querySelectorAll(".personaje, .moneda").forEach((el) => el.remove());
      this.score = 0;
      this.asteroids = this.introduceAsteroids();
      if (fullReset) this.level = 1;
      this.updateScore();
      this.createScenary();
      setTimeout(() => {
        this.containerText.textContent = "";
      }, 1500);
    }, 1550);
  }

  muteGame() {
    if (this.mute === true) {
        this.mute = false;
        this.muteButton.textContent = "";
        this.muteButton.textContent = "Mute"
    }

    else {
        this.mute = true;
        this.muteButton.textContent = "";
        this.muteButton.textContent = "Unmute"
    }

  }

  introduceAsteroids() {
    return this.level; // Asteroides igual al nivel actual
  }

  updateScore() {
    this.scoreElement.textContent = `Level ${this.level} - ${this.score} asteroids broken of ${this.asteroids}.`;
  }

  endSound(mute) {
    while (mute) {
      return;
    }

    const audio = document.getElementById("audioEnd");
    audio.currentTime = 0;
    audio.play();
  }
  
}

class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.element = document.createElement("div");
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}

class Character extends Entity {
  constructor() {
    const container = document.getElementById("game-container");
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    super(containerWidth * 0.5, containerHeight * 0.85, containerWidth * 0.05, containerHeight * 0.1);
    this.container = container;
    this.speed = containerWidth * 0.02;
    this.jumping = false;
    this.element.classList.add("personaje");
    super.updatePosition();
  }

  move(event) {
    const containerWidth = this.container.clientWidth; // Obtener el ancho actualizado

    if (event.key === "ArrowRight" || event.key === "d") {
      if (this.x + this.speed < containerWidth - this.width) this.x += this.speed; // Evitar que salga del contenedor
    } else if (event.key === "ArrowLeft" || event.key === "a") {
      if (this.x - this.speed > 0) this.x -= this.speed;
    } else if (event.key === "ArrowUp" || event.key === "w") {
      if (!this.jumping) this.jump();
    }

    super.updatePosition();
  }

  jump() {
    this.jumping = true;
    let maxHeight = this.y - 480;
    if (game.mute) {
      this.jumpSound(true);
    } else {
      this.jumpSound(false); //Insercion de efecto de sonido salto.
    }
    const jumpInterval = setInterval(() => {
      if (this.y > maxHeight) {
        this.y -= 10;
        super.updatePosition();
      } else {
        clearInterval(jumpInterval);
        this.fall();
      }
    }, 20);
  }

  fall() {
    const gravityInterval = setInterval(() => {
      if (this.y < 520) {
        // Suelo.
        this.y += 10; // Caida por intervalo.
        super.updatePosition();
      } else {
        this.y = 520;
        clearInterval(gravityInterval);
        this.jumping = false;
      }
    }, 20);
  }


  fallCollision() {
    const gravityInterval = setInterval(() => {
      if (this.y < 520) {
        // Suelo.
        this.y += 10; // Caida por intervalo.
        super.updatePosition();
      } else {
        this.y = 520;
        clearInterval(gravityInterval);
        this.jumping = false;
      }
    }, 20);
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
    if (end == true) {
      //DETENCION DEL SONIDO AL FINAL DEL JUEGO/MUTE
      audio.pause();
    } else {
      audio.currentTime = 0;
      audio.play();
    }
  }

  increaseSpeed() {
    this.speed *= 1.1; // Aumenta la velocidad en un 10%
  }
  
}

class Coin extends Entity {
  constructor() {
    const container = document.getElementById("game-container");
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    super(
      Math.random() * (containerWidth * 0.9) + (containerWidth * 0.05),
      Math.random() * (containerHeight * 0.8) + (containerHeight * 0.1),
      containerWidth * 0.05,
      containerHeight * 0.1
    );

    this.element.classList.add("moneda");
    super.updatePosition();
  }

  animateFall() {
    this.element.classList.add("coin-fall");
  }
}

const game = new Game();