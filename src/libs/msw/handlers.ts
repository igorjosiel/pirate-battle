import { http, HttpResponse } from "msw";
import type { Game } from "../../types/game";

let currentScore = 0;

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

    http.post("/api/game/finish", () => {
        const game: Game = {
            id: "game-1",
            status: "finished",
            score: 0,
        };

        return HttpResponse.json(game);
    }),

    http.post("/api/game/score", async ({ request }) => {
        const body = await request.json() as { points: number };

        currentScore += body.points;

        const game: Game = {
            id: "game-1",
            status: "playing",
            score: currentScore,
        };

        return HttpResponse.json(game);
    }),
];
