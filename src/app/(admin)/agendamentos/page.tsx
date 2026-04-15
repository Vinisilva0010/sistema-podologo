// src/app/(admin)/agendamentos/page.tsx
"use client";
import { useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";
import { Calendar, Clock, User, Phone, CheckCircle2, XCircle, Loader2, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminAgendaPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Adicionamos o filtro de "completed" (Concluídos)
  const [filter, setFilter] = useState<"all" | "confirmed" | "cancelled" | "completed">("all");

  useEffect(() => {
    const auth = getAuth();
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, "appointments"),
          orderBy("date", "asc"),
          orderBy("startTime", "asc")
        );

        unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const fetched: any[] = [];
          snapshot.forEach((doc) => {
            fetched.push({ id: doc.id, ...doc.data() });
          });
          setAppointments(fetched);
          setLoading(false);
        }, (error) => {
          console.error("Erro ao escutar agenda:", error);
          setLoading(false);
        });
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  // A MÁGICA DA DOUTORA: Muda o status direto no banco
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const isSure = window.confirm(
      newStatus === "completed" 
        ? "Confirmar que o paciente foi atendido e finalizar a consulta?" 
        : "Tem certeza que deseja cancelar esta consulta pelo lado da clínica?"
    );
    
    if (!isSure) return;

    try {
      await updateDoc(doc(db, "appointments", id), { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar o sistema.");
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    if (filter === "all") return true;
    return appt.status === filter;
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen pb-24">
      
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black uppercase text-black mb-2">Agenda Oficial</h1>
          <p className="font-bold text-gray-600">Controle de pacientes e horários marcados em tempo real.</p>
        </div>

        {/* Filtros Brutalistas Atualizados */}
        <div className="flex flex-wrap bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
          <button onClick={() => setFilter("all")} className={cn("px-4 py-2 font-black uppercase text-sm border-r-4 border-black transition-colors", filter === "all" ? "bg-pink-500 text-white" : "hover:bg-pink-100")}>Todos</button>
          <button onClick={() => setFilter("confirmed")} className={cn("px-4 py-2 font-black uppercase text-sm border-r-4 border-black transition-colors", filter === "confirmed" ? "bg-yellow-400 text-black" : "hover:bg-yellow-100")}>Pendentes</button>
          <button onClick={() => setFilter("completed")} className={cn("px-4 py-2 font-black uppercase text-sm border-r-4 border-black transition-colors", filter === "completed" ? "bg-green-500 text-white" : "hover:bg-green-100")}>Atendidos</button>
          <button onClick={() => setFilter("cancelled")} className={cn("px-4 py-2 font-black uppercase text-sm transition-colors", filter === "cancelled" ? "bg-red-500 text-white" : "hover:bg-red-100")}>Cancelados</button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 border-4 border-black bg-white shadow-brutal">
          <Loader2 className="w-12 h-12 animate-spin text-pink-600 mb-4" strokeWidth={3} />
          <p className="font-black uppercase tracking-widest text-gray-400">Sincronizando Agenda...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => (
              <div 
                key={appt.id} 
                className={cn(
                  "bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] transition-all flex flex-col justify-between",
                  appt.status === "cancelled" && "opacity-60 bg-gray-50",
                  appt.status === "completed" && "bg-green-50 border-green-900"
                )}
              >
                {/* Linha de Data e Status */}
                <div className="flex justify-between items-start mb-6 border-b-4 border-black pb-4">
                  <div className="flex flex-col">
                    <span className="font-black text-2xl uppercase flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-pink-600" strokeWidth={3} /> {appt.date}
                    </span>
                    <span className="font-black text-xl text-gray-600 flex items-center gap-2 mt-1">
                      <Clock className="w-5 h-5 text-yellow-500" strokeWidth={3} /> {appt.startTime} - {appt.endTime}
                    </span>
                  </div>
                  
                  {appt.status === "confirmed" && <span className="bg-yellow-400 border-2 border-black px-3 py-1 font-black uppercase text-sm flex items-center gap-1 shadow-[2px_2px_0px_0px_#000] rotate-2">Aguardando</span>}
                  {appt.status === "completed" && <span className="bg-green-500 text-white border-2 border-black px-3 py-1 font-black uppercase text-sm flex items-center gap-1 shadow-[2px_2px_0px_0px_#000] -rotate-2"><CheckCheck className="w-4 h-4" /> Finalizado</span>}
                  {appt.status === "cancelled" && <span className="bg-red-500 text-white border-2 border-black px-3 py-1 font-black uppercase text-sm flex items-center gap-1 shadow-[2px_2px_0px_0px_#000] rotate-2"><XCircle className="w-4 h-4" /> Cancelado</span>}
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-bold text-xs uppercase text-gray-500 tracking-widest mb-1">Paciente</p>
                    <p className="font-black text-xl uppercase flex items-center gap-2"><User className="w-5 h-5 text-gray-400" /> {appt.patientName}</p>
                    <p className="font-bold text-gray-600 flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" /> 
                      <a href={`https://wa.me/55${appt.patientPhone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 hover:underline">{appt.patientPhone}</a>
                    </p>
                  </div>

                  <div className="bg-pink-100 border-l-4 border-pink-500 p-3">
                    <p className="font-bold text-xs uppercase text-pink-800 tracking-widest mb-1">Tratamento</p>
                    <p className="font-black text-lg uppercase text-pink-900">{appt.serviceName}</p>
                  </div>

                  {/* AÇÕES DA DOUTORA (Só aparecem se a consulta estiver pendente) */}
                  {appt.status === "confirmed" && (
                    <div className="mt-4 pt-4 border-t-4 border-black flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => handleUpdateStatus(appt.id, "completed")}
                        className="flex-1 bg-green-400 border-4 border-black font-black uppercase text-sm py-3 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:bg-green-300 transition-all active:translate-y-1 active:shadow-none flex justify-center items-center gap-2"
                      >
                        <CheckCheck className="w-5 h-5" /> Dar Baixa (Atendido)
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(appt.id, "cancelled")}
                        className="sm:w-1/3 bg-red-400 border-4 border-black font-black uppercase text-sm py-3 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:bg-red-300 transition-all active:translate-y-1 active:shadow-none flex justify-center items-center"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-gray-100 border-4 border-black p-10 text-center shadow-brutal">
              <h3 className="text-2xl font-black uppercase text-gray-500 mb-2">Agenda Limpa</h3>
              <p className="font-bold text-gray-500">Nenhum paciente encontrado para este filtro.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}