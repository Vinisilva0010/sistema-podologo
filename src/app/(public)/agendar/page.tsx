// src/app/(public)/agendar/page.tsx
"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useBookingStore } from "@/store/useBookingStore";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { CheckCircle2, ArrowLeft, Info, MessageCircle, CalendarClock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateAvailableSlots } from "@/lib/timeUtils";
import { timeToMinutes, minutesToTime } from "@/lib/timeUtils";
import { maskPhone } from "@/lib/utils";
import { createServerAppointment, getAppointmentsByDateServer } from "@/actions/booking";
// --- MOCK DE DADOS (Até o Firebase do Admin estar pronto) ---
const mockServices = [
  { id: "1", name: "Unha Encravada", price: 150, durationMin: 45, bufferMin: 15, description: "Alívio imediato e curativo.", active: true },
  { id: "2", name: "Calos e Rachaduras", price: 120, durationMin: 45, bufferMin: 15, description: "Hidratação e desbaste.", active: true },
  { id: "3", name: "Pé Diabético", price: 180, durationMin: 60, bufferMin: 15, description: "Cuidado especializado e preventivo.", active: true },
];

const mockDates = ["Hoje, 24 Out", "Amanhã, 25 Out", "Sex, 26 Out"];
const mockTimes = ["09:00", "10:30", "14:00", "15:30", "17:00"];

export default function BookingPage() {
  const { currentStep, resetBooking } = useBookingStore();

  // Mapeamento de progresso para a barra Brutalista
  const progressMap = {
    'SELECT_SERVICE': 25,
    'SELECT_DATE_TIME': 50,
    'USER_INFO': 75,
    'SUCCESS': 100,
  };

  return (
    <main className="min-h-screen bg-brutal-bg flex flex-col items-center pt-8 pb-24 px-4 md:px-6">
      <div className="w-full max-w-3xl">
        
        {/* Header do Funil: Logo + Botão Voltar */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 font-black uppercase text-sm border-b-4 border-transparent hover:border-black transition-colors"
          >
            <ArrowLeft strokeWidth={3} className="w-5 h-5" /> Voltar
          </button>
          <div className="bg-purple-300 border-4 border-black px-4 py-1 shadow-[4px_4px_0px_0px_#000] rotate-2">
            <span className="font-black uppercase tracking-widest text-sm">Agendamento</span>
          </div>
        </div>

        {/* Barra de Progresso Brutalista */}
        <div className="w-full h-6 border-4 border-black bg-white mb-10 overflow-hidden relative shadow-[6px_6px_0px_0px_#000]">
          <div 
            className="h-full bg-yellow-400 border-r-4 border-black transition-all duration-500 ease-out"
            style={{ width: `${progressMap[currentStep]}%` }}
          />
        </div>

        {/* Renderização Dinâmica dos Passos */}
        <div className="bg-white border-4 border-black shadow-brutal p-6 md:p-10">
          {currentStep === 'SELECT_SERVICE' && <StepSelectService />}
          {currentStep === 'SELECT_DATE_TIME' && <StepSelectDateTime />}
          {currentStep === 'USER_INFO' && <StepUserInfo />}
          {currentStep === 'SUCCESS' && <StepSuccess />}
        </div>

      </div>
    </main>
  );
}

// ==========================================
// PASSO 1: ESCOLHER SERVIÇO (AGORA PUXANDO DO FIREBASE REAIS)
// ==========================================
function StepSelectService() {
  const { selectService } = useBookingStore();
  
  // Estado para guardar os serviços que vêm do banco
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // O "Motor de Busca" que bate no Firebase assim que a tela abre
  useEffect(() => {
    async function fetchServices() {
      try {
        // Criamos uma query: "Busca na coleção 'services' apenas os que estão ativos"
        const q = query(collection(db, "services"), where("active", "==", true));
        const querySnapshot = await getDocs(q);
        
        const fetchedServices: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedServices.push({ id: doc.id, ...doc.data() });
        });
        
        setServices(fetchedServices);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        alert("Erro ao carregar o catálogo. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl md:text-4xl font-black uppercase mb-2">O que você precisa?</h2>
      <p className="font-bold text-gray-600 mb-8">Selecione o tratamento principal para iniciarmos.</p>
      
      {/* Skeleton Brutalista de Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 border-4 border-black bg-gray-50 shadow-[6px_6px_0px_0px_#000]">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" strokeWidth={3} />
          <p className="font-black uppercase tracking-widest text-gray-400">Carregando Catálogo...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Renderizando os serviços REAIS do banco de dados */}
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => selectService(service)}
              className="w-full text-left border-4 border-black p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-yellow-400 hover:-translate-y-1 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all group focus:outline-none"
            >
              <div>
                <h3 className="text-xl font-black uppercase">{service.name}</h3>
                <p className="font-bold text-gray-700 text-sm mt-1">{service.description}</p>
                {/* Mostra o tempo do procedimento + tempo de limpeza pra passar transparência */}
                <span className="inline-block mt-3 text-xs font-black bg-purple-200 border-2 border-black px-2 py-1 uppercase">
                  ⏱️ {service.durationMin} min (+ limpeza)
                </span>
              </div>
              <div className="bg-black text-white font-black px-4 py-2 border-2 border-black group-hover:bg-white group-hover:text-black transition-colors shrink-0 text-lg">
                R$ {service.price}
              </div>
            </button>
          ))}

          {/* Fallback se a doutora não tiver cadastrado nada ainda */}
          {services.length === 0 && (
            <div className="p-6 border-4 border-black bg-yellow-100 text-center font-bold">
              Nenhum serviço disponível no momento.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// PASSO 2: ESCOLHER DATA E HORA (COMPLETO)
// ==========================================
function StepSelectDateTime() {
  const { selectedService, selectDateTime, setStep } = useBookingStore();
  
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // 1. O MOTOR QUE GERA OS DIAS NA TELA (Isso aqui devia estar faltando!)
  useEffect(() => {
    const dates: string[] = [];
    let currentDate = new Date();
    while (dates.length < 4) {
      // Dia 0 é Domingo. Pula os domingos.
      if (currentDate.getDay() !== 0) { 
        // Formata para o banco (YYYY-MM-DD)
        const formatted = currentDate.toISOString().split('T')[0];
        dates.push(formatted);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setAvailableDates(dates);
  }, []);

  // 2. O RASTREADOR DE CONFLITOS (Busca horários ao clicar na data)
  useEffect(() => {
    async function fetchAndCalculateSlots() {
      // Se não clicou num dia ainda, não faz nada
      if (!date || !selectedService) return;
      
      setLoadingSlots(true);

      try {
        console.log("DEBUG FRONT: Buscando horários para o dia", date);
        const response = await getAppointmentsByDateServer(date);
        
        let bookedAppointments = [];
        if (response.success) {
          bookedAppointments = response.data || [];
        }

        // Passa os dados pro nosso Cérebro Matemático
        const calculatedSlots = generateAvailableSlots(
          "08:00", // Abertura
          "18:00", // Fechamento
          selectedService.durationMin,
          selectedService.bufferMin,
          bookedAppointments
        );

        setSlots(calculatedSlots);
      } catch (error) {
        console.error("Erro crítico na tela de agendamento:", error);
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchAndCalculateSlots();
  }, [date, selectedService]);

  if (!selectedService) return null;

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-3 mb-6 bg-purple-100 border-4 border-black p-3 shadow-[4px_4px_0px_0px_#000]">
        <Info className="text-purple-700 shrink-0" strokeWidth={2.5} />
        <p className="font-bold text-sm">Tempo necessário: <span className="text-black uppercase font-black">{selectedService.durationMin + selectedService.bufferMin} min</span></p>
      </div>

      <h2 className="text-3xl md:text-4xl font-black uppercase mb-6">Qual o melhor dia?</h2>
      
      {/* GRID DE DATAS (Onde estava o buraco) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {availableDates.map((d) => {
          const [year, month, day] = d.split('-');
          const displayDate = `${day}/${month}`;
          
          return (
            <button
              key={d}
              onClick={() => setDate(d)}
              className={cn(
                "border-4 border-black p-3 font-black uppercase text-sm md:text-base transition-all shadow-[4px_4px_0px_0px_#000]",
                date === d ? "bg-purple-500 text-white translate-y-1 shadow-none" : "bg-white hover:bg-gray-100 hover:-translate-y-1"
              )}
            >
              {displayDate}
            </button>
          )
        })}
      </div>

      {/* GRID DE HORÁRIOS (Só aparece depois que clica na data) */}
      {date && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-2xl font-black uppercase mb-4 border-t-4 border-black pt-6">Horários Livres</h2>
          
          {loadingSlots ? (
            <div className="flex items-center gap-2 font-bold text-purple-600">
              <Loader2 className="animate-spin" /> Calculando disponibilidade...
            </div>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {slots.map((t) => (
                <button
                  key={t}
                  onClick={() => selectDateTime(date, t)}
                  className="border-4 border-black bg-white p-3 font-black text-lg hover:bg-yellow-400 hover:-translate-y-1 shadow-[4px_4px_0px_0px_#000] transition-all"
                >
                  {t}
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-red-100 border-4 border-black p-4 font-black uppercase text-red-700">
              Putz, agenda lotada nesse dia para esse tratamento. Escolha outra data.
            </div>
          )}
        </div>
      )}

      {/* BOTÃO VOLTAR */}
      <button onClick={() => setStep('SELECT_SERVICE')} className="mt-10 font-bold uppercase text-gray-500 border-b-2 border-gray-500 hover:text-black hover:border-black transition-colors">
        Alterar Serviço
      </button>
    </div>
  );
}

// ==========================================
// PASSO 3: DADOS DO PACIENTE (AGORA SALVANDO DE VERDADE)
// ==========================================
function StepUserInfo() {
  const { selectedService, selectedDate, selectedTime, setStep } = useBookingStore();
  
  // Estados para capturar o que o paciente digita
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) return;
    setLoading(true);

    try {
      const startMins = timeToMinutes(selectedTime);
      const totalSessionMins = selectedService.durationMin + selectedService.bufferMin;
      const calculatedEndTime = minutesToTime(startMins + totalSessionMins);

      // Chamando a SERVER ACTION (O nosso servidor Node.js assume daqui pra frente)
      const response = await createServerAppointment({
        patientName: name,
        patientPhone: phone,
        notes: notes,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: selectedDate,
        startTime: selectedTime,
        endTime: calculatedEndTime,
        status: "confirmed",
      });

      if (response.success) {
        setStep('SUCCESS');
      } else {
        alert(response.error || "Erro ao salvar agendamento.");
      }
      
    } catch (error) {
      console.error("Erro no front-end ao agendar:", error);
      alert("Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 bg-yellow-400 border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] -rotate-1">
          <p className="font-bold text-sm uppercase">Tratamento</p>
          <p className="font-black text-xl">{selectedService?.name}</p>
        </div>
        <div className="flex-1 bg-purple-300 border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] rotate-1">
          <p className="font-bold text-sm uppercase">Data e Hora</p>
          <p className="font-black text-xl">{selectedDate} às {selectedTime}</p>
        </div>
      </div>

      <h2 className="text-3xl font-black uppercase mb-2">Seus Dados</h2>
      <p className="font-bold text-gray-600 mb-6">Falta pouco. Prometemos não mandar spam.</p>

      <form onSubmit={handleConfirm} className="flex flex-col gap-5">
        <div>
          <label className="block font-black uppercase text-sm mb-2">Nome Completo</label>
          <input 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text" 
            placeholder="Como a Dra. deve te chamar?"
            className="w-full border-4 border-black p-4 font-bold outline-none focus:bg-yellow-100 transition-colors shadow-[4px_4px_0px_0px_#000]"
          />
        </div>

        <div>
          <label className="block font-black uppercase text-sm mb-2">WhatsApp</label>
          <input 
            required 
            type="tel"
            value={phone}
            onChange={(e) => setPhone(maskPhone(e.target.value))} // A mágica acontece aqui
            placeholder="(11) 99999-9999"
            className="w-full border-4 border-black p-4 font-bold outline-none focus:bg-yellow-100 transition-colors shadow-[4px_4px_0px_0px_#000]"
          />
        </div>

        <div>
          <label className="block font-black uppercase text-sm mb-2">O que está sentindo? (Opcional)</label>
          <textarea 
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Minha unha do dedão encravou tem 2 semanas e tá latejando muito..."
            className="w-full border-4 border-black p-4 font-bold outline-none focus:bg-yellow-100 transition-colors shadow-[4px_4px_0px_0px_#000] resize-none"
          ></textarea>
        </div>

        <div className="my-2 border-l-4 border-purple-500 pl-4">
          <p className="font-bold text-sm text-gray-600 mb-2">Seu caso é muito específico?</p>
          <a href="#" className="inline-flex items-center gap-2 font-black uppercase text-sm text-purple-700 hover:text-purple-900 transition-colors group">
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Tire uma dúvida direto com a Dra.
          </a>
        </div>

        <div className="mt-4 flex flex-col md:flex-row gap-4 items-center">
          <BrutalButton size="lg" variant="primary" type="submit" disabled={loading} className="w-full md:w-auto px-12 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Confirmar Horário"}
          </BrutalButton>
          <button type="button" onClick={() => setStep('SELECT_DATE_TIME')} disabled={loading} className="font-bold uppercase text-gray-500 hover:text-black transition-colors disabled:opacity-50">
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
// ==========================================
// PASSO 4: SUCESSO
// ==========================================
function StepSuccess() {
  const { selectedDate, selectedTime } = useBookingStore();

  return (
    <div className="flex flex-col items-center text-center py-10 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-green-400 border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_#000] mb-8">
        <CheckCircle2 className="w-12 h-12 text-black" strokeWidth={3} />
      </div>
      
      <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">Horário <br/><span className="text-green-600">Garantido!</span></h2>
      <p className="font-bold text-xl text-gray-700 max-w-md mb-8">
        Tudo certo para {selectedDate} às {selectedTime}. Te enviamos uma confirmação no WhatsApp.
      </p>

      <div className="flex flex-col gap-4 w-full md:w-auto">
        <BrutalButton variant="primary" className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800">
          <CalendarClock className="w-5 h-5" /> Adicionar na Agenda
        </BrutalButton>
        <BrutalButton variant="secondary" onClick={() => window.location.href = '/'}>
          Voltar para o Início
        </BrutalButton>
      </div>
    </div>
  );
}