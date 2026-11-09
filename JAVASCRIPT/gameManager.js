// Import 
import { Player } from './player.js';
import { UIManager } from './uiManager.js';
import { IA } from './ia.js';
import { Map } from './map.js';

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

    if(this._selectedPlayer === null){
      for(let i = 0; i < this._allPlayer.length; i++){
        this._allPlayer[i].character.classList.remove("isTurnPlay");
        this._allPlayer[i].character.classList.remove("isTarget");
      }
    }
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
    this._ui.debugWindow.style.display = "block";
      
    this._ui.hiddenGame.classList.add("is-invisible");
    await this.waitTransition(this._ui.hiddenGame);
    
    this._ui.textHiddenGame.textContent = "";
    this._ui.hiddenGame.classList.remove("is-invisible");
    this._ui.hiddenGame.classList.remove("hiddenGame");
    
    this.turnManager();
  }
  async loadPlayer(){
    this._player1 = new Player(this, "Soklai", this._startPosPathAllPlayer[0][0], this._startPosTileAllPlayer[0][0], this._map.player1Path, false, this._ui._character0, 0, 0, 0);
    this._player2 = new Player(this, "Joueur 2", this._startPosPathAllPlayer[1][0], this._startPosTileAllPlayer[1][0], this._map.player2Path, true, this._ui._character1, 1, 0, 1);
    this._player3 = new Player(this, "Soklai", this._startPosPathAllPlayer[0][1], this._startPosTileAllPlayer[0][1], this._map.player1Path, false, this._ui._character2, 0, 1, 0);
    this._player4 = new Player(this, "Joueur 2", this._startPosPathAllPlayer[1][1], this._startPosTileAllPlayer[1][1], this._map.player2Path, true, this._ui._character3, 1, 1, 1);      
    
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
      
      this._currentPlayer.isTurnFinish = false; 

      // Si le joueur n'est pas mort
      if(!this._currentPlayer.isDie){
        
        // On indique au joueur quelle personnage joue actuellement
        this._currentPlayer.character.classList.add("isTurnPlay");
        this._ui.addTextLog(this._currentPlayer.name + " commence sont tour !");
        this._ui.targetInfoPlayer();
        
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
    this._currentPlayer.pm = this._currentPlayer.pmMax;
    this._currentPlayer._posNodePath.length = 0;
    this._currentPlayer.character.classList.remove("isTurnPlay");
    
    this.selectedPlayer = null;
    this._ui.addTextLog(this._currentPlayer.name + " a terminé sont tour !");
    this._currentPlayer.isTurnFinish = true;
  } 

  async respawnManager(){
    for(let index = 0; index < this._allPlayer.length; index++){
      if(this._allPlayer[index].isDie){
        
        this._allPlayer[index].currentTurnRespawn -= 1;
        if(this._allPlayer[index].currentTurnRespawn === 0) await this._allPlayer[index].revive();
      }
    }
  }

  // IS
  isTilePlayer(positionTile, player){
    for( let index= 0; index < this._allPlayer.length; index++){  
      if(positionTile === this._allPlayer[index].posTile){
       
        return this._allPlayer[index];
      }  
    }
    return null;
  } 
  
  isTileTeamPlayer(positionTile, player){
    const playerIsTile = this.isTilePlayer(positionTile, player);

    // Si le joueur est dans la même équipe
    if(playerIsTile != null && playerIsTile.teamIndex === player.teamIndex){    
      return true;
    }
    // Si il y a pas de joueur
    else if(playerIsTile === null ){
      return false;
    }
    // Si le joueur est dans l'équipe opposé
    else{
      return false;
    }
  } 
  
  isTileWall(){
    for(let i = 0; i < this._map.allPosWall.length; i++){
      if(this._currentPlayer.posTile === this._map.allPosWall[i]){
        return true;
      }
    }
    return null;
  }
  
  // Base
  goSlotBase(player){
    let teamIndex = player.teamIndex;
    
    for( let slot = 0; slot < 4; slot++){
      if (this._slotBase[teamIndex][slot] === null ) {
        
        this._slotBase[teamIndex][slot] = player;
        
        player.teleportPosTile(this._map.allPosBase[teamIndex][slot]);
        
        return slot;
      }
    }
  } 

  removePlayerBase(player){
    for( let index = 0; index < 2; index++){
      for( let slot = 0; slot < 4; slot++){
        if (this._slotBase[index][slot] === player ) {
          
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
    const randomWeather = this.getRandomIntTab(this._weather); 
    this._ui.addTextLog("Météo: " + this._weather[randomWeather]);
    
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

    this._ui._elemWeather.classList.remove(`weather-snow`, `weather-fog`, `weather-rain`, `weather-wind`);
  }
  
  async loadSun(){
    for(let i = 0; i < this._allPlayer.length; i++){
      if(!this._allPlayer[i].isDie) this._allPlayer[i].pm += 1;
    }
  }

  async loadStorm(){
    const random = this.getRandomInt(2);
    let direction = 0;
    const force = 2;
        
    this._ui.elemWeather.classList.add("weather-wind");
    
    if(random === 0 ) { direction = 1; }
    else{ direction = -1; }

    for(let i = 0; i < this._allPlayer.length; i++){
      if(!this._allPlayer[i].isDie) await this._allPlayer[i].spellMove(direction, force);
    }
    
    //await this.waitAnimation(this._ui.weather);
  }

  async loadBlizzard() {
    this._ui.elemWeather.classList.add("weather-snow");
        
    for (let i = 0; i < this._allPlayer.length; i++) {
      if (!this._allPlayer[i].isDie) {
        this._allPlayer[i].pm -= 1;
      }
    }
      
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
    if(posTilePlayer === 180){ 
      this._endGame = true;
      this._ui.showVictory(player);
    }
  }  
}