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
    this._startPosPathAllPlayer = [1, 1];/* 34 test die */
    this._startPosTileAllPlayer = [134, 226]; /* 226 tile start */
    this._slotBase = [ [null, null, null, null], [null, null, null, null] ];
    
    this._orderPlayer = [];
    this._endGame = false;
    this._weather = ["Soleil", "Blizzard", "Tempête"/*, "fog", "rain", "solar storm"*/];    
    
    // Turn
    this._turnPlayerIndex = 0;
    this._turn = 0;
    this._turnPlayerFinish = [true, true];
    //this._currentTurnRespawnPlayer = [2, 2];
    
    // Player
    this._player1 = new Player(this, "Soklai", this._startPosPathAllPlayer[0], this._startPosTileAllPlayer[0], this._map.player1Path, false, this._ui._character0);
    this._player2 = new Player(this, "Joueur 2", this._startPosPathAllPlayer[1], this._startPosTileAllPlayer[1], this._map.player2Path, true, this._ui._character1);
        
    this._allPlayer = [this._player1, this._player2];
    this._currentPlayer = null;
    this._selectedPlayer = null;    
  }

  // Getter setter local
  
  // Slot base
  get slotBase(){ return this._slotBase; }
  setSlotBase(index, value){ this._slotBase= value; }

  // Player
  get player1() { return this._player1; }
  get player2() { return this._player2; }
  
  get allPlayer() { return this._allPlayer; }
  set allPlayer(value) { this._allPlayer = value }
  
  get currentPlayer() { return this._currentPlayer; }
  set currentPlayer(value) { this._currentPlayer = value }
  
  get selectedPlayer() { return this._selectedPlayer; }
  set selectedPlayer(value) {
    this._selectedPlayer = value;
    
    if(this._selectedPlayer === null){
      for(let index = 0; index < this.allPlayer.length; index++){
        this._allPlayer[index].contTarget.classList.remove("isTarget");       
      }
    }
    /*else{
      this._selectedPlayer.contInfoPlayer.classList.add("isTarget");       
    }*/
  }
  
  // Other
  get map(){ return this._map; }
  get ui(){ return this._ui; }
  get ia(){ return this._ia; } 

  // Load game
  loadGame(){ // Les pré-requis pour charger la partie    
    // Debug
    //this._ui.debugWindow.style.display = "block";
    
    // Game last
    this.loadOrderPlayer();
    this.turnManager();
  }

  loadOrderPlayer(){
    for(let index = 0; index < this._allPlayer.length; index++ ){
      this._orderPlayer.push(this._allPlayer[index]);
    }
  }

  // Turn manager
  async turnManager(){
    while(this._endGame === false){
       await this.loadWeather();
       await this.turnPlayer();
       await this.respawnManager();        
    }
  }

  startTurnPlayer(index){
    this._currentPlayer = this._orderPlayer[index];
    this._currentPlayer.turnFinish = false;
  }

  async turnPlayer(){
    for(let index = 0; index < this._orderPlayer.length; index++ ){   
      this.startTurnPlayer(index);
      if(this._currentPlayer.playerIA === true) { this._ia.turnPlayerIA(); }
      
      await this.waitFinishTurn( () => this._currentPlayer.turnFinish === true);
    }
  }

  endTurnPlayer(){
    this._currentPlayer.turnFinish = true;
    this.selectedPlayer = null;
  } 

  async respawnManager(){
    for(let index = 0; index < this._allPlayer.length; index++){
      if(this._allPlayer[index].die === true){
        
        this._allPlayer[index].currentTurnRespawn -= 1;
        if(this._allPlayer[index].currentTurnRespawn === 0) await this._allPlayer[index].revive();
      }
    }  
  }

  // IS
  isTilePlayer(positionTile){
    for( let index= 0; index < this._allPlayer.length; index++){
      if(positionTile === this._allPlayer[index].posTile) {
        this._allPlayer[index].die = true;
      }  
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
    let index = 0;
    let dirForced = `down`;
    
    if(player === this.player1 ){
      index = 0;
      dirForced = `down`;
    } 
    else{ 
      index = 1;
      dirForced = `up`;
    }
    
    for( let slot = 0; slot < 4; slot++){
      if (this._slotBase[index][slot] === null ) {
        
        this._slotBase[index][slot] = player;
        
        player.teleportPosTile(this.map.allPosBase[index][slot]);
        //player.characterDirectionForced(dirForced);

        this._ui.addTextLog(player.name + " est mort !");
        break;
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

    this._ui.weather.classList.remove(`weather-snow`, `weather-fog`, `weather-rain`, `weather-wind`);
  }
  
  async loadSun(){
    for(let i = 0; i < this._allPlayer.length; i++){
      if(this._allPlayer[i].die === false) this._allPlayer[i].pm += 1;
    }
  }

  async loadStorm(){
    const random = this.getRandomInt(2);
    let direction = 0;
    const force = 2;
        
    this._ui.weather.classList.add("weather-wind");
    
    if(random === 0 ) { direction = 1; }
    else{ direction = -1; }

    for(let i = 0; i < this._allPlayer.length; i++){
      if(this._allPlayer[i].die === false) await this._allPlayer[i].spellMove(direction, force);
    }
    
    await this.waitAnimation(this._ui.weather);
  }

  async loadBlizzard() {
    this._ui.weather.classList.add("weather-snow");
        
    for (let i = 0; i < this._allPlayer.length; i++) {
      if (this._allPlayer[i].die === false) {
        this._allPlayer[i].pm -= 1;
      }
    }
      
    await this.waitAnimation(this._ui.weather);
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

  // Other
  victoryPlayer(posTilePlayer, player){
    if(posTilePlayer === 180){ 
      this._endGame === false;
      this._ui.showVictory(player);
    }
  }
  
}