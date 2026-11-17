// Import 
import { Player } from './player.js';
import { UIManager } from './uiManager.js';
import { IA } from './ia.js';
import { Map } from './map.js';
import { Effect } from './effect.js';

export class GameManager{
  constructor(){
    // Instance
    this._map = new Map();
    this._ui = new UIManager(this);
    this._ia = new IA(this);
    
    // Variable local
    // Position
    this._startPosPathAllPlayer = [ [1, 1], [1, 1] ];/* [ 34 test die ] [ 70 test victory ] [1 = start pos & die] */
    this._startPosTileAllPlayer = [ [134, 134], [226, 226] ]; /*[ 134 | 226 tile start ] [ 179 | 181 tile victory] */
    
    this._orderPlayer = [];
    this._endGame = false;
    this._weather = ["Soleil", "Blizzard", "Tempête"/*, "fog", "rain", "solar storm"*/];    
    
    // Turn
    this._turn = 0;
    
    this._player1 = null;
    this._player2 = null;
    this._player3 = null;
    this._player4 = null;
    
    this._slotBase = [ [null, null, null, null], [null, null, null, null] ];
    this._allPlayer = [];
    this._currentPlayer = null;
    this._selectedPlayer = null;
  }

  // Getter setter local
  
  // Slot base
  get slotBase(){
    return this._slotBase;
  }
  setSlotBase(index, value){
    this._slotBase= value;
  }

  // Player
  get player1() {
    return this._player1;
  }
  get player2() {
    return this._player2;
  }
  get player3() {
    return this._player3;
  }
  get player4() {
    return this._player4;
  }
  
  get allPlayer() {
    return this._allPlayer;
  }
  set allPlayer(value) {
    this._allPlayer = value
  }
  
  get currentPlayer() {
    return this._currentPlayer;
  }
  set currentPlayer(value) {
    this._currentPlayer = value
  }
  
  get selectedPlayer() {
    return this._selectedPlayer;
  }
  set selectedPlayer(value) {
    this._selectedPlayer = value;
  }
  
  // Other
  get map(){
    return this._map;
  }
  get ui(){
    return this._ui;
  }
  get ia(){
    return this._ia;
  }

  // Load game
  async load(){
    // Load
    await this._map.load();
    await this._ui.load();
    
    await this.loadPlayer();
    
    // Debug
    //this._ui.debugWindow.style.display = "block";
      
    this._ui.hiddenGame.classList.add("is-invisible");
    await this.waitTransition(this._ui.hiddenGame);
    
    this._ui.textHiddenGame.textContent = "";
    this._ui.hiddenGame.classList.remove("is-invisible");
    this._ui.hiddenGame.classList.remove("hiddenGame");
    
    this.turnManager();
  }
  async loadPlayer(){
    this._player1 = new Player(this, "Soklai", this._startPosPathAllPlayer[0][0], this._startPosTileAllPlayer[0][0], this._map.player1Path, false, this._ui._character0, 0, 0, 0);
    this._player2 = new Player(this, "Gérar", this._startPosPathAllPlayer[1][0], this._startPosTileAllPlayer[1][0], this._map.player2Path, true, this._ui._character1, 1, 0, 1);
    this._player3 = new Player(this, "Popey", this._startPosPathAllPlayer[0][1], this._startPosTileAllPlayer[0][1], this._map.player1Path, false, this._ui._character2, 0, 1, 0);
    this._player4 = new Player(this, "Shakira", this._startPosPathAllPlayer[1][1], this._startPosTileAllPlayer[1][1], this._map.player2Path, true, this._ui._character3, 1, 1, 1);      
    
    this._player1.load();
    this._player2.load();
    this._player3.load();
    this._player4.load();
    
    this._allPlayer.push(this._player1);
    this._allPlayer.push(this._player2);
    this._allPlayer.push(this._player3);
    this._allPlayer.push(this._player4);

    this._player1.loadStartPos();
    this._player2.loadStartPos();
    this._player3.loadStartBase();
    this._player4.loadStartBase();
    
    for(let index = 0; index < this._allPlayer.length; index++ ){
      this._orderPlayer.push(this._allPlayer[index]);
    }  
  }

  // Turn manager
  async turnManager(){
    while(!this._endGame){
       await this.loadWeather();
       await this.turnPlayer();
       await this.respawnManager();        
    }
  }

  async turnPlayer(){
    for(let index = 0; index < this._orderPlayer.length; index++ ){
      // On fait commencer les joueurs dans un ordre & et on autorise a jouer chacun leur tour
      this._currentPlayer = this._orderPlayer[index];
      //this._ui.debugText = this.currentPlayer.effect[0] ? `${this.currentPlayer.effect[0]._name}` : "null";
      this._currentPlayer.isTurnFinish = false; 

      // Si le joueur n'est pas mort
      if(!this._currentPlayer.isDie){
        
        // On indique au joueur quelle personnage joue actuellement
        this._currentPlayer.character.classList.add("isTurnPlay");
        this._ui.addTextLog(this._currentPlayer.name + " commence sont tour !");
        this._ui.currentInfoPlayer();
        
        // On distribue au joueur les carte et on met a jour l'interface
        this._currentPlayer.addCard();
        if(!this._currentPlayer.isPlayerIA) this._ui.updateHand();

        // Si le joueur est une IA
        if(this._currentPlayer.isPlayerIA) { this._ia.turnPlayerIA(); }      
      }
      // Si le joueur est mort
      else{
        this.endTurnPlayer(); 
      }     
      
      await this.waitFinishTurn( () => this._currentPlayer.isTurnFinish === true);
    }
  }

  endTurnPlayer(){
    //Calcul effect
    this._currentPlayer.calculEffect();
    
    // Reset les nodes path & isTurnPlayer
    this._currentPlayer._posNodePath.length = 0;
    this._currentPlayer.character.classList.remove("isTurnPlay");

    // Si le joueur selectionné est différent de null
    if(this._selectedPlayer != null){
      
      // Fait disparaitre le conteneur Target & supprime le profile
      this._selectedPlayer.contTarget.style.display = "none";
      this._ui._elemCharacterInfoPlayerRight.style.backgroundImage = ""; 

      // Reset le texte information player & met a jour la variable selected
      this._ui._elemTextInfoPlayerRight.textContent = "";
      this._selectedPlayer = null;
    }

    // Annonce la fin du tour 
    if (!this._currentPlayer.isDie) this._ui.addTextLog(this._currentPlayer.name + " a terminé sont tour !");
    this._currentPlayer.isTurnFinish = true;
  } 

  async respawnManager(){
    // Parcour tout les joueurs
    for(let index = 0; index < this._allPlayer.length; index++){
      
      // Si le joueur est mort
      if(this._allPlayer[index].isDie){

        // Diminue de 1 le nombre de tour restant pour respawn & réssucite le joueur si le nombre de tour restant = 0
        this._allPlayer[index].currentTurnRespawn -= 1;
        if(this._allPlayer[index].currentTurnRespawn === 0) await this._allPlayer[index].revive();
      }
    }
  }

  // IS
  isTilePlayer(positionTile, player){
    // Parcour tout les joueurs
    for( let index= 0; index < this._allPlayer.length; index++){  
      
      // Si la position de la tuile d'arriver = la position d'un joueur
      if(positionTile === this._allPlayer[index].posTile){
       
        // Retourne le joueur 
        return this._allPlayer[index];
      }  
    }
    
    // Sécurité retourne null
    return null;
  }
  hasPlayerOnPath(player, forceMove){
    // Variable
    let posTile = player.posTile;

    // Répéte en fonction de forceMove
    for(let i = 0; i < forceMove; i++){
      // Variable
      posTile = player.getPosTileDirection(i);

      // Parcour tout les joueurs
      for(let j = 0; j < this._allPlayer.length; j++){
        // Si un joueur = la position de la tuile d'arriver on retourne le joueur
        if(this._allPlayer[j].posTile === posTile) return this._allPlayer[j];
        else console.log(this._allPlayer[j].name + " ne se trouve pas sur la case");
      }
      
      console.log("Aucun joueur sur la case");
    }
    
    //Si aucun joueur sur le chemin
    console.log("Aucun joueur sur le chemin");
    return null;
  }
  isTileTeamPlayer(positionTile, player){
    // Variable
    const playerIsTile = this.isTilePlayer(positionTile, player);

    // Si le joueur est dans la même équipe
    if(playerIsTile != null && playerIsTile.teamIndex === player.teamIndex){    
      return true;
    }
    // Si aucun joueur
    else if(playerIsTile === null ){
      return false;
    }
    // Si le joueur est dans l'équipe opposé
    else{
      return false;
    }

    // Sécurité retourne null
    return null;
  } 
  isTileWall(){
    // Parcour les positions de toute les cases murs
    for(let i = 0; i < this._map.allPosWall.length; i++){
      
      // Si le joueur actuel = la position d'une case mur retourne true
      if(this._currentPlayer.posTile === this._map.allPosWall[i]){
        return true;
      }
    }
    // Sécurité retourne false
    return false;
  }
  
  // Base
  goSlotBase(player){
    // Variable
    let teamIndex = player.teamIndex;

    // Parcour tout les slots
    for( let slot = 0; slot < 4; slot++){

      // Si le slot est vide
      if (this._slotBase[teamIndex][slot] === null ) {

        // Ajoute le joueur dans le slot & le téléporte dans la base & retourne le slot
        this._slotBase[teamIndex][slot] = player;
        player.teleportPosTile(this._map.allPosBase[teamIndex][slot]);
        return slot;
      }
    }
  } 
  removePlayerBase(player){
    // Parcour les bases
    for( let index = 0; index < 2; index++){

      // Parcour les slots
      for( let slot = 0; slot < 4; slot++){

        // Si le slot contient un joueur
        if (this._slotBase[index][slot] === player ) {

          // Vide le slot & break
          this._slotBase[index][slot] = null;
          break;
        }
      }
    }
  }

  // Random
  getRandomIntTab(tab){
    return Math.floor(Math.random() * tab.length);
  }
  getRandomInt(maxRange){
    return Math.floor(Math.random() * maxRange);
  }

  // Weather
  async loadWeather(){
    // Variable
    const randomWeather = this.getRandomIntTab(this._weather); 
    
    switch(randomWeather){
        
      case 0: /* Sun */      
        await this.loadSun();
        break;

      case 1: /* Blizzard */
        await this.loadBlizzard();
        break;

      case 2: /* Storm */
        await this.loadStorm();
        break;

      case 3:
        break;

      case 4:
        break;

      case 5:
        break;

      default:
        break;
    }

    // Reset les class sur l'élément weather
    this._ui._elemWeather.classList.remove(`weather-snow`, `weather-fog`, `weather-rain`, `weather-wind`);
  }
  
  async loadSun(){
    // Déclare la météo dans le log fight
    this._ui.addTextLog(`Soleil: Tout les joueurs gagne 2 points de mouvements pendant 1 tour.`);

    // Parcour tout les joueurs
    for(let i = 0; i < this._allPlayer.length; i++){

      // Si le joueur est pas mort
      if(!this._allPlayer[i].isDie){
        // Variable
        let currentEffect = Effect.addPm(1, 1);

        // Ajoute l'effet au joueur & l'applique
        this._allPlayer[i].addEffect(currentEffect);
        currentEffect.applyEffect(null, this._allPlayer[i]);
      } 
    }
  }
  async loadStorm(){
    // Variable
    const random = this.getRandomInt(2);
    let direction = 0;
    const force = 2;

    // Ajoute la class sur l'élément weather
    this._ui.elemWeather.classList.add("weather-wind");

    // Avance tout les joueurs
    if(random === 0 ) {
      direction = 1;
      this._ui.addTextLog(`Tempête: Tout les joueurs avance de 2 cases`);
    
    }
    // Recule tout les joueurs
    else{
      direction = -1;
      this._ui.addTextLog(`Tempête: Tout les joueurs recule de 2 cases`);
    }

    // Parcour tout les joueurs
    for(let i = 0; i < this._allPlayer.length; i++){

      // Si le joueur n'est pas mort on le déplace
      if(!this._allPlayer[i].isDie) await this._allPlayer[i].spellMove(direction, force);
    }
  }
  async loadBlizzard() {
    // Déclare la météo dans le log fight & ajoute la class sur l'élément weather
    this._ui.addTextLog(`Blizzard: Tout les joueurs perd 2 points de mouvements pendant 1 tour`);
    this._ui.elemWeather.classList.add("weather-snow");

    // Parcour tout les joueurs
    for (let i = 0; i < this._allPlayer.length; i++) {

      // Si le joueur n'est pas mort
      if (!this._allPlayer[i].isDie) {
        //  Variable
        let currentEffect = Effect.addPm(1, 1);

        // Ajoute et applique l'effet sur le joueur
        this._allPlayer[i].addEffect(Effect.removePm(1, 1));
        currentEffect.applyEffect(null, this._allPlayer[i]);
      }
    }

    // Attend la fin de l'animation
    await this.waitAnimation(this._ui.elemWeather);
  }

  // Wait
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  waitAnimation(element) {
  return new Promise(resolve => {
    element.addEventListener('animationend', resolve, { once: true });
  });
  }
  waitFinishTurn(getterCondition, valeurAttendue = true) {
    return new Promise((resolve) => {
      // Si la condition est déjà remplie tout de suite
      if (getterCondition() === valeurAttendue) {
        return resolve();
      }

      // Sinon, on vérifie régulièrement (intervalle léger de 50ms)
      const interval = setInterval(() => {
        if (getterCondition() === valeurAttendue) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }
  waitTransition(element) {
    return new Promise(resolve => {
      let resolved = false;

      const handler = () => {
        if (!resolved) {
          resolved = true;
          element.removeEventListener('transitionend', handler);
          resolve();
        }
      };

      element.addEventListener('transitionend', handler, { once: true });

      // SÉCURITÉ ANTI-BLOCAGE : Si au bout de 1 seconde la transition ne répond pas, on force la suite !
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          element.removeEventListener('transitionend', handler);
          resolve();
        }
      }, 8000);
    });
  }

  // Other
  victoryPlayer(posTilePlayer, player){

    // Si la position du joueur = 180
    if(posTilePlayer === 180){

      // On stop le jeu & affiche la fenêtre de victoire
      this._endGame = true;
      this._ui.showVictory(player);
    }
  }  
}