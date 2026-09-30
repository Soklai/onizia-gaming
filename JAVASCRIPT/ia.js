export class IA{
  constructor(gameInstance){
    this.game = gameInstance;
    
  }

  turnPlayerIA(){  
    //Partie 0 Verifie si l'ia est morte
    if(this.game.currentPlayer.getDie() === false /*&& player2.getTurnFinish() === false*/){

      // Partie 1 Appel le modele d'ia
      //this.modelIAFullMove();
      this.modelIAEasy();

      // Partie 2 Appel la fin de tour de l'ia
      this.game.ui.addTextLogFight(" Passe sont tour ", this.game.currentPlayer.getName(), "", this.game.turn);
      
            
    } 
    
    this.game.endTurnPlayer();
  }

  spellPriorityCast() {
    let isAppuie = false;
    let posCaster = this.game.currentPlayer.getPosTile();
    let posTargetAttract = this.game.opponentPlayer.getPosTileDirection(-2);
    
    // Si le sort Célérité existe dans la main on le joue en priorité de 1
    const indexSpellSpeed = this.getSpellIndexByName("Célérité");  
    if(indexSpellSpeed != null){ this.game.currentPlayer.useCard(indexSpellSpeed); }
  
    // Si le sort Attraction existe dans la main on le joue en priorité de 2
    const indexSpellAttract = this.getSpellIndexByName("Attraction"); 
    if(indexSpellAttract != null && posTargetAttract !== posCaster){ this.game.currentPlayer.useCard(indexSpellAttract)}
  
    // Si le sort Appuie existe on le joue avant et après un mouvement en priorité de 3
    const indexSpellAppuie = this.getSpellIndexByName("Appuie");
    
    if(indexSpellAppuie != null){
      while(0 < this.game.currentPlayer.getPm()){
        
        if(isAppuie === false) { this.game.currentPlayer.useCard(indexSpellAppuie); isAppuie = true; }
        this.game.currentPlayer.move(1);
        if(isAppuie === false) { this.game.currentPlayer.useCard(indexSpellAppuie); isAppuie = true; }
      }    
    }        
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

  modelIAEasy(){
    // Si le joueur opposer est encore vivant on autorise les sorts d'attack
    if(this.game.opponentPlayer.getDie() === false){
      // Lance certain sort en priorité en fonction de l'ia
      this.spellPriorityCast();

      // Utilise les sorts restant par ordre logique buff => debuff => move
      this.spellOrderCast();
    }
    else{
      let isAppuie = false;
      
      // Si le sort Célérité existe dans la main on le joue en priorité de 1
      const indexSpellSpeed = this.getSpellIndexByName("Célérité");

      // Si le sort Appuie existe on le joue avant et après un mouvement en priorité de 3
      const indexSpellAppuie = this.getSpellIndexByName("Appuie"); 

      if(indexSpellAppuie != null){
        while(0 < this.game.currentPlayer.getPm()){
        
          if(isAppuie === false) { this.game.currentPlayer.useCard(indexSpellAppuie); isAppuie = true; }
          this.game.currentPlayer.move(1);
          if(isAppuie === false) { this.game.currentPlayer.useCard(indexSpellAppuie); isAppuie = true; }
        }    
      }  
    }
    
  
    // Fait avancer le joueur si il reste des PM
    while(0 < this.game.currentPlayer.getPm()){
      this.game.currentPlayer.move(1);
    }    
  }

  modelIAFullMove() {
    while(0 < this.game.currentPlayer.getPm()){
      this.game.currentPlayer.move(1);
    }
  }

  getSpellIndexByName(spellName) {
    const hand = this.game.currentPlayer.getHand();
    
    // .findIndex() cherche l'élément dont le nom correspond exactement à spellName
    const index = hand.findIndex(spell => spell?.name === spellName);
  
    // Renvoie l'index si le sort est trouvé, sinon null
    return index !== -1 ? index : null;
  }
}
