import { Spell } from './spell.js';

export class Player{
  
  constructor(GameInstance, Name, PosPath, PosTile, Path, PlayerIA, Character){
    // Instance
    this._game = GameInstance;
    
    // Variable
    this._name = Name;

    // PM
    this._pm = 3;
    this._pmMax = 3;
    this._die = false;

    // Position
    this._startPosPath = PosPath;
    this._respawnPosPath = PosPath;

    this._startPosTile = PosTile;
    this._respawnPosTile = PosTile;
    
    this._posPath = PosPath;
    this._posTile = PosTile;

    this._posX = 0; 
    this._posY = 0;

    this._posCharacter = 0;
    this._path = Path;

    // Hand & Deck
    this._hand = [];
    this._deck = [Spell.attackSlow, Spell.buffSpeed, Spell.attackAttract, Spell.attackRepulse, Spell.buffAppuie];
    this._limitCardHand = 3;
    
    // Sprite / Animation
    this._character = Character;
    this._animEffect = this._character.querySelector(".animEffect");
    this._contInfoPlayer = this._character.querySelector(".containerInfo");
    this._elemInfoText = this._contInfoPlayer.querySelector(".elemInfoText");
    this._contTarget = this._character.querySelector(".containerTarget");
    
    this._sizeCharacterHeight = 64;
    this._sizeCharacterWidth = 64; 

    this._backgroundImage = ["url('IMAGE/CHARACTER/character_top.png')", "url('IMAGE/CHARACTER/character_right.png')", "url('IMAGE/CHARACTER/character_down.png')", "url('IMAGE/CHARACTER/character_left.png')"];
    this._isWalking = false;
    
    // Other
    this._timer = 0;
    this._playerIA = PlayerIA;
    this._turnFinish = true;
    
    this._currentTurnRespawn = -1;
    
    this._isCast = false;
    this._isDie = false;
    this._isRevive = false;
    
    this._forceMove = 0;

    this.loadObject();
  }

  // Getter Setter local

  // Name
  get name(){ return this._name; }
  set name(value){
    this._name = value;
    this._game.ui.updatePlayersInfo();
  }

  // PM
  get pm(){ return this._pm; }
  set pm(value){
    this._pm = value;
    
    if(this._die === false) this.infoPlayer();
  }
  
  addPm(value){
    this._pm += value;
    if(this.die === false) this.infoPlayer();
  }
  removePm(value){ 
    this._pm -= value;
    
    if(this._pm < 0) this._pm = 0;
    if(this.die === false) this.infoPlayer();
  }

  get pmMax(){ return this._pmMax; }

  // Die
  get die(){ return this._die; }
  set die(value){
    this._die = value;

    if(this._die === true){
      this.isDie();
    }
  }

  // Pos Tile & Path
  get startPosPath(){ return this._startPosPath; }
  set startPosPath(value){ this._startPosPath = value; }
  
  get respawnPosPath(){ return this._respawnPosPath; }
  set respawnPosPath(value){ this._respawnPosPath = value; }

  get startPosTile(){ return this._startPosTile; }
  set startPosTile(value){ this._startPosTile = value; }
  
  get respawnPosTile(){ return this._respawnPosTile; }
  set respawnPosTile(value){ this._respawnPosTile = value; }

  get posPath(){ return this._posPath; }
  set posPath(value){ this._posPath = value; }

  get posX(){ return this._posX; }
  set posX(value){ this._posX = value; }

  get posY(){ return this._posY; }
  set posY(value){ this._posY = value; }

  get path(){ return this._path; }

  // Pos tile
  get posTile(){ return this._posTile; }
  set posTile(value){ this._posTile = value; }

  // Background
  getBackgroundImage(index){ return this._backgroundImage[index]; }
  setBackgroundImage(index, value){ this._backgroundImage[index] = value; }

  // Hand
  get hand(){ return this._hand; }
  set hand(value){ 
    this._hand = value;
    if(this._playerIA === false) this._game.ui.updateHand();
  }

  addCardHand(index){
    this._hand.push(this._deck[index]);
    if(this._playerIA === false) this._game.ui.updateHand();
  }
  removeCardHand(index){
    this._hand.splice(index, 1);
    if(this._playerIA === false) this._game.ui.updateHand();
  }

  // Deck
  get deck(){ return this._deck; }
  set deck(value){ this._deck = value; }

  addCardDeck(card) { this._deck.push(card); }
  removeCardDeck(index){ this._deck.splice(index, 1); }

  // Turn
  get turnFinish(){ return this._turnFinish; }
  set turnFinish(value){ 
    this._turnFinish = value;

    if(this._turnFinish === true){
      this._game.ui.addTextLog(this._name + " a terminé sont tour !");
      this.pm = this.pmMax;
      if(this._die === false) this._contInfoPlayer.style.display = "none";   
    }
    else{
      this._game.ui.addTextLog(this._name + " commence sont tour !");
      this._contInfoPlayer.style.display = "flex";
      this.addCard();
    }

    if(this._die === false) this.infoPlayer();
  }

  // Force move
  get forceMove(){ return this._forceMove; }
  set forceMove(value){ this._forceMove = value; }

  // isWalking
  get isWalking(){ return this._isWalking; }
  set isWalking(value){ this._isWalking = value; }

  // PlayerIA
  get playerIA(){ return this._playerIA; }
  set playerIA(value){ this._playerIA = value; }

  // Animation
  get animEffect(){ return this._animEffect; }
  set animEffect(value){ this._animEffect = value; }
  
  // Character
  get character(){ return this._character; }
  set character(value){ this._character = value; }

  // Turn respawn
  get currentTurnRespawn(){ return this._currentTurnRespawn; }
  set currentTurnRespawn(value){ 
    this._currentTurnRespawn = value;
    if(this._currentTurnRespawn < 0) this._currentTurnRespawn = 0;
    this.isCurrentTurnRespawn();
  }

  // Container CSS
  get contInfoPlayer(){ return this._contInfoPlayer; }
  get contTarget(){ return this._contTarget; }

  // Is
  get isCast(){ return this._isCast; }
  set isCast(value){ this._isCast = value; }

  get isDie() { return this._isDie; }
  set isDie(value) { return this._isDie = value; }

  get isRevive() { return this._isRevive; }
  set isRevive(value) { return this._isRevive = value; }
  
  // Other
  get posBase(){ return this._posBase; }
  
  getPosTileDirection(direction){
    let posPathDirection = this._posPath + direction;
    let posTileDirection = this._path[posPathDirection];
    return posTileDirection;
  }

  getPosPathDirection(direction){
    return this._posPath + direction;
  }
  
  getPosPathToPosTile(){
    return this._path[this._posPath];
  }

  getPosTileToPosPath(){
    
  }

  getPosXY(posTile){
    return this._game.map.gridTileLevel0[posTile].getBoundingClientRect();
  }

  getPosXYDirection(dir){
    const newTileDir = this.posTileDirection(dir);
    const newPos = newTileDir.getBoundingClientRect();
    return newPos;   
  }

  getSpellIndexByName(name){   
    for(let i = 0; i < this._hand.length; i++){
      if(this._hand[i]._name === name) { return i; }
    }
    
    return null;
  }

  // Function
  async revive(){
    this._character.style.animation = '';
    
    // Rend invisible le joueur avant la pos
    this._character.classList.add(`is-invisible`);
    await this.waitTransition(this._character);
    
    // Déplacement du joueur
    this._posPath = this._respawnPosPath;
    this._posTile = this._respawnPosTile;    
    this.teleportPosTile(this._posTile);
      
    this.characterDirection(1);
    this._character.style.backgroundPositionX = `0px`;

    // Rend visible et active idle
    this._character.classList.remove(`is-die`);
    this._character.classList.add(`is-idle`);

    this._die = false;
    this.infoPlayer(); // Last
    this._game.removePlayerBase(this);
    
    this._character.classList.remove(`is-invisible`); 
    await this.waitTransition(this._character);

    this._game.ui.addTextLog(this._name + " est ressucité !");
  }

  async isDie(){   
    // Reset les class
    this._character.classList.remove(`dir-up`, `dir-right`, `dir-down`, `dir-left`, `is-walking`, `is-idle`);

    // Active l'anim de mort
    this._character.classList.add(`is-die`);
    await this.waitAnimation(this._character);

    //Rend invisible
    this._character.classList.add(`is-invisible`);
    await this.waitTransition(this._character);
    
    this._game.goSlotBase(this);
    this.currentTurnRespawn = 3;
    
    this._character.classList.remove(`is-invisible`);
    await this.waitTransition(this._character);
    
    this.infoPlayer();
    this._contInfoPlayer.style.display = "flex";
      
  }

  isCurrentTurnRespawn(){
    // Tour 0
    if(this._currentTurnRespawn === 0){
      this._currentTurnRespawn = 0;
      this.choiceFrame(this._character, 0);
    }
    // Tour 1
    else if(this._currentTurnRespawn === 1){
      this.choiceFrame(this._character, 2);
    }
    // Tour 2
    else if(this._currentTurnRespawn === 2){
      this.choiceFrame(this._character, 4);
    }
    // Tour 3
    else if(this._currentTurnRespawn === 3){
      this.choiceFrame(this._character, 6);
    }

    // Mise a jour des informations du joueur
    this.infoPlayer();    
  }
  
  addCard(){
    let drawCardNumber = this._limitCardHand - this._hand.length;
  
    for(let i= 0; i < drawCardNumber; i++){
      let randomIndex = this.getRandomIndexDeck();
      
      this.addCardHand(randomIndex);
      this.removeCardDeck(randomIndex);
    }
  }
  
  async useCard(index){
    const spell = this._hand[index];
    
    if(spell._targetCondition === "current" && this._game.selectedPlayer === null) this._game.selectedPlayer = this._game.currentPlayer;
    
    if(this._isCast === false &&
       this._isWalking === false &&
       this._game.selectedPlayer != null ){
      
      this._isCast = true;
      let echecSpell = await spell.cast(this._game.currentPlayer, this._game.selectedPlayer);
      
      if(echecSpell === false){ this._game.ui.addTextLogFight(" lance [" + spell._name + "]", this._name, ""); }
      else{ this._game.ui.addTextLogFight(" echec du sort [" + spell._name + "]", this._game.currentPlayer.name, ""); }
      
      this.deleteCard(index);
      this._isCast = false;
    }
    else{
      this._game.ui.addTextLog(spell._name + ": Aucune cible selectionné !");
    }
  }
  
  deleteCard(index) {
    const card = this._hand[index];
    
    this.addCardDeck(card);      // Ajoute le vrai objet Spell dans le deck
    this.removeCardHand(index);   // Supprime de la main
  }

  //Partie autre
  
  getRandomIndexDeck(){ return Math.floor(Math.random() * this._deck.length); }

  async move(direction){   
    for(let i = 0; i < this._forceMove; i++){
      if(this._pm > 0 && this._isWalking === false && this._isCast === false){
        this._isWalking = true;

        // On check la case d'arriver
        this._game.isTilePlayer(this.getPosTileDirection(direction));
        
        // On lance l'animation de marche vers la position
        await this.moveAnimation(direction);
        
        if(this._die === false) {
          // On met a jour la position
          this._posTile = this.getPosTileDirection(direction);
          this._posPath = this.getPosPathDirection(direction);          

          this.removePm(1);
          this._game.victoryPlayer(this._posTile, this);
        }
        
        this._character.style.zIndex = 99 + this._posTile;
        this._isWalking = false;   
      }  
    }
    
    this._character.classList.remove(`is-walking`);
    this._character.classList.add(`is-idle`);
    this._forceMove = 0;
  }

  async spellMove(direction, force){
    for(let i = 0; i < force; i++){
      if(this._posPath + direction >= 0){
        
        await this.moveAnimation(direction);   
        this._game.isTilePlayer(this.getPosTileDirection(direction));
        
        if(this._die === false) {
          // On met a jour la position
          this._posTile = this.getPosTileDirection(direction);
          this._posPath = this.getPosPathDirection(direction);          

          this._game.victoryPlayer(this._posTile, this);
        }
      }
      this._character.style.zIndex = 99 + this._posTile;
      this._character.classList.remove(`is-walking`);
      this._character.classList.add(`is-idle`);    
    }
  }

  async spellAnimation(spell){
    let targetAnim = null;
    
    if(spell._targetCondition === "current"){ targetAnim = this._animEffect; }
    else{ targetAnim = this._game.selectedPlayer.animEffect; }
    
    targetAnim.style.backgroundImage = spell._animation;
    targetAnim.style.display = "block";
    
    targetAnim.classList.add(`is-spell`);
    await this.wait(1600);
    
    targetAnim.classList.remove(`is-spell`);
    targetAnim.style.display = "none";            
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  waitAnimation(element) {
  return new Promise(resolve => {
    element.addEventListener('animationend', resolve, { once: true });
  });
  }

  waitTransition(element) {
  return new Promise(resolve => {
    element.addEventListener('transitionend', resolve, { once: true });
  });
  }

  characterDirection(direction){
    let dir = ``;
    const currentTile = this._posTile;
    const nextTile = this.getPosTileDirection(direction);

    this._character.classList.remove(`dir-up`, `dir-right`, `dir-down`, `dir-left`, `is-die`);

    if (currentTile - 19 === nextTile)  dir = 'up';
    if (currentTile + 19 === nextTile)  dir = 'down';
    if (currentTile - 1 === nextTile)  dir = 'left';
    if (currentTile + 1 === nextTile)  dir = 'right';

    this._character.classList.add(`dir-${dir}`);
  }

  characterDirectionForced(dirForced){
    let dir = `${dirForced}`;
    this._character.classList.remove(`dir-up`, `dir-right`, `dir-down`, `dir-left`);
    this._character.classList.add(`dir-${dir}`);
  }

  async moveAnimation(direction) { console.log("AVANT nettoyage :", this._character.className);

    this._character.classList.remove('is-idle', 'is-die', 'is-invisible');
    void this._character.offsetHeight;
    this._character.classList.add(`is-walking`);
    
    this.characterDirection(direction);
    this.goPosTile(this.getPosTileDirection(direction), direction);
    
    await this.wait(400);
  }

  choiceFrame(element, numeroFrame, largeurTotale = 320, nombreFrames = 5) {
    if (numeroFrame < 1) numeroFrame = 1;
    if (numeroFrame > nombreFrames) numeroFrame = nombreFrames;

    const largeurFrame = largeurTotale / nombreFrames;

    const decalageX = -(numeroFrame - 1) * largeurFrame;

    element.style.animation = "none";

    element.style.backgroundPositionX = `${decalageX}px`;
  }

  goPosTile(posTile, direction){
    const grid = this._game.map.gridTile.getBoundingClientRect();
    const tile = this.getPosXY(posTile); 
    
    // Calcul de la position CIBLE centrée sur la tuile
    const targetX = (tile.left - grid.left) + (tile.width / 2) - (this._sizeCharacterWidth / 2);
    const targetY = (tile.top - grid.top) + (tile.height / 2) - (this._sizeCharacterHeight / 2) - 25;
    
    // Déplacement CSS
    this._character.style.left = `${targetX}px`;
    this._character.style.top = `${targetY}px`; 
  }

  goPosTileElem(posTile, element){
    const grid = this._game.map.gridTile.getBoundingClientRect();
    const tile = this.getPosXY(posTile); 
    
    // Calcul de la position CIBLE centrée sur la tuile
    const targetX = (tile.left - grid.left) + (tile.width / 2) - (64 / 2);
    const targetY = (tile.top - grid.top) + (tile.height / 2) - (64 / 2);
    
    // Déplacement CSS
    element.style.left = `${targetX}px`;
    element.style.top = `${targetY + 128}px`;
  }

  teleportPosTile(posTile/*, isPath*/){
    const grid = this._game.map.gridTile.getBoundingClientRect();
    const tile = this.getPosXY(posTile); 
    
    const targetX = (tile.left - grid.left) + (tile.width / 2) - (this._sizeCharacterWidth / 2);
    const targetY = (tile.top - grid.top) + (tile.height / 2) - (this._sizeCharacterHeight / 2) - 25;

    this._character.style.transition = 'none';

    this._character.style.left = `${targetX}px`;
    this._character.style.top = `${targetY}px`; 

    void this._character.offsetWidth;
    this._character.style.transition = '';
    
    this._posTile = posTile;
    this._posPath = 1;          
  }

  infoPlayer(){
    if(this._die === true){
      this._elemInfoText.textContent = this.currentTurnRespawn + " tour";
    }
    else{
      this._elemInfoText.textContent = this._name + ": " + this.pm + " pm";
    }
  }

  targetCharacter(){
    //Si aucun joueur est selectionné
    if(this._game.selectedPlayer === null){ 
      this._game.selectedPlayer = this;
      this._contTarget.classList.add("isTarget");
    
      this.infoPlayer();
      this._contInfoPlayer.style.display = "flex";         
    }
    // Si je rappuie sur le joueur
    else if(this._game.selectedPlayer === this){
      this._game.selectedPlayer = null;
      
      this._contInfoPlayer.style.display = "none";   
    }
      // Si la selection n'est pas = null & this
    else{
      this._game.selectedPlayer._contInfoPlayer.style.display = "none";         
      this._game.selectedPlayer = null;
      this._game.selectedPlayer = this;
      this._contTarget.classList.add("isTarget");

      this.infoPlayer();
      this._contInfoPlayer.style.display = "flex";         
    }
  }

  loadObject(){
    this._character.addEventListener("click", () => { this.targetCharacter(); }); 
    this.goPosTile(this.startPosTile);
    this.characterDirection(1);
  }
}