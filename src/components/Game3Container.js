"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useSearchParams, useRouter } from "next/navigation";

// Todas las rutinas disponibles
const todasLasRutinas = [
  {
    id: 1,
    nombre: "Saltar",
    imagen: "/saltar.jpg",
    video: "Saltar",
    audio: "Saltar",
    emoji: "🦘",
    color: "#FFD93D" // Amarillo vibrante
  },
  {
    id: 2,
    nombre: "Caminar",
    imagen: "/caminar.jpg",
    video: "Caminar",
    audio: "Caminar",
    emoji: "🚶",
    color: "#6BCF7F" // Verde menta
  },
  {
    id: 3,
    nombre: "Correr",
    imagen: "/correr.jpg",
    video: "Correr",
    audio: "Correr",
    emoji: "🏃",
    color: "#FF6B6B" // Rojo coral
  },
  {
    id: 4,
    nombre: "Girar",
    imagen: "/girar.jpg",
    video: "Girar",
    audio: "Girar",
    emoji: "🌀",
    color: "#A8E6CF" // Verde claro
  },
  {
    id: 5,
    nombre: "Bailar",
    imagen: "/saltar.jpg", // Usando imagen existente como placeholder
    video: "Bailar",
    audio: "Bailar",
    emoji: "💃",
    color: "#FFB3BA" // Rosa claro
  },
  {
    id: 6,
    nombre: "Saltar",
    imagen: "/saltar.jpg", // Usando imagen existente como placeholder
    video: "Saltar",
    audio: "Saltar",
    emoji: "🤸",
    color: "#BAFFC9" // Verde muy claro
  }
];

// Distractores para sala de 5
const distractores = [
  {
    id: 99,
    nombre: "Dormir",
    imagen: "/saltar.jpg", // Placeholder
    emoji: "😴",
    color: "#D3D3D3" // Gris claro
  },
  {
    id: 98,
    nombre: "Comer",
    imagen: "/saltar.jpg", // Placeholder
    emoji: "🍎",
    color: "#FFA07A" // Salmón claro
  }
];

// Configuraciones por nivel de dificultad
const configuracionesNivel = {
  facil: {
    nombre: "Fácil",
    emoji: "🌟",
    color: "#FF6B9D", // Rosa vibrante
    descripcion: "2-3 pasos simples",
    secuencias: [
      [1, 2], // Saltar, Caminar
      [2, 3], // Caminar, Correr
      [3, 1], // Correr, Saltar
      [1, 3], // Saltar, Correr
      [2, 1]  // Caminar, Saltar
    ],
    distractores: []
  },
  intermedio: {
    nombre: "Intermedio", 
    emoji: "🚀",
    color: "#4ECDC4", // Turquesa
    descripcion: "3-4 pasos con más acción",
    secuencias: [
      [1, 2, 3], // Saltar, Caminar, Correr
      [2, 3, 1], // Caminar, Correr, Saltar
      [3, 1, 2], // Correr, Saltar, Caminar
      [1, 3, 2], // Saltar, Correr, Caminar
      [2, 1, 3], // Caminar, Saltar, Correr
      [3, 2, 1], // Correr, Caminar, Saltar
      [1, 2, 4], // Saltar, Caminar, Girar
      [2, 4, 1]  // Caminar, Girar, Saltar
    ],
    distractores: []
  },
  dificil: {
    nombre: "Difícil",
    emoji: "🎯", 
    color: "#45B7D1", // Azul cielo
    descripcion: "4-6 pasos con distractores",
    secuencias: [
      [1, 2, 3, 4], // Saltar, Caminar, Correr, Girar
      [2, 3, 4, 1], // Caminar, Correr, Girar, Saltar
      [3, 4, 1, 2], // Correr, Girar, Saltar, Caminar
      [4, 1, 2, 3], // Girar, Saltar, Caminar, Correr
      [1, 3, 2, 4], // Saltar, Correr, Caminar, Girar
      [2, 4, 3, 1], // Caminar, Girar, Correr, Saltar
      [1, 2, 3, 4, 5], // Secuencia de 5 pasos
      [2, 3, 4, 5, 1], // Otra secuencia de 5 pasos
      [1, 3, 5, 2, 4], // Secuencia mixta de 5 pasos
      [3, 1, 4, 2, 5]  // Secuencia compleja de 5 pasos
    ],
    distractores: [99, 98] // Con distractores
  }
};

const Game3Container = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nivel = searchParams.get('nivel') || 'facil';
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [gameState, setGameState] = useState("SELECT_DIFFICULTY"); // SELECT_DIFFICULTY, SHOWING_ROUTINE, WAITING_SCAN, SCANNING, VALIDATING, CELEBRATION, RETRY
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [navigationHistory, setNavigationHistory] = useState([]);
  
  console.log("Game3Container - Current gameState:", gameState);
  const [isSlideshowComplete, setIsSlideshowComplete] = useState(false);
  const [scannedSequence, setScannedSequence] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [testMode, setTestMode] = useState(false);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [completedSequences, setCompletedSequences] = useState(0);
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const audioContextRef = useRef(null);

  // Obtener configuración del nivel actual
  const configNivel = selectedDifficulty ? configuracionesNivel[selectedDifficulty] : configuracionesNivel[nivel];
  
  // Obtener la secuencia actual
  const secuenciaActual = configNivel.secuencias[currentSequenceIndex];
  
  // Generar rutinas para esta secuencia
  const rutinas = secuenciaActual.map(id => 
    todasLasRutinas.find(r => r.id === id)
  ).filter(Boolean);
  
  // Agregar distractores si es nivel difícil
  const todasLasOpciones = [...rutinas];
  if (configNivel.distractores.length > 0) {
    const distractoresNivel = configNivel.distractores.map(id => 
      distractores.find(d => d.id === id)
    ).filter(Boolean);
    todasLasOpciones.push(...distractoresNivel);
  }

  useEffect(() => {
    if (gameState === "SHOWING_ROUTINE" && !isSlideshowComplete) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= rutinas.length) {
            // Slideshow completado
            setIsSlideshowComplete(true);
            setGameState("WAITING_SCAN");
            clearInterval(interval);
            return prevIndex; // Mantener la última imagen
          }
          return nextIndex;
        });
      }, 3000); // Cambia cada 3 segundos

      return () => clearInterval(interval);
    }
  }, [gameState, isSlideshowComplete, rutinas.length]);

  const currentRutina = rutinas[currentImageIndex];

  const handleStartScanning = async () => {
    try {
      setGameState("SCANNING");
      setIsScanning(true);
      
      // Inicializar el lector de códigos QR
      readerRef.current = new BrowserMultiFormatReader();
      
      // Obtener dispositivos de cámara usando la API nativa del navegador
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
      
      // Usar la cámara trasera si está disponible, sino la primera disponible
      const selectedDevice = videoInputDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear')
      ) || videoInputDevices[0];
      
      if (selectedDevice) {
        // Iniciar el escaneo
        await readerRef.current.decodeFromVideoDevice(
          selectedDevice.deviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              handleQRCodeScanned(result.getText());
            }
            if (error && error.name !== 'NotFoundException') {
              console.error('Error de escaneo:', error);
            }
          }
        );
      } else {
        throw new Error('No se encontró ninguna cámara');
      }
    } catch (error) {
      console.error('Error al iniciar la cámara:', error);
      alert('No se pudo acceder a la cámara. Asegúrate de permitir el acceso a la cámara.');
      setGameState("WAITING_SCAN");
      setIsScanning(false);
    }
  };

  const handleQRCodeScanned = (qrCodeText) => {
    // Buscar la rutina correspondiente al código QR escaneado
    const rutina = todasLasOpciones.find(r => r.nombre.toLowerCase() === qrCodeText.toLowerCase());
    
    if (rutina) {
      playScanSound(); // Reproducir sonido de escaneo
      
      // Siempre agregar la rutina a la secuencia (sin importar si es correcta o no)
      const newSequence = [...scannedSequence, rutina];
      setScannedSequence(newSequence);
      
      // Si hemos escaneado todas las rutinas necesarias, validar la secuencia
      if (newSequence.length === rutinas.length) {
        stopScanning();
        validateSequence(newSequence);
      }
    } else {
      console.log('Código QR no reconocido:', qrCodeText);
    }
  };

  const handleTestModeClick = (rutina) => {
    playScanSound(); // Reproducir sonido de escaneo
    
    // Siempre agregar la rutina a la secuencia (sin importar si es correcta o no)
    const newSequence = [...scannedSequence, rutina];
    setScannedSequence(newSequence);
    
    // Si hemos escaneado todas las rutinas necesarias, validar la secuencia
    if (newSequence.length === rutinas.length) {
      validateSequence(newSequence);
    }
  };

  const stopScanning = () => {
    if (readerRef.current) {
      try {
        readerRef.current.reset();
      } catch (error) {
        console.log('Error al resetear el lector:', error);
      }
    }
    
    // Detener el stream de video
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
    setGameState("WAITING_SCAN");
    // No resetear la secuencia escaneada para que se mantenga el progreso
  };

  const cancelScanning = () => {
    if (readerRef.current) {
      try {
        readerRef.current.reset();
      } catch (error) {
        console.log('Error al resetear el lector:', error);
      }
    }
    
    // Detener el stream de video
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
    setGameState("SHOWING_ROUTINE");
    setCurrentImageIndex(0);
    setIsSlideshowComplete(false);
    setScannedSequence([]);
  };

  const validateSequence = (sequence) => {
    setGameState("VALIDATING");
    setAttempts(prev => prev + 1);
    
    // Verificar si hay distractores en la secuencia
    const hasDistractors = sequence.some(rutina => 
      configNivel.distractores.includes(rutina.id)
    );
    
    // Comparar la secuencia escaneada con la secuencia correcta
    const isCorrect = sequence.every((rutina, index) => 
      rutina.id === rutinas[index].id
    ) && !hasDistractors;
    
    setTimeout(() => {
      if (isCorrect) {
        setScore(prev => prev + 100);
        setCompletedSequences(prev => prev + 1);
        setGameState("CELEBRATION");
        playSuccessSound();
      } else {
        setGameState("RETRY");
        playErrorSound(); // Reproducir sonido de error
      }
    }, 2000);
  };

  const handleRestartRoutine = () => {
    setCurrentImageIndex(0);
    setIsSlideshowComplete(false);
    setGameState("SHOWING_ROUTINE");
    setScannedSequence([]);
    setCurrentSequenceIndex(0);
    setCompletedSequences(0);
    stopScanning();
  };

  const handleRetry = () => {
    setScannedSequence([]);
    setGameState("WAITING_SCAN");
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleBack = () => {
    if (navigationHistory.length > 0) {
      const previousState = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setGameState(previousState);
      
      if (previousState === "SELECT_DIFFICULTY") {
        setSelectedDifficulty(null);
      }
    }
  };

  const navigateToState = (newState) => {
    setNavigationHistory(prev => [...prev, gameState]);
    setGameState(newState);
  };

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
    // Melodía de éxito
    playSound(523, 0.2); // C5
    setTimeout(() => playSound(659, 0.2), 200); // E5
    setTimeout(() => playSound(784, 0.4), 400); // G5
  };

  const playErrorSound = () => {
    // Sonido de error
    playSound(200, 0.5, 'sawtooth');
  };

  const playScanSound = () => {
    // Sonido de escaneo
    playSound(800, 0.1);
  };

  // Limpiar recursos cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (readerRef.current) {
        try {
          readerRef.current.reset();
        } catch (error) {
          console.log('Error al resetear el lector en cleanup:', error);
        }
      }
      
      // Detener el stream de video
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #4A90E2 0%, #A8E6CF 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background blobs */}
      <div className="background-blob blob-1" style={{ top: '12%', right: '12%', width: '65px', height: '65px' }}></div>
      <div className="background-blob blob-2" style={{ top: '30%', left: '8%', width: '85px', height: '85px' }}></div>
      <div className="background-blob blob-3" style={{ top: '60%', right: '5%', width: '75px', height: '75px' }}></div>
      <div className="background-blob blob-4" style={{ top: '85%', left: '12%', width: '60px', height: '60px', animationDelay: '3s' }}></div>
      <div className="background-blob blob-5" style={{ top: '50%', left: '90%', width: '70px', height: '70px', animationDelay: '2s' }}></div>
      
      {/* Header con información del nivel */}
      <div className="flex items-center p-6">
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
        
        {/* Información del nivel - solo cuando no está en selección de dificultad */}
        {gameState !== "SELECT_DIFFICULTY" ? (
          <div className="flex-1 flex justify-center">
            <div className="card-modern px-4 py-2 text-center shadow-soft">
              <div className="text-lg font-bold text-gray-800">
                {configNivel.emoji} {configNivel.nombre} - Secuencia {currentSequenceIndex + 1} de {configNivel.secuencias.length}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1"></div>
        )}
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTestMode(!testMode)}
            className={`card-modern p-3 text-2xl transition-all duration-300 hover:scale-110 shadow-soft ${
              testMode ? 'text-yellow-600' : 'text-gray-400'
            }`}
            title="Modo de prueba"
          >
            🧪
          </button>
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
        {/* Selección de dificultad */}
        {gameState === "SELECT_DIFFICULTY" && (
          <div className="text-center">
            <div className="card-modern p-4 shadow-soft mb-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                🤖 Rutinas del Robot
              </h2>
              <p className="text-base text-gray-600 mb-2">
                ¡Seguí las rutinas del robot en el orden correcto!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <button
                onClick={() => {
                  setSelectedDifficulty("facil");
                  navigateToState("WAITING_SCAN");
                }}
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
                    <div className="text-5xl">🌟</div>
                  </div>
                  <div className="text-xl font-bold text-white mb-3 leading-tight">
                    Fácil
                  </div>
                  <div className="text-sm text-white leading-tight">
                    2-3 pasos simples
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setSelectedDifficulty("intermedio");
                  navigateToState("WAITING_SCAN");
                }}
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
                    3-4 pasos con más acción
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setSelectedDifficulty("dificil");
                  navigateToState("WAITING_SCAN");
                }}
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
                    <div className="text-5xl">🎯</div>
                  </div>
                  <div className="text-xl font-bold text-white mb-3 leading-tight">
                    Difícil
                  </div>
                  <div className="text-sm text-white leading-tight">
                    4-6 pasos con distractores
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Imagen y indicadores - solo se muestran durante la rutina */}
        {gameState === "SHOWING_ROUTINE" && (
          <div className="text-center">
            <div className="card-modern p-6 shadow-soft mb-6">
              <div className="relative w-80 h-80 mx-auto overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={currentRutina.imagen}
                  alt={currentRutina.nombre}
                  width={300}
                  height={300}
                  className="object-cover transition-opacity duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div 
                    className="text-white px-4 py-2 rounded-full text-xl font-bold shadow-lg"
                    style={{ backgroundColor: currentRutina.color }}
                  >
                    {currentRutina.emoji} {currentRutina.nombre}
                  </div>
                </div>
              </div>

              {/* Indicadores de progreso */}
              <div className="flex justify-center gap-3 mt-6">
                {rutinas.map((rutina, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index <= currentImageIndex 
                        ? "shadow-lg scale-110" 
                        : "bg-gray-300"
                    }`}
                    style={index <= currentImageIndex ? { backgroundColor: rutina.color } : {}}
                  />
                ))}
              </div>
            </div>

            {/* Mensaje de estado */}
            {!isSlideshowComplete && (
              <div className="card-modern p-6 shadow-soft">
                <p className="text-xl text-gray-700 font-medium">
                  🤖 ¡Prestá atención a la rutina del robot!
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Paso {currentImageIndex + 1} de {rutinas.length}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botón para escanear - solo se muestra cuando termina la rutina */}
        {gameState === "WAITING_SCAN" && (
          <div className="text-center">
            <div className="card-modern p-6 shadow-soft">
              <div className="text-6xl mb-6">📋</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                ¡Tu turno!
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Ordená las tarjetas y escanealas en el orden correcto
              </p>

              <button
                onClick={handleStartScanning}
                className="btn-secondary py-4 px-12 text-xl font-bold"
              >
                📷 ¡Comenzar a Escanear!
              </button>
            </div>
          </div>
        )}

        {/* Interfaz de escaneo */}
        {gameState === "SCANNING" && (
          <div className="text-center">
            <div className="card-modern p-6 shadow-soft">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {testMode ? "🧪 Modo de Prueba" : "📷 Escaneando..."}
              </h2>
              
              {testMode ? (
                /* Modo de prueba con botones */
                <div>
                  <p className="text-xl text-gray-700 mb-6">
                    Tocá las acciones en orden
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {todasLasOpciones.map((rutina) => (
                      <button
                        key={rutina.id}
                        onClick={() => handleTestModeClick(rutina)}
                        className="w-20 h-20 rounded-full shadow-lg border-4 border-white transition-all duration-200 transform hover:scale-110"
                        style={{ backgroundColor: rutina.color }}
                      >
                        <div className="text-3xl">{rutina.emoji}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Modo normal con cámara */
                <div>
                  <div className="relative w-80 h-80 mx-auto mb-6">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover rounded-2xl shadow-lg"
                      autoPlay
                      playsInline
                    />
                    <div className="absolute inset-0 border-4 border-green-500 rounded-2xl pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-xl shadow-lg"></div>
                    </div>
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      📷 Cámara activa
                    </div>
                  </div>
                  
                  <p className="text-xl text-gray-700 mb-4">
                    Escaneá las tarjetas en orden
                  </p>
                </div>
              )}
              
              <div className="bg-gray-100 rounded-2xl p-4 mb-6">
                <p className="text-lg font-medium text-gray-800 mb-3">
                  Progreso: {scannedSequence.length}/{rutinas.length}
                </p>
                
                {/* Mostrar secuencia escaneada */}
                <div className="flex justify-center gap-3 mb-4 flex-wrap">
                  {scannedSequence.map((rutina, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg"
                        style={{ backgroundColor: rutina.color }}
                      >
                        {rutina.emoji}
                      </div>
                      <span className="text-xs font-medium text-green-600 mt-1">✓</span>
                    </div>
                  ))}
                  
                  {/* Mostrar espacios vacíos */}
                  {Array.from({ length: rutinas.length - scannedSequence.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-gray-300 flex items-center justify-center text-xl">
                        ?
                      </div>
                      <span className="text-xs font-medium text-gray-400 mt-1">
                        {scannedSequence.length + index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={cancelScanning}
                className="text-white py-3 px-8 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: '#FF6B6B' }}
              >
                ❌ Cancelar Escaneo
              </button>
            </div>
          </div>
        )}

        {/* Estado de validación */}
        {gameState === "VALIDATING" && (
          <div className="text-center">
            <div className="card-modern p-6 shadow-soft">
              <div className="text-6xl mb-6 animate-spin">🤖</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Validando secuencia...
              </h2>
              <p className="text-lg text-gray-600">
                El robot está revisando tu trabajo
              </p>
            </div>
          </div>
        )}

        {/* Celebración */}
        {gameState === "CELEBRATION" && (
          <div className="text-center">
            <div className="card-modern p-6 shadow-soft">
              <div className="text-8xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-4xl font-bold text-green-600 mb-4">
                ¡Felicitaciones!
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                ¡La secuencia es correcta! ¡Muy bien hecho!
              </p>
              
              <div className="card-modern p-6 mb-6 shadow-soft" style={{ backgroundColor: '#FFF3CD' }}>
                <div className="text-2xl font-bold mb-2" style={{ color: '#FF8C00' }}>
                  +100 puntos! ⭐
                </div>
                <div className="text-lg text-gray-700 mb-2">
                  Puntuación total: {score}
                </div>
                <div className="text-sm text-gray-600">
                  Secuencias completadas: {completedSequences}/{configNivel.secuencias.length}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 justify-center">
                {/* Siguiente secuencia */}
                {currentSequenceIndex < configNivel.secuencias.length - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentSequenceIndex(prev => prev + 1);
                      setCurrentImageIndex(0);
                      setIsSlideshowComplete(false);
                      setGameState("SHOWING_ROUTINE");
                      setScannedSequence([]);
                    }}
                    className="text-white py-3 px-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{ backgroundColor: '#10B981' }}
                  >
                    ➡️ Siguiente Secuencia
                  </button>
                ) : null}
                
                {/* Jugar de nuevo */}
                <button
                  onClick={handleRestartRoutine}
                  className="text-white py-3 px-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#45B7D1' }}
                >
                  🔄 Jugar de Nuevo
                </button>
                
                {/* Elegir nivel */}
                <button
                  onClick={() => {
                    setCurrentSequenceIndex(0);
                    setCurrentImageIndex(0);
                    setIsSlideshowComplete(false);
                    setScannedSequence([]);
                    setCompletedSequences(0);
                    setGameState("SHOWING_ROUTINE");
                  }}
                  className="text-white py-3 px-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#8B5CF6' }}
                >
                  🎯 Reiniciar Rutina
                </button>
                
                {/* Volver a home */}
                <button
                  onClick={handleBackToHome}
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
            <div className="card-modern p-6 shadow-soft">
              <div className="text-6xl mb-6">😔</div>
              <h2 className="text-3xl font-bold text-red-600 mb-4">
                ¡La secuencia no es correcta!
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                No te preocupes, podés volver a intentar escaneando las cartas en el orden correcto
              </p>
              
              <div className="card-modern p-6 mb-6 shadow-soft" style={{ backgroundColor: '#FFF3CD' }}>
                <div className="text-lg text-gray-700 mb-2">
                  Intentos: {attempts}
                </div>
                <div className="text-sm text-gray-600">
                  ¡Seguí intentando, lo vas a lograr!
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 justify-center">
                {/* Intentar de nuevo */}
                <button
                  onClick={handleRetry}
                  className="text-white py-3 px-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#FFD93D' }}
                >
                  🔄 Intentar de Nuevo
                </button>
                
                {/* Ver rutina */}
                <button
                  onClick={() => {
                    setCurrentImageIndex(0);
                    setIsSlideshowComplete(false);
                    setGameState("SHOWING_ROUTINE");
                    setScannedSequence([]);
                  }}
                  className="text-white py-3 px-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#45B7D1' }}
                >
                  👀 Ver Rutina
                </button>
                
                {/* Reiniciar rutina */}
                <button
                  onClick={handleRestartRoutine}
                  className="text-white py-3 px-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#8B5CF6' }}
                >
                  🎯 Reiniciar Rutina
                </button>
                
                {/* Volver a home */}
                <button
                  onClick={handleBackToHome}
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

export default Game3Container;
