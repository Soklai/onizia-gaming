import { Spell } from './spell.js';

export class Player{
  
  constructor(GameInstance, Name, PosPath, PosTile, Path, PlayerIA, Character, AnimEffect){
    // Instance
    this._game = GameInstance;
    
    // Variable
    this._name = Name;

    // PM
    this._pm = 3;
    this._pmMax = 3;
    this._die = false;

    // Position
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
    this._animEffect = AnimEffect;
    
    this._sizeCharacterHeight = 64;
    this._sizeCharacterWidth = 64; 

    this._backgroundImage = ["url('IMAGE/CHARACTER/character_top.png')", "url('IMAGE/CHARACTER/character_right.png')", "url('IMAGE/CHARACTER/character_down.png')", "url('IMAGE/CHARACTER/character_left.png')"];
    this._isWalking = false;
    
    // Other
    this._timer = 0;
    this._playerIA = PlayerIA;
    this._turnFinish = true;
    
    this._isCast = false;
    /*this._nodePath = [];*/
    /*this._spellQueue = [];*/
    this._forceMove = 0;
  }

  // Getter Setter local

  // Name
  get name(){ return this._name; }
  set name(value){ this._name = value; }

  // PM
  get pm(){ return this._pm; }
  set pm(value){ this._pm = value; }
  
  addPm(value){ this._pm += value; }
  removePm(value){ this._pm -= value; }

  get pmMax(){ return this._pmMax; }

  // Die
  get die(){ return this._die; }
  set die(value){ this._die = value; }

  // Pos path
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
  set hand(value){ this._hand = value; }

  addCardHand(index){ this._hand.push(this._deck[index]); }
  removeCardHand(index){ this._hand.splice(index, 1); }

  // Deck
  get deck(){ return this._deck; }
  set deck(value){ this._deck = value; }

  addCardDeck(card) { this._deck.push(card); }
  removeCardDeck(index){ this._deck.splice(index, 1); }

  // Turn
  get turnFinish(){ return this._turnFinish; }
  set turnFinish(value){ this._turnFinish = value; }

  // Force move
  get forceMove(){ return this._forceMove; }
  set forceMove(value){ this._forceMove = value; }

  // isWalking
  get isWalking(){ return this._isWalking; }
  set isWalking(value){ this._isWalking = value; }

  // isCast
  get isCast(){ return this._isCast; }
  set isCast(value){ this._isCast = value; }

  // PlayerIA
  get playerIA(){ return this._playerIA; }
  set playerIA(value){ this._playerIA = value; }

  // Animation
  get animEffect(){ return this._animEffect; }
  set animEffect(value){ this._animEffect = value; }
  
  // Character
  get character(){ return this._character; }
  set character(value){ this._character = value; }
  
  // Other
  get posTileBase(){ return this._posTileBase; }
  
  // Getter Setter complexe
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

  getPosXY(posTile){
    return this.map.gridTileLevel0[posTile].getBoundingClientRect();
  }

  getPosXYDirection(dir){
    const newTileDir = this.posTileDirection(dir);
    const newPos = newTileDir.getBoundingClientRect();
    return newPos;   
  }

  getSpellIndexByName(name){   
    for(let i = 0; i < this._hand.length; i++){
      if(this._hand[i].name === name) { return i; }
    }
    
    return null;
  }

  // Getter externe
  get map(){ return this._game.map; }
  get ui(){ return this._game.ui; }
  
  get currentPlayer(){ return this._game.currentPlayer; }
  get opponentPlayer(){ return this._game.opponentPlayer; }
  

  // Function
  addCard(){
    let drawCardNumber = this._limitCardHand - this._hand.length;
  
    for(let i= 0; i < drawCardNumber; i++){
      let randomIndex = this.getRandomIndexDeck();
      
      this.addCardHand(randomIndex);
      this.removeCardDeck(randomIndex);
    }
    
    if (this._playerIA === false ) { this.ui.updateHand(); }
  }
  
  async useCard(index){
    if(this._isCast === false && this._isWalking === false){
      
      this._isCast = true;
      const spell = this._hand[index];
      let echecSpell = await spell.cast(this.currentPlayer, this.opponentPlayer, this._game);
      
      if(echecSpell === false){
        this.ui.addTextLogFight(" lance [" + spell.name + "]", this._name, "");
        this.ui.updatePlayersInfo();

        /*this._spellQueue.splice(0, 1);*/
        this.deleteCard(index);
        this._isCast = false;

        return false;
      }
      else{
        this.ui.addTextLogFight(" echec du sort [" + spell.name + "]", this.currentPlayer.name, "");
        this.ui.updatePlayersInfo();

        /*this._spellQueue.splice(0, 1);*/
        this.deleteCard(index);
        this._isCast = false;
        
        return true;
      }      
    }
  }
  
  deleteCard(index) {
    const card = this._hand[index];
    
    if (card) {
      this.addCardDeck(card);      // Ajoute le vrai objet Spell dans le deck
      this.removeCardHand(index);   // Supprime de la main
    }
  
    if (this._playerIA === false) { 
      this.ui.updateHand(); 
    }
  }

  //Partie autre
  
  getRandomIndexDeck(){ return Math.floor(Math.random() * this._deck.length); }

  /*addNodePath(direction){
    if(this._nodePath.length < this.getPm()){
      if(this._nodePath.length === 0){
        this._nodePath.push(this.getPosTileDirection(direction)); }
      else{
        this._nodePath.push( this.getPosTileDirection(direction + this._nodePath.length) );
      }
    }
  } */

  /* addSpellQueue(index){
    this._spellQueue.push(index);
  } */

  /* async useSpellQueue(){
    this.useCard(this._spellQueue[0]);
    
    await this.wait(1000); 
  } */

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async move(direction){
    for(let i = 0; i < this._forceMove; i++){
      if(this._pm > 0 && this._isWalking === false && this._isCast === false){
        this._isWalking = true;
      
        let newPosPath = this._posPath + direction;
        let newPosTile = this._path[newPosPath];
        let tile = this.map.gridPlayer[this._posTile];
        let indexPlayer = this._game.isTilePlayer(this.getPosTileDirection(direction));
      
        // Sur la case suivante, vérifier si il y a un joueur
        if(indexPlayer != null) { this._game.diePlayerGoToBase(indexPlayer); }    
      
        // Met a jour la nouvelle position du joueur
        await this.moveAnimation(direction);
        
        this._posPath = this.getPosPathDirection(direction);
        this.removePm(1);
        
        this.ui.updatePlayersInfo();
        this._game.victoryPlayer(this._posTile, this);
        
        this._character.style.zIndex = 99 + this._posTile;
        this._isWalking = false;   
      }  
    }
    
    this._character.classList.remove(`is-walking`);
    this._forceMove = 0;
  }

  async spellMove(direction, force){
    for(let i = 0; i < force; i++){
      if(this._posPath + direction >= 0){
        let newPosPath = this._posPath + direction;
        let newPosTile = this._path[newPosPath];
        let tile = this.map.gridPlayer[this._posTile];
        let indexPlayer = this._game.isTilePlayer(this.getPosTileDirection(direction));
          
        if(indexPlayer != null) { this._game.diePlayerGoToBase(indexPlayer); }    
        
        await this.spellMoveAnimation(direction);
  
        this.ui.updatePlayersInfo();
        this._game.victoryPlayer(this._posTile, this);   
      }
      this._character.style.zIndex = 99 + this._posTile;
      this._character.classList.remove(`is-walking`);
    }
  }
  
  async spellMoveAnimation(direction) {
    this.characterDirection(direction);
    this._character.classList.add(`is-walking`);

    this.goPos(this.getPosTileDirection(direction));
    this._posPath = this.getPosPathDirection(direction);
      
    await this.wait(400);
  }

  async spellAnimation(spell){
    let targetAnim;
    
    if(spell.targetAnim === "Current"){ targetAnim = this._animEffect; }
    else{ targetAnim = this.opponentPlayer.animEffect; }
    
    targetAnim.style.backgroundImage = spell.animation;
    targetAnim.style.display = "block";
    
    targetAnim.classList.add(`is-spell`);
    await this.wait(1600);
    
    targetAnim.classList.remove(`is-spell`);
    targetAnim.style.display = "none";            
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  characterDirection(direction){
    let dir = ``;
    const currentTile = this._posTile;
    const nextTile = this.getPosTileDirection(direction);

    this._character.classList.remove(`dir-up`, `dir-right`, `dir-down`, `dir-left`);

    if (currentTile - 19 === nextTile)  dir = 'up';
    if (currentTile + 19 === nextTile)  dir = 'down';
    if (currentTile - 1 === nextTile)  dir = 'left';
    if (currentTile + 1 === nextTile)  dir = 'right';

    this._character.classList.add(`dir-${dir}`);
  }

  async moveAnimation(direction) {
    this.characterDirection(direction);
    this._character.classList.add(`is-walking`);

    this.goPos(this.getPosTileDirection(direction));
    
    await this.wait(400);  
  }

  goPos(posTile){
    const grid = this.map.gridTile.getBoundingClientRect();
    const tile = this.getPosXY(posTile); 
    
    // Calcul de la position CIBLE centrée sur la tuile
    const targetX = (tile.left - grid.left) + (tile.width / 2) - (this._sizeCharacterWidth / 2);
    const targetY = (tile.top - grid.top) + (tile.height / 2) - (this._sizeCharacterHeight / 2) - 25;
    
    // Déplacement CSS
    this._character.style.left = `${targetX}px`;
    this._character.style.top = `${targetY}px`;
    this._posTile = posTile;
  }

  goPosElem(posTile, element){
    const grid = this.map.gridTile.getBoundingClientRect();
    const tile = this.getPosXY(posTile); 
    
    // Calcul de la position CIBLE centrée sur la tuile
    const targetX = (tile.left - grid.left) + (tile.width / 2) - (64 / 2);
    const targetY = (tile.top - grid.top) + (tile.height / 2) - (64 / 2);
    
    // Déplacement CSS
    element.style.left = `${targetX}px`;
    element.style.top = `${targetY + 128}px`;
  }
}