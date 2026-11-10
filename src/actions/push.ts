// src/actions/push.ts
"use server";

import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { PUSH_COLLECTION, subscriptionDocId } from "@/lib/push";

type SubscriptionInput = {
  endpoint?: unknown;
  keys?: { p256dh?: unknown; auth?: unknown };
};

// Saves a device for new-booking notifications. Only signed-in users whose
// email is listed in PUSH_ALLOWED_EMAILS can register a device.
export async function savePushSubscription(idToken: string, sub: SubscriptionInput) {
  try {
    const decoded = await adminAuth.verifyIdToken(String(idToken || ""));
    const allowed = (process.env.PUSH_ALLOWED_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const email = (decoded.email || "").toLowerCase();
    if (!email || !allowed.includes(email)) {
      return { success: false, error: "Esta conta não tem permissão para receber notificações." };
    }

    const endpoint = String(sub?.endpoint ?? "");
    const p256dh = String(sub?.keys?.p256dh ?? "");
    const auth = String(sub?.keys?.auth ?? "");
    if (!endpoint.startsWith("https://") || endpoint.length > 1000 || !p256dh || !auth) {
      return { success: false, error: "Inscrição inválida. Tente de novo." };
    }

    await adminDb
      .collection(PUSH_COLLECTION)
      .doc(subscriptionDocId(endpoint))
      .set({ endpoint, keys: { p256dh, auth }, uid: decoded.uid, createdAt: new Date().toISOString() });

    return { success: true };
  } catch (error) {
    console.error("Failed to save push subscription:", error);
    return { success: false, error: "Não foi possível ativar. Saia, entre de novo no painel e tente outra vez." };
  }
}