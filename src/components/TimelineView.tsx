import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Profile, TimelineEvent, Era } from '../types';
import { ERA_CATEGORY_META } from '../types';
import {
  getYear, getCurrentYear,
  getEventsForYear, getActiveErasForYear,
  getErasStartingInYear, getErasEndingInYear,
} from '../utils/dateUtils';
import { EventCard } from './EventCard';
import { EventDetail } from './EventDetail';
import { EventModal } from './EventModal';
import { EraModal } from './EraModal';

interface TimelineViewProps {
  profile: Profile;
  events: TimelineEvent[];
  eras: Era[];
  isEditable?: boolean;
  onSaveEvent?: (event: TimelineEvent) => void;
  onDeleteEvent?: (id: string) => void;
  onSaveEra?: (era: Era) => void;
  onDeleteEra?: (id: string) => void;
}

export function TimelineView({
  profile, events, eras,
  isEditable = false,
  onSaveEvent, onDeleteEvent, onSaveEra, onDeleteEra,
}: TimelineViewProps) {
  const birthYear   = getYear(profile.birthday);
  const currentYear = getCurrentYear();

  const [detailEvent, setDetailEvent]   = useState<TimelineEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null | 'new'>(null);
  const [editingEra, setEditingEra]     = useState<Era | null | 'new'>(null);
  const [newEventDate, setNewEventDate] = useState<string | undefined>();

  const years = Array.from(
    { length: currentYear - birthYear + 2 },
    (_, i) => birthYear + i
  );

  function handleEventSave(event: TimelineEvent) {
    onSaveEvent?.(event);
    setEditingEvent(null);
    setNewEventDate(undefined);
  }

  function handleEventDelete(id: string) {
    onDeleteEvent?.(id);
    setDetailEvent(null);
    setEditingEvent(null);
  }

  function handleEraSave(era: Era) {
    onSaveEra?.(era);
    setEditingEra(null);
  }

  function handleEraDelete(id: string) {
    onDeleteEra?.(id);
    setEditingEra(null);
  }

  function openNewEvent(year?: number) {
    if (year) setNewEventDate(`${year}-01-01`);
    setEditingEvent('new');
  }

  return (
    <div className="relative">
      {/* Floating add buttons (editable only) */}
      {isEditable && (
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={() => openNewEvent()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{ background: '#C17F4E', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#A0613A')}
            onMouseLeave={e => (e.currentTarget.style.background = '#C17F4E')}
          >
            <Plus size={15} /> Add Event
          </button>
          <button
            onClick={() => setEditingEra('new')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{ background: '#F5EFE6', color: '#6B5744', border: '1.5px solid #E8DDD4' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#E8DDD4')}
            onMouseLeave={e => (e.currentTarget.style.background = '#F5EFE6')}
          >
            <Plus size={15} /> Add Era
          </button>
        </div>
      )}

      {/* Era Legend */}
      {eras.length > 0 && (
        <div className="px-4 mb-4 flex flex-wrap gap-2">
          {eras.map(era => (
            <button
              key={era.id}
              onClick={() => isEditable ? setEditingEra(era) : undefined}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: era.color + '22',
                color: era.color,
                border: `1.5px solid ${era.color}44`,
                cursor: isEditable ? 'pointer' : 'default',
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: era.color }}
              />
              {ERA_CATEGORY_META[era.category].icon} {era.title}
              {era.isOngoing && <span className="opacity-60">• now</span>}
            </button>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div className="relative" style={{ paddingLeft: 4, paddingRight: 4 }}>
        {/* Vertical spine line */}
        <div
          className="absolute top-0 bottom-0"
          style={{ left: 56, width: 2, background: '#E8DDD4', zIndex: 0 }}
        />

        {years.map(year => {
          const age          = year - birthYear;
          const yearEvents   = getEventsForYear(events, year);
          const activeEras   = getActiveErasForYear(eras, year);
          const erasStarting = getErasStartingInYear(eras, year);
          const erasEnding   = getErasEndingInYear(eras, year);
          const isBirthYear  = year === birthYear;
          const isFuture     = year > currentYear;

          return (
            <div key={year} className="flex items-stretch" style={{ minHeight: 64 }}>
              {/* Era color strips (left) */}
              <div
                className="flex gap-px flex-shrink-0"
                style={{ width: 28, paddingTop: 20, paddingBottom: 4, alignSelf: 'stretch' }}
              >
                {activeEras.slice(0, 4).map(era => (
                  <button
                    key={era.id}
                    title={era.title}
                    onClick={() => isEditable ? setEditingEra(era) : undefined}
                    className="flex-1 rounded-sm transition-opacity"
                    style={{
                      backgroundColor: era.color,
                      minWidth: 4,
                      maxWidth: 7,
                      opacity: 0.75,
                      cursor: isEditable ? 'pointer' : 'default',
                    }}
                    onMouseEnter={e => isEditable && (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => isEditable && (e.currentTarget.style.opacity = '0.75')}
                  />
                ))}
              </div>

              {/* Spacer to spine */}
              <div style={{ width: 16, flexShrink: 0 }} />

              {/* Year dot on spine */}
              <div
                className="flex flex-col items-center flex-shrink-0"
                style={{ width: 14, paddingTop: 20, zIndex: 1 }}
              >
                <div
                  className="rounded-full border-2 flex-shrink-0"
                  style={{
                    width:  isBirthYear ? 14 : (yearEvents.length > 0 ? 12 : 10),
                    height: isBirthYear ? 14 : (yearEvents.length > 0 ? 12 : 10),
                    backgroundColor: isBirthYear ? '#C17F4E' : yearEvents.length > 0 ? '#fff' : '#FAF8F3',
                    borderColor:     isBirthYear ? '#C17F4E' : yearEvents.length > 0 ? '#9E8A7C' : '#D4C9BF',
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pl-3 pb-4" style={{ paddingTop: 16 }}>
                {/* Year header */}
                <div className="flex items-baseline gap-2 mb-1">
                  <button
                    className="text-sm font-bold transition-colors"
                    style={{ color: isFuture ? '#D4C9BF' : '#2D1B0E', background: 'none', border: 'none', padding: 0, cursor: isEditable ? 'pointer' : 'default' }}
                    onClick={() => isEditable && openNewEvent(year)}
                    title={isEditable ? `Add event in ${year}` : undefined}
                  >
                    {year}
                  </button>
                  <span className="text-xs" style={{ color: '#9E8A7C' }}>
                    {age === 0 ? 'born' : `age ${age}`}
                  </span>
                  {isEditable && !isFuture && (
                    <button
                      onClick={() => openNewEvent(year)}
                      className="ml-auto text-xs opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity"
                      style={{ color: '#9E8A7C', background: 'none', border: 'none', padding: '0 4px', cursor: 'pointer' }}
                      title={`Add event in ${year}`}
                    >
                      <Plus size={11} />
                    </button>
                  )}
                </div>

                {/* Era starts */}
                {erasStarting.map(era => (
                  <button
                    key={era.id}
                    onClick={() => isEditable ? setEditingEra(era) : undefined}
                    className="w-full text-left mb-2 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
                    style={{
                      background: era.color,
                      color: '#fff',
                      cursor: isEditable ? 'pointer' : 'default',
                    }}
                  >
                    <span>{ERA_CATEGORY_META[era.category].icon}</span>
                    <span className="flex-1 truncate">{era.title} begins</span>
                    {era.isOngoing && <span className="opacity-75 text-xs">ongoing</span>}
                  </button>
                ))}

                {/* Events */}
                {yearEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => setDetailEvent(event)}
                  />
                ))}

                {/* Era ends */}
                {erasEnding.map(era => (
                  <div
                    key={era.id}
                    className="mb-1 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2"
                    style={{
                      background: era.color + '18',
                      color: era.color,
                      border: `1px solid ${era.color}33`,
                    }}
                  >
                    <span>{ERA_CATEGORY_META[era.category].icon}</span>
                    <span className="flex-1 truncate">{era.title} ends</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event detail panel */}
      {detailEvent && (
        <EventDetail
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          onEdit={isEditable ? () => { setEditingEvent(detailEvent); setDetailEvent(null); } : undefined}
          onDelete={isEditable ? () => handleEventDelete(detailEvent.id) : undefined}
        />
      )}

      {/* Event create/edit modal */}
      {editingEvent !== null && (
        <EventModal
          profileId={profile.id}
          event={editingEvent === 'new' ? undefined : editingEvent}
          defaultDate={newEventDate}
          onSave={handleEventSave}
          onClose={() => { setEditingEvent(null); setNewEventDate(undefined); }}
          onDelete={isEditable ? handleEventDelete : undefined}
        />
      )}

      {/* Era create/edit modal */}
      {editingEra !== null && (
        <EraModal
          profileId={profile.id}
          era={editingEra === 'new' ? undefined : editingEra}
          onSave={handleEraSave}
          onClose={() => setEditingEra(null)}
          onDelete={isEditable ? handleEraDelete : undefined}
        />
      )}
    </div>
  );
}
