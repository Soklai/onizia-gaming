export class IA{
  constructor(GameInstance){
    // Instance
    this._game = GameInstance;

    // Variable local
    this._orderPrioCast = ["Célérité", "Bouclier", "Silence", "Avance", "Recule", "Appuie", "Ralentissement"];
  }

  // Turn Manager
  async turnPlayerIA() {
    if (!this._game.currentPlayer.isDie) {
      await this.modelIAEasy();
    }
    
    this._game.endTurnPlayer();     
  }
  
  // Model IA
  async modelIAEasy(){
    await this.spellPrioCast();
    await this.move(1, true); console.log("End move");
  }
  async modelIAFullMove(){
    await this.move(1, true);
  }

  // Spell
  async spellPrioCast(){
    
    if(!this._game.currentPlayer.isSilence){
      let target = "";
      let indexSpell = null;
      
      for(let i = 0; i < this._orderPrioCast.length; i++){ 
        indexSpell = this.findIndexSpellHand(this._game.currentPlayer.hand, this._orderPrioCast[i]);
                                                           
        if(indexSpell != null){
          target = this.targetPrio(this._game.currentPlayer.hand[indexSpell], this._game.currentPlayer);
          await this.useConditionSpell(this._game.currentPlayer, indexSpell, target); 
        }
        else{
          console.log("indexSpell = null");
        }
        
        if(this._game.currentPlayer.hand.length <= 0) break;
      }
    }
    else{
      console.log(this._game.currentPlayer.name + " est sous silence !");
    }
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

  // Target
  targetPrio(spell, player){ 
    let target = null;
                             
    switch(spell._type){
      case "Bonus":
        target = player;
        break;

      case "Malus":
        if(this._game.player1.isDie) target = this._game.player3;
        else target = this._game.player1;
        break;

      case "Deplacement":
        if(spell._name === "Recule"){
          if(this._game.player1.isDie) target = this._game.player3;
          else target = this._game.player1;
          break;
        }
        else if(spell._name === "Avance" || spell._name === "Appuie"){
          target = player;
          break;
        }
        break;
        
      default:
        console.log("default !");
    }
                          
    return target;
  }

  findIndexSpellHand(hand, name){
    console.log(name);
    
    for(let i = 0; i < hand.length; i++){
      if(hand[i]._name === name){
        return i;
      }
    }
  
    return null;
  }

  async useConditionSpell(playerIa, indexSpell, target){
    const isPathPlayer = this._game.hasPlayerOnPath(this._game.currentPlayer, this._game.currentPlayer.hand[indexSpell]._force);
    const nameSpell = this._game.currentPlayer.hand[indexSpell]._name;
    
    switch(nameSpell){
      case "Appuie": {
        let isAppuie = true;
        
        for(let i = 0; i < this._game.currentPlayer.pm; i++){
          
          isAppuie = await this._game.currentPlayer.useCard(indexSpell, target);
          if (!isAppuie) break;   
          await this.move(1, false);    
        }
      }

      case "Recule":
        if(isPathPlayer === null) await this._game.currentPlayer.useCard(indexSpell, target);
        else console.log("Impossible d'utiliser recule sinon sucide !")   
        break;

      case "Avance":
        if(isPathPlayer.indexTeam =! target.indexTeam || isPathPlayer === null) await this._game.currentPlayer.useCard(indexSpell, target);
        else console.log("Impossible d'utiliser avance sinon il tue son allié !")
        break;
        
      default:
       await this._game.currentPlayer.useCard(indexSpell, target); 
    }
  }
  
  // Wait
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}


