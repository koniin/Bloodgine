import Vector2 from '../Core/Vector2'
import {Camera} from './Camera' 
import {IRenderer} from './IRenderer'
import * as PIXI from "pixi.js"
import {GraphicsContainer} from './GraphicsContainer' 

export class PixiRenderer implements IRenderer {
    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    camera:Camera;
    width:number;
    height:number;
    private containerId:string;
    private canvasId:string;

    readonly defaultWidth:number = 640;
    readonly defaultHeight:number = 360;
    renderer:PIXI.CanvasRenderer | PIXI.WebGLRenderer;
    root:PIXI.Container;

    constructor() {
        this.camera = new Camera();
    }

    public initialize() {
        PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
        //this.renderer.roundPixels = true
        this.renderer = PIXI.autoDetectRenderer(this.defaultWidth, this.defaultHeight);
        this.renderer.backgroundColor = 0x061639;
        this.containerId = "canvas-container";
        this.canvasId = "game-canvas";
        let canvasContainer = document.createElement("div");
        canvasContainer.setAttribute("id", this.containerId);
        let canvas = this.renderer.view;
        canvas.setAttribute("id", this.canvasId);
        canvasContainer.appendChild(canvas);
        document.body.appendChild(canvasContainer);

        this.canvas = canvas;
        this.root = new PIXI.Container();
        this.ctx = undefined; // not supposed to be used
        this.width = this.camera.width = this.canvas.width;
        this.height = this.camera.height = this.canvas.height;
    }

    createRenderTexture(width:number, height:number, displayObject:PIXI.DisplayObject):PIXI.RenderTexture { 
        let texture = PIXI.RenderTexture.create(width, height);
        this.renderer.render(displayObject, texture);
        return texture;
    }

    public add(container:GraphicsContainer) {
        this.root.addChild(container.container);
    }

    public remove(container:GraphicsContainer) {
        this.root.removeChild(container.container);
    }

    public setBackgroundColor(color:number):void {
        this.renderer.backgroundColor = color;
    }
    
    setFilter(filter:any) {
        this.root.filters = [filter];
    }
    
    removeFilters() {
        this.root.filters = null;
    }

    public begin() {
        //this.root.setTransform(-this.camera.offsetX, -this.camera.offsetY);
        this.root.position.set(-this.camera.offsetX, -this.camera.offsetY);
        //this.ctx.translate(-this.camera.offsetX, -this.camera.offsetY);
        this.renderer.render(this.root);
    }

    public end() {
    }

    public measureText(font:string, text:string):TextMetrics {
        //this.ctx.save();
        //let fnt = this.ctx.font;
        this.ctx.font = font;
        let textMetrics =  this.ctx.measureText(text);
        //this.ctx.font = fnt;
        //this.ctx.restore();
        return textMetrics;
    }

    public square(x:number, y:number, width:number, height:number, color:string):void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    public outline(x:number, y:number, width:number, height:number, color:string):void {
        this.ctx.beginPath(); // clear paths to speed up stroke etc
        this.ctx.strokeStyle = color;
        this.ctx.rect(x, y, width, height);
        this.ctx.stroke();
    }

    public render(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, offsetX: number, offsetY: number, width?: number, height?: number, canvasOffsetX?: number, canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number): void {
        if(image === null) return;
        
        if(width && height && canvasOffsetX !== undefined && canvasOffsetY !== undefined) {
            this.ctx.drawImage(image, offsetX, offsetY,
                width, height,
                canvasOffsetX, canvasOffsetY,
                canvasImageWidth, canvasImageHeight);
        } else if(width && height) {
            this.ctx.drawImage(image, offsetX, offsetY, width, height);
        } else {
            this.ctx.drawImage(image, offsetX, offsetY);
        }
    }

    public renderText(color:string, font:string, text:string, x:number, y:number) {
        //let fillstyle = this.ctx.fillStyle;
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        this.ctx.fillText(text, x, y);
        //this.ctx.fillStyle = fillstyle;
    }
}