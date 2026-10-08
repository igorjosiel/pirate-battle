import { Container, Graphics } from "pixi.js";

export class Chaser extends Container {
    private speed = 60;
    private healthBar!: Graphics;
    private maxHealth = 50;
    private health = 50;
    private ship!: Graphics;

    constructor(x: number, y: number) {
        super();

        this.position.set(x, y);

        this.createShip();
        this.createHealthBar();
    }

    private createHealthBar() {
        this.healthBar = new Graphics();

        this.addChild(this.healthBar);

        this.updateHealthBar();
    }

    private updateHealthBar() {
        const width = 40;
        const height = 5;

        const healthPercent = this.health / this.maxHealth;

        this.healthBar.clear();

        this.healthBar.rect(
            -width / 2,
            -35,
            width,
            height
        );

        this.healthBar.fill("#333333");

        this.healthBar.rect(
            -width / 2,
            -35,
            width * healthPercent,
            height
        );

        this.healthBar.fill("#2ecc71");
    }

    private createShip() {
        this.ship = new Graphics();

        this.ship.moveTo(0, -25);
        this.ship.lineTo(18, 25);
        this.ship.lineTo(0, 15);
        this.ship.lineTo(-18, 25);
        this.ship.closePath();

        this.ship.fill("#d94f4f");

        this.addChild(this.ship);
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

        if (this.health < 0) {
            this.health = 0;
        }

        this.updateHealthBar();

        let flashes = 0;

        const interval = setInterval(() => {
            this.ship.tint = this.ship.tint === 0xffffff
                ? 0xff0000
                : 0xffffff;

            flashes++;

            if (flashes >= 4) {
                clearInterval(interval);
                this.ship.tint = 0xff0000;
            }
        }, 50);

        return this.health <= 0;
    }

    isDead() {
        return this.health <= 0;
    }
}
