// src/lib/timeUtils.ts

// Converte "08:30" para 510 (minutos)
export function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

// Converte 510 para "08:30"
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

interface Appointment {
  startTime: string; // "09:00"
  endTime: string;   // "09:45"
}

export function generateAvailableSlots(
  openTime: string, // "08:00"
  closeTime: string, // "18:00"
  serviceDuration: number, // Ex: 45
  bufferTime: number, // Ex: 15
  bookedAppointments: Appointment[] // Agendamentos que já existem no banco
): string[] {
  const slots: string[] = [];
  const openMins = timeToMinutes(openTime);
  const closeMins = timeToMinutes(closeTime);
  const totalRequiredMins = serviceDuration + bufferTime;

  // A gente testa buracos a cada 30 minutos (Ex: 08:00, 08:30, 09:00)
  const stepInterval = 30; 

  for (let currentMins = openMins; currentMins + totalRequiredMins <= closeMins; currentMins += stepInterval) {
    const slotStart = currentMins;
    const slotEnd = currentMins + totalRequiredMins;

    // A MÁGICA DA COLISÃO: Verifica se esse slot bate de frente com algum agendamento existente
    const hasConflict = bookedAppointments.some((appt) => {
      const apptStart = timeToMinutes(appt.startTime);
      const apptEnd = timeToMinutes(appt.endTime);
      
      // Lógica de intersecção de conjuntos (se cruzar, tem conflito)
      return slotStart < apptEnd && slotEnd > apptStart;
    });

    if (!hasConflict) {
      slots.push(minutesToTime(slotStart));
    }
  }

  return slots;
}