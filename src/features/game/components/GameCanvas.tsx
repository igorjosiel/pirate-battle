import { useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { GameWorld } from "../world/GameWorld";
import { InputManager } from "../input/InputManager";

export function GameCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Precisamos acessar o container de forma imperativa posteriormente
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const app = new Application();

        let initialized = false;
        let cancelled = false;

        async function initialize() {
            await app.init({
                resizeTo: container,
                background: "#1b4965",
            });

            const input = new InputManager();
            const world = new GameWorld(input);

            app.stage.addChild(world);

            app.ticker.add((ticker) => {
                world.update(ticker.deltaTime);
            });

            if (cancelled) {
                app.destroy();
                return;
            }

            container.appendChild(app.canvas);
            initialized = true;
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
