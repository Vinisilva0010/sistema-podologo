// src/components/public/CasesSection.tsx
"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import { BrutalBeforeAfter } from "../ui/BrutalBeforeAfter";
import { BrutalButton } from "../ui/BrutalButton";

const WHATSAPP_NUMBER = "5511999999999";

const cases = [
  {
    title: "Reconstrução de Unha",
    description: "Paciente sofria com onicocriptose (unha encravada) há meses. Procedimento indolor realizado em 45 minutos com alívio imediato.",
    // Substitua pelos PNGs ou WEBP reais que você vai gerar
    before: "/antes-1.png",
    after: "/depois-1.png", 
  },
  {
    title: "Tratamento de Fissuras",
    description: "Recuperação da elasticidade da pele do calcanhar através de desbaste técnico e hidratação profunda em apenas 2 sessões.",
    before: "/antes-2.png",
    after: "/depois-2.png",
  }
];

export function CasesSection() {
  const { ref, isVisible } = useScrollReveal();

  const handleWhatsAppClick = () => {
    const text = "Oi, Dra! Vi os resultados no site e gostaria de saber se o meu caso tem jeito. Podemos agendar uma avaliação?";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section className="w-full py-24 bg-purple-900 border-b-4 border-black relative z-10 overflow-hidden">
      
      {/* Background Decorativo Brutalista */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGMtNS41MjMgMC0xMC00LjQ3Ny0xMC0xMHM0LjQ3Ny0xMCAxMC0xMCAxMCA0LjQ3NyAxMCAxMC00LjQ3NyAxMC0xMCAxMHoiIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')]"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Título da Sessão */}
        <div 
          ref={ref}
          className={cn(
            "mb-16 md:mb-20 flex flex-col items-center text-center transition-all duration-700 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <div className="inline-block bg-yellow-400 border-4 border-black px-4 py-2 shadow-brutal-sm mb-6 rotate-2">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-black">
              Não é Promessa
            </h2>
          </div>
          <h3 className="text-4xl md:text-6xl font-black uppercase text-white max-w-3xl leading-[1.1] drop-shadow-[4px_4px_0px_#000]">
            Resultados Reais. <br className="hidden md:block"/> 
            <span className="text-purple-300">Alívio Imediato.</span>
          </h3>
        </div>

        {/* Grid dos Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {cases.map((caseItem, index) => (
            <div key={index} className="flex flex-col gap-4">
              <BrutalBeforeAfter 
                beforeImage={caseItem.before} 
                afterImage={caseItem.after} 
                altText={caseItem.title} 
              />
              <div className="bg-white border-4 border-black p-4 shadow-brutal-sm">
                <h4 className="text-xl font-black uppercase text-black mb-2">{caseItem.title}</h4>
                <p className="text-sm md:text-base font-bold text-gray-700 leading-relaxed">
                  {caseItem.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Final da Sessão */}
        <div className="mt-20 flex flex-col items-center text-center">
           <p className="text-white font-bold text-lg md:text-xl mb-6 bg-black inline-block px-4 py-2 border-2 border-white transform -rotate-1">
              Seu pé também tem jeito. Não sofra mais.
           </p>
           <BrutalButton size="lg" variant="primary" onClick={handleWhatsAppClick} className="w-full md:w-auto text-lg md:text-xl px-12 py-5 bg-yellow-400 hover:bg-yellow-300 text-black">
             Quero esse resultado
           </BrutalButton>
        </div>

      </div>
    </section>
  );
}