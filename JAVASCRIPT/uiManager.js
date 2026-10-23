export class UIManager{
  constructor(GameManagerInstance){
    // Instance
    this._game = GameManagerInstance;

    // Element Debug window
    this._debugWindow = document.getElementById("debugWindow");
    this._debugText = document.getElementById("debugText");
    this._debugButton = document.getElementById("debugButton");

    // Character
    this._character0 = document.getElementById("character0");
    this._character1 = document.getElementById("character1");

    // Spell
    this._animEffect0 = document.getElementById("animEffect0");
    this._animEffect1 = document.getElementById("animEffect1");
     
    // Element Information players
    this._infoPlayer1 = document.getElementById("infoPlayerLeftText");
    this._infoPlayer2 = document.getElementById("infoPlayerRightText");

    // Element Button
    this._buttonMove = document.getElementById("buttonMove");
    this._buttonEnd = document.getElementById("buttonEnd");
    this._buttonRestart = document.getElementById("buttonRestart");
    this._buttonQuit = document.getElementById("buttonQuit");
    
    // Element Tile hand slot
    this._tileHandSlot0 = document.getElementById("tileHandSlot0");
    this._tileHandSlot1 = document.getElementById("tileHandSlot1");
    this._tileHandSlot2 = document.getElementById("tileHandSlot2");
    //this._tileHandSlot3 = document.getElementById("tileHandSlot3");
    //this._tileHandSlot4 = document.getElementById("tileHandSlot4");

    // Element Victory
    this._victoryPlayer = document.getElementById("victoryPlayer");
    this._textVictory = document.getElementById("textVictory");
    
    // Variable local
    this._logFight = document.getElementById("logFight");
    this._textLogFight = [];
    this._maxLineLog = 6;
    this._numberLineLog = 0;
  }

  // Getter local
  get textLogFight() { return this._textLogFight; }
  get maxLineLog() { return this._maxLineLog; }
  get debugWindow() { return this._debugWindow; }

  // Setter local
  set textLogFight(value) { this._textLogFight = value; }
  set maxLineLog(value) { this._maxLineLog = value; }
  set debugText(value){ this._debugText.textContent = value; }

  // Getter Externe
  get player1(){ return this._game.player1; }
  get player2() { return this._game.player2; }
  get currentPlayer() { return this._game.currentPlayer; }
  get opponentPlayer() { return this._game.opponentPlayer; }

  loadUI(){
    this.loadEvent();
    this.addTextLogFight(" commence !", this.opponentPlayer.name, "");
    this.updatePlayersInfo();    
  }
  
  // Load all event
  loadEvent(){
    this._buttonMove.addEventListener("click", () => {
      if(this.player1.turnFinish === false && this.player1.forceMove < this.player1.pm){
        this.player1.forceMove++;
        if(this.player1.isWalking === false){
          this.player1.move(1, 1);
        }
      } 
    } );
    
    this._buttonEnd.addEventListener("click", () => { if(this.player1.turnFinish === false){ this._game.endTurnPlayer(); } });
    this._buttonRestart.addEventListener("click", () => { window.location.reload() });
    this._buttonQuit.addEventListener("click", () => { window.location.replace("index.html"); });

    // Debug
    this._debugButton.addEventListener("click", () => { this.debugFunction(); });
    
    this._tileHandSlot0.addEventListener("click", async () => { if(this.player1.turnFinish === false && this.player1.isCast === false){await this.player1.useCard(0); } });
    this._tileHandSlot1.addEventListener("click", async () => { if(this.player1.turnFinish === false && this.player1.isCast === false){await this.player1.useCard(1); } });
    this._tileHandSlot2.addEventListener("click", async () => { if(this.player1.turnFinish === false && this.player1.isCast === false){await this.player1.useCard(2); } });
    //this._tileHandSlot3.addEventListener("click", () => { if(this.player1.turnFinish === false){await this.currentPlayer.useCard(3); } });
    //this._tileHandSlot4.addEventListener("click", () => { if(this.player1.turnFinish === false){await this.currentPlayer.useCard(4); } });     
  }
  
  // Update 
  updatePlayersInfo() {
    this._infoPlayer1.textContent = this.player1.name + ": " + this.player1.pm + " pm";
    this._infoPlayer2.textContent = this.player2.name + ": " + this.player2.pm + " pm";  
  }

  updateHand() {
    const hand = this.player1.hand;
    const slots = [this._tileHandSlot0, this._tileHandSlot1, this._tileHandSlot2];

    for (let i = 0; i < slots.length; i++) {
      const card = hand[i];

        if (card && card.icone) {
          slots[i].style.backgroundImage = card.icone;
          slots[i].style.display = "flex";
        }
        else {
          slots[i].style.display = "none";
          slots[i].style.backgroundImage = "none";
        }
      }
  }

  // Log fight
  addTextLogFight(text, caster, target) {
  
  // 1. Si on a atteint le max, on retire l'élément le plus ancien (index 0)
  if (this._textLogFight.length >= this._maxLineLog) {
    this._textLogFight.shift(); // .shift() est plus lisible que .splice(0, 1)
  }
  
  // 2. On ajoute le texte brut dans le tableau (sans \n)
  this._textLogFight.push( caster + ":" + text + target);
  
  // 3. On joint les éléments avec des sauts de ligne pour l'affichage
  this._logFight.textContent = this._textLogFight.join("\n");
}

  removeLineTextLogFight(index){
    this._textLogFight.splice(index, 1);
  }

  // Other
  showVictory(player){
    this._victoryPlayer.style.display = "flex";
    
    if(player === this.player1){ this._textVictory.textContent = "Winner " + player.name + " !" }
    else{ this._textVictory.textContent = "Game over " + player.name + " !" }
  }

  debugFunction(){
    
  }
}