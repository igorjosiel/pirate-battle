import { useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { GameWorld } from "../world/GameWorld";
import { InputManager } from "../input/InputManager";
import { useUpdateScore } from "../../../hooks/useUpdateScore";
import { useStartGame } from "../../../hooks/useStartGame";
import { useFinishGame } from "../../../hooks/useFinishGame";

export function GameCanvas() {
    const { mutate: updateScore } = useUpdateScore();
    const { mutate: startGame } = useStartGame();
    const { mutate: finishGame } = useFinishGame();

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Precisamos acessar o container de forma imperativa posteriormente
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const app = new Application({
            width: 1200,
            height: 800,
        });

        let initialized = false;
        let cancelled = false;

        async function initialize() {
            await app.init({
                resizeTo: container!,
                background: "#1b4965",
            });

            const input = new InputManager();

            startGame();

            const world = new GameWorld(
                input,
                () => {
                    updateScore(100);
                }, () => {
                    finishGame();
                });

            app.stage.addChild(world);

            app.ticker.add((ticker) => {
                const deltaTime = ticker.deltaMS / 1000;

                world.update(
                    deltaTime,
                    app.screen.width,
                    app.screen.height
                );
            });

            if (cancelled) {
                app.destroy();
                return;
            }

            if (container) {
                container.appendChild(app.canvas);
                initialized = true;
            }
        }

        initialize();

        // Limpeza - Destruimos a instância do PixiJS quando o componente é desmontado para liberar listeners, canvas, recursos, etc.
        return () => {
            cancelled = true;

            if (initialized) {
                app.destroy();
            }
        };
    }, []);

    return <div ref={containerRef} />;
}
