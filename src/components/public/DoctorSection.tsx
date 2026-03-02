// Final code for src/components/public/DoctorSection.tsx
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

        {/* O BENTO BOX (Grid CSS Puro, 1 col mobile, 3 col/2 rows PC) */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 md:gap-8 auto-rows-fr">
          
          {/* Bloco 1: A Copy Matadora (Ocupa 2 colunas no PC) */}
          <div className="md:col-span-2 bg-white border-4 border-black p-8 md:p-10 shadow-brutal flex flex-col justify-center group hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#0f0f0f] transition-all duration-300">
            <div className="w-16 h-16 bg-purple-300 border-4 border-black flex items-center justify-center mb-6 shadow-brutal-sm rotate-3 group-hover:rotate-12 transition-transform">
              <Star className="w-8 h-8 text-black" strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl md:text-4xl font-black uppercase mb-4 text-black">
              Dra. [Nome Dela Aqui]
            </h3>
            <p className="text-lg md:text-xl font-bold text-gray-700 leading-relaxed max-w-xl">
              Esqueça aquele atendimento frio e cheio de dor. Nossa missão é resolver o seu problema na raiz com técnica avançada, ferramentas estéreis e uma abordagem 100% focada no seu alívio imediato.
            </p>
          </div>

          {/* Bloco 2: A Foto em Ação (Ocupa 2 linhas no PC, min-h no mobile) */}
          <div className="md:row-span-2 relative min-h-[400px] md:min-h-0 border-4 border-black bg-purple-900 shadow-brutal overflow-hidden group">
            {/* Overlay amarelo brutalista */}
            <div className="absolute inset-0 bg-yellow-400/20 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-500"></div>
            
            <Image 
              src="/dra-acao.png" // A foto que você vai gerar
              alt="Dra. realizando procedimento"
              fill
              className="object-cover md:grayscale group-hover:grayscale-0 transition-all duration-700 scale-[1.05] group-hover:scale-100"
            />
            
            {/* Etiqueta na foto */}
            <div className="absolute bottom-6 left-6 z-20 bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_#0f0f0f] -rotate-2">
              <span className="font-black uppercase tracking-wider text-sm">Em Ação</span>
            </div>
          </div>

          {/* Bloco 3: Números de Autoridade (Totalmente diferente no mobile, original no PC) */}
          <div className="md:col-span-1 bg-yellow-400 border-4 border-black shadow-brutal flex flex-col items-center md:items-start justify-center text-center md:text-left transition-all duration-300 group hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#0f0f0f]">
            {/* MÓVEL-APENAS (extremamente compacto, uma barra de status) */}
            <div className="block md:hidden w-full p-2 flex flex-row items-center justify-between gap-1">
              <Award className="w-5 h-5 text-black" strokeWidth={3} />
              <span className="text-xl font-black text-black tracking-tighter">
                +5k <span className="text-xs font-bold uppercase tracking-widest text-gray-900">PÉS RECUPERADOS</span>
              </span>
            </div>

            {/* PC-APENAS (o design original) */}
            <div className="hidden md:flex flex-col items-start justify-center w-full p-8 md:p-10 text-left">
              <Award className="w-12 h-12 text-black mb-4" strokeWidth={2.5} />
              <span className="text-6xl font-black text-black tracking-tighter mb-2">
                +5k
              </span>
              <span className="font-bold uppercase tracking-widest text-sm text-black border-t-4 border-black pt-2 w-full">
                PÉS RECUPERADOS
              </span>
            </div>
          </div>

          {/* Bloco 4: Selo de Biossegurança (Totalmente diferente no mobile, original no PC) */}
          <div className="md:col-span-1 bg-purple-500 border-4 border-black shadow-brutal flex flex-col items-center justify-center text-center transition-all duration-300 overflow-hidden relative group hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#0f0f0f]">
            {/* MÓVEL-APENAS (compacto, barra de status) */}
            <div className="block md:hidden w-full p-2 flex flex-row items-center justify-between gap-1 relative z-10">
              <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
              <span className="text-xl font-black text-white tracking-tighter leading-none">
                BIOSSEGURANÇA <span className="text-xs font-bold uppercase tracking-widest text-purple-100">HOSPITALAR</span>
              </span>
            </div>

            {/* PC-APENAS (o design original, stacked) */}
            <div className="hidden md:flex flex-col items-center justify-center w-full p-8 md:p-10 text-center relative z-10">
              <ShieldCheck className="w-16 h-16 text-white mb-4 flex-shrink-0" strokeWidth={2} />
              <h4 className="text-2xl font-black uppercase text-white">
                Biossegurança <br/> Hospitalar
              </h4>
            </div>

            {/* Estrela rodando no fundo (Easter Egg visual) - Mantemos para ambos, ajustado */}
            <div className="absolute -right-4 -bottom-4 md:-right-10 md:-bottom-10 w-24 h-24 md:w-48 md:h-48 bg-purple-400 opacity-50 rotate-45 group-hover:rotate-90 transition-transform duration-700 ease-in-out"></div>
          </div>

        </div>
      </div>
    </section>
  );
}