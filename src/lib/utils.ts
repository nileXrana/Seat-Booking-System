import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getCurrentLocalTime() {
    const d = new Date()
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000)
    // +5:30 for Indian Standard Time as requested by the 2026-02-26T11:50:14+05:30 metadata
    return new Date(utc + (3600000 * 5.5))
}

export function isBookingWindowOpen() {
    return getCurrentLocalTime().getHours() >= 15
}

export function isBatchDay(batch: string, date: Date) {
    const day = date.getDay()
    if (batch === 'B1') return day >= 1 && day <= 3 // Mon-Wed
    if (batch === 'B2') return day >= 4 && day <= 5 // Thu-Fri
    return false
}

export function isValidBookingDate(date: Date) {
    const day = date.getDay()
    return day >= 1 && day <= 5
}
