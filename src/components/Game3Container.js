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

// Configuraciones por sala
const configuracionesSala = {
  sala3: {
    nombre: "Sala de 3",
    emoji: "🌟",
    color: "#FF6B9D", // Rosa vibrante
    rutinas: [1, 2], // 2-3 pasos
    distractores: []
  },
  sala4: {
    nombre: "Sala de 4", 
    emoji: "🚀",
    color: "#4ECDC4", // Turquesa
    rutinas: [1, 2, 3], // 3-4 pasos
    distractores: []
  },
  sala5: {
    nombre: "Sala de 5",
    emoji: "🎯", 
    color: "#45B7D1", // Azul cielo
    rutinas: [1, 2, 3, 4, 5], // 4-6 pasos
    distractores: [99, 98] // Con distractores
  }
};

const Game3Container = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sala = searchParams.get('sala') || 'sala3';
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [gameState, setGameState] = useState("SHOWING_ROUTINE"); // SHOWING_ROUTINE, WAITING_SCAN, SCANNING, VALIDATING, CELEBRATION, RETRY
  const [isSlideshowComplete, setIsSlideshowComplete] = useState(false);
  const [scannedSequence, setScannedSequence] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [testMode, setTestMode] = useState(false);
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const audioContextRef = useRef(null);

  // Obtener configuración de la sala actual
  const configSala = configuracionesSala[sala];
  
  // Generar rutinas para esta sala
  const rutinas = configSala.rutinas.map(id => 
    todasLasRutinas.find(r => r.id === id)
  ).filter(Boolean);
  
  // Agregar distractores si es sala de 5
  const todasLasOpciones = [...rutinas];
  if (configSala.distractores.length > 0) {
    const distractoresSala = configSala.distractores.map(id => 
      distractores.find(d => d.id === id)
    ).filter(Boolean);
    todasLasOpciones.push(...distractoresSala);
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
      setScannedSequence([]);
      
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
      setScannedSequence(prev => [...prev, rutina]);
      
      // Si hemos escaneado todas las rutinas necesarias, validar la secuencia
      if (scannedSequence.length + 1 === rutinas.length) {
        stopScanning();
        validateSequence([...scannedSequence, rutina]);
      }
    } else {
      console.log('Código QR no reconocido:', qrCodeText);
    }
  };

  const handleTestModeClick = (rutina) => {
    playScanSound(); // Reproducir sonido de escaneo
    setScannedSequence(prev => [...prev, rutina]);
    
    // Si hemos escaneado todas las rutinas necesarias, validar la secuencia
    if (scannedSequence.length + 1 === rutinas.length) {
      validateSequence([...scannedSequence, rutina]);
    }
  };

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setIsScanning(false);
    setGameState("WAITING_SCAN");
    setScannedSequence([]);
  };

  const validateSequence = (sequence) => {
    setGameState("VALIDATING");
    setAttempts(prev => prev + 1);
    
    // Verificar si hay distractores en la secuencia
    const hasDistractors = sequence.some(rutina => 
      configSala.distractores.includes(rutina.id)
    );
    
    // Comparar la secuencia escaneada con la secuencia correcta
    const isCorrect = sequence.every((rutina, index) => 
      rutina.id === rutinas[index].id
    ) && !hasDistractors;
    
    setTimeout(() => {
      if (isCorrect) {
        setScore(prev => prev + 100);
        setGameState("CELEBRATION");
        playSuccessSound(); // Reproducir sonido de éxito
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
    stopScanning();
  };

  const handleRetry = () => {
    setScannedSequence([]);
    setGameState("WAITING_SCAN");
  };

  const handleBackToHome = () => {
    router.push('/');
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
        readerRef.current.reset();
      }
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0000FF' }}>
      {/* Header simple */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handleBackToHome}
          className="text-4xl hover:scale-110 transition-transform duration-200"
        >
          🏠
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTestMode(!testMode)}
            className={`text-3xl transition-transform duration-200 hover:scale-110 ${
              testMode ? 'text-yellow-500' : 'text-gray-400'
            }`}
            title="Modo de prueba"
          >
            🧪
          </button>
          <div className="text-4xl">⭐ {score}</div>
        </div>
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
        {/* Imagen y indicadores - solo se muestran durante la rutina */}
        {gameState === "SHOWING_ROUTINE" && (
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-6">
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
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="text-6xl mb-6">📋</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                ¡Tu turno!
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Ordená las tarjetas y escanealas en el orden correcto
              </p>

              <button
                onClick={handleStartScanning}
                className="text-white py-4 px-12 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{ backgroundColor: '#4ECDC4' }}
              >
                📷 ¡Comenzar a Escanear!
              </button>
            </div>
          </div>
        )}

        {/* Interfaz de escaneo */}
        {gameState === "SCANNING" && (
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
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
                onClick={stopScanning}
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
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
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
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="text-8xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-4xl font-bold text-green-600 mb-4">
                ¡Excelente trabajo!
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                ¡La secuencia es perfecta! 🌟
              </p>
              
              <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#FFF3CD' }}>
                <div className="text-2xl font-bold mb-2" style={{ color: '#FF8C00' }}>
                  +100 puntos! ⭐
                </div>
                <div className="text-lg text-gray-700">
                  Puntuación total: {score}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRestartRoutine}
                  className="text-white py-3 px-8 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#45B7D1' }}
                >
                  🔄 Jugar de Nuevo
                </button>
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
                ¡Ups! Inténtalo de nuevo
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                La secuencia no es correcta, pero no te preocupes
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
                  onClick={handleRestartRoutine}
                  className="text-white py-3 px-8 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#45B7D1' }}
                >
                  👀 Ver Rutina
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
