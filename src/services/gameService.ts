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

export async function finishGame(): Promise<Game> {
    const response = await api.post<Game>("/game/finish");

    return response.data;
}

export async function updateScore(): Promise<Game> {
    const response = await api.post<Game>("/game/score");

    return response.data;
}
