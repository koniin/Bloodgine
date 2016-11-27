import Entity from '../../ECS/Entity'
import {Ability} from './Ability'
import {TargetFilter} from './TargetFilter'

//  a target component (what kind of target, how many, live targets or dead targets, 
//    is it a cone shape or a sphere, single target, etc etc)
// validate them (for range, type, live/dead status, etc) 

export interface ITargetPicker {
    originX:number;
    originY:number;

    // also can validate targets
    // finds targets depending on click location
    // ui determines if clicks are ok
    pickTargets(targetfilter:TargetFilter):void;
    hasPicked():boolean;
    endPicking():void;
    getTargets():Entity[];
}