import * as http from './Http'
import {IRenderer, IRenderable} from '../Graphics/IRenderer'
import {Grid2d} from './Grid/Grid2d'
import SpriteSheet from '../Graphics/SpriteSheet'
import ResourceManager from './ResourceManager'
import * as PIXI from 'pixi.js'

export class TiledMap implements IRenderable {
    tileMap:Tilemap;
    tileSheet:SpriteSheet;
    private setCollisionsRequested:boolean = false;
    private grid:Grid2d;
    private sprites:PIXI.Container;
    public graphic:PIXI.DisplayObject;
    public zIndex:number = 0;
    public onLoaded:Function;

    constructor() {
        this.sprites = new PIXI.Container();
        this.graphic = this.sprites;
    }

    load(url:string, resourceManager:ResourceManager, grid?:Grid2d):void {
        http.get(url, (request) => {
            let map = JSON.parse(request.responseText);
            this.tileMap = map;
            let tileSet = this.tileMap.tilesets[0];
            let texture = resourceManager.getTexture(tileSet.image);
            this.tileSheet = new SpriteSheet(texture, tileSet.tilewidth, tileSet.tileheight, tileSet.tilecount);
            this.grid = grid;
            if(this.grid)
                this.setCollisionCells(this.grid);
            this.render();
            if(this.onLoaded) {
                this.onLoaded();
            }
        });
    }

    public setCollisionCells(grid:Grid2d) {
        let cell;
        let mapheighttiles = this.tileMap.height;
        let mapwidthtiles = this.tileMap.width;
        let tileSet = this.tileMap.tilesets[0];
        for(let layer of this.tileMap.layers) {
            for(let y = 0 ; y < mapheighttiles ; y++) {
                for(let x = 0 ; x < mapwidthtiles ; x++) {
                    cell = this.cellid(x, y, layer, mapwidthtiles);
                    cell = cell - tileSet.firstgid;
                    if(tileSet.tileproperties[cell] && tileSet.tileproperties[cell].collidable) {
                        grid.setCollisionCell(x, y);
                    }
                }
            }
        }
    }

    private cellid(tx, ty, layer:TileLayer, mapWidth:number) {
        return layer.data[tx + (ty * mapWidth)]; 
    };

    public render() {
        let x, y, cell;
        let mapheighttiles = this.tileMap.height;
        let mapwidthtiles = this.tileMap.width;
        let tileWidth = this.tileMap.tilewidth;
        let tileHeight = this.tileMap.tileheight;
        let tileSet = this.tileMap.tilesets[0];

        for(let layer of this.tileMap.layers) {
            for(y = 0 ; y < mapheighttiles ; y++) {
                for(x = 0 ; x < mapwidthtiles ; x++) {
                    cell = this.cellid(x, y, layer, mapwidthtiles);
                    cell = cell - tileSet.firstgid;
                    if (cell) {
                        let sprite = new PIXI.Sprite(this.tileSheet.getFrameTexture(cell));
                        sprite.position.set(x * tileWidth, y * tileHeight);
                        this.sprites.addChild(sprite);
                        // var row = Math.floor(cell / this.tileSheet.framesPerRow);
                        // var col = Math.floor(cell % this.tileSheet.framesPerRow);
                        // renderer.render(this.tileSheet.image, col * this.tileSheet.frameWidth, row * this.tileSheet.frameHeight,
                        //     this.tileSheet.frameWidth, this.tileSheet.frameHeight,
                        //     x * tileWidth, y * tileHeight,
                        //     this.tileSheet.frameWidth, this.tileSheet.frameHeight);
                        
                        //renderer.outline(x * 32, y * 32, 32, 32, "darkgreen");
                        /*
                        renderer.render(this.tileSheet.image, x * tileWidth, y * tileHeight, tileWidth, tileHeight, )
                        this.tileSheet.image
                        ctx.fillStyle = cell == 101 ? "green" : "black";
                        ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
                        */
                    }
                }
            }
        }
    }
}

export class Tilemap {
    version:string;
    height:number;
    width:number;
    tilewidth: number;
    tileheight: number;
    properties: any;
    layers: TileLayer[];
    tilesets: TileSet[];
    nextobjectid:number;
    orientation:string;
    renderorder:string;
}

export class TileLayer {
    name:string;    
    data:number[];
    height:number;
    width:number;
    type:string;
    visible:boolean;
    x:number;
    y:number;
    opacity:number;
}

export class TileSet {
    columns:number;
    firstgid:number;
    image:string;
    imageheight:number;
    imagewidth:number;
    margin:number;
    name:string;
    spacing:number;
    tilecount:number;
    tileheight:number;
    tilewidth:number;
    tileproperties:any;
    tilepropertytypes:any;
}