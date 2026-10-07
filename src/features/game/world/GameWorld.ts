import { Container, Graphics } from "pixi.js";
import { Player } from "../entities/Player";
import { InputManager } from "../input/InputManager";

export class GameWorld extends Container {
    private player: Player;

    constructor(input: InputManager) {
        super();

        this.createArena();
        this.createIsland();

        this.player = new Player(input);
        this.player.position.set(400, 300);

        this.addChild(this.player);
    }

    update(deltaTime: number, width: number, height: number) {
        const previousX = this.player.x;
        const previousY = this.player.y;

        this.player.update(deltaTime, width, height);

        if (this.checkIslandCollision()) {
            this.player.x = previousX;
            this.player.y = previousY;
        }
    }

    createArena() {
        const water = new Graphics();

        // posição X, posição Y, largura, altura
        water.rect(0, 0, 1200, 800);
        water.fill("#1b4965");

        this.addChild(water);
    }

    createIsland() {
        const island = new Graphics();

        island.circle(600, 400, 100);
        island.fill("#4a90e2");

        this.addChild(island);
    }

    private checkIslandCollision() {
        const islandX = 600;
        const islandY = 400;
        const islandRadius = 100;
        const playerRadius = 40;

        const dx = this.player.x - islandX;
        const dy = this.player.y - islandY;

        const distance = Math.hypot(dx, dy);

        return distance < islandRadius + playerRadius;
    }
}
