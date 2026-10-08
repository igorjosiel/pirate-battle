import { api } from "../libs/axios";
import type { Game } from "../types/game";

export async function getGame() {
    const response = await api.get<Game>("/game");

    return response.data;
}

export async function startGame(): Promise<Game> {
    const response = await api.post<Game>("/game/start");

    return response.data;
}
