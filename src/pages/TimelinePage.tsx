import { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit2, Share2, Users } from 'lucide-react';
import type { Profile, TimelineEvent, Era } from '../types';
import { getProfile, getEvents, getEras, saveEvent, deleteEvent, saveEra, deleteEra } from '../utils/storage';
import { getAge, formatDate } from '../utils/dateUtils';
import { getFamousPersonById } from '../data/famousPeople';
import { Navbar } from '../components/Navbar';
import { TimelineView } from '../components/TimelineView';

export function TimelinePage() {
  // Single :id param — check famous people first, then user profiles
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const famousData  = id ? getFamousPersonById(id) : undefined;
  const isFamous    = !!famousData;

  const [profile] = useState<Profile | null>(() =>
    famousData?.profile ?? (id ? getProfile(id) ?? null : null)
  );

  const [events, setEvents] = useState<TimelineEvent[]>(() =>
    famousData?.events ?? (id ? getEvents(id) : [])
  );

  const [eras, setEras] = useState<Era[]>(() =>
    famousData?.eras ?? (id ? getEras(id) : [])
  );

  const handleSaveEvent = useCallback((event: TimelineEvent) => {
    saveEvent(event);
    setEvents(getEvents(event.profileId));
  }, []);

  const handleDeleteEvent = useCallback((eventId: string) => {
    deleteEvent(eventId);
    if (id && !isFamous) setEvents(getEvents(id));
  }, [id, isFamous]);

  const handleSaveEra = useCallback((era: Era) => {
    saveEra(era);
    setEras(getEras(era.profileId));
  }, []);

  const handleDeleteEra = useCallback((eraId: string) => {
    deleteEra(eraId);
    if (id && !isFamous) setEras(getEras(id));
  }, [id, isFamous]);

  function copyShareLink() {
    if (!profile) return;
    const url = `${window.location.origin}/share/${profile.shareId}`;
    navigator.clipboard.writeText(url)
      .then(() => alert('Share link copied!'))
      .catch(() => prompt('Copy this link:', url));
  }

  if (!profile) {
    return (
      <div style={{ minHeight: '100svh', background: '#FAF8F3' }}>
        <Navbar title="Not found" backTo="/" />
        <div className="flex flex-col items-center justify-center pt-24 px-8 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-semibold" style={{ color: '#2D1B0E' }}>Timeline not found</p>
          <p className="text-sm mt-2 mb-6" style={{ color: '#6B5744' }}>This profile doesn't exist or has been deleted.</p>
          <Link to="/" style={{ color: '#C17F4E', textDecoration: 'none', fontWeight: 600 }}>← Back home</Link>
        </div>
      </div>
    );
  }

  const age = getAge(profile.birthday);

  return (
    <div style={{ minHeight: '100svh', background: '#FAF8F3' }}>
      <Navbar
        title={profile.name}
        backTo="/"
        actions={
          <div className="flex items-center gap-2">
            {!isFamous && (
              <>
                <button
                  onClick={copyShareLink}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ color: '#6B5744' }}
                  title="Share"
                  onMouseEnter={e => (e.currentTarget.style.background = '#F5EFE6')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={() => navigate(`/profile/${id}/edit`)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ color: '#6B5744' }}
                  title="Edit profile"
                  onMouseEnter={e => (e.currentTarget.style.background = '#F5EFE6')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Edit2 size={15} />
                </button>
              </>
            )}
            <Link
              to="/compare"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ color: '#6B5744', textDecoration: 'none' }}
              title="Compare timelines"
              onMouseEnter={e => (e.currentTarget.style.background = '#F5EFE6')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Users size={16} />
            </Link>
          </div>
        }
      />

      {/* Profile header */}
      <div className="px-4 py-5 flex items-center gap-4" style={{ borderBottom: '1px solid #E8DDD4', background: '#fff' }}>
        <div
          className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ background: '#F5EFE6' }}
        >
          {profile.avatar
            ? <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            : <span className="text-2xl">{isFamous ? '🌟' : profile.species === 'animal' ? '🐾' : '👤'}</span>}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold leading-tight" style={{ color: '#2D1B0E', margin: 0 }}>
            {profile.name}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#9E8A7C' }}>
            Born {formatDate(profile.birthday)}
            {age >= 0 && ` · ${age} years old`}
          </p>
          {profile.bio && (
            <p className="text-xs mt-1.5 leading-relaxed line-clamp-3" style={{ color: '#6B5744' }}>
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex" style={{ borderBottom: '1px solid #E8DDD4', background: '#F5EFE6' }}>
        {[
          { label: 'Events', value: events.length },
          { label: 'Eras',   value: eras.length },
          { label: 'Years',  value: Math.max(0, age + 1) },
        ].map(s => (
          <div key={s.label} className="flex-1 py-3 text-center" style={{ borderRight: '1px solid #E8DDD4' }}>
            <p className="text-lg font-bold" style={{ color: '#2D1B0E', margin: 0 }}>{s.value}</p>
            <p className="text-xs" style={{ color: '#9E8A7C' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="max-w-xl mx-auto pt-4">
        <TimelineView
          profile={profile}
          events={events}
          eras={eras}
          isEditable={!isFamous}
          onSaveEvent={handleSaveEvent}
          onDeleteEvent={handleDeleteEvent}
          onSaveEra={handleSaveEra}
          onDeleteEra={handleDeleteEra}
        />
      </div>
    </div>
  );
}
