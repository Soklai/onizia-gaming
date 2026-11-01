export class Spell {
  constructor(Name, Description, Icon, Animation, Force, Direction, TargetCondition, Attack){
    this._name = Name;
    this._description = Description;
    this._icon = Icon;
    this._animation = Animation;
    this._force = Force;
    this._direction = Direction;
    this._targetCondition = TargetCondition;
    this._attack = Attack;
  }

  cast(caster, target){
    if (typeof this._attack === "function") {
      return this._attack(caster, target, this);
    }
    return false;
  }

// Spell BDD

  static attackSlow = new Spell(
    "Ralentissement",
    "Retire 2 point de mouvement a la cible pendant 1 tour.",
    "url('IMAGE/SPELL/background_spell_ralentissement.jpg')",
    "url('IMAGE/SPELL/slow_effect.png')",
    2,
    0,
    "libre",
    async (caster, target, spell) => { 
      if(target.die === false){
        
        target.removePm(spell._force);
        await target.spellAnimation(spell); 
        return false;
      }
      else{
        return true;
      }
    }
  );
  
  static buffSpeed = new Spell(
    "Célérité",
    "Ajoute 2 point de mouvement a la cible pendant 1 tour.",
    "url('IMAGE/SPELL/background_spell_celerite.jpg')",
    "url('IMAGE/SPELL/haste_effect.png')",
    2,
    0,
    "libre",
    async (caster, target, spell) => { 
      
      target.addPm(spell._force);
      await target.spellAnimation(spell);
      return false;
    } );
  
  static attackAttract = new Spell(
    "Attraction",
    "La cible recule de 2 cases.",
    "url('IMAGE/SPELL/background_spell_attraction.jpg')",
    "url('IMAGE/SPELL/fear_effect.png')",
    2,
    -1,
    "libre",
    async (caster, target, spell) => {
      if(target.die === false){
        
        target.spellAnimation(spell);    
        await target.spellMove(spell._direction, spell._force);
        return false;
      }
      else{
        return true;
      }
    });
  
  static attackRepulse = new Spell(
    "Répulsion",
    "Avance la cible de 2 cases.",
    "url('IMAGE/SPELL/background_spell_repulsion.jpg')",
    "url('IMAGE/SPELL/shock_effect.png')",
    2,
    1,
    "libre",
    async (caster, target, spell) => {
      if(target.die === false){
        
        target.spellAnimation(spell);
        await target.spellMove(spell._direction, spell._force);
        return false; 
      }
      else{
        return true;
      }
    } );
  
  static buffAppuie = new Spell(
    "Appuie",
    "S'appuie contre un mur ou un joueur pour avancer de 5 cases.",
    "url('IMAGE/SPELL/background_spell_appuie.jpg')",
    "url('IMAGE/SPELL/haste_effect.png')",
    5,
    1,
    "current",
    async (caster, target, spell) => 
      {
        for( let i= 0; i < caster._game.map.allPosWall.length; i++){
          if(caster.posTile === caster._game.map.allPosWall[i]){
            
            caster.spellAnimation(spell);
            await caster.spellMove(spell._direction, spell._force); 
            return false;
          }
        }
        return true;
      }
    ); 

  

} // End Spell
  
