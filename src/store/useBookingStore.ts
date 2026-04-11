// src/store/useBookingStore.ts
import { create } from 'zustand';
import { Service } from '@/types';

// Definimos os passos do nosso funil
export type BookingStep = 'SELECT_SERVICE' | 'SELECT_DATE_TIME' | 'USER_INFO' | 'SUCCESS';

interface BookingState {
  currentStep: BookingStep;
  selectedService: Service | null;
  selectedDate: string | null; // YYYY-MM-DD
  selectedTime: string | null; // HH:mm
  
  // Ações para o frontend chamar
  setStep: (step: BookingStep) => void;
  selectService: (service: Service) => void;
  selectDateTime: (date: string, time: string) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  currentStep: 'SELECT_SERVICE',
  selectedService: null,
  selectedDate: null,
  selectedTime: null,

  setStep: (step) => set({ currentStep: step }),
  
  selectService: (service) => set({ 
    selectedService: service, 
    currentStep: 'SELECT_DATE_TIME' // Avança automático ao escolher
  }),
  
  selectDateTime: (date, time) => set({ 
    selectedDate: date, 
    selectedTime: time, 
    currentStep: 'USER_INFO' // Avança para pegar o nome/zap
  }),

  resetBooking: () => set({
    currentStep: 'SELECT_SERVICE',
    selectedService: null,
    selectedDate: null,
    selectedTime: null,
  }),
}));