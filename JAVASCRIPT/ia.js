export class IA{
  constructor(GameInstance){
    // Instance
    this._game = GameInstance;
  }

  // Turn
  async turnPlayerIA() {
    if (this._game.currentPlayer.die === false) {
      await this.modelIAEasy();
    }
    
    this._game.endTurnPlayer();     
  }
  
  // Model IA
  async modelIAEasy(){ 
    await this.spellPrioCast(); 
    await this.move(1, true);
  }

  async modelIAFullMove(){
    await this.move(1, true);
  }

  // Spell
  async spellPrioCast(){
    let isAppuie = true;
    
    this._game.selectedPlayer = this._game.player1;
    let posCaster = this._game.currentPlayer.posTile;
    let posTargetAttract = this._game.selectedPlayer.getPosTileDirection(-2);
    
    // Auto cible => Speed
    this._game.selectedPlayer = this._game.currentPlayer;
    
    const indexSpellSpeed = this._game.currentPlayer.getSpellIndexByName("Célérité");
    if(indexSpellSpeed != null){ await this._game.currentPlayer.useCard(indexSpellSpeed); }
    
    // Auto cible => Repulsion
    const indexSpellRepul = this._game.currentPlayer.getSpellIndexByName("Répulsion"); 
    if(indexSpellRepul != null && this._game.selectedPlayer.die === false){ await this._game.currentPlayer.useCard(indexSpellRepul); }

    // Target opponent => Attraction
    this._game.selectedPlayer = this._game.player1;
    
    const indexSpellAttract = this._game.currentPlayer.getSpellIndexByName("Attraction"); 
    if(indexSpellAttract != null && this._game.selectedPlayer.die === false && posTargetAttract !== posCaster){ await this._game.currentPlayer.useCard(indexSpellAttract); }
    
    // Auto cible => Appuie
    this._game.selectedPlayer = this._game.currentPlayer;
    
    const indexSpellAppuie = this._game.currentPlayer.getSpellIndexByName("Appuie"); 
    if(indexSpellAppuie != null){ await this._game.currentPlayer.useCard(indexSpellAppuie); }
    
    // Target opponent => Slow
    this._game.selectedPlayer = this._game.player1;
    
    const indexSpellRal = this._game.currentPlayer.getSpellIndexByName("Ralentissement"); 
    if(indexSpellRal != null && this._game.selectedPlayer.die === false){ await this._game.currentPlayer.useCard(indexSpellRal); }
  }
  
  // Move
  async move(dir, repeat) { 
    if(repeat === true){ this._game.currentPlayer.forceMove = this._game.currentPlayer.pm }      
    else { this._game.currentPlayer.forceMove = 1; }
    
    await this._game.currentPlayer.move(dir, false);
  }
  
  // Wait
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}


