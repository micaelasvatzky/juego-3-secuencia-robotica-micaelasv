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
      color: "#8B5CF6", // Purple for better text contrast
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
      ruta: "/grilla"
    },
    {
      id: "juego2", 
      nombre: "El Juego del Chef Robot",
      emoji: "🍳",
      color: "#FF6B9D", // Pink from reference
      gradient: "linear-gradient(135deg, #FF6B9D 0%, #FFB3BA 100%)",
      ruta: "/chef"
    },
    {
      id: "juego3",
      nombre: "Rutinas del Robot",
      emoji: "🎯",
      color: "#4A90E2", // Blue from reference
      gradient: "linear-gradient(135deg, #4A90E2 0%, #A8E6CF 100%)",
      ruta: "/rutinas"
    }
  ];

  const handleGameSelect = (juego) => {
    router.push(juego.ruta);
  };

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #FFF8E1 0%, #F5F5DC 50%, #FFD93D 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background blobs */}
      <div className="background-blob blob-1" style={{ top: '10%', left: '5%', width: '80px', height: '80px' }}></div>
      <div className="background-blob blob-2" style={{ top: '20%', right: '10%', width: '60px', height: '60px' }}></div>
      <div className="background-blob blob-3" style={{ top: '60%', left: '8%', width: '100px', height: '100px' }}></div>
      <div className="background-blob blob-4" style={{ top: '70%', right: '15%', width: '70px', height: '70px' }}></div>
      <div className="background-blob blob-5" style={{ top: '40%', left: '50%', width: '90px', height: '90px' }}></div>
      <div className="background-blob blob-1" style={{ top: '80%', left: '30%', width: '50px', height: '50px', animationDelay: '2s' }}></div>
      <div className="background-blob blob-2" style={{ top: '15%', left: '70%', width: '75px', height: '75px', animationDelay: '3s' }}></div>
      <div className="background-blob blob-3" style={{ top: '85%', right: '5%', width: '65px', height: '65px', animationDelay: '1.5s' }}></div>
      
      {/* Header with app name */}
      <div className="text-center pt-12 pb-8">
        <div className="card-modern inline-block px-8 py-6 shadow-soft">
          <h1 className="text-5xl font-bold mb-2" style={{ 
            background: 'linear-gradient(135deg, #FF8C42 0%, #FFD93D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Explicai.
          </h1>
          <p className="text-lg text-gray-600">
            ¡El mundo es tuyo para explorar!
          </p>
        </div>
      </div>


      {/* Grid de juegos */}
      <div className="flex items-center justify-center py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl">
          {juegos.map((juego) => (
             <button
               key={juego.id}
               onClick={() => handleGameSelect(juego)}
               onMouseEnter={() => setHoveredGame(juego.id)}
               onMouseLeave={() => setHoveredGame(null)}
               className="transition-all duration-300 transform hover:scale-105 focus:outline-none group"
             >
               <div 
                 className="w-72 h-72 rounded-2xl shadow-soft hover:shadow-glow p-8 text-center transition-all duration-300 flex flex-col justify-center"
                 style={{ 
                   background: hoveredGame === juego.id ? juego.gradient : juego.color,
                   boxShadow: hoveredGame === juego.id ? '0 0 30px rgba(255, 217, 61, 0.4)' : '0 8px 25px rgba(0, 0, 0, 0.15)'
                 }}
               >
                 <div className={`flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                   juego.id === 'juego3' ? 'mb-14' : 'mb-8'
                 }`}>
                   <div className="text-6xl">
                     {juego.emoji}
                   </div>
                 </div>
                 <div className="text-2xl font-bold text-white mb-6 leading-tight">
                   {juego.nombre}
                 </div>
                 <div className="text-base text-white/90 leading-tight">
                   {juego.id === 'juego1' && 'Explorá la grilla con el robot'}
                   {juego.id === 'juego2' && 'Prepará recetas deliciosas'}
                   {juego.id === 'juego3' && 'Seguí las rutinas del robot'}
                 </div>
               </div>
             </button>
           ))}
         </div>
       </div>

       {/* Bottom navigation style elements */}
       <div className="flex justify-center py-6">
         <div className="flex gap-4">
           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8B5CF6' }}></div>
           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF6B9D' }}></div>
           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#4A90E2' }}></div>
         </div>
       </div>
     </div>
   );
};

export default HomeContainer;
