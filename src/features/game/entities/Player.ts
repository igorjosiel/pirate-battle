import { Container, Graphics } from "pixi.js";
import { InputManager } from "../input/InputManager";

export class Player extends Container {
    private speed = 60;
    private rotationSpeed = 10;
    private health = 100;
    private input: InputManager;
    private isDead = false;

    constructor(input: InputManager) {
        super();

        this.input = input;

        this.createShip();
    }

    private createShip() {
        const ship = new Graphics();

        ship.moveTo(0, -30);
        ship.lineTo(20, 30);
        ship.lineTo(0, 20);
        ship.lineTo(-20, 30);
        ship.closePath();
        ship.fill("#8b7355");

        this.addChild(ship);
    }

    reset() {
        this.health = 100;
        this.isDead = false;
        this.position.set(400, 300);
        this.rotation = 0;
    }

    update(deltaTime: number, width: number, height: number) {
        if (this.isDead) {
            return;
        }

        if (this.input.isPressed("a")) {
            this.rotation -= this.rotationSpeed * deltaTime;
        }

        if (this.input.isPressed("d")) {
            this.rotation += this.rotationSpeed * deltaTime;
        }

        const directionX = Math.sin(this.rotation);
        const directionY = -Math.cos(this.rotation);

        if (this.input.isPressed("w")) {
            this.x += directionX * this.speed * deltaTime;
            this.y += directionY * this.speed * deltaTime;
        }

        if (this.input.isPressed("s")) {
            this.x -= directionX * this.speed * deltaTime;
            this.y -= directionY * this.speed * deltaTime;
        }

        this.checkBounds(width, height);
    }

    private checkBounds(width: number, height: number) {
        const margin = 30;

        this.x = Math.max(
            margin,
            Math.min(width - margin, this.x)
        );

        this.y = Math.max(
            margin,
            Math.min(height - margin, this.y)
        );
    }

    takeDamage(amount: number) {
        if (this.isDead) {
            return;
        }

        this.health -= amount;

        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
        }
    }

    getDead() {
        return this.isDead;
    }

    getHealth() {
        return this.health;
    }
}
