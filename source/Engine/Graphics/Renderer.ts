import Vector2 from '../Core/Vector2'
import {Camera} from './Camera' 
import {IRenderer} from './IRenderer'
import {GraphicsContainer} from './GraphicsContainer' 

export class Renderer {
    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    camera:Camera;
    width:number;
    height:number;
    private containerId:string;
    private canvasId:string;

    constructor() {
        this.camera = new Camera();
    }

    public initialize(canvas:HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.width = this.camera.width = this.canvas.width;
        this.height = this.camera.height = this.canvas.height;
    }

    public createDefault():HTMLCanvasElement {
        this.containerId = "canvas-container";
        this.canvasId = "game-canvas";
        let canvasContainer = document.createElement("div");
        canvasContainer.setAttribute("id", this.containerId);
        let canvas = document.createElement("canvas");
        canvas.setAttribute("id", this.canvasId);
        canvasContainer.appendChild(canvas);
        document.body.appendChild(canvasContainer);
        canvas.width = 640;
        canvas.height = 360;
        return canvas;
    }

    public add(container:GraphicsContainer) {
        throw "NOT IMPLEMENTED";
    }

    public remove(container:GraphicsContainer) {
        throw "NOT IMPLEMENTED";
    }

    backgroundColor:string;
    public setBackgroundColor(color:string):void {
        this.backgroundColor = color;
    }

    public begin() {
        // Don't save/restore, slower performance?
        // this.ctx.save();
        this.ctx.clearRect(0, 0, this.width, this.height);
        // Dirty
        this.square(0,0,this.width, this.height, this.backgroundColor);
        this.ctx.save()
        //context.scale(1.0/camera.scale, 1.0/camera.scale);
        this.ctx.translate(-this.camera.offsetX, -this.camera.offsetY);
        // this.ctx.restore();

        // Another way
        // this.ctx.fillRect(0, 0, this.width, this.height);
    }

    public end() {
        this.ctx.restore();
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
/*
    public circle(x:number, y:number, r:number):void {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI*2, false);
        this.ctx.stroke();
    }
    */
}