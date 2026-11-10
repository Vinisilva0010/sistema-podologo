// src/components/PushToggle.tsx
"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { savePushSubscription } from "@/actions/push";

type Status = "loading" | "unsupported" | "needs-install" | "denied" | "off" | "on" | "working";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function PushToggle() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true;
      if (isIOS && !standalone) return setStatus("needs-install");
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        return setStatus("unsupported");
      }
      if (Notification.permission === "denied") return setStatus("denied");
      const reg = await navigator.serviceWorker.getRegistration("/");
      const sub = await reg?.pushManager.getSubscription();
      setStatus(sub && Notification.permission === "granted" ? "on" : "off");
    })().catch(() => setStatus("unsupported"));
  }, []);

  async function enable() {
    setStatus("working");
    setMessage("");
    try {
      // iPhone requires the permission request to happen right after the tap.
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      await navigator.serviceWorker.ready;
      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!key) throw new Error("Missing VAPID public key");
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) }));
      const user = auth.currentUser;
      if (!user) throw new Error("Not signed in");
      const res = await savePushSubscription(await user.getIdToken(), sub.toJSON());
      if (!res.success) {
        setMessage(res.error || "Não foi possível ativar.");
        setStatus("off");
        return;
      }
      setStatus("on");
    } catch (error) {
      console.error(error);
      setMessage("Não foi possível ativar. Tente de novo.");
      setStatus("off");
    }
  }

  if (status === "loading") return null;

  const box = "mt-6 bg-white border-4 border-black p-4 font-black text-black text-lg";

  if (status === "needs-install") {
    return (
      <div className={box}>
        Para receber avisos de novos agendamentos no iPhone: no Safari, toque em Compartilhar e depois em
        Adicionar à Tela de Início. Depois abra o sistema pelo ícone na tela e entre de novo no painel.
      </div>
    );
  }
  if (status === "unsupported") return <div className={box}>Este aparelho não aceita notificações.</div>;
  if (status === "denied") {
    return (
      <div className={box}>
        As notificações estão bloqueadas. No iPhone, abra Ajustes, depois Notificações, escolha este app e
        ative Permitir Notificações.
      </div>
    );
  }
  if (status === "on") return <div className={box}>Notificações de novos agendamentos ativadas neste aparelho.</div>;

  return (
    <div className="mt-6">
      <button
        onClick={enable}
        disabled={status === "working"}
        className="bg-yellow-300 border-4 border-black px-6 py-4 font-black uppercase text-black text-lg shadow-[4px_4px_0px_0px_#000] disabled:opacity-60"
      >
        {status === "working" ? "Ativando..." : "Ativar notificações de novos agendamentos"}
      </button>
      {message && <p className="mt-3 font-black text-black text-lg">{message}</p>}
    </div>
  );
}