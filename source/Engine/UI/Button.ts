import {Control} from './Control'
import {IInputListener} from '../Input/IInputListener'
import {InputEvent, InputEventType} from '../Input/InputEvent'
import {IRenderer} from '../Graphics/IRenderer'
import {TextOptions, getDefaultFont} from './Text'
import * as PIXI from 'pixi.js'

export class Button extends Control {
    private textX:number;
    private textY:number;
    private changed:boolean = true;
    public color:number = 0x4444ff;
    public hoverColor:number = 0x4444aa;
    public onClick:Function;
    private textSettings:TextOptions;
    private rectangle:PIXI.Graphics;
    private text:PIXI.Text;

    constructor(text:string, x:number, y:number, width:number, height:number, textOptions?:TextOptions) {
        super();
        this.width = width;
        this.height = height;

        this.textSettings = textOptions || getDefaultFont();

        let textStyle = new PIXI.TextStyle();
        textStyle.fill = 0xffffff;
        textStyle.fontSize = this.textSettings.fontSize;
        textStyle.fontFamily = this.textSettings.font;
        this.text = new PIXI.Text(text, textStyle);
        this.text.anchor.set(0.5, 0.5);
        this.updateTextPosition();

        this.rectangle = new PIXI.Graphics();
        this.rectangle.x = this.x;
        this.rectangle.y = this.y;
        this.onChanged();

        this.onChange = () => {
            this.onChanged();
        };

        this.rectangle.addChild(this.text);
        this.graphic = this.rectangle;
        this.x = x;
        this.y = y;
    }

    private onChanged() {
        if(this.hovered) {
            this.rectangle.clear();
            this.rectangle.beginFill(this.hoverColor);
            this.rectangle.drawRect(0, 0, this.width, this.height);
            this.rectangle.endFill();
        } else {
            this.rectangle.clear();
            this.rectangle.beginFill(this.color);
            this.rectangle.drawRect(0, 0, this.width, this.height);
            this.rectangle.endFill();
        }
        this.updateTextPosition();
        this.rectangle.x = this.x;
        this.rectangle.y = this.y;
    }

    private updateTextPosition() {
        this.text.x = Math.floor(this.width / 2);
        this.text.y = Math.floor(this.height / 2);
    }

    setText(text:string):void {
        this.text.text = text;
    }

    handle(e:InputEvent):boolean {
        let handled = super.handle(e);
        if(e.type == InputEventType.mouseDown && this.onClick) {
            this.onClick(this, e);
            handled = true;
        }
        return handled;
    }
}
