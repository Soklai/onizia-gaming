export class UIManager{
  constructor(GameManagerInstance){
    // Instance
    this._game = GameManagerInstance;

    // Hidden
    this._hiddenGame = null;
    this._textHiddenGame = null;

    // Debug
    this._debugWindow = null;
    this._debugText = null;
    this._debugButton = null;

    // Météo
    this._elemWeather = null;

    // Character
    this._character0 = null;
    this._character1 = null;
    this._character2 = null;
    this._character3 = null;

    // Info player
    this._contInfoPlayer = null;

    // Right
    this._contInfoPlayerRight = null;
    this._elemCharacterInfoPlayerRight = null;
    this._elemTextInfoPlayerRight = null;

    // Left
    this._contInfoPlayerLeft = null;
    this._elemCharacterInfoPlayerLeft = null;
    this._elemTextInfoPlayerLeft = null;

    // Button Action
    this._buttonMove = null;
    this._buttonPass = null;

    // Victory
    this._buttonRestart = null;
    this._buttonQuit = null;
    this._containerVictory = null;
    this._textVictory = null;

    // Hand
    this._tileHandSlot0 = null;
    this._tileHandSlot1 = null;
    this._tileHandSlot2 = null;
    
    // Log fight
    this._logFight = null;
    this._textLogFight = [];
    this._maxLineLog = 50;
    this._numberLineLog = 0;
  }

  // Getter Setter
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

  // Can
  canPass(){
    if (!this._game.currentPlayer.isPlayerIA &&
        !this._game.currentPlayer.isTurnFinish &&
        !this._game.currentPlayer.isWalking){
      
      return true;
    }
    else{
      return false;
    }
    
    return false;
  }
  cantPass(){
    if (this._game.currentPlayer.isPlayerIA) this.addTextLog("Ce n'est pas a votre tour de jouer !");
    if (this._game.currentPlayer.isTurnFinish) this.addTextLog("Ce n'est pas a votre tour de jouer !");
    if (this._game.currentPlayer.isDie) this.addTextLog("Vous êtes mort !");
    if (this._game.currentPlayer.isCast) this.addTextLog("Vous lancer un sort impossible de marcher !")
    if (this._game.currentPlayer.isWalking) this.addTextLog("Vous marcher impossible de passer votre tour !")
  }
  canMove(){
    if (!this._game.currentPlayer.isPlayerIA &&
        !this._game.currentPlayer.isTurnFinish &&
        this._game.currentPlayer.pm > 0 &&
        !this._game.currentPlayer.isDie &&
        !this._game.currentPlayer.isCast){
      
      return true;
    }
    else{
      return false;
    }
    
    return false;
  }
  cantMove(){
    if (this._game.currentPlayer.isPlayerIA) this.addTextLog("Ce n'est pas a votre tour de jouer !");
    if (this._game.currentPlayer.isTurnFinish) this.addTextLog("Ce n'est pas a votre tour de jouer !");
    if (this._game.currentPlayer.pm <= 0) this.addTextLog("Vous n'avez plus de point de mouvement !");
    if (this._game.currentPlayer.isDie) this.addTextLog("Vous êtes mort !");
    if (this._game.currentPlayer.isCast) this.addTextLog("Vous lancer un sort impossible de marcher !")
  }
  
  // Function
  //Load
  async load(){
    // Charge les éléments
    this.loadDoc();

    // Charge les événements
    this.loadEvent();
  }
  loadDoc(){
    // Hidden
    this._hiddenGame = document.getElementById("hiddenGame");
    this._textHiddenGame = this._hiddenGame.querySelector(".textHiddenGame");
    this._textHiddenGame.textContent = "Chargement du jeu...";

    // Debug
    this._debugWindow = document.getElementById("debugWindow");
    this._debugText = this._debugWindow.querySelector(".debugText");
    this._debugButton = document.getElementById("debugButton");

    // Weather
    this._elemWeather = document.getElementById("elemWeather");

    // Character
    this._character0 = document.getElementById("character0");
    this._character1 = document.getElementById("character1");
    this._character2 = document.getElementById("character2");
    this._character3 = document.getElementById("character3");

    // Info player
    this._contInfoPlayer = document.querySelector(".contInfoPlayer");

    // Right
    this._contInfoPlayerRight = this._contInfoPlayer.querySelector(".contInfoPlayerRight");
    this._elemCharacterInfoPlayerRight = this._contInfoPlayerRight.querySelector(".elemCharacterInfoPlayerRight");
    this._elemTextInfoPlayerRight = this._contInfoPlayerRight.querySelector(".elemTextInfoPlayerRight");

    // Left
    this._contInfoPlayerLeft = this._contInfoPlayer.querySelector(".contInfoPlayerLeft");
    this._elemCharacterInfoPlayerLeft = this._contInfoPlayerLeft.querySelector(".elemCharacterInfoPlayerLeft");
    this._elemTextInfoPlayerLeft = this._contInfoPlayerLeft.querySelector(".elemTextInfoPlayerLeft");
    
    // Action
    this._buttonMove = document.getElementById("buttonMove");
    this._buttonPass = document.getElementById("buttonPass");

    // Victory
    this._buttonRestart = document.getElementById("buttonRestart");
    this._buttonQuit = document.getElementById("buttonQuit");
    this._containerVictory = document.getElementById("containerVictory");
    this._textVictory = this._containerVictory.querySelector(".textVictory");

    // Hand
    this._tileHandSlot0 = document.getElementById("tileHandSlot0");
    this._tileHandSlot1 = document.getElementById("tileHandSlot1");
    this._tileHandSlot2 = document.getElementById("tileHandSlot2");

    // Log fight 
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
    if(!this._game.currentPlayer.isPlayerIA &&
       !this._game.currentPlayer.isTurnFinish){
      
      await this._game.currentPlayer.useCard(index, this._game.selectedPlayer);
    }
    else{
      if (this._game.currentPlayer.isPlayerIA) this.addTextLog("Ce n'est pas a votre tour de jouer !");
      if (this._game.currentPlayer.isTurnFinish) this.addTextLog("Ce n'est pas a votre tour de jouer !");
    }
  }

  // Action
  async clickMoveButton(){    
    if (this.canMove()){
      // Ajoute un node path
      this._game.currentPlayer.addNodePath(1, 1);
        
      if(!this._game.currentPlayer.isWalking){ await this._game.currentPlayer.move(1); }
    }
    else{
      this.cantMove();
    }
  }
  clickPassButton(){    
    if(this.canPass()){
      
      this._game.endTurnPlayer();
    }
    else{
      this.cantPass();
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
    // Variable
    const hand = this._game.currentPlayer.hand;
    const slots = [this._tileHandSlot0, this._tileHandSlot1, this._tileHandSlot2];

    // Parcourt tout les slots
    for (let i = 0; i < slots.length; i++) {
      // Variable
      const card = hand[i];

      // Si Card = non null
      if (card && card._icon) {
        
        // Affiche la tuile et ajoute un background
        slots[i].style.display = "flex";
        slots[i].style.backgroundImage = card._icon;
      }
      else {
        
        // Cache la tuile et retire le background
        slots[i].style.display = "none";
        slots[i].style.backgroundImage = "none";
      }
    }
  }

  // Log fight
  addTextLogFight(text, caster, target) {
    // Si le nombre de ligne dépasse le maximum autorisé
    if (this._textLogFight.length >= this._maxLineLog) { this._textLogFight.shift(); }

    // Ajoute le texte & retour a la ligne & gestion du scroll
    this._textLogFight.push( caster + ":" + text + target);
    this._logFight.textContent = this._textLogFight.join("\n");
    this._logFight.scrollTop = this._logFight.scrollHeight;
  }
  addTextLog(text) {
    // Si le nombre de ligne dépasse le maximum autorisé
    if (this._textLogFight.length >= this._maxLineLog) { this._textLogFight.shift(); }

    // Ajoute le texte & retour a la ligne & gestion du scroll
    this._textLogFight.push(text);
    this._logFight.textContent = this._textLogFight.join("\n");
    this._logFight.scrollTop = this._logFight.scrollHeight;
  }
  removeLineTextLogFight(index){
    this._textLogFight.splice(index, 1);
  }

  // Info player
  profileSelectedPlayer(){
    const race = this._game.selectedPlayer.getRace();
    this._elemCharacterInfoPlayerRight.style.backgroundImage = `url('IMAGE/CHARACTER/${race}/profile.png')`;
  }

  currentInfoPlayer(){
    const race = this._game.currentPlayer.getRace();    
    this._elemCharacterInfoPlayerLeft.style.backgroundImage = `url('IMAGE/CHARACTER/${race}/profile.png')`; 
    this._elemTextInfoPlayerLeft.textContent = this._game.currentPlayer ? `${this._game.currentPlayer.name}: ${this._game.currentPlayer.pm} pm` : "";    
  }

  // Info player
  targetInfoPlayer(){
    // Si aucun joueur selectioné
    if(this._game.selectedPlayer === null){
      
      // Reset Texte & Profile
      this._elemTextInfoPlayerRight.textContent = this._game.selectedPlayer ? `${this._game.selectedPlayer.name}: ${this._game.selectedPlayer.pm} pm` : "";
      this._elemCharacterInfoPlayerRight.style.backgroundImage = ""; 
    }
    // Si le joueur selectionné est mort
    else if(this._game.selectedPlayer.isDie){
      
      // Ajoute le profile du joueur selectionné & pseudo & pm
      this.profileSelectedPlayer();
      this._elemTextInfoPlayerRight.textContent = this._game.selectedPlayer ? `${this._game.selectedPlayer.name}: ${this._game.selectedPlayer.currentTurnRespawn} tour` : "";
    }
    // Si un joueur est déjà selectionné
    else{

      // Ajoute le profile du joueur selectionné & pseudo & pm
      this.profileSelectedPlayer(); 
      this._elemTextInfoPlayerRight.textContent = this._game.selectedPlayer ? `${this._game.selectedPlayer.name}: ${this._game.selectedPlayer.pm} pm` : "";
    }
  }

  paintTileElement(element, color){
    element.style.backgroundColor = color;
  }

  textEffectInfoPlayer(target) {
    return target.effect.map(effect => `[${effect._name}`).join("");
  }

  // Other
  showVictory(player){
    
    // Affiche le conteneur et déclare le joueur gagnant
    this._containerVictory.style.display = "flex";    
    this._textVictory.textContent = "Winner " + player.name + " !";
  }
}