import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Profile, TimelineEvent, Era } from '../types';
import { getProfiles, getEvents, getEras } from '../utils/storage';
import { FAMOUS_PEOPLE } from '../data/famousPeople';
import { Navbar } from '../components/Navbar';
import { TimelineView } from '../components/TimelineView';

interface ProfileOption {
  id: string;
  label: string;
  profile: Profile;
  events: TimelineEvent[];
  eras: Era[];
  isFamous: boolean;
}

function buildOptions(): ProfileOption[] {
  const userProfiles = getProfiles().map(p => ({
    id: p.id,
    label: p.name,
    profile: p,
    events: getEvents(p.id),
    eras: getEras(p.id),
    isFamous: false,
  }));

  const famousOptions = FAMOUS_PEOPLE.map(fp => ({
    id: fp.profile.id,
    label: fp.profile.name,
    profile: fp.profile,
    events: fp.events,
    eras: fp.eras,
    isFamous: true,
  }));

  return [...userProfiles, ...famousOptions];
}

function ProfileSelector({
  options, value, onChange, label,
}: {
  options: ProfileOption[];
  value: ProfileOption | null;
  onChange: (opt: ProfileOption) => void;
  label: string;
}) {
  const userOpts   = options.filter(o => !o.isFamous);
  const famousOpts = options.filter(o =>  o.isFamous);

  return (
    <div className="relative">
      <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: '#9E8A7C' }}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value?.id ?? ''}
          onChange={e => {
            const opt = options.find(o => o.id === e.target.value);
            if (opt) onChange(opt);
          }}
          className="w-full appearance-none px-4 py-3 pr-10 rounded-2xl text-sm outline-none"
          style={{
            background: '#F5EFE6',
            border: '1.5px solid #E8DDD4',
            color: value ? '#2D1B0E' : '#9E8A7C',
          }}
        >
          <option value="" disabled>Select a timeline…</option>
          {userOpts.length > 0 && (
            <optgroup label="My Timelines">
              {userOpts.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </optgroup>
          )}
          <optgroup label="Famous People">
            {famousOpts.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </optgroup>
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9E8A7C' }} />
      </div>
    </div>
  );
}

export function ComparePage() {
  const [options] = useState<ProfileOption[]>(buildOptions);
  const [left,  setLeft]  = useState<ProfileOption | null>(null);
  const [right, setRight] = useState<ProfileOption | null>(null);

  // Default: first user profile vs Einstein
  useEffect(() => {
    const user = options.find(o => !o.isFamous);
    const def  = options.find(o => o.id === 'einstein');
    if (!left  && user) setLeft(user);
    if (!right && def)  setRight(def);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ minHeight: '100svh', background: '#FAF8F3' }}>
      <Navbar title="Compare Timelines" />

      <main>
        {/* Selectors */}
        <div
          className="px-4 py-4 space-y-3"
          style={{ background: '#fff', borderBottom: '1px solid #E8DDD4' }}
        >
          <div className="max-w-2xl mx-auto grid grid-cols-2 gap-3">
            <ProfileSelector options={options} value={left}  onChange={setLeft}  label="Timeline A" />
            <ProfileSelector options={options} value={right} onChange={setRight} label="Timeline B" />
          </div>
        </div>

        {/* Side-by-side or stacked */}
        {left || right ? (
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderTop: '1px solid #E8DDD4' }}>
            {/* Left */}
            <div style={{ borderRight: '1px solid #E8DDD4' }}>
              {left ? (
                <>
                  <ProfileHeader option={left} />
                  <TimelineView
                    profile={left.profile}
                    events={left.events}
                    eras={left.eras}
                    isEditable={false}
                  />
                </>
              ) : (
                <EmptySlot side="A" />
              )}
            </div>

            {/* Right */}
            <div>
              {right ? (
                <>
                  <ProfileHeader option={right} />
                  <TimelineView
                    profile={right.profile}
                    events={right.events}
                    eras={right.eras}
                    isEditable={false}
                  />
                </>
              ) : (
                <EmptySlot side="B" />
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
            <p className="text-4xl mb-4">🔀</p>
            <p className="text-lg font-semibold" style={{ color: '#2D1B0E' }}>Select two timelines to compare</p>
            <p className="text-sm mt-2" style={{ color: '#6B5744' }}>
              Choose from your timelines or pick a famous person from history.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function ProfileHeader({ option }: { option: ProfileOption }) {
  return (
    <div
      className="px-4 py-4 flex items-center gap-3"
      style={{ background: '#F5EFE6', borderBottom: '1px solid #E8DDD4', position: 'sticky', top: 56, zIndex: 10 }}
    >
      <div
        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden text-lg"
        style={{ background: '#E8DDD4' }}
      >
        {option.profile.avatar
          ? <img src={option.profile.avatar} alt="" className="w-full h-full object-cover" />
          : option.isFamous ? '🌟' : '👤'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: '#2D1B0E' }}>{option.profile.name}</p>
        <p className="text-xs" style={{ color: '#9E8A7C' }}>
          {option.events.length} events · {option.eras.length} eras
        </p>
      </div>
    </div>
  );
}

function EmptySlot({ side }: { side: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <p className="text-3xl mb-3">📋</p>
      <p className="text-sm" style={{ color: '#9E8A7C' }}>Select timeline {side}</p>
    </div>
  );
}
