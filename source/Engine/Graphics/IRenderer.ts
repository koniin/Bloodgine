import {Camera} from './Camera'
import {GraphicsContainer} from './GraphicsContainer' 
import * as PIXI from 'pixi.js'

export interface IRenderable {
    graphic:PIXI.DisplayObject;
    zIndex:number;
}

export interface IRenderer {
    width:number;
    height:number;
    camera:Camera;
    createRenderTexture(width:number, height:number, displayObject:PIXI.DisplayObject):PIXI.RenderTexture;
    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    setBackgroundColor(color:number):void;
    initialize():void;
    setFilter(filter:any);
    removeFilters();
    begin():void;
    end():void;
    add(container:GraphicsContainer):void;
    remove(container:GraphicsContainer):void;
    measureText(font:string, text:string):TextMetrics;
}