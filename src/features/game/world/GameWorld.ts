import { Container, Graphics, Text } from "pixi.js";
import { Player } from "../entities/Player";
import { InputManager } from "../input/InputManager";
import { Projectile } from "../entities/Projectile";
import { Chaser } from "../entities/Chaser";

export class GameWorld extends Container {
    private player: Player;
    private input: InputManager;
    private chaser: Chaser;
    private chaserActive = true;
    private score = 0;
    private remainingTime = 60;

    private projectiles: Projectile[] = [];

    private fireCooldown = 0;
    private fireRate = 0.25;

    // definite assignment assertion (!)
    private healthText!: Text;
    private scoreText!: Text;
    private timeText!: Text;

    private gameOver = false;

    constructor(input: InputManager) {
        super();

        this.input = input;

        this.createArena();
        this.createIsland();

        this.player = new Player(input);
        this.chaser = new Chaser(900, 300);

        this.player.position.set(400, 300);

        this.addChild(this.player);
        this.addChild(this.chaser);
        this.createHud();
    }

    private createHud() {
        this.healthText = new Text({
            text: "Vida: 100",
            style: {
                fill: "#ffffff",
                fontSize: 24,
            },
        });

        this.scoreText = new Text({
            text: "Pontos: 0",
            style: {
                fill: "#ffffff",
                fontSize: 24,
            },
        });

        this.timeText = new Text({
            text: "Tempo: 60",
            style: {
                fill: "#ffffff",
                fontSize: 24,
            },
        });

        this.healthText.position.set(20, 20);
        this.scoreText.position.set(20, 50);
        this.timeText.position.set(20, 80);

        this.addChild(this.healthText);
        this.addChild(this.scoreText);
        this.addChild(this.timeText);
    }

    update(deltaTime: number, width: number, height: number) {
        if (this.gameOver) {
            return;
        }

        const previousX = this.player.x;
        const previousY = this.player.y;

        this.player.update(deltaTime, width, height);

        if (this.player.getDead()) {
            this.gameOver = true;

            return;
        }

        this.remainingTime -= deltaTime;

        if (this.remainingTime <= 0) {
            this.remainingTime = 0;
            this.gameOver = true;

            return;
        }

        if (this.checkIslandCollision()) {
            this.player.x = previousX;
            this.player.y = previousY;
        }

        if (this.chaserActive) {
            this.chaser.update(
                deltaTime,
                this.player.x,
                this.player.y
            );

            if (this.checkChaserCollision()) {
                this.player.takeDamage(25);
                this.destroyChaser();
                this.chaserActive = false;
            }
        }

        this.healthText.text = `Vida: ${this.player.getHealth()}`;
        this.scoreText.text = `Pontos: ${this.score}`;
        this.timeText.text = `Tempo: ${Math.ceil(this.remainingTime)}`;

        this.updateShooting(deltaTime);
        this.updateProjectiles(deltaTime, width, height);
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

    private updateShooting(deltaTime: number) {
        this.fireCooldown -= deltaTime;

        if (
            this.input.isPressed(" ") &&
            this.fireCooldown <= 0
        ) {
            const projectile = new Projectile(
                this.player.x,
                this.player.y,
                this.player.rotation
            );

            this.projectiles.push(projectile);
            this.addChild(projectile);

            this.fireCooldown = this.fireRate;
        }

        if (
            this.input.isPressed("q") &&
            this.fireCooldown <= 0
        ) {
            const sideRotation = this.player.rotation - Math.PI / 2;

            for (let i = -1; i <= 1; i++) {
                const offset = i * 15;

                const projectile = new Projectile(
                    this.player.x,
                    this.player.y + offset,
                    sideRotation
                );

                this.projectiles.push(projectile);
                this.addChild(projectile);
            }

            this.fireCooldown = this.fireRate;
        }

        if (
            this.input.isPressed("e") &&
            this.fireCooldown <= 0
        ) {
            const sideRotation = this.player.rotation + Math.PI / 2;

            for (let i = -1; i <= 1; i++) {
                const offset = i * 15;

                const projectile = new Projectile(
                    this.player.x,
                    this.player.y + offset,
                    sideRotation
                );

                this.projectiles.push(projectile);
                this.addChild(projectile);
            }

            this.fireCooldown = this.fireRate;
        }
    }

    private updateProjectiles(
        deltaTime: number,
        width: number,
        height: number
    ) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];

            projectile.update(deltaTime);

            if (
                this.chaserActive &&
                this.checkProjectileChaserCollision(projectile)
            ) {
                this.chaser.takeDamage(25);
                const killed = this.chaser.isDead();

                this.removeChild(projectile);
                this.projectiles.splice(i, 1);

                if (killed) {
                    this.removeChild(this.chaser);
                    this.chaserActive = false;

                    this.addScore();
                }

                continue;
            }

            const outside =
                projectile.x < 0 ||
                projectile.x > width ||
                projectile.y < 0 ||
                projectile.y > height;

            const hitIsland = this.checkProjectileIslandCollision(projectile);

            if (outside || hitIsland) {
                this.removeChild(projectile);
                this.projectiles.splice(i, 1);
            }
        }
    }

    private checkProjectileIslandCollision(projectile: Projectile) {
        const islandX = 600;
        const islandY = 400;
        const islandRadius = 100;
        const projectileRadius = 5;

        const dx = projectile.x - islandX;
        const dy = projectile.y - islandY;

        const distance = Math.hypot(dx, dy);

        return distance < islandRadius + projectileRadius;
    }

    private checkChaserCollision() {
        const dx = this.player.x - this.chaser.x;
        const dy = this.player.y - this.chaser.y;

        const distance = Math.hypot(dx, dy);

        const playerRadius = 40;
        const chaserRadius = 25;

        return distance < playerRadius + chaserRadius;
    }

    private destroyChaser() {
        this.removeChild(this.chaser);
    }

    private checkProjectileChaserCollision(projectile: Projectile) {
        const dx = projectile.x - this.chaser.x;
        const dy = projectile.y - this.chaser.y;

        const distance = Math.hypot(dx, dy);

        const projectileRadius = 5;
        const chaserRadius = 25;

        return distance < projectileRadius + chaserRadius;
    }

    private addScore() {
        this.score += 1;

        console.log("Score:", this.score);
    }

    getScore() {
        return this.score;
    }

    getRemainingTime() {
        return this.remainingTime;
    }

    getPlayerHealth() {
        return this.player.getHealth();
    }

    getGameOver() {
        return this.gameOver;
    }
}
