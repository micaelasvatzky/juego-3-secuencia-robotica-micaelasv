"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Ingredientes disponibles
const ingredientes = [
  {
    id: 1,
    nombre: "Pan",
    emoji: "🍞",
    color: "#D2691E",
    categoria: "base",
    forma: "pan" // Forma especial para el pan
  },
  {
    id: 2,
    nombre: "Carne",
    emoji: "🥩",
    color: "#8B4513",
    categoria: "proteina",
    forma: "redonda"
  },
  {
    id: 3,
    nombre: "Lechuga",
    emoji: "🥬",
    color: "#90EE90",
    categoria: "vegetal",
    forma: "hojas"
  },
  {
    id: 4,
    nombre: "Tomate",
    emoji: "🍅",
    color: "#FF6347",
    categoria: "vegetal",
    forma: "redonda"
  },
  {
    id: 5,
    nombre: "Queso",
    emoji: "🧀",
    color: "#FFD700",
    categoria: "lacteo",
    forma: "cuadrada"
  },
  {
    id: 6,
    nombre: "Cebolla",
    emoji: "🧅",
    color: "#F5DEB3",
    categoria: "vegetal",
    forma: "redonda"
  },
  {
    id: 7,
    nombre: "Pepino",
    emoji: "🥒",
    color: "#32CD32",
    categoria: "vegetal",
    forma: "alargada"
  },
  {
    id: 8,
    nombre: "Huevo",
    emoji: "🥚",
    color: "#FFF8DC",
    categoria: "proteina",
    forma: "redonda"
  },
  {
    id: 9,
    nombre: "Bacon",
    emoji: "🥓",
    color: "#CD853F",
    categoria: "proteina",
    forma: "alargada"
  },
  {
    id: 10,
    nombre: "Aguacate",
    emoji: "🥑",
    color: "#228B22",
    categoria: "vegetal",
    forma: "redonda"
  }
];

// Distractores (ingredientes similares)
const distractores = [
  {
    id: 99,
    nombre: "Cebolla Morada",
    emoji: "🧅",
    color: "#8B008B",
    categoria: "vegetal"
  },
  {
    id: 98,
    nombre: "Pan Integral",
    emoji: "🍞",
    color: "#8B4513",
    categoria: "base"
  },
  {
    id: 97,
    nombre: "Queso Azul",
    emoji: "🧀",
    color: "#4169E1",
    categoria: "lacteo"
  }
];

// Generar 10 niveles para cada tipo de receta
const generateRecipeLevels = () => {
  const levels = {};
  
  // Nivel Fácil: 10 niveles
  for (let i = 1; i <= 10; i++) {
    levels[`facil_${i}`] = {
      nombre: `Fácil-${i}`,
    emoji: "🌟",
    color: "#FF6B9D",
    descripcion: "2-3 ingredientes simples",
    recetas: [
      {
        id: 1,
        nombre: "Hamburguesa Simple",
        emoji: "🍔",
        imagen: "🍔",
        ingredientes: [1, 2, 3], // Pan, Carne, Lechuga
        orden: [1, 2, 3]
      },
      {
        id: 2,
        nombre: "Sándwich de Queso",
        emoji: "🥪",
        imagen: "🥪",
        ingredientes: [1, 5, 4], // Pan, Queso, Tomate
        orden: [1, 5, 4]
      },
      {
        id: 3,
        nombre: "Hamburguesa Clásica",
        emoji: "🍔",
        imagen: "🍔",
        ingredientes: [1, 2, 3, 4], // Pan, Carne, Lechuga, Tomate
        orden: [1, 2, 3, 4]
      }
    ],
    distractores: []
    };
  }
  
  // Nivel Intermedio: 10 niveles
  for (let i = 1; i <= 10; i++) {
    levels[`intermedio_${i}`] = {
      nombre: `Intermedio-${i}`,
    emoji: "🚀",
    color: "#4ECDC4",
    descripcion: "4-5 ingredientes",
    recetas: [
      {
        id: 4,
        nombre: "Hamburguesa Completa",
        emoji: "🍔",
        imagen: "🍔",
        ingredientes: [1, 2, 3, 4, 5], // Pan, Carne, Lechuga, Tomate, Queso
        orden: [1, 2, 3, 4, 5]
      },
      {
        id: 5,
        nombre: "Sándwich Premium",
        emoji: "🥪",
        imagen: "🥪",
        ingredientes: [1, 2, 3, 4, 6], // Pan, Carne, Lechuga, Tomate, Cebolla
        orden: [1, 2, 3, 4, 6]
      },
      {
        id: 6,
        nombre: "Hamburguesa Gourmet",
        emoji: "🍔",
        imagen: "🍔",
        ingredientes: [1, 2, 3, 4, 5, 6], // Pan, Carne, Lechuga, Tomate, Queso, Cebolla
        orden: [1, 2, 3, 4, 5, 6]
      }
    ],
    distractores: []
    };
  }
  
  // Nivel Difícil: 10 niveles
  for (let i = 1; i <= 10; i++) {
    levels[`dificil_${i}`] = {
      nombre: `Difícil-${i}`,
    emoji: "🎯",
    color: "#45B7D1",
    descripcion: "6+ ingredientes con distractores",
    recetas: [
      {
        id: 7,
        nombre: "Hamburguesa Deluxe",
        emoji: "🍔",
        imagen: "🍔",
        ingredientes: [1, 2, 3, 4, 5, 6, 7], // Pan, Carne, Lechuga, Tomate, Queso, Cebolla, Pepino
        orden: [1, 2, 3, 4, 5, 6, 7]
      },
      {
        id: 8,
        nombre: "Hamburguesa Suprema",
        emoji: "🍔",
        imagen: "🍔",
        ingredientes: [1, 2, 3, 4, 5, 6, 8, 9], // Pan, Carne, Lechuga, Tomate, Queso, Cebolla, Huevo, Bacon
        orden: [1, 2, 3, 4, 5, 6, 8, 9]
      },
      {
        id: 9,
        nombre: "Hamburguesa Gourmet Plus",
        emoji: "🍔",
        imagen: "🍔",
        ingredientes: [1, 2, 3, 4, 5, 6, 7, 10], // Pan, Carne, Lechuga, Tomate, Queso, Cebolla, Pepino, Aguacate
        orden: [1, 2, 3, 4, 5, 6, 7, 10]
      }
    ],
    distractores: [99, 98, 97] // Cebolla Morada, Pan Integral, Queso Azul
    };
  }
  
  return levels;
};

const recetasPorNivel = generateRecipeLevels();

const Game2Container = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState("SELECT_GAME_TYPE"); // SELECT_GAME_TYPE, SELECT_LEVEL, PLAYING, VALIDATING, CELEBRATION, RETRY
  const [selectedGameType, setSelectedGameType] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [ingredientesEnPlato, setIngredientesEnPlato] = useState([]);
  const [draggedIngrediente, setDraggedIngrediente] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [completedRecipes, setCompletedRecipes] = useState(0);
  const audioContextRef = useRef(null);

  // Obtener configuración del nivel actual
  const configNivel = recetasPorNivel[selectedLevel];
  
  // Obtener la receta actual
  const recetaActual = configNivel?.recetas[currentRecipeIndex];
  
  // Generar ingredientes para esta receta
  const ingredientesReceta = recetaActual?.ingredientes.map(id => 
    ingredientes.find(i => i.id === id)
  ).filter(Boolean) || [];
  
  // Agregar distractores si es nivel difícil
  const todosLosIngredientes = [...ingredientes];
  if (configNivel?.distractores.length > 0) {
    const distractoresNivel = configNivel.distractores.map(id => 
      distractores.find(d => d.id === id)
    ).filter(Boolean);
    todosLosIngredientes.push(...distractoresNivel);
  }

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

  const playDropSound = () => {
    playSound(400, 0.1);
  };

  const handleBackToHome = () => {
    router.push("/");
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
    setCurrentRecipeIndex(0);
    setIngredientesEnPlato([]);
    setCompletedRecipes(0);
  };

  const handleDragStart = (e, ingrediente) => {
    setDraggedIngrediente(ingrediente);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    playDropSound();
  };

  const handleIngredienteFromPlateDragStart = (e, index) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    playDropSound();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedIngrediente(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedIngrediente) {
      setIngredientesEnPlato(prev => [...prev, draggedIngrediente]);
      setDraggedIngrediente(null);
      setIsDragging(false);
      playDropSound();
    }
  };

  const handleIngredienteRemove = (index) => {
    setIngredientesEnPlato(prev => prev.filter((_, i) => i !== index));
    playDropSound();
  };

  const validateRecipe = () => {
    setGameState("VALIDATING");
    setAttempts(prev => prev + 1);
    
    // Verificar si hay distractores en la receta
    const hasDistractors = ingredientesEnPlato.some(ingrediente => 
      configNivel.distractores.includes(ingrediente.id)
    );
    
    // Comparar la receta creada con la receta correcta
    const isCorrect = ingredientesEnPlato.every((ingrediente, index) => 
      ingrediente.id === ingredientesReceta[index]?.id
    ) && ingredientesEnPlato.length === ingredientesReceta.length && !hasDistractors;
    
    setTimeout(() => {
      if (isCorrect) {
        setScore(prev => prev + 100);
        setCompletedRecipes(prev => prev + 1);
        setGameState("CELEBRATION");
        playSuccessSound();
      } else {
        setGameState("RETRY");
        playErrorSound();
      }
    }, 2000);
  };

  const handleNextRecipe = () => {
    if (currentRecipeIndex < configNivel.recetas.length - 1) {
      setCurrentRecipeIndex(prev => prev + 1);
      setIngredientesEnPlato([]);
      setGameState("PLAYING");
    } else {
      // Todas las recetas completadas
      setGameState("CELEBRATION");
    }
  };

  const handleRetry = () => {
    setIngredientesEnPlato([]);
    setGameState("PLAYING");
  };

  const handleRestart = () => {
    setCurrentRecipeIndex(0);
    setIngredientesEnPlato([]);
    setCompletedRecipes(0);
    setGameState("PLAYING");
  };

  // Función para renderizar ingrediente con forma específica
  const renderIngrediente = (ingrediente, index, isInPlate = false) => {
    const baseClasses = isInPlate 
      ? "shadow-lg border-2 border-white transition-all duration-300 hover:scale-105"
      : "shadow-lg border-2 border-white transition-all duration-200 transform hover:scale-105";

    const getShapeClasses = (forma) => {
      switch (forma) {
        case "pan":
          return "w-24 h-6 rounded-full"; // Pan más ancho y bajo
        case "redonda":
          return "w-16 h-6 rounded-full"; // Ingredientes redondos
        case "cuadrada":
          return "w-16 h-6 rounded-lg"; // Queso cuadrado
        case "hojas":
          return "w-20 h-4 rounded-lg"; // Lechuga como hojas
        case "alargada":
          return "w-20 h-4 rounded-lg"; // Bacon, pepino alargados
        default:
          return "w-16 h-6 rounded-lg";
      }
    };

    return (
      <div
        className={`${getShapeClasses(ingrediente.forma)} ${baseClasses} flex items-center justify-center text-xl`}
        style={{ backgroundColor: ingrediente.color }}
      >
        {ingrediente.emoji}
      </div>
    );
  };

  // Función para renderizar la receta con ingredientes apilados
  const renderRecipeStack = (receta) => {
    const ingredientesReceta = receta.ingredientes.map(id => 
      ingredientes.find(i => i.id === id)
    ).filter(Boolean);

    return (
      <div className="relative flex flex-col-reverse items-center justify-center h-full">
        {ingredientesReceta.map((ingrediente, index) => (
          <div
            key={index}
            className="relative"
            style={{
              zIndex: index + 1,
              marginTop: index === 0 ? '0' : '-6px'
            }}
          >
            <div
              className={`${ingrediente.forma === "pan" ? "w-24 h-6 rounded-full" : 
                         ingrediente.forma === "redonda" ? "w-16 h-6 rounded-full" :
                         ingrediente.forma === "cuadrada" ? "w-16 h-6 rounded-lg" :
                         ingrediente.forma === "hojas" ? "w-20 h-4 rounded-lg" :
                         ingrediente.forma === "alargada" ? "w-20 h-4 rounded-lg" :
                         "w-16 h-6 rounded-lg"} shadow-lg border-2 border-white flex items-center justify-center text-xl`}
              style={{ backgroundColor: ingrediente.color }}
            >
              {ingrediente.emoji}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #FF6B9D 0%, #FFB3BA 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background blobs */}
      <div className="background-blob blob-1" style={{ top: '8%', right: '8%', width: '70px', height: '70px' }}></div>
      <div className="background-blob blob-2" style={{ top: '25%', left: '5%', width: '60px', height: '60px' }}></div>
      <div className="background-blob blob-3" style={{ top: '65%', right: '10%', width: '80px', height: '80px' }}></div>
      <div className="background-blob blob-4" style={{ top: '75%', left: '8%', width: '55px', height: '55px', animationDelay: '2.5s' }}></div>
      <div className="background-blob blob-5" style={{ top: '45%', left: '85%', width: '75px', height: '75px', animationDelay: '1.5s' }}></div>
      
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
        
        {/* Información del nivel - solo cuando no está en selección */}
        {selectedLevel && gameState !== "SELECT_GAME_TYPE" && (
          <div className="card-modern px-4 py-2 text-center shadow-soft">
            <div className="text-lg font-bold text-gray-800 mb-1">
              {configNivel.emoji} {configNivel.nombre}
            </div>
            <div className="text-xs text-gray-600">
              Receta {currentRecipeIndex + 1} de {configNivel.recetas.length}
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
              audioEnabled ? "text-green-600" : "text-gray-400"
            }`}
          >
            {audioEnabled ? "🔊" : "🔇"}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        {/* Selección de tipo de juego */}
        {gameState === "SELECT_GAME_TYPE" && (
          <div className="text-center">
            <div className="card-modern p-4 shadow-soft mb-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                🤖 El Juego del Chef Robot
              </h2>
              <p className="text-base text-gray-600 mb-2">
                ¡Ayudá al chef robot a preparar las recetas perfectas!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <button
                onClick={() => handleGameTypeSelect('facil')}
                  className="transition-all duration-300 transform hover:scale-105 focus:outline-none group"
                >
                  <div 
                    className="w-60 h-60 rounded-2xl shadow-soft hover:shadow-glow p-6 text-center transition-all duration-300 flex flex-col justify-center"
                    style={{ 
                      background: '#8B5CF6',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <div className="flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
                      <div className="text-5xl">🌟</div>
                    </div>
                  <div className="text-xl font-bold text-white mb-3 leading-tight">
                    Fácil
                  </div>
                  <div className="text-sm text-white leading-tight">
                    2-3 ingredientes simples
                  </div>
                  </div>
              </button>
              
              <button
                onClick={() => handleGameTypeSelect('intermedio')}
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
                    <div className="text-5xl">🚀</div>
                  </div>
                  <div className="text-xl font-bold text-white mb-3 leading-tight">
                    Intermedio
                  </div>
                  <div className="text-sm text-white leading-tight">
                    4-5 ingredientes
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleGameTypeSelect('dificil')}
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
                    <div className="text-5xl">🎯</div>
                  </div>
                  <div className="text-xl font-bold text-white mb-3 leading-tight">
                    Difícil
                  </div>
                  <div className="text-sm text-white leading-tight">
                    6+ ingredientes con distractores
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
                {selectedGameType === 'facil' && '2-3 ingredientes simples'}
                {selectedGameType === 'intermedio' && '4-5 ingredientes'}
                {selectedGameType === 'dificil' && '6+ ingredientes con distractores'}
              </p>
            </div>
            
            <div className="grid grid-cols-5 gap-4 max-w-2xl">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((levelNum) => {
                const levelKey = `${selectedGameType}_${levelNum}`;
                const nivel = recetasPorNivel[levelKey];
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

        {/* Juego de recetas */}
        {gameState === "PLAYING" && recetaActual && (
          <div className="w-full max-w-6xl">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                {recetaActual.emoji} {recetaActual.nombre}
              </h2>

              {/* Área de juego */}
              <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Imagen de la receta a recrear */}
                <div className="bg-gray-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">
                    Recreá esta receta
                  </h3>
                  <div className="flex items-center justify-center h-48 bg-white rounded-xl shadow-lg">
                    {renderRecipeStack(recetaActual)}
                  </div>
                </div>

                {/* Plato y tacho de basura */}
                <div className="space-y-4">
                {/* Plato donde arrastrar ingredientes */}
                <div className="bg-gray-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">
                    Tu plato
                  </h3>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`w-full h-48 border-4 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors duration-300 bg-white relative overflow-hidden ${
                      isDragging 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {ingredientesEnPlato.length === 0 ? (
                      <div className="text-center text-gray-500">
                        <div className="text-4xl mb-2">🍽️</div>
                        <p>{isDragging ? '¡Soltá aquí!' : 'Arrastrá los ingredientes aquí'}</p>
                      </div>
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                        {/* Hamburguesa apilada */}
                          <div className="relative flex flex-col-reverse items-center justify-center">
                          {ingredientesEnPlato.map((ingrediente, index) => (
                            <div
                              key={index}
                                className="relative group cursor-grab active:cursor-grabbing"
                                draggable
                                onDragStart={(e) => handleIngredienteFromPlateDragStart(e, index)}
                                onDragEnd={handleDragEnd}
                              style={{
                                zIndex: index + 1,
                                marginTop: index === 0 ? '0' : '-6px'
                              }}
                            >
                              {renderIngrediente(ingrediente, index, true)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Botón para validar */}
                  {ingredientesEnPlato.length > 0 && (
                    <button
                      onClick={validateRecipe}
                      className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-3 px-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      ✅ Verificar Receta
                    </button>
                  )}
                  </div>

                  {/* Tacho de basura fijo */}
                  <div 
                    className="bg-red-100 rounded-2xl p-4 border-2 border-red-300"
                    onDragOver={handleDragOver}
                    onDrop={(e) => {
                      e.preventDefault();
                      const index = parseInt(e.dataTransfer.getData('text/plain'));
                      if (!isNaN(index)) {
                        handleIngredienteRemove(index);
                      }
                    }}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">🗑️</div>
                      <p className="text-sm font-bold text-red-700">
                        Arrastrá aquí para eliminar
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ingredientes disponibles */}
                <div 
                  className="bg-gray-100 rounded-2xl p-6"
                  onDragOver={handleDragOver}
                  onDrop={(e) => {
                    e.preventDefault();
                    const index = parseInt(e.dataTransfer.getData('text/plain'));
                    if (!isNaN(index)) {
                      handleIngredienteRemove(index);
                    }
                  }}
                >
                  <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">
                    Ingredientes
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {todosLosIngredientes.map((ingrediente) => (
                      <div
                        key={ingrediente.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, ingrediente)}
                        onDragEnd={handleDragEnd}
                        className={`w-full h-16 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-200 ${
                          isDragging && draggedIngrediente?.id === ingrediente.id 
                            ? 'opacity-50 scale-95' 
                            : 'hover:scale-105'
                        }`}
                      >
                        {renderIngrediente(ingrediente, ingrediente.id, false)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progreso */}
              <div className="mt-6">
                <div className="bg-gray-200 rounded-full h-4 w-full">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${(completedRecipes / configNivel.recetas.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {completedRecipes} de {configNivel.recetas.length} recetas completadas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Estado de validación */}
        {gameState === "VALIDATING" && (
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="text-6xl mb-6 animate-spin">🍳</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Verificando receta...
              </h2>
              <p className="text-lg text-gray-600">
                El chef está revisando tu trabajo
              </p>
            </div>
          </div>
        )}

        {/* Celebración */}
        {gameState === "CELEBRATION" && (
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="text-8xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-4xl font-bold text-green-600 mb-4">
                ¡Receta perfecta!
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                ¡Excelente trabajo! La receta está perfecta
              </p>
              
              <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#FFF3CD' }}>
                <div className="text-2xl font-bold mb-2" style={{ color: '#FF8C00' }}>
                  +100 puntos! ⭐
                </div>
                <div className="text-lg text-gray-700 mb-2">
                  Puntuación total: {score}
                </div>
                <div className="text-sm text-gray-600">
                  Recetas completadas: {completedRecipes}/{configNivel.recetas.length}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 justify-center">
                {/* Siguiente receta o siguiente nivel */}
                {currentRecipeIndex < configNivel.recetas.length - 1 ? (
                  <button
                    onClick={handleNextRecipe}
                    className="text-white py-3 px-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{ backgroundColor: '#10B981' }}
                  >
                    ➡️ Siguiente Receta
                  </button>
                ) : (() => {
                  const currentLevelNum = parseInt(selectedLevel.split('_')[1]);
                  const nextLevelKey = `${selectedGameType}_${currentLevelNum + 1}`;
                  const hasNextLevel = recetasPorNivel[nextLevelKey];
                  
                  return hasNextLevel ? (
                    <button
                      onClick={() => {
                        setSelectedLevel(nextLevelKey);
                        setGameState("PLAYING");
                        setCurrentRecipeIndex(0);
                        setIngredientesEnPlato([]);
                        setCompletedRecipes(0);
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
                  onClick={handleRestart}
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

        {/* Reintento */}
        {gameState === "RETRY" && (
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="text-6xl mb-6">😔</div>
              <h2 className="text-3xl font-bold text-red-600 mb-4">
                ¡La receta no es correcta!
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                No te preocupes, podés volver a intentar con los ingredientes correctos
              </p>
              
              <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#FFF3CD' }}>
                <div className="text-lg text-gray-700 mb-2">
                  Intentos: {attempts}
                </div>
                <div className="text-sm text-gray-600">
                  ¡Seguí intentando, lo vas a lograr!
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRetry}
                  className="text-white py-3 px-8 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#FFD93D' }}
                >
                  🔄 Intentar de Nuevo
                </button>
                <button
                  onClick={() => setGameState("SELECT_GAME_TYPE")}
                  className="text-white py-3 px-8 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#45B7D1' }}
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