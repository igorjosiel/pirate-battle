import { useGame } from "../hooks/useGame";
import { useStartGame } from "../hooks/useStartGame";
import { useUpdateScore } from "../hooks/useUpdateScore";

function App() {
  const { data: game, isLoading } = useGame();

  const { mutate: startGame } = useStartGame();

  const { mutate: updateScore, isPending: isUpdatingScore } =
    useUpdateScore();

  return (
    <div>
      <p>
        Status: {isLoading ? "Carregando..." : game?.status}
      </p>

      <p>Score: {game?.score}</p>

      <button onClick={() => startGame()}>
        Iniciar jogo
      </button>

      <button
        onClick={() => updateScore()}
        disabled={
          isUpdatingScore ||
          game?.status !== "playing"
        }
      >
        {isUpdatingScore
          ? "Atualizando..."
          : "Adicionar 100 pontos"}
      </button>
    </div>
  );
}

export default App;
