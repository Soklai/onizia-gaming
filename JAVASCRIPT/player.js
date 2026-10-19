import { Spell } from './spell.js';

export class Player{
  
  constructor(gameInstance, name, posPath, posTile, path, playerIA, character, animEffect){
    // Instance
    this.game = gameInstance;
    this.map = this.game.map;
    this.ui = this.game.ui;
    
    // Variable
    this.name = name;
    this.pm = 3;
    this.pmMax = 3;
    this.die = false;
    
    this.posPath = posPath;
    this.posTile = posTile;
    this.backgroundImage = ["url('IMAGE/CHARACTER/character_top.png')", "url('IMAGE/CHARACTER/character_right.png')", "url('IMAGE/CHARACTER/character_down.png')", "url('IMAGE/CHARACTER/character_left.png')"];
    this.hand = [];
    this.deck = [Spell.attackSlow, Spell.buffSpeed, Spell.attackAttract, Spell.attackRepulse, Spell.buffAppuie];
    
    this.path = path;
    
    this.limitCardHand = 3;
    this.playerIA = playerIA;
    this.turnFinish = true;

    this.buff = [];
    this.deBuff = [];

    this.posX = 0; 
    this.posY = 0;

    this.isWalking = false;
    this.isCast = false;
    this.nodePath = [];
    this.spellQueue = [];
    this.forceMove = 0;
    
    this.character = character;
    this.animEffect = animEffect;
    this.timer;
    this.sizeCharacterHeight = 64;
    this.sizeCharacterWidth = 64;
    this.posCharacter;
  
  }

  // Getter Setter
  
  getName(){
    return this.name;
  }

  setName(value){
    this.name = value;
  }

  getPm(){
    return this.pm;
  }

  setPm(value){
    this.pm = value;
  }

  addPm(value){
    this.pm += value;
  }

  removePm(value){
    this.pm -= value;
  }

  getPmMax(){
    return this.pmMax;
  }

  getDie(){
    return this.die;
  }

  setDie(value){
    this.die = value;
  }

  getPosPath(){
    return this.posPath;
  }

  setPosPath(value){
    this.posPath = value; 
  }

  getPosTile(){
    return this.posTile;
  }

  setPosTile(value){
    this.posTile = value;
  }

  getBackgroundImage(index){
    return this.backgroundImage[index];
  }

  setBackgroundImage(index, value){
    this.backgroundImage[index] = value;
  }

  getHand(){
    return this.hand;
  }

  addCardHand(index){
    this.hand.push(this.deck[index]);
  }

  removeCardHand(index){
    this.hand.splice(index, 1);
  }

  getDeck(){
    return this.deck;
  }

  addCardDeck(card) {
    this.deck.push(card);
}

  removeCardDeck(index){
    this.deck.splice(index, 1);
  }

  getPath(){
    return this.path;
  }

  getPosTileBase(){
    return this.posTileBase;
  }

  getPlayerIA(){
    return this.playerIA;
  }

  getTurnFinish(){
    return this.turnFinish;
  }

  setTurnFinish(value){
    this.turnFinish = value;
  }

  getBuff(){
    return this.buff;
  }

  setBuff(value){
    this.buff = value; 
  }

  addBuff(value){
    this.buff.push(value);
  }

  removeBuff(index){
    this.buff.splice(index, 1);
  }

  getDeBuff(){
    return this.deBuff;
  }

  setDeBuff(value){
    this.deBuff = value; 
  }

  addDeBuff(value){
    this.deBuff.push(value);
  }

  removeDeBuff(index){
    this.deBuff.splice(index, 1);
  }

  unBuff(){
    this.buff = [];
    this.deBuff = [];
  }
  
  addCard(){
    let drawCardNumber = this.limitCardHand - this.getHand().length;
  
    for(let i= 0; i < drawCardNumber; i++){
      let randomIndex = this.getRandomIndexDeck();
      
      this.addCardHand(randomIndex);
      this.removeCardDeck(randomIndex);
    }
    
    if (this.playerIA === false ) { this.game.ui.updateHand(); }
  }
  
  async useCard(index){
    if(this.isCast === false && this.isWalking === false){
      
      this.isCast = true;
      const spell = this.getHand()[index];
      let echecSpell = await spell.cast(this.game.currentPlayer, this.game.opponentPlayer, this.game);
      
      if(echecSpell === false){
        this.game.ui.addTextLogFight(" lance [" + spell.name + "]", this.game.currentPlayer.getName(), "");
        this.game.ui.updatePlayersInfo();

        this.spellQueue.splice(0, 1);
        this.deleteCard(index);
        this.isCast = false;

        return false;
      }
      else{
        this.game.ui.addTextLogFight(" echec du sort [" + spell.name + "]", this.game.currentPlayer.getName(), "");
        this.game.ui.updatePlayersInfo();

        this.spellQueue.splice(0, 1);
        this.deleteCard(index);
        this.isCast = false;
        
        return true;
      }      
    }
  }
  
  deleteCard(index) {
    const card = this.hand[index];
    
    if (card) {
      this.addCardDeck(card);      // Ajoute le vrai objet Spell dans le deck
      this.removeCardHand(index);   // Supprime de la main
    }
  
    if (this.getPlayerIA() === false) { 
      this.game.ui.updateHand(); 
    }
  }

  //Partie autre
  
  getRandomIndexDeck(){
    return Math.floor(Math.random() * this.deck.length);
  }

  addNodePath(direction){
    if(this.nodePath.length < this.getPm()){
      if(this.nodePath.length === 0){
        this.nodePath.push(this.getPosTileDirection(direction)); }
      else{
        this.nodePath.push( this.getPosTileDirection(direction + this.nodePath.length) );
      }
    }
  }

  addSpellQueue(index){
    this.spellQueue.push(index);
  }

  async useSpellQueue(){
    this.useCard(this.spellQueue[0]);
    
    await this.wait(1000); 
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async move(direction){
    // On repète move via forceMove
    for(let i = 0; i < this.forceMove; i++){
      // On check si il reste des PM
      if(this.getPm() > 0 && this.isWalking === false && this.isCast === false){
        this.isWalking = true;
      
        let newPosPath = this.getPosPath() + direction;
        let newPosTile = this.getPath()[newPosPath];
        let tile = this.game.map.gridPlayer[this.getPosTile()];
        let indexPlayer = this.game.isTilePlayer(this.getPosTileDirection(direction));
      
        // Sur la case suivante, vérifier si il y a un joueur
        if(indexPlayer != null) { this.game.diePlayerGoToBase(indexPlayer); }    
      
        // Met a jour la nouvelle position du joueur
        await this.moveAnimation(direction);

        this.posPath = this.getPosPathDirection(direction);
        this.removePm(1);

        this.game.ui.updatePlayersInfo();
        this.game.victoryPlayer(this.getPosTile());

        this.character.style.zIndex = 99 + this.getPosTile();
        this.isWalking = false;   
      }  
    }
    // Une fois finis on reset l'animation
    this.character.classList.remove(`is-walking`);
    this.forceMove = 0;
  }

  async spellMove(direction, force){
    for(let i = 0; i < force; i++){
      if(this.getPosPath() + direction >= 0){
        let newPosPath = this.getPosPath() + direction;
        let newPosTile = this.getPath()[newPosPath];
        let tile = this.game.map.gridPlayer[this.getPosTile()];
        let indexPlayer = this.game.isTilePlayer(this.getPosTileDirection(direction));
          
        if(indexPlayer != null) { this.game.diePlayerGoToBase(indexPlayer); }    
        
        await this.spellMoveAnimation(direction);
  
        this.game.ui.updatePlayersInfo();
        this.game.victoryPlayer(this.getPosTile());   
      }
      this.character.style.zIndex = 99 + this.getPosTile();
      this.character.classList.remove(`is-walking`);
    }
  }
  
  async spellMoveAnimation(direction) {
    this.characterDirection(direction);
    this.character.classList.add(`is-walking`);

    this.goPos(this.getPosTileDirection(direction));
    this.posPath = this.getPosPathDirection(direction);
      
    await this.wait(400);
  }

  async spellAnimation(spell){
    let targetAnim;
    
    if(spell.targetAnim === "Current"){
      targetAnim = this.animEffect;
      //this.goPosElem(this.game.currentPlayer.getPosTile(), this.game.ui.spellAnim);
    }
    else{
      targetAnim = this.game.opponentPlayer.animEffect;
      //this.goPosElem(this.game.opponentPlayer.getPosTile(), this.game.ui.spellAnim);
    }
    
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

  characterDirection(direction) {
    let dir = ``;
    const currentTile = this.getPosTile();
    const nextTile = this.getPosTileDirection(direction);

    this.character.classList.remove(`dir-up`, `dir-right`, `dir-down`, `dir-left`);

    if (currentTile - 19 === nextTile)  dir = 'up';
    if (currentTile + 19 === nextTile)  dir = 'down';
    if (currentTile - 1 === nextTile)  dir = 'left';
    if (currentTile + 1 === nextTile)  dir = 'right';

    this.character.classList.add(`dir-${dir}`);
  }

  async moveAnimation(direction) {
    this.characterDirection(direction);
    this.character.classList.add(`is-walking`);

    this.goPos(this.getPosTileDirection(direction));
    
    await this.wait(400);  
  }

  getPosPathDirection(direction){
    return this.posPath + direction;
  }
  
  getPosTileDirection(direction){
    let posPathDirection = this.getPosPath() + direction;
    let posTileDirection = this.getPath()[posPathDirection];
    return posTileDirection;
  }
  
  getPosPathToPosTile(){
    return this.getPath[this.getPosPath()];
  }

  getPosXY(posTile){
    return this.game.map.gridTileLevel0[posTile].getBoundingClientRect();
  }

  goPos(posTile){
    const grid = this.game.map.gridTile.getBoundingClientRect();
    const tile = this.getPosXY(posTile); 
    
    // Calcul de la position CIBLE centrée sur la tuile
    const targetX = (tile.left - grid.left) + (tile.width / 2) - (this.sizeCharacterWidth / 2);
    const targetY = (tile.top - grid.top) + (tile.height / 2) - (this.sizeCharacterHeight / 2);
    
    // Déplacement CSS
    this.character.style.left = `${targetX}px`;
    this.character.style.top = `${targetY}px`;
    this.setPosTile(posTile);
  }

  goPosElem(posTile, element){
    const grid = this.game.map.gridTile.getBoundingClientRect();
    const tile = this.getPosXY(posTile); 
    
    // Calcul de la position CIBLE centrée sur la tuile
    const targetX = (tile.left - grid.left) + (tile.width / 2) - (64 / 2);
    const targetY = (tile.top - grid.top) + (tile.height / 2) - (64 / 2);
    
    // Déplacement CSS
    element.style.left = `${targetX}px`;
    element.style.top = `${targetY + 128}px`;
  }

  getPosXYDirection(dir){
    const newTileDir = this.getPosTileDirection(dir);
    const newPos = newTileDir.getBoundingClientRect();
    return newPos;   
  }

  getSpellIndexByName(name){
    const hand = this.getHand();
    
    for(let i = 0; i < hand.length; i++){
      if(hand[i].name === name) { return i; }
    }
    
    return null;
  }
}