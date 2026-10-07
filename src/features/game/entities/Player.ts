import { Container, Graphics } from "pixi.js";
import { InputManager } from "../input/InputManager";

export class Player extends Container {
    private speed = 200;
    private rotationSpeed = 2;
    private input: InputManager;

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

    update(deltaTime: number) {
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
    }
}
