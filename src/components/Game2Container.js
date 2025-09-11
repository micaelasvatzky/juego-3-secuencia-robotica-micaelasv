"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Configuración del juego 2 - Rompecabezas
const puzzlePieces = [
  {
    id: 1,
    nombre: "Casa",
    emoji: "🏠",
    color: "from-blue-400 to-blue-600",
    pieces: 4,
  },
  {
    id: 2,
    nombre: "Sol",
    emoji: "☀️",
    color: "from-yellow-400 to-orange-500",
    pieces: 6,
  },
  {
    id: 3,
    nombre: "Árbol",
    emoji: "🌳",
    color: "from-green-400 to-green-600",
    pieces: 8,
  },
  {
    id: 4,
    nombre: "Flor",
    emoji: "🌸",
    color: "from-pink-400 to-pink-600",
    pieces: 6,
  },
];

const Game2Container = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState("SELECT_PUZZLE"); // SELECT_PUZZLE, PLAYING, CELEBRATION
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [placedPieces, setPlacedPieces] = useState([]);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioContextRef = useRef(null);

  // Funciones de audio
  const playSound = (frequency, duration, type = "sine") => {
    if (!audioEnabled) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(
        frequency,
        audioContextRef.current.currentTime
      );
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContextRef.current.currentTime + duration
      );

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.log("Audio no disponible:", error);
    }
  };

  const playSuccessSound = () => {
    playSound(523, 0.2);
    setTimeout(() => playSound(659, 0.2), 200);
    setTimeout(() => playSound(784, 0.4), 400);
  };

  const playErrorSound = () => {
    playSound(200, 0.5, "sawtooth");
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const handlePuzzleSelect = (puzzle) => {
    setSelectedPuzzle(puzzle);
    setGameState("PLAYING");
    generatePuzzlePieces(puzzle);
  };

  const generatePuzzlePieces = (puzzle) => {
    const pieces = [];
    for (let i = 0; i < puzzle.pieces; i++) {
      pieces.push({
        id: i + 1,
        position: { x: Math.random() * 300, y: Math.random() * 200 },
        isPlaced: false,
      });
    }
    setPuzzlePieces(pieces);
    setPlacedPieces([]);
  };

  const handlePieceClick = (pieceId) => {
    const piece = puzzlePieces.find((p) => p.id === pieceId);
    if (piece && !piece.isPlaced) {
      setDraggedPiece(pieceId);
      playSound(400, 0.1);
    }
  };

  const handleDropZoneClick = () => {
    if (draggedPiece) {
      const piece = puzzlePieces.find((p) => p.id === draggedPiece);
      if (piece) {
        setPlacedPieces((prev) => [...prev, piece]);
        setPuzzlePieces((prev) =>
          prev.map((p) => (p.id === piece.id ? { ...p, isPlaced: true } : p))
        );
        setDraggedPiece(null);
        setScore((prev) => prev + 10);
        playSuccessSound();

        // Verificar si el puzzle está completo
        if (placedPieces.length + 1 === selectedPuzzle.pieces) {
          setTimeout(() => {
            setGameState("CELEBRATION");
          }, 1000);
        }
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FF0000" }}>
      {/* Header simple */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handleBackToHome}
          className="text-4xl hover:scale-110 transition-transform duration-200"
        >
          🏠
        </button>
        <div className="text-4xl">⭐ {score}</div>
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`text-4xl transition-transform duration-200 hover:scale-110 ${
            audioEnabled ? "text-green-500" : "text-gray-400"
          }`}
        >
          {audioEnabled ? "🔊" : "🔇"}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        {/* Selección de rompecabezas */}
        {gameState === "SELECT_PUZZLE" && (
          <div className="grid grid-cols-2 gap-8">
            {puzzlePieces.map((puzzle) => (
              <button
                key={puzzle.id}
                onClick={() => handlePuzzleSelect(puzzle)}
                className="w-32 h-32 rounded-full shadow-lg border-4 border-white flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                style={{ backgroundColor: puzzle.color }}
              >
                <div className="text-6xl">{puzzle.emoji}</div>
              </button>
            ))}
          </div>
        )}

        {/* Juego del rompecabezas */}
        {gameState === "PLAYING" && selectedPuzzle && (
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Armá el {selectedPuzzle.nombre}
              </h2>

              {/* Área de juego */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Piezas disponibles */}
                <div className="bg-gray-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-700 mb-4">
                    Piezas
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {puzzlePieces
                      .filter((piece) => !piece.isPlaced)
                      .map((piece) => (
                        <button
                          key={piece.id}
                          onClick={() => handlePieceClick(piece.id)}
                          className={`w-16 h-16 rounded-xl bg-gradient-to-r ${
                            selectedPuzzle.color
                          } shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-2 ${
                            draggedPiece === piece.id
                              ? "border-yellow-400"
                              : "border-white"
                          }`}
                        >
                          <div className="text-2xl">{selectedPuzzle.emoji}</div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Área de armado */}
                <div className="bg-gray-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-700 mb-4">
                    Armá aquí
                  </h3>
                  <div
                    onClick={handleDropZoneClick}
                    className="w-full h-48 border-4 border-dashed border-gray-400 rounded-xl flex items-center justify-center cursor-pointer hover:border-gray-600 transition-colors duration-300"
                  >
                    {placedPieces.length === 0 ? (
                      <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">👆</div>
                        <p>Tocá las piezas para armarlo</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-6xl mb-2">
                          {selectedPuzzle.emoji}
                        </div>
                        <p className="text-gray-600">
                          {placedPieces.length}/{selectedPuzzle.pieces} piezas
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progreso */}
              <div className="mt-6">
                <div className="bg-gray-200 rounded-full h-4 w-full">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (placedPieces.length / selectedPuzzle.pieces) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {placedPieces.length} de {selectedPuzzle.pieces} piezas
                  colocadas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Celebración */}
        {gameState === "CELEBRATION" && (
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="text-8xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-4xl font-bold text-green-600 mb-4">
                ¡Excelente trabajo!
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                ¡Armaste el {selectedPuzzle.nombre} perfectamente! 🌟
              </p>

              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  +{selectedPuzzle.pieces * 10} puntos! ⭐
                </div>
                <div className="text-lg text-gray-700">
                  Puntuación total: {score}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setGameState("SELECT_PUZZLE")}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-8 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  🧩 Jugar Otro
                </button>
                <button
                  onClick={handleBackToHome}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-8 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  🏠 Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game2Container;
