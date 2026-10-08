import { Container, Graphics, Text } from "pixi.js";
import { Player } from "../entities/Player";
import { InputManager } from "../input/InputManager";
import { Projectile } from "../entities/Projectile";
import { Chaser } from "../entities/Chaser";
import { Shooter } from "../entities/Shooter";
import { EnemyProjectile } from "../entities/EnemyProjectile";

export class GameWorld extends Container {
    private player: Player;
    private input: InputManager;

    private enemies: (Chaser | Shooter)[] = [];

    private projectiles: Projectile[] = [];
    private enemyProjectiles: EnemyProjectile[] = [];

    private fireCooldown = 0;
    private fireRate = 0.25;

    private score = 0;
    private remainingTime = 60;
    private gameOver = false;

    private spawnCooldown = 3;
    private spawnRate = 5;

    private healthText!: Text;
    private scoreText!: Text;
    private timeText!: Text;

    constructor(input: InputManager) {
        super();

        this.input = input;

        this.createArena();
        this.createIsland();

        this.player = new Player(input);
        this.player.position.set(400, 300);

        this.addChild(this.player);

        this.createHud();
        this.createInitialEnemies();
    }

    private isInsideIsland(x: number, y: number) {
        const islandX = 500;
        const islandY = 250;
        const islandWidth = 200;
        const islandHeight = 120;

        const margin = 25;

        return (
            x > islandX - margin &&
            x < islandX + islandWidth + margin &&
            y > islandY - margin &&
            y < islandY + islandHeight + margin
        );
    }

    private createArena() {
        const water = new Graphics();

        water.rect(0, 0, 1200, 800);
        water.fill("#1b4965");

        this.addChild(water);
    }

    private createIsland() {
        const island = new Graphics();

        island.rect(500, 250, 200, 120);
        island.fill("#8d6e63");

        this.addChild(island);
    }

    private createInitialEnemies() {
        const chaser = new Chaser(800, 300);
        const shooter = new Shooter(800, 500);

        this.enemies.push(chaser);
        this.enemies.push(shooter);

        this.addChild(chaser);
        this.addChild(shooter);
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

        this.updateEnemies(deltaTime);

        this.updateShooting(deltaTime);
        this.updateProjectiles(deltaTime, width, height);
        this.updateEnemyProjectiles(deltaTime, width, height);

        this.updateSpawning(deltaTime);

        this.updateHud();
    }

    private updateEnemies(deltaTime: number) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];

            const oldX = enemy.x;
            const oldY = enemy.y;

            if (enemy instanceof Chaser) {
                enemy.update(
                    deltaTime,
                    this.player.x,
                    this.player.y
                );

                if (this.isInsideIsland(enemy.x, enemy.y)) {
                    enemy.position.set(oldX, oldY);
                }

                if (this.checkChaserCollision(enemy)) {
                    this.player.takeDamage(25);
                    this.removeEnemy(i);
                }
            }

            if (enemy instanceof Shooter) {
                enemy.update(
                    deltaTime,
                    this.player.x,
                    this.player.y
                );

                if (this.isInsideIsland(enemy.x, enemy.y)) {
                    enemy.position.set(oldX, oldY);
                }

                if (
                    enemy.canShoot() &&
                    enemy.isInShootRange(this.player.x, this.player.y)
                ) {
                    this.createEnemyProjectile(enemy);
                    enemy.resetShootCooldown();
                }
            }
        }
    }

    private createEnemyProjectile(enemy: Shooter) {
        const projectile = new EnemyProjectile(
            enemy.x,
            enemy.y,
            enemy.rotation
        );

        this.enemyProjectiles.push(projectile);
        this.addChild(projectile);
    }

    private updateEnemyProjectiles(
        deltaTime: number,
        width: number,
        height: number
    ) {
        for (
            let i = this.enemyProjectiles.length - 1;
            i >= 0;
            i--
        ) {
            const projectile = this.enemyProjectiles[i];

            projectile.update(deltaTime);

            if (
                this.checkEnemyProjectilePlayerCollision(
                    projectile
                )
            ) {
                this.player.takeDamage(25);

                this.removeChild(projectile);
                this.enemyProjectiles.splice(i, 1);

                continue;
            }

            const outside =
                projectile.x < 0 ||
                projectile.x > width ||
                projectile.y < 0 ||
                projectile.y > height;

            if (outside) {
                this.removeChild(projectile);
                this.enemyProjectiles.splice(i, 1);
            }
        }
    }

    private checkEnemyProjectilePlayerCollision(
        projectile: EnemyProjectile
    ) {
        const dx = projectile.x - this.player.x;
        const dy = projectile.y - this.player.y;

        const distance = Math.hypot(dx, dy);

        const projectileRadius = 5;
        const playerRadius = 40;

        return (
            distance <
            projectileRadius + playerRadius
        );
    }

    private updateSpawning(deltaTime: number) {
        this.spawnCooldown -= deltaTime;

        if (this.spawnCooldown > 0) {
            return;
        }

        this.spawnCooldown = this.spawnRate;

        const shooter = new Shooter(1000, 100);

        this.enemies.push(shooter);
        this.addChild(shooter);
    }

    private removeEnemy(index: number) {
        const enemy = this.enemies[index];

        this.removeChild(enemy);
        this.enemies.splice(index, 1);
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

    private updateHud() {
        this.healthText.text =
            `Vida: ${this.player.getHealth()}`;

        this.scoreText.text =
            `Pontos: ${this.score}`;

        this.timeText.text =
            `Tempo: ${Math.ceil(this.remainingTime)}`;
    }

    private checkIslandCollision() {
        const islandX = 600;
        const islandY = 400;
        const islandRadius = 100;
        const playerRadius = 40;

        const dx = this.player.x - islandX;
        const dy = this.player.y - islandY;

        const distance = Math.hypot(dx, dy);

        return (
            distance <
            islandRadius + playerRadius
        );
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
            const sideRotation =
                this.player.rotation - Math.PI / 2;

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
            const sideRotation =
                this.player.rotation + Math.PI / 2;

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
        for (
            let i = this.projectiles.length - 1;
            i >= 0;
            i--
        ) {
            const projectile = this.projectiles[i];

            projectile.update(deltaTime);

            let hitEnemy = false;

            for (
                let enemyIndex = this.enemies.length - 1;
                enemyIndex >= 0;
                enemyIndex--
            ) {
                const enemy = this.enemies[enemyIndex];

                if (
                    this.checkProjectileEnemyCollision(
                        projectile,
                        enemy
                    )
                ) {
                    const killed =
                        enemy.takeDamage(25);

                    this.removeChild(projectile);
                    this.projectiles.splice(i, 1);

                    if (killed) {
                        this.removeEnemy(enemyIndex);
                        this.addScore();
                    }

                    hitEnemy = true;
                    break;
                }
            }

            if (hitEnemy) {
                continue;
            }

            const outside =
                projectile.x < 0 ||
                projectile.x > width ||
                projectile.y < 0 ||
                projectile.y > height;

            const hitIsland =
                this.checkProjectileIslandCollision(
                    projectile
                );

            if (outside || hitIsland) {
                this.removeChild(projectile);
                this.projectiles.splice(i, 1);
            }
        }
    }

    private checkProjectileEnemyCollision(
        projectile: Projectile,
        enemy: Chaser | Shooter
    ) {
        const dx = projectile.x - enemy.x;
        const dy = projectile.y - enemy.y;

        const distance = Math.hypot(dx, dy);

        const projectileRadius = 5;
        const enemyRadius = 25;

        return (
            distance <
            projectileRadius + enemyRadius
        );
    }

    private checkProjectileIslandCollision(
        projectile: Projectile
    ) {
        const islandX = 600;
        const islandY = 400;
        const islandRadius = 100;
        const projectileRadius = 5;

        const dx = projectile.x - islandX;
        const dy = projectile.y - islandY;

        const distance = Math.hypot(dx, dy);

        return (
            distance <
            islandRadius + projectileRadius
        );
    }

    private checkChaserCollision(
        chaser: Chaser
    ) {
        const dx = this.player.x - chaser.x;
        const dy = this.player.y - chaser.y;

        const distance = Math.hypot(dx, dy);

        const playerRadius = 40;
        const chaserRadius = 25;

        return (
            distance <
            playerRadius + chaserRadius
        );
    }

    private addScore() {
        this.score += 1;
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
