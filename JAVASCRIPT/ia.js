export class IA{
  constructor(GameInstance){
    // Instance
    this._game = GameInstance;
  }

  // Turn
  async turnPlayerIA() {
    if (!this._game.currentPlayer.isDie) {
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
    
    let target = this._game.player1;
    if(target.isDie) this._game.player3;
    
    /* Futur fonction qui vise l'ennemie le plus proche de la victoire */
    let posCaster = this._game.currentPlayer.posTile;
    let posTargetAttract = target.getPosTileDirection(-2);
    
    // Auto cible => Speed
    target = this._game.currentPlayer;
    
    const indexSpellSpeed = this._game.currentPlayer.getSpellIndexByName("Célérité");
    if(indexSpellSpeed != null){ await this._game.currentPlayer.useCard(indexSpellSpeed, target); }
    
    // Auto cible => Repulsion
    const indexSpellRepul = this._game.currentPlayer.getSpellIndexByName("Répulsion"); 
    if(indexSpellRepul != null && !target.isDie){ await this._game.currentPlayer.useCard(indexSpellRepul, target); }
    
    // Target opponent => Attraction
    target = this._game.player1;
    if(target.isDie) this._game.player3;
    
    const indexSpellAttract = this._game.currentPlayer.getSpellIndexByName("Attraction"); 
    if(indexSpellAttract != null && !target.isDie && posTargetAttract !== posCaster){ await this._game.currentPlayer.useCard(indexSpellAttract, target); }
    
    // Auto cible => Appuie
    target = this._game.currentPlayer;
    
    const indexSpellAppuie = this._game.currentPlayer.getSpellIndexByName("Appuie"); 
    if(indexSpellAppuie != null){ await this._game.currentPlayer.useCard(indexSpellAppuie, target); }
  
    // Target opponent => Slow
    target = this._game.player1;
    if(target.isDie) this._game.player3;
    
    const indexSpellRal = this._game.currentPlayer.getSpellIndexByName("Ralentissement"); 
    if(indexSpellRal != null && !target.isDie){ await this._game.currentPlayer.useCard(indexSpellRal, target); }
  }
  
  // Move
  async move(dir, repeat) { 
    if(repeat){
      this._game.currentPlayer.addNodePath(this._game.currentPlayer.pm, dir);
    }      
    else {
      this._game.currentPlayer.addNodePath(1, dir);
    }
    
    await this._game.currentPlayer.move(dir);
  }
  
  // Wait
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}


