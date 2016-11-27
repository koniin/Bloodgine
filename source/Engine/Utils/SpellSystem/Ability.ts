import {Effect} from './Effect'
import {ITargetPicker} from './TargetPicker'
import {TargetFilter} from './TargetFilter'
import Entity from '../../ECS/Entity'

export class Ability {
    constructor(public name:string, public targetfilter:TargetFilter, public targetPicker:ITargetPicker) {}
    
    public isExecuting:boolean = false;
    private isEffectsRunning:boolean = false;
    

    // a caster component (caster can only use when alive, can't use while stunned, etc),
    public caster:string;

    // a power cost component (could be mana or whatever else you use)
    public cost:number;

    // The effects are the thing that your ability will actually DO: a damage effect, a heal effect, a teleport effect, 
    // a stat buff effect, etc etc. You'll want to be able to string a whole list of effects together on any given ability. 
    // You may think that your effects should be re-usable on a global scale but in practice I've found it's usually much better 
    // to have the effects be per-ability.
    public effects:Effect[];

    // You'll also need to handle the FX side of things (animation, particles, projectiles, etc). 
    // That should be on the ability side. I suggest applying all effects at once, though you could 
    // have different ones fire off at different times (at the start of the effect vs when the projectile physically 
    // hits the target for example).

    isUsable():boolean {
        // Use the caster component to find out if we can use this ability this turn
        // e.g. are we stunned or too little power to use or something else stopping it?
        // Caster should be a list of filters or something perhaps
        return true;
    }

    // Once you gathered your targets then you either 
    // start your FX system and wait for it to notify you of impact, or you could immediately trigger your 
    // list of AbilityEffects to run. Each effect would have its own logic for how to apply to each target.
    activate() {
        // initiate target selector
        this.targetPicker.pickTargets(this.targetfilter);
        this.isExecuting = true;
        // update of abilitycomponent checks if targetselector isExecuting
	}

    // might not need update if FX can set active status
    tempTimer:number = 0;
    update(dt:number) {
        if(this.targetPicker.hasPicked()) {
            console.log("targets picked so moving on");
            this.targetPicker.endPicking();

            // Decrease user power by the power cost component of this class

            let targets:Entity[] = this.targetPicker.getTargets();
            for(let effect of this.effects) {
                for(let entity of targets) {
                    effect.apply(entity)
                }
            }
            console.log("effects applied");
            this.isEffectsRunning = true;
        }

        // can probably check if all effects are done instead
        if(this.isEffectsRunning) {
            this.tempTimer += dt;
            if(this.tempTimer >= 2) {
                console.log("timer is complete - all effect FX are done.");
                this.isExecuting = false;
                this.isEffectsRunning = false;
                this.tempTimer = 0;
            }
        }
    }
}