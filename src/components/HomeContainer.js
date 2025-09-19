"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HomeContainer = () => {
  const [hoveredGame, setHoveredGame] = useState(null);
  const router = useRouter();

  const juegos = [
    {
      id: "juego1",
      nombre: "Aventura en la Grilla",
      emoji: "🤖",
      color: "#FFD700", // Amarillo
      ruta: "/juego1"
    },
    {
      id: "juego2", 
      nombre: "El Juego del Chef Robot",
      emoji: "🤖",
      color: "#FF0000", // Rojo
      ruta: "/juego2"
    },
    {
      id: "juego3",
      nombre: "Rutinas del Robot",
      emoji: "🤖",
      color: "#0000FF", // Azul
      ruta: "/rutinas"
    }
  ];

  const handleGameSelect = (juego) => {
    router.push(juego.ruta);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F0F0' }}>
      {/* Título */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-4xl font-bold" style={{ color: '#2C3E50' }}>
          ¡Juegos Divertidos!
        </h1>
      </div>

      {/* Grid de juegos */}
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="grid grid-cols-3 gap-8">
          {juegos.map((juego) => (
             <button
               key={juego.id}
               onClick={() => handleGameSelect(juego)}
               className="transition-all duration-200 transform hover:scale-110 focus:outline-none flex flex-col items-center"
             >
               <div 
                 className="w-32 h-32 rounded-full shadow-lg border-4 border-white flex items-center justify-center mb-4"
                 style={{ backgroundColor: juego.color }}
               >
                 <div className="text-6xl">
                   {juego.emoji}
                 </div>
               </div>
               <div className="text-lg font-bold text-gray-800 text-center">
                 {juego.nombre}
               </div>
             </button>
           ))}
         </div>
       </div>
     </div>
   );
};

export default HomeContainer;
