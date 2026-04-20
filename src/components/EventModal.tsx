import { useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { X, Plus, Trash2, Image, Video, FileText, AlertCircle, Loader2 } from 'lucide-react';
import type { TimelineEvent, MediaItem, EventCategory } from '../types';
import { EVENT_CATEGORY_META } from '../types';
import { ColorPicker } from './ColorPicker';
import { todayISO } from '../utils/dateUtils';
import { compressImage } from '../utils/imageUtils';

interface EventModalProps {
  profileId: string;
  event?: TimelineEvent;
  defaultDate?: string;
  onSave: (event: TimelineEvent) => void;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

const CATEGORIES = Object.entries(EVENT_CATEGORY_META) as [EventCategory, { label: string; icon: string }][];

export function EventModal({ profileId, event, defaultDate, onSave, onClose, onDelete }: EventModalProps) {
  const [title, setTitle]             = useState(event?.title ?? '');
  const [startDate, setStartDate]     = useState(event?.startDate ?? defaultDate ?? todayISO());
  const [endDate, setEndDate]         = useState(event?.endDate ?? '');
  const [isMultiDay, setIsMultiDay]   = useState(!!event?.endDate);
  const [description, setDescription] = useState(event?.description ?? '');
  const [color, setColor]             = useState(event?.color ?? '#C17F4E');
  const [category, setCategory]       = useState<EventCategory>(event?.category ?? 'milestone');
  const [media, setMedia]             = useState<MediaItem[]>(event?.media ?? []);
  const [videoUrl, setVideoUrl]         = useState('');
  const [textNote, setTextNote]         = useState('');
  const [addingMedia, setAddingMedia]   = useState<null | 'video' | 'text'>(null);
  const [uploading, setUploading]       = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startDate) return;
    setError(null);

    const saved: TimelineEvent = {
      id: event?.id ?? uuid(),
      profileId,
      title: title.trim(),
      startDate,
      endDate: isMultiDay && endDate ? endDate : undefined,
      description: description.trim() || undefined,
      media,
      color,
      category,
      createdAt: event?.createdAt ?? new Date().toISOString(),
    };

    try {
      onSave(saved);
    } catch (err) {
      if (err instanceof Error && err.name === 'QuotaExceededError') {
        setError('Storage full — your browser limit is reached. Try deleting some old photos, or use a smaller image (the app compresses automatically, but very many photos add up).');
      } else {
        setError('Something went wrong saving this event. Please try again.');
      }
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileRef.current) fileRef.current.value = '';
    setError(null);
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      setMedia(prev => [...prev, { id: uuid(), type: 'photo', url: compressed }]);
    } catch {
      setError('Could not process this photo. Try a different image file (JPEG or PNG work best).');
    } finally {
      setUploading(false);
    }
  }

  function addVideo() {
    if (!videoUrl.trim()) return;
    setMedia(prev => [...prev, { id: uuid(), type: 'video', url: videoUrl.trim() }]);
    setVideoUrl('');
    setAddingMedia(null);
  }

  function addText() {
    if (!textNote.trim()) return;
    setMedia(prev => [...prev, { id: uuid(), type: 'text', content: textNote.trim() }]);
    setTextNote('');
    setAddingMedia(null);
  }

  function removeMedia(id: string) {
    setMedia(prev => prev.filter(m => m.id !== id));
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors';
  const inputStyle = { background: '#F5EFE6', border: '1.5px solid #E8DDD4', color: '#2D1B0E' };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form
        onSubmit={handleSubmit}
        className="animate-slide-up rounded-t-3xl overflow-y-auto"
        style={{ background: '#FAF8F3', maxHeight: '92svh', boxShadow: '0 -8px 32px rgba(0,0,0,0.15)' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full" style={{ background: '#D4C9BF' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-lg font-semibold" style={{ color: '#2D1B0E', margin: 0 }}>
            {event ? 'Edit Event' : 'New Event'}
          </h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#F5EFE6', color: '#6B5744' }}>
            <X size={16} />
          </button>
        </div>

        <div className="px-5 space-y-4 pb-8">
          {/* Error banner */}
          {error && (
            <div
              className="flex items-start gap-2.5 p-3 rounded-2xl text-sm animate-slide-up"
              style={{ background: '#FEF2F2', border: '1.5px solid #FCC', color: '#B5573A' }}
            >
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <p className="leading-snug">{error}</p>
              <button type="button" onClick={() => setError(null)} className="flex-shrink-0 ml-auto" style={{ color: '#B5573A' }}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#6B5744' }}>Title *</label>
            <input
              className={inputCls}
              style={inputStyle}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What happened?"
              required
              autoFocus
            />
          </div>

          {/* Dates */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#6B5744' }}>Date *</label>
            <input type="date" className={inputCls} style={inputStyle} value={startDate} onChange={e => setStartDate(e.target.value)} required />
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={isMultiDay} onChange={e => setIsMultiDay(e.target.checked)} className="rounded" />
              <span className="text-xs" style={{ color: '#6B5744' }}>Multi-day event</span>
            </label>
            {isMultiDay && (
              <div className="mt-2">
                <label className="text-xs font-medium block mb-1.5" style={{ color: '#6B5744' }}>End Date</label>
                <input type="date" className={inputCls} style={inputStyle} value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} />
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#6B5744' }}>Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(([cat, meta]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className="px-2 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                  style={{
                    background: category === cat ? '#C17F4E' : '#F5EFE6',
                    color:      category === cat ? '#fff'    : '#6B5744',
                    border: category === cat ? 'none' : '1.5px solid #E8DDD4',
                  }}
                >
                  <span>{meta.icon}</span>
                  <span className="truncate">{meta.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: '#6B5744' }}>Colour</label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#6B5744' }}>Description</label>
            <textarea
              className={inputCls}
              style={{ ...inputStyle, resize: 'none', minHeight: 80 }}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add details, memories, feelings…"
              rows={3}
            />
          </div>

          {/* Media */}
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: '#6B5744' }}>Photos, Videos & Notes</label>

            {media.length > 0 && (
              <div className="space-y-2 mb-3">
                {media.map(m => (
                  <div key={m.id} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: '#F5EFE6' }}>
                    {m.type === 'photo' && <img src={m.url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                    {m.type === 'video' && <span className="text-lg flex-shrink-0">🎬</span>}
                    {m.type === 'text'  && <span className="text-lg flex-shrink-0">📝</span>}
                    <span className="text-xs flex-1 truncate" style={{ color: '#6B5744' }}>
                      {m.type === 'photo' ? 'Photo' : m.type === 'video' ? m.url : m.content?.substring(0, 50)}
                    </span>
                    <button type="button" onClick={() => removeMedia(m.id)} style={{ color: '#9E8A7C' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {addingMedia === 'video' && (
              <div className="flex gap-2 mb-2">
                <input
                  className={inputCls + ' flex-1'}
                  style={inputStyle}
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="YouTube or video URL"
                  autoFocus
                />
                <button type="button" onClick={addVideo} className="px-3 rounded-xl text-sm font-medium" style={{ background: '#C17F4E', color: '#fff' }}>Add</button>
                <button type="button" onClick={() => setAddingMedia(null)} style={{ color: '#9E8A7C' }}><X size={16} /></button>
              </div>
            )}

            {addingMedia === 'text' && (
              <div className="mb-2">
                <textarea
                  className={inputCls}
                  style={{ ...inputStyle, resize: 'none' }}
                  value={textNote}
                  onChange={e => setTextNote(e.target.value)}
                  placeholder="Write a note or memory…"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={addText} className="px-3 py-2 rounded-xl text-sm font-medium" style={{ background: '#C17F4E', color: '#fff' }}>Add Note</button>
                  <button type="button" onClick={() => setAddingMedia(null)} style={{ color: '#9E8A7C' }}><X size={16} /></button>
                </div>
              </div>
            )}

            {!addingMedia && (
              <div className="flex gap-2">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <button
                  type="button"
                  onClick={() => !uploading && fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
                  style={{ background: '#F5EFE6', color: uploading ? '#9E8A7C' : '#6B5744', opacity: uploading ? 0.7 : 1 }}
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Image size={14} />}
                  {uploading ? 'Processing…' : 'Photo'}
                </button>
                <button type="button" onClick={() => setAddingMedia('video')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium" style={{ background: '#F5EFE6', color: '#6B5744' }}>
                  <Video size={14} /> Video
                </button>
                <button type="button" onClick={() => setAddingMedia('text')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium" style={{ background: '#F5EFE6', color: '#6B5744' }}>
                  <FileText size={14} /> Note
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-3.5 rounded-2xl text-sm font-semibold transition-colors"
              style={{ background: uploading ? '#D4C9BF' : '#C17F4E', color: '#fff', cursor: uploading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => !uploading && (e.currentTarget.style.background = '#A0613A')}
              onMouseLeave={e => !uploading && (e.currentTarget.style.background = '#C17F4E')}
            >
              <Plus size={16} className="inline mr-1" />
              {event ? 'Save Changes' : 'Add Event'}
            </button>
            {event && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="py-3.5 px-5 rounded-2xl text-sm font-medium transition-colors"
                style={{ background: '#FEF2F2', color: '#B5573A' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FDE8E4')}
                onMouseLeave={e => (e.currentTarget.style.background = '#FEF2F2')}
              >
                <Trash2 size={16} className="inline" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
