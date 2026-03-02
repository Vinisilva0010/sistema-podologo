// src/types/index.ts

export type AppointmentStatus = 'pending' | 'confirmed' | 'done' | 'cancelled';
export type PaymentMethod = 'pix' | 'dinheiro' | 'cartão';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMin: number;
  bufferMin: number; // O tempo de esterilização obrigatório!
  active: boolean;
}

export interface Appointment {
  id: string;
  patientId?: string; // Opcional se for a primeira vez
  clientName: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  date: string; // Formato YYYY-MM-DD para facilitar busca
  time: string; // Formato HH:mm
  status: AppointmentStatus;
  createdAt: number; // Timestamp
  cancelReason?: string;
  source: 'online' | 'manual';
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  createdAt: number;
  notes?: string;
  isDiabetic: boolean; // Vital para podologia
  totalSpent: number;
  appointmentsCount: number;
}

export interface FinanceRecord {
  id: string;
  appointmentId?: string;
  patientId?: string;
  serviceId: string;
  amount: number;
  method: PaymentMethod;
  createdAt: number;
}