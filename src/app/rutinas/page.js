"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Game3Container from "@/components/Game3Container";

export default function Page() {
  const [selectedSala, setSelectedSala] = useState(null);
  const router = useRouter();

  const salas = [
    {
      id: "sala3",
      nombre: "Sala de 3",
      edad: "3 años",
      pasos: "2-3 pasos",
      color: "from-pink-400 to-pink-600",
      emoji: "🌟",
      descripcion: "Rutinas simples y divertidas"
    },
    {
      id: "sala4", 
      nombre: "Sala de 4",
      edad: "4 años",
      pasos: "3-4 pasos",
      color: "from-blue-400 to-blue-600",
      emoji: "🚀",
      descripcion: "Rutinas un poco más desafiantes"
    },
    {
      id: "sala5",
      nombre: "Sala de 5", 
      edad: "5 años",
      pasos: "4-6 pasos con distractores",
      color: "from-green-400 to-green-600",
      emoji: "🎯",
      descripcion: "Rutinas complejas con desafíos"
    }
  ];

  const handleStartGame = () => {
    if (selectedSala) {
      router.push(`/rutinas?sala=${selectedSala}`);
    }
  };

  // Si ya hay una sala seleccionada en la URL, mostrar el juego directamente
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const salaFromUrl = urlParams.get('sala');
    if (salaFromUrl) {
      return <Game3Container />;
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0000FF' }}>
      {/* Selector de Sala */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="grid grid-cols-3 gap-8">
          {salas.map((sala) => (
            <button
              key={sala.id}
              onClick={() => setSelectedSala(sala.id)}
              className={`w-32 h-32 rounded-full shadow-lg border-4 border-white transition-all duration-200 transform hover:scale-110 ${
                selectedSala === sala.id ? "scale-110" : ""
              }`}
              style={{ backgroundColor: sala.color }}
            >
              <div className="text-6xl">{sala.emoji}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Botón de inicio */}
      {selectedSala && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleStartGame}
            className="w-24 h-24 rounded-full shadow-lg border-4 border-white transition-all duration-200 transform hover:scale-110"
            style={{ backgroundColor: '#00FF00' }}
          >
            <div className="text-4xl">🚀</div>
          </button>
        </div>
      )}
    </div>
  );
}
