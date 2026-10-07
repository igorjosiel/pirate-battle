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
        this.player.update(deltaTime, width, height);
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
        island.fill("#8b7355");

        this.addChild(island);
    }
}
