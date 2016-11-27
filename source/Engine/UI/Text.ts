import {Control} from './Control'
import {IInputListener} from '../Input/IInputListener'
import {InputEvent, InputEventType} from '../Input/InputEvent'
import {Renderer} from '../Graphics/Renderer'
import * as PIXI from 'pixi.js'

export class TextOptions {
    public font:string;
    public fontSize:number;
    public color:number;
    public hoverColor:number;

    constructor(font?:string, fontSize?:number, color?:number, hovercolor?:number) {
        this.font = font;
        this.fontSize = fontSize;
        this.color = color;
        this.hoverColor = hovercolor;
    }
}

export function getDefaultFont() {
    let defaultFont = new TextOptions();
    defaultFont.color = 0x000000;
    defaultFont.hoverColor = 0xf0f0f0;
    defaultFont.fontSize = 10;
    defaultFont.font = "Arial";
    return defaultFont;
}

export class Text extends Control {
    public handler:Function;
    private settings:TextOptions;
    private text:PIXI.Text;
    
    constructor(text:string, x:number, y:number, options?:TextOptions) {
        super();
        this.settings = options || getDefaultFont();

        let textStyle = new PIXI.TextStyle();
        textStyle.fill = 0xffffff;
        textStyle.fontSize = this.settings.fontSize;
        textStyle.fontFamily = this.settings.font;
        this.text = new PIXI.Text(text, textStyle);
        this.text.position.set(this.x, this.y);
        this.graphic = this.text;
        this.x = x;
        this.y = y;
    }

    setText(text:string) {
        this.text.text = text;
    }

    setFont(fontSize:number, font:string) {
        throw "NOT IMPLEMENTED";
        /*
        this.settings.fontSize = fontSize;
        this.settings.font = font;
        this.font = this.settings.fontSize + "px " + this.settings.font;
        */
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
