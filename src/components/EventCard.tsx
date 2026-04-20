import type { TimelineEvent } from '../types';
import { EVENT_CATEGORY_META } from '../types';
import { formatMonthDay } from '../utils/dateUtils';

interface EventCardProps {
  event: TimelineEvent;
  onClick: () => void;
  compact?: boolean;
}

export function EventCard({ event, onClick, compact = false }: EventCardProps) {
  const meta = EVENT_CATEGORY_META[event.category];
  const photo = event.media.find(m => m.type === 'photo');

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left flex items-center gap-2 py-1 px-2 rounded-lg transition-colors"
        style={{ background: 'transparent' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#F5EFE6')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: event.color }}
        />
        <span className="text-xs truncate" style={{ color: '#2D1B0E' }}>{event.title}</span>
        <span className="text-xs ml-auto flex-shrink-0" style={{ color: '#9E8A7C' }}>
          {formatMonthDay(event.startDate)}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-start gap-3 p-3 rounded-xl mb-2 transition-all"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E8DDD4',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        (e.currentTarget as HTMLElement).style.borderColor = '#D4C9BF';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLElement).style.borderColor = '#E8DDD4';
      }}
    >
      <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-0.5">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: event.color }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug" style={{ color: '#2D1B0E' }}>
            {event.title}
          </p>
          {photo && (
            <img
              src={photo.url}
              alt=""
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs" style={{ color: '#9E8A7C' }}>
            {formatMonthDay(event.startDate)}
            {event.endDate && ` – ${formatMonthDay(event.endDate)}`}
          </span>
          <span className="text-xs" style={{ color: '#9E8A7C' }}>
            {meta.icon} {meta.label}
          </span>
        </div>

        {event.description && (
          <p className="text-xs mt-1 line-clamp-2" style={{ color: '#6B5744' }}>
            {event.description}
          </p>
        )}

        {event.media.length > 0 && !photo && (
          <div className="flex gap-1 mt-1.5">
            {event.media.map(m => (
              <span key={m.id} className="text-xs" style={{ color: '#9E8A7C' }}>
                {m.type === 'video' ? '🎬' : m.type === 'text' ? '📝' : '📷'}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
