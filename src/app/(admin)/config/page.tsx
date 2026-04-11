// src/app/(admin)/config/page.tsx
"use client";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Importando nossa conexão segura
import { BrutalButton } from "@/components/ui/BrutalButton";
import { Plus, Save, Loader2 } from "lucide-react";

export default function ConfigPage() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Estado do formulário
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    durationMin: "45",
    bufferMin: "15",
    description: "",
  });

  // Função que bate no Firebase de verdade
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      // Gravando na coleção 'services' do Firestore
      await addDoc(collection(db, "services"), {
        name: newService.name,
        price: Number(newService.price),
        durationMin: Number(newService.durationMin),
        bufferMin: Number(newService.bufferMin), // O tempo de esterilização que salva vidas
        description: newService.description,
        active: true,
      });

      setSuccessMsg("Serviço salvo com sucesso no banco!");
      // Limpa o form
      setNewService({ name: "", price: "", durationMin: "45", bufferMin: "15", description: "" });
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      alert("Erro ao conectar no Firebase. Verifique as chaves no .env.local");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black uppercase text-black mb-2">Configurações</h1>
        <p className="font-bold text-gray-600">Gerencie seus serviços e horários de atendimento.</p>
      </div>

      <div className="bg-white border-4 border-black p-6 md:p-8 shadow-brutal">
        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2 border-b-4 border-black pb-4">
          <Plus className="bg-yellow-400 border-2 border-black" /> Novo Serviço
        </h2>

        <form onSubmit={handleAddService} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-black uppercase text-sm mb-2">Nome do Tratamento</label>
              <input 
                required 
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                placeholder="Ex: Unha Encravada"
                className="w-full border-4 border-black p-3 font-bold outline-none focus:bg-purple-100 transition-colors"
              />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-2">Preço (R$)</label>
              <input 
                required 
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                placeholder="150"
                className="w-full border-4 border-black p-3 font-bold outline-none focus:bg-purple-100 transition-colors"
              />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-2">Duração (Minutos)</label>
              <input 
                required 
                type="number"
                value={newService.durationMin}
                onChange={(e) => setNewService({ ...newService, durationMin: e.target.value })}
                className="w-full border-4 border-black p-3 font-bold outline-none focus:bg-yellow-100 transition-colors"
              />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-2">Tempo de Limpeza (Minutos)</label>
              <input 
                required 
                type="number"
                value={newService.bufferMin}
                onChange={(e) => setNewService({ ...newService, bufferMin: e.target.value })}
                className="w-full border-4 border-black p-3 font-bold outline-none focus:bg-yellow-100 transition-colors bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block font-black uppercase text-sm mb-2">Descrição Curta</label>
            <textarea 
              required
              rows={2}
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              placeholder="Descreva o benefício principal..."
              className="w-full border-4 border-black p-3 font-bold outline-none focus:bg-purple-100 transition-colors resize-none"
            ></textarea>
          </div>

          {successMsg && (
            <div className="bg-green-400 border-4 border-black p-3 font-black uppercase text-sm text-center">
              {successMsg}
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <BrutalButton type="submit" variant="primary" size="lg" disabled={loading} className="w-full md:w-auto flex items-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <Save />}
              Salvar Serviço
            </BrutalButton>
          </div>
        </form>
      </div>
    </div>
  );
}