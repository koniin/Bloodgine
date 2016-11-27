import RenderableComponent from './RenderableComponent'
import Component from './Component'
import {IInputListener} from '../Input/IInputListener'
import {InputEvent, InputEventType} from '../Input/InputEvent'

export default class InteractiveComponent extends Component implements IInputListener {
    public target:RenderableComponent;
    public active:boolean = true;
    public disableHitTesting:boolean = false;
    public draggable:boolean = false;
    public onClick:Function;
    public priority:number = 0;

    handle(e:InputEvent):boolean {
        if(e.type == InputEventType.mouseDown) {
            if(this.onClick)
                this.onClick();
            return true;
        }
        if(e.type == InputEventType.dragEnd) {
            console.log("drag end");
            return true; // doesnt matter for dragEnd
        }
        if(e.type == InputEventType.dragStart) {
            console.log("drag start");
            return true; // doesnt matter for dragStart
        }
        return false;
    }

    get left() {
        return this.target.getX();
    }
    set left(x:number) {
        this.entity.x = x;
    }

    get right() {
        return this.target.getX() + this.target.getWidth();
    }

    get top() {
        return this.target.getY();
    }
    set top(y:number) {
        this.entity.y = y;
    }

    get bottom() {
        return this.target.getY() + this.target.getHeight();
    }
}