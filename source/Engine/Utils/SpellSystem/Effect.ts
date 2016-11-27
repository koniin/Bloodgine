import Entity from '../../ECS/Entity'

export class Effect {
    apply(entity:Entity) {
        console.log("applying effect on: " + entity.name);
    }
}