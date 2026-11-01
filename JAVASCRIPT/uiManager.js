export class UIManager{
  constructor(GameManagerInstance){
    // Instance
    this._game = GameManagerInstance;

    // Debug window
    this._debugWindow = document.getElementById("debugWindow");
    this._debugText = this._debugWindow.querySelector(".debugText");
    this._debugButton = document.getElementById("debugButton");

    // Weather
    this._weather = document.getElementById("weather");

    // Character
    this._character0 = document.getElementById("character0");
    this._character1 = document.getElementById("character1");

    // All Button
    this._buttonMove = document.getElementById("buttonMove");
    this._buttonPass = document.getElementById("buttonPass");
    this._buttonRestart = document.getElementById("buttonRestart");
    this._buttonQuit = document.getElementById("buttonQuit");
    
    // Element Tile hand slot
    this._tileHandSlot0 = document.getElementById("tileHandSlot0");
    this._tileHandSlot1 = document.getElementById("tileHandSlot1");
    this._tileHandSlot2 = document.getElementById("tileHandSlot2");
    //this._tileHandSlot3 = document.getElementById("tileHandSlot3");
    //this._tileHandSlot4 = document.getElementById("tileHandSlot4");

    // Element Victory
    this._containerVictory = document.getElementById("containerVictory");
    this._textVictory = this._containerVictory.querySelector(".textVictory");
    
    // Variable local
    this._logFight = document.getElementById("logFight");
    this._textLogFight = [];
    this._maxLineLog = 50;
    this._numberLineLog = 0;

    // Load
    this.loadEvent();
  }

  // Getter Setter local
  // Log Fight
  get textLogFight() { return this._textLogFight; }
  set textLogFight(value) { this._textLogFight = value; }
  
  get maxLineLog() { return this._maxLineLog; }
  set maxLineLog(value) { this._maxLineLog = value; }

  // Debug
  get debugWindow() { return this._debugWindow; }
  set debugText(value) { this._debugText.textContent = value; }
  debugFunction(){
    this._game.player1.die = true;
  }

  // Other
  get weather() { return this._weather; }  
  
  // Function
  //Load 
  loadEvent(){
    // Button Action
    this._buttonMove.addEventListener("click", () => { this.moveButton(); } );
    this._buttonPass.addEventListener("click", () => { this.passButton(); });

    // Button Victory
    this._buttonQuit.addEventListener("click", () => { this.quitButton(); });
    this._buttonRestart.addEventListener("click", () => { this.restartButton(); });
    
    // Button base
    document.addEventListener("pointerdown", e => e.target.closest(".buttonBase")?.classList.add("pressed"));
    document.addEventListener("pointerup", e => e.target.closest(".buttonBase")?.classList.remove("pressed"));
    document.addEventListener("pointercancel", e => e.target.closest(".buttonBase")?.classList.remove("pressed"));

    // Character
    //this._character1.addEventListener("click", () => { this.targetCharacter(1); });
      
    // Debug
    this._debugButton.addEventListener("click", () => { this.debugFunction(); });

    // Tile hand
    this._tileHandSlot0.addEventListener("click", async () => { if(this._game.player1.turnFinish === false && this._game.player1.isCast === false){ await this._game.player1.useCard(0); } });
    this._tileHandSlot1.addEventListener("click", async () => { if(this._game.player1.turnFinish === false && this._game.player1.isCast === false){ await this._game.player1.useCard(1); } });
    this._tileHandSlot2.addEventListener("click", async () => { if(this._game.player1.turnFinish === false && this._game.player1.isCast === false){ await this._game.player1.useCard(2); } });
    //this._tileHandSlot3.addEventListener("click", () => { if(this._game.player1.turnFinish === false){ await this._game.player1.useCard(3); } });
    //this._tileHandSlot4.addEventListener("click", () => { if(this._game.player1.turnFinish === false){ await this._game.player1.useCard(4); } });     
  }

  // Action
  moveButton(){
    if(this._game.player1.turnFinish === false &&
      this._game.player1.forceMove < this._game.player1.pm &&
      this._game.player1.die === false){
        
      this._game.player1.forceMove++;
        
      if(this._game.player1.isWalking === false){ this._game.player1.move(1, false); }
    }    
  }
  passButton(){
    if(this._game.player1.turnFinish === false){
      this._game.endTurnPlayer();
    }
  }

  // Victory
  restartButton(){
    window.location.reload();
  }
  quitButton(){
    window.location.replace("index.html");
  }
  
  updateHand() {
    const hand = this._game.player1.hand;
    const slots = [this._tileHandSlot0, this._tileHandSlot1, this._tileHandSlot2];

    for (let i = 0; i < slots.length; i++) {
      const card = hand[i];

      if (card && card._icon) {
        slots[i].style.display = "flex";
        slots[i].style.backgroundImage = card._icon;
      }
      else {
        slots[i].style.display = "none";
        slots[i].style.backgroundImage = "none";
      }
    }
  }

  // Log fight
  addTextLogFight(text, caster, target) {
    if (this._textLogFight.length >= this._maxLineLog) { this._textLogFight.shift(); }
  
    this._textLogFight.push( caster + ":" + text + target);
    this._logFight.textContent = this._textLogFight.join("\n");
    this._logFight.scrollTop = this._logFight.scrollHeight;
  }
  addTextLog(text) {
    if (this._textLogFight.length >= this._maxLineLog) { this._textLogFight.shift(); }
  
    this._textLogFight.push(text);
    this._logFight.textContent = this._textLogFight.join("\n");
    this._logFight.scrollTop = this._logFight.scrollHeight;
  }
  removeLineTextLogFight(index){
    this._textLogFight.splice(index, 1);
  }

  // Other
  showVictory(player){
    this._containerVictory.style.display = "flex";
    
    if(player === this._game.player1){ this._textVictory.textContent = "Winner " + player.name + " !" }
    else{ this._textVictory.textContent = "Game over " + player.name + " !" }
  }
}