import Component from '../Component'
import * as math from  '../../Core/Math'
import {Grid2d} from '../../Utils/Grid/Grid2d'
import Input from '../../Input/InputManager'

export default class InputComponent extends Component {
    xVelocity:number = 0;
    yVelocity:number = 0;
    private grid:Grid2d;

    constructor(public speed:number, grid?:Grid2d) {
        super();

        if(grid)
            this.grid = grid;
    }

    public addGrid(grid:Grid2d) {
        this.grid = grid;
    }

    update(dt) {
        if (Input.keyDown(Input.Keys.up)) {
             this.yVelocity = -this.speed * dt;
        }
        if (Input.keyDown(Input.Keys.down)) {
            this.yVelocity = this.speed * dt;
        }
        if (Input.keyDown(Input.Keys.left)) {
            this.xVelocity = -this.speed * dt;
        }
        if (Input.keyDown(Input.Keys.right)) {
            this.xVelocity = this.speed * dt;
        }

        if(this.grid && (this.xVelocity !== 0 || this.yVelocity !== 0))
            this.tryMove(this.xVelocity, this.yVelocity);
        else {
            this.entity.x += this.xVelocity;
            this.entity.y += this.yVelocity; 
        }

        this.xVelocity = this.yVelocity = 0;
    }

    cx:number = 0;
    cy:number = 0;
    tryMove(vx:number, vy:number) {
        // accumulate sub pixel movements
        this.cx += vx;
        this.cy += vy;
        let vxNew = Math.round(this.cx);
        let vyNew = Math.round(this.cy);
        this.cx -= vxNew;
        this.cy -= vyNew;

        let playerWidth = 32;
        let playerHeight = 32;

        for(var y = 1; y <= Math.abs(vyNew); y++) {
            let increment = math.sign(vyNew);
            if(!this.grid.collides(this.entity.x, this.entity.y + increment, playerWidth, playerHeight)) {
                this.entity.y += increment;
            } else {
                this.yVelocity = 0;
                break;
            }
        }

        for(var x = 1; x <= Math.abs(vxNew); x++) {
            let increment = math.sign(vxNew);
            if(!this.grid.collides(this.entity.x + increment, this.entity.y, playerWidth, playerHeight)) {
                this.entity.x += increment;
            } else {
                this.xVelocity = 0;
                break;
            }
        }
    }
}