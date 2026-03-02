// src/components/public/DoctorSection.tsx
"use client";
import Image from "next/image";
import { Star, ShieldCheck, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function DoctorSection() {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section className="w-full py-24 bg-brutal-bg border-b-4 border-black relative z-10">
      <div className="container mx-auto px-6">
        
        {/* Título da Sessão */}
        <div 
          ref={ref}
          className={cn(
            "mb-12 md:mb-16 flex flex-col items-start transition-all duration-700 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase text-black max-w-2xl leading-[1.05]">
            Não entregue seus pés <br />
            <span className="text-purple-700 underline decoration-8 decoration-yellow-400">a amadores.</span>
          </h2>
        </div>

        {/* O BENTO BOX */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 md:gap-8 auto-rows-fr">
          
          {/* Bloco 1: A Copy Matadora */}
          <div className="md:col-span-2 bg-white border-4 border-black p-8 md:p-10 shadow-[6px_6px_0px_0px_#0f0f0f] md:shadow-brutal flex flex-col justify-center group hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#0f0f0f] transition-all duration-300">
            <div className="w-16 h-16 bg-purple-300 border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#0f0f0f] rotate-3 group-hover:rotate-12 transition-transform">
              <Star className="w-8 h-8 text-black" strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl md:text-4xl font-black uppercase mb-4 text-black">
              Dra. [Nome Dela Aqui]
            </h3>
            <p className="text-lg md:text-xl font-bold text-gray-700 leading-relaxed max-w-xl">
              Esqueça aquele atendimento frio e cheio de dor. Nossa missão é resolver o seu problema na raiz com técnica avançada, ferramentas estéreis e uma abordagem 100% focada no seu alívio imediato.
            </p>
          </div>

          {/* Bloco 2: A Foto em Ação */}
          <div className="md:row-span-2 relative min-h-[400px] border-4 border-black bg-purple-900 shadow-[6px_6px_0px_0px_#0f0f0f] md:shadow-brutal overflow-hidden group">
            {/* Overlay amarelo brutalista */}
            <div className="absolute inset-0 bg-yellow-400/20 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-500"></div>
            
            <Image 
              src="/dra-acao.png" 
              alt="Dra. realizando procedimento"
              fill
              className="object-cover md:grayscale group-hover:grayscale-0 transition-all duration-700 scale-[1.05] group-hover:scale-100"
            />
            
            {/* Etiqueta na foto */}
            <div className="absolute bottom-6 left-6 z-20 bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_#0f0f0f] -rotate-2">
              <span className="font-black uppercase tracking-wider text-sm">Em Ação</span>
            </div>
          </div>

          {/* Bloco 3: Números de Autoridade (HIDDEN NO MOBILE) */}
          <div className="hidden md:flex md:col-span-1 bg-yellow-400 border-4 border-black p-8 shadow-brutal flex-col items-center justify-center text-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#0f0f0f]">
            <Award className="w-12 h-12 text-black mb-4" strokeWidth={2.5} />
            <span className="text-5xl lg:text-6xl font-black text-black tracking-tighter mb-2">
              +5k
            </span>
            <span className="font-bold uppercase tracking-widest text-sm text-black border-t-4 border-black pt-2 w-full">
              Pés Recuperados
            </span>
          </div>

          {/* Bloco 4: Selo de Biossegurança (HIDDEN NO MOBILE) */}
          <div className="hidden md:flex md:col-span-1 bg-purple-500 border-4 border-black p-8 shadow-brutal flex-col items-center justify-center text-center overflow-hidden relative group hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#0f0f0f] transition-all duration-300">
            <ShieldCheck className="w-16 h-16 text-white mb-4 relative z-10 group-hover:scale-110 transition-transform" strokeWidth={2} />
            <h4 className="text-xl lg:text-2xl font-black uppercase text-white relative z-10">
              Biossegurança <br/> Hospitalar
            </h4>
            
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-400 opacity-50 rotate-45 group-hover:rotate-90 transition-transform duration-700 ease-in-out"></div>
          </div>

        </div>
      </div>
    </section>
  );
}