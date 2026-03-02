// src/components/public/Hero.tsx
import Image from "next/image";
import { BrutalButton } from "../ui/BrutalButton";
import { TypewriterNote } from "../ui/TypewriterNote"; // O componente que acabamos de criar

export function Hero() {
  return (
    <>
      <section className="relative w-full min-h-[90vh] flex flex-col lg:flex-row items-center justify-center overflow-hidden bg-purple-800 border-b-[6px] border-black pt-12 pb-24 md:pb-12">

        {/* 1. Fundo Desfocado com Pan Lateral no Mobile */}
        <div className="absolute inset-0 z-0">
          {/* Overlay roxo mais claro como você pediu */}
          <div className="absolute inset-0 bg-purple-800/40 mix-blend-multiply z-10" />
          {/* Note a classe animate-[panImage_30s_linear_infinite_alternate] puxando nossa keyframe do css */}
          <img 
            src="/p-hero.png" 
            alt="Fundo Clínica de Podologia" 
            className="object-cover w-full h-full opacity-60 animate-[panImage_30s_linear_infinite_alternate]"
          />
        </div>

        <div className="container mx-auto px-6 relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full pt-10 lg:pt-0">
          
          {/* 2. Coluna da Esquerda: A Copy (No mobile, isso desce pra baixo da foto) */}
          <div className="flex flex-col items-start justify-center gap-4 md:gap-6 order-2 lg:order-1">
            
            {/* O "Post-it" com efeito de máquina de escrever */}
            <TypewriterNote text="O Fim da Dor nos seus Pés" className="mb-2" />

            <h1 className="text-4xl md:text-7xl font-black text-white uppercase leading-[1.05] drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              Podologia <br />
              <span className="text-purple-300">Avançada</span>
            </h1>

            {/* Nome da Doutora destacado em bloco */}
            <div className="bg-black border-4 border-white text-white px-4 py-2 shadow-[4px_4px_0px_0px_#d8b4fe] md:shadow-[6px_6px_0px_0px_#d8b4fe]">
              <h2 className="text-xl md:text-3xl font-bold tracking-wide">Dra. Nome da Podóloga</h2>
            </div>

            {/* Esse parágrafo longo eu escondi no celular pra não ficar chato de ler */}
            <p className="text-base md:text-xl text-purple-50 max-w-lg font-medium bg-black/50 p-3 md:p-4 border-l-4 border-purple-400 backdrop-blur-sm hidden md:block">
              Tratamento humanizado para unhas encravadas, calos e dores. Recupere o conforto a cada passo sem enrolação e com biossegurança total.
            </p>

            {/* Botão Agendar (SÓ APARECE NO DESKTOP AQUI) */}
            <div className="hidden md:flex flex-wrap gap-4 mt-4 w-full">
              <BrutalButton size="lg" variant="primary" className="w-full sm:w-auto">
                Agendar Avaliação
              </BrutalButton>
            </div>
          </div>

          {/* 3. Coluna da Direita: A Foto dela em PNG (No mobile, isso vai pro topo) */}
          <div className="relative h-87.5 md:h-125 lg:h-full w-full flex items-end justify-center mt-4 lg:mt-0 order-1 lg:order-2">
            
           {/* Portal Brutalista (Arco) */}
<div className="absolute bottom-0 w-65h-80 md:w-95 md:h-[500px] bg-purple-300 rounded-t-[150px] md:rounded-t-[200px] border-4 border-black border-b-0 shadow-[10px_0px_0px_0px_#0f0f0f] z-0"></div>
            
            {/* Área da imagem PNG sem fundo */}
            <div className="relative z-10 w-full h-full flex items-end justify-center">
                           

               <Image 
                src="/perfil.png" 
                alt="Foto da Dra." 
                fill 
                className="object-contain object-bottom"
                priority
              /> 
             
            </div>
          </div>
        </div>
      </section>

      {/* 4. O STICKY BUTTON (O segredo da conversão: Fixo no rodapé APENAS no Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t-4 border-black z-50 flex justify-center shadow-[0px_-4px_0px_0px_#000]">
         <BrutalButton size="lg" variant="primary" className="w-full text-lg">
            AGENDAR AGORA
         </BrutalButton>
      </div>
    </>
  );
}