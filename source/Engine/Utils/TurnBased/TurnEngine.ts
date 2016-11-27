import Entity from '../../ECS/Entity'
import {AbilityComponent} from '../../ECS/Components/AbilityComponent'

export class TurnEngine {
    public entities:Array<Entity>;
    private index:number = 0;

    constructor() {
        this.entities = [];
    }

    get currentEntity():Entity {
        return this.entities[this.index];
    }

    addEntity(entity:Entity):void {
        if(entity.hasComponent(AbilityComponent))
            this.entities[this.entities.length] = entity;
        else 
            console.log("entity is missing AbilityComponent");
    }

    // purely order based
    // implement by speed and energy ticks
    update(dt:number) {
        let entity:any = this.entities[this.index];
        let component = entity.AbilityComponent;
        if(component.done) {
            component.done = false;
            this.endTurn();
        }
    }

    endTurn():void {
        this.index = (this.index + 1) % this.entities.length;
        console.log("NEEXT!!");
    }
}