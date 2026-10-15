// Import 
import { Player } from './player.js';
import { UIManager } from './uiManager.js';
import { Map } from './map.js';
import { IA } from './ia.js';

export class GameManager{
  constructor(){
    // Variable first 
    this.startPosPathAllPlayer = [1, 1];
    this.startPosTileAllPlayer = [134, 226];
    
    this.turnPlayerIndex = 0;
    this.turn = 0;
    this.turnPlayerFinish = [true, true];
    this.currentTurnRespawnPlayer = [2, 2];
    this.slotBase = [[false, false, false, false], [false, false, false, false]];
    
    // Instance first
    this.map = new Map();
    this.ui = new UIManager(this);
    this.ia = new IA(this);

    // Instance last
    this.player1 = new Player(this, "Soklai", this.startPosPathAllPlayer[0], this.startPosTileAllPlayer[0], this.map.player1Path, false, this.ui.character0);
    this.player2 = new Player(this, "Joueur 2", this.startPosPathAllPlayer[1], this.startPosTileAllPlayer[1], this.map.player2Path, true, this.ui.character1);

    // Variable last    
    this.allPlayer = [this.player1, this.player2];
    this.currentPlayer = this.player2;
    this.opponentPlayer = this.player1;
  }

  loadGame(){ // Les pré-requis pour charger la partie    
    // Debug
    //this.ui.debugWindow.style.display = "block";
    
    // UI
    this.ui.loadEvent(); // Load all event element
    this.ui.addTextLogFight(" commence !", this.opponentPlayer.name, ""); // On annonce qui commence
    this.ui.addPlayersInfo(); // add / update Pseudo | PM Player
    this.ui.victoryPlayer.classList.add("hidden"); // Hidden window Victory/ Game over
    
    // Map
    this.map.initializeGrid(); // Initialise les grilles de la carte du jeu
    this.map.addBackgroundTileGrid(); // Paint toute les tuiles des grille selon un tableau d'index

    // Game last
    this.startSpawnPlayers(); // Spawn les joueurs sur la carte   
  
    this.turnManager(); // Appelle le manager pour la gestion des tours
  }

  // Turn manager
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
  } // Manager des tours entre les joueurs 

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
  
} // Gestion de la fin du tour des joueurs

  // IS
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

  // Victory / Game over
  victoryPlayer(positionTilePlayer){
    if(positionTilePlayer === 180){
      if(this.currentPlayer === this.player1){
        this.ui.showVictory(0);
      }
      else{
        this.ui.showVictory(1);
      }
      
    }
  
  }

  // Spawn player
  startSpawnPlayers(){
    this.player1.goPos(this.player1.getPosTile());
    this.player2.goPos(this.player2.getPosTile());

  } // Fait apparaitre les joueurs sur le terrain

  respawnPlayer(){
    for(let i=0; i< this.allPlayer.length; i++){
      if(this.allPlayer[i].getDie() === true){
        this.currentTurnRespawnPlayer[i] --;
      }
    }

    for(let i=0; i< this.allPlayer.length; i++){
      if(this.currentTurnRespawnPlayer[i] <= 0 && this.allPlayer[i].getDie() === true){
        this.revivePlayer(i);
      }       
    }   
  }

  revivePlayer(playerIndex){
    if(playerIndex != null){
      this.allPlayer[playerIndex].setDie(false);

      this.allPlayer[playerIndex].setPosPath(this.startPosPathAllPlayer[playerIndex]);
      this.allPlayer[playerIndex].setPosTile(this.startPosTileAllPlayer[playerIndex]);
      this.allPlayer[playerIndex].goPos(this.allPlayer[playerIndex].getPosTile());
    }
  }

  // Other
  getRandomIntTab(tab){
    return Math.floor(Math.random() * tab.length);
  }

  diePlayerGoToBase(indexPlayer){
  
    // On déclare que le joueur est mort
    this.allPlayer[indexPlayer].setDie(true);
    this.currentTurnRespawnPlayer[indexPlayer] = 3;
    
    // On déplace le joueur dzns le slot
    this.goSlotBase(indexPlayer);
  }

  goSlotBase(indexPlayer){
  // Trouver un slot disponible dans la base du joueur
    for( let slot = 0; slot < 4; slot++){
      if (this.slotBase[indexPlayer][slot] === false ) {
        
        // Remplir le slot par true
        this.slotBase[indexPlayer][slot] = true;
        
        // Met a jour la position Tile du joueur
        this.allPlayer[indexPlayer].setPosTile(this.map.allPosSlotBasePlayer[indexPlayer][slot]);
        this.allPlayer[indexPlayer].goPos(this.map.allPosSlotBasePlayer[indexPlayer][slot]);

        this.ui.addTextLogFight(" est mort !", this.allPlayer[indexPlayer].name, "");
        break;
      }
    }
  } 
}



