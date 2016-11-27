import {IRenderer} from './IRenderer'
import {InputManager} from '../Input/InputManager'
import DesktopApi from '../Platform/DesktopIntegration'
import {PixiRenderer} from './PixiRenderer'

export class ResolutionManager {
    private renderer:IRenderer;
    private pixelRatio:number = window.devicePixelRatio || 1;  
    private width:number;
    private height:number;
    private canvas:HTMLCanvasElement;
    private ctx:any;
    private imageSmoothing:boolean;

    constructor(private input:InputManager) {
    }

    initialize(renderer:IRenderer) {
        this.renderer = renderer;
        this.width = renderer.width;
        this.height = renderer.height;
        this.canvas = this.renderer.canvas;
        this.ctx = this.renderer.ctx;

        this.imageSmoothing = false;        
    }

    // Simple version that doesnt scale, does not render crisp text and primitives
    setResolutionNonCrisp(width:string, height:string) {
        if(!this.renderer.canvas.hasAttribute("style"))
            this.renderer.canvas.setAttribute("style", "image-rendering: -moz-crisp-edges;image-rendering: -webkit-crisp-edges;image-rendering: pixelated;");
        this.renderer.canvas.style.width = width + "px";
        this.renderer.canvas.style.height = height + "px";
    }

    // 1 means your starting resolution
    setScale(scale:number) {
        this.scale(scale, scale);
    }

    scale(xScale:number, yScale:number) {
        // Set the input to use the same scale to preserve mouse positions
        this.input.setScale(xScale, yScale);

        // PIXI
        let a = <PixiRenderer>this.renderer;
        a.root.scale.x = xScale; 
        a.root.scale.y = yScale;
        a.renderer.resize(xScale * this.width * this.pixelRatio, yScale * this.height * this.pixelRatio);
        
        /* CANVAS (not PIXI)
        // Set width/height for canvas and css style
        this.canvas.width = scale * this.width * this.pixelRatio;
        this.canvas.height = scale * this.height * this.pixelRatio;
        this.canvas.style.width = `${scale * this.width}px`;
        this.canvas.style.height = `${scale * this.height}px`;

        // disable image smoothing to preserve pixel art
        this.ctx.mozImageSmoothingEnabled = this.imageSmoothing;
        this.ctx.imageSmoothingEnabled = this.imageSmoothing;

        // Scale the canvas by our scale and devicePixelRatio (for retina etc)
        this.ctx.scale(scale * this.pixelRatio, scale * this.pixelRatio);
        */

        DesktopApi.resize(a.renderer.width, a.renderer.height);
    }

    keepSizeRatio() {
        var size = [1920, 1080];
        var ratio = size[0] / size[1];

        if (window.innerWidth / window.innerHeight >= ratio) {
            var w = window.innerHeight * ratio;
            var h = window.innerHeight;
        } else {
            var w = window.innerWidth;
            var h = window.innerWidth / ratio;
        }
        let a = <PixiRenderer>this.renderer;
        a.renderer.resize(w, h);
        //a.renderer.view.style.width = w + 'px';
        //a.renderer.view.style.height = h + 'px';
    }

    // Scales to the highest resolution but keeps pixel sizes intact (scales in integers)
    pixelScale() {
        let s = Math.floor(window.innerWidth / this.width);
        this.setScale(s);
    }

    stretch() {
        let sx = (window.innerWidth / this.width);
        let sy = (window.innerHeight / this.height);

        // Set the input to use the same scale to preserve mouse positions
        this.input.setScale(sx, sy);
        
        this.scale(sx, sy);
        /*
        // Set width/height for canvas and css style
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.width = `${window.innerWidth}px`;
        this.canvas.style.height = `${window.innerHeight}px`;

        // disable image smoothing to preserve pixel art
        this.ctx.mozImageSmoothingEnabled = this.imageSmoothing;
        this.ctx.imageSmoothingEnabled = this.imageSmoothing;

        // Scale the canvas by our scale and devicePixelRatio (for retina etc)
        this.ctx.scale(sx * this.pixelRatio, sy * this.pixelRatio);
        */
    }

    setImageSmoothingEnabled(s:boolean) {
        this.imageSmoothing = s;
    }

    toggleFullscreen() {
        var doc = <any>window.document;
        let element = <any>document.getElementById("game-canvas");
        
        var requestFullScreen = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullScreen || element.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(element);
        } else {
            cancelFullScreen.call(doc);
        }
    }
}