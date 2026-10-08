import { Graphics } from "pixi.js";

export class Projectile extends Graphics {
    private speed = 200;
    private directionX: number;
    private directionY: number;

    constructor(x: number, y: number, rotation: number) {
        super();

        this.circle(0, 0, 5);
        this.fill("#f5d547");

        this.position.set(x, y);

        this.directionX = Math.sin(rotation);
        this.directionY = -Math.cos(rotation);
    }

    update(deltaTime: number) {
        this.x += this.directionX * this.speed * deltaTime;
        this.y += this.directionY * this.speed * deltaTime;
    }
}
