// src/app/login/page.tsx
"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { BrutalButton } from "@/components/ui/BrutalButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // O Firebase faz a mágica da segurança aqui
      await signInWithEmailAndPassword(auth, email, password);
      // Se deu bom, joga a chefe pra dentro do painel
      router.push("/config"); 
    } catch (err: any) {
      console.error(err);
      setError("Acesso negado. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brutal-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-brutal flex flex-col items-center animate-in fade-in zoom-in duration-500">
        
        <div className="w-16 h-16 bg-purple-500 border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#000] -rotate-3">
          <Lock className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl font-black uppercase mb-2 text-black text-center">Área Restrita</h1>
        <p className="font-bold text-gray-600 mb-8 text-center uppercase tracking-widest text-sm">Acesso exclusivo Zanvexis</p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
          <div>
            <label className="block font-black uppercase text-sm mb-2">E-mail</label>
            <input 
              required 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doutora@clinica.com"
              className="w-full border-4 border-black p-4 font-bold outline-none focus:bg-yellow-100 transition-colors shadow-[4px_4px_0px_0px_#000]"
            />
          </div>

          <div>
            <label className="block font-black uppercase text-sm mb-2">Senha</label>
            <input 
              required 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border-4 border-black p-4 font-bold outline-none focus:bg-yellow-100 transition-colors shadow-[4px_4px_0px_0px_#000]"
            />
          </div>

          {error && (
            <div className="bg-red-400 border-4 border-black p-3 font-black text-sm flex items-center gap-2">
              <AlertCircle className="shrink-0" /> {error}
            </div>
          )}

          <BrutalButton type="submit" variant="primary" size="lg" disabled={loading} className="w-full mt-4 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Entrar no Sistema"}
          </BrutalButton>
        </form>

      </div>
    </main>
  );
}