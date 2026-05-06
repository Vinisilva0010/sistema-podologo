// src/app/(admin)/layout.tsx
"use client";
import { LayoutDashboard, CalendarDays, Wallet, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Painel", href: "/dashboard", icon: LayoutDashboard },
    { name: "Agenda", href: "/agendamentos", icon: CalendarDays },
    { name: "Caixa", href: "/financeiro", icon: Wallet },
    { name: "Config", href: "/config", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brutal-bg flex flex-col md:flex-row">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 border-r-4 border-black bg-white flex-col h-screen sticky top-0">
        <div className="p-6 border-b-4 border-black bg-pink-500">
          <h1 className="font-black text-2xl uppercase text-white tracking-widest">ADM PODOLOGIA</h1>
        </div>
        <nav className="flex-1 flex flex-col p-4 gap-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href} className={cn(
                "flex items-center gap-4 px-4 py-3 font-bold uppercase tracking-wider border-4 transition-all",
                isActive ? "bg-yellow-400 border-black shadow-[4px_4px_0px_0px_#000] translate-x-1" : "bg-transparent border-transparent hover:border-black hover:bg-gray-100"
              )}>
                <item.icon strokeWidth={isActive ? 3 : 2} /> {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 pb-24 md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation (Mobile PWA) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t-4 border-black flex justify-around items-center p-2 z-50 shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)]">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.name} href={item.href} className={cn(
              "flex flex-col items-center justify-center w-full py-2 gap-1 transition-all",
              isActive ? "text-pink-700" : "text-gray-500 hover:text-black"
            )}>
              <div className={cn("p-1", isActive && "bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-sm")}>
                <item.icon strokeWidth={isActive ? 3 : 2} className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}