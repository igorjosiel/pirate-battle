import { useMutation, useQueryClient } from "@tanstack/react-query";
import { startGame } from "../services/gameService";

export function useStartGame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: startGame,

        onSuccess: (game) => {
            queryClient.setQueryData(["game"], game);
        },
    });
}
