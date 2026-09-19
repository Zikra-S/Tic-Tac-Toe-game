import { useState } from "react";

function Square({
  value,
  onSquareClick,
}: {
  value: string | null;
  onSquareClick: () => void;
}) {
  return (
    <button
      onClick={onSquareClick}
      className={`w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-5xl font-extrabold rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors focus:outline-none ${
        value === "X" ? "text-[hsl(219,85%,60%)]" : "text-[hsl(1,90%,64%)]"
      }`}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Board({
  xIsNext,
  squares,
  onPlay,
}: {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (nextSquares: (string | null)[]) => void;
}) {
  const winner = calculateWinner(squares);

  function handleClick(i: number) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className={`text-lg font-bold tracking-wide ${
          winner ? "text-[hsl(1,90%,64%)]" : "text-white/80"
        }`}
      >
        {status}
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState<(string | null)[][]>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((_, move) => {
    const description = move > 0 ? `Go to move #${move}` : "Go to game start";
    return (
      <li key={move}>
        <button
          onClick={() => jumpTo(move)}
          className={`text-sm px-3 py-1.5 rounded-lg w-full text-left transition-colors ${
            move === currentMove
              ? "bg-white/15 text-white font-semibold"
              : "text-white/50 hover:bg-white/5 hover:text-white/80"
          }`}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="min-h-screen bg-[#0b0b0d] flex items-center justify-center p-6">
      <div className="flex flex-col sm:flex-row gap-10 items-center sm:items-start">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-2xl font-extrabold text-white tracking-wide">
            Tic-Tac-Toe
          </h1>
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          <button
            onClick={resetGame}
            className="text-sm font-semibold text-white/70 border border-white/20 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors"
          >
            New Game
          </button>
        </div>

        <div className="w-48">
          <h2 className="text-sm font-bold text-white/50 mb-2 uppercase tracking-wider">
            History
          </h2>
          <ol className="flex flex-col gap-1">{moves}</ol>
        </div>
      </div>
    </div>
  );
}