// src/app/(admin)/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-black uppercase text-black mb-2">Painel Geral</h1>
      <p className="font-bold text-gray-600 mb-8">Visão panorâmica da clínica.</p>
      
      <div className="bg-white border-4 border-black p-10 shadow-[6px_6px_0px_0px_#000] text-center border-dashed">
         <h2 className="text-2xl font-black uppercase text-gray-400">Em Breve: Gráficos e Métricas</h2>
      </div>
    </div>
  );
}