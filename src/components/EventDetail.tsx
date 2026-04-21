import { X, Edit2, Trash2 } from 'lucide-react';
import type { TimelineEvent } from '../types';
import { EVENT_CATEGORY_META } from '../types';
import { formatDate } from '../utils/dateUtils';

interface EventDetailProps {
  event: TimelineEvent;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function getYouTubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export function EventDetail({ event, onClose, onEdit, onDelete }: EventDetailProps) {
  const meta = EVENT_CATEGORY_META[event.category] ?? { icon: '📌', label: event.category };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.35)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="animate-slide-up rounded-t-3xl overflow-y-auto"
        style={{
          background: '#FAF8F3',
          maxHeight: '90svh',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: '#D4C9BF' }} />
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 px-5 pt-3 pb-4">
          <span
            className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
            style={{ backgroundColor: event.color }}
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold leading-snug" style={{ color: '#2D1B0E', margin: 0 }}>
              {event.title}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#9E8A7C' }}>
              {formatDate(event.startDate)}
              {event.endDate && ` – ${formatDate(event.endDate)}`}
              {' · '}
              {meta.icon} {meta.label}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: '#F5EFE6', color: '#6B5744' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Description */}
        {event.description && (
          <div className="px-5 pb-4">
            <p className="text-sm leading-relaxed" style={{ color: '#3D2314' }}>
              {event.description}
            </p>
          </div>
        )}

        {/* Media */}
        {event.media.length > 0 && (
          <div className="px-5 pb-4 space-y-3">
            {event.media.map(m => {
              if (m.type === 'photo' && m.url) {
                return (
                  <div key={m.id}>
                    <img
                      src={m.url}
                      alt={m.caption ?? ''}
                      className="w-full rounded-2xl object-cover"
                      style={{ maxHeight: 320 }}
                    />
                    {m.caption && (
                      <p className="text-xs mt-1.5 text-center" style={{ color: '#9E8A7C' }}>{m.caption}</p>
                    )}
                  </div>
                );
              }

              if (m.type === 'video' && m.url) {
                const ytId = getYouTubeId(m.url);
                return (
                  <div key={m.id}>
                    {ytId ? (
                      <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                          className="w-full h-full"
                          allowFullScreen
                          title={m.caption ?? 'Video'}
                        />
                      </div>
                    ) : (
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-xl text-sm"
                        style={{ background: '#F5EFE6', color: '#6B5744', textDecoration: 'none' }}
                      >
                        🎬 {m.caption ?? m.url}
                      </a>
                    )}
                  </div>
                );
              }

              if (m.type === 'text' && m.content) {
                return (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl"
                    style={{ background: '#F5EFE6', borderLeft: `4px solid ${event.color}` }}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#3D2314' }}>
                      {m.content}
                    </p>
                    {m.caption && (
                      <p className="text-xs mt-2" style={{ color: '#9E8A7C' }}>— {m.caption}</p>
                    )}
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="px-5 pb-8 pt-2 flex gap-3">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-colors"
                style={{ background: '#F5EFE6', color: '#6B5744' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#E8DDD4')}
                onMouseLeave={e => (e.currentTarget.style.background = '#F5EFE6')}
              >
                <Edit2 size={15} /> Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl text-sm font-medium transition-colors"
                style={{ background: '#FEF2F2', color: '#B5573A' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FDE8E4')}
                onMouseLeave={e => (e.currentTarget.style.background = '#FEF2F2')}
              >
                <Trash2 size={15} /> Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
