// src/actions/booking.ts
"use server";

import { adminDb } from "@/lib/firebaseAdmin";

// 1. FUNÇÃO DE GRAVAR AGENDAMENTO
export async function createServerAppointment(appointmentData: any) {
  try {
    const docRef = await adminDb.collection("appointments").add({
      ...appointmentData,
      createdAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro interno ao gravar:", error);
    return { success: false, error: "Falha na comunicação segura." };
  }
}

// 2. FUNÇÃO DE BUSCAR POR TELEFONE (A QUE O TS TÁ CHORANDO)
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
    console.error("Erro ao buscar por telefone:", error);
    return { success: false, error: "Falha ao buscar os dados do paciente." };
  }
}

// 3. FUNÇÃO DE BUSCAR POR DATA (Para achar os buracos na agenda)
export async function getAppointmentsByDateServer(date: string) {
  try {
    const snapshot = await adminDb
      .collection("appointments")
      .where("date", "==", date)
      .get();

    const bookedAppointments: any[] = [];
    snapshot.forEach((doc) => bookedAppointments.push(doc.data()));

    return { success: true, data: bookedAppointments };
  } catch (error) {
    console.error("Erro ao buscar por data:", error);
    return { success: false, error: "Falha ao buscar horários livres." };
  }
}

// Adicione no final do src/actions/booking.ts

export async function cancelAppointmentServer(appointmentId: string) {
  try {
    // Usamos o adminDb para atualizar o documento direto pelo ID
    await adminDb.collection("appointments").doc(appointmentId).update({
      status: "cancelled",
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Erro interno ao cancelar agendamento:", error);
    return { success: false, error: "Falha ao processar o cancelamento no servidor." };
  }
}