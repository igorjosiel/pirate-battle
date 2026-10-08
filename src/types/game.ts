export type GameStatus = "waiting" | "playing" | "finished";

export interface Game {
    id: string;
    status: GameStatus;
    score: number;
}
