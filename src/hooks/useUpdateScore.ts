import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScore } from "../services/gameService";

export function useUpdateScore() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (points: number) => updateScore(points),

        onSuccess: (game) => {
            queryClient.setQueryData(["game"], game);
        },
    });
}
