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


// Niveles predefinidos y fijos - nunca cambian
const NIVELES_PREDEFINIDOS = {
  // Nivel 1: Arrastrar robot (10 niveles)
  'nivel1_1': {
    nombre: 'Nivel 1-1',
    emoji: "👶",
    color: "#FF6B9D",
    descripcion: "Arrastrá al muñequito por la grilla",
    dificultad: "Fácil",
    gridSize: 4,
    startPosition: { x: 0, y: 0 },
    target: { x: 3, y: 3 },
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }]
  },
  'nivel1_2': {
    nombre: 'Nivel 1-2',
    emoji: "👶",
    color: "#FF6B9D",
    descripcion: "Arrastrá al muñequito por la grilla",
    dificultad: "Fácil",
    gridSize: 4,
    startPosition: { x: 0, y: 3 },
    target: { x: 3, y: 0 },
    obstacles: [{ x: 1, y: 2 }, { x: 2, y: 1 }]
  },
  'nivel1_3': {
    nombre: 'Nivel 1-3',
    emoji: "👶",
    color: "#FF6B9D",
    descripcion: "Arrastrá al muñequito por la grilla",
    dificultad: "Fácil",
    gridSize: 4,
    startPosition: { x: 1, y: 1 },
    target: { x: 2, y: 2 },
    obstacles: [{ x: 0, y: 0 }, { x: 3, y: 3 }]
  },
  'nivel1_4': {
    nombre: 'Nivel 1-4',
    emoji: "👶",
    color: "#FF6B9D",
    descripcion: "Arrastrá al muñequito por la grilla",
    dificultad: "Fácil",
    gridSize: 4,
    startPosition: { x: 0, y: 1 },
    target: { x: 3, y: 2 },
    obstacles: [{ x: 1, y: 0 }, { x: 2, y: 3 }]
  },
  'nivel1_5': {
    nombre: 'Nivel 1-5',
    emoji: "👶",
    color: "#FF6B9D",
    descripcion: "Arrastrá al muñequito por la grilla",
    dificultad: "Fácil",
    gridSize: 4,
    startPosition: { x: 2, y: 0 },
    target: { x: 1, y: 3 },
    obstacles: [{ x: 0, y: 2 }, { x: 3, y: 1 }]
  },
  'nivel1_6': {
    nombre: 'Nivel 1-6',
    emoji: "👶",
    color: "#FF6B9D",
    descripcion: "Arrastrá al muñequito por la grilla",
    dificultad: "Fácil",
    gridSize: 4,
    startPosition: { x: 3, y: 0 },
    target: { x: 0, y: 3 },
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }]
  },
  'nivel1_7': {
    nombre: 'Nivel 1-7',
    emoji: "👶",
    color: "#FF6B9D",
    descripcion: "Arrastrá al muñequito por la grilla",
    dificultad: "Fácil",
    gridSize: 4,
    startPosition: { x: 1, y: 0 },
    target: { x: 2, y: 3 },
    obstacles: [{ x: 0, y: 1 }, { x: 3, y: 2 }]
  },
  'nivel1_8': {
    nombre: 'Nivel 1-8',
    emoji: "👶",
    color: "#FF6B9D",
    descripcion: "Arrastrá al muñequito por la grilla",
    dificultad: "Fácil",
    gridSize: 4,
    startPosition: { x: 0, y: 2 },
    target: { x: 3, y: 1 },
    obstacles: [{ x: 1, y: 0 }, { x: 2, y: 3 }]
  },
  'nivel1_9': {
    nombre: 'Nivel 1-9',
    emoji: "👶",
    color: "#FF6B9D",
    descripcion: "Arrastrá al muñequito por la grilla",
    dificultad: "Fácil",
    gridSize: 4,
    startPosition: { x: 2, y: 1 },
    target: { x: 1, y: 2 },
    obstacles: [{ x: 0, y: 0 }, { x: 3, y: 3 }]
  },
  'nivel1_10': {
    nombre: 'Nivel 1-10',
    emoji: "👶",
    color: "#FF6B9D",
    descripcion: "Arrastrá al muñequito por la grilla",
    dificultad: "Fácil",
    gridSize: 4,
    startPosition: { x: 3, y: 1 },
    target: { x: 0, y: 2 },
    obstacles: [{ x: 1, y: 0 }, { x: 2, y: 3 }]
  },

  // Nivel 2: Flechas (10 niveles)
  'nivel2_1': {
    nombre: 'Nivel 2-1',
    emoji: "🧒",
    color: "#4ECDC4",
    descripcion: "Arrastrá flechas sobre la grilla",
    dificultad: "Intermedio",
    gridSize: 5,
    startPosition: { x: 0, y: 0 },
    target: { x: 4, y: 4 },
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 1 }]
  },
  'nivel2_2': {
    nombre: 'Nivel 2-2',
    emoji: "🧒",
    color: "#4ECDC4",
    descripcion: "Arrastrá flechas sobre la grilla",
    dificultad: "Intermedio",
    gridSize: 5,
    startPosition: { x: 0, y: 4 },
    target: { x: 4, y: 0 },
    obstacles: [{ x: 1, y: 3 }, { x: 2, y: 1 }, { x: 3, y: 1 }]
  },
  'nivel2_3': {
    nombre: 'Nivel 2-3',
    emoji: "🧒",
    color: "#4ECDC4",
    descripcion: "Arrastrá flechas sobre la grilla",
    dificultad: "Intermedio",
    gridSize: 5,
    startPosition: { x: 2, y: 2 },
    target: { x: 0, y: 0 },
    obstacles: [{ x: 1, y: 1 }, { x: 3, y: 3 }, { x: 4, y: 4 }]
  },
  'nivel2_4': {
    nombre: 'Nivel 2-4',
    emoji: "🧒",
    color: "#4ECDC4",
    descripcion: "Arrastrá flechas sobre la grilla",
    dificultad: "Intermedio",
    gridSize: 5,
    startPosition: { x: 4, y: 0 },
    target: { x: 0, y: 4 },
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }]
  },
  'nivel2_5': {
    nombre: 'Nivel 2-5',
    emoji: "🧒",
    color: "#4ECDC4",
    descripcion: "Arrastrá flechas sobre la grilla",
    dificultad: "Intermedio",
    gridSize: 5,
    startPosition: { x: 0, y: 2 },
    target: { x: 3, y: 1 },
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 3 }, { x: 4, y: 2 }]
  },
  'nivel2_6': {
    nombre: 'Nivel 2-6',
    emoji: "🧒",
    color: "#4ECDC4",
    descripcion: "Arrastrá flechas sobre la grilla",
    dificultad: "Intermedio",
    gridSize: 5,
    startPosition: { x: 2, y: 0 },
    target: { x: 1, y: 3 },
    obstacles: [{ x: 1, y: 1 }, { x: 3, y: 3 }, { x: 4, y: 1 }]
  },
  'nivel2_7': {
    nombre: 'Nivel 2-7',
    emoji: "🧒",
    color: "#4ECDC4",
    descripcion: "Arrastrá flechas sobre la grilla",
    dificultad: "Intermedio",
    gridSize: 5,
    startPosition: { x: 1, y: 1 },
    target: { x: 3, y: 3 },
    obstacles: [{ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 4, y: 2 }]
  },
  'nivel2_8': {
    nombre: 'Nivel 2-8',
    emoji: "🧒",
    color: "#4ECDC4",
    descripcion: "Arrastrá flechas sobre la grilla",
    dificultad: "Intermedio",
    gridSize: 5,
    startPosition: { x: 3, y: 1 },
    target: { x: 1, y: 3 },
    obstacles: [{ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 4, y: 2 }]
  },
  'nivel2_9': {
    nombre: 'Nivel 2-9',
    emoji: "🧒",
    color: "#4ECDC4",
    descripcion: "Arrastrá flechas sobre la grilla",
    dificultad: "Intermedio",
    gridSize: 5,
    startPosition: { x: 0, y: 1 },
    target: { x: 4, y: 3 },
    obstacles: [{ x: 1, y: 0 }, { x: 2, y: 2 }, { x: 3, y: 2 }]
  },
  'nivel2_10': {
    nombre: 'Nivel 2-10',
    emoji: "🧒",
    color: "#4ECDC4",
    descripcion: "Arrastrá flechas sobre la grilla",
    dificultad: "Intermedio",
    gridSize: 5,
    startPosition: { x: 4, y: 1 },
    target: { x: 0, y: 3 },
    obstacles: [{ x: 1, y: 0 }, { x: 2, y: 2 }, { x: 3, y: 2 }]
  },

  // Nivel 3: Secuencia (10 niveles)
  'nivel3_1': {
    nombre: 'Nivel 3-1',
    emoji: "👦",
    color: "#45B7D1",
    descripcion: "Armá secuencia de flechas y presioná Play",
    dificultad: "Avanzado",
    gridSize: 5,
    startPosition: { x: 0, y: 0 },
    target: { x: 4, y: 4 },
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 1 }]
  },
  'nivel3_2': {
    nombre: 'Nivel 3-2',
    emoji: "👦",
    color: "#45B7D1",
    descripcion: "Armá secuencia de flechas y presioná Play",
    dificultad: "Avanzado",
    gridSize: 5,
    startPosition: { x: 0, y: 4 },
    target: { x: 4, y: 0 },
    obstacles: [{ x: 1, y: 3 }, { x: 2, y: 1 }, { x: 3, y: 1 }]
  },
  'nivel3_3': {
    nombre: 'Nivel 3-3',
    emoji: "👦",
    color: "#45B7D1",
    descripcion: "Armá secuencia de flechas y presioná Play",
    dificultad: "Avanzado",
    gridSize: 5,
    startPosition: { x: 2, y: 2 },
    target: { x: 0, y: 0 },
    obstacles: [{ x: 1, y: 1 }, { x: 3, y: 3 }, { x: 4, y: 4 }]
  },
  'nivel3_4': {
    nombre: 'Nivel 3-4',
    emoji: "👦",
    color: "#45B7D1",
    descripcion: "Armá secuencia de flechas y presioná Play",
    dificultad: "Avanzado",
    gridSize: 5,
    startPosition: { x: 4, y: 0 },
    target: { x: 0, y: 4 },
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }]
  },
  'nivel3_5': {
    nombre: 'Nivel 3-5',
    emoji: "👦",
    color: "#45B7D1",
    descripcion: "Armá secuencia de flechas y presioná Play",
    dificultad: "Avanzado",
    gridSize: 5,
    startPosition: { x: 0, y: 2 },
    target: { x: 3, y: 1 },
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 3 }, { x: 4, y: 2 }]
  },
  'nivel3_6': {
    nombre: 'Nivel 3-6',
    emoji: "👦",
    color: "#45B7D1",
    descripcion: "Armá secuencia de flechas y presioná Play",
    dificultad: "Avanzado",
    gridSize: 5,
    startPosition: { x: 2, y: 0 },
    target: { x: 1, y: 3 },
    obstacles: [{ x: 1, y: 1 }, { x: 3, y: 3 }, { x: 4, y: 1 }]
  },
  'nivel3_7': {
    nombre: 'Nivel 3-7',
    emoji: "👦",
    color: "#45B7D1",
    descripcion: "Armá secuencia de flechas y presioná Play",
    dificultad: "Avanzado",
    gridSize: 5,
    startPosition: { x: 1, y: 1 },
    target: { x: 3, y: 3 },
    obstacles: [{ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 4, y: 1 }]
  },
  'nivel3_8': {
    nombre: 'Nivel 3-8',
    emoji: "👦",
    color: "#45B7D1",
    descripcion: "Armá secuencia de flechas y presioná Play",
    dificultad: "Avanzado",
    gridSize: 5,
    startPosition: { x: 3, y: 1 },
    target: { x: 1, y: 3 },
    obstacles: [{ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 4, y: 1 }]
  },
  'nivel3_9': {
    nombre: 'Nivel 3-9',
    emoji: "👦",
    color: "#45B7D1",
    descripcion: "Armá secuencia de flechas y presioná Play",
    dificultad: "Avanzado",
    gridSize: 5,
    startPosition: { x: 0, y: 1 },
    target: { x: 4, y: 3 },
    obstacles: [{ x: 1, y: 0 }, { x: 2, y: 2 }, { x: 3, y: 1 }]
  },
  'nivel3_10': {
    nombre: 'Nivel 3-10',
    emoji: "👦",
    color: "#45B7D1",
    descripcion: "Armá secuencia de flechas y presioná Play",
    dificultad: "Avanzado",
    gridSize: 5,
    startPosition: { x: 4, y: 1 },
    target: { x: 0, y: 3 },
    obstacles: [{ x: 1, y: 0 }, { x: 2, y: 2 }, { x: 3, y: 1 }]
  }
};




// Función para verificar conflictos entre obstáculos y target
const verificarConflictos = () => {
  console.log("🔍 Verificando conflictos en niveles...");
  const conflictos = [];
  
  Object.entries(NIVELES_PREDEFINIDOS).forEach(([key, nivel]) => {
    // Verificar obstáculos en target
    const obstaculosEnTarget = nivel.obstacles.filter(obs => 
      obs.x === nivel.target.x && obs.y === nivel.target.y
    );
    
    // Verificar obstáculos en startPosition
    const obstaculosEnStart = nivel.obstacles.filter(obs => 
      obs.x === nivel.startPosition.x && obs.y === nivel.startPosition.y
    );
    
    // Verificar target en startPosition
    const targetEnStart = nivel.target.x === nivel.startPosition.x && nivel.target.y === nivel.startPosition.y;
    
    if (obstaculosEnTarget.length > 0) {
      conflictos.push(`${key}: obstáculo en target (${nivel.target.x},${nivel.target.y})`);
    }
    if (obstaculosEnStart.length > 0) {
      conflictos.push(`${key}: obstáculo en start (${nivel.startPosition.x},${nivel.startPosition.y})`);
    }
    if (targetEnStart) {
      conflictos.push(`${key}: target en start (${nivel.startPosition.x},${nivel.startPosition.y})`);
    }
  });
  
  if (conflictos.length > 0) {
    console.log("❌ CONFLICTOS ENCONTRADOS:");
    conflictos.forEach(conflicto => console.log(`  - ${conflicto}`));
  } else {
    console.log("✅ Todos los niveles están correctos");
  }
};

// Ejecutar verificación
verificarConflictos();

// Función adicional para verificar conflictos específicos
const verificarConflictosEspecificos = () => {
  console.log("\n🔍 VERIFICACIÓN ESPECÍFICA DE CONFLICTOS:");
  
  // Verificar niveles 2 y 3 específicamente
  const nivelesProblematicos = [
    'nivel2_1', 'nivel2_2', 'nivel2_4', 'nivel2_7', 'nivel2_8', 'nivel2_9', 'nivel2_10',
    'nivel3_1', 'nivel3_2', 'nivel3_4', 'nivel3_7', 'nivel3_8', 'nivel3_9', 'nivel3_10'
  ];
  
  nivelesProblematicos.forEach(key => {
    const nivel = NIVELES_PREDEFINIDOS[key];
    if (nivel) {
      console.log(`\n📋 ${key}:`);
      console.log(`  Target: (${nivel.target.x}, ${nivel.target.y})`);
      console.log(`  Obstáculos: ${nivel.obstacles.map(obs => `(${obs.x}, ${obs.y})`).join(', ')}`);
      
      const conflictos = nivel.obstacles.filter(obs => 
        obs.x === nivel.target.x && obs.y === nivel.target.y
      );
      
      if (conflictos.length > 0) {
        console.log(`  ❌ CONFLICTO ENCONTRADO: obstáculo en target`);
      } else {
        console.log(`  ✅ Sin conflictos`);
      }
    }
  });
};

verificarConflictosEspecificos();

const NIVELES = NIVELES_PREDEFINIDOS;

const Game1Container = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState("SELECT_GAME_TYPE"); // SELECT_GAME_TYPE, SELECT_LEVEL, PLAYING, CELEBRATION
  const [selectedGameType, setSelectedGameType] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState([]);
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

  const handleBack = () => {
    if (navigationHistory.length > 0) {
      const previousState = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setGameState(previousState);
      
      if (previousState === "SELECT_GAME_TYPE") {
        setSelectedGameType(null);
        setSelectedLevel(null);
      } else if (previousState === "SELECT_LEVEL") {
        setSelectedLevel(null);
      }
    }
  };

  const navigateToState = (newState) => {
    setNavigationHistory(prev => [...prev, gameState]);
    setGameState(newState);
  };

  const handleGameTypeSelect = (gameType) => {
    setSelectedGameType(gameType);
    navigateToState("SELECT_LEVEL");
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    navigateToState("PLAYING");
    resetGame(level); // Pasar el level como parámetro
  };

  const resetGame = (levelKey = selectedLevel) => {
    console.log('🔄 Reseteando juego...');
    const nivel = NIVELES[levelKey];
    if (nivel) {
      console.log('📋 Nivel cargado:', nivel);
      console.log('🤖 Posición inicial:', nivel.startPosition);
      console.log('🎯 Target:', nivel.target);
      console.log('🪨 Obstáculos:', nivel.obstacles);
      setCharacterPosition(nivel.startPosition);
      setTargetPosition(nivel.target);
      setGridPath([nivel.startPosition]); // Pintar el primer cuadradito
    } else {
      console.log('❌ No se pudo cargar el nivel:', levelKey);
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
      // Nivel 1: Mover personaje solo a celdas adyacentes (no diagonal, no saltos)
      const currentPos = characterPosition;
      const dx = Math.abs(x - currentPos.x);
      const dy = Math.abs(y - currentPos.y);
      
      // Solo permitir movimiento a celdas adyacentes (horizontal o vertical)
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
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
      
      // Crear secuencia de movimientos siguiendo el CAMINO de las flechas
      const movements = [];
      let currentPos = { ...currentRobotPos };
      let maxSteps = 20; // Evitar loops infinitos
      let steps = 0;
      
      console.log(`🤖 Robot inicia en: (${currentPos.x}, ${currentPos.y})`);
      
      // Seguir el camino de las flechas desde la posición del robot
      while (steps < maxSteps) {
        const cellKey = `${currentPos.x}-${currentPos.y}`;
        const arrowInCurrentPosition = gridArrows[cellKey];
        
        if (arrowInCurrentPosition) {
          console.log(`➡️ Flecha encontrada en (${currentPos.x}, ${currentPos.y}): ${arrowInCurrentPosition.emoji}`);
          movements.push(arrowInCurrentPosition);
          
          // Calcular siguiente posición
          const nextPos = {
            x: currentPos.x + arrowInCurrentPosition.x,
            y: currentPos.y + arrowInCurrentPosition.y
          };
          
          // Verificar límites
          if (nextPos.x < 0 || nextPos.x >= nivel.gridSize || nextPos.y < 0 || nextPos.y >= nivel.gridSize) {
            console.log(`❌ Siguiente posición fuera de límites: (${nextPos.x}, ${nextPos.y})`);
            break;
          }
          
          // Verificar obstáculos
          const hasObstacle = nivel.obstacles.some(obs => obs.x === nextPos.x && obs.y === nextPos.y);
          if (hasObstacle) {
            console.log(`❌ Obstáculo en siguiente posición: (${nextPos.x}, ${nextPos.y})`);
            break;
          }
          
          currentPos = nextPos;
          console.log(`🚶 Robot se mueve a: (${currentPos.x}, ${currentPos.y})`);
        } else {
          console.log(`🛑 No hay flecha en (${currentPos.x}, ${currentPos.y}) - fin del camino`);
          break;
        }
        
        steps++;
      }
      
      console.log('🔄 Secuencia de movimientos:', movements);
      
      if (movements.length === 0) {
        console.log('❌ No hay movimientos para ejecutar - robot no está en una flecha');
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
            className={`w-20 h-20 rounded-xl border-2 border-gray-200 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${bgColor} shadow-soft`}
            style={{
              background: isCharacter ? 'linear-gradient(135deg, #FFD93D 0%, #FF8C42 100%)' : 
                          isTarget ? 'linear-gradient(135deg, #FF6B9D 0%, #FFB3BA 100%)' :
                          isObstacle ? 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)' :
                          isInPath ? 'linear-gradient(135deg, #4A90E2 0%, #A8E6CF 100%)' :
                          'linear-gradient(135deg, #F5F5DC 0%, #FFF8E1 100%)',
              boxShadow: isCharacter ? '0 8px 25px rgba(255, 217, 61, 0.4)' :
                          isTarget ? '0 8px 25px rgba(255, 107, 157, 0.4)' :
                          isObstacle ? '0 8px 25px rgba(139, 92, 246, 0.4)' :
                          '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
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
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background blobs */}
      <div className="background-blob blob-1" style={{ top: '5%', right: '5%', width: '60px', height: '60px' }}></div>
      <div className="background-blob blob-2" style={{ top: '15%', left: '10%', width: '80px', height: '80px' }}></div>
      <div className="background-blob blob-3" style={{ top: '70%', right: '15%', width: '70px', height: '70px' }}></div>
      <div className="background-blob blob-4" style={{ top: '80%', left: '5%', width: '50px', height: '50px', animationDelay: '2s' }}></div>
      <div className="background-blob blob-5" style={{ top: '40%', left: '80%', width: '90px', height: '90px', animationDelay: '1s' }}></div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToHome}
            className="card-modern p-3 text-2xl hover:scale-110 transition-all duration-300 shadow-soft"
          >
            🏠
          </button>
          
          {navigationHistory.length > 0 && (
            <button
              onClick={handleBack}
              className="card-modern p-3 text-2xl hover:scale-110 transition-all duration-300 shadow-soft"
            >
              ⬅️
            </button>
          )}
        </div>
        
        {selectedLevel && gameState !== "SELECT_GAME_TYPE" && (
          <div className="card-modern px-4 py-2 text-center shadow-soft">
            <div className="text-lg font-bold text-gray-800 mb-1">
              {NIVELES[selectedLevel].emoji} {NIVELES[selectedLevel].nombre}
            </div>
            <div className="text-xs text-gray-600">
              {NIVELES[selectedLevel].dificultad}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <div className="card-modern px-4 py-2 text-2xl font-bold text-gray-800 shadow-soft">
            ⭐ {score}
          </div>
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`card-modern p-3 text-2xl transition-all duration-300 hover:scale-110 shadow-soft ${
              audioEnabled ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {audioEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        {/* Selección de tipo de juego */}
        {gameState === "SELECT_GAME_TYPE" && (
          <div className="text-center">
            <div className="card-modern p-4 shadow-soft mb-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                🎮 Juego de Grilla y Personaje
              </h2>
              <p className="text-base text-gray-600 mb-2">
                ¡Ayudá al personaje a llegar a la meta!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <button
                onClick={() => handleGameTypeSelect('nivel1')}
                className="transition-all duration-300 transform hover:scale-105 focus:outline-none group"
              >
                <div 
                  className="w-60 h-60 rounded-2xl shadow-soft hover:shadow-glow p-6 text-center transition-all duration-300 flex flex-col justify-center"
                  style={{ 
                    background: '#FF6B9D',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <div className="flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
                    <div className="text-5xl">👶</div>
                  </div>
                  <div className="text-xl font-bold text-white mb-3 leading-tight">
                    Nivel 1
                  </div>
                  <div className="text-sm text-white leading-tight">
                    Arrastrá al muñequito
                  </div>
                </div>
                </button>
              
              <button
                onClick={() => handleGameTypeSelect('nivel2')}
                className="transition-all duration-300 transform hover:scale-105 focus:outline-none group"
              >
                <div 
                  className="w-60 h-60 rounded-2xl shadow-soft hover:shadow-glow p-6 text-center transition-all duration-300 flex flex-col justify-center"
                  style={{ 
                    background: '#4ECDC4',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <div className="flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
                    <div className="text-5xl">🧒</div>
                  </div>
                  <div className="text-xl font-bold text-white mb-3 leading-tight">
                    Nivel 2
                  </div>
                  <div className="text-sm text-white leading-tight">
                    Arrastrá flechas
                  </div>
                </div>
              </button>
              
                <button
                onClick={() => handleGameTypeSelect('nivel3')}
                className="transition-all duration-300 transform hover:scale-105 focus:outline-none group"
              >
                <div 
                  className="w-60 h-60 rounded-2xl shadow-soft hover:shadow-glow p-6 text-center transition-all duration-300 flex flex-col justify-center"
                  style={{ 
                    background: '#45B7D1',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <div className="flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
                    <div className="text-5xl">👦</div>
                  </div>
                  <div className="text-xl font-bold text-white mb-3 leading-tight">
                    Nivel 3
                  </div>
                  <div className="text-sm text-white leading-tight">
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
            <div className="card-modern p-6 shadow-soft mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Seleccioná un nivel
              </h2>
              <p className="text-base text-gray-600 mb-4">
                {selectedGameType === 'nivel1' && 'Arrastrá al muñequito por la grilla'}
                {selectedGameType === 'nivel2' && 'Arrastrá flechas sobre la grilla'}
                {selectedGameType === 'nivel3' && 'Armá secuencia de flechas y presioná Play'}
              </p>
            </div>
            
            <div className="grid grid-cols-5 gap-4 max-w-2xl">
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
                      className="w-20 h-20 rounded-2xl shadow-soft hover:shadow-glow p-4 text-center transition-all duration-300 flex flex-col justify-center"
                      style={{ 
                        background: nivel.color,
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                      }}
                    >
                      <div className="text-3xl mb-1">{nivel.emoji}</div>
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
            <div className="card-modern p-8 shadow-soft">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                {NIVELES[selectedLevel].emoji} {NIVELES[selectedLevel].nombre}
              </h2>

              {/* Instrucciones específicas por nivel */}
              {selectedGameType === 'nivel1' && (
                <div className="text-center mb-6">
                  <p className="text-lg text-gray-600">
                    Arrastrá al robot por la grilla hasta llegar al target
                  </p>
                </div>
              )}

              {selectedGameType === 'nivel2' && (
                <div className="text-center mb-6">
                  <p className="text-lg text-gray-600">
                    Arrastrá las flechas y el target a la grilla
                  </p>
                  <div className="text-xs text-gray-500 mb-4">
                    💡 Toca una casilla con flecha para borrarla
                  </div>
                  
                  
                  {/* Controles de flechas y target */}
                  <div className="flex justify-center gap-4 mb-4">
                    {Object.values(DIRECTIONS).map((direction) => (
                      <div
                        key={direction.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, direction)}
                        onDragEnd={handleDragEnd}
                        className="w-16 h-16 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-all duration-300 text-2xl shadow-soft"
                        style={{
                          background: 'linear-gradient(135deg, #4A90E2 0%, #A8E6CF 100%)',
                          boxShadow: '0 8px 25px rgba(74, 144, 226, 0.3)'
                        }}
                      >
                        {direction.emoji}
                      </div>
                    ))}
                    
                    <div
                      draggable
                      onDragStart={handleTargetDragStart}
                      onDragEnd={handleDragEnd}
                      className="w-16 h-16 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-all duration-300 text-2xl shadow-soft"
                      style={{
                        background: 'linear-gradient(135deg, #FF6B9D 0%, #FFB3BA 100%)',
                        boxShadow: '0 8px 25px rgba(255, 107, 157, 0.3)'
                      }}
                    >
                      🎯
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={executeArrowPath}
                      disabled={isPlaying}
                      className={`py-2 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
                        placedTarget 
                          ? 'hover:scale-105 shadow-soft' 
                          : 'cursor-not-allowed'
                      }`}
                      style={{
                        background: placedTarget 
                          ? 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)'
                          : 'linear-gradient(135deg, #D3D3D3 0%, #A8A8A8 100%)',
                        color: 'white',
                        boxShadow: placedTarget 
                          ? '0 4px 15px rgba(78, 205, 196, 0.3)'
                          : '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {isPlaying ? 'Ejecutando...' : '▶️ Ejecutar'}
                    </button>
                  </div>
                </div>
              )}

              {selectedGameType === 'nivel3' && (
                <div className="text-center mb-6">
                  <p className="text-lg text-gray-600">
                    Armá secuencia de flechas y presioná Play
                  </p>
                  
                  {/* Controles de flechas para nivel 3 */}
                  <div className="flex justify-center gap-2 mb-4">
                    {Object.values(DIRECTIONS).map((direction) => (
                      <button
                        key={direction.id}
                        onClick={() => handleArrowSelect(direction)}
                        className="w-12 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xl"
                      >
                        {direction.emoji}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-4">
                    {sequence.map((direction, index) => (
                      <div key={index} className="text-2xl">{direction.emoji}</div>
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

              {/* Grilla */}
              <div className="flex justify-center mb-6">
                <div 
                  className="grid gap-3 p-8 rounded-2xl shadow-glow"
                  style={{ 
                    gridTemplateColumns: `repeat(${NIVELES[selectedLevel].gridSize}, 1fr)`,
                    background: '#4A90E2',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {renderGrid()}
                </div>
              </div>





            </div>
          </div>
        )}

        {/* Celebración */}
        {gameState === "CELEBRATION" && (
          <div className="text-center">
            <div className="card-modern p-8 shadow-soft">
              <div className="text-8xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-4xl font-bold text-green-600 mb-4">
                ¡Llegaste a la meta!
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                ¡Excelente trabajo! +50 puntos
              </p>
              
              <div className="card-modern p-6 mb-6 shadow-soft" style={{ backgroundColor: '#FFF3CD' }}>
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
                        resetGame(nextLevelKey);
                      }}
                      className="btn-primary py-3 px-6 text-lg font-bold"
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
                  className="btn-secondary py-3 px-6 text-lg font-bold"
                >
                  🔄 Jugar de Nuevo
                </button>
                
                {/* Elegir nivel */}
                <button
                  onClick={() => setGameState("SELECT_LEVEL")}
                  className="btn-primary py-3 px-6 text-lg font-bold"
                >
                  🎯 Elegir Nivel
                </button>
                
                {/* Volver a home */}
                  <button
                  onClick={() => setGameState("SELECT_GAME_TYPE")}
                  className="btn-secondary py-3 px-6 text-lg font-bold"
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
