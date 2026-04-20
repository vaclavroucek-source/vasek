import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Era, EraCategory } from '../types';
import { ERA_CATEGORY_META } from '../types';
import { ColorPicker } from './ColorPicker';
import { todayISO } from '../utils/dateUtils';

interface EraModalProps {
  profileId: string;
  era?: Era;
  defaultStartDate?: string;
  onSave: (era: Era) => void;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

const CATEGORIES = Object.entries(ERA_CATEGORY_META) as [EraCategory, { label: string; icon: string; defaultColor: string }][];

export function EraModal({ profileId, era, defaultStartDate, onSave, onClose, onDelete }: EraModalProps) {
  const [title, setTitle]             = useState(era?.title ?? '');
  const [category, setCategory]       = useState<EraCategory>(era?.category ?? 'education');
  const [color, setColor]             = useState(era?.color ?? '#7BA68A');
  const [startDate, setStartDate]     = useState(era?.startDate ?? defaultStartDate ?? todayISO());
  const [endDate, setEndDate]         = useState(era?.endDate ?? '');
  const [isOngoing, setIsOngoing]     = useState(era?.isOngoing ?? false);
  const [description, setDescription] = useState(era?.description ?? '');

  function handleCategoryChange(cat: EraCategory) {
    setCategory(cat);
    if (!era) setColor(ERA_CATEGORY_META[cat].defaultColor);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startDate) return;

    const saved: Era = {
      id: era?.id ?? uuid(),
      profileId,
      title: title.trim(),
      category,
      color,
      startDate,
      endDate: isOngoing ? undefined : (endDate || undefined),
      isOngoing,
      description: description.trim() || undefined,
      createdAt: era?.createdAt ?? new Date().toISOString(),
    };
    onSave(saved);
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
            {era ? 'Edit Era' : 'New Era'}
          </h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#F5EFE6', color: '#6B5744' }}>
            <X size={16} />
          </button>
        </div>

        <div className="px-5 space-y-4 pb-8">
          {/* Era preview strip */}
          <div
            className="w-full h-2 rounded-full"
            style={{ background: color }}
          />

          {/* Title */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#6B5744' }}>Era Name *</label>
            <input
              className={inputCls}
              style={inputStyle}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. University Years, Living in Berlin, With Max…"
              required
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#6B5744' }}>Category</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(([cat, meta]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className="px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors"
                  style={{
                    background: category === cat ? '#C17F4E' : '#F5EFE6',
                    color:      category === cat ? '#fff'    : '#6B5744',
                    border: category === cat ? 'none' : '1.5px solid #E8DDD4',
                  }}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colour */}
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: '#6B5744' }}>Colour</label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          {/* Dates */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#6B5744' }}>Start Date *</label>
            <input type="date" className={inputCls} style={inputStyle} value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={isOngoing}
                onChange={e => setIsOngoing(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium" style={{ color: '#2D1B0E' }}>Still ongoing</span>
            </label>
            {!isOngoing && (
              <>
                <label className="text-xs font-medium block mb-1.5" style={{ color: '#6B5744' }}>End Date</label>
                <input type="date" className={inputCls} style={inputStyle} value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} />
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: '#6B5744' }}>Description</label>
            <textarea
              className={inputCls}
              style={{ ...inputStyle, resize: 'none', minHeight: 72 }}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What was this period about?"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-2xl text-sm font-semibold"
              style={{ background: '#C17F4E', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#A0613A')}
              onMouseLeave={e => (e.currentTarget.style.background = '#C17F4E')}
            >
              <Plus size={16} className="inline mr-1" />
              {era ? 'Save Changes' : 'Add Era'}
            </button>
            {era && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(era.id)}
                className="py-3.5 px-5 rounded-2xl text-sm font-medium"
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
