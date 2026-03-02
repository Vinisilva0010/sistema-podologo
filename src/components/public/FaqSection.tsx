// src/components/public/FaqSection.tsx
"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const faqs = [
  {
    question: "Dói muito para tratar unha encravada?",
    answer: "Não! Esse é o maior mito da podologia. Nós utilizamos técnicas avançadas, instrumentais adequados e emolientes específicos que amolecem a região. O alívio é quase imediato após a remoção da espícula (o pedaço de unha que está machucando).",
  },
  {
    question: "Qual a diferença entre ir na pedicure e na podóloga?",
    answer: "A pedicure cuida do embelezamento superficial (esmaltação, corte simples). A podologia é a área da SAÚDE focada em diagnosticar e tratar patologias (infecções, fungos, calos profundos, pé diabético) com biossegurança nível hospitalar (autoclave).",
  },
  {
    question: "Vocês atendem pacientes com diabetes?",
    answer: "Sim, somos especialistas em pé diabético. Pacientes com diabetes precisam de um cuidado redobrado devido à dificuldade de cicatrização e perda de sensibilidade. Nosso protocolo é 100% focado em prevenção e tratamento seguro sem cortes de risco.",
  },
  {
    question: "Quanto tempo dura uma sessão?",
    answer: "Depende muito do caso. Uma profilaxia básica (limpeza preventiva) dura em média 45 minutos. Já o tratamento de uma unha muito inflamada pode levar 1 hora. O importante é: nós não fazemos nada correndo. Seu pé terá o tempo que precisar.",
  },
];

export function FaqSection() {
  const { ref, isVisible } = useScrollReveal(0.1);
  // Controla qual pergunta está aberta (null = todas fechadas)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-24 bg-white border-b-4 border-black relative z-10">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Título da Sessão */}
        <div 
          ref={ref}
          className={cn(
            "mb-12 md:mb-16 flex flex-col items-center text-center transition-all duration-700 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}
        >
          <div className="inline-block bg-purple-500 border-4 border-black px-4 py-2 shadow-brutal-sm mb-6 -rotate-2">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white">
              Tire suas Dúvidas
            </h2>
          </div>
          <h3 className="text-4xl md:text-5xl font-black uppercase text-black leading-tight">
            Perguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-purple-500 underline decoration-8 decoration-black">Frequentes</span>
          </h3>
        </div>

        {/* Lista de Acordeões Brutalistas */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index}
                className={cn(
                  "border-4 border-black transition-all duration-300",
                  isOpen ? "bg-yellow-400 shadow-[8px_8px_0px_0px_#0f0f0f] -translate-y-1" : "bg-brutal-bg shadow-[4px_4px_0px_0px_#0f0f0f] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0f0f0f]"
                )}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none group"
                >
                  <span className="text-lg md:text-xl font-black text-black pr-4">
                    {faq.question}
                  </span>
                  <div className={cn(
                    "w-10 h-10 border-4 border-black flex items-center justify-center flex-shrink-0 transition-transform duration-300 bg-white",
                    isOpen ? "rotate-180" : "group-hover:rotate-90"
                  )}>
                    {isOpen ? <Minus strokeWidth={3} className="text-black" /> : <Plus strokeWidth={3} className="text-black" />}
                  </div>
                </button>

                {/* Área da Resposta (CSS Grid hack para animar altura dinamicamente) */}
                <div 
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 pt-0 text-base md:text-lg font-bold text-gray-800 border-t-4 border-black mt-2 bg-white m-4 shadow-[4px_4px_0px_0px_#000]">
                      <p className="pt-4">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}