import RenderableComponent from '../RenderableComponent'
import * as PIXI from 'pixi.js'

export default class TextComponent extends RenderableComponent {
    private text:PIXI.Text;
    constructor(public color:string, public font:string, text:string) {
        super();
        
        this.font = font;
        let textStyle = new PIXI.TextStyle();
        textStyle.fill = color;
        textStyle.fontSize = 12;
        textStyle.fontFamily = "Arial";
        this.text = new PIXI.Text(text, textStyle);
        this.addGraphic(this.text);
    }

    getX():number {
        return this.entity.x;
    }

    getY():number {
        return this.entity.y;
    }

    getHeight():number {
        throw "Height is not implemented for TextComponent";
    }
    
    getWidth():number {
        throw "Width is not implemented for TextComponent";
    }

    setText(text:string):TextComponent {
        this.text.text = text;
        return this;
    }

    setColor(color:string):TextComponent {
        throw "NOT IMPLEMENTED";
        
    }

    setFont(font:string):TextComponent {
        this.font = font;
        return this;
    }
/*
    setStyle(color?:string, font?:string, text?:string):TextComponent {
        if(color)
            this.color = color;
        if(font)
            this.font = font;
        if(text)
            this.text = text;
        return this;
    }
*/
    update(dt:number) {
        this.text.position.set(this.entity.x, this.entity.y);
    }
}