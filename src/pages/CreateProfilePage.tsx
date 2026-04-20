import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Camera, X } from 'lucide-react';
import type { Profile } from '../types';
import { saveProfile, getProfile } from '../utils/storage';
import { generateShareId, todayISO } from '../utils/dateUtils';
import { Navbar } from '../components/Navbar';

export function CreateProfilePage() {
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId?: string }>();
  const existing = profileId ? getProfile(profileId) : undefined;

  const [name, setName]       = useState(existing?.name ?? '');
  const [birthday, setBirthday] = useState(existing?.birthday ?? '');
  const [bio, setBio]         = useState(existing?.bio ?? '');
  const [avatar, setAvatar]   = useState<string | undefined>(existing?.avatar);
  const [isPublic, setIsPublic] = useState(existing?.isPublic ?? true);
  const [species, setSpecies] = useState<Profile['species']>(existing?.species ?? 'human');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { alert('Image must be under 4 MB.'); return; }
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !birthday) return;

    const profile: Profile = {
      id:        existing?.id ?? uuid(),
      shareId:   existing?.shareId ?? generateShareId(),
      name:      name.trim(),
      birthday,
      bio:       bio.trim() || undefined,
      avatar,
      isPublic,
      species,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };

    saveProfile(profile);
    navigate(`/timeline/${profile.id}`);
  }

  const inputCls = 'w-full px-4 py-3 rounded-2xl text-sm outline-none transition-colors';
  const inputStyle = { background: '#F5EFE6', border: '1.5px solid #E8DDD4', color: '#2D1B0E' };
  const focusStyle = { border: '1.5px solid #C17F4E' };

  return (
    <div style={{ minHeight: '100svh', background: '#FAF8F3' }}>
      <Navbar title={existing ? 'Edit Profile' : 'Create Timeline'} backTo="/" />

      <main className="max-w-xl mx-auto px-4 pt-6 pb-16">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center pb-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden transition-all"
              style={{ background: '#F5EFE6', border: '2px dashed #D4C9BF' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#C17F4E')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#D4C9BF')}
            >
              {avatar ? (
                <>
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera size={20} color="white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Camera size={24} style={{ color: '#9E8A7C' }} />
                  <span className="text-xs" style={{ color: '#9E8A7C' }}>Photo</span>
                </div>
              )}
            </button>
            {avatar && (
              <button
                type="button"
                onClick={() => setAvatar(undefined)}
                className="mt-2 text-xs flex items-center gap-1"
                style={{ color: '#B5573A', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={12} /> Remove photo
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>

          {/* Species */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: '#9E8A7C' }}>
              Timeline for
            </label>
            <div className="flex gap-2">
              {(['human', 'animal', 'other'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpecies(s)}
                  className="flex-1 py-2.5 rounded-2xl text-sm font-medium capitalize transition-colors"
                  style={{
                    background: species === s ? '#C17F4E' : '#F5EFE6',
                    color:      species === s ? '#fff'    : '#6B5744',
                    border: species === s ? 'none' : '1.5px solid #E8DDD4',
                  }}
                >
                  {s === 'human' ? '👤 Person' : s === 'animal' ? '🐾 Animal' : '✨ Other'}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: '#9E8A7C' }}>
              Name *
            </label>
            <input
              className={inputCls}
              style={inputStyle}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={species === 'animal' ? 'Your pet\'s name' : 'Full name'}
              required
              onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
              onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: '#9E8A7C' }}>
              {species === 'human' ? 'Date of Birth' : 'Date of Birth / Adoption'} *
            </label>
            <input
              type="date"
              className={inputCls}
              style={inputStyle}
              value={birthday}
              max={todayISO()}
              onChange={e => setBirthday(e.target.value)}
              required
              onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
              onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: '#9E8A7C' }}>
              About (optional)
            </label>
            <textarea
              className={inputCls}
              style={{ ...inputStyle, resize: 'none', minHeight: 80 }}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="A short description…"
              rows={3}
              onFocus={e => Object.assign(e.currentTarget.style, { ...inputStyle, ...focusStyle })}
              onBlur={e => Object.assign(e.currentTarget.style, { ...inputStyle, resize: 'none' })}
            />
          </div>

          {/* Visibility */}
          <div
            className="flex items-center justify-between p-4 rounded-2xl"
            style={{ background: '#F5EFE6', border: '1.5px solid #E8DDD4' }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: '#2D1B0E' }}>Public timeline</p>
              <p className="text-xs mt-0.5" style={{ color: '#6B5744' }}>Anyone with the link can view it</p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
              style={{ background: isPublic ? '#C17F4E' : '#D4C9BF' }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full transition-transform"
                style={{ background: '#fff', left: 2, transform: isPublic ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl text-base font-semibold transition-colors mt-2"
            style={{ background: '#C17F4E', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#A0613A')}
            onMouseLeave={e => (e.currentTarget.style.background = '#C17F4E')}
          >
            {existing ? 'Save Changes' : 'Create Timeline →'}
          </button>
        </form>
      </main>
    </div>
  );
}
