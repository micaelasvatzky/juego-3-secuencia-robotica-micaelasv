"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Configuración del juego 1 - Grilla y personaje
const DIRECTIONS = {
  UP: { id: 'up', emoji: '⬆️', x: 0, y: -1 },
  DOWN: { id: 'down', emoji: '⬇️', x: 0, y: 1 },
  LEFT: { id: 'left', emoji: '⬅️', x: -1, y: 0 },
  RIGHT: { id: 'right', emoji: '➡️', x: 1, y: 0 }
};


// Generar 10 niveles para cada tipo de juego
const generateLevels = () => {
  const levels = {};
  
  // Nivel 1: Arrastrar robot (10 niveles)
  for (let i = 1; i <= 10; i++) {
    const startPos = generateStartPosition(4, i, 'nivel1');
    levels[`nivel1_${i}`] = {
      nombre: `Nivel 1-${i}`,
      emoji: "👶",
      color: "#FF6B9D",
      descripcion: "Arrastrá al muñequito por la grilla",
      dificultad: "Fácil",
      gridSize: 4,
      startPosition: startPos,
      target: generateTarget(4, i, 'nivel1', startPos),
      obstacles: generateObstacles(4, i, 'nivel1', startPos)
    };
  }
  
  // Nivel 2: Flechas (10 niveles)
  for (let i = 1; i <= 10; i++) {
    const startPos = generateStartPosition(5, i, 'nivel2');
    levels[`nivel2_${i}`] = {
      nombre: `Nivel 2-${i}`,
      emoji: "🧒",
      color: "#4ECDC4",
      descripcion: "Arrastrá flechas sobre la grilla",
      dificultad: "Intermedio",
      gridSize: 5,
      startPosition: startPos,
      target: generateTarget(5, i, 'nivel2', startPos),
      obstacles: generateObstacles(5, i, 'nivel2', startPos)
    };
  }
  
  // Nivel 3: Secuencia (10 niveles)
  for (let i = 1; i <= 10; i++) {
    const startPos = generateStartPosition(5, i, 'nivel3');
    levels[`nivel3_${i}`] = {
      nombre: `Nivel 3-${i}`,
      emoji: "👦",
      color: "#45B7D1",
      descripcion: "Armá secuencia de flechas y presioná Play",
      dificultad: "Avanzado",
      gridSize: 5,
      startPosition: startPos,
      target: generateTarget(5, i, 'nivel3', startPos),
      obstacles: generateObstacles(5, i, 'nivel3', startPos)
    };
  }
  
  return levels;
};

// Generar obstáculos variados basados en el nivel y tipo
const generateObstacles = (gridSize, level, gameType, startPos) => {
  const obstacles = [];
  // Mínimo 2 obstáculos, máximo 6, aumenta con el nivel
  const numObstacles = Math.max(2, Math.min(6, 2 + level));
  
  // Usar semillas diferentes para cada tipo de juego
  const seed = level * 42 + gameType.charCodeAt(gameType.length - 1);
  
  // Generar obstáculos de forma más simple
  for (let i = 0; i < numObstacles; i++) {
    let x, y;
    let attempts = 0;
    
    // Generar posición hasta encontrar una válida
    do {
      const pseudoRandom = (seed + i * 7 + attempts * 13) % (gridSize * gridSize);
      x = pseudoRandom % gridSize;
      y = Math.floor(pseudoRandom / gridSize);
      attempts++;
    } while ((x === startPos.x && y === startPos.y) || obstacles.some(obs => obs.x === x && obs.y === y));
    
    obstacles.push({ x, y });
  }
  
  console.log(`${gameType} Nivel ${level}: Obstáculos generados:`, obstacles);
  return obstacles;
};

// Generar posición inicial del robot
const generateStartPosition = (gridSize, level, gameType) => {
  // Usar semillas diferentes para cada tipo de juego
  const seed = level * 23 + gameType.charCodeAt(gameType.length - 1);
  
  // Generar posición inicial
  const pseudoRandom = seed % (gridSize * gridSize);
  let x = pseudoRandom % gridSize;
  let y = Math.floor(pseudoRandom / gridSize);
  
  const startPos = { x, y };
  console.log(`${gameType} Nivel ${level}: Posición inicial:`, startPos);
  return startPos;
};

// Generar target variado basado en el nivel y tipo
const generateTarget = (gridSize, level, gameType, startPos) => {
  // Usar semillas diferentes para cada tipo de juego
  const seed = level * 37 + gameType.charCodeAt(gameType.length - 1);
  
  // Generar posición del target
  const pseudoRandom = seed % (gridSize * gridSize);
  let x = pseudoRandom % gridSize;
  let y = Math.floor(pseudoRandom / gridSize);
  
  // Asegurar que no esté en la posición inicial
  if (startPos && x === startPos.x && y === startPos.y) {
    x = (x + 1) % gridSize;
    y = (y + 1) % gridSize;
  }
  
  const target = { x, y };
  console.log(`${gameType} Nivel ${level}: Target generado:`, target);
  return target;
};

const NIVELES = generateLevels();

const Game1Container = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState("SELECT_GAME_TYPE"); // SELECT_GAME_TYPE, SELECT_LEVEL, PLAYING, CELEBRATION
  const [selectedGameType, setSelectedGameType] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [characterPosition, setCharacterPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 2, y: 2 });
  const [gridPath, setGridPath] = useState([]);
  const [gridArrows, setGridArrows] = useState({});
  const [sequence, setSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [draggedArrow, setDraggedArrow] = useState(null);
  const [draggedTarget, setDraggedTarget] = useState(null);
  const [placedTarget, setPlacedTarget] = useState(null);
  const [score, setScore] = useState(0);
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

  const handleGameTypeSelect = (gameType) => {
    setSelectedGameType(gameType);
    setGameState("SELECT_LEVEL");
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setGameState("PLAYING");
    resetGame();
  };

  const resetGame = () => {
    console.log('🔄 Reseteando juego...');
    const nivel = NIVELES[selectedLevel];
    if (nivel) {
      console.log('📋 Nivel cargado:', nivel);
      console.log('🤖 Posición inicial:', nivel.startPosition);
      console.log('🎯 Target:', nivel.target);
      console.log('🪨 Obstáculos:', nivel.obstacles);
      setCharacterPosition(nivel.startPosition);
      setTargetPosition(nivel.target);
      setGridPath([nivel.startPosition]); // Pintar el primer cuadradito
    } else {
      console.log('❌ No se pudo cargar el nivel:', selectedLevel);
      setCharacterPosition({ x: 0, y: 0 });
      setGridPath([{ x: 0, y: 0 }]);
    }
    setGridArrows({});
    setSequence([]);
    setIsPlaying(false);
    setDraggedArrow(null);
    setDraggedTarget(null);
    setPlacedTarget(null);
  };


  const handleCellClick = (x, y) => {
    if (selectedGameType === 'nivel1') {
      // Nivel 1: Mover personaje directamente
      setCharacterPosition({ x, y });
      setGridPath(prev => [...prev, { x, y }]);
      
      // Verificar si llegó a la meta
      if (x === targetPosition.x && y === targetPosition.y) {
        setScore(prev => prev + 50);
        playSuccessSound();
        setTimeout(() => {
          setGameState("CELEBRATION");
        }, 1000);
      }
    } else if (selectedGameType === 'nivel2') {
      // Nivel 2: Borrar flecha si existe en esa casilla
      const cellKey = `${x}-${y}`;
      if (gridArrows[cellKey]) {
        setGridArrows(prev => {
          const newArrows = { ...prev };
          delete newArrows[cellKey];
          return newArrows;
        });
      }
    }
  };

  const handleDragStart = (e, direction) => {
    setDraggedArrow(direction);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', direction.id);
  };

  const handleRobotDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'robot');
  };

  const handleTargetDragStart = (e) => {
    setDraggedTarget(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'target');
  };

  const handleDragEnd = () => {
    setDraggedArrow(null);
    setDraggedTarget(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, x, y) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    
    console.log('🎯 Drop en:', { x, y, data, draggedArrow, selectedGameType });
    
    if (data === 'robot' && selectedGameType === 'nivel1') {
      // Mover robot
      setCharacterPosition({ x, y });
      setGridPath(prev => [...prev, { x, y }]);
      
      // Verificar si llegó a la meta
      if (x === targetPosition.x && y === targetPosition.y) {
        setScore(prev => prev + 50);
      playSuccessSound();
      setTimeout(() => {
          setGameState("CELEBRATION");
      }, 1000);
      }
    } else if (data === 'target' && selectedGameType === 'nivel2') {
      // Colocar target
      console.log('🎯 Colocando target en:', { x, y });
      setPlacedTarget({ x, y });
    } else if (selectedGameType === 'nivel2' && draggedArrow) {
      // Verificar si hay obstáculo en esa posición
      const nivel = NIVELES[selectedLevel];
      const hasObstacle = nivel.obstacles.some(obs => obs.x === x && obs.y === y);
      
      if (hasObstacle) {
        console.log('❌ No se puede colocar flecha en obstáculo');
        playErrorSound();
        setDraggedArrow(null);
        return;
      }
      
      
      // Colocar flecha - simplificado
      const cellKey = `${x}-${y}`;
      console.log('➡️ Colocando flecha:', { cellKey, arrow: draggedArrow });
      setGridArrows(prev => {
        const newArrows = {
          ...prev,
          [cellKey]: draggedArrow
        };
        console.log('📋 Nuevas flechas:', newArrows);
        return newArrows;
      });
      setDraggedArrow(null);
    }
  };

  const handleArrowSelect = (direction) => {
    if (selectedGameType === 'nivel3') {
      setSequence(prev => [...prev, direction]);
    }
  };

  const executeSequence = () => {
    if (selectedGameType === 'nivel3' && sequence.length > 0) {
      setIsPlaying(true);
      const nivel = NIVELES[selectedLevel];
      let currentPos = { ...nivel.startPosition };
      const path = [{ ...currentPos }];
      
      sequence.forEach((direction, index) => {
        setTimeout(() => {
          const newPos = { x: currentPos.x + direction.x, y: currentPos.y + direction.y };
          
          // Verificar si hay obstáculo
          const nivel = NIVELES[selectedLevel];
          const hasObstacle = nivel.obstacles.some(obs => obs.x === newPos.x && obs.y === newPos.y);
          
          if (hasObstacle) {
            setIsPlaying(false);
            playErrorSound();
            return;
          }
          
          currentPos = newPos;
          setCharacterPosition({ ...currentPos });
          setGridPath(prev => [...prev, { ...currentPos }]);
          
          if (index === sequence.length - 1) {
            setIsPlaying(false);
            if (currentPos.x === targetPosition.x && currentPos.y === targetPosition.y) {
              setScore(prev => prev + 50);
              playSuccessSound();
              setTimeout(() => setGameState("CELEBRATION"), 1000);
    } else {
      playErrorSound();
    }
          }
        }, (index + 1) * 500);
      });
    }
  };

  const executeArrowPath = () => {
    console.log('=== EJECUTAR CAMINO ===');
    console.log('Flechas en grilla:', gridArrows);
    console.log('Cantidad de flechas:', Object.keys(gridArrows).length);
    
    if (selectedGameType === 'nivel2' && placedTarget) {
      setIsPlaying(true);
      const nivel = NIVELES[selectedLevel];
      
      // NO resetear posición - mantener donde está el robot
      const currentRobotPos = characterPosition;
      setGridPath([currentRobotPos]);
      
      // Crear secuencia de movimientos basada en las flechas colocadas
      const movements = [];
      
      // Buscar todas las flechas en la grilla y ordenarlas por posición
      const allArrows = Object.entries(gridArrows).map(([key, arrow]) => {
        const [x, y] = key.split('-').map(Number);
        return { x, y, arrow, key };
      });
      
      console.log('🔍 Todas las flechas en la grilla:', allArrows);
      
      // Ordenar por posición (de arriba a abajo, de izquierda a derecha)
      allArrows.sort((a, b) => {
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
      });
      
      // Agregar todas las flechas a la secuencia
      allArrows.forEach(({ arrow }) => {
        movements.push(arrow);
        console.log(`✅ Agregado: ${arrow.emoji}`);
      });
      
      console.log('🔄 Secuencia de movimientos:', movements);
      
      if (movements.length === 0) {
        console.log('❌ No hay movimientos para ejecutar');
        setIsPlaying(false);
        playErrorSound();
        return;
      }
      
      // Ejecutar movimientos EXACTAMENTE como en el nivel 3
      let robotPos = { ...currentRobotPos };
      
      console.log(`🤖 Iniciando ejecución de ${movements.length} movimientos`);
      
      movements.forEach((direction, index) => {
        setTimeout(() => {
          console.log(`🤖 Ejecutando movimiento ${index + 1}/${movements.length}: ${direction.emoji}`);
          
          const newPos = { x: robotPos.x + direction.x, y: robotPos.y + direction.y };
          console.log(`📍 Robot se mueve de (${robotPos.x},${robotPos.y}) a (${newPos.x},${newPos.y})`);
          
          // Verificar límites de la grilla
          if (newPos.x < 0 || newPos.x >= nivel.gridSize || newPos.y < 0 || newPos.y >= nivel.gridSize) {
            console.log('❌ Fuera de límites - secuencia inválida');
            setIsPlaying(false);
            playErrorSound();
            return;
          }
          
          // Verificar si hay obstáculo
          const hasObstacle = nivel.obstacles.some(obs => obs.x === newPos.x && obs.y === newPos.y);
          
          if (hasObstacle) {
            console.log('❌ Chocó con obstáculo - secuencia inválida');
            setIsPlaying(false);
            playErrorSound();
            return;
          }
          
          // Mover el robot (ejecutar la secuencia del usuario)
          robotPos = newPos;
          console.log(`🎯 Actualizando posición del robot a: (${robotPos.x},${robotPos.y})`);
          setCharacterPosition({ ...robotPos });
          setGridPath(prev => [...prev, { ...robotPos }]);
          
          if (index === movements.length - 1) {
            console.log('🏁 Último movimiento completado');
            setIsPlaying(false);
            // Solo verificar si llegó al target al final
            if (robotPos.x === placedTarget.x && robotPos.y === placedTarget.y) {
              console.log('🎉 ¡Llegó al target! Secuencia correcta');
              setScore(prev => prev + 50);
      playSuccessSound();
              setTimeout(() => setGameState("CELEBRATION"), 1000);
    } else {
              console.log('❌ No llegó al target - secuencia incorrecta');
      playErrorSound();
            }
          }
        }, (index + 1) * 500);
      });
    }
  };


  // Función para renderizar la grilla
  const renderGrid = () => {
    const nivel = NIVELES[selectedLevel];
    const gridSize = nivel?.gridSize || 5;
    const cells = [];
    
    // Debug: Mostrar obstáculos en consola
    if (nivel?.obstacles) {
      console.log('🪨 Obstáculos del nivel:', nivel.obstacles);
    }
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isCharacter = characterPosition.x === x && characterPosition.y === y;
        const isTarget = targetPosition.x === x && targetPosition.y === y;
        const isPlacedTarget = placedTarget && placedTarget.x === x && placedTarget.y === y;
        const isInPath = gridPath.some(pos => pos.x === x && pos.y === y);
        const isObstacle = nivel?.obstacles.some(obs => obs.x === x && obs.y === y);
        const cellKey = `${x}-${y}`;
        const hasArrow = gridArrows[cellKey];
        
        // Debug: Mostrar si esta casilla es obstáculo
        if (isObstacle) {
          console.log(`🪨 Obstáculo en (${x},${y})`);
        }
        
        // Determinar el color de fondo
        let bgColor = 'bg-white hover:bg-gray-100';
        if (isCharacter) bgColor = 'bg-blue-500';
        else if (isPlacedTarget) bgColor = 'bg-red-500'; // Target colocado tapa al original
        else if (isTarget && !isPlacedTarget) bgColor = 'bg-green-500';
        else if (isObstacle) bgColor = 'bg-gray-800';
        else if (isInPath) bgColor = 'bg-yellow-200';
        
        cells.push(
          <div
            key={`${x}-${y}`}
            onClick={() => handleCellClick(x, y)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, x, y)}
            className={`w-16 h-16 border-2 border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-200 ${bgColor}`}
          >
            {isCharacter && (
              <div 
                className={`text-2xl ${selectedGameType === 'nivel1' ? 'cursor-grab active:cursor-grabbing' : ''}`}
                draggable={selectedGameType === 'nivel1'}
                onDragStart={selectedGameType === 'nivel1' ? handleRobotDragStart : undefined}
                onDragEnd={selectedGameType === 'nivel1' ? handleDragEnd : undefined}
              >
                🤖
              </div>
            )}
            {isTarget && !isCharacter && !isPlacedTarget && <div className="text-2xl">🎯</div>}
            {isPlacedTarget && !isCharacter && <div className="text-2xl">🎯</div>}
            {isObstacle && !isCharacter && <div className="text-2xl">🪨</div>}
            {hasArrow && !isCharacter && !isObstacle && <div className="text-2xl">{hasArrow.emoji}</div>}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFD700' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handleBackToHome}
          className="text-4xl hover:scale-110 transition-transform duration-200"
        >
          🏠
        </button>
        
        {selectedLevel && (
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {NIVELES[selectedLevel].emoji} {NIVELES[selectedLevel].nombre}
            </div>
            <div className="text-sm text-white/80">
              {NIVELES[selectedLevel].dificultad}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4">
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
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        {/* Selección de tipo de juego */}
        {gameState === "SELECT_GAME_TYPE" && (
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                🎮 Juego de Grilla y Personaje
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                ¡Ayudá al personaje a llegar a la meta!
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
                <button
                onClick={() => handleGameTypeSelect('nivel1')}
                className="transition-all duration-300 transform hover:scale-105 focus:outline-none"
              >
                <div
                  className="w-40 h-40 rounded-2xl shadow-lg flex flex-col items-center justify-center p-4"
                  style={{ backgroundColor: '#FF6B9D' }}
                >
                  <div className="text-5xl mb-3">👶</div>
                  <div className="text-white font-bold text-xl mb-2">
                    Nivel 1
                  </div>
                  <div className="text-white/80 text-sm text-center">
                    Arrastrá al muñequito
                  </div>
                </div>
                </button>
              
              <button
                onClick={() => handleGameTypeSelect('nivel2')}
                className="transition-all duration-300 transform hover:scale-105 focus:outline-none"
              >
                <div
                  className="w-40 h-40 rounded-2xl shadow-lg flex flex-col items-center justify-center p-4"
                  style={{ backgroundColor: '#4ECDC4' }}
                >
                  <div className="text-5xl mb-3">🧒</div>
                  <div className="text-white font-bold text-xl mb-2">
                    Nivel 2
                  </div>
                  <div className="text-white/80 text-sm text-center">
                    Arrastrá flechas
                  </div>
              </div>
              </button>
              
                <button
                onClick={() => handleGameTypeSelect('nivel3')}
                className="transition-all duration-300 transform hover:scale-105 focus:outline-none"
              >
                <div
                  className="w-40 h-40 rounded-2xl shadow-lg flex flex-col items-center justify-center p-4"
                  style={{ backgroundColor: '#45B7D1' }}
                >
                  <div className="text-5xl mb-3">👦</div>
                  <div className="text-white font-bold text-xl mb-2">
                    Nivel 3
                  </div>
                  <div className="text-white/80 text-sm text-center">
                    Secuencia de flechas
                  </div>
                </div>
                </button>
            </div>
          </div>
        )}

        {/* Selección de nivel específico */}
        {gameState === "SELECT_LEVEL" && selectedGameType && (
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Seleccioná un nivel
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {selectedGameType === 'nivel1' && 'Arrastrá al muñequito por la grilla'}
                {selectedGameType === 'nivel2' && 'Arrastrá flechas sobre la grilla'}
                {selectedGameType === 'nivel3' && 'Armá secuencia de flechas y presioná Play'}
              </p>
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((levelNum) => {
                const levelKey = `${selectedGameType}_${levelNum}`;
                const nivel = NIVELES[levelKey];
                return (
                  <button
                    key={levelKey}
                    onClick={() => handleLevelSelect(levelKey)}
                    className="transition-all duration-300 transform hover:scale-105 focus:outline-none"
                  >
                    <div
                      className="w-20 h-20 rounded-xl shadow-lg flex flex-col items-center justify-center p-2"
                      style={{ backgroundColor: nivel.color }}
                    >
                      <div className="text-2xl mb-1">{nivel.emoji}</div>
                      <div className="text-white font-bold text-sm">
                        {levelNum}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Juego activo */}
        {gameState === "PLAYING" && selectedLevel && (
          <div className="w-full max-w-4xl">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                {NIVELES[selectedLevel].emoji} {NIVELES[selectedLevel].nombre}
              </h2>

              {/* Instrucciones */}
              <div className="text-center mb-6">
                <p className="text-lg text-gray-600">
                  {NIVELES[selectedLevel].descripcion}
                </p>
              </div>

              {/* Grilla */}
              <div className="flex justify-center mb-6">
                <div 
                  className="grid gap-1 p-4 bg-gray-200 rounded-xl"
                  style={{ gridTemplateColumns: `repeat(${NIVELES[selectedLevel].gridSize}, 1fr)` }}
                >
                  {renderGrid()}
                </div>
              </div>

              {/* Instrucciones para nivel 1 */}
              {selectedGameType === 'nivel1' && (
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-700 mb-4">Arrastrá el robot por la grilla hasta llegar al target:</h3>
                </div>
              )}

              {/* Área de flechas y target para nivel 2 */}
              {selectedGameType === 'nivel2' && (
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-700 mb-4">Arrastrá las flechas y el target a la grilla:</h3>
                  <div className="text-sm text-gray-600 mb-2">
                    Flechas colocadas: {Object.keys(gridArrows).length} | 
                    Target: {placedTarget ? '✅ Colocado' : '❌ No colocado'}
                  </div>
                  <div className="text-xs text-gray-500 mb-4">
                    💡 Toca una casilla con flecha para borrarla
                  </div>
                  <div className="flex justify-center gap-4 mb-4">
                    {Object.values(DIRECTIONS).map((direction) => (
                      <div
                        key={direction.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, direction)}
                        onDragEnd={handleDragEnd}
                        className="w-16 h-16 bg-blue-500 text-white rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-blue-600 transition-colors text-2xl"
                      >
                        {direction.emoji}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4">
                    <div
                      draggable
                      onDragStart={handleTargetDragStart}
                      onDragEnd={handleDragEnd}
                      className="w-16 h-16 bg-red-500 text-white rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-red-600 transition-colors text-2xl"
                    >
                      🎯
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4 justify-center">
                    <button
                      onClick={executeArrowPath}
                      disabled={isPlaying}
                      className={`py-2 px-6 rounded-lg font-bold ${
                        placedTarget 
                          ? 'bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white' 
                          : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {isPlaying ? 'Ejecutando...' : '▶️ Ejecutar Camino'}
                    </button>
                  </div>
                </div>
              )}

              {/* Controles específicos por nivel */}
              {selectedGameType === 'nivel3' && (
                <div className="text-center">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Secuencia de flechas:</h3>
                    <div className="flex justify-center gap-2 mb-4">
                      {sequence.map((direction, index) => (
                        <div key={index} className="text-2xl">{direction.emoji}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4 mb-4">
                    {Object.values(DIRECTIONS).map((direction) => (
                      <button
                        key={direction.id}
                        onClick={() => handleArrowSelect(direction)}
                        className="w-12 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        {direction.emoji}
                      </button>
                    ))}
              </div>

                  <button
                    onClick={executeSequence}
                    disabled={sequence.length === 0 || isPlaying}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-6 rounded-lg font-bold"
                  >
                    {isPlaying ? 'Ejecutando...' : '▶️ Play'}
                  </button>
              </div>
              )}

            </div>
          </div>
        )}

        {/* Celebración */}
        {gameState === "CELEBRATION" && (
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="text-8xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-4xl font-bold text-green-600 mb-4">
                ¡Llegaste a la meta!
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                ¡Excelente trabajo! +50 puntos
              </p>
              
              <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#FFF3CD' }}>
                <div className="text-lg text-gray-700 mb-2">
                  Puntuación total: {score}
            </div>
                <div className="text-sm text-gray-600">
                  {NIVELES[selectedLevel].nombre} completado
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 justify-center">
                {/* Siguiente nivel */}
                {(() => {
                  const currentLevelNum = parseInt(selectedLevel.split('_')[1]);
                  const nextLevelKey = `${selectedGameType}_${currentLevelNum + 1}`;
                  const hasNextLevel = NIVELES[nextLevelKey];
                  
                  return hasNextLevel ? (
                    <button
                      onClick={() => {
                        setSelectedLevel(nextLevelKey);
                        setGameState("PLAYING");
                        resetGame();
                      }}
                      className="text-white py-3 px-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      style={{ backgroundColor: '#10B981' }}
                    >
                      ➡️ Siguiente Nivel
                    </button>
                  ) : null;
                })()}
                
                {/* Jugar de nuevo */}
                <button
                  onClick={() => {
                    setGameState("PLAYING");
                    resetGame();
                  }}
                  className="text-white py-3 px-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#45B7D1' }}
                >
                  🔄 Jugar de Nuevo
                </button>
                
                {/* Elegir nivel */}
                <button
                  onClick={() => setGameState("SELECT_LEVEL")}
                  className="text-white py-3 px-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#8B5CF6' }}
                >
                  🎯 Elegir Nivel
                </button>
                
                {/* Volver a home */}
                  <button
                  onClick={() => setGameState("SELECT_GAME_TYPE")}
                  className="text-white py-3 px-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#FF6B9D' }}
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

export default Game1Container;
