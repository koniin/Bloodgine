import Component from '../Component'
import RenderableComponent from './RenderableComponent'
import InteractiveComponent from './InteractiveComponent'

export default class TouchInputComponent extends InteractiveComponent  {
    constructor(onclick:Function, target?:RenderableComponent) {
        super();
        this.onClick = onclick;
        if(target)
            this.target = target;
    }

    onAddedToEntity() {
        super.onAddedToEntity();
        
        if(!this.target) {
            this.target = <RenderableComponent>this.entity.getComponentByType(RenderableComponent);
        } 
    }
}