import {Control} from './Control'
import {IInputListener} from '../Input/IInputListener'
import {InputEvent, InputEventType} from '../Input/InputEvent'
import {Renderer} from '../Graphics/Renderer'

export class List<T extends Control> extends Control {
    public controls:T[];
    private paddingX:number;
    private paddingY:number; 
    private xPos:number;
    private yPos:number;
    private count:number = 0;

    constructor(x:number, y:number, paddingX:number, paddingY:number) {
        super();
        this.controls = [];
        this.xPos = x;
        this.yPos = y;
        this.paddingX = paddingX;
        this.paddingY = paddingY;
    }

    add(control:T) {
        this.controls.push(control);
        control.x = control.x + this.xPos + (this.count * this.paddingX);
        control.y = control.y + this.yPos + (this.count * this.paddingY);
        this.count++;
    }
}
