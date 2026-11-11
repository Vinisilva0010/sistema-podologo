// src/components/AccountSettings.tsx
"use client";
import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Senha atual incorreta.";
    case "auth/too-many-requests":
      return "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.";
    case "auth/weak-password":
      return "A nova senha é fraca. Use pelo menos 8 caracteres.";
    case "auth/requires-recent-login":
      return "Por segurança, saia e entre de novo no painel antes de trocar a senha.";
    case "auth/network-request-failed":
      return "Sem conexão com a internet. Tente de novo.";
    default:
      return "Não foi possível salvar. Tente de novo.";
  }
}

const input =
  "w-full border-4 border-black p-4 font-black text-black text-lg bg-white outline-none focus:bg-yellow-100";
const label = "block font-black uppercase text-black text-base mb-2";
const button =
  "bg-yellow-300 border-4 border-black px-6 py-4 font-black uppercase text-black text-lg shadow-[4px_4px_0px_0px_#000] disabled:opacity-60";

export function AccountSettings() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
  }, []);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !user.email) return;
    setMsg("");
    if (next.length < 8) return setMsg("A nova senha precisa ter pelo menos 8 caracteres.");
    if (next !== confirm) return setMsg("A confirmação está diferente da nova senha.");
    if (next === current) return setMsg("A nova senha precisa ser diferente da atual.");
    setBusy(true);
    try {
      // Firebase requires a fresh login before changing the password.
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, current));
      await updatePassword(user, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      setMsg("Senha alterada. Use a nova senha no próximo login.");
    } catch (error) {
      setMsg(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return null;
  if (!user) {
    return (
      <div className="mt-10 bg-white border-4 border-black p-6 font-black text-black text-lg">
        Entre no painel para alterar a senha.
      </div>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-black uppercase text-black border-b-4 border-black pb-2 mb-6">Minha conta</h2>
      <form onSubmit={changePassword} className="bg-white border-4 border-black p-6 flex flex-col gap-5">
        <h3 className="text-xl font-black uppercase text-black">Alterar senha</h3>
        <div>
          <label className={label}>Senha atual</label>
          <input className={input} type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
        <div>
          <label className={label}>Nova senha (mínimo 8 caracteres)</label>
          <input className={input} type="password" autoComplete="new-password" required value={next} onChange={(e) => setNext(e.target.value)} />
        </div>
        <div>
          <label className={label}>Repita a nova senha</label>
          <input className={input} type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <div>
          <button className={button} type="submit" disabled={busy}>{busy ? "Salvando..." : "Salvar nova senha"}</button>
        </div>
        {msg && <p className="font-black text-black text-lg">{msg}</p>}
      </form>
    </section>
  );
}