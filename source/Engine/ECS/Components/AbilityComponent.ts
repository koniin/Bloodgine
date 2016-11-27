import Component from '../Component'
import Entity from '../Entity'
import {Ability} from '../../Utils/SpellSystem/Ability'

export class AbilityComponent extends Component {
    constructor(public abilities:Ability[]) {
        super();
    }

    public done:boolean = false;

    update(dt:number) {
        this.done = false;
        for(let i = 0; i < this.abilities.length; i++) {
            let ability = this.abilities[i]; 
            if(ability.isExecuting) {
                ability.update(dt);
                this.done = !ability.isExecuting;
            }
        }
    }
}