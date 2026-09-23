import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export const compactNumber = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
