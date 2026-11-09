import { Spell } from './spell.js';

export class Player{  
  constructor(GameInstance, Name, PosPath, PosTile, Path, IsPlayerIA, Character, TeamIndex, PlayerIndex, Race){
    // Instance 
    this._game = GameInstance;
    
    // Variable
    //Name
    this._name = Name;

    // PM
    this._pm = 4;
    this._pmMax = 4;

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
    
    // Sprite & Animation
    this._character = Character;
    this._animEffect = null;
    
    this._sizeCharacterHeight = 64;
    this._sizeCharacterWidth = 64; 

    // Is
    this._isCast = false;
    this._isWalking = false;
    this._isDie = false;
    
    this._isTurnFinish = true;
    this._isPlayerIA = IsPlayerIA;

    // Other
    this._currentTurnRespawn = -1;
    this._forceMove = 0;
    this._teamIndex = TeamIndex;
    this._playerIndex = PlayerIndex;
    this._race = Race;
    this._posNodePath = [];
  }

  // Getter Setter local

  // Name
  get name(){
    return this._name;
  }
  set name(value){
    this._name = value;
  }

  // PM
  get pm(){
    return this._pm;
  }
  set pm(value){
    this._pm = value;

    if(this._pm < 0) this._pm = 0;
    if(this._game.currentPlayer === this || this._game.selectedPlayer === this) this._game.ui.targetInfoPlayer();
  }
  
  addPm(value){
    this._pm += value;
    if(this._game.currentPlayer === this || this._game.selectedPlayer === this) this._game.ui.targetInfoPlayer();
   }
  removePm(value){ 
    this._pm -= value;
    
    if(this._pm < 0) this._pm = 0;
    if(this._game.currentPlayer === this || this._game.selectedPlayer === this) this._game.ui.targetInfoPlayer();
 }

  get pmMax(){
    return this._pmMax;
  }
  set pmMax(value){
    this._pmMax = value;
  }

  // Is
  get isDie(){
    return this._isDie;
  }
  set isDie(value){
    this._isDie = value;
  }

  get isWalking(){
    return this._isWalking;
  }
  set isWalking(value){
    this._isWalking = value;
  }

  get isPlayerIA(){
    return this._isPlayerIA;
  }
  set isPlayerIA(value){
    this._isPlayerIA = value;
  }

  get isTurnFinish(){
    return this._isTurnFinish; 
  }
  set isTurnFinish(value){ 
    this._isTurnFinish = value;
  }

  get isCast(){
    return this._isCast;
  }
  set isCast(value){
    this._isCast = value;
  }

  // Pos Tile & Path
  get startPosPath(){
    return this._startPosPath;
  }
  set startPosPath(value){
    this._startPosPath = value;

    if(this._startPosPath < 0) this._startPosPath = 0;
  }
  
  get respawnPosPath(){
    return this._respawnPosPath;
  }
  set respawnPosPath(value){
    this._respawnPosPath = value;

    if(this._respawnPosPath < 0) this._respawnPosPath = 0;
  }

  get startPosTile(){
    return this._startPosTile;
  }
  set startPosTile(value){
    this._startPosTile = value;

    if(this._startPosTile < 0) this._startPosTile = 0;
  }
  
  get respawnPosTile(){
    return this._respawnPosTile;
  }
  set respawnPosTile(value){
    this._respawnPosTile = value;

    if(this._respawnPosTile < 0) this._respawnPosTile = 0;
  }

  get posPath(){
    return this._posPath;
  }
  set posPath(value){
    this._posPath = value;
    
    if(this._posPath < 0) this._posPath = 0;
  }

  get posX(){
    return this._posX;
  }
  set posX(value){
    this._posX = value;

    if(this._posX < 0) this._posX = 0;
  }

  get posY(){
    return this._posY;
  }
  set posY(value){
    this._posY = value;

    if(this._posY < 0) this._posY = 0;
  }

  get path(){
    return this._path;
  }

  // Pos tile
  get posTile(){
    return this._posTile;
  }
  set posTile(value){
    this._posTile = value;

    if(this._posTile < 0) this._posTile = 0;
  }

  // Hand
  get hand(){
    return this._hand;
  }
  set hand(value){ 
    this._hand = value;
  }

  addCardHand(index){
    this._hand.push(this._deck[index]);
  }
  removeCardHand(index){
    this._hand.splice(index, 1);
  }

  // Deck
  get deck(){
    return this._deck;
  }
  set deck(value){
    this._deck = value;
  }

  addCardDeck(card) {
    this._deck.push(card);
  }
  removeCardDeck(index){ 
    this._deck.splice(index, 1);
  }

  // Force move
  get forceMove(){
    return this._forceMove;
  }
  set forceMove(value){
    this._forceMove = value;

    if(this._forceMove < 0) this._forceMove = 0;
  }

  // Animation
  get animEffect(){
    return this._animEffect;
  }
  set animEffect(value){
    this._animEffect = value;
  }
  
  // Character
  get character(){
    return this._character;
  }
  set character(value){
    this._character = value;
  }

  // Turn respawn
  get currentTurnRespawn(){
    return this._currentTurnRespawn;
  }
  set currentTurnRespawn(value){ 
    this._currentTurnRespawn = value;
    
    if(this._currentTurnRespawn < 0) this._currentTurnRespawn = 0;
    this.isCurrentTurnRespawn();
  }

  // Id
  get teamIndex(){
    return this._teamIndex;
  }
  get playerIndex(){
    return this._playerIndex;
  }
  get race(){
    return this._race;
  }
  
  // Get position
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

  // Get other
  getSpellIndexByName(name){   
    for(let i = 0; i < this._hand.length; i++){
      if(this._hand[i]._name === name) { return i; }
    }
    
    return null;
  }
  addNodePath(count, direction){
    if(this._posNodePath.length < this._pm){
      for(let i = 0; i < count; i++){
        this._posNodePath.push(this.getPosTileDirection(this._posNodePath.length + direction));
        this._game.ui.paintTileElement(this._game.map.gridPathLevel[this._posNodePath[this._posNodePath.length - 1]], "white");
      }
    }
  }
  removeNodePath(){
    this._game.ui.paintTileElement(this._game.map.gridPathLevel[this._posNodePath[0]], "");
    this._posNodePath.shift();
  }

  // Load
  load(){
    this.loadDoc();
    this.loadEvent();
    this._character.classList.add(`is-${this.getRace()}-idle`);
  }
  loadDoc(){
    this._animEffect = this._character.querySelector(".animEffect");
  }
  loadEvent(){
    this._character.addEventListener("click", () => { this.targetCharacter(); }); 
  }
  
  loadStartBase(){
    this._isDie = true;
    
    // Reset les class
    this._character.classList.remove(`dir-up`, `dir-right`, `dir-down`, `dir-left`, `is-${this.getRace()}-idle`, `is-${this.getRace()}-walk`);
    this._character.classList.add(`is-${this.getRace()}-die`);
    
    const slot = this._game.goSlotBase(this);
    this.currentTurnRespawn = 3 * (slot + 1);
  }
  loadStartPos(){
    this.goPosTile(this._startPosTile);
    this.characterDirection(1);
  }
  
  async revive(){
    const isTeamPlayer =  this._game.isTileTeamPlayer(this._respawnPosTile, this);
    
    // Si le joueur sur la case de spawn n'est pas dans la même équipe ou null
    if(!isTeamPlayer){      
      // Rend invisible le joueur
      this._character.classList.add(`is-invisible`);
      await this.waitTransition(this._character);
      
      // Déplacement du joueur
      this._posPath = this._respawnPosPath;
      this._posTile = this._respawnPosTile;    
      this.teleportPosTile(this._posTile);
  
      // Change la direction du perso et reset la pos de l'animation
      this.characterDirection(1);
      this._character.style.backgroundPositionX = `0px`;
  
      // Rend visible et active idle
      this._character.classList.remove(`is-${this.getRace()}-die`);
      this._character.classList.add(`is-${this.getRace()}-idle`);
  
      // Supprime dans la base le joueur et le rend visible
      this._game.removePlayerBase(this);   
      this._character.classList.remove(`is-invisible`); 
      await this.waitTransition(this._character);
  
      // Déclare le joueur ressucité
      this._character.style.animation = '';
      this._isDie = false;
      this._game.ui.addTextLog(this._name + " est ressucité !");    
    }
    // Si le joueur sur la case d'arrivé est dans la même équipe
    else{
      this._game._ui.addTextLog(`Un allié bloque la case de résurection`);
    }
  }
  async die(){
    this._isDie = true;
    this._game._ui.addTextLog(this._name + " est mort !");
       
    // Reset les class
    this._character.classList.remove(`dir-up`, `dir-right`, `dir-down`, `dir-left`, `is-${this.getRace()}-idle`, `is-${this.getRace()}-walk`);
    
    // Active l'animation de mort
    this._character.classList.add(`is-${this.getRace()}-die`);
    await this.waitAnimation(this._character);
    
    //Rend invisible
    this._character.classList.add(`is-invisible`);
    await this.waitTransition(this._character);
    
    // Ajoute le joueur dans ça base et met a jour le nombre de tour pour revivre 
    this._game.goSlotBase(this);
    this.currentTurnRespawn = 3;
    
    // Rend le joueur visible
    this._character.classList.remove(`is-invisible`);
    await this.waitTransition(this._character);

    if(this._game.currentPlayer === this) this._game.endTurnPlayer();
  }

  isCurrentTurnRespawn(){
    if(this._isDie){
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
      else if(this._currentTurnRespawn >= 3){
        this.choiceFrame(this._character, 6);
      }       
    }
  }
  
  addCard(){
    let drawCardNumber = this._limitCardHand - this._hand.length;
  
    for(let i= 0; i < drawCardNumber; i++){
      let randomIndex = this.getRandomIndexDeck();
      
      this.addCardHand(randomIndex);
      this.removeCardDeck(randomIndex);
    }
    
    if(!this._isPlayerIA) this._game.ui.updateHand();
  }
  
  async useCard(index, target) {
    const spell = this._hand[index];
    const caster = this._game.currentPlayer;
    
    // Si pas de sort en cour ou de marche active ou aucune cible  
    if (target != null && !this._isCast && !this._isWalking){
      this._isCast = true;
      let echecSpell = await spell.cast(caster, target);
      
      // Si le sort réussie
      if (!echecSpell) {
        this._game.ui.addTextLog(`${caster.name} lance ${spell._name}`); 
        this.deleteCard(index);
      }
      // Si le sort échoue
      else { 
        this._game.ui.addTextLog(`[${spell._name}]: Le sort a échouer`); 
      }
          
      this._isCast = false;
    }
    else{
      if(this.isWalking) this._game.ui.addTextLog(`[${spell._name}]: Impossible de lancer de sort en marchant`); 
      if(this.isCast) this._game.ui.addTextLog(`[${spell._name}]: Lancer de sort déjà actif`); 
      if(this.target === null) this._game.ui.addTextLog(`[${spell._name}]: Aucune cible sélectionnée`);
    }
  }
  
  deleteCard(index) {
    const card = this._hand[index];
    
    this.addCardDeck(card);      // Ajoute le vrai objet Spell dans le deck
    this.removeCardHand(index);   // Supprime de la main
    
    if(!this._isPlayerIA) this._game.ui.updateHand();
  }

  //Partie autre
  
  getRandomIndexDeck(){
    return Math.floor(Math.random() * this._deck.length);
  }

  async move(direction){   
    while(this._posNodePath.length > 0){
      if(this._pm > 0 && !this._isWalking && !this._isCast){
        this._isWalking = true;

        // On check la case d'arriver
        const isTilePlayer = this._game.isTilePlayer(this.getPosTileDirection(direction), this);
        if(isTilePlayer){
          // On reset pour eviter de marcher surplace
          this._character.classList.remove(`is-${this.getRace()}-walk`);
          this._character.classList.add(`is-${this.getRace()}-idle`);
  
          await isTilePlayer.die();
        }
        
        // On lance l'animation de marche vers la position
        await this.moveAnimation(direction);
        
        if(!this._isDie) {
          // On met a jour la position
          this._posTile = this.getPosTileDirection(direction);
          this._posPath = this.getPosPathDirection(direction);          
          
          this.removePm(1);
          this.removeNodePath();
          this._game.selectedPlayer = this;
          
          this._game._ui.targetInfoPlayer();
          this._game.victoryPlayer(this._posTile, this);
        }

        this._character.style.zIndex = 99 + this._posTile;
        this._isWalking = false;   
      }  
    }
    
    this._character.classList.remove(`is-${this.getRace()}-walk`);
    this._character.classList.add(`is-${this.getRace()}-idle`);
  }

  async spellMove(direction, force){
    for(let i = 0; i < force; i++){
      if(this._posPath + direction >= 0){
        
        // On check la case d'arriver
        const isTilePlayer = this._game.isTilePlayer(this.getPosTileDirection(direction), this);
        if(isTilePlayer){
          await isTilePlayer.die();
        }
        
        await this.moveAnimation(direction);   
        
        if(!this._isDie) {
          // On met a jour la position
          this._posTile = this.getPosTileDirection(direction);
          this._posPath = this.getPosPathDirection(direction);          

          this._game.victoryPlayer(this._posTile, this);
        }

        this._character.style.zIndex = 99 + this._posTile;
      }
      
      this._character.classList.remove(`is-${this.getRace()}-walk`);
      this._character.classList.add(`is-${this.getRace()}-idle`);    
    }
  }

  async spellAnimation(spell, target){
    const targetAnim = target._animEffect;
    
    targetAnim.style.backgroundImage = spell._animation;
    targetAnim.style.display = "block";
    
    targetAnim.classList.add(`is-${spell._name}`);
    await this.waitAnimation(this._animEffect);
    
    targetAnim.classList.remove(`is-${spell._name}`);
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

    this._character.classList.remove(`dir-up`, `dir-right`, `dir-down`, `dir-left`, `is-${this.getRace()}-die`);

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

  async moveAnimation(direction) {

    this._character.classList.remove(`is-${this.getRace()}-idle`, `is-${this.getRace()}-die`, 'is-invisible');
    void this._character.offsetHeight;
    this._character.classList.add(`is-${this.getRace()}-walk`);
    
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
    const targetY = (tile.top - grid.top) + (tile.height / 2) - (this._sizeCharacterHeight / 2) - 40;
    
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
    const targetY = (tile.top - grid.top) + (tile.height / 2) - (this._sizeCharacterHeight / 2) - 40;

    this._character.style.transition = 'none';

    this._character.style.left = `${targetX}px`;
    this._character.style.top = `${targetY}px`; 

    void this._character.offsetWidth;
    this._character.style.transition = '';
    
    this._posTile = posTile;
    this._posPath = 1;          
  }

  targetCharacter() {
    // 1. Si aucun joueur n'est actuellement sélectionné
    if (this._game.selectedPlayer === null) {
      this._game.selectedPlayer = this;
      this._character.classList.remove("isTurnPlay");
      this._character.classList.add("isTarget");                   
    }
    // 2. Si je re-clique sur le même joueur (on désélectionne)
    else if (this._game.selectedPlayer === this) {
      this._character.classList.remove("isTarget");
      this._game.selectedPlayer = null;
      
      // Si c'est le joueur dont c'est le tour, on remet son indicateur de tour
      if (this._game.currentPlayer === this) {
        this._character.classList.add("isTurnPlay");
      }
    }
    // 3. Si je clique sur un AUTRE joueur
    else {
      // Nettoyer l'ancien joueur sélectionné pour enlever sa classe "isTarget"
      if (this._game.selectedPlayer && this._game.selectedPlayer._character) {
        this._game.selectedPlayer._character.classList.remove("isTarget");
        
        // S'il était aussi le joueur du tour, on lui remet son indicateur "isTurnPlay"
        if (this._game.currentPlayer === this._game.selectedPlayer) {
          this._game.selectedPlayer._character.classList.add("isTurnPlay");
        }
      }

      // Assigner le nouveau joueur sélectionné
      this._game.selectedPlayer = this;
      this._character.classList.remove("isTurnPlay");
      this._character.classList.add("isTarget");
    }

    // Mise à jour de l'interface utilisateur
    this._game.ui.targetInfoPlayer();
  }

  getRace(){  
    switch(this._race){
        
      case 0: /* Human */
        return "human";
        break;
        
      case 1: /* Orc */
        return "orc";
        break;

      default:
        return "human";
    }
  }
}