import { http, HttpResponse } from "msw";
import type { Game } from "../../types/game";

export const handlers = [
    http.get("/api/game", () => {
        const game: Game = {
            id: "game-1",
            status: "waiting",
            score: 0,
        };

        return HttpResponse.json(game);
    }),

    http.post("/api/game/start", () => {
        const game: Game = {
            id: "game-1",
            status: "playing",
            score: 0,
        };

        return HttpResponse.json(game);
    }),
];
