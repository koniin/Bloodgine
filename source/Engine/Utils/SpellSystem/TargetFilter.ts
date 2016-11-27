import Entity from '../../ECS/Entity'

export interface IFilter {
    validate(entity:Entity):boolean;
}

export class TargetFilter {
    constructor(public filters:IFilter[]) {}

    valid(entity:Entity):boolean {
        for(let filter of this.filters) {
            if(!filter.validate(entity)) {
                return false;
            }
        }
        return true;
    }
}