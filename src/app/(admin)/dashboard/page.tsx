// src/app/(admin)/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { collection, query, onSnapshot, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";
import { Users, DollarSign, Clock, Calendar, ArrowRight, Activity } from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  
  // Métricas de Hoje
  const [todayTotal, setTodayTotal] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  
  // Próximo Paciente
  const [nextPatient, setNextPatient] = useState<any | null>(null);

  useEffect(() => {
    const auth = getAuth();
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 1. Puxa o dicionário de preços primeiro (Igual no financeiro)
          const servicesSnap = await getDocs(collection(db, "services"));
          const pricesMap: Record<string, number> = {};
          servicesSnap.forEach(doc => {
            pricesMap[doc.id] = doc.data().price || 0;
          });

          // 2. Escuta TODOS os agendamentos em tempo real
          const q = query(collection(db, "appointments"));

          unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
            // Pega a data de hoje formatada YYYY-MM-DD
            const todayStr = new Date().toLocaleDateString('en-CA'); // 'en-CA' garante o formato YYYY-MM-DD
            
            let countTotal = 0;
            let countCompleted = 0;
            let sumRevenue = 0;
            let upcoming: any[] = [];

            snapshot.forEach((doc) => {
              const data = doc.data();
              
              // Filtra só o que é de HOJE
              if (data.date === todayStr && data.status !== "cancelled") {
                countTotal++;
                
                if (data.status === "completed") {
                  countCompleted++;
                  const price = Number(data.price) || pricesMap[data.serviceId] || 0;
                  sumRevenue += price;
                }

                if (data.status === "confirmed") {
                  upcoming.push({ id: doc.id, ...data });
                }
              }
            });

            // Acha o próximo paciente de hoje (o mais cedo que ainda tá 'confirmed')
            upcoming.sort((a, b) => {
              return a.startTime.localeCompare(b.startTime);
            });

            setTodayTotal(countTotal);
            setTodayCompleted(countCompleted);
            setTodayRevenue(sumRevenue);
            setNextPatient(upcoming.length > 0 ? upcoming[0] : null);
            setLoading(false);
          });

        } catch (error) {
          console.error("Erro ao carregar dashboard:", error);
          setLoading(false);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen pb-24">
      
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black uppercase text-black mb-2 flex items-center gap-3">
          <Activity className="w-10 h-10 text-purple-600" strokeWidth={3} /> Painel Geral
        </h1>
        <p className="font-bold text-gray-600">Visão panorâmica da clínica em tempo real.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 border-4 border-black bg-white shadow-brutal">
          <Activity className="w-12 h-12 animate-pulse text-purple-600 mb-4" strokeWidth={3} />
          <p className="font-black uppercase tracking-widest text-gray-400">Analisando dados...</p>
        </div>
      ) : (
        <>
          {/* BLOCO 1: MÉTRICAS DE HOJE */}
          <h2 className="text-xl font-black uppercase border-b-4 border-black pb-2 mb-6">Seu Resumo de Hoje</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-black uppercase text-sm tracking-widest text-gray-500">Pacientes Hoje</h2>
                <div className="bg-purple-200 border-2 border-black p-2"><Users className="w-5 h-5 text-purple-700" strokeWidth={3} /></div>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-5xl font-black">{todayTotal}</p>
                <p className="font-bold text-gray-500 mb-1">agendados</p>
              </div>
            </div>

            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-black uppercase text-sm tracking-widest text-gray-500">Já Atendidos</h2>
                <div className="bg-blue-200 border-2 border-black p-2"><Calendar className="w-5 h-5 text-blue-700" strokeWidth={3} /></div>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-5xl font-black">{todayCompleted}</p>
                <p className="font-bold text-gray-500 mb-1">de {todayTotal}</p>
              </div>
            </div>

            <div className="bg-green-400 border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between transform transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-black uppercase text-sm tracking-widest text-black">Entradas de Hoje</h2>
                <div className="bg-white border-2 border-black p-2"><DollarSign className="w-5 h-5 text-green-600" strokeWidth={3} /></div>
              </div>
              <p className="text-4xl lg:text-5xl font-black truncate">{formatBRL(todayRevenue)}</p>
            </div>

          </div>

          {/* BLOCO 2: PRÓXIMO PACIENTE */}
          <h2 className="text-xl font-black uppercase border-b-4 border-black pb-2 mb-6">Quem é o próximo?</h2>
          
          {nextPatient ? (
            <div className="bg-yellow-400 border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-white border-4 border-black p-4 flex flex-col items-center justify-center min-w-[100px] -rotate-2">
                  <Clock className="w-8 h-8 text-black mb-1" strokeWidth={3} />
                  <span className="font-black text-xl">{nextPatient.startTime}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase mb-1">{nextPatient.patientName}</h3>
                  <p className="font-bold text-gray-800 text-lg">{nextPatient.serviceName}</p>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.href = '/agendamentos'}
                className="bg-white border-4 border-black font-black uppercase text-sm px-6 py-3 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:bg-gray-50 transition-all active:translate-y-1 active:shadow-none flex items-center gap-2"
              >
                Ir para Agenda <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="bg-gray-100 border-4 border-black p-10 text-center shadow-brutal border-dashed">
              <h3 className="text-2xl font-black uppercase text-gray-400 mb-2">Tudo Limpo!</h3>
              <p className="font-bold text-gray-500">Você não tem mais pacientes na fila de espera para hoje.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}