export class UIManager{
  constructor(gameManagerInstance){
    // Instance
    this.game = gameManagerInstance;

    // Element Debug window
    this.debugWindow = document.getElementById("debugWindow");
    this.debugText = document.getElementById("debugText");
    this.debugButton = document.getElementById("debugButton");

    // Character
    this.character0 = document.getElementById("character0");
    this.character1 = document.getElementById("character1");

    // Spell
    this.animEffect0 = document.getElementById("animEffect0");
    this.animEffect1 = document.getElementById("animEffect1");
     
    // Element Information players
    this.infoPlayer1 = document.getElementById("infoPlayerLeftText");
    this.infoPlayer2 = document.getElementById("infoPlayerRightText");

    // Element Button
    this.buttonMove = document.getElementById("buttonMove");
    this.buttonEnd = document.getElementById("buttonEnd");
    this.buttonRestart = document.getElementById("buttonRestart");
    this.buttonQuit = document.getElementById("buttonQuit");
    
    // Element Tile hand slot
    this.tileHandSlot0 = document.getElementById("tileHandSlot0");
    this.tileHandSlot1 = document.getElementById("tileHandSlot1");
    this.tileHandSlot2 = document.getElementById("tileHandSlot2");
    //this.tileHandSlot3 = document.getElementById("tileHandSlot3");
    //this.tileHandSlot4 = document.getElementById("tileHandSlot4");

    // Element Victory
    this.victoryPlayer = document.getElementById("victoryPlayer");
    this.textVictory = document.getElementById("textVictory");
    
    // Variable
    this.logFight = document.getElementById("logFight");
    this.tabTextLogFight = [];
    this.maxLineLog = 6;
    this.numberLineLog = 0;
  }

  // Load all event
  loadEvent(){
    this.buttonMove.addEventListener("click", () => { 
      if(this.game.player1.getTurnFinish() === false &&
        this.game.player1.forceMove < this.game.player1.getPm()){
        this.game.player1.forceMove++;
        if(this.game.player1.isWalking === false){ this.game.player1.move(1, 1);}
      } 
    } );
    
    this.buttonEnd.addEventListener("click", () => { if(this.game.player1.getTurnFinish() === false){ this.game.endTurnPlayer(); } });
    this.buttonRestart.addEventListener("click", () => { window.location.reload() });
    this.buttonQuit.addEventListener("click", () => { window.location.replace("index.html"); });

    // Debug
    this.debugButton.addEventListener("click", () => { this.testDebugButton(); });
    
    this.tileHandSlot0.addEventListener("click", async () => { if(this.game.player1.getTurnFinish() === false && this.game.player1.isCast === false){await this.game.player1.useCard(0); } });
    this.tileHandSlot1.addEventListener("click", async () => { if(this.game.player1.getTurnFinish()=== false && this.game.player1.isCast === false){await this.game.player1.useCard(1); } });
    this.tileHandSlot2.addEventListener("click", async () => { if(this.game.player1.getTurnFinish() === false && this.game.player1.isCast === false){await this.game.player1.useCard(2); } });
    //this.tileHandSlot3.addEventListener("click", () => { if(this.game.player1.getTurnFinish() === false){await this.game.currentPlayer.useCard(3); } });
    //this.tileHandSlot4.addEventListener("click", () => { if(this.game.player1.getTurnFinish() === false){await this.game.currentPlayer.useCard(4); } });     
  }

  // Debug window
  showDebugText(value){
    this.debugText.textContent = value;
  } // Show text variable debug

  testDebugButton(){
    this.game.player1.spellAnimation();
  } // Test function debug

  // Player info
  addPlayersInfo(){
    this.infoPlayer1.textContent = this.game.player1.getName() + ": " + this.game.player1.getPm() + " pm";
    this.infoPlayer2.textContent = this.game.player2.getName() + ": " + this.game.player2.getPm() + " pm";
  } // Add info player

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

  
  } // Update info player
  
  // Log Fight
  addTextLogFight(text, caster, target) {
  
  // 1. Si on a atteint le max, on retire l'élément le plus ancien (index 0)
  if (this.tabTextLogFight.length >= this.maxLineLog) {
    this.tabTextLogFight.shift(); // .shift() est plus lisible que .splice(0, 1)
  }
  
  // 2. On ajoute le texte brut dans le tableau (sans \n)
  this.tabTextLogFight.push( caster + ":" + text + target);
  
  // 3. On joint les éléments avec des sauts de ligne pour l'affichage
  this.logFight.textContent = this.tabTextLogFight.join("\n");
} // Add line text log fight

  removeLineTextLogFight(index){
    this.tabTextLogFight.splice(index, 1);
  } // Remove index line text l9g fight

  updateHand() {
    const hand = this.game.player1.getHand(); // On garde player1
    const slots = [this.tileHandSlot0, this.tileHandSlot1, this.tileHandSlot2];

    for (let i = 0; i < slots.length; i++) {
      const card = hand[i];

        if (card && card.icone) {
          slots[i].style.backgroundImage = card.icone;
          slots[i].hidden = false;
        }
        else {
          slots[i].hidden = true;
          slots[i].style.backgroundImage = "none";
        }
      }
  }

  // Victory / Game over
  showVictory(indexPlayer){
    this.victoryPlayer.classList.remove("hidden");
    
    if(indexPlayer === 0){
      this.textVictory.textContent = "Winner !";
      
    }
    else{
      this.textVictory.textContent = "Game over !";
      
    }
  } // Show window Victory / Game over
}