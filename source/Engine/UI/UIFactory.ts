import * as ui from './UI'
import State from '../State/State'
import {Control} from '../UI/Control'
import {GraphicsContainer} from '../Graphics/GraphicsContainer'

export class UIFactory {
    zIndex:number = 0;

    constructor(private state:State, private graphicsContainer:GraphicsContainer) {}

    button(text:string, x:number, y:number, width:number, height:number, onClick:Function, color?:string, hoverColor?:string, options?:ui.TextOptions):ui.Button {
        let btn = new ui.Button(text, x, y, width, height, options);
        btn.onClick = onClick;
        this.state.addInputListener(btn);
        this.graphicsContainer.add(btn, this.zIndex);
        return btn;
    }

    list<T extends Control>(x:number, y:number, paddingX:number, paddingY:number):ui.List<T> {
        let list = new ui.List<T>(x, y, paddingX, paddingY);
        return list;
    }

    image(texture:PIXI.Texture, x:number, y:number):ui.Image {
        let img = new ui.Image(texture, x, y);
        this.graphicsContainer.add(img, this.zIndex);
        return img;
    }

    text(text:string, x:number, y:number, options?:ui.TextOptions):ui.Text {
        let txt = new ui.Text(text, x, y, options);
        this.graphicsContainer.add(txt, this.zIndex);
        return txt;
    }

    setZIndex(z:number):void {
        this.zIndex = z;    
    }
}