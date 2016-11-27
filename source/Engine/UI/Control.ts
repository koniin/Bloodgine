import {IInputListener} from '../Input/IInputListener'
import {InputEvent, InputEventType} from '../Input/InputEvent'
import Input from '../Input/InputManager'
import {IRenderer, IRenderable} from '../Graphics/IRenderer'

export enum Anchor {
    None = 0,
    Top = 1 << 0,
    Bottom = 1 << 1,
    Left = 1 << 2,
    Right = 1 << 3,
    VerticalMiddle = 1 << 4,
    HorizontalMiddle = 1 << 5
} 

export class Control implements IInputListener, IRenderable {
    public active:boolean = true;
    private _visible:boolean = true;
    public get visible():boolean {
        return this._visible;
    }
    public set visible(b:boolean) {
        this._visible = b;
        this.graphic.visible = b;
    }
    public disableHitTesting:boolean = false;
    public draggable:boolean = false;
    width:number;
    height:number;
    hovered:boolean;
    priority:number = 0;
    private _x:number;
    private _y:number;
    protected onChange:Function;
    public graphic:PIXI.DisplayObject;
    public zIndex:number = 0;

    get left():number {
        return this.x;
    }
    set left(x:number) {
        this.x = x;
    }
    get right():number {
        return this.x + this.width;
    }
    get top():number {
        return this.y;
    }
    set top(y:number) {
        this.y = y;
    }
    get bottom():number {
        return this.y + this.height;
    }
    set x(x:number) {
        this._x = x;
        this.graphic.x = x;
        this.triggerOnChange();
    }
    get x():number {
        return this._x;
    }
    set y(y:number) {
        this._y = y;
        this.graphic.y = y;
        this.triggerOnChange();
    }
    get y():number {
        return this._y;
    }

    setPosition(x:number, y:number) {
        this.x = x;
        this.y = y;
        this.triggerOnChange();
    }

    handle(e:InputEvent):boolean {
        if(!this.visible)
            return false;

        if(e.type == InputEventType.mouseMove) {
            return true;
        }
        if(e.type == InputEventType.mouseEnter) {
            this.hovered = true;
            this.triggerOnChange();
        }
        if(e.type == InputEventType.mouseLeave) {
            this.hovered = false;
            this.triggerOnChange();
        }
        return false;
    }

    private triggerOnChange() {
        if(this.onChange)
            this.onChange();
    }
}
