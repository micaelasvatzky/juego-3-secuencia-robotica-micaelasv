"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Game3Container from "@/components/Game3Container";

export default function Page() {
  const [selectedNivel, setSelectedNivel] = useState(null);
  const router = useRouter();

  const niveles = [
    {
      id: "facil",
      nombre: "Fácil",
      descripcion: "2-3 pasos simples",
      color: "#FF6B9D",
      emoji: "🌟",
      secuencias: 5,
    },
    {
      id: "intermedio",
      nombre: "Intermedio",
      descripcion: "3-4 pasos con más acción",
      color: "#4ECDC4",
      emoji: "🚀",
      secuencias: 8,
    },
    {
      id: "dificil",
      nombre: "Difícil",
      descripcion: "4-6 pasos con distractores",
      color: "#45B7D1",
      emoji: "🎯",
      secuencias: 10,
    },
  ];

  const handleStartGame = () => {
    if (selectedNivel) {
      router.push(`/rutinas?nivel=${selectedNivel}`);
    }
  };

  // Si ya hay un nivel seleccionado en la URL, mostrar el juego directamente
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const nivelFromUrl = urlParams.get("nivel");
    if (nivelFromUrl) {
      return <Game3Container />;
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0000FF" }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => router.push("/")}
          className="text-4xl hover:scale-110 transition-transform duration-200"
        >
          🏠
        </button>
        <h1 className="text-3xl font-bold text-white">🤖 Rutinas del Robot</h1>
        <div></div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">Elegí tu nivel</h2>
          <p className="text-lg text-white/80">
            Cada nivel tiene diferentes secuencias para jugar
          </p>
        </div>

        {/* Grid de niveles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {niveles.map((nivel) => (
            <button
              key={nivel.id}
              onClick={() => setSelectedNivel(nivel.id)}
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
              </div>
            </button>
          ))}
        </div>

        {/* Botón para comenzar */}
        {selectedNivel && (
          <button
            onClick={handleStartGame}
            className="text-white py-4 px-12 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            style={{ backgroundColor: "#4ECDC4" }}
          >
            🎮 ¡Comenzar Juego!
          </button>
        )}
      </div>
    </div>
  );
}
