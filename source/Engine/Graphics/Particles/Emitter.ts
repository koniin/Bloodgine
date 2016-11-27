import {IRenderable, IRenderer} from '../IRenderer'
import * as PIXI from 'pixi.js'

class Particle {
    x:number;
    y:number;
    vx:number;
    vy:number;
    life:number;
    color:number[] | undefined;
    deltaColor:number[] | undefined;
    radius:number;
	sprite:PIXI.Sprite;

    constructor() {
		this.x = 0;
        this.y = 0;
        this.setVelocity(0, 0);
		this.life = 0;
        this.radius = 0;
	};

	setPosition(x:number, y:number) {
		this.sprite.position.set(x, y);
		this.x = x;
		this.y = y;
	}

	setVelocity(angle, speed) {
		this.vx = Math.cos(toRad(angle)) * speed;
		this.vy = -Math.sin(toRad(angle)) * speed;
	}
}

export interface IParticleConfig {
	texture:PIXI.Texture;
    totalParticles:number;
    emissionRate:number;
    speed:number;
    speedVar:number;
    life:number;
    lifeVar:number;
    duration:number;
    angle:number;
    angleVar:number;
    posVarX:number;
    posVarY:number;
    radius:number;
    radiusVar:number;
    startColor?:number[] | undefined;
	startColorVar?:number[] | undefined;
	endColor?:number[] | undefined;
	endColorVar?:number[] | undefined;
}

function toRad(deg) {
	return Math.PI * deg / 180;
}

function random(min, max) {
	var range = max - min;
	var result = Math.random() * range + min;
	return result;
}

function random11() {
    return random(-1, 1);
}

function colorArrayToString(array) {
	var r = array[0] | 0;
	var g = array[1] | 0;
	var b = array[2] | 0;
	var a = array[3];
	return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}

export class Emitter implements IRenderable {
	public zIndex:number = 0;
	public get graphic():PIXI.DisplayObject {
		return this._particleContainer;
	}
    private _particlePool:Particle[];
	private _particleContainer:PIXI.particles.ParticleContainer;
    totalParticles:number;
    private _particleCount:number;
    private _particleIndex:number;
	private _elapsed:number;
	private _emitCounter:number;
	private _texture:PIXI.Texture;
    posVarX:number;
    posVarY:number;
    speed:number;
    speedVar:number;
    angle:number;
    angleVar:number;
    life:number;
    lifeVar:number;
    duration:number = 0;
    active:boolean = true;
    emissionRate:number;
    radius:number;
    radiusVar:number;
    startColor:number[] | undefined;
	startColorVar:number[] | undefined;
	endColor:number[] | undefined;
	endColorVar:number[] | undefined;

    constructor(public x:number, public y:number, config:IParticleConfig) {
		this._particleContainer = new PIXI.particles.ParticleContainer(15000, {
			scale: false,
			position: true,
			rotation:false,
			uvs: false,
			alpha: false
		});
		this._texture = config.texture;
        this.totalParticles = config.totalParticles;
        this.posVarX = config.posVarX;
        this.posVarY = config.posVarY;
        this.restart();
        this.emissionRate = config.emissionRate;
        this.duration = config.duration;
        this.speed = config.speed;
		this.speedVar = config.speedVar;
		this.angle = config.angle;
		this.angleVar = config.angleVar;
		this.life = config.life;
		this.lifeVar = config.lifeVar;
        this.radius = config.radius;
        this.radiusVar = config.radiusVar;
		this.setColors(config);
    }   

	setColors(config:IParticleConfig) {
		if(config.startColor) {
			this.startColor = config.startColor;
			this.startColorVar = config.startColorVar;
			if(config.endColor) {
				this.endColor = config.endColor;
				this.endColorVar = config.endColorVar;
			} else {
				this.endColor = this.startColor;
				this.endColorVar = this.startColorVar;
			}
		} else {
			this.startColor = [255, 0, 0, 1];
			this.startColorVar = [0, 0, 0, 1];
			this.endColor = [255, 0, 0, 1];
			this.endColorVar = [0, 0, 0, 1];
		}
	}

    public render(renderer:IRenderer) {
        if(!this.active)
            return;
        let ctx = renderer.ctx;
   		for(var i = 0; i < this._particleCount; ++i) {    	
            let particle  = this._particlePool[i];
            if(particle.life > 0 && particle.color ) {
                ctx.fillStyle = colorArrayToString(particle.color);
                // draw a circle centered on the particle's location, sized to the particle
                ctx.beginPath();
                //context.arc(particle.x, particle.y, particle.radius, 0, Math.PI*2, true);
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI*2, true);
                ctx.closePath();
                ctx.fill();
            }
    	}
    }

    public restart() {
        this._particlePool = [];
        
    	for(var i = 0; i < this.totalParticles; ++i) {
			let p = new Particle();
			p.sprite = new PIXI.Sprite(this._texture);
    		this._particlePool.push(p);
    	}
        
        this._particleCount = 0;
		this._particleIndex = 0;
		this._elapsed = 0;
		this._emitCounter = 0;
    }

    private isFull() {
		return this._particleCount === this.totalParticles;
	}

    private addParticle() {
	    if (this.isFull()) {
		    return false;
		}

		var p = this._particlePool[this._particleCount];
		this.initParticle(p); 
        ++this._particleCount;
		return true;
    }

	public update(dt:number) {
		this._elapsed += dt;
		this.active = this._elapsed < this.duration;
		if (!this.active) {
			return;
		}

		if (this.emissionRate) {
			// emit new particles based on how much time has passed and the emission rate
			var rate = 1.0 / this.emissionRate;
			this._emitCounter += dt;
			while (!this.isFull() && this._emitCounter > rate) {
				this.addParticle();
				this._emitCounter -= rate;
			}
		}

		this._particleIndex = 0;

		while (this._particleIndex < this._particleCount) {
			var p = this._particlePool[this._particleIndex];
			this.updateParticle(p, dt, this._particleIndex);
		}
	}

    private initParticle(particle:Particle) {
		particle.setPosition(this.x + this.posVarX * random11(), this.y + this.posVarY * random11());
		var angle = this.angle + this.angleVar * random11();
		var speed = this.speed + this.speedVar * random11();

        particle.setVelocity(angle, speed);
        
        var life = this.life + this.lifeVar * random11() || 0;
		particle.life = Math.max(0, life);

		particle.radius = this.radius + (this.radiusVar || 0) * random11();

        // color
		// note that colors are stored as arrays => [r,g,b,a],
		// this makes it easier to tweak the color every frame in _updateParticle
		// The renderer will take this array and turn it into a css rgba string
		if (this.startColor) {
		    var startColor = [
			    this.startColor[0] + this.startColorVar[0] * random11(), 
                this.startColor[1] + this.startColorVar[1] * random11(), 
                this.startColor[2] + this.startColorVar[2] * random11(), 
                this.startColor[3] + this.startColorVar[3] * random11()];

			var endColor = [
				this.endColor[0] + this.endColorVar[0] * random11(), 
                this.endColor[1] + this.endColorVar[1] * random11(), 
                this.endColor[2] + this.endColorVar[2] * random11(), 
                this.endColor[3] + this.endColorVar[3] * random11()];
			
			particle.color = startColor;
			particle.deltaColor = [
                (endColor[0] - startColor[0]) / particle.life, 
                (endColor[1] - startColor[1]) / particle.life, 
                (endColor[2] - startColor[2]) / particle.life, 
                (endColor[3] - startColor[3]) / particle.life];
		}
		
		this._particleContainer.addChild(particle.sprite);
    }
/*
    
			particle.texture = this.texture;
			particle.textureEnabled = this.textureEnabled;
			particle.textureAdditive = this.textureAdditive;

			var posVar = {
				x: this.posVar.x * util.random11(),
				y: this.posVar.y * util.random11()
			};

			if (this.posVarTransformFn) {
				posVar = this.posVarTransformFn(posVar, util);
			}
			particle.pos.x = this.pos.x + posVar.x;
			particle.pos.y = this.pos.y + posVar.y;

			var angle = this.angle + this.angleVar * util.random11();
			var speed = this.speed + this.speedVar * util.random11();

			// it's easier to set speed and angle at this level
			// but once the particle is active and being updated, it's easier
			// to use a vector to indicate speed and angle. So particle.setVelocity
			// converts the angle and speed values to a velocity vector
			particle.setVelocity(angle, speed);

			particle.radialAccel = this.radialAccel + this.radialAccelVar * util.random11() || 0;
			particle.tangentialAccel = this.tangentialAccel + this.tangentialAccelVar * util.random11() || 0;

			var life = this.life + this.lifeVar * util.random11() || 0;
			particle.life = Math.max(0, life);

			particle.scale = util.isNumber(this.startScale) ? this.startScale: 1;
			particle.deltaScale = util.isNumber(this.endScale) ? (this.endScale - this.startScale) : 0;
			particle.deltaScale /= particle.life;

			particle.radius = util.isNumber(this.radius) ? this.radius + (this.radiusVar || 0) * util.random11() : 0;

			// color
			// note that colors are stored as arrays => [r,g,b,a],
			// this makes it easier to tweak the color every frame in _updateParticle
			// The renderer will take this array and turn it into a css rgba string
			if (this.startColor) {
				var startColor = [
				this.startColor[0] + this.startColorVar[0] * util.random11(), this.startColor[1] + this.startColorVar[1] * util.random11(), this.startColor[2] + this.startColorVar[2] * util.random11(), this.startColor[3] + this.startColorVar[3] * util.random11()];

				// if there is no endColor, then the particle will end up staying at startColor the whole time
				var endColor = startColor;
				if (this.endColor) {
					endColor = [
					this.endColor[0] + this.endColorVar[0] * util.random11(), this.endColor[1] + this.endColorVar[1] * util.random11(), this.endColor[2] + this.endColorVar[2] * util.random11(), this.endColor[3] + this.endColorVar[3] * util.random11()];
				}

				particle.color = startColor;
				particle.deltaColor = [(endColor[0] - startColor[0]) / particle.life, (endColor[1] - startColor[1]) / particle.life, (endColor[2] - startColor[2]) / particle.life, (endColor[3] - startColor[3]) / particle.life];
			}
		},

		//  *
		//  * Updates a particle based on how much time has passed in delta
		//  * Moves the particle using its velocity and all forces acting on it (gravity,
		//  * radial and tangential acceleration), and updates all the properties of the
		//  * particle like its size, color, etc
		//  *
        */
		private updateParticle(p:Particle, delta:number, i:number) {
            if (p.life > 0) {
				p.life -= delta;
                p.x += p.vx * delta;
				p.y += p.vy * delta;
				p.setPosition(p.x, p.y);

                if (p.color) {
					p.color[0] += p.deltaColor[0] * delta;
					p.color[1] += p.deltaColor[1] * delta;
					p.color[2] += p.deltaColor[2] * delta;
					p.color[3] += p.deltaColor[3] * delta;
				}

				++this._particleIndex;
            } else {
                // the particle has died, time to return it to the particle pool
				// take the particle at the current index
				var temp = this._particlePool[i];

				// and move it to the end of the active particles, keeping all alive particles pushed
				// up to the front of the pool
				this._particlePool[i] = this._particlePool[this._particleCount - 1];
				this._particlePool[this._particleCount - 1] = temp;

				this._particleContainer.removeChild(temp.sprite);
				// decrease the count to indicate that one less particle in the pool is active.
				--this._particleCount;
            }
        }
            /*
			if (p.life > 0) {

				// these vectors are stored on the particle so we can reuse them, avoids
				// generating lots of unnecessary objects each frame
				p.forces = p.forces || {
					x: 0,
					y: 0
				};
				p.forces.x = 0;
				p.forces.y = 0;

				p.radial = p.radial || {
					x: 0,
					y: 0
				};
				p.radial.x = 0;
				p.radial.y = 0;

				// dont apply radial forces until moved away from the emitter
				if ((p.pos.x !== this.pos.x || p.pos.y !== this.pos.y) && (p.radialAccel || p.tangentialAccel)) {
					p.radial.x = p.pos.x - this.pos.x;
					p.radial.y = p.pos.y - this.pos.y;

					normalize(p.radial);
				}

				p.tangential = p.tangential || {
					x: 0,
					y: 0
				};
				p.tangential.x = p.radial.x;
				p.tangential.y = p.radial.y;

				p.radial.x *= p.radialAccel;
				p.radial.y *= p.radialAccel;

				var newy = p.tangential.x;
				p.tangential.x = - p.tangential.y;
				p.tangential.y = newy;

				p.tangential.x *= p.tangentialAccel;
				p.tangential.y *= p.tangentialAccel;

				p.forces.x = p.radial.x + p.tangential.x + this.gravity.x;
				p.forces.y = p.radial.y + p.tangential.y + this.gravity.y;

				p.forces.x *= delta;
				p.forces.y *= delta;

				p.vel.x += p.forces.x;
				p.vel.y += p.forces.y;

				p.pos.x += p.vel.x * delta;
				p.pos.y += p.vel.y * delta;

				p.life -= delta;

				p.scale += p.deltaScale * delta;

				if (p.color) {
					p.color[0] += p.deltaColor[0] * delta;
					p.color[1] += p.deltaColor[1] * delta;
					p.color[2] += p.deltaColor[2] * delta;
					p.color[3] += p.deltaColor[3] * delta;
				}

				++this._particleIndex;
			} else {
				// the particle has died, time to return it to the particle pool
				// take the particle at the current index
				var temp = this._particlePool[i];

				// and move it to the end of the active particles, keeping all alive particles pushed
				// up to the front of the pool
				this._particlePool[i] = this._particlePool[this._particleCount - 1];
				this._particlePool[this._particleCount - 1] = temp;

				// decrease the count to indicate that one less particle in the pool is active.
				--this._particleCount;
			}
		}*/
}