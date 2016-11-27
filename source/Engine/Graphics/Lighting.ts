import {IRenderer, IRenderable} from './IRenderer'
import GameCore from '../GameCore'
import * as PIXI from 'pixi.js'

export class Light {
    constructor(public x:number, public y:number, public radius:number, private renderer:(context:CanvasRenderingContext2D, light:Light) => void) {}

    update() {
        // could do a follow function like
        // setFollow(x) and here we update x and y with followed objects x,y
        // or we do this somewhere else like in Lights class
    }

    public draw(context:CanvasRenderingContext2D) {
        this.renderer(context, this);
    }
}

const hardLight = function(context:CanvasRenderingContext2D, light:Light) {
    // Draw circle of light
    context.beginPath();
    context.fillStyle = "rgb(255, 255, 255)";
    context.arc(light.x, light.y, light.radius, 0, Math.PI*2);
    context.fill();
}

const softLight = function(context:CanvasRenderingContext2D, light:Light) {
    // flicker
    //let radius = this.radius + this.game.rnd.integerInRange(1,10);
    var gradient = context.createRadialGradient(light.x, light.y, light.radius * 0.75, light.x, light.y, light.radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

    context.beginPath();
    context.fillStyle = gradient;
    context.arc(light.x, light.y, light.radius, 0, Math.PI*2);
    context.fill();
};

export const enum LightType {
    SOFT = 1,
    HARD = 2
}

export class Lights implements IRenderable {
    graphic:PIXI.Sprite;
    zIndex:number = 20;
    canvas:HTMLCanvasElement;
    context:CanvasRenderingContext2D;
    private lights:Light[];
    darkness:string = "rgb(100, 100, 100)";

    constructor(private game:GameCore, zIndex?:number) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = game.width;
        this.canvas.height = game.height;
        this.graphic = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas));
        this.graphic.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        if(zIndex)
            this.zIndex = zIndex;
        this.lights = [];
    }

    addLight(x:number, y:number, radius:number, type:LightType):Light {
        let light = new Light(x, y, radius, this.getLightRenderer(type));
        this.lights.push(light);
        return light;
    }

    getLightRenderer(type:LightType) {
        if(type === LightType.HARD) {
            return hardLight;
        }
        if(type === LightType.SOFT) {
            return softLight;
        }
    }

    update() {
        /* Do we need to do this?
        if(this.canvas.width !== this.game.width || this.canvas.height !== this.game.height) {
            this.canvas.width = this.game.width;
            this.canvas.height = this.game.height;
        }
        */
        this.updateShadowTexture();
    }

    updateShadowTexture() {
        // This function updates the shadow texture (this.shadowTexture).
        // First, it fills the entire texture with a dark shadow color.
        // Then it draws a white circle centered on the pointer position.
        // Because the texture is drawn to the screen using the MULTIPLY
        // blend mode, the dark areas of the texture make all of the colors
        // underneath it darker, while the white area is unaffected.

        // Draw shadow
        this.context.fillStyle = this.darkness;
        this.context.fillRect(0, 0, this.game.width, this.game.height);

        for(let light of this.lights) {
            light.draw(this.context);
        }
        this.graphic.texture.update();
    }
}