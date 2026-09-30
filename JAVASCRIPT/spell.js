export class Spell {
  constructor(name, description, icone, type, force, direction, effect, attack){
    this.name = name;
    this.description = description;
    this.icone = icone;
    this.type = type;
    this.force = force;
    this.direction = direction;
    this.effect = effect;
    this.attack = attack;    
  }

  cast(caster, target){
    if (typeof this.attack === "function") {
      return this.attack(caster, target, this);
    }
    return false;
  }

// Spell BDD

  static attackSlow = new Spell(
    "Ralentissement",
    "Retire 2 point de mouvement a la cible pendant 1 tour.",
    "url('IMAGE/SPELL/background_spell_ralentissement.jpg')",
    "debuff",
    -2,
    0,
    "-pm",
    (caster, target, spell) => { 
      if(target.getDie() === false){
        target.removePm(2);
        target.addDeBuff(spell.effect);
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
    "buff",
    2,
    0,
    "+pm",
    (caster, target, spell) => { caster.addPm(2); caster.addBuff(spell.effect); return false; } );
  
  static attackAttract = new Spell(
    "Attraction",
    "La cible recule de 2 cases.",
    "url('IMAGE/SPELL/background_spell_attraction.jpg')",
    "move",
    2,
    -1,
    "",
    (caster, target, spell) => {
      if(target.getDie() === false){
        target.spellMove(-1, spell.force);
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
    "move",
    2,
    1,
    "",
    (caster, target, spell) => {
      if(target.getDie() === false){
        target.spellMove(1, spell.force);
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
    "move",
    5,
    1,
    "",
    (caster, target, spell) => 
      {
        for( let i=0; i < caster.game.map.allPosWall.length; i++){
          if(caster.getPosTile() === caster.game.map.allPosWall[i]){
            caster.spellMove(1, spell.force); 
            return false;
          }
        }
        return true;
      }
    ); 

  

} // End Spell
  
