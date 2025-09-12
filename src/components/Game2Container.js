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

// Recetas por nivel de dificultad
const recetasPorNivel = {
  facil: {
    nombre: "Fácil",
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
  },
  intermedio: {
    nombre: "Intermedio",
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
  },
  dificil: {
    nombre: "Difícil",
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
  }
};

const Game2Container = () => {
  const router = useRouter();
  const [gameState, setGameState] = useState("SELECT_LEVEL"); // SELECT_LEVEL, PLAYING, VALIDATING, CELEBRATION, RETRY
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

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setGameState("PLAYING");
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FF0000" }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handleBackToHome}
          className="text-4xl hover:scale-110 transition-transform duration-200"
        >
          🏠
        </button>
        
        {/* Información del nivel */}
        {selectedLevel && (
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {configNivel.emoji} {configNivel.nombre}
            </div>
            <div className="text-sm text-white/80">
              Receta {currentRecipeIndex + 1} de {configNivel.recetas.length}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-4">
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
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        {/* Selección de nivel */}
        {gameState === "SELECT_LEVEL" && (
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                🤖 El Juego del Chef Robot
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                ¡Ayudá al chef robot a preparar las recetas perfectas!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(recetasPorNivel).map(([key, nivel]) => (
                <button
                  key={key}
                  onClick={() => handleLevelSelect(key)}
                  className="transition-all duration-300 transform hover:scale-105 focus:outline-none"
                >
                  <div
                    className="w-40 h-40 rounded-2xl shadow-lg flex flex-col items-center justify-center p-4"
                    style={{ backgroundColor: nivel.color }}
                  >
                    <div className="text-5xl mb-3">{nivel.emoji}</div>
                    <div className="text-white font-bold text-xl mb-2">
                      {nivel.nombre}
                    </div>
                    <div className="text-white/80 text-sm text-center">
                      {nivel.descripcion}
                    </div>
                  </div>
                </button>
              ))}
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
              <div className="grid md:grid-cols-3 gap-8">
                {/* Imagen de la receta a recrear */}
                <div className="bg-gray-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">
                    Recreá esta receta
                  </h3>
                  <div className="flex items-center justify-center h-48 bg-white rounded-xl shadow-lg">
                    <div className="text-8xl">{recetaActual.imagen}</div>
                  </div>
                </div>

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
                      <div className="relative w-full h-full flex items-end justify-center">
                        {/* Hamburguesa apilada */}
                        <div className="relative flex flex-col-reverse items-center justify-end h-full pb-4">
                          {ingredientesEnPlato.map((ingrediente, index) => (
                            <div
                              key={index}
                              className="relative group"
                              style={{
                                zIndex: index + 1,
                                marginTop: index === 0 ? '0' : '-6px'
                              }}
                            >
                              {renderIngrediente(ingrediente, index, true)}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleIngredienteRemove(index);
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                ×
                              </button>
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

                {/* Ingredientes disponibles */}
                <div className="bg-gray-100 rounded-2xl p-6">
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

              <div className="flex gap-4 justify-center">
                {currentRecipeIndex < configNivel.recetas.length - 1 ? (
                  <button
                    onClick={handleNextRecipe}
                    className="text-white py-3 px-8 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{ backgroundColor: '#45B7D1' }}
                  >
                    ➡️ Siguiente Receta
                  </button>
                ) : (
                  <button
                    onClick={handleRestart}
                    className="text-white py-3 px-8 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{ backgroundColor: '#45B7D1' }}
                  >
                    🔄 Jugar de Nuevo
                  </button>
                )}
                <button
                  onClick={handleBackToHome}
                  className="text-white py-3 px-8 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
                  onClick={() => setGameState("PLAYING")}
                  className="text-white py-3 px-8 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#45B7D1' }}
                >
                  👀 Ver Receta
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