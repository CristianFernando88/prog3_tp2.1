class Card {
    constructor(name, img) {
        this.name = name;
        this.img = img;
        this.isFlipped = false;
        this.element = this.#createCardElement();
    }

    #createCardElement() {
        const cardElement = document.createElement("div");
        cardElement.classList.add("cell");
        cardElement.innerHTML = `
          <div class="card" data-name="${this.name}">
              <div class="card-inner">
                  <div class="card-front"></div>
                  <div class="card-back">
                      <img src="${this.img}" alt="${this.name}">
                  </div>
              </div>
          </div>
      `;
        return cardElement;
    }

    #flip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.add("flipped");
    }

    #unflip() {
        const cardElement = this.element.querySelector(".card");
        cardElement.classList.remove("flipped");
    }

    /* - Definir el método `toggleFlip()` que cambia el estado de volteo de la carta en función de su estado actual.
    - Implementar el método `matches(otherCard)` que verifica si la carta actual coincide con otra carta. */
    toggleFlip(){
        if(this.isFlipped){
            this.#unflip();
            this.isFlipped = false;
        }else{
            this.#flip();
            this.isFlipped = true;
        }
        
    }

    matches(otherCard){
        return this.name === otherCard.name ? true : false;
    }
}

class Board {
    constructor(cards) {
        this.cards = cards;
        this.fixedGridElement = document.querySelector(".fixed-grid");
        this.gameBoardElement = document.getElementById("game-board");
    }

    #calculateColumns() {
        const numCards = this.cards.length;
        let columns = Math.floor(numCards / 2);

        columns = Math.max(2, Math.min(columns, 12));

        if (columns % 2 !== 0) {
            columns = columns === 11 ? 12 : columns - 1;
        }

        return columns;
    }

    #setGridColumns() {
        const columns = this.#calculateColumns();
        this.fixedGridElement.className = `fixed-grid has-${columns}-cols`;
    }

    render() {
        this.#setGridColumns();
        this.gameBoardElement.innerHTML = "";
        this.cards.forEach((card) => {
            card.element
                .querySelector(".card")
                .addEventListener("click", () => this.onCardClicked(card));
            this.gameBoardElement.appendChild(card.element);
        });
    }

    onCardClicked(card) {
        if (this.onCardClick) {
            this.onCardClick(card);
        }
    }

    /* - Implementar el método `shuffleCards()` que mezcla las cartas del tablero. El criterio de mezcla esta dispuesto a elección del estudiante.
    - Implementar el método `reset()` que reinicia el tablero.
    - Implementar el método `flipDownAllCards()` que posiciona todas las cartas en su estado inicial. Es necesario para reiniciar el tablero.
    - Implementar el método `reset()` que reinicia el tablero. Debe emplear otros métodos de la clase `Board` para realizar esta tarea. */
    shuffleCards(){
        this.cards.sort((a,b) => Math.random() - 0.5);
    }
    
    flipDownAllCards(){
        this.cards.forEach((card)=>{
            if(card.isFlipped){
                card.toggleFlip();
            }
        }) 
    }
    reset(){
        this.flipDownAllCards();
        this.shuffleCards();
        this.render();
    }
}

class MemoryGame {
    constructor(board, flipDuration = 500) {
        this.board = board;
        this.flippedCards = [];
        this.matchedCards = [];
        if (flipDuration < 350 || isNaN(flipDuration) || flipDuration > 3000) {
            flipDuration = 350;
            alert(
                "La duración de la animación debe estar entre 350 y 3000 ms, se ha establecido a 350 ms"
            );
        }
        this.flipDuration = flipDuration;
        this.board.onCardClick = this.#handleCardClick.bind(this);
        this.board.reset();
    }

    #handleCardClick(card) {
        if (this.flippedCards.length < 2 && !card.isFlipped) {
            card.toggleFlip();
            this.flippedCards.push(card);

            if (this.flippedCards.length === 2) {
                setTimeout(() => this.checkForMatch(), this.flipDuration);
            }
        }
    }
    /* - Implementar el método `checkForMatch()` que verifica si las cartas volteadas coinciden. En caso de coincidir, las cartas deben ser añadidas al conjunto de cartas emparejadas. Es fundamental para que el método `#handleCardClick()` funcione correctamente.
    - Implementar el método `resetGame()` que reinicia el juego. Debe emplear otros métodos de la clase `MemoryGame` para realizar esta tarea. */
    checkForMatch(){
        if(this.flippedCards[0].matches(this.flippedCards[1])){
            this.matchedCards.push(this.flippedCards[0]);
            this.matchedCards.push(this.flippedCards[1]);
        }else{
            this.flippedCards[0].toggleFlip();
            this.flippedCards[1].toggleFlip();
        }
        this.flippedCards=[];
    }

    resetGame(){
        this.board.reset()
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const cardsData = [
        { name: "Python", img: "./img/Python.svg" },
        { name: "JavaScript", img: "./img/JS.svg" },
        { name: "Java", img: "./img/Java.svg" },
        { name: "CSharp", img: "./img/CSharp.svg" },
        { name: "Go", img: "./img/Go.svg" },
        { name: "Ruby", img: "./img/Ruby.svg" },
    ];

    const cards = cardsData.flatMap((data) => [
        new Card(data.name, data.img),
        new Card(data.name, data.img),
    ]);
    const board = new Board(cards);
    const memoryGame = new MemoryGame(board, 1000);

    document.getElementById("restart-button").addEventListener("click", () => {
        memoryGame.resetGame();
    });
});
