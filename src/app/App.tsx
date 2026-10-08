import { useGame } from "../hooks/useGame";
import { useStartGame } from "../hooks/useStartGame";

function App() {
  const { data: game, isLoading, isError } = useGame();
  const { mutate: startGame, isPending } = useStartGame();

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (isError) {
    return <p>Erro ao carregar o jogo.</p>;
  }

  return (
    <div>
      <p>Status: {isLoading ? "Carregando..." : game?.status}</p>
      <p>Score: {game?.score}</p>

      <button
        onClick={() => startGame()}
        disabled={isPending}
      >
        {isPending ? "Iniciando..." : "Iniciar jogo"}
      </button>
    </div>
  );
}

export default App;
