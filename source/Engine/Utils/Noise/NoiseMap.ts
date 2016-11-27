import {SimplexNoise} from './SimplexNoise'
import {PM_PRNG} from './ParkMillerPrng'
import {IRenderer, IRenderable} from '../../Graphics/IRenderer'
import * as PIXI from 'pixi.js'

export interface INoiseMap extends IRenderable {
    update(dt:number);
    generate(renderer:IRenderer, mapWidth:number, mapHeight:number, cellSize:number);
}

export class BasicMap implements INoiseMap {
    noiseGen = new SimplexNoise();
    graphic:PIXI.DisplayObject;
    public zIndex:number = 0;
    
    update(dt:number){}

    generate(renderer:IRenderer, mapWidth:number, mapHeight:number, cellSize:number) {
        let rows = mapHeight / cellSize;
        let cols = mapWidth / cellSize;
        let graphics = new PIXI.Graphics(), color;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {      
                let nx = x/cols - 0.5, ny = y/rows - 0.5;
                color = this.smallbiome(this.noise2d(nx, ny));
                graphics.beginFill(color);
                graphics.drawRect(x * cellSize, y * cellSize, cellSize, cellSize);
                graphics.endFill();
            }
        }
        
        let sprite = new PIXI.Sprite(renderer.createRenderTexture(mapWidth, mapHeight, graphics));
        sprite.position.set(0,0);
        this.graphic = sprite;
    }

    smallbiome(e):number {
        if (e < 0.2) return 0x0000FF;
        else if (e < 0.4) return 0xffff99;
        else if (e < 0.6) return 0x00cc66;
        else if (e < 0.8) return 0x009933;
        else return 0xe0e0e0;
    }

    noise2d(nx, ny) {
        // Rescale from -1.0:+1.0 to 0.0:1.0
        return this.noiseGen.noise2D(nx, ny) / 2 + 0.5;
    }
}

export class AnimatedMap implements INoiseMap {
    graphic:PIXI.DisplayObject;
    public zIndex:number = 0;
    noiseGen = new SimplexNoise();
    timer:number = 1;
    container:PIXI.Container;
    texture1:PIXI.Texture;
    texture2:PIXI.Texture;
    texture3:PIXI.Texture;
    texture4:PIXI.Texture;
    texture5:PIXI.Texture;
    
    constructor(private renderer:IRenderer, private mapWidth:number, private mapHeight:number, private cellSize:number) {
        this.container = new PIXI.Container();
        this.graphic = this.container;
        
        this.texture1 = this.createTexture(0x442F74);
        this.texture2 = this.createTexture(0x5E2971);
        this.texture3 = this.createTexture(0x303E73);
        this.texture4 = this.createTexture(0x645092);
        this.texture5 = this.createTexture(0x431155);

        let rows = mapHeight / cellSize;
        let cols = mapWidth / cellSize;
        let color;
        for (var y = 0, index = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++, index++) {      
                let sprite = new PIXI.Sprite(this.texture1);
                sprite.position.set(x * cellSize, y * cellSize);
                this.container.addChildAt(sprite, index); 
            }
        }
    }

    createTexture(color:number):PIXI.Texture {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(color);
        graphics.drawRect(0, 0, this.cellSize, this.cellSize);
        graphics.endFill();
        return this.renderer.createRenderTexture(this.cellSize, this.cellSize, graphics);
    }

    update(dt:number) {
        this.timer += dt;
        this.generate(this.renderer, this.mapWidth, this.mapHeight, this.cellSize);
    }

    generate(renderer:IRenderer, mapWidth:number, mapHeight:number, cellSize:number) {
        let rows = mapHeight / cellSize;
        let cols = mapWidth / cellSize;
        let color;
        for (var y = 0, index = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++, index++) {      
                var nx = x/cols - 0.5, ny = y/rows - 0.5;
                color = this.smallbiome(this.noise3d(nx, ny, this.timer));
                (<PIXI.Sprite>this.container.getChildAt(index)).texture = color; 
            }
        }
    }

    smallbiome(e):PIXI.Texture {
        if (e < 0.2) return this.texture1;
        else if (e < 0.4) return this.texture2;
        else if (e < 0.6) return this.texture3;
        else if (e < 0.8) return this.texture4;
        else return this.texture5;
    }

    noise3d(nx, ny, dt) {
        // Rescale from -1.0:+1.0 to 0.0:1.0
        return this.noiseGen.noise3D(nx, ny, dt) / 2 + 0.5;
    }
}

export class ExponentMap implements INoiseMap {
    graphic:PIXI.DisplayObject;
    public zIndex:number = 0;
    noiseGen = new SimplexNoise();
    exponent:number = 2;

    update(dt:number){}

    generate(renderer:IRenderer, mapWidth:number, mapHeight:number, cellSize:number) {
        let rows = mapHeight / cellSize;
        let cols = mapWidth / cellSize;
        let graphics = new PIXI.Graphics(), color:number;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {      
                let nx = x/cols - 0.5, ny = y/rows - 0.5;
                color = this.biome(this.heightMap(x, y, cols, rows));
                graphics.beginFill(color);
                graphics.drawRect(x * cellSize, y * cellSize, cellSize, cellSize);
                graphics.endFill();
            }
        }
        
        let sprite = new PIXI.Sprite(renderer.createRenderTexture(mapWidth, mapHeight, graphics));
        sprite.position.set(0,0);
        this.graphic = sprite;
    }
    
    biome(e):number {
        if (e < 0.1) return 0x2b6dd8;
        else if (e < 0.2) return 0xe2dd9c;
        else if (e < 0.3) return 0xa4d17d;
        else if (e < 0.5) return 0x67963f;
        else if (e < 0.7) return 0x3e6819;
        else if (e < 0.9) return 0x323332;
        else return 0x626362;
    }

    heightMap(x:number, y:number, width:number, height:number):number {
        var nx = x/width - 0.5, ny = y/height - 0.5;
        let e = 1 * this.noise2d(1 * nx, 1 * ny);
                + 0.5 * this.noise2d(2 * nx, 2 * ny);
                + 0.25 * this.noise2d(4 * nx, 4 * ny);
        return Math.pow(e, this.exponent);
    }

    noise2d(nx, ny) {
        // Rescale from -1.0:+1.0 to 0.0:1.0
        return this.noiseGen.noise2D(nx, ny) / 2 + 0.5;
    }
}

export class IslandMap implements INoiseMap {
    graphic:PIXI.DisplayObject;
    public zIndex:number = 0;
    noiseGen = new SimplexNoise();
    exponent:number = 2;
    a:number = 0.10;
    b:number = 0.90;
    c:number = 3.40;

    update(dt:number){}

    generate(renderer:IRenderer, mapWidth:number, mapHeight:number, cellSize:number) {
        let rows = mapHeight / cellSize;
        let cols = mapWidth / cellSize;
        let graphics = new PIXI.Graphics(), color:number;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {      
                let nx = x/cols - 0.5, ny = y/rows - 0.5;
                color = this.biome(this.heightMap(x, y, cols, rows));
                graphics.beginFill(color);
                graphics.drawRect(x * cellSize, y * cellSize, cellSize, cellSize);
                graphics.endFill();
            }
        }
        
        let sprite = new PIXI.Sprite(renderer.createRenderTexture(mapWidth, mapHeight, graphics));
        sprite.position.set(0,0);
        this.graphic = sprite;
    }

    heightMap(x:number, y:number, width:number, height:number):number {
        var nx = x/width - 0.5, ny = y/height - 0.5;
        let e = 1 * this.noise2d(1 * nx, 1 * ny);
                + 0.5 * this.noise2d(2 * nx, 2 * ny);
                + 0.25 * this.noise2d(4 * nx, 4 * ny);
        // let d = this.manhattan(nx, ny);
        let d = this.euclidean(nx, ny);
        // Add
        e = e + this.a - this.b * Math.pow(d, this.c);
        // or multiply
        // e = (e + this.a) * (1 - this.b*Math.pow(d, this.c));
        return e;
    }

    manhattan(nx:number, ny:number):number {
        return 2*Math.max(Math.abs(nx), Math.abs(ny));
    }

    euclidean(nx:number, ny:number):number {
        return 2*Math.sqrt(nx*nx + ny*ny);
    }

    biome(e):number {
        if (e < 0.1) return 0x2b6dd8;
        else if (e < 0.2) return 0xe2dd9c;
        else if (e < 0.3) return 0xa4d17d;
        else if (e < 0.5) return 0x67963f;
        else if (e < 0.7) return 0x3e6819;
        else if (e < 0.9) return 0x323332;
        else return 0x626362;
    }

    noise2d(nx, ny) {
        // Rescale from -1.0:+1.0 to 0.0:1.0
        return this.noiseGen.noise2D(nx, ny) / 2 + 0.5;
    }
}

// change seeds or parameters to get different outcomes
export class AdvancedMap implements INoiseMap {
    graphic:PIXI.DisplayObject;
    public zIndex:number = 0;
    seed1:number = 42141;
    seed2:number = 12356;
    rng1 = new PM_PRNG(this.seed1);
    rng2 = new PM_PRNG(this.seed2);
    gen1 = new SimplexNoise(this.rng1.nextDouble.bind(this.rng1));
    gen2 = new SimplexNoise(this.rng2.nextDouble.bind(this.rng2));
    noise1(nx, ny) { return this.gen1.noise2D(nx, ny)/2 + 0.5; }
    noise2(nx, ny) { return this.gen2.noise2D(nx, ny)/2 + 0.5; }

    exp:number = 1.61;
    e1:number = 0.36;
    e2:number = 1.00;
    e3:number = 0.67;
    e4:number = 0.00;
    e5:number = 0.00;
    e6:number = 0.08; 

    m1:number = 0.83;
    m2:number = 0.59;
    m3:number = 0.18;
    m4:number = 0.56;
    m5:number = 0.57;
    m6:number = 0.50; 
    
    update(dt:number){}

    generate(renderer:IRenderer, mapWidth:number, mapHeight:number, cellSize:number) {
        let rows = mapHeight / cellSize;
        let cols = mapWidth / cellSize;
        let graphics = new PIXI.Graphics(), color:number;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {      
                let nx = x/cols - 0.5, ny = y/rows - 0.5;
                let e = this.calcElevation(nx, ny);
                let m = this.calcMoisture(nx, ny);
                color = this.dualbiome(e, m);
                graphics.beginFill(color);
                graphics.drawRect(x * cellSize, y * cellSize, cellSize, cellSize);
                graphics.endFill();
            }
        }
        let sprite = new PIXI.Sprite(renderer.createRenderTexture(mapWidth, mapHeight, graphics));
        sprite.position.set(0,0);
        this.graphic = sprite;
    }

    calcElevation(nx:number, ny:number):number {
        var e = (this.e1 * this.noise1( 1 * nx,  1 * ny)
                + this.e2 * this.noise1( 2 * nx,  2 * ny)
                + this.e3 * this.noise1( 4 * nx,  4 * ny)
                + this.e4 * this.noise1( 8 * nx,  8 * ny)
                + this.e5 * this.noise1(16 * nx, 16 * ny)
                + this.e6 * this.noise1(32 * nx, 32 * ny));
        e /= (this.e1+this.e2+this.e3+this.e4+this.e5+this.e6);
        e = Math.pow(e, this.exp);
        return e;
    }

    calcMoisture(nx:number, ny:number):number {
        var m = (this.m1 * this.noise2( 1 * nx,  1 * ny)
                + this.m2 * this.noise2( 2 * nx,  2 * ny)
                + this.m3 * this.noise2( 4 * nx,  4 * ny)
                + this.m4 * this.noise2( 8 * nx,  8 * ny)
                + this.m5 * this.noise2(16 * nx, 16 * ny)
                + this.m6 * this.noise2(32 * nx, 32 * ny));
        m /= (this.m1+this.m2+this.m3+this.m4+this.m5+this.m6);
        return m;
    }

    dualbiome(e, m):number {      
        if (e < 0.1) return 0x6188cc; //OCEAN
        if (e < 0.12) return 0xc4c191; //BEACH
  
        if (e > 0.8) {
            if (m < 0.1) return 0xbca793;//SCORCHED;
            if (m < 0.2) return 0xc4b4a4;//BARE;
            if (m < 0.5) return 0xccc0b5;//TUNDRA;
            return 0xede7e1;//SNOW;
        }

        if (e > 0.6) {
            if (m < 0.33) return 0xe8ae74;//TEMPERATE_DESERT;
            if (m < 0.66) return 0xd4d89e;//SHRUBLAND;
            return 0x9abc8d;//TAIGA;
        }

        if (e > 0.3) {
            if (m < 0.16) return 0xe2ca95;//TEMPERATE_DESERT;
            if (m < 0.50) return 0x9aba80;//GRASSLAND;
            if (m < 0.83) return 0x7bb24e;//TEMPERATE_DECIDUOUS_FOREST;
            return 0x5c9b28;//TEMPERATE_RAIN_FOREST;
        }

        if (m < 0.16) return 0xccd196;//SUBTROPICAL_DESERT;
        if (m < 0.33) return 0x9aba80;//GRASSLAND;
        if (m < 0.66) return 0x559322;//TROPICAL_SEASONAL_FOREST;
        return 0x427f10;//TROPICAL_RAIN_FOREST;
    }
}