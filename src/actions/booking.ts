// src/actions/booking.ts
"use server";

import { adminDb } from "@/lib/firebaseAdmin";
import { timeToMinutes, minutesToTime } from "@/lib/timeUtils";
import { notifyStaff } from "@/lib/push";

type ActionResult = { success: boolean; id?: string; error?: string; code?: string };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

// Creates a booking. Price, name and duration come from the service document,
// never from the client. A transaction blocks two bookings in overlapping slots.
export async function createServerAppointment(input: Record<string, unknown>): Promise<ActionResult> {
  try {
    const patientName = String(input?.patientName ?? "").trim().slice(0, 120);
    const patientPhone = String(input?.patientPhone ?? "").trim().slice(0, 30);
    const notes = String(input?.notes ?? "").trim().slice(0, 1000);
    const serviceId = String(input?.serviceId ?? "");
    const date = String(input?.date ?? "");
    const startTime = String(input?.startTime ?? "");

    if (!patientName || !patientPhone || !serviceId || !DATE_RE.test(date) || !TIME_RE.test(startTime)) {
      return { success: false, error: "Dados do agendamento inválidos." };
    }

    const serviceSnap = await adminDb.collection("services").doc(serviceId).get();
    const service = serviceSnap.data();
    if (!serviceSnap.exists || !service || service.active === false) {
      return { success: false, error: "Serviço indisponível. Escolha outro." };
    }

    const startMins = timeToMinutes(startTime);
    const endMins = startMins + Number(service.durationMin || 0) + Number(service.bufferMin || 0);
    const endTime = minutesToTime(endMins);

    const appointmentsRef = adminDb.collection("appointments");
    const newDocRef = appointmentsRef.doc();

    await adminDb.runTransaction(async (tx) => {
      const sameDay = await tx.get(appointmentsRef.where("date", "==", date));
      const conflict = sameDay.docs.some((d) => {
        const a = d.data();
        if (a.status === "cancelled") return false;
        if (typeof a.startTime !== "string" || typeof a.endTime !== "string") return false;
        return startMins < timeToMinutes(a.endTime) && endMins > timeToMinutes(a.startTime);
      });
      if (conflict) throw new Error("SLOT_TAKEN");

      tx.set(newDocRef, {
        patientName,
        patientPhone,
        notes,
        serviceId,
        serviceName: service.name ?? "",
        price: Number(service.price || 0),
        date,
        startTime,
        endTime,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      });
    });

    try {
      const [, month, day] = date.split("-");
      await notifyStaff({
        title: "Novo agendamento",
        body: `${patientName} - ${service.name ?? ""} - ${day}/${month} às ${startTime}`,
        url: "/agendamentos",
      });
    } catch (err) {
      console.error("Failed to notify staff:", err);
    }

    return { success: true, id: newDocRef.id };
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_TAKEN") {
      return {
        success: false,
        code: "SLOT_TAKEN",
        error: "Esse horário acabou de ser ocupado. Escolha outro horário.",
      };
    }
    console.error("Failed to create appointment:", error);
    return { success: false, error: "Falha na comunicação segura." };
  }
}

export async function getAppointmentsByPhoneServer(phone: string) {
  try {
    const snapshot = await adminDb
      .collection("appointments")
      .where("patientPhone", "==", phone)
      .get();

    if (snapshot.empty) return { success: true, data: [] };

    const appointments: any[] = [];
    snapshot.forEach((doc) => appointments.push({ id: doc.id, ...doc.data() }));

    return { success: true, data: appointments };
  } catch (error) {
    console.error("Failed to fetch appointments by phone:", error);
    return { success: false, error: "Falha ao buscar os dados do paciente." };
  }
}

// Public: used to compute free slots. Returns only active bookings and strips
// patient personal data before it reaches the browser.
export async function getAppointmentsByDateServer(date: string) {
  try {
    const snapshot = await adminDb
      .collection("appointments")
      .where("date", "==", date)
      .get();

    const bookedAppointments: any[] = [];
    snapshot.forEach((doc) => {
      const { patientName, patientPhone, notes, ...rest } = doc.data();
      if (rest.status === "cancelled") return;
      bookedAppointments.push(rest);
    });

    return { success: true, data: bookedAppointments };
  } catch (error) {
    console.error("Failed to fetch appointments by date:", error);
    return { success: false, error: "Falha ao buscar horários livres." };
  }
}

export async function cancelAppointmentServer(appointmentId: string) {
  try {
    await adminDb.collection("appointments").doc(appointmentId).update({
      status: "cancelled",
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel appointment:", error);
    return { success: false, error: "Falha ao processar o cancelamento no servidor." };
  }
}