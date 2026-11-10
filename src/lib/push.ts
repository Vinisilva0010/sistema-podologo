// src/lib/push.ts
// Server-only helper. Never import this file from a client component.
import * as webpush from "web-push";
import { createHash } from "crypto";
import { adminDb } from "@/lib/firebaseAdmin";

export const PUSH_COLLECTION = "pushSubscriptions";

let configured = false;

function ensureConfigured(): boolean {
  if (configured) return true;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) {
    console.error("Push disabled: missing VAPID environment variables.");
    return false;
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
  return true;
}

export function subscriptionDocId(endpoint: string): string {
  return createHash("sha256").update(endpoint).digest("hex");
}

export async function notifyStaff(payload: { title: string; body: string; url: string }) {
  if (!ensureConfigured()) return;
  const snapshot = await adminDb.collection(PUSH_COLLECTION).get();
  await Promise.all(
    snapshot.docs.map(async (doc) => {
      const { endpoint, keys } = doc.data();
      try {
        await webpush.sendNotification({ endpoint, keys }, JSON.stringify(payload), {
          TTL: 86400,
          urgency: "high",
        });
      } catch (err: any) {
        // 404/410 means the device unsubscribed or the app was removed: clean it up.
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await doc.ref.delete();
        } else {
          console.error("Push send failed:", err?.statusCode, err?.body);
        }
      }
    })
  );
}