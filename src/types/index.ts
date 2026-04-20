export type EraCategory =
  | 'education'
  | 'location'
  | 'relationship'
  | 'career'
  | 'health'
  | 'hobbies'
  | 'living'
  | 'travel'
  | 'family'
  | 'other';

export type EventCategory =
  | 'milestone'
  | 'travel'
  | 'achievement'
  | 'family'
  | 'social'
  | 'health'
  | 'work'
  | 'hobby'
  | 'other';

export type MediaType = 'photo' | 'video' | 'text';

export interface MediaItem {
  id: string;
  type: MediaType;
  url?: string;
  content?: string;
  caption?: string;
}

export interface Profile {
  id: string;
  shareId: string;
  name: string;
  birthday: string; // YYYY-MM-DD
  bio?: string;
  avatar?: string; // base64
  isPublic: boolean;
  isFamous?: boolean;
  species?: 'human' | 'animal' | 'other';
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  profileId: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  description?: string;
  media: MediaItem[];
  color: string;
  category: EventCategory;
  createdAt: string;
}

export interface Era {
  id: string;
  profileId: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  description?: string;
  color: string;
  category: EraCategory;
  isOngoing: boolean;
  createdAt: string;
}

export const ERA_CATEGORY_META: Record<EraCategory, { label: string; icon: string; defaultColor: string }> = {
  education: { label: 'Education', icon: '📚', defaultColor: '#7BA68A' },
  location:   { label: 'Location',   icon: '📍', defaultColor: '#6B9EC4' },
  relationship: { label: 'Relationship', icon: '💕', defaultColor: '#C47F85' },
  career:     { label: 'Career',     icon: '💼', defaultColor: '#C17F4E' },
  health:     { label: 'Health',     icon: '❤️', defaultColor: '#B5573A' },
  hobbies:    { label: 'Hobbies',    icon: '🎨', defaultColor: '#A08AA8' },
  living:     { label: 'Living',     icon: '🏠', defaultColor: '#8B8B5E' },
  travel:     { label: 'Travel',     icon: '✈️', defaultColor: '#5E8BA1' },
  family:     { label: 'Family',     icon: '👨‍👩‍👧', defaultColor: '#C9A847' },
  other:      { label: 'Other',      icon: '✨', defaultColor: '#9E8A7C' },
};

export const EVENT_CATEGORY_META: Record<EventCategory, { label: string; icon: string }> = {
  milestone:   { label: 'Milestone',   icon: '⭐' },
  travel:      { label: 'Travel',      icon: '✈️' },
  achievement: { label: 'Achievement', icon: '🏆' },
  family:      { label: 'Family',      icon: '👨‍👩‍👧' },
  social:      { label: 'Social',      icon: '🎉' },
  health:      { label: 'Health',      icon: '❤️' },
  work:        { label: 'Work',        icon: '💼' },
  hobby:       { label: 'Hobby',       icon: '🎨' },
  other:       { label: 'Other',       icon: '📌' },
};

export const COLOR_PALETTE = [
  { name: 'Terracotta', value: '#C17F4E' },
  { name: 'Sage',       value: '#7BA68A' },
  { name: 'Cobalt',     value: '#6B9EC4' },
  { name: 'Gold',       value: '#C9A847' },
  { name: 'Mauve',      value: '#A08AA8' },
  { name: 'Rose',       value: '#C47F85' },
  { name: 'Forest',     value: '#5E8B6B' },
  { name: 'Rust',       value: '#B5573A' },
  { name: 'Denim',      value: '#5E728B' },
  { name: 'Olive',      value: '#8B8B5E' },
];
