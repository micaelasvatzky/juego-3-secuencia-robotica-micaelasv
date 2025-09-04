"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const rutinas = [
  {
    id: 1,
    nombre: "Saltar",
    imagen: "/saltar.jpg",
    video: "Saltar",
    audio: "Saltar",
  },
  {
    id: 2,
    nombre: "Caminar",
    imagen: "/caminar.jpg",
    video: "Caminar",
    audio: "Caminar",
  },
  {
    id: 3,
    nombre: "Correr",
    imagen: "/correr.jpg",
    video: "Correr",
    audio: "Correr",
  },
  {
    id: 4,
    nombre: "Girar",
    imagen: "/girar.jpg",
    video: "Girar",
    audio: "Girar",
  },
];

const Game3Container = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [gameState, setGameState] = useState("SHOWING_ROUTINE"); // SHOWING_ROUTINE, WAITING_SCAN, SCANNING, VALIDATING, CELEBRATION, RETRY
  const [isSlideshowComplete, setIsSlideshowComplete] = useState(false);
  const [scannedSequence, setScannedSequence] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const readerRef = useRef(null);

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
  }, [gameState, isSlideshowComplete]);

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
    const rutina = rutinas.find(r => r.nombre.toLowerCase() === qrCodeText.toLowerCase());
    
    if (rutina) {
      setScannedSequence(prev => [...prev, rutina]);
      
      // Si hemos escaneado todas las rutinas, validar la secuencia
      if (scannedSequence.length + 1 === rutinas.length) {
        stopScanning();
        validateSequence([...scannedSequence, rutina]);
      }
    } else {
      console.log('Código QR no reconocido:', qrCodeText);
    }
  };

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setIsScanning(false);
  };

  const validateSequence = (sequence) => {
    setGameState("VALIDATING");
    
    // Comparar la secuencia escaneada con la secuencia correcta
    const isCorrect = sequence.every((rutina, index) => 
      rutina.id === rutinas[index].id
    );
    
    setTimeout(() => {
      if (isCorrect) {
        setGameState("CELEBRATION");
      } else {
        setGameState("RETRY");
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

  // Limpiar recursos cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-5">
      {/* Imagen y indicadores - solo se muestran durante la rutina */}
      {gameState === "SHOWING_ROUTINE" && (
        <>
          <div className="relative w-80 h-80 overflow-hidden rounded-lg shadow-lg">
            <Image
              src={currentRutina.imagen}
              alt={currentRutina.nombre}
              width={300}
              height={300}
              className="object-cover transition-opacity duration-500 ease-in-out"
            />
          </div>

          {/* Indicadores de progreso */}
          <div className="flex gap-2.5 mt-5">
            {rutinas.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index <= currentImageIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Mensaje de estado */}
      {gameState === "SHOWING_ROUTINE" && !isSlideshowComplete && (
        <p className="mt-5 text-base text-gray-600 text-center">
          🤖 Prestá atención a la rutina...
        </p>
      )}

             {/* Botón para escanear - solo se muestra cuando termina la rutina */}
       {gameState === "WAITING_SCAN" && (
         <div className="flex flex-col justify-center items-center min-h-screen text-center">
           <p className="text-lg text-gray-800 mb-5">
             ¡Ahora ordena las tarjetas y escanéalas!
           </p>
           <button
             onClick={handleStartScanning}
             className="bg-green-600 hover:bg-green-700 text-white border-0 py-4 px-8 text-lg rounded-lg cursor-pointer shadow-md transition-colors duration-300"
           >
             📷 Escanear Tarjetas
           </button>
         </div>
       )}

       {/* Interfaz de escaneo */}
       {gameState === "SCANNING" && (
         <div className="flex flex-col justify-center items-center min-h-screen text-center">
           <div className="relative w-80 h-80 mb-5">
             <video
               ref={videoRef}
               className="w-full h-full object-cover rounded-lg"
               autoPlay
               playsInline
             />
             <div className="absolute inset-0 border-4 border-green-500 rounded-lg pointer-events-none">
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-lg"></div>
             </div>
           </div>
           <p className="text-lg text-gray-800 mb-3">
             Escanea las tarjetas en orden
           </p>
           <p className="text-sm text-gray-600 mb-5">
             Secuencia escaneada: {scannedSequence.length}/{rutinas.length}
           </p>
           <div className="flex gap-2 mb-5">
             {scannedSequence.map((rutina, index) => (
               <div key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                 {rutina.nombre}
               </div>
             ))}
           </div>
           <button
             onClick={stopScanning}
             className="bg-red-600 hover:bg-red-700 text-white border-0 py-2 px-6 rounded-lg cursor-pointer transition-colors duration-300"
           >
             Cancelar Escaneo
           </button>
         </div>
       )}

       {/* Estado de validación */}
       {gameState === "VALIDATING" && (
         <div className="flex flex-col justify-center items-center min-h-screen text-center">
           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-5"></div>
           <p className="text-lg text-gray-800">
             Validando secuencia...
           </p>
         </div>
       )}

       {/* Celebración */}
       {gameState === "CELEBRATION" && (
         <div className="flex flex-col justify-center items-center min-h-screen text-center">
           <div className="text-6xl mb-5 animate-bounce">🎉</div>
           <h2 className="text-3xl font-bold text-green-600 mb-3">
             ¡Excelente!
           </h2>
           <p className="text-lg text-gray-800 mb-5">
             La secuencia es correcta
           </p>
           <button
             onClick={handleRestartRoutine}
             className="bg-blue-600 hover:bg-blue-700 text-white border-0 py-3 px-6 rounded-lg cursor-pointer transition-colors duration-300"
           >
             Jugar de Nuevo
           </button>
         </div>
       )}

       {/* Reintento */}
       {gameState === "RETRY" && (
         <div className="flex flex-col justify-center items-center min-h-screen text-center">
           <div className="text-6xl mb-5">😔</div>
           <h2 className="text-3xl font-bold text-red-600 mb-3">
             Inténtalo de nuevo
           </h2>
           <p className="text-lg text-gray-800 mb-5">
             La secuencia no es correcta
           </p>
           <div className="flex gap-3">
             <button
               onClick={handleRetry}
               className="bg-yellow-600 hover:bg-yellow-700 text-white border-0 py-3 px-6 rounded-lg cursor-pointer transition-colors duration-300"
             >
               Intentar de Nuevo
             </button>
             <button
               onClick={handleRestartRoutine}
               className="bg-blue-600 hover:bg-blue-700 text-white border-0 py-3 px-6 rounded-lg cursor-pointer transition-colors duration-300"
             >
               Ver Rutina
             </button>
           </div>
         </div>
       )}
    </div>
  );
};

export default Game3Container;
