"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Configuración del juego 1 - Colores y formas
const colores = [
  { id: 1, nombre: "Rojo", emoji: "🔴", color: "from-red-400 to-red-600", hex: "#EF4444" },
  { id: 2, nombre: "Azul", emoji: "🔵", color: "from-blue-400 to-blue-600", hex: "#3B82F6" },
  { id: 3, nombre: "Verde", emoji: "🟢", color: "from-green-400 to-green-600", hex: "#10B981" },
  { id: 4, nombre: "Amarillo", emoji: "🟡", color: "from-yellow-400 to-yellow-600", hex: "#F59E0B" },
  { id: 5, nombre: "Morado", emoji: "🟣", color: "from-purple-400 to-purple-600", hex: "#8B5CF6" },
  { id: 6, nombre: "Naranja", emoji: "🟠", color: "from-orange-400 to-orange-600", hex: "#F97316" }
];

const formas = [
  { id: 1, nombre: "Círculo", emoji: "⭕", color: "from-pink-400 to-pink-600" },
  { id: 2, nombre: "Cuadrado", emoji: "⬜", color: "from-blue-400 to-blue-600" },
  { id: 3, nombre: "Triángulo", emoji: "🔺", color: "from-green-400 to-green-600" },
  { id: 4, nombre: "Estrella", emoji: "⭐", color: "from-yellow-400 to-yellow-600" }
];

const Game1Container = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState("SELECT_MODE"); // SELECT_MODE, COLOR_GAME, SHAPE_GAME, CELEBRATION
  const [selectedMode, setSelectedMode] = useState(null);
  const [currentColor, setCurrentColor] = useState(null);
  const [currentShape, setCurrentShape] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioContextRef = useRef(null);

  // Funciones de audio
  const playSound = (frequency, duration, type = 'sine') => {
    if (!audioEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.log('Audio no disponible:', error);
    }
  };

  const playSuccessSound = () => {
    playSound(523, 0.2);
    setTimeout(() => playSound(659, 0.2), 200);
    setTimeout(() => playSound(784, 0.4), 400);
  };

  const playErrorSound = () => {
    playSound(200, 0.5, 'sawtooth');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    if (mode === 'colors') {
      setGameState("COLOR_GAME");
      generateNewColor();
    } else if (mode === 'shapes') {
      setGameState("SHAPE_GAME");
      generateNewShape();
    }
  };

  const generateNewColor = () => {
    const randomColor = colores[Math.floor(Math.random() * colores.length)];
    setCurrentColor(randomColor);
  };

  const generateNewShape = () => {
    const randomShape = formas[Math.floor(Math.random() * formas.length)];
    setCurrentShape(randomShape);
  };

  const handleColorSelect = (selectedColor) => {
    setAttempts(prev => prev + 1);
    
    if (selectedColor.id === currentColor.id) {
      setScore(prev => prev + 10);
      playSuccessSound();
      setTimeout(() => {
        generateNewColor();
      }, 1000);
    } else {
      playErrorSound();
    }
  };

  const handleShapeSelect = (selectedShape) => {
    setAttempts(prev => prev + 1);
    
    if (selectedShape.id === currentShape.id) {
      setScore(prev => prev + 10);
      playSuccessSound();
      setTimeout(() => {
        generateNewShape();
      }, 1000);
    } else {
      playErrorSound();
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFD700' }}>
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
            audioEnabled ? 'text-green-500' : 'text-gray-400'
          }`}
        >
          {audioEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        {/* Selección de modo */}
        {gameState === "SELECT_MODE" && (
          <div className="flex gap-8">
              <button
                onClick={() => handleModeSelect('colors')}
                className="w-32 h-32 rounded-full shadow-lg border-4 border-white flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                style={{ backgroundColor: '#FF0000' }}
              >
                <div className="text-6xl">🎨</div>
              </button>
              
              <button
                onClick={() => handleModeSelect('shapes')}
                className="w-32 h-32 rounded-full shadow-lg border-4 border-white flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                style={{ backgroundColor: '#00FF00' }}
              >
                <div className="text-6xl">🧩</div>
              </button>
            
          </div>
        )}

        {/* Juego de colores */}
        {gameState === "COLOR_GAME" && currentColor && (
          <div className="flex flex-col items-center">
            <div className="mb-8">
              <div 
                className="w-32 h-32 mx-auto rounded-full shadow-2xl border-8 border-white flex items-center justify-center"
                style={{ backgroundColor: currentColor.color }}
              >
                <div className="text-6xl">
                  {currentColor.emoji}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {colores.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorSelect(color)}
                  className={`w-20 h-20 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 border-4 ${
                    color.id === currentColor.id ? 'border-yellow-400' : 'border-white'
                  }`}
                  style={{ backgroundColor: color.color }}
                >
                  <div className="text-3xl">{color.emoji}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Juego de formas */}
        {gameState === "SHAPE_GAME" && currentShape && (
          <div className="flex flex-col items-center">
            <div className="mb-8">
              <div 
                className="w-32 h-32 mx-auto rounded-2xl shadow-2xl border-8 border-white flex items-center justify-center"
                style={{ backgroundColor: currentShape.color }}
              >
                <div className="text-6xl">{currentShape.emoji}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {formas.map((forma) => (
                <button
                  key={forma.id}
                  onClick={() => handleShapeSelect(forma)}
                  className={`w-24 h-24 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-110 border-4 ${
                    forma.id === currentShape.id ? 'border-yellow-400' : 'border-white'
                  }`}
                  style={{ backgroundColor: forma.color }}
                >
                  <div className="text-4xl">{forma.emoji}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game1Container;
