export class UIManager{
  constructor(GameManagerInstance){
    // Instance
    this._game = GameManagerInstance;
    
    this._hiddenGame = null;
    this._textHiddenGame = null;
    this._debugWindow = null;
    this._debugText = null;
    this._debugButton = null;
    this._elemWeather = null;
    this._character0 = null;
    this._character1 = null;
    this._character2 = null;
    this._character3 = null;
    this._contInfoPlayer = null;
    this._elemCharacterInfoPlayer = null;
    this._elemTextInfoPlayer = null;
    this._buttonMove = null;
    this._buttonPass = null;
    this._buttonRestart = null;
    this._buttonQuit = null;
    this._tileHandSlot0 = null;
    this._tileHandSlot1 = null;
    this._tileHandSlot2 = null;
    this._containerVictory = null;
    this._textVictory = null;
    
    this._logFight = null;
    this._textLogFight = [];
    this._maxLineLog = 50;
    this._numberLineLog = 0;
  }

  // Getter Setter local
  // Log Fight
  get textLogFight() {
    return this._textLogFight;
  }
  set textLogFight(value) {
    this._textLogFight = value;
  }
  
  get maxLineLog() {
    return this._maxLineLog;
  }
  set maxLineLog(value) {
    this._maxLineLog = value;
  }

  // Debug
  get debugWindow() {
    return this._debugWindow;
  }
  set debugText(value) {
    this._debugText.textContent = value;
  }
  debugFunction(){
    this._game.player1.die();
  }

  // Other
  get elemWeather() {
    return this._elemWeather;
  }

  // Hidden game
  get hiddenGame(){
    return this._hiddenGame;
  }
  get textHiddenGame(){
    return this._textHiddenGame;
  }
  
  // Function
  //Load
  async load(){
    this.loadDoc();
    this.loadEvent();
  }
  loadDoc(){
    this._hiddenGame = document.getElementById("hiddenGame");
    this._textHiddenGame = this._hiddenGame.querySelector(".textHiddenGame");
    this._textHiddenGame.textContent = "Chargement du jeu...";
    
    this._debugWindow = document.getElementById("debugWindow");
    this._debugText = this._debugWindow.querySelector(".debugText");
    this._debugButton = document.getElementById("debugButton");

    this._elemWeather = document.getElementById("elemWeather");

    this._character0 = document.getElementById("character0");
    this._character1 = document.getElementById("character1");
    this._character2 = document.getElementById("character2");
    this._character3 = document.getElementById("character3");

    this._contInfoPlayer = document.querySelector(".contInfoPlayer");
    this._elemCharacterInfoPlayer = this._contInfoPlayer.querySelector(".elemCharacterInfoPlayer");
    this._elemTextInfoPlayer = this._contInfoPlayer.querySelector(".elemTextInfoPlayer");
    
    this._buttonMove = document.getElementById("buttonMove");
    this._buttonPass = document.getElementById("buttonPass");
    this._buttonRestart = document.getElementById("buttonRestart");
    this._buttonQuit = document.getElementById("buttonQuit");
    
    this._tileHandSlot0 = document.getElementById("tileHandSlot0");
    this._tileHandSlot1 = document.getElementById("tileHandSlot1");
    this._tileHandSlot2 = document.getElementById("tileHandSlot2");

    this._containerVictory = document.getElementById("containerVictory");
    this._textVictory = this._containerVictory.querySelector(".textVictory");
    
    this._logFight = document.getElementById("logFight");
  
  }
  loadEvent(){    
    // Button Action
    this._buttonMove.addEventListener("click", () => { this.clickMoveButton(); } );
    this._buttonPass.addEventListener("click", () => { this.clickPassButton(); });

    // Button Victory
    this._buttonQuit.addEventListener("click", () => { this.clickQuitButton(); });
    this._buttonRestart.addEventListener("click", () => { this.clickRestartButton(); });
    
    // Button base
    document.addEventListener("pointerdown", e => e.target.closest(".buttonBase")?.classList.add("pressed"));
    document.addEventListener("pointerup", e => e.target.closest(".buttonBase")?.classList.remove("pressed"));
    document.addEventListener("pointercancel", e => e.target.closest(".buttonBase")?.classList.remove("pressed"));

    // Debug
    this._debugButton.addEventListener("click", () => { this.debugFunction(); });

    // Tile hand
    this._tileHandSlot0.addEventListener("click", async () => { this.clickTileHandSlot(0); });
    this._tileHandSlot1.addEventListener("click", async () => { this.clickTileHandSlot(1); });
    this._tileHandSlot2.addEventListener("click", async () => { this.clickTileHandSlot(2); });
    //this._tileHandSlot3.addEventListener("click", () => { if(this._game.player1.turnFinish === false){ await this._game.player1.useCard(3); } });
    //this._tileHandSlot4.addEventListener("click", () => { if(this._game.player1.turnFinish === false){ await this._game.player1.useCard(4); } });     
  }

  async clickTileHandSlot(index){    
    if(!this._game.currentPlayer.isPlayerIA && !this._game.currentPlayer.isTurnFinish &&
       !this._game.currentPlayer.isCast && !this._game.currentPlayer.isDie && !this._game.currentPlayer.isWalking){
      
      await this._game.currentPlayer.useCard(index, this._game.selectedPlayer);
    }
  }

  // Action
  async clickMoveButton(){    
    if(!this._game.currentPlayer.isPlayerIA && !this._game.currentPlayer.isTurnFinish &&
      this._game.currentPlayer.pm > 0 && !this._game.currentPlayer.isDie){
        
      this._game.currentPlayer.addNodePath(1, 1);
        
      if(!this._game.currentPlayer.isWalking){ await this._game.currentPlayer.move(1); }
    }    
  }
  clickPassButton(){    
    if(!this._game.currentPlayer.isPlayerIA && !this._game.currentPlayer.isTurnFinish &&
      !this._game.currentPlayer.isWalking){
      this._game.endTurnPlayer();
    }
  }

  // Victory
  clickRestartButton(){
    window.location.reload();
  }
  clickQuitButton(){
    window.location.replace("index.html");
  }
  
  updateHand() {
    const hand = this._game.currentPlayer.hand;
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

  // Info player
  profileCurrentPlayer(){
    const race = this._game.currentPlayer.getRace();    
    this._elemCharacterInfoPlayer.style.backgroundImage = `url('IMAGE/CHARACTER/${race}/profile.png')`;
  }
  profileSelectedPlayer(){
    const race = this._game.selectedPlayer.getRace();
    this._elemCharacterInfoPlayer.style.backgroundImage = `url('IMAGE/CHARACTER/${race}/profile.png')`;
  }

  // Info player
  targetInfoPlayer(){
    if(this._game.selectedPlayer === null){
      this.profileCurrentPlayer();
      this._elemTextInfoPlayer.textContent = this._game.currentPlayer ? `${this._game.currentPlayer.name}: ${this._game.currentPlayer.pm} pm` : "";
    }
    else if(this._game.selectedPlayer.isDie){
      this.profileSelectedPlayer();
      this._elemTextInfoPlayer.textContent = this._game.selectedPlayer ? `${this._game.selectedPlayer.name}: ${this._game.selectedPlayer.currentTurnRespawn} tour` : "";
    }
    else{
      this.profileSelectedPlayer(); 
      this._elemTextInfoPlayer.textContent = this._game.selectedPlayer ? `${this._game.selectedPlayer.name}: ${this._game.selectedPlayer.pm} pm` : "";
    }
  }

  paintTileElement(element, color){
    element.style.backgroundColor = color;
  }

  // Other
  showVictory(player){
    this._containerVictory.style.display = "flex";
    
    if(player.name === this._game.player1.name){ this._textVictory.textContent = "Winner " + player.name + " !" }
    else{ this._textVictory.textContent = "Game over " + player.name + " !" }
  }
}