export interface GameConfig {
  // Configurações gerais
  matchDuration: number;

  // Jogador
  playerHealth: number;
  playerSpeed: number;
  playerRotationSpeed: number;

  // Inimigos
  enemySpawnInterval: number;
  enemySpawnDistribution: {
    chaser: number;
    shooter: number;
  };

  // Perseguidor: Persegue o jogador, causa dano ao colidir com seu navio e explode no impacto
  chaserSpeed: number;
  chaserRotationSpeed: number;
  chaserDamage: number;

  // Atirador: Aproxima-se do jogador e dispara quando estiver dentro do alcance de ataque
  shooterSpeed: number;
  shooterRotationSpeed: number;
  shooterDamage: number;
  shooterAttackRange: number;

  // Projéteis
  projectileSpeed: number;
  projectileRange: number;
  projectileDuration: number;

  // Tempos de espera
  frontalShotCooldown: number;
  sideShotCooldown: number;
}

export const gameConfig: GameConfig = {
  // Configurações gerais
  matchDuration: 120,

  // Jogador
  playerHealth: 100,
  playerSpeed: 200,
  playerRotationSpeed: 3,

  // Inimigos
  enemySpawnInterval: 3,
  enemySpawnDistribution: {
    chaser: 0.6,
    shooter: 0.4,
  },

  // Perseguidor: Persegue o jogador, causa dano ao colidir com seu navio e explode no impacto
  chaserSpeed: 80,
  chaserRotationSpeed: 2,
  chaserDamage: 20,

  // Atirador: Aproxima-se do jogador e dispara quando estiver dentro do alcance de ataque
  shooterSpeed: 60,
  shooterRotationSpeed: 1.5,
  shooterDamage: 10,
  shooterAttackRange: 300,

  // Projéteis
  projectileSpeed: 400,
  projectileRange: 600,
  projectileDuration: 2,

  // Tempos de espera
  frontalShotCooldown: 0.5,
  sideShotCooldown: 1,
};
