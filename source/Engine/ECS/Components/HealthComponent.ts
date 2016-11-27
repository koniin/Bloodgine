import Component from '../Component'

export default class HealthComponent extends Component  {
    public startHealth:number;
    constructor(public health:number) {
        super();

        this.startHealth = health;
    }
    
    public isAlive():boolean {
        return this.health > 0;
    }

    public isDead():boolean {
        return this.health <= 0;
    }

    public takeDamage(amount:number):void {
        this.health -= amount;
        if(this.health < 0)
            this.health = 0;
    }

    public heal(amount:number):void {
        this.health += amount;
    }

    public healthPercentageRemaining():number {
        return this.health / this.startHealth;
    }
}