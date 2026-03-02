// src/components/public/ServicesSection.tsx
"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Scissors, Footprints, ShieldPlus, Sparkles, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const WHATSAPP_NUMBER = "5511999999999"; // Coloque o número dela aqui

const services = [
  {
    title: "Unha Encravada",
    description: "Remoção de espículas com técnica indolor e curativo especializado. Alívio imediato na primeira sessão.",
    icon: Scissors,
    color: "bg-red-400",
    image: "/pe1.png", // Substitua pelos PNGs reais depois
  },
  {
    title: "Calos e Rachaduras",
    description: "Desbaste técnico e hidratação profunda. Devolvemos a elasticidade e o aspecto saudável dos seus pés.",
    icon: Footprints,
    color: "bg-yellow-400",
    image: "/pe2.png",
  },
  {
    title: "Pé Diabético",
    description: "Avaliação preventiva, corte técnico e tratamento especializado com foco total em biossegurança.",
    icon: ShieldPlus,
    color: "bg-green-400",
    image: "/pe3.png",
  },
  {
    title: "Infecções e Fungos",
    description: "Tratamento de micoses com limpeza profunda e acompanhamento contínuo até a cura completa.",
    icon: Sparkles,
    color: "bg-blue-400",
    image: "/pe4.png",
  },
];

export function ServicesSection() {
  const { ref, isVisible } = useScrollReveal();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Motor do Carrossel Automático (Só roda no mobile)
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let scrollAmount = 0;
    const scrollStep = carousel.clientWidth; // Pula um card inteiro
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    const interval = setInterval(() => {
      // Se for tela de PC (onde não tem overflow), não faz nada
      if (window.innerWidth >= 768) return; 

      if (scrollAmount >= maxScroll) {
        scrollAmount = 0; // Volta pro começo
      } else {
        scrollAmount += scrollStep;
      }

      carousel.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }, 4000); // Passa a cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-24 bg-brutal-bg border-b-4 border-black relative z-10 overflow-hidden">
      <div className="container mx-auto px-0 md:px-6"> {/* Removemos padding lateral no mobile pro carrossel vazar na tela */}
        
        {/* Título da Sessão */}
        <div 
          ref={ref}
          className={cn(
            "mb-12 md:mb-20 flex flex-col items-center text-center transition-all duration-700 ease-out px-6 md:px-0",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <div className="inline-block bg-purple-300 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_#0f0f0f] mb-6 -rotate-2">
            <h2 className="text-lg md:text-2xl font-black uppercase tracking-widest text-black">
              Nossos Tratamentos
            </h2>
          </div>
          <h3 className="text-4xl md:text-6xl font-black uppercase text-black max-w-3xl leading-[1.1]">
            Especialistas em devolver <br className="hidden md:block"/> 
            <span className="text-purple-700 underline decoration-8 decoration-purple-300">seu conforto</span>
          </h3>
        </div>

        {/* Grid no Desktop / Carrossel no Mobile */}
        <div 
          ref={carouselRef}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-0 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 md:pb-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Esconde barra de scroll nativa
        >
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

// Sub-componente do Card Brutalista
function ServiceCard({ service, index }: { service: any, index: number }) {
  const { ref, isVisible } = useScrollReveal();

  // Função para gerar o link dinâmico do WhatsApp
  const handleWhatsAppClick = () => {
    const text = `Oi, Dra! Estava no site e queria tirar uma dúvida sobre o tratamento de *${service.title}*.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div 
      ref={ref}
      style={{ transitionDelay: `${index * 150}ms` }}
      className={cn(
        "group min-w-[85vw] md:min-w-0 snap-center bg-white border-4 border-black flex flex-col items-start transition-all duration-500 ease-out md:hover:-translate-y-2 shadow-[8px_8px_0px_0px_#0f0f0f] md:hover:shadow-[12px_12px_0px_0px_#0f0f0f]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      )}
    >
      {/* Parte superior (Texto e Ícone) */}
      <div className="p-6 flex-grow flex flex-col">
        <div className={cn("w-14 h-14 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#0f0f0f] mb-6 transition-transform md:group-hover:rotate-12", service.color)}>
          <service.icon className="w-7 h-7 text-black" strokeWidth={2.5} />
        </div>
        
        <h4 className="text-2xl font-black uppercase text-black mb-3">
          {service.title}
        </h4>
        
        <p className="text-base font-bold text-gray-700 leading-relaxed mb-4">
          {service.description}
        </p>
      </div>

      {/* A Imagem do Serviço incorporada na base do Card */}
      <div className="w-full h-40 border-t-4 border-black relative overflow-hidden bg-gray-200">
        <Image 
  src={service.image} 
  alt={`Tratamento de ${service.title}`}
  fill
 
  className="object-cover md:grayscale group-hover:grayscale-0 transition-all duration-500 scale-[1.08]"
/>
        {/* Overlay brutalista de scanlines (efeito estilo TV antiga) opcional */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      </div>

      {/* O Botão Call to Action direto pro WhatsApp */}
      <button 
        onClick={handleWhatsAppClick}
        className="w-full bg-brutal-black text-white p-4 flex items-center justify-between hover:bg-purple-700 transition-colors cursor-pointer group/btn"
      >
        <span className="font-black uppercase tracking-wider text-sm md:text-base">Saiba mas</span>
        <MessageCircle className="w-6 h-6 transform group-hover/btn:scale-110 transition-transform text-yellow-400" />
      </button>

    </div>
  );
}