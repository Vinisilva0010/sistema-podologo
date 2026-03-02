// src/components/public/Footer.tsx
import { MapPin, Phone, Clock, Instagram, Facebook, ArrowRight } from "lucide-react";
import { BrutalButton } from "../ui/BrutalButton";

const WHATSAPP_NUMBER = "5511999999999";
const INSTAGRAM_LINK = "https://instagram.com/suaclinica";
const MAPS_LINK = "https://maps.google.com/?q=Sua+Clinica+Endereco";

export function Footer() {
  const handleWhatsAppClick = () => {
    const text = "Oi! Cheguei no fim do site e quero agendar minha avaliação.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <footer className="w-full relative z-10 flex flex-col">
      
      {/* 1. O Grito (Faixa Final de Conversão) */}
      <div className="bg-yellow-400 border-y-4 border-black py-16 px-6">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-4xl md:text-6xl font-black uppercase text-black leading-tight mb-2">
              Ainda com dor?
            </h2>
            <p className="text-lg md:text-xl font-bold text-gray-800 uppercase tracking-widest">
              Não adie o seu alívio.
            </p>
          </div>
          <div className="w-full md:w-auto">
            {/* Usando a tag a com o visual do nosso BrutalButton pra SEO e semântica */}
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Oi! Cheguei no site e quero agendar minha avaliação.`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center font-black text-xl md:text-2xl uppercase tracking-wider bg-purple-500 text-white border-4 border-black px-8 py-5 shadow-brutal hover:bg-purple-400 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#0f0f0f] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-200 w-full md:w-auto"
            >
              Falar no WhatsApp
              <ArrowRight className="ml-4 w-8 h-8 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
            </a>
          </div>
        </div>
      </div>

      {/* 2. A Base (Informações e Endereço) */}
      <div className="bg-brutal-black text-white pt-20 pb-12 px-6 border-b-8 border-purple-500">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          {/* Coluna 1: Marca e Redes */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="bg-white border-4 border-black px-6 py-3 shadow-[6px_6px_0px_0px_#a855f7] mb-8 -rotate-2">
              <h3 className="text-2xl font-black uppercase tracking-widest text-black">
                Podologia
              </h3>
            </div>
            <p className="text-gray-400 font-bold mb-8 max-w-sm">
              Tratamento humanizado e biossegurança de nível hospitalar. Devolvendo o conforto para os seus pés.
            </p>
            <div className="flex gap-4">
              <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="bg-white text-black border-4 border-black p-3 hover:bg-yellow-400 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_#a855f7]">
                <Instagram className="w-6 h-6" strokeWidth={2.5} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="bg-white text-black border-4 border-black p-3 hover:bg-yellow-400 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_#a855f7]">
                <Facebook className="w-6 h-6" strokeWidth={2.5} />
              </a>
            </div>
          </div>

          {/* Coluna 2: Contato e Local */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-xl font-black uppercase text-yellow-400 mb-6 border-b-4 border-yellow-400 pb-2 inline-block">
              Onde Estamos
            </h4>
            <ul className="flex flex-col gap-6 font-bold text-gray-300">
              <li className="flex flex-col md:flex-row items-center md:items-start gap-3 group">
                <MapPin className="w-6 h-6 text-purple-400 flex-shrink-0 group-hover:text-yellow-400 transition-colors" />
                <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline decoration-2 underline-offset-4 transition-colors">
                  Av. Principal, 123 - Sala 45<br />
                  Bairro Centro - Cidade, SP
                </a>
              </li>
              <li className="flex flex-col md:flex-row items-center md:items-start gap-3">
                <Phone className="w-6 h-6 text-purple-400 flex-shrink-0" />
                <span>(11) 99999-9999</span>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Horários */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-xl font-black uppercase text-yellow-400 mb-6 border-b-4 border-yellow-400 pb-2 inline-block">
              Horário de Atendimento
            </h4>
            <ul className="flex flex-col gap-4 font-bold text-gray-300 w-full max-w-xs">
              <li className="flex justify-between items-center border-b-2 border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span>Seg - Sex</span>
                </div>
                <span className="text-white">08:00 - 18:00</span>
              </li>
              <li className="flex justify-between items-center border-b-2 border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span>Sábado</span>
                </div>
                <span className="text-white">08:00 - 12:00</span>
              </li>
              <li className="flex justify-between items-center text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span>Domingo</span>
                </div>
                <span>Fechado</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. A Assinatura (Easter Egg Zanvexis) */}
        <div className="container mx-auto max-w-7xl mt-16 pt-8 border-t-4 border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-gray-500">
          <p>© {new Date().getFullYear()} Clínica de Podologia. Todos os direitos reservados.</p>
          <p className="flex items-center gap-2">
            Desenvolvido por 
            <a href="#" className="bg-purple-900 text-white px-2 py-1 border-2 border-purple-500 hover:bg-yellow-400 hover:text-black hover:border-black transition-colors uppercase tracking-widest font-black">
              Zanvexis
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}