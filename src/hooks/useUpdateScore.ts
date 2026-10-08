import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScore } from "../services/gameService";

export function useUpdateScore() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateScore,

        onSuccess: (game) => {
            queryClient.setQueryData(["game"], game);
        },
    });
}
