// src/app/(admin)/financeiro/page.tsx
"use client";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase";
import { DollarSign, TrendingUp, Calendar as CalendarIcon, Loader2, ArrowRight } from "lucide-react";

export default function FinanceiroPage() {
  const [loading, setLoading] = useState(true);
  
  // Nossas métricas
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  
  // Histórico para a tabela
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 1. Busca os preços dos serviços (O Dicionário de Preços)
          const servicesSnap = await getDocs(collection(db, "services"));
          const pricesMap: Record<string, number> = {};
          servicesSnap.forEach(doc => {
            pricesMap[doc.id] = doc.data().price || 0;
          });

          // 2. Busca APENAS as consultas que já deram baixa (completed)
          const q = query(
            collection(db, "appointments"),
            where("status", "==", "completed")
          );
          
          const appointmentsSnap = await getDocs(q);
          
          let sumTotal = 0;
          let sumMonth = 0;
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const fetchedHistory: any[] = [];

          appointmentsSnap.forEach((doc) => {
            const data = doc.data();
            // Acha o preço do serviço (se o serviço foi apagado, assume 0)
            const price = pricesMap[data.serviceId] || 0;
            
            sumTotal += price;

            // Checa se a consulta foi feita neste mês
            if (data.date) {
              const [year, month] = data.date.split('-');
              if (parseInt(year) === currentYear && parseInt(month) - 1 === currentMonth) {
                sumMonth += price;
              }
            }

            fetchedHistory.push({
              id: doc.id,
              ...data,
              priceCalculated: price
            });
          });

          // Ordenação feita no JS para evitar erro de Index no Firebase
          fetchedHistory.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.startTime}`);
            const dateB = new Date(`${b.date}T${b.startTime}`);
            return dateB.getTime() - dateA.getTime(); // Mais recentes primeiro
          });

          setTotalRevenue(sumTotal);
          setMonthRevenue(sumMonth);
          setCompletedCount(fetchedHistory.length);
          setHistory(fetchedHistory);
          
        } catch (error) {
          console.error("Erro ao buscar dados financeiros:", error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Formatador de Moeda
  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen pb-24">
      
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black uppercase text-black mb-2">Caixa Forte</h1>
        <p className="font-bold text-gray-600">Métricas de faturamento e histórico de entradas.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 border-4 border-black bg-white shadow-brutal">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mb-4" strokeWidth={3} />
          <p className="font-black uppercase tracking-widest text-gray-400">Contando as notas...</p>
        </div>
      ) : (
        <>
          {/* CARDS DE MÉTRICAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            <div className="bg-green-400 border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] transform transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6" strokeWidth={3} />
                <h2 className="font-black uppercase text-sm tracking-widest">Faturamento do Mês</h2>
              </div>
              <p className="text-4xl lg:text-5xl font-black truncate">{formatBRL(monthRevenue)}</p>
            </div>

            <div className="bg-yellow-400 border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] transform transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-6 h-6" strokeWidth={3} />
                <h2 className="font-black uppercase text-sm tracking-widest">Caixa Histórico Total</h2>
              </div>
              <p className="text-4xl lg:text-5xl font-black truncate">{formatBRL(totalRevenue)}</p>
            </div>

            <div className="bg-purple-300 border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] transform transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-6 h-6" strokeWidth={3} />
                <h2 className="font-black uppercase text-sm tracking-widest">Consultas Finalizadas</h2>
              </div>
              <p className="text-4xl lg:text-5xl font-black">{completedCount}</p>
            </div>

          </div>

          {/* HISTÓRICO DE TRANSAÇÕES */}
          <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
            <div className="border-b-4 border-black p-6 bg-gray-50">
              <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                <ArrowRight className="w-6 h-6 text-green-500" strokeWidth={3} /> Entradas Recentes
              </h2>
            </div>

            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-4 border-black bg-gray-100 font-black uppercase text-sm tracking-widest">
                      <th className="p-4 border-r-4 border-black">Data</th>
                      <th className="p-4 border-r-4 border-black">Paciente</th>
                      <th className="p-4 border-r-4 border-black">Tratamento</th>
                      <th className="p-4 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, 15).map((item) => ( // Mostra só os 15 mais recentes
                      <tr key={item.id} className="border-b-2 border-gray-200 hover:bg-green-50 transition-colors font-bold">
                        <td className="p-4 border-r-2 border-gray-200 whitespace-nowrap">{item.date}</td>
                        <td className="p-4 border-r-2 border-gray-200">{item.patientName}</td>
                        <td className="p-4 border-r-2 border-gray-200 text-purple-700">{item.serviceName}</td>
                        <td className="p-4 text-right text-green-700 font-black">{formatBRL(item.priceCalculated)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center">
                <p className="font-bold text-gray-500">Nenhum dinheiro em caixa ainda. Dê baixa em uma consulta para ver a mágica acontecer.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}