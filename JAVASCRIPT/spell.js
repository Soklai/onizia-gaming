import { Effect } from './effect.js';

export class Spell {
  constructor(Name, Description, Type, Icon, Animation, Force, Turn, Effect, Direction, Attack){
    this._name = Name;
    this._description = Description;
    this._type = Type;
    this._icon = Icon;
    this._animation = Animation;
    this._force = Force;
    this._turn = Turn;
    this._effect = Effect;
    this._direction = Direction;
    this._attack = Attack;
  }

  cast(caster, target, spell, game){
    return this._attack(caster, target, spell, game);
  }

// --- Spell BDD ---

  static ralentissement(force = 1, turn = 1) {
    return new Spell(
      "Ralentissement",
      "Retire ${force} point de mouvement a la cible pendant ${turn} tour(s).",
      "Malus",
      "url('IMAGE/SPELL/ICON/ralentissement.jpg')",
      "url('IMAGE/SPELL/EFFECT/slow.png')",
      force,
      turn,
      Effect.removePm(force, turn),
      0,
      async (caster, target, spell, game) => {
        if (target === caster) game.ui.addTextLog(`${caster.name} lance ${spell._name} -${spell._force} pm sur lui même`); 
        else game.ui.addTextLog(`${caster.name} lance ${spell._name} -${spell._force} pm sur ${target.name}`); 
          
        target.addEffect(spell._effect);
        spell._effect.applyEffect(caster, target);
        await target.spellAnimation(spell);
      }
    );
  }
  
  static celerite(force = 2, turn = 1){
    return new Spell(
      "Célérité",
      "Ajoute 2 point de mouvement a la cible pendant 1 tour.",
      "Bonus",
      "url('IMAGE/SPELL/ICON/celerite.jpg')",
      "url('../IMAGE/SPELL/EFFECT/haste.png')",
      force,
      turn,
      Effect.addPm(force, turn),
      0,
      async (caster, target, spell, game) => {
        if (target === caster) game.ui.addTextLog(`${caster.name} lance ${spell._name} +${spell._force} pm sur lui même`); 
        else game.ui.addTextLog(`${caster.name} lance ${spell._name} +${spell._force} pm sur ${target.name}`); 
          
        target.addEffect(spell._effect);
        spell._effect.applyEffect(caster, target);
        await target.spellAnimation(spell);
      }
    );
  }
  
  static recule(force = 2){
    return new Spell(
      "Recule",
      "La cible recule de 2 cases.",
      "Deplacement",
      "url('IMAGE/SPELL/ICON/recule.jpg')",
      "url('../IMAGE/SPELL/EFFECT/haste.png')",
      force,
      0,
      null,
      -1,
      async (caster, target, spell, game) => {
        if (target === caster) game.ui.addTextLog(`${caster.name} lance ${spell._name} qui recule lui même, de ${spell._force} cases`); 
        else game.ui.addTextLog(`${caster.name} lance ${spell._name} qui recule ${target.name} de ${spell._force} cases`); 
        
        target.spellAnimation(spell);    
        await target.spellMove(spell._direction, force);
      }
    );
  }
    
  
  static avance(force = 2){
    return new Spell(
      "Avance",
      "Avance la cible de 2 cases.",
      "Deplacement",
      "url('IMAGE/SPELL/ICON/avance.jpg')",
      "url('../IMAGE/SPELL/EFFECT/haste.png')",
      force,
      0,
      null,
      1,
      async (caster, target, spell, game) => {
        if (target === caster) game.ui.addTextLog(`${caster.name} lance ${spell._name} sur lui même, qui avance de ${spell._force} cases`); 
        else game.ui.addTextLog(`${caster.name} lance ${spell._name} sur ${target.name} qui avance de ${spell._force} cases`); 
        
        target.spellAnimation(spell);
        await target.spellMove(spell._direction, force);
      } 
    );   
  }
  
  
  static appuie(force = 5){
    return new Spell(
      "Appuie",
      "S'appuie contre un mur ou un joueur pour avancer de 5 cases.",
      "Deplacement",
      "url('IMAGE/SPELL/ICON/appuie.jpg')",
      "url('../IMAGE/SPELL/EFFECT/haste.png')",
      force,
      0,
      null,
      1,
      async (caster, target, spell, game) => {
        for(let i = 0; i < caster._game.map.allPosWall.length; i++){
          if(caster.posTile === caster._game.map.allPosWall[i]){
            game.ui.addTextLog(`${caster.name} lance ${spell._name} qui permet d'avancer de ${spell._force} cases`); 
        
            caster.spellAnimation(spell);
            await caster.spellMove(spell._direction, force);

            return false;
          }
        }
        
        return true;
      }
    );     
  }

  static silence(turn = 1){
    return new Spell(
      "Silence",
      "La cible n'e peut pas utiliser de sort pendant 1 tour.",
      "Malus",
      "url('IMAGE/SPELL/ICON/silence.jpg')",
      "url('../IMAGE/SPELL/EFFECT/silence.png')",
      0,
      turn,
      Effect.addSilence(turn),
      0,
      async (caster, target, spell, game) => {
        if (target === caster) game.ui.addTextLog(`${caster.name} lance ${spell._name} sur lui même, il n'e peut plus utiliser de sort pendant ${spell._turn} tour`); 
        else game.ui.addTextLog(`${caster.name} lance ${spell._name} sur ${target.name} il n'e peut plus utiliser de sort pendant ${spell._turn} tour`); 
        
        target.addEffect(spell._effect);
        spell._effect.applyEffect(caster, target);
        await target.spellAnimation(spell);
      }
    );
  }

  static shield(force = 1, turn = 1){
    return new Spell(
      "Bouclier",
      "Tout les sorts infligé a la cible non aucun effet, pendant 1 tour.",
      "Bonus",
      "url('IMAGE/SPELL/ICON/shield.jpg')",
      "url('../IMAGE/SPELL/EFFECT/shield.png')",
      force,
      turn,
      null,
      0,
      async (caster, target, spell, game) =>{
        if(target === caster) turn = 2;
        else turn = 1;
        
        if (target === caster) game.ui.addTextLog(`${caster.name} lance ${spell._name} sur lui même, pendant ${spell._turn} tour`); 
        else game.ui.addTextLog(`${caster.name} lance ${spell._name} sur ${target.name} pendant ${spell._turn} tour`); 
        
        
        target.addEffect(Effect.addShield(force, turn));   
        Effect.addShield(force, turn).applyEffect(caster, target);
        await target.spellAnimation(spell);
      }
    );
  }
} // End Spell
