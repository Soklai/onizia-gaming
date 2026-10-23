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
    this._startPosPathAllPlayer = [1, 1];
    this._startPosTileAllPlayer = [134, 226];

    // Turn
    this._turnPlayerIndex = 0;
    this._turn = 0;
    this._turnPlayerFinish = [true, true];
    this._currentTurnRespawnPlayer = [2, 2];

    // Other
    this._slotBase = [[false, false, false, false], [false, false, false, false]];

    // Player
    this._player1 = new Player(this, "Soklai", this._startPosPathAllPlayer[0], this._startPosTileAllPlayer[0], this._map.player1Path, false, this._ui._character0, this._ui._animEffect0);
    this._player2 = new Player(this, "Joueur 2", this._startPosPathAllPlayer[1], this._startPosTileAllPlayer[1], this._map.player2Path, true, this._ui._character1, this._ui._animEffect1);
        
    this._allPlayer = [this._player1, this._player2];
    this._currentPlayer = this._player2;
    this._opponentPlayer = this._player1;
  }

  // Getter local
  get slotBase() { return this._slotBase; }
  get player1() { return this._player1; }
  get player2() { return this._player2; }
  
  get allPlayer() { return this._allPlayer; }
  get currentPlayer() { return this._currentPlayer; }
  get opponentPlayer() { return this._opponentPlayer; }

  get map(){ return this._map; }
  get ui(){ return this._ui; }
  get ia(){ return this._ia; } 

  // Setter local
  set allPlayer(value) { this._allPlayer = value }
  set currentPlayer(value) { this._currentPlayer = value }
  set opponentPlayer(value) { this._opponentPlayer = value }


  // Getter externe

  loadGame(){ // Les pré-requis pour charger la partie    
    // Debug
    //this._ui.debugWindow.style.display = "block";

    // Map
    this._map.loadMap();
    
    // UI
    this._ui.loadUI();
    
    // Game last
    this.startSpawnPlayers();  
    this.turnManager();
  }

  // Turn manager
  turnManager(){  
    if(this._currentPlayer === this._player2){
      // Le joueur 1 joue
      this.respawnPlayer();
      this._currentPlayer = this._player1;
      this._opponentPlayer = this._player2;
      this._turn++;
    }
    else{
      // Le joueur 2 joue
      this._currentPlayer = this._player2;
      this._opponentPlayer = this._player1;      
    }
    
    this._currentPlayer.addCard();
    this._currentPlayer.turnFinish = false;
    
    if(this._currentPlayer.playerIA === true) { this._ia.turnPlayerIA(); }
  }

  endTurnPlayer(){ 
    this._currentPlayer.pm = this._currentPlayer.pmMax;
    this._currentPlayer.turnFinish = true;
    
    this._ui.updatePlayersInfo();  
    this.turnManager(); 
}

  // IS
  isTilePlayer(posTileDirection){
    for( let i= 0; i < this._allPlayer.length; i++){
      if(posTileDirection === this._allPlayer[i].posTile) {
        return i;
      }  
    }

    return null;
  } 

  isTileWall(){
    for(let i = 0; i < this._map.allPosWall.length; i++){
      if(this._currentPlayer.posTile === this._map.allPosWall[i]){
        return true;
      }
    }
    return null;
  }

  victoryPlayer(posTilePlayer, player){
    if(posTilePlayer === 180){ this._ui.showVictory(player); }
  }
  
  startSpawnPlayers(){
    this._player1.goPos(this._player1.posTile);
    this._player2.goPos(this._player2.posTile);
  }

  respawnPlayer(){
    for(let i = 0; i < this._allPlayer.length; i++){
      if(this._allPlayer[i].die === true){
        this._currentTurnRespawnPlayer[i] --;
      }
    }

    for(let i=0; i< this._allPlayer.length; i++){
      if(this._currentTurnRespawnPlayer[i] <= 0 && this._allPlayer[i].die === true){
        this.revivePlayer(i);
      }       
    }   
  }

  revivePlayer(playerIndex){
    if(playerIndex != null){
      this._allPlayer[playerIndex].die = false;

      this._allPlayer[playerIndex].posPath = this._startPosPathAllPlayer[playerIndex];
      this._allPlayer[playerIndex].posTile = this._startPosTileAllPlayer[playerIndex];
      this._allPlayer[playerIndex].goPos(this._allPlayer[playerIndex].posTile);
    }
  }

  // Other
  getRandomIntTab(tab){
    return Math.floor(Math.random() * tab.length);
  }

  diePlayerGoToBase(indexPlayer){
    this._allPlayer[indexPlayer].die = true;
    this._currentTurnRespawnPlayer[indexPlayer] = 3;
    
    this.goSlotBase(indexPlayer);
  }

  goSlotBase(indexPlayer){
    for( let slot = 0; slot < 4; slot++){
      if (this._slotBase[indexPlayer][slot] === false ) {
        
        this._slotBase[indexPlayer][slot] = true;
        
        this._allPlayer[indexPlayer].posTile = this._map.allPosSlotBasePlayer[indexPlayer][slot];
        this._allPlayer[indexPlayer].goPos(this._map.allPosSlotBasePlayer[indexPlayer][slot]);

        this._ui.addTextLogFight(" est mort !", this._allPlayer[indexPlayer].name, "");
        break;
      }
    }
  } 
}



