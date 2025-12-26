import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface GroupTotal {
  name: string
  total: number
  error: string | null
}

export function sortByTotalDescending(groups: GroupTotal[]): GroupTotal[] {
  return [...groups].sort((a, b) => {
    if (a.error || b.error) return 0
    return b.total - a.total
  })
}
