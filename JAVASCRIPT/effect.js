export class Effect {
  constructor(Name, Force, Turn, ApplyEffect, RemoveEffect){
    this._name = Name;
    this._force = Force;
    this._turn = Turn;
    this._applyEffect = ApplyEffect;
    this._removeEffect = RemoveEffect;
  }

  applyEffect(caster, target){
    return this._applyEffect(caster, target);
  }
  removeEffect(caster, target){
    return this._removeEffect(caster, target);
  }

  static addPm(force, turn) {
    return new Effect(
      "+pm",
      force,
      turn,
      (caster, target) => {     
        target.pm += force;
      },
      (caster, target) => {        
        target.pm -= force;
      }
    );
  }

  static removePm(force, turn){
    return new Effect(
      "-pm",
      force,
      turn,
      (caster, target) => {
        target.pm -= force;
      },
      (caster, target) => {
        target.pm += force;
      }
    );
  }
  
  static addSilence(turn) {
    return new Effect(
      "silence",
      0,
      turn,
      (caster, target) => {        
        target._isSilence = true;
      },
      (caster, target) => {        
        target._isSilence = false; 
      }
    );
  }

  static addShield(force, turn) {
    return new Effect(
      "Bouclier",
      force,
      turn,
      (caster, target) => {
        target.isShield = true;    
      },
      (caster, target) => {
        target.isShield = false;
      }
    );
  }
}// End Effect