class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.scoreElement = document.getElementById("puntos");
    this.resetButton =  document.getElementById("resetButton");
    this.containerText = document.getElementById("container-text");
    this.character = null;
    this.coins = [];
    this.score = 0;
    this.asteroids = this.introduceAsteroids(); //Cantidad de elementos a romper en el escenario
    this.createScenary();
    this.addEvents();
    this.checkCollisions();
    this.updateScore();
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
      }
  );
  }

  checkCollisions() {
    setTimeout(() => {
      if (this.container.contains(coin.element)) {
        this.container.removeChild(coin.element);
        this.coins.splice(index, 1);
        this.score++;
        this.updateScore();
        this.finishGame();
      }
    }, 2000);    
  }

  screenResButEvent(button) {
    button.addEventListener('click', () => { //Funcion flecha necesaria
      this.resetGame();
    });
  };

  buttonEvent(event){ //Resetea el juego con la r
    if (event.key == "r"){
      this.resetGame();
    }
  }

  updateScore() {
    this.scoreElement.textContent = `${this.score} asteroids broken of ${this.asteroids}.`;
  }

  finishGame() {
    if (this.score === this.asteroids) {
      this.containerText.textContent = `You won`;
      this.endSound();
      setTimeout(() => this.resetGame(), 3000);
    }
  };

  resetGame() {
    this.containerText.textContent = `Restarting game...`;
  
    setTimeout(() => {
      this.character.jumpSound(true);
      
      // Eliminar solo los elementos dinámicos (personaje y asteroides), sin borrar el mensaje
      this.container.querySelectorAll(".personaje, .moneda").forEach(el => el.remove());
  
      this.score = 0;
      this.updateScore();
      this.createScenary();
  
      // Borrar el mensaje despues de 1,5s
      setTimeout(() => {
        this.containerText.textContent = "";
      }, 1500);
  
    }, 1550);
  }
  
  
  introduceAsteroids(){
    let asteroidsNum;
    while (true) {
      asteroidsNum = parseInt(prompt("Introduce la cantidad de asteroides que quieres:"));
      if (!isNaN(asteroidsNum) && asteroidsNum > 0) return asteroidsNum;
      alert("Valor no válido. Introduce un número mayor a 0.");
    }
  }

  endSound() {
    const audio = document.getElementById("audioEnd");
    audio.currentTime = 0;
    audio.play();
  };

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
    super(650, 520, 50, 50);
    this.speed = 10;
    this.jumping = false;
    this.element.classList.add("personaje");
    super.updatePosition();
  }

  move(event) {
    if (event.key === "ArrowRight" || event.key === "d") {
      if (this.x + this.speed < 1335) this.x += this.speed; // Evitar que salga del contenedor
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
    this.jumpSound(false); //Insercion de efecto de sonido salto.

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
      if (this.y < 520) {  // Suelo.
        this.y += 10;  // Caida por intervalo.
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
      if (this.y < 520) {  // Suelo.
        this.y += 10;  // Caida por intervalo.
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
    if (end == true) { //DETENCION DEL SONIDO AL FINAL DEL JUEGO
      audio.pause();
    }
    else {
    audio.currentTime = 0;
    audio.play();
    }

  };

}

class Coin extends Entity {
  constructor() {
    super(Math.random() * 1300 + 50, Math.random() * 480 + 50, 30, 30);
    this.element.classList.add("moneda");
    super.updatePosition();
  }

  animateFall() {
    this.element.classList.add("coin-fall");
  }

}

const game = new Game();

//CODIGO COLLAPSIBLE

let coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
