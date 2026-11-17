import { Spell } from './spell.js';
import { Effect } from './effect.js';

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
    this._deck = [Spell.ralentissement(), Spell.celerite(), Spell.recule(), Spell.avance(), Spell.appuie(), Spell.silence(), Spell.shield()];
    this._limitCardHand = 3;
    
    // Sprite & Animation
    this._character = Character;
    this._animSpell = null;
    
    this._sizeCharacterHeight = 64;
    this._sizeCharacterWidth = 64; 

    // Is
    this._isCast = false;
    this._isWalking = false;
    this._isDie = false;
    
    this._isTurnFinish = true;
    this._isPlayerIA = IsPlayerIA;
    this._isSilence = false;
    this._isShield = false;

    // Other
    this._currentTurnRespawn = -1;
    this._teamIndex = TeamIndex;
    this._playerIndex = PlayerIndex;
    this._race = Race;
    this._posNodePath = [];
    this._effect = [];
    this._contTarget = null;
  
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

    if (this._pm < 0) this._pm = 0;
    if (this._game.currentPlayer === this) this._game.ui.currentInfoPlayer();
    if (this._game.selectedPlayer === this) this._game.ui.targetInfoPlayer();
  }
  
  addPm(value){
    this._pm += value;
    if (this._game.currentPlayer === this) this._game.ui.currentInfoPlayer();
    if (this._game.selectedPlayer === this) this._game.ui.targetInfoPlayer();
  }
  removePm(value){ 
    this._pm -= value;
    
    if(this._pm < 0) this._pm = 0;
    if (this._game.currentPlayer === this) this._game.ui.currentInfoPlayer();
    if (this._game.selectedPlayer === this) this._game.ui.targetInfoPlayer();
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

  get isSilence(){
    return this._isSilence;
  }
  set isSilence(value){
    this._isSilence = value;
  }

  get isShield(){
    return this._isShield;
  }
  set isShield(value){
    this._isShield = value;
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

  // Animation
  get animSpell(){
    return this._animSpell;
  }
  set animSpell(value){
    this._animSpell = value;
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

  get contTarget(){
    return this._contTarget;
  }
  set contTarget(value){
    this._contTarget = value;
  }

  get effect(){
    return this._effect;
  }
  addEffect(effect){
    this._effect.push(effect);
  }
  deleteEffect(index){
    this._effect[index].removeEffect(this, this);
    this._effect.splice(index, 1);
  }
  calculEffect() { console.log(0);
    this._pm = this._pmMax;
    
    for (let i = this._effect.length - 1; i >= 0; i--) {
      let currentEffect = this._effect[i];
      
      currentEffect._turn--;
    
      if (currentEffect._turn <= 0) {   
        this.deleteEffect(i);
      } 
      else {
        currentEffect.applyEffect(this, this); 
      }
    }
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

  // Load
  load(){
    // Charge tout les éléments
    this.loadDoc();

    // Charge les événements
    this.loadEvent();

    // Le joueur commence en position Idle
    this._character.classList.add(`is-${this.getRace()}-idle`);
  }
  loadDoc(){
    // Spell
    this._animSpell = this._character.querySelector(".animSpell");
    
    // Target
    this._contTarget = this._character.querySelector(".contTarget");
  }
  loadEvent(){
    // Target conteneur
    this._character.addEventListener("click", () => { this.targetCharacter(); }); 
  }
  
  loadStartBase(){
    // Déclare le joueur mort
    this._isDie = true;
    
    // Reset les class
    this._character.classList.remove(`dir-up`, `dir-right`, `dir-down`, `dir-left`, `is-${this.getRace()}-idle`, `is-${this.getRace()}-walk`);
    this._character.classList.add(`is-${this.getRace()}-die`);

    // Déplace le joueur dans un slot libre de ça base & Applique 3 tour de respawn
    const slot = this._game.goSlotBase(this);
    this.currentTurnRespawn = 3 * (slot + 1);
  }
  loadStartPos(){
    // Déplace le joueur sur la position de départ & et le regard vers la prochaine case
    this.goPosTile(this._startPosTile);
    this.characterDirection(1);
  }

  // Gestion Die & Revive
  async revive(){
    // Variable
    const isTeamPlayer =  this._game.isTileTeamPlayer(this._respawnPosTile, this);
    
    // Si le joueur sur la case de spawn n'est pas dans la même équipe ou null
    if(!isTeamPlayer){
      
      // Rend invisible le joueur
      this._character.classList.add(`is-invisible`);
      await this.waitTransition(this._character);
      
      // Check la case d'arriver 
      const isTilePlayer = this._game.isTilePlayer(this._respawnPosTile, this);
      if (isTilePlayer != null) await isTilePlayer.die();
      
      // Met a jour la position & Téléporte le joueur
      this._posPath = this._respawnPosPath;
      this._posTile = this._respawnPosTile;    
      this.teleportPosTile(this._posTile);
  
      // Change la direction du perso et reset la posX de l'animation
      this.characterDirection(1);
      this._character.style.backgroundPositionX = `0px`;
  
      // Rend visible et active idle
      this._character.classList.remove(`is-${this.getRace()}-die`);
      this._character.classList.add(`is-${this.getRace()}-idle`);
  
      // Supprime dans la base le joueur et le rend visible
      this._game.removePlayerBase(this);   
      this._character.classList.remove(`is-invisible`); 
      await this.waitTransition(this._character);
  
      // Déclare le joueur ressucité & Réactive l'animation
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
    // On déclare le joueur mort
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

    // Appel a la fin du tour 
    if(this._game.currentPlayer === this) this._game.endTurnPlayer();
  }
  isCurrentTurnRespawn(){
    // Si le joueur est mort
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
  
  // Card
  addCard(){
    // Variable
    let drawCardNumber = this._limitCardHand - this._hand.length;

    // Pioche une carte dans le deck aléatoirement
    for(let i= 0; i < drawCardNumber; i++){
      // Variable random index
      let randomIndex = this.getRandomIndexDeck();

      // Ajoute une carte dans la main et la supprime du deck
      this.addCardHand(randomIndex);
      this.removeCardDeck(randomIndex);
    }

    // Met a jour l'interface si le joueur n'est pas une IA
    if(!this._isPlayerIA) this._game.ui.updateHand();
  }  
  async useCard(index, target) {
    // Variable
    const spell = this._hand[index];
    let echecSpell = false;

    // Il peut lancer un sort ?
    if (this.canCast(target, spell)) {
      // Vérouille 
      this._isCast = true;

      // Lance le cast et retourne si le sort a echoué
      echecSpell = await spell.cast(this, target, spell, this._game);

      // Dévérouille
      this._isCast = false;

      // Echec du sort
      if (!echecSpell) this.deleteCard(index); 
      else{
        if (!this.isPlayerIA) this._game.ui.addTextLog(`${this.name} lance ${spell._name} mais a echoué !`);      
      }
    } 
    else {
      
      // Gestion des cibles invalide ou des conditions de sort non réunie
      this.echecUseCard(spell, target);
    }

    // Retourne le bool de l'échec
    return echecSpell;
  }
  echecUseCard(spell, target){ 
    // IA | retourne la fonction directement pour eviter le spam dans le log fight
    if (this._game.currentPlayer.isPlayerIA) return;

    // Gestion des erreurs sur l'étât actuel du joueur 
    if (this._isSilence) this._game.ui.addTextLog(`[${spell._name}]: Vous êtes sous silence !`);
    if (this._isDie) this._game.ui.addTextLog(`[${spell._name}]: Vous êtes mort !`);
    if (this._isWalking) this._game.ui.addTextLog(`[${spell._name}]: Impossible de lancer de sort en marchant !`);
    if (this._isCast) this._game.ui.addTextLog(`[${spell._name}]: Lancer de sort déjà actif !`);
    
    // Gestion des erreurs sur la target
    if (target === null) this._game.ui.addTextLog(`[${spell._name}]: Aucune cible sélectionnée !`);      
    if (target.isShield) this._game.ui.addTextLog(`[${spell._name}]: ${target.name} est protéger par Bouclier !`);
    if (target.isDie) this._game.ui.addTextLog(`[${spell._name}]: Impossible ${target.name} est mort !`);
  }  
  deleteCard(index) {
    // Variable
    const card = this._hand[index];

    // Ajoute & Supprime une carte
    this.addCardDeck(card);
    this.removeCardHand(index);

    // Met a jour l'interface si le joueur actuel n'est pas une IA
    if(!this._isPlayerIA) this._game.ui.updateHand();
  }

  // Move
  async move(direction){   
    while(this._posNodePath.length > 0){
      if(this.canMove()){     
        // Vérouille
        this._isWalking = true;

        // On check la case d'arriver et tue la cible sur la case
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

          // On Retire 1 PM & 1 Node Path
          this.removePm(1);
          this.removeNodePath();

          // Met a jour l'information du joueur actuel & Teste la victoire
          this._game.ui.currentInfoPlayer(); 
          this._game.victoryPlayer(this._posTile, this);
        }

        // Gestion dynamique du z-index du joueur & et dévérouille la marche
        this._character.style.zIndex = 99 + this._posTile;
        this._isWalking = false;   
      }  
    }

    // Remove la class de marche et ajoute celle Idle
    this._character.classList.remove(`is-${this.getRace()}-walk`);
    this._character.classList.add(`is-${this.getRace()}-idle`);
  }
  async spellMove(direction, force){
    for(let i = 0; i < force; i++){
      if(this._posPath + direction >= 0){
        
        // On check la case d'arriver
        const isTilePlayer = this._game.isTilePlayer(this.getPosTileDirection(direction), this);
        if(isTilePlayer) await isTilePlayer.die();

        // Active l'animation de marche
        await this.moveAnimation(direction);   

        // Si le joueur n'est pas mort
        if(!this._isDie) {
          
          // On met a jour la position
          this._posTile = this.getPosTileDirection(direction);
          this._posPath = this.getPosPathDirection(direction);          

          // Test la victoire
          this._game.victoryPlayer(this._posTile, this);
        }

        // Gestion dynamique du z-index du joueur
        this._character.style.zIndex = 99 + this._posTile;
      }

      // Remove la class de marche et ajoute celle de Idle
      this._character.classList.remove(`is-${this.getRace()}-walk`);
      this._character.classList.add(`is-${this.getRace()}-idle`);    
    }
  }
  
  // Animation
  async spellAnimation(spell){
    // Variable
    const targetAnim = this._animSpell;

    // Ajoute l'image du sort sur le conteneur du joueur ciblé et la fait apparaitre
    targetAnim.style.backgroundImage = spell._animation;
    targetAnim.style.display = "block";

    // Applique la class du sort
    targetAnim.classList.add(`is-${spell._name}`);
    await this.waitAnimation(this._animSpell);

    // Remove la class du sort et fait disparaitre l'élement
    targetAnim.classList.remove(`is-${spell._name}`);
    targetAnim.style.display = "none";
  }
  async moveAnimation(direction) {
    // Reset les class du joueur et ajoute la marche
    this._character.classList.remove(`is-${this.getRace()}-idle`, `is-${this.getRace()}-die`, 'is-invisible');
    void this._character.offsetHeight;
    this._character.classList.add(`is-${this.getRace()}-walk`);

    // Le regard du joueur vers la direction de la prochaine case et ordone le déplacement du joueur
    this.characterDirection(direction);
    this.goPosTile(this.getPosTileDirection(direction), direction);

    // Applique un temps d'attente pour une animation de 1 pas
    await this.wait(400);
  }
  choiceFrame(element, numeroFrame, largeurTotale = 320, nombreFrames = 5) {
    if (numeroFrame < 1) numeroFrame = 1;
    if (numeroFrame > nombreFrames) numeroFrame = nombreFrames;

    const largeurFrame = largeurTotale / nombreFrames;

    const decalageX = -(numeroFrame - 1) * largeurFrame;
    
    // Réactive l'animation et change la posX du background
    element.style.animation = "none";
    element.style.backgroundPositionX = `${decalageX}px`;
  }

  // Character direction
  characterDirection(direction){
    // Variable
    let dir = ``;
    const currentTile = this._posTile;
    const nextTile = this.getPosTileDirection(direction);

    // Reset les class
    this._character.classList.remove(`dir-up`, `dir-right`, `dir-down`, `dir-left`, `is-${this.getRace()}-die`);

    // Applique la direction en fonction de la nouvelle tuile
    if (currentTile - 19 === nextTile)  dir = 'up';
    if (currentTile + 19 === nextTile)  dir = 'down';
    if (currentTile - 1 === nextTile)  dir = 'left';
    if (currentTile + 1 === nextTile)  dir = 'right';

    // Ajoute la nouvelle direction
    this._character.classList.add(`dir-${dir}`);
  }
  characterDirectionForced(dirForced){
    let dir = `${dirForced}`;
    this._character.classList.remove(`dir-up`, `dir-right`, `dir-down`, `dir-left`);
    this._character.classList.add(`dir-${dir}`);
  }
  
  // Déplacement
  goPosTile(posTile, direction){
    // Variable
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
    // Variable
    const grid = this._game.map.gridTile.getBoundingClientRect();
    const tile = this.getPosXY(posTile); 
    
    // Calcul de la position CIBLE centrée sur la tuile
    const targetX = (tile.left - grid.left) + (tile.width / 2) - (64 / 2);
    const targetY = (tile.top - grid.top) + (tile.height / 2) - (64 / 2);
    
    // Déplacement CSS
    element.style.left = `${targetX}px`;
    element.style.top = `${targetY + 128}px`;
  }
  async teleportPosTile(posTile){
    // Variable
    const grid = this._game.map.gridTile.getBoundingClientRect();
    const tile = this.getPosXY(posTile); 

    // Calcul de la position CIBLE centrée sur la tuile
    const targetX = (tile.left - grid.left) + (tile.width / 2) - (this._sizeCharacterWidth / 2);
    const targetY = (tile.top - grid.top) + (tile.height / 2) - (this._sizeCharacterHeight / 2) - 40;

    // Désactive les transitions
    this._character.style.transition = 'none';

    // Déplacement CSS
    this._character.style.left = `${targetX}px`;
    this._character.style.top = `${targetY}px`; 

    // Réactive les transitions 
    void this._character.offsetWidth;
    this._character.style.transition = '';

    // Met a jour la posTile
    this._posTile = posTile;
    this._posPath = 1;
  }

  // Node Path
  addNodePath(count, direction){
    if(this._posNodePath.length < this._pm){
      for(let i = 0; i < count; i++){
        
        // Ajoute une nouvelle position de Node Path et Paint celui-ci
        this._posNodePath.push(this.getPosTileDirection(this._posNodePath.length + direction));
        this._game.ui.paintTileElement(this._game.map.gridPathLevel[this._posNodePath[this._posNodePath.length - 1]], "white");
      }
    }
  }
  removeNodePath(){

    // Enlève la couleur du Node Path et le supprime
    this._game.ui.paintTileElement(this._game.map.gridPathLevel[this._posNodePath[0]], "");
    this._posNodePath.shift();
  }

  // Can
  canCast(target, spell) {
    
    // Le lanceur ne peut pas agir
    if (this._isDie || this._isCast || this._isWalking || this._isSilence) {
      return false;
    }
  
    // La cible est invalide
    if (!target || target.isDie) {
      return false;
    }
  
    // Gestion spécifique si la cible a un bouclier
    if (target.isShield) {
      if (spell._type === "Bonus") return true;
      if (spell._type === "Deplacement" && target === this) return true;
      if (spell._type === "Deplacement" && target.teamIndex === this.teamIndex) return true;
      
      // Si c'est un autre type de sort, le bouclier bloque
      return false; 
    }
  
    // Si la cible n'a pas de bouclier, comportement normal par défaut 
    return true; 
  }
  canMove(){
    if(this._pm > 0 && 
       !this._isWalking && 
       !this._isCast){
      return true;
    }
    else{
      return false;
    }
    
    return false;
  }

  // Other
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
  getRandomIndexDeck(){
    // Retourne un index aléatoire en fonction de la taille du deck
    return Math.floor(Math.random() * this._deck.length);
  }
  getSpellIndexByName(name){   
    for(let i = 0; i < this._hand.length; i++){
      if(this._hand[i]._name === name) { return i; }
    }
    
    return null;
  }
  targetCharacter() {
    // Si aucune cible
    if(this._game.selectedPlayer === null){
      // Fait apparaitre le conteneur Target du joueur selectionné et met a jour la variable
      this._contTarget.style.display = "block";
      this._game.selectedPlayer = this;
    }
    // Si il re-clique sur le même joueur
    else if(this._game.selectedPlayer === this){
      // Fait disparaitre le conteneur Target du joueur selectionné et met a jour la variable
      this._contTarget.style.display = "none";
      this._game.selectedPlayer = null;
    }
    // Si je clique sur un autre joueur
    else{
      // Fait diparaitre le conteneur Target de l'ancien joueur selectionné et met a jour la variable
      this._game.selectedPlayer._contTarget.style.display = "none";
      this._game.selectedPlayer = null;

      // Fait apparaitre le conteneur Target du nouveau joueur selectionné et met a jour la variable
      this._contTarget.style.display = "block";
      this._game.selectedPlayer = this;
    }

    // Met a jour l'information du joueur selectionné
    this._game.ui.targetInfoPlayer();
  } 

  // Waiting
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
}