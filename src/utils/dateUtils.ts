import { format, differenceInYears, parseISO } from 'date-fns';
import type { Era, TimelineEvent } from '../types';

export function formatDate(dateStr: string): string {
  try { return format(parseISO(dateStr), 'MMM d, yyyy'); } catch { return dateStr; }
}

export function formatMonthDay(dateStr: string): string {
  try { return format(parseISO(dateStr), 'MMM d'); } catch { return dateStr; }
}

export function getYear(dateStr: string): number {
  try { return parseISO(dateStr).getFullYear(); } catch { return 0; }
}

export function getAge(birthday: string, atDate?: string): number {
  try {
    return differenceInYears(atDate ? parseISO(atDate) : new Date(), parseISO(birthday));
  } catch { return 0; }
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function isEraActiveInYear(era: Era, year: number): boolean {
  const startYear = getYear(era.startDate);
  const endYear = era.isOngoing ? getCurrentYear() : getYear(era.endDate ?? era.startDate);
  return year >= startYear && year <= endYear;
}

export function doesEraStartInYear(era: Era, year: number): boolean {
  return getYear(era.startDate) === year;
}

export function doesEraEndInYear(era: Era, year: number): boolean {
  if (era.isOngoing) return false;
  return getYear(era.endDate ?? '') === year;
}

export function getEventsForYear(events: TimelineEvent[], year: number): TimelineEvent[] {
  return events
    .filter(e => getYear(e.startDate) === year)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function getErasStartingInYear(eras: Era[], year: number): Era[] {
  return eras.filter(era => doesEraStartInYear(era, year));
}

export function getErasEndingInYear(eras: Era[], year: number): Era[] {
  return eras.filter(era => doesEraEndInYear(era, year));
}

export function getActiveErasForYear(eras: Era[], year: number): Era[] {
  return eras.filter(era => isEraActiveInYear(era, year));
}

export function generateShareId(): string {
  return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
