export class UIManager{
  constructor(gameManagerInstance){
    // Instance
    this.game = gameManagerInstance;
    
    // Information players
    this.infoPlayer1 = document.getElementById("infoPlayerLeftText");
    this.infoPlayer2 = document.getElementById("infoPlayerRightText");

    // Button
    this.buttonMove = document.getElementById("buttonMove");
    this.buttonEnd = document.getElementById("buttonEnd");
    this.buttonRestart = document.getElementById("buttonRestart");
    this.buttonQuit = document.getElementById("buttonQuit");
    
    // Tile hand slot
    this.tileHandSlot0 = document.getElementById("tileHandSlot0");
    this.tileHandSlot1 = document.getElementById("tileHandSlot1");
    this.tileHandSlot2 = document.getElementById("tileHandSlot2");
    //this.tileHandSlot3 = document.getElementById("tileHandSlot3");
    //this.tileHandSlot4 = document.getElementById("tileHandSlot4");

    // Victory
    this.victoryPlayer = document.getElementById("victoryPlayer");
    this.textVictory = document.getElementById("textVictory");
    
    // Variable
    this.logFight = document.getElementById("logFight");
    this.tabTextLogFight = [];
    this.maxLineLog = 6;
    this.numberLineLog = 0;
  }

  loadEvent(){
    this.buttonMove.addEventListener("click", () => { if(this.game.player1.getTurnFinish() === false){ this.game.player1.move(1); } } );
    this.buttonEnd.addEventListener("click", () => { if(this.game.player1.getTurnFinish() === false){ this.game.endTurnPlayer(); } });
    this.buttonRestart.addEventListener("click", () => { window.location.reload() });
    this.buttonQuit.addEventListener("click", () => { window.location.replace("index.html"); });
    
    
    this.tileHandSlot0.addEventListener("click", () => { if(this.game.player1.getTurnFinish() === false){this.game.player1.useCard(0); } });
    this.tileHandSlot1.addEventListener("click", () => { if(this.game.player1.getTurnFinish()=== false){this.game.player1.useCard(1); } });
    this.tileHandSlot2.addEventListener("click", () => { if(this.game.player1.getTurnFinish() === false){this.game.player1.useCard(2); } });
    //this.tileHandSlot3.addEventListener("click", () => { if(this.game.player1.getTurnFinish() === false){this.game.currentPlayer.useCard(3); } });
    //this.tileHandSlot4.addEventListener("click", () => { if(this.game.player1.getTurnFinish() === false){this.game.currentPlayer.useCard(4); } });     
  }

  addPlayersInfo(){
    this.infoPlayer1.textContent = this.game.player1.getName() + " | " + this.game.player1.getPm() + " pm";
    this.infoPlayer2.textContent = this.game.player2.getName() + " | " + this.game.player2.getPm() + " pm";
  }

  updatePlayersInfo() {
  // .join(" | ") rassemble les textes avec le séparateur
  const buffPlayer1 = this.game.player1.getBuff()?.join(" | ") || "";
  const deBuffPlayer1 = this.game.player1.getDeBuff()?.join(" | ") || "";

  const buffPlayer2 = this.game.player2.getBuff()?.join(" | ") || "";
  const deBuffPlayer2 = this.game.player2.getDeBuff()?.join(" | ") || "";

  //this.infoPlayer1.textContent = `${this.game.player1.getName()} | ${this.game.player1.getPm()} PM ${deBuffPlayer1} ${buffPlayer1}`;
  //this.infoPlayer2.textContent = `${deBuffPlayer2} ${buffPlayer2} ${this.game.player2.getPm()} PM | ${this.game.player2.getName()}`;

  this.infoPlayer1.textContent = this.game.player1.getName() + ": " + this.game.player1.getPm() + " pm";
  this.infoPlayer2.textContent = this.game.player2.getName() + ": " + this.game.player2.getPm() + " pm";

  
}

  addTextLogFight(text, caster, target, turn) {
  
  // 1. Si on a atteint le max, on retire l'élément le plus ancien (index 0)
  if (this.tabTextLogFight.length >= this.maxLineLog) {
    this.tabTextLogFight.shift(); // .shift() est plus lisible que .splice(0, 1)
  }
  
  // 2. On ajoute le texte brut dans le tableau (sans \n)
  this.tabTextLogFight.push( caster + ":" + text + target);
  
  // 3. On joint les éléments avec des sauts de ligne pour l'affichage
  this.logFight.textContent = this.tabTextLogFight.join("\n");
}

  removeLineTextLogFight(index){
    this.tabTextLogFight.splice(index, 1);
  }

  updateDeckUI(){ 
    // Slot 0
    if(this.game.player1.getHand()[0] != null) {
      //this.tileHandSlot0.textContent = this.game.player1.getHand()[0].name;
      this.tileHandSlot0.style.backgroundImage = this.game.player1.getHand()[0].icone;
      this.tileHandSlot0.hidden = false;
    }
    else{
      this.tileHandSlot0.textContent = "";
      this.tileHandSlot0.hidden = true;
      
    }
    
    // Slot 1
    if(this.game.player1.getHand()[1] != null) {
      //this.tileHandSlot1.textContent = this.game.player1.getHand()[1].name;
      this.tileHandSlot1.style.backgroundImage = this.game.player1.getHand()[1].icone;
      
      this.tileHandSlot1.hidden = false;
    }
    else{
      this.tileHandSlot1.textContent = "";
      this.tileHandSlot1.hidden = true;
      
    }
    
    // Slot 2
    if(this.game.player1.getHand()[2] != null) {
      //this.tileHandSlot2.textContent = this.game.player1.getHand()[2].name;
      this.tileHandSlot2.style.backgroundImage = this.game.player1.getHand()[2].icone;
      this.tileHandSlot2.hidden = false;
    }
    else{
      this.tileHandSlot2.textContent = "";
      this.tileHandSlot2.hidden = true;
      
    }
  }

  showVictory(indexPlayer){
    this.victoryPlayer.classList.remove("hidden");
    
    if(indexPlayer === 0){
      this.textVictory.textContent = "Winner !";
      
    }
    else{
      this.textVictory.textContent = "Game over !";
      
    }
  }
}