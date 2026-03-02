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