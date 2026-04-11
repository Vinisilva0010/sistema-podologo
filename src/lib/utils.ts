// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Mescla classes do Tailwind com segurança, resolvendo conflitos.
 * Ex: cn('bg-red-500', 'bg-blue-500') retorna 'bg-blue-500'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// src/lib/utils.ts

export function maskPhone(value: string) {
  if (!value) return "";
  
  // Remove tudo que não for número
  value = value.replace(/\D/g, "");
  
  // Limita a 11 dígitos (DDD + 9 + 8 dígitos)
  value = value.slice(0, 11);

  // Aplica a formatação (11) 99999-9999
  if (value.length > 10) {
    return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (value.length > 5) {
    return value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else if (value.length > 2) {
    return value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  } else if (value.length > 0) {
    return value.replace(/(\d{0,2})/, "($1");
  }
  return value;
}