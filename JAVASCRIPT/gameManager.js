// Import 
import { Player } from './player.js';
import { UIManager } from './uiManager.js';
import { Map } from './map.js';
import { IA } from './ia.js';

export class GameManager{
  constructor(){
    // Instance
    this.map = new Map();
    this.ui = new UIManager(this);
    this.ia = new IA(this);
    
    this.player1 = new Player(this, "Soklai", 2, 102, this.map.player1Path, this.map.posTileBasePlayer1, false);
    this.player2 = new Player(this, "Joueur 2", 2, 186, this.map.player2Path, this.map.posTileBasePlayer2, true);
      
    // Variable   
    this.turnPlayerIndex = 0;
    this.turn = 0;
    this.turnPlayerFinish = [true, true];
    
    this.allPlayer = [this.player1, this.player2];
    this.currentPlayer = this.player2;
    this.opponentPlayer = this.player1;

    this.currentTurnRespawnPlayer = [2, 2];
  }

  loadGame(){ // Les pré requis pour charger la partie
    // UI
    this.ui.loadEvent();
    this.ui.addTextLogFight(" commence !", this.opponentPlayer.name, "", this.turn);
    this.ui.addPlayersInfo();
    this.ui.victoryPlayer.classList.add("hidden");
    
    // Map
    this.map.initializeGrid();
    this.map.addBackgroundTileGrid();

    // Game last
    this.spawnPlayers(); // Spawn les joueurs sur la map    
  
    this.turnManager();
  }

  spawnPlayers(){
    this.player1.characterDirection();
    this.player2.characterDirection(); 

  }
  
  turnManager(){    
    if(this.currentPlayer === this.player2){
      // Le joueur 1 joue
      this.respawnPlayer();
      this.currentPlayer = this.player1;
      this.opponentPlayer = this.player2;
      this.turn++;
    }
    else{
      // Le joueur 2 joue
      this.currentPlayer = this.player2;
      this.opponentPlayer = this.player1;
        
    }
    
    // Le joueur pioche des cartes
    this.currentPlayer.addCard();
    
    // Partie 2 On autorise a jouer le joueur
    this.currentPlayer.setTurnFinish(false);
    
    if(this.currentPlayer.getPlayerIA() === true) { this.ia.turnPlayerIA(); }
  }

  endTurnPlayer(){ 
  // Partie 0 Remet les PM du joueur actuel au max
  this.currentPlayer.setPm(this.currentPlayer.getPmMax());

  // Partie 1 le tour du joueur est terminé
  this.currentPlayer.setTurnFinish(true);
    
  // On met a jour le UI
  this.currentPlayer.unBuff();
  this.ui.updatePlayersInfo();
  
  // On passe le tour au prochain joueur
  this.turnManager();
  
}

  isTilePlayer(posTileDirection){

    // Parcour la position de tout les joueurs
    for( let i= 0; i < this.allPlayer.length; i++){
      
      // Vérifie si la nouvelle position correspond a celle d'un joueur
      if(posTileDirection === this.allPlayer[i].getPosTile()) {
  
        // Retourne le joueur qui se trouve sur la même position
        return i; 
      }  
    }
    // Retourne null si auncun joueur ne se trouve sur la même case
    return null;
  } 

  isTileWall(){
    for(let i = 0; i < this.allPosWall.length; i++){
      if(this.currentPlayer.getPosTile() === this.map.allPosWall[i]){
        return true;
      }
    }
    return null;
  }

  victoryPlayer(positionTilePlayer){
    if(positionTilePlayer === 144){
      if(this.currentPlayer === this.player1){
        this.ui.showVictory(0);
      }
      else{
        this.ui.showVictory(1);
      }
      
    }
  
  }

  respawnPlayer(){
    if(this.player1.getDie() === true){
      this.currentTurnRespawnPlayer[0] --;
    }
    
    if(this.player2.getDie() === true){
      this.currentTurnRespawnPlayer[1] --;
    }

    if(this.currentTurnRespawnPlayer[0] === 0 && this.player1.getDie() === true){
      this.spawnPlayer(0);
    }
    
    if(this.currentTurnRespawnPlayer[1] === 0 && this.player2.getDie() === true){
      this.spawnPlayer(1);
    }    
  }

  spawnPlayer(playerIndex){
    if(playerIndex === 0){
      this.player1.setDie(false);
      this.map.gridPlayer[this.player1.getPosTile()].style.backgroundImage = "";

      this.player1.setPosPath(2);
      this.player1.setPosTile(102);
      this.player1.characterDirection();
    }
    
    else if(playerIndex === 1){
      this.player2.setDie(false);
      this.map.gridPlayer[this.player2.getPosTile()].style.backgroundImage = "";
      
      this.player2.setPosPath(2);
      this.player2.setPosTile(186);
      this.player2.characterDirection();
    }    
  }

  getRandomIntTab(tab){
    return Math.floor(Math.random() * tab.length);
  }
}



