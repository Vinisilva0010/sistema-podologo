// src/lib/timeUtils.ts

export function timeToMinutes(timeString: string): number {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

interface Appointment {
  startTime: string; 
  endTime: string;   
}

export function generateAvailableSlots(
  openTime: string,
  closeTime: string,
  serviceDuration: any, // Usando any para tratar entrada suja
  bufferTime: any,      // Usando any para tratar entrada suja
  bookedAppointments: Appointment[]
): string[] {
  const slots: string[] = [];
  
  // GARANTIA DE CTO: Forçando a conversão para número
  const duration = Number(serviceDuration) || 30;
  const buffer = Number(bufferTime) || 0;
  
  const openMins = timeToMinutes(openTime);
  const closeMins = timeToMinutes(closeTime);
  const totalRequiredMins = duration + buffer;

  // Intervalo entre os botões (30 min)
  const stepInterval = 30; 

  console.log(`DEBUG CÉREBRO: Tentando gerar slots de ${totalRequiredMins}min entre ${openTime} e ${closeTime}`);

  for (let currentMins = openMins; currentMins + totalRequiredMins <= closeMins; currentMins += stepInterval) {
    const slotStart = currentMins;
    const slotEnd = currentMins + totalRequiredMins;

    const hasConflict = bookedAppointments.some((appt) => {
      const apptStart = timeToMinutes(appt.startTime);
      const apptEnd = timeToMinutes(appt.endTime);
      return slotStart < apptEnd && slotEnd > apptStart;
    });

    if (!hasConflict) {
      slots.push(minutesToTime(slotStart));
    }
  }

  console.log(`DEBUG CÉREBRO: Gerados ${slots.length} horários livres.`);
  return slots;
}