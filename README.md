# 🎮 Pirate Battle — Game Challenge

Um jogo de arena desenvolvido com **React, TypeScript e PixiJS**, com foco em gameplay, organização arquitetural, integração com API e testes end-to-end.

O jogador controla uma nave em uma arena, enfrenta diferentes tipos de inimigos, utiliza diferentes formas de ataque, administra sua vida e tenta alcançar a maior pontuação possível antes do fim da partida.

---

## 🚀 Tecnologias

* **React** — construção da interface e integração com o jogo
* **TypeScript** — tipagem estática e maior segurança no desenvolvimento
* **PixiJS** — renderização e gerenciamento do gameplay em Canvas/WebGL
* **Vite** — desenvolvimento e build da aplicação
* **Axios** — comunicação com a API
* **TanStack Query (React Query)** — gerenciamento do estado assíncrono e cache
* **MSW (Mock Service Worker)** — simulação da API durante o desenvolvimento
* **Playwright** — testes end-to-end
* **CSS** — estilização da aplicação

---

## 🎮 Gameplay

O jogo acontece em uma arena onde o jogador controla uma nave.

Durante a partida, é possível:

* Movimentar a nave
* Rotacionar o jogador
* Atirar contra inimigos
* Utilizar diferentes direções de ataque
* Enfrentar diferentes tipos de inimigos
* Receber dano
* Utilizar a arena e obstáculos a seu favor
* Acumular pontos
* Sobreviver durante o tempo da partida

### 👾 Tipos de inimigos

#### Chaser

O **Chaser** persegue diretamente o jogador pela arena.

Ele possui:

* Barra de vida
* Sistema de dano
* Animação visual ao receber dano
* Colisão física com o jogador

#### Shooter

O **Shooter** mantém distância e dispara projéteis contra o jogador.

Seu comportamento inclui:

* Distância mínima para disparo
* Cooldown entre ataques
* Projéteis próprios
* Sistema de dano à nave do jogador

---

## 🕹️ Controles

| Tecla    | Ação                     |
| -------- | ------------------------ |
| `W`      | Movimentar para frente   |
| `S`      | Movimentar para trás     |
| `A`      | Rotacionar para esquerda |
| `D`      | Rotacionar para direita  |
| `Espaço` | Atirar                   |
| `Q`      | Ataque lateral           |
| `E`      | Ataque lateral           |
| `P`      | Pausar                   |

---

## 🏗️ Arquitetura

O projeto separa responsabilidades entre a camada React, o mundo do jogo e a camada de comunicação com a API.

```text
src/
├── app/
│   └── App.tsx
│
├── assets/
│
├── components/
│
├── features/
│   └── game/
│       ├── components/
│       │   └── GameCanvas.tsx
│       │
│       ├── entities/
│       │   ├── Player.ts
│       │   ├── Chaser.ts
│       │   ├── Shooter.ts
│       │   ├── Projectile.ts
│       │   └── EnemyProjectile.ts
│       │
│       ├── input/
│       │   └── InputManager.ts
│       │
│       └── world/
│           └── GameWorld.ts
│
├── hooks/
│   ├── useGame.ts
│   ├── useStartGame.ts
│   ├── useFinishGame.ts
│   └── useUpdateScore.ts
│
├── libs/
│   ├── axios.ts
│   ├── queryClient.ts
│   └── msw/
│       ├── browser.ts
│       └── handlers.ts
│
├── services/
│   └── gameService.ts
│
└── types/
    └── game.ts
```

---

## 🧩 Responsabilidades

### React

Responsável pela composição da aplicação e pela integração com os hooks de dados.

O React não controla diretamente a lógica interna dos objetos do jogo.

---

### GameCanvas

O `GameCanvas` funciona como uma ponte entre React e PixiJS.

Ele:

* Inicializa a aplicação PixiJS
* Cria o `GameWorld`
* Conecta o ticker ao loop do jogo
* Integra os hooks do React Query
* Envia eventos importantes do jogo para a camada React

Essa separação evita utilizar hooks do React dentro das classes do PixiJS.

---

### GameWorld

O `GameWorld` concentra a lógica principal da partida.

É responsável por:

* Criar a arena
* Gerenciar o jogador
* Gerenciar inimigos
* Atualizar projéteis
* Detectar colisões
* Controlar pontuação
* Controlar tempo
* Controlar Game Over
* Gerenciar spawn de inimigos
* Atualizar o HUD
* Controlar pause e restart

---

### Entities

As entidades possuem responsabilidades específicas.

Por exemplo:

```text
Player
 ├── movimentação
 ├── rotação
 ├── vida
 ├── dano
 └── invulnerabilidade

Chaser
 ├── perseguição
 ├── vida
 └── dano

Shooter
 ├── movimentação
 ├── distância de ataque
 └── disparos

Projectile
 └── projétil do jogador

EnemyProjectile
 └── projétil dos inimigos
```

---

# 🔌 Arquitetura de API

A aplicação utiliza **Axios** para centralizar as chamadas HTTP.

```ts
export const api = axios.create({
    baseURL: "/api",
});
```

Os serviços de jogo ficam separados da lógica de apresentação.

Exemplo:

```text
GameWorld
    ↓
callback
    ↓
GameCanvas
    ↓
React Query
    ↓
gameService
    ↓
Axios
    ↓
/api/game/score
```

Essa separação facilita a substituição da API mockada por uma API real posteriormente.

---

# ⚡ React Query

O **TanStack Query** é utilizado para controlar o estado assíncrono relacionado à partida.

Entre as operações disponíveis estão:

* Buscar estado do jogo
* Iniciar partida
* Finalizar partida
* Atualizar pontuação

Hooks específicos encapsulam essas operações:

```text
useGame()
useStartGame()
useFinishGame()
useUpdateScore()
```

Isso mantém os componentes livres de detalhes de implementação da comunicação HTTP.

---

# 🧪 Mock Service Worker

Durante o desenvolvimento, a aplicação utiliza **MSW** para simular o backend.

As rotas principais são:

```text
GET  /api/game
POST /api/game/start
POST /api/game/finish
POST /api/game/score
```

O MSW permite desenvolver e testar o fluxo completo da aplicação sem depender de um backend externo.

### Fluxo de pontuação

Quando um inimigo é derrotado:

```text
Inimigo derrotado
       ↓
GameWorld adiciona pontos
       ↓
onScoreChange()
       ↓
useUpdateScore()
       ↓
POST /api/game/score
       ↓
MSW
       ↓
React Query atualiza o cache
```

---

# 🧪 Testes End-to-End

O projeto utiliza **Playwright** para validar o comportamento da aplicação de ponta a ponta.

A configuração está em:

```text
playwright.config.ts
```

Os testes ficam em:

```text
tests/
└── game.spec.ts
```

A suíte cobre os principais fluxos da aplicação:

* Carregamento do jogo
* Inicialização da partida
* Movimentação do jogador
* Disparo
* Reinicialização da partida

Executar os testes:

```bash
npx playwright test
```

Os testes são executados contra a aplicação real em desenvolvimento, permitindo verificar a integração entre:

```text
Browser
   ↓
React
   ↓
PixiJS
   ↓
React Query
   ↓
Axios
   ↓
MSW
```

---

# 🧠 Decisões técnicas

### Separação entre React e PixiJS

A lógica do jogo não utiliza hooks diretamente.

Classes como `GameWorld`, `Player`, `Chaser` e `Shooter` permanecem independentes do ciclo de vida do React.

Quando é necessário comunicar um evento do jogo para React, são utilizados callbacks.

Exemplo:

```ts
new GameWorld(
    input,
    () => {
        updateScore(100);
    }
);
```

Isso evita acoplamento desnecessário entre o motor do jogo e o React.

---

### Sistema de colisões

As colisões são calculadas utilizando distância entre pontos:

```ts
const distance = Math.hypot(dx, dy);
```

A colisão acontece quando a distância entre os objetos é menor que a soma de seus raios.

Essa abordagem mantém o sistema simples e adequado para as entidades circulares utilizadas no gameplay.

---

### Sistema de dano

O jogador possui um período de invulnerabilidade após receber dano.

Durante esse período, sua nave pisca visualmente para fornecer feedback ao jogador e evitar que múltiplas colisões causem dano instantâneo em sequência.

---

### Cooldown de ataques

Tanto o jogador quanto os inimigos utilizam cooldowns para controlar a frequência dos disparos.

Isso evita a criação de uma quantidade excessiva de projéteis por segundo e deixa o combate mais previsível.

---

# 📊 Estado da partida

A partida possui três estados principais:

```ts
type GameStatus =
    | "waiting"
    | "playing"
    | "finished";
```

Além do estado, a partida mantém informações como:

```ts
interface Game {
    id: string;
    status: GameStatus;
    score: number;
}
```

---

# ▶️ Como executar o projeto

### Instalar dependências

```bash
npm install
```

### Iniciar o ambiente de desenvolvimento

```bash
npm run dev
```

Depois acesse a URL exibida pelo Vite.

---

# 🧪 Executar os testes

```bash
npx playwright test
```

Para visualizar os testes em modo interativo:

```bash
npx playwright test --ui
```

---

# 📦 Build de produção

```bash
npm run build
```

Para verificar a versão de produção localmente:

```bash
npm run preview
```

---

# 🎯 Objetivos do projeto

Além da implementação do gameplay, este projeto teve como objetivo praticar:

* Desenvolvimento de jogos com PixiJS
* Integração React + Canvas
* TypeScript
* Arquitetura baseada em responsabilidades
* Gerenciamento de estado assíncrono
* Consumo de APIs
* Mock de APIs
* Comunicação entre diferentes camadas da aplicação
* Testes end-to-end
* Organização de código
* Desenvolvimento orientado a comportamento

---

## 📌 Considerações finais

Este projeto foi desenvolvido buscando equilibrar **gameplay, organização de código e boas práticas de desenvolvimento frontend**.

A arquitetura foi pensada para manter o motor do jogo independente da camada React, enquanto React Query, Axios e MSW cuidam da comunicação e sincronização com a API.

O uso do Playwright garante uma camada adicional de confiança ao validar os principais fluxos da aplicação diretamente no navegador.

---

## 👨‍💻 Desenvolvido por

**Igor Josiel**

Projeto desenvolvido como parte de um desafio técnico/prático de desenvolvimento frontend.
