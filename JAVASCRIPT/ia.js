export class IA{
  constructor(GameInstance){
    // Instance
    this._game = GameInstance;
    
    // Variable
    this._isEndTurn = false;
    this._phase = "";
  }

  // Getter Setter local

  // Getter Externe
  get player1(){ return this._game.player1; }
  get player2() { return this._game.player2; }
  get currentPlayer() { return this._game.currentPlayer; }
  get opponentPlayer() { return this._game.opponentPlayer; }

  async turnPlayerIA() {
    if (this.currentPlayer.die === false) {
      await this.modelIAEasy();
    }
    
    this._game.endTurnPlayer();     
  }
  
  async modelIAEasy(){ 
    await this.spellPrioCast(); 
    await this.move(1, true);
  }

  async spellPrioCast(){
    let isAppuie = true;
    let posCaster = this.currentPlayer.posTile;
    let posTargetAttract = this.opponentPlayer.getPosTileDirection(-2);
    
    //this.currentPlayer.spellQueue.length = 0;
    
    // Before Appuie
    const indexSpellSpeed = this.currentPlayer.getSpellIndexByName("Célérité");
    if(indexSpellSpeed != null){ await this.currentPlayer.useCard(indexSpellSpeed); }
    
    const indexSpellAttract = this.currentPlayer.getSpellIndexByName("Attraction"); 
    if(indexSpellAttract != null && this.opponentPlayer.die === false && posTargetAttract !== posCaster){ await this.currentPlayer.useCard(indexSpellAttract); }

    const indexSpellAppuie = this.currentPlayer.getSpellIndexByName("Appuie"); 
    if(indexSpellAppuie != null){ await this.currentPlayer.useCard(indexSpellAppuie); }
    
    // After Appuie
    const indexSpellRal = this.currentPlayer.getSpellIndexByName("Ralentissement"); 
    if(indexSpellRal != null){ await this.currentPlayer.useCard(indexSpellRal); }

    const indexSpellRepul = this.currentPlayer.getSpellIndexByName("Répulsion"); 
    if(indexSpellRepul != null){ await this.currentPlayer.useCard(indexSpellRepul); }
  }

  /* spellOrderCast() {
  const hand = this.currentPlayer.getHand(); 
  if (!hand || hand.length === 0) return;

  // On filtre chaque sort et on les places dans leur catégorie type respective
  const buffs = hand.filter(spell => spell?.type === "buff");
  const debuffs = hand.filter(spell => spell?.type === "debuff");
  const moves = hand.filter(spell => spell?.type === "move");

  // On fusionne les cartes dans l'ordre d'attaque souhaité
  const orderSpell = [...buffs, ...debuffs, ...moves];
 
  // On lance chaque sort en recherchant son index actuel
  for (const spell of orderSpell) {
    // On cherche l'index exact du sort dans la main AU MOMENT OÙ ON LE JOUE
    const currentIndex = hand.indexOf(spell);

    // Si le sort est bien présent dans la main, on le lance
    if (currentIndex !== -1) {
      this.currentPlayer.useCard(currentIndex);
    }
  }
} */

  modelIAFullMove(){
    this.move(1, true);
  }
 
  async move(dir, repeat) { 
    if(repeat === true){ this.currentPlayer.forceMove = this.currentPlayer.pm }      
    else { this.currentPlayer.forceMove = 1; }
    
    await this.currentPlayer.move(dir);
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}


