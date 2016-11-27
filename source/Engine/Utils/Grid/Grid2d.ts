import {IRenderer} from '../../Graphics/IRenderer'
import Point from '../../Core/Point'
import {Rectangle} from '../../Core/Rectangle'
import * as PIXI from 'pixi.js'

export class Grid2d {
	grid:number[][];
	private _width:number;
	private _height:number;
	collided:any;
    collidingWith:any[] = [];
    private collisionRect:Rectangle = new Rectangle();
	private gridCellRect:Rectangle;

	get width():number {
		return this._width;
	}

	get height():number {
		return this._height;
	}

	constructor(width:number, height:number, public cellWidth:number, public cellHeight:number) {
		this._width = width;
		this._height = height;
		this.gridCellRect = new Rectangle(0,0, cellWidth, cellHeight);

		/*
		this.grid = Array(width * height);
		for(let y = 0; y < this.height; y++) {
			for(let x = 0; x < this.width; x++) {
				let i = x + this.width*y;
				this.grid[i] = i;
			}
		}	
		*/
		// x = i % width;    // % is the "modulo operator", the remainder of i / width;
		// y = i / width;    // where "/" is an integer division

		this.grid = [[]];
		for(let x = 0; x < this.width; x++) {
			this.grid[x] = [height];
			for(let y = 0; y < this.height; y++) {
				this.grid[x][y] = 1;
			}
		}
	}

	addCollisionCells(cells:Point[]):void {
		for(let p of cells) {
			this.setCollisionCell(p.x, p.y);
		}
	}

	setCollisionCell(x:number, y:number):void {
		this.grid[x][y] = 0;
	}

	isCollidable(x:number, y:number):boolean {
		return this.grid[x][y] === 0;
	}

	forEach(itemFunc:Function, eachRowFunc?:Function) {
		for(let x = 0; x < this.width; x++) {
			if(eachRowFunc)
				eachRowFunc(x);
			for(let y = 0; y < this.height; y++) {
				itemFunc(this.grid[x][y], x, y);
			}
		}
	}

    collides(x:number, y:number, width:number, height:number):boolean {
        let left_tile = Math.floor(x / this.cellWidth);
        let right_tile = Math.ceil((x + width) / this.cellWidth);
        let top_tile = Math.floor(y / this.cellHeight);
        let bottom_tile = Math.ceil((y + height ) / this.cellHeight);

        if(left_tile < 0) left_tile = 0;
        if(right_tile >= this.width) right_tile = this.width;
        if(top_tile < 0) top_tile = 0;
        if(bottom_tile >= this.height) bottom_tile = this.height;
        
        this.collisionRect.x = x;
		this.collisionRect.y = y;
		this.collisionRect.width = width;
		this.collisionRect.height = height;

        //this.collidingWith.length = 0;
        for(let i=left_tile; i<right_tile; i++) {  
            for(let j=top_tile; j<bottom_tile; j++) {
                this.gridCellRect.x = i * this.cellWidth;
				this.gridCellRect.y = j * this.cellHeight;
                if(this.isCollidable(i, j) && this.collisionRect.intersects(this.gridCellRect)) {
                    //this.collided = { left:tileRect.left, right: tileRect.right, top: tileRect.top, bottom: tileRect.bottom };
                    return true;
                }
            }
        }

        return false;
    }
}

export class GridDebugRenderer {
	public drawBorder:boolean;

	setup(factory:any, grid:Grid2d) {
		let c = true;
		grid.forEach((item:number, x, y) => {
			let color = c ? 0x000000 : 0xe0e0e0;
			let graphics = new PIXI.Graphics();
			
			if(grid.isCollidable(x, y)) {
				graphics.lineStyle(1, 0xff0000, 1);
				graphics.drawRect(x * grid.cellWidth, y * grid.cellHeight, grid.cellWidth, grid.cellHeight);
			} else {
				graphics.lineStyle(1, 0x000000, 1);
				graphics.drawRect(x * grid.cellWidth, y * grid.cellHeight, grid.cellWidth, grid.cellHeight);
			}
			
			factory.addDisplayObject(graphics);
			c = !c;
		}, () => {
			c = !c;
		});
	}

	private borderColor(x:number, y:number, grid:Grid2d) {
		return this.drawBorder && (x == 0 || y == 0 || x == grid.width - 1 || y == grid.height - 1);
	}
}


/*
function rgbToHex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

var gridsize = { x: 7, y: 8 };

var grid = {
	create: function() {
		this.brickId = 0;
		this.loadBrickTypes();
		this.board = new Array(gridsize.y);
		for (var i = 0; i < gridsize.y; i++) {
			this.board[i] = new Array(gridsize.x);
		}
		
		this.randomizeGrid();
		return this;
	},
	
	randomizeGrid: function() {
		for(var y = 0; y < gridsize.y; y++) {
			for(var x = 0; x < gridsize.x; x++) {
				this.board[y][x] = this.createBrick(y, x);
			}
		}
		
		var chains = this.findChains();
		while(chains != 0) {
			this.destroyBricks(chains);
			this.fillHoles();
			chains = this.findChains();
		}
	},
	
	fillHoles: function() {
		for(var y = 0; y < gridsize.y; y++) {
			for(var x = 0; x < gridsize.x; x++) {
				if(this.board[y][x] == null)
					this.board[y][x] = this.createBrick(y, x);
			}
		}
	},
	
	createBrick: function(y, x) {
		var brickType = this.brickTypes[game.rnd.integerInRange(0, this.brickTypes.length - 1)];
		
		// if(y == gridsize.y - 1) {
		// 	return { 
		// 		id: 5,
		// 		color: "0xff0000",
		// 		uid: this.uid(y, x)
		// 	};
		// } else 
			return { 
				id: brickType.id,
				color: brickType.color,
				uid: this.uid(y, x)
			};
	},
	
	destroyBricks: function(chains) {
		for(var i = 0; i < chains.length; i++) {
			var chain = chains[i];
			for(var j = 0; j < chain.length; j++) { 
				var brick = chain[j]; 
				this.board[brick.y][brick.x] = null;
			}
		}
	},
	
	uid: function(y, x) {
		this.brickId++;
		return this.brickId;
	},
	
	getBoard: function() {
		return this.board;
	},
	
	swap: function(pos1, pos2) {
		this.swapPositions(pos1.x, pos1.y, pos2.x, pos2.y);
	},
	
	swapPositions: function(x1, y1, x2, y2) {
		var b = this.board[y1][x1];
		this.board[y1][x1] = this.board[y2][x2];
		this.board[y2][x2] = b;
	},
	
	// Move all bricks down until all null bricks are on top
	moveDown: function() {
		for(var x = 0; x < gridsize.x; x++) {
			for(var y = gridsize.y - 1; y > 0; y--) {
				if(this.board[y][x] == null) {
					var n = this.nextY(y - 1, x);
					if(n >= 0) {
						this.board[y][x] = this.board[n][x];
						this.board[n][x] = null;
					}
				}
			}
		}
	},
	
	// Find the next not null tile by searching upwards
	nextY: function(y, x) {
		for(var i = y; i >= 0; i--) {
			if(this.board[i][x] != null) {
				return i;
			}
		}
		return -1;
	},
	
	isAdjacent: function(brickStart, brick) {
		if(brick.y == brickStart.y && (brick.x == brickStart.x + 1 || brick.x == brickStart.x - 1))
			return true;
		if(brick.x == brickStart.x && (brick.y == brickStart.y + 1 || brick.y == brickStart.y - 1))
			return true;
		return false;
	},
	
	hasChainAtColumn: function(x, y) {
		var cId = this.board[y][x].id;
		var length = 1;
		
		for(var i = x - 1; i >= 0 && this.board[y][i].id == cId; i--, length++);
		for(var i = x + 1; i < gridsize.x && this.board[y][i].id == cId; i++, length++);
		if(length >= 3)
			return true;
		
		length = 1;
		for(var i = y - 1; i >= 0 && this.board[i][x].id == cId; i--, length++);
		for(var i = y + 1; i < gridsize.y && this.board[i][x].id == cId; i++, length++);
		
		return length >= 3;
	},
	
	
	findChains: function() {
		var result = [];
		
		// find horizontal chains
		for (var y = 0; y < gridsize.y; y++) {
			for (var x = 0; x < gridsize.x - 2; ) {
				var matchType = this.board[y][x].id;
				
				if(this.board[y][x + 1].id == matchType && this.board[y][x + 2].id == matchType) {
					var chain = [];
					do {
						chain.push({x: x, y: y });
						x += 1;
					} while(x < gridsize.x && this.board[y][x].id == matchType);
					
					result.push(chain);
					continue;
				}
				
				x+=1;
			}
		}
		
		// find vertical chains
		for (var column = 0; column < gridsize.x; column++) {
			for (var row = 0; row < gridsize.y - 2; ) {
				var matchType = this.board[row][column].id;
				
				if(this.board[row + 1][column].id == matchType && this.board[row + 2][column].id == matchType) {
					var chain = [];
					do {
						chain.push({x: column, y: row });
						row += 1;
					} while(row < gridsize.y && this.board[row][column].id == matchType);
					
					result.push(chain);
					continue;
				}
				
				row += 1;
			}
		}
		
		return result;
	},
	
	findPossibleSwaps: function() {
		var possibleSwaps = [];
		for (var row = 0; row < gridsize.y; row++) {
			for (var column = 0; column < gridsize.x; column++) {
				
				if(column < gridsize.x - 1) {
					this.swapPositions(column, row, column + 1, row);
					if(this.hasChainAtColumn(column, row) || this.hasChainAtColumn(column + 1, row)) {
						possibleSwaps.push({x1: column, y1: row, x2: column + 1, y2: row});
					}
					this.swapPositions(column, row, column + 1, row);
				}
				
				if(row < gridsize.y - 1) {
					this.swapPositions(column, row, column, row + 1);
					if(this.hasChainAtColumn(column, row) || this.hasChainAtColumn(column, row + 1)) {
						possibleSwaps.push({x1: column, y1: row, x2: column, y2: row + 1});
					}
					this.swapPositions(column, row, column, row + 1);
				}
			}
		}
		return possibleSwaps;
	},
	
	loadBrickTypes: function() {
		this.brickTypes = [];
		this.brickTypes.push({  
			id: 0,
			color: rgbToHex(223,213,196)
		});
		this.brickTypes.push({  
			id: 1,
			color: rgbToHex(159,188,196)
		});
		this.brickTypes.push({  
			id: 2,
			color: rgbToHex(109,138,144)
		});
		this.brickTypes.push({  
			id: 3,
			color: rgbToHex(238,199,179)
		});
		this.brickTypes.push({  
			id: 4,
			color: rgbToHex(221,118,99)
		});
	}
};
*/