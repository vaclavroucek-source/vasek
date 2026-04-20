import type { Profile, TimelineEvent, Era } from '../types';

const KEY = 'lifeline_v1';

interface StorageData {
  profiles: Profile[];
  events: TimelineEvent[];
  eras: Era[];
}

function load(): StorageData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { profiles: [], events: [], eras: [] };
    return JSON.parse(raw);
  } catch {
    return { profiles: [], events: [], eras: [] };
  }
}

function save(data: StorageData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (err) {
    // Rethrow with a stable name so callers can identify quota errors
    if (err instanceof DOMException && (
      err.name === 'QuotaExceededError' ||
      err.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      const e = new Error('QuotaExceededError');
      e.name = 'QuotaExceededError';
      throw e;
    }
    throw err;
  }
}

// ─── Profiles ─────────────────────────────────────────────────────────────────

export function getProfiles(): Profile[] {
  return load().profiles;
}

export function getProfile(id: string): Profile | undefined {
  return load().profiles.find(p => p.id === id);
}

export function getProfileByShareId(shareId: string): Profile | undefined {
  return load().profiles.find(p => p.shareId === shareId);
}

export function saveProfile(profile: Profile) {
  const data = load();
  const idx = data.profiles.findIndex(p => p.id === profile.id);
  if (idx >= 0) data.profiles[idx] = profile;
  else data.profiles.push(profile);
  save(data);
}

export function deleteProfile(id: string) {
  const data = load();
  data.profiles = data.profiles.filter(p => p.id !== id);
  data.events = data.events.filter(e => e.profileId !== id);
  data.eras = data.eras.filter(e => e.profileId !== id);
  save(data);
}

// ─── Events ───────────────────────────────────────────────────────────────────

export function getEvents(profileId: string): TimelineEvent[] {
  return load().events
    .filter(e => e.profileId === profileId)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function saveEvent(event: TimelineEvent) {
  const data = load();
  const idx = data.events.findIndex(e => e.id === event.id);
  if (idx >= 0) data.events[idx] = event;
  else data.events.push(event);
  save(data);
}

export function deleteEvent(id: string) {
  const data = load();
  data.events = data.events.filter(e => e.id !== id);
  save(data);
}

// ─── Eras ─────────────────────────────────────────────────────────────────────

export function getEras(profileId: string): Era[] {
  return load().eras
    .filter(e => e.profileId === profileId)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function saveEra(era: Era) {
  const data = load();
  const idx = data.eras.findIndex(e => e.id === era.id);
  if (idx >= 0) data.eras[idx] = era;
  else data.eras.push(era);
  save(data);
}

export function deleteEra(id: string) {
  const data = load();
  data.eras = data.eras.filter(e => e.id !== id);
  save(data);
}
