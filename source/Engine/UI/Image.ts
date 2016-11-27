import {Control} from './Control'
import {IInputListener} from '../Input/IInputListener'
import {InputEvent, InputEventType} from '../Input/InputEvent'
import {IRenderer} from '../Graphics/IRenderer'
import * as PIXI from 'pixi.js'

export class Image extends Control {
    public handler:Function;
    private sprite:PIXI.Sprite;
    
    constructor(private texture:PIXI.Texture, x:number, y:number) {
        super();

        this.sprite = new PIXI.Sprite(texture);
        this.sprite.position.set(this.x, this.y);
        this.graphic = this.sprite;
        this.x = x;
        this.y = y;
    }

    handle(e:InputEvent):boolean {
        let handled = super.handle(e);
        if(e.type == InputEventType.mouseDown && this.handler) {
            this.handler();
            handled = true;
        }
        return handled;
    }
}
