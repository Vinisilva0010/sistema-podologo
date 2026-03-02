// src/components/ui/BrutalBeforeAfter.tsx
"use client";
import { useState, useRef, MouseEvent, TouchEvent } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrutalBeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  altText: string;
}

export function BrutalBeforeAfter({ beforeImage, afterImage, altText }: BrutalBeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] md:aspect-video border-4 border-black overflow-hidden shadow-brutal select-none group cursor-ew-resize bg-gray-200"
      onMouseMove={onMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
      onTouchMove={onTouchMove}
    >
      {/* Imagem do DEPOIS (Fica no fundo, limpa e tratada) */}
      <Image 
        src={afterImage} 
        alt={`Depois: ${altText}`} 
        fill 
        className="object-cover pointer-events-none"
      />

      {/* Imagem do ANTES (Fica por cima, sendo cortada dinamicamente) */}
      <div 
        className="absolute inset-0 z-10 w-full h-full pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <Image 
          src={beforeImage} 
          alt={`Antes: ${altText}`} 
          fill 
          className="object-cover md:grayscale" 
        />
        {/* Overlay escuro no Antes pra dar um ar de "problema" */}
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
      </div>

      {/* A Linha e o Puxador Brutalista do Meio */}
      <div 
        className="absolute top-0 bottom-0 z-20 w-1.5 bg-black pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-yellow-400 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] transition-transform group-active:scale-90">
          <MoveHorizontal className="text-black w-6 h-6" strokeWidth={3} />
        </div>
      </div>

      {/* Etiqueta "ANTES" (Estilo fita colada torta) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <span className="bg-white border-2 border-black text-black font-black text-xs md:text-sm px-2 py-1 shadow-[2px_2px_0px_0px_#000] uppercase rotate-2 inline-block">
          Antes
        </span>
      </div>

      {/* Etiqueta "DEPOIS" */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <span className="bg-purple-400 border-2 border-black text-black font-black text-xs md:text-sm px-2 py-1 shadow-[2px_2px_0px_0px_#000] uppercase -rotate-2 inline-block">
          Depois
        </span>
      </div>
    </div>
  );
}