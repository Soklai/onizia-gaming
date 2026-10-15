export class IA{
  constructor(gameInstance){
    this.game = gameInstance;
    this.isEndTurn = false;
    this.phase = "";
  }

  async turnPlayerIA() {
    if (this.game.currentPlayer.getDie() === false) {
      await this.modelIAEasy();
      this.game.endTurnPlayer();
    }
    else {
      this.game.endTurnPlayer();
    }         
  }
  
  async modelIAEasy(){
    await this.spellPrioCast();
    await this.move(1, true);
  }

  async spellPrioCast(){
    let isAppuie = true;
    let posCaster = this.game.currentPlayer.getPosTile();
    let posTargetAttract = this.game.opponentPlayer.getPosTileDirection(-2);

    this.game.currentPlayer.spellQueue.length = 0;
    
    // Before Appuie
    const indexSpellSpeed = this.game.currentPlayer.getSpellIndexByName("Célérité"); 
    if(indexSpellSpeed != null){ await this.game.currentPlayer.useCard(indexSpellSpeed); }
    
    const indexSpellAttract = this.game.currentPlayer.getSpellIndexByName("Attraction"); 
    if(indexSpellAttract != null && this.game.opponentPlayer.getDie() === false && posTargetAttract !== posCaster){ await this.game.currentPlayer.useCard(indexSpellAttract); }

    const indexSpellAppuie = this.game.currentPlayer.getSpellIndexByName("Appuie");
    if(indexSpellAppuie != null){ await this.game.currentPlayer.useCard(indexSpellAppuie); }
    
    // After Appuie
    const indexSpellRal = this.game.currentPlayer.getSpellIndexByName("Ralentissement"); 
    if(indexSpellRal != null){ await this.game.currentPlayer.useCard(indexSpellRal); }

    const indexSpellRepul = this.game.currentPlayer.getSpellIndexByName("Répulsion"); 
    if(indexSpellRepul != null){ await this.game.currentPlayer.useCard(indexSpellRepul); }
  
  }

  spellOrderCast() {
  
  // On recupère la main du joueur et test si elle est valide
  const hand = this.game.currentPlayer.getHand(); 
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
      this.game.currentPlayer.useCard(currentIndex);
    }
  }
}

  modelIAFullMove(){
    this.move(1, true);
  }
 
  async move(dir, repeat) {   
    if(repeat === true){ this.game.currentPlayer.forceMove = this.game.currentPlayer.getPm()}      
    else { this.game.currentPlayer.forceMove = 1; }
    
    await this.game.currentPlayer.move(dir);
  }

  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}


