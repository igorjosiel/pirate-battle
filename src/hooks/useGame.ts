import { useQuery } from "@tanstack/react-query";
import { getGame } from "../services/gameService";

export function useGame() {
    return useQuery({
        queryKey: ["game"],
        queryFn: getGame,
    });
}
