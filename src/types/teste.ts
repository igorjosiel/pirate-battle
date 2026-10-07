export interface GameConfig {
  sessionDuration: number;
  enemySpawnInterval: number;

  player: {
    maxHealth: number;
    moveSpeed: number;
    rotationSpeed: number;
  };

  projectile: {
    speed: number;
    damage: number;
    lifetime: number;
  };

  shooter: {
    attackRange: number;
    attackCooldown: number;
  };

  chaser: {
    speed: number;
    damage: number;
  };
}
