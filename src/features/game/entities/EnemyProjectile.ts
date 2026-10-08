import { Graphics } from "pixi.js";

export class EnemyProjectile extends Graphics {
    private speed = 250;
    private directionX: number;
    private directionY: number;

    constructor(x: number, y: number, rotation: number) {
        super();

        this.circle(0, 0, 5);
        this.fill("#ff6b6b");

        this.position.set(x, y);

        this.directionX = Math.sin(rotation);
        this.directionY = -Math.cos(rotation);
    }

    update(deltaTime: number) {
        this.x += this.directionX * this.speed * deltaTime;
        this.y += this.directionY * this.speed * deltaTime;
    }
}
