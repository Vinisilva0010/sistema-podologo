// src/components/ui/TypewriterNote.tsx
"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function TypewriterNote({ text, className }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 2000; // Tempo que fica parado antes de apagar

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === text) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
      } else {
        const nextChar = isDeleting 
          ? displayText.slice(0, -1) 
          : text.slice(0, displayText.length + 1);
        setDisplayText(nextChar);
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, text]);

  return (
    <div className={cn("bg-yellow-400 border-4 border-black shadow-brutal-sm px-4 py-2 transform -rotate-3 cursor-default", className)}>
      <span className="font-bold text-sm md:text-base uppercase tracking-wider text-black flex items-center min-h-6">
        👣 {displayText}
        <span className="ml-1 w-2 h-5 bg-black animate-pulse"></span> {/* O cursor piscando */}
      </span>
    </div>
  );
}