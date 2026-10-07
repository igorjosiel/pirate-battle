import { Container, Graphics } from "pixi.js";

export class Chaser extends Container {
    private speed = 1;
    private health = 50;

    constructor(x: number, y: number) {
        super();

        this.position.set(x, y);

        this.createShip();
    }

    private createShip() {
        const ship = new Graphics();

        ship.moveTo(0, -25);
        ship.lineTo(18, 25);
        ship.lineTo(0, 15);
        ship.lineTo(-18, 25);
        ship.closePath();

        ship.fill("#d94f4f");

        this.addChild(ship);
    }

    update(deltaTime: number, targetX: number, targetY: number) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;

        const distance = Math.hypot(dx, dy);

        if (distance < 40) {
            return;
        }

        const directionX = dx / distance;
        const directionY = dy / distance;

        this.x += directionX * this.speed * deltaTime;
        this.y += directionY * this.speed * deltaTime;

        this.rotation = Math.atan2(
            directionX,
            -directionY
        );
    }

    takeDamage(amount: number) {
        this.health -= amount;
    }

    isDead() {
        return this.health <= 0;
    }
}
