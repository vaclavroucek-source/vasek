import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { Profile, TimelineEvent, Era } from '../types';
import { getProfileByShareId, getEvents, getEras } from '../utils/storage';
import { getFamousPersonByShareId } from '../data/famousPeople';
import { getAge, formatDate } from '../utils/dateUtils';
import { Navbar } from '../components/Navbar';
import { TimelineView } from '../components/TimelineView';

export function SharePage() {
  const { shareId } = useParams<{ shareId: string }>();

  const [data] = useState<{ profile: Profile; events: TimelineEvent[]; eras: Era[] } | null>(() => {
    if (!shareId) return null;

    // Check user profiles first
    const userProfile = getProfileByShareId(shareId);
    if (userProfile) {
      return {
        profile: userProfile,
        events:  getEvents(userProfile.id),
        eras:    getEras(userProfile.id),
      };
    }

    // Check famous people
    const famous = getFamousPersonByShareId(shareId);
    if (famous) {
      return {
        profile: famous.profile,
        events:  famous.events,
        eras:    famous.eras,
      };
    }

    return null;
  });

  if (!data) {
    return (
      <div style={{ minHeight: '100svh', background: '#FAF8F3' }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-24 px-8 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-xl font-semibold mb-2" style={{ color: '#2D1B0E' }}>Timeline not found</p>
          <p className="text-sm mb-8" style={{ color: '#6B5744' }}>
            This link may be invalid, or the timeline may have been set to private.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold no-underline"
            style={{ background: '#C17F4E', color: '#fff', textDecoration: 'none' }}
          >
            Create your own timeline
          </Link>
        </div>
      </div>
    );
  }

  const { profile, events, eras } = data;
  const age = getAge(profile.birthday);

  return (
    <div style={{ minHeight: '100svh', background: '#FAF8F3' }}>
      <Navbar
        title={`${profile.name}'s Timeline`}
        actions={
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium no-underline"
            style={{ background: '#C17F4E', color: '#fff', textDecoration: 'none' }}
          >
            <Plus size={13} /> Your timeline
          </Link>
        }
      />

      {/* Profile header */}
      <div
        className="px-4 py-5 flex items-center gap-4"
        style={{ borderBottom: '1px solid #E8DDD4', background: '#fff' }}
      >
        <div
          className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ background: '#F5EFE6' }}
        >
          {profile.avatar
            ? <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            : <span className="text-2xl">{profile.isFamous ? '🌟' : profile.species === 'animal' ? '🐾' : '👤'}</span>}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold" style={{ color: '#2D1B0E', margin: 0 }}>
            {profile.name}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#9E8A7C' }}>
            Born {formatDate(profile.birthday)}
            {age >= 0 && ` · ${age} years old`}
          </p>
          {profile.bio && (
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#6B5744' }}>{profile.bio}</p>
          )}
        </div>
      </div>

      {/* Timeline (read-only) */}
      <div className="max-w-xl mx-auto pt-4">
        <TimelineView
          profile={profile}
          events={events}
          eras={eras}
          isEditable={false}
        />
      </div>

      {/* Create your own CTA */}
      <div
        className="max-w-xl mx-auto mx-4 mt-8 mb-16 p-6 rounded-3xl text-center"
        style={{ background: '#F5EFE6', border: '1.5px solid #E8DDD4', margin: '32px 16px 64px' }}
      >
        <p className="text-2xl mb-3">📅</p>
        <p className="font-semibold mb-1.5" style={{ color: '#2D1B0E' }}>Map your own life story</p>
        <p className="text-sm mb-4" style={{ color: '#6B5744' }}>
          Lifeline helps you record events, define eras, and share your unique timeline with the world.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold no-underline"
          style={{ background: '#C17F4E', color: '#fff', textDecoration: 'none' }}
        >
          <Plus size={16} /> Start for free
        </Link>
      </div>
    </div>
  );
}
