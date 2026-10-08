import { Container, Graphics } from "pixi.js";

export class Shooter extends Container {
    private speed = 30;
    private health = 50;
    private shootCooldown = 0;
    private shootRate = 1.5;
    private shootRange = 100;

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

        ship.fill("#f0a202");

        this.addChild(ship);
    }

    update(
        deltaTime: number,
        targetX: number,
        targetY: number
    ) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;

        const distance = Math.hypot(dx, dy);

        if (distance > this.shootRange) {
            const directionX = dx / distance;
            const directionY = dy / distance;

            this.x += directionX * this.speed * deltaTime;
            this.y += directionY * this.speed * deltaTime;
        }

        if (distance > 0) {
            this.rotation = Math.atan2(
                dx,
                -dy
            );
        }

        this.shootCooldown -= deltaTime;
    }

    canShoot() {
        return this.shootCooldown <= 0;
    }

    resetShootCooldown() {
        this.shootCooldown = this.shootRate;
    }

    takeDamage(amount: number) {
        this.health -= amount;

        return this.health <= 0;
    }
}
