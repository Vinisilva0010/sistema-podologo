// src/app/(admin)/config/page.tsx
"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { Plus, Save, Loader2, Trash2 } from "lucide-react";

export default function ConfigPage() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [servicesList, setServicesList] = useState<any[]>([]);

  const [newService, setNewService] = useState({
    name: "",
    price: "",
    durationMin: "45",
    bufferMin: "15",
    description: "",
  });

  // Função para buscar os serviços já cadastrados
  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "services"));
      const fetched: any[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      setServicesList(fetched);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    }
  };

  // Roda a busca assim que a tela abre
  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      await addDoc(collection(db, "services"), {
        name: newService.name,
        price: Number(newService.price),
        durationMin: Number(newService.durationMin),
        bufferMin: Number(newService.bufferMin),
        description: newService.description,
        active: true,
      });

      setSuccessMsg("Serviço salvo com sucesso!");
      setNewService({ name: "", price: "", durationMin: "45", bufferMin: "15", description: "" });
      fetchServices(); // Atualiza a lista na hora
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      alert("Erro ao conectar no banco de dados.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(""), 3000); // Apaga a mensagem depois de 3s
    }
  };

  // Função para excluir um serviço
  const handleDeleteService = async (id: string, name: string) => {
    const isSure = window.confirm(`Tem certeza que deseja excluir o serviço "${name}"?`);
    if (!isSure) return;

    try {
      await deleteDoc(doc(db, "services", id));
      fetchServices(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir serviço.");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black uppercase text-black mb-2">Configurações</h1>
        <p className="font-bold text-gray-600">Gerencie seus tratamentos e catálogo.</p>
      </div>

      {/* BLOCO 1: FORMULÁRIO DE ADICIONAR */}
      <div className="bg-white border-4 border-black p-6 md:p-8 shadow-brutal mb-10">
        <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2 border-b-4 border-black pb-4">
          <Plus className="bg-yellow-400 border-2 border-black" /> Novo Serviço
        </h2>

        <form onSubmit={handleAddService} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-black uppercase text-sm mb-2">Nome do Tratamento</label>
              <input required value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} className="w-full border-4 border-black p-3 font-bold outline-none focus:bg-purple-100 transition-colors" />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-2">Preço (R$)</label>
              <input required type="number" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} className="w-full border-4 border-black p-3 font-bold outline-none focus:bg-purple-100 transition-colors" />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-2">Duração (Minutos)</label>
              <input required type="number" value={newService.durationMin} onChange={(e) => setNewService({ ...newService, durationMin: e.target.value })} className="w-full border-4 border-black p-3 font-bold outline-none focus:bg-yellow-100 transition-colors" />
            </div>
            <div>
              <label className="block font-black uppercase text-sm mb-2">Tempo de Limpeza (Min)</label>
              <input required type="number" value={newService.bufferMin} onChange={(e) => setNewService({ ...newService, bufferMin: e.target.value })} className="w-full border-4 border-black p-3 font-bold outline-none focus:bg-yellow-100 transition-colors bg-gray-50" />
            </div>
          </div>
          <div>
            <label className="block font-black uppercase text-sm mb-2">Descrição Curta</label>
            <textarea required rows={2} value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} className="w-full border-4 border-black p-3 font-bold outline-none focus:bg-purple-100 transition-colors resize-none"></textarea>
          </div>

          {successMsg && <div className="bg-green-400 border-4 border-black p-3 font-black uppercase text-sm text-center">{successMsg}</div>}

          <div className="mt-4 flex justify-end">
            <BrutalButton type="submit" variant="primary" size="lg" disabled={loading} className="w-full md:w-auto flex items-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <Save />} Salvar
            </BrutalButton>
          </div>
        </form>
      </div>

      {/* BLOCO 2: LISTA DE SERVIÇOS */}
      <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_#000]">
        <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-4">Serviços Cadastrados</h2>
        
        {servicesList.length === 0 ? (
          <p className="font-bold text-gray-500">Nenhum serviço cadastrado ainda.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {servicesList.map((service) => (
              <div key={service.id} className="border-4 border-black p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50 hover:bg-white transition-colors">
                <div>
                  <h3 className="text-lg font-black uppercase">{service.name}</h3>
                  <p className="font-bold text-sm text-gray-600">R$ {service.price} | {service.durationMin} min (+ {service.bufferMin} min limpeza)</p>
                </div>
                <button 
                  onClick={() => handleDeleteService(service.id, service.name)}
                  className="bg-red-500 text-white font-black uppercase text-sm px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:bg-red-600 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Excluir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}