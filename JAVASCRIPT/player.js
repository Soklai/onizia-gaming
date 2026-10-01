import { Spell } from './spell.js';

export class Player{
  
  constructor(gameInstance, name, posPath, posTile, path, posTileBase, playerIA){
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
    this.posTileBase = posTileBase;
    
    this.slotBase = [false, false, false, false];
    this.limitCardHand = 3;
    this.playerIA = playerIA;
    this.turnFinish = true;

    this.buff = [];
    this.deBuff = [];
  }

  // Partie Getter Setter
  
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

  addCardDeck(index){
    this.deck.push(this.hand[index]);
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
    
    if (this.getPlayerIA() === false ) { this.game.ui.updateDeckUI(); }
  }
  
  useCard(index){
    const spell = this.getHand()[index];
    let echecSpell = spell.cast(this.game.currentPlayer, this.game.opponentPlayer, this.game);
    
    if(echecSpell === false){
      this.game.ui.addTextLogFight(" lance [" + spell.name + "]", this.game.currentPlayer.getName(), "", this.game.turn);
      this.game.ui.updatePlayersInfo();
      this.deleteCard(index);
    }
  }
  
  deleteCard(index){
  
    this.addCardDeck(index);
    this.removeCardHand(index);
  
    if (this.getPlayerIA() === false ) { this.game.ui.updateDeckUI(); }
  }  

  //Partie autre
  
  getRandomIndexDeck(){
    return Math.floor(Math.random() * this.deck.length);
  }

  move(direction){
  
    if(this.getPm() > 0){
      let newPosPath = this.getPosPath() + direction;
      let newPosTile = this.getPath()[newPosPath];
      let tile = this.game.map.gridPlayer[this.getPosTile()];
      let indexPlayer = this.game.isTilePlayer(this.getPosTileDirection(direction));
      
      // Sur la case suivante, vérifier si il y a un joueur
      if(indexPlayer != null) { this.game.allPlayer[indexPlayer].dieGoToBase(indexPlayer); }    
      
      // Colorier l'anciènne case dans ça couleur d'origine    
      tile.style.backgroundImage = "";
      
      // Mettre a jour la nouvelle position du joueur
      this.movePosDirection(direction);
      
      // Mettre a jour la variable PM
      this.removePm(1);

      // Met a jour le UI
      this.game.ui.updatePlayersInfo();
      this.characterDirection();

      this.game.victoryPlayer(this.getPosTile());
    }  
  }

  spellMove(direction, force){  
    for( let i=0; i < force; i++){
      if(this.getPosPath() + direction > 0 ){
        let newPosPath = this.getPosPath() + direction;
        let newPosTile = this.getPath()[newPosPath];
        let tile = this.game.map.gridPlayer[this.getPosTile()];
        let indexPlayer = this.game.isTilePlayer(this.getPosTileDirection(direction));
        
        // Sur la case suivante, vérifier si il y a un joueur
        if(indexPlayer != null) { this.game.allPlayer[indexPlayer].dieGoToBase(); }
        
        // Colorier l'anciènne case dans ça couleur d'origine    
        tile.style.backgroundImage = "";
        
        // Mettre a jour la nouvelle position du joueur
        this.movePosDirection(direction);
        this.characterDirection();
      }
    }
  }

  characterDirection(){
    let nextPosition = this.getPosTileDirection(1);
    
    let nextPositionTop = this.getPosTile() - 17;
    nextPositionTop = Math.max(0, nextPositionTop);
    
    let nextPositionDown = this.getPosTile() + 17;
    nextPositionDown = Math.min(this.game.map.gridPathLevel.length, nextPositionDown);
    
    let nextPositionLeft = this.getPosTile() - 1;
    nextPositionLeft = Math.max(0, nextPositionLeft);
    
    let nextPositionRight = this.getPosTile() + 1;
    nextPositionRight = Math.max(0, nextPositionRight);
    
    switch(nextPosition){
      case nextPositionTop:
        this.game.map.gridPlayer[this.getPosTile()].style.backgroundImage = "url('IMAGE/CHARACTER/character_top.png')";
        break;

      case nextPositionDown:
        this.game.map.gridPlayer[this.getPosTile()].style.backgroundImage = "url('IMAGE/CHARACTER/character_down.png')";
        break;

      case nextPositionLeft:
        this.game.map.gridPlayer[this.getPosTile()].style.backgroundImage = "url('IMAGE/CHARACTER/character_left.png')";
        break;

      case nextPositionRight:
        this.game.map.gridPlayer[this.getPosTile()].style.backgroundImage = "url('IMAGE/CHARACTER/character_right.png')";
        break;
    }
  }
    
  movePosDirection(direction){
    this.setPosPath( (this.getPosPath() + direction) );
    this.setPosTile( this.getPath()[this.getPosPath()] );
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

  dieGoToBase(index){
  
    // On déclare que le joueur est mort
    this.die = true;
    this.game.currentTurnRespawnPlayer[index] = 3;
      
    // On remet la couleur d'origine
    this.game.map.gridPlayer[this.getPosTile()].style.backgroundImage = "";
    
    // Partie 3 On déplace le joueur,
    // Colorie la case d'arriver a la couleur du joueur,
    // Sauvegarde la couleur de la case de la base cible
    this.goSlotBase(index);

  }

  goSlotBase(index){
  // Partie 1 Trouver un slot disponible dans la base
    for( let i = 0; i < 4; i++){
      if (this.slotBase[i] === false ) {
        
        // Remplir le slot par true
        this.slotBase[i] = true;
        
        // Met a jour la position du joueur Path & Tile
        this.setPosTile(this.getPosTileBase()[i]);
        
        if(index === 0){ this.game.map.gridPlayer[this.getPosTile()].style.backgroundImage = this.getBackgroundImage(2);}
        else{ this.game.map.gridPlayer[this.getPosTile()].style.backgroundImage = this.getBackgroundImage(0); }
        
        break;
      }
    }
  } 
}