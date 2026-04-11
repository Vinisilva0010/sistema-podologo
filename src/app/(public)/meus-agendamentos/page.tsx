// src/app/(public)/meus-agendamentos/page.tsx
"use client";
import { useState } from "react";
import { Search, Calendar, MapPin, Clock, ArrowLeft, Loader2, XCircle } from "lucide-react";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { getAppointmentsByPhoneServer, cancelAppointmentServer } from "@/actions/booking";

// IMPORT DA SERVER ACTION (É AQUI QUE O TYPESCRIPT TAVA CHORANDO)


const CLINIC_ADDRESS = "Av. Principal, 123 - Sala 45, Centro - SP";

export default function MyBookingsPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [myAppointments, setMyAppointments] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    
    setLoading(true);
    
    try {
      // Bate no nosso servidor, que bate no Firebase de forma segura
      const response = await getAppointmentsByPhoneServer(phone);
      
      if (response.success) {
        // A trava de segurança do TypeScript: se vier vazio, vira array vazio
        setMyAppointments(response.data || []);
      } else {
        alert(response.error);
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setHasSearched(true);
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    const isSure = window.confirm("Tem certeza que deseja cancelar esta consulta? Essa ação não pode ser desfeita.");
    
    if (isSure) {
      // 1. Dá o feedback visual instantâneo pro usuário (Optimistic UI)
      setMyAppointments(prev => 
        prev.map(appt => appt.id === id ? { ...appt, status: "cancelled" } : appt)
      );
      
      // 2. Manda a ordem pro servidor em background
      const response = await cancelAppointmentServer(id);
      
      if (response.success) {
        alert("Consulta cancelada com sucesso. Agradecemos por avisar!");
      } else {
        // Se der pau no servidor, a gente avisa e "desfaz" o visual (opcional)
        alert(response.error || "Ocorreu um erro ao cancelar. Chame no WhatsApp.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-brutal-bg flex flex-col items-center pt-8 pb-24 px-4 md:px-6">
      <div className="w-full max-w-2xl">
        
        <div className="flex justify-between items-center mb-10">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 font-black uppercase text-sm border-b-4 border-transparent hover:border-black transition-colors"
          >
            <ArrowLeft strokeWidth={3} className="w-5 h-5" /> Início
          </button>
          <div className="bg-yellow-400 border-4 border-black px-4 py-1 shadow-[4px_4px_0px_0px_#000] rotate-2">
            <span className="font-black uppercase tracking-widest text-sm">Minha Consulta</span>
          </div>
        </div>

        <div className="bg-white border-4 border-black p-6 md:p-10 shadow-brutal mb-8">
          <h1 className="text-3xl md:text-4xl font-black uppercase mb-2">Localizar Agendamento</h1>
          <p className="font-bold text-gray-600 mb-8">Digite o número de WhatsApp usado na reserva para ver os detalhes ou cancelar.</p>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input 
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full border-4 border-black p-4 font-bold outline-none focus:bg-purple-100 transition-colors shadow-[4px_4px_0px_0px_#000]"
              />
            </div>
            <BrutalButton type="submit" variant="primary" size="lg" disabled={loading} className="w-full md:w-auto flex items-center justify-center gap-2 px-8">
              {loading ? <Loader2 className="animate-spin" /> : <><Search className="w-5 h-5" /> Buscar</>}
            </BrutalButton>
          </form>
        </div>

        {hasSearched && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {myAppointments.length > 0 ? (
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-black uppercase border-b-4 border-black pb-2 inline-block">Seus Próximos Horários</h2>
                
                {myAppointments.map((appt) => (
                  <div key={appt.id} className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden group transition-all duration-300">
                    
                    <div className={`border-b-4 border-black p-4 flex justify-between items-center ${appt.status === "cancelled" ? "bg-red-400" : "bg-purple-300"}`}>
                      <span className="font-black uppercase tracking-widest text-black flex items-center gap-2">
                        <Calendar className="w-5 h-5" /> {appt.date}
                      </span>
                      <span className={`bg-white border-2 border-black font-black px-3 py-1 text-sm shadow-[2px_2px_0px_0px_#000] ${appt.status === "cancelled" ? "rotate-2 text-red-600" : "-rotate-2"}`}>
                        {appt.status === "confirmed" ? "Confirmado" : "Cancelado"}
                      </span>
                    </div>

                    <div className={`p-6 ${appt.status === "cancelled" ? "opacity-60 grayscale" : ""}`}>
                      <h3 className={`text-2xl font-black uppercase mb-4 ${appt.status === "cancelled" ? "line-through text-gray-500" : ""}`}>
                        {appt.serviceName}
                      </h3>
                      
                      <div className="flex flex-col gap-3 font-bold text-gray-700">
                        <p className="flex items-center gap-3">
                          <Clock className="w-6 h-6 text-yellow-500 shrink-0" />
                          <span className="text-lg text-black">Horário: <span className="font-black">{appt.startTime}</span></span>
                        </p>
                        
                        <p className="flex items-start gap-3 mt-2">
                          <MapPin className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                          <span>
                            <span className="block text-black font-black uppercase text-sm mb-1">Local do Atendimento</span>
                            {CLINIC_ADDRESS}
                          </span>
                        </p>
                      </div>

                      {appt.status !== "cancelled" && (
                        <div className="mt-8 pt-6 border-t-4 border-black flex flex-col sm:flex-row gap-4">
                          <button 
                            onClick={() => handleCancel(appt.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white border-4 border-black p-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000] hover:bg-red-600 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
                          >
                            <XCircle className="w-5 h-5" /> Cancelar
                          </button>
                          <a 
                            href={`https://wa.me/5511999999999?text=Oi, preciso remarcar meu agendamento de ${appt.serviceName} do dia ${appt.date}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center bg-yellow-400 text-black border-4 border-black p-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000] hover:bg-yellow-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
                          >
                            Remarcar no Zap
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-red-100 border-4 border-black p-8 text-center shadow-[6px_6px_0px_0px_#000]">
                <h3 className="text-2xl font-black uppercase text-red-700 mb-2">Nenhum agendamento</h3>
                <p className="font-bold text-red-900">Não encontramos nenhuma consulta marcada para o número {phone}. Verifique se digitou corretamente.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}