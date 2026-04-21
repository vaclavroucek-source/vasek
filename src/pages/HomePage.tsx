import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, ChevronRight, Trash2, Share2 } from 'lucide-react';
import type { Profile } from '../types';
import { getProfiles, deleteProfile } from '../utils/storage';
import { getAge, formatDate } from '../utils/dateUtils';
import { FAMOUS_PEOPLE } from '../data/famousPeople';
import { Navbar } from '../components/Navbar';

export function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>(() => getProfiles());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function handleDelete(id: string) {
    deleteProfile(id);
    setProfiles(getProfiles());
    setConfirmDelete(null);
  }

  function copyShareLink(shareId: string) {
    const url = `${window.location.origin}/share/${shareId}`;
    navigator.clipboard.writeText(url).then(() => alert('Share link copied!')).catch(() => prompt('Copy this link:', url));
  }

  return (
    <div style={{ minHeight: '100svh', background: '#FAF8F3' }}>
      <Navbar
        actions={
          <Link
            to="/profile/create"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ background: '#C17F4E', color: '#fff', textDecoration: 'none' }}
          >
            <Plus size={15} /> New
          </Link>
        }
      />

      <main className="max-w-xl mx-auto px-4 pb-16">
        {/* Hero */}
        <div className="text-center pt-10 pb-8">
          <h1
            className="text-4xl font-bold mb-3"
            style={{ color: '#2D1B0E', fontFamily: 'Georgia, serif', letterSpacing: '-0.03em', margin: '0 0 12px' }}
          >
            Your life,<br />beautifully mapped.
          </h1>
          <p className="text-base leading-relaxed" style={{ color: '#6B5744', maxWidth: 320, margin: '0 auto 28px' }}>
            Record events, define eras, and compare timelines with friends or the world's most fascinating lives.
          </p>
          <Link
            to="/profile/create"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-base font-semibold transition-colors"
            style={{ background: '#C17F4E', color: '#fff', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#A0613A')}
            onMouseLeave={e => (e.currentTarget.style.background = '#C17F4E')}
          >
            <Plus size={18} /> Create your timeline
          </Link>
        </div>

        {/* User Profiles */}
        {profiles.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9E8A7C', margin: '0 0 12px' }}>
              My Timelines
            </h2>
            <div className="space-y-3">
              {profiles.map(p => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-4 rounded-2xl"
                  style={{ background: '#fff', border: '1px solid #E8DDD4', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                >
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ background: '#F5EFE6' }}
                  >
                    {p.avatar ? (
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{p.species === 'animal' ? '🐾' : '👤'}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-snug" style={{ color: '#2D1B0E' }}>{p.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9E8A7C' }}>
                      {formatDate(p.birthday)} · age {getAge(p.birthday)}
                    </p>
                    {p.bio && (
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: '#6B5744' }}>{p.bio}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => copyShareLink(p.shareId)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ color: '#9E8A7C' }}
                      title="Copy share link"
                      onMouseEnter={e => (e.currentTarget.style.background = '#F5EFE6')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Share2 size={14} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(p.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ color: '#9E8A7C' }}
                      title="Delete timeline"
                      onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Trash2 size={14} />
                    </button>
                    <Link
                      to={`/timeline/${p.id}`}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ background: '#C17F4E', color: '#fff', textDecoration: 'none' }}
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features if no profiles */}
        {profiles.length === 0 && (
          <section className="grid grid-cols-1 gap-3 mb-8">
            {[
              { icon: '📅', title: 'Events & Memories', desc: 'Log any moment — one day or many. Add photos, videos, and notes.' },
              { icon: '🎨', title: 'Eras', desc: 'Create colour-coded eras for school, relationships, jobs, places, and more.' },
              { icon: '🔗', title: 'Share Your Life', desc: 'Every timeline gets a unique URL. Share it with whoever you like.' },
              { icon: '🔀', title: 'Compare Timelines', desc: 'See how your life lines up against friends or iconic people in history.' },
            ].map(f => (
              <div
                key={f.title}
                className="flex items-start gap-3 p-4 rounded-2xl"
                style={{ background: '#fff', border: '1px solid #E8DDD4' }}
              >
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#2D1B0E' }}>{f.title}</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#6B5744' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Compare CTA */}
        <section className="mb-8">
          <Link
            to="/compare"
            className="flex items-center gap-3 p-4 rounded-2xl no-underline transition-colors"
            style={{ background: '#F5EFE6', border: '1.5px solid #E8DDD4', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#EDE5D8')}
            onMouseLeave={e => (e.currentTarget.style.background = '#F5EFE6')}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#C17F4E' }}>
              <Users size={18} color="white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: '#2D1B0E' }}>Compare Timelines</p>
              <p className="text-xs mt-0.5" style={{ color: '#6B5744' }}>
                See how your life aligns with famous people in history
              </p>
            </div>
            <ChevronRight size={18} style={{ color: '#9E8A7C' }} />
          </Link>
        </section>

        {/* Famous People */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9E8A7C', margin: '0 0 12px' }}>
            Famous Timelines
          </h2>
          <div className="space-y-3">
            {FAMOUS_PEOPLE.map(fp => (
              <Link
                key={fp.profile.id}
                to={`/timeline/${fp.profile.id}`}
                className="flex items-center gap-3 p-4 rounded-2xl no-underline transition-colors"
                style={{ background: '#fff', border: '1px solid #E8DDD4', textDecoration: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)')}
              >
                <div
                  className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-xl"
                  style={{ background: '#F5EFE6' }}
                >
                  🌟
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: '#2D1B0E' }}>{fp.profile.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9E8A7C' }}>
                    {formatDate(fp.profile.birthday)} · {fp.events.length} events · {fp.eras.length} eras
                  </p>
                  {fp.profile.bio && (
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: '#6B5744' }}>{fp.profile.bio}</p>
                  )}
                </div>
                <ChevronRight size={16} style={{ color: '#9E8A7C', flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Delete confirm dialog */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in"
          style={{ background: 'rgba(0,0,0,0.35)' }}
          onClick={e => { if (e.target === e.currentTarget) setConfirmDelete(null); }}
        >
          <div
            className="animate-slide-up w-full max-w-xl rounded-t-3xl p-6"
            style={{ background: '#FAF8F3', boxShadow: '0 -8px 32px rgba(0,0,0,0.12)' }}
          >
            <div className="flex justify-center mb-1"><div className="w-10 h-1 rounded-full" style={{ background: '#D4C9BF' }} /></div>
            <h3 className="text-lg font-semibold mb-2 mt-4" style={{ color: '#2D1B0E', margin: '16px 0 8px' }}>Delete Timeline?</h3>
            <p className="text-sm mb-6" style={{ color: '#6B5744' }}>This will permanently delete the profile along with all its events and eras. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 rounded-2xl text-sm font-medium" style={{ background: '#F5EFE6', color: '#6B5744' }}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete!)} className="flex-1 py-3 rounded-2xl text-sm font-semibold" style={{ background: '#B5573A', color: '#fff' }}>
                <Trash2 size={15} className="inline mr-1" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
