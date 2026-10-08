import { useMutation, useQueryClient } from "@tanstack/react-query";
import { finishGame } from "../services/gameService";

export function useFinishGame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: finishGame,

        onSuccess: (game) => {
            queryClient.setQueryData(["game"], game);
        },
    });
}
