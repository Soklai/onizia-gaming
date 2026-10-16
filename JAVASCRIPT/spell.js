export class Spell {
  constructor(name, description, icone, animation, targetAnim, force, direction, effect, attack){
    this.name = name;
    this.description = description;
    this.icone = icone;
    this.animation = animation;
    this.targetAnim = targetAnim;
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
    "url('IMAGE/SPELL/slow_effect.png')",
    "Opponent",
    -2,
    0,
    "-pm",
    async (caster, target, spell) => { 
      if(target.getDie() === false){
        target.removePm(2);
        await caster.spellAnimation(spell);
        //target.addDeBuff(spell.effect);

        
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
    "Current",
    2,
    0,
    "+pm",
    async (caster, target, spell) => { 
      caster.addPm(2);
      caster.addBuff(spell.effect);

      await caster.spellAnimation(spell);
      return false;
    } );
  
  static attackAttract = new Spell(
    "Attraction",
    "La cible recule de 2 cases.",
    "url('IMAGE/SPELL/background_spell_attraction.jpg')",
    "url('IMAGE/SPELL/fear_effect.png')",
    "Opponent",
    2,
    -1,
    "",
    async (caster, target, spell) => {
      if(target.getDie() === false){
        caster.spellAnimation(spell);
        await target.spellMove(-1, spell.force);
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
    "Opponent",
    2,
    1,
    "",
    async (caster, target, spell) => {
      if(target.getDie() === false){
        caster.spellAnimation(spell);
        await target.spellMove(1, spell.force);
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
    "Current",
    5,
    1,
    "",
    async (caster, target, spell) => 
      {
        for( let i=0; i < caster.game.map.allPosWall.length; i++){
          if(caster.getPosTile() === caster.game.map.allPosWall[i]){
            caster.spellAnimation(spell);
            await caster.spellMove(1, spell.force); 
            return false;
          }
        }
        return true;
      }
    ); 

  

} // End Spell
  
