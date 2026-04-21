import type { Profile, TimelineEvent, Era } from '../types';

// Static famous people database — read-only, not stored in localStorage

export interface FamousPersonData {
  profile: Profile;
  events: TimelineEvent[];
  eras: Era[];
}

const fp = (id: string): Profile => ({
  id,
  shareId: `fp_${id}`,
  name: '',
  birthday: '',
  bio: '',
  isPublic: true,
  isFamous: true,
  createdAt: '2000-01-01T00:00:00.000Z',
});

const ev = (profileId: string, id: string, title: string, startDate: string, description: string, color: string, category: TimelineEvent['category']): TimelineEvent => ({
  id,
  profileId,
  title,
  startDate,
  description,
  media: [],
  color,
  category,
  createdAt: '2000-01-01T00:00:00.000Z',
});

const era = (profileId: string, id: string, title: string, startDate: string, endDate: string | undefined, isOngoing: boolean, color: string, category: Era['category'], description?: string): Era => ({
  id,
  profileId,
  title,
  startDate,
  endDate,
  isOngoing,
  description,
  color,
  category,
  createdAt: '2000-01-01T00:00:00.000Z',
});

// ─── Albert Einstein (1879–1955) ──────────────────────────────────────────────

const einsteinId = 'einstein';
const einstein: FamousPersonData = {
  profile: {
    ...fp(einsteinId),
    name: 'Albert Einstein',
    birthday: '1879-03-14',
    bio: 'Theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics.',
  },
  events: [
    ev(einsteinId, 'ae1',  'Born in Ulm, Germany',                          '1879-03-14', 'Born to Hermann and Pauline Einstein.', '#C17F4E', 'milestone'),
    ev(einsteinId, 'ae2',  'Enrolled at ETH Zürich',                         '1896-10-01', 'Began studies in mathematics and physics at the Swiss Federal Polytechnic School.', '#7BA68A', 'achievement'),
    ev(einsteinId, 'ae3',  'Started at the Patent Office',                   '1902-06-16', 'Began working as a technical expert at the Federal Office for Intellectual Property in Bern.', '#C9A847', 'work'),
    ev(einsteinId, 'ae4',  'Married Mileva Marić',                           '1903-01-06', 'Married his university classmate and fellow physicist.', '#C47F85', 'family'),
    ev(einsteinId, 'ae5',  'Annus Mirabilis — Special Relativity',           '1905-06-30', 'Published four groundbreaking papers including the special theory of relativity and E=mc².', '#B5573A', 'achievement'),
    ev(einsteinId, 'ae6',  'General Theory of Relativity published',         '1915-11-25', 'Presented the field equations of gravitation to the Prussian Academy of Sciences.', '#B5573A', 'achievement'),
    ev(einsteinId, 'ae7',  'Awarded Nobel Prize in Physics',                 '1921-12-10', 'Received the 1921 Nobel Prize for the discovery of the law of the photoelectric effect.', '#C9A847', 'achievement'),
    ev(einsteinId, 'ae8',  'Fled Nazi Germany to the USA',                   '1933-03-01', 'Left Germany permanently as the Nazi Party rose to power.', '#5E728B', 'milestone'),
    ev(einsteinId, 'ae9',  'Joined Institute for Advanced Study, Princeton', '1933-10-01', 'Accepted a position at the newly founded IAS and never returned to Germany.', '#7BA68A', 'work'),
    ev(einsteinId, 'ae10', 'Letter to President Roosevelt on atomic bomb',   '1939-08-02', 'Signed the Einstein–Szilárd letter warning of nuclear weapons potential.', '#5E728B', 'milestone'),
    ev(einsteinId, 'ae11', 'Became US citizen',                              '1940-10-01', 'Took the oath of allegiance and became an American citizen.', '#6B9EC4', 'milestone'),
    ev(einsteinId, 'ae12', 'Died in Princeton, New Jersey',                  '1955-04-18', 'Died of an aortic aneurysm at age 76.', '#9E8A7C', 'milestone'),
  ],
  eras: [
    era(einsteinId, 'ae_e1', 'Childhood in Germany',      '1879-03-14', '1895-12-31', false, '#C17F4E', 'location'),
    era(einsteinId, 'ae_e2', 'Switzerland Years',          '1896-01-01', '1914-12-31', false, '#6B9EC4', 'location'),
    era(einsteinId, 'ae_e3', 'Berlin & Weimar Republic',  '1914-04-01', '1933-03-01', false, '#C9A847', 'location'),
    era(einsteinId, 'ae_e4', 'Princeton Years (USA)',      '1933-10-01', '1955-04-18', false, '#7BA68A', 'location'),
    era(einsteinId, 'ae_e5', 'Patent Office',              '1902-06-16', '1909-07-06', false, '#A08AA8', 'career', 'Technical expert at Swiss Patent Office, Bern.'),
    era(einsteinId, 'ae_e6', 'Academic Career',            '1909-07-06', '1955-04-18', false, '#5E8B6B', 'career', 'Professor at multiple universities and research institutes.'),
    era(einsteinId, 'ae_e7', 'Married to Mileva Marić',   '1903-01-06', '1919-02-14', false, '#C47F85', 'relationship'),
    era(einsteinId, 'ae_e8', 'Married to Elsa Einstein',  '1919-06-02', '1936-12-20', false, '#C47F85', 'relationship'),
  ],
};

// ─── Marie Curie (1867–1934) ──────────────────────────────────────────────────

const curieId = 'curie';
const curie: FamousPersonData = {
  profile: {
    ...fp(curieId),
    name: 'Marie Curie',
    birthday: '1867-11-07',
    bio: 'Physicist and chemist, pioneer in radioactivity research. First woman to win a Nobel Prize, and the only person to win Nobel Prizes in two different sciences.',
  },
  events: [
    ev(curieId, 'mc1',  'Born in Warsaw, Poland',                   '1867-11-07', 'Born Maria Skłodowska into a family of teachers.', '#C17F4E', 'milestone'),
    ev(curieId, 'mc2',  'Moved to Paris',                            '1891-11-01', 'Moved to Paris to continue studies at the Sorbonne.', '#6B9EC4', 'milestone'),
    ev(curieId, 'mc3',  'Graduated first in physics degree',         '1893-07-01', 'Earned her degree in physics, graduating first in her class.', '#7BA68A', 'achievement'),
    ev(curieId, 'mc4',  'Married Pierre Curie',                      '1895-07-26', 'Married fellow physicist Pierre Curie.', '#C47F85', 'family'),
    ev(curieId, 'mc5',  'Discovered Polonium',                       '1898-07-18', 'Named after her homeland Poland, becoming the first element named after a country.', '#B5573A', 'achievement'),
    ev(curieId, 'mc6',  'Discovered Radium',                         '1898-12-26', 'Announced the isolation of radium from pitchblende.', '#B5573A', 'achievement'),
    ev(curieId, 'mc7',  'Nobel Prize in Physics',                    '1903-12-10', 'Awarded the Nobel Prize in Physics jointly with Pierre Curie and Henri Becquerel for radioactivity research.', '#C9A847', 'achievement'),
    ev(curieId, 'mc8',  'Pierre Curie killed in accident',           '1906-04-19', 'Pierre was fatally struck by a horse-drawn cart in Paris.', '#9E8A7C', 'family'),
    ev(curieId, 'mc9',  'Appointed first female professor at Sorbonne', '1906-11-05', 'Took over Pierre\'s professorship, becoming the first woman to hold a chair at the Sorbonne.', '#7BA68A', 'achievement'),
    ev(curieId, 'mc10', 'Second Nobel Prize — Chemistry',            '1911-12-10', 'Awarded the Nobel Prize in Chemistry for the discovery of radium and polonium.', '#C9A847', 'achievement'),
    ev(curieId, 'mc11', 'Founded the Curie Institute Paris',         '1920-01-01', 'Co-founded the Radium Institute (now the Curie Institute).', '#A08AA8', 'achievement'),
    ev(curieId, 'mc12', 'Died of aplastic anaemia',                  '1934-07-04', 'Died at the Sancellemoz sanatorium in Passy, Haute-Savoie, from aplastic anaemia caused by radiation exposure.', '#9E8A7C', 'milestone'),
  ],
  eras: [
    era(curieId, 'mc_e1', 'Childhood in Warsaw',        '1867-11-07', '1891-10-31', false, '#C17F4E', 'location'),
    era(curieId, 'mc_e2', 'Paris — Student Years',      '1891-11-01', '1895-07-25', false, '#6B9EC4', 'education'),
    era(curieId, 'mc_e3', 'Research with Pierre',        '1895-07-26', '1906-04-19', false, '#C47F85', 'relationship'),
    era(curieId, 'mc_e4', 'Solo Research Career',        '1906-04-19', '1934-07-04', false, '#5E8B6B', 'career'),
    era(curieId, 'mc_e5', 'WWI — Mobile X-ray Units',   '1914-08-01', '1918-11-11', false, '#B5573A', 'career', 'Deployed mobile X-ray units (les petites Curies) on the front lines.'),
    era(curieId, 'mc_e6', 'Sorbonne Professorship',     '1906-11-05', '1934-07-04', false, '#7BA68A', 'career'),
  ],
};

// ─── Freddie Mercury (1946–1991) ──────────────────────────────────────────────

const freddieId = 'freddie';
const freddie: FamousPersonData = {
  profile: {
    ...fp(freddieId),
    name: 'Freddie Mercury',
    birthday: '1946-09-05',
    bio: 'Lead vocalist and pianist of the rock band Queen, considered one of the greatest singers in the history of rock music.',
  },
  events: [
    ev(freddieId, 'fm1',  'Born in Zanzibar',                        '1946-09-05', 'Born Farrokh Bulsara to Parsi parents.', '#C17F4E', 'milestone'),
    ev(freddieId, 'fm2',  'Started piano lessons',                   '1954-01-01', 'Began classical piano training at age 7, showing remarkable natural talent.', '#A08AA8', 'milestone'),
    ev(freddieId, 'fm3',  'Moved to England',                        '1964-09-01', 'The Bulsara family moved to Feltham, Middlesex, following the Zanzibar Revolution.', '#6B9EC4', 'milestone'),
    ev(freddieId, 'fm4',  'Queen formed',                            '1970-07-27', 'Joined Brian May and Roger Taylor to form Queen after meeting them through Ibex.', '#B5573A', 'achievement'),
    ev(freddieId, 'fm5',  'First Queen album released',              '1973-07-13', 'Queen\'s self-titled debut album was released.', '#C17F4E', 'achievement'),
    ev(freddieId, 'fm6',  'Bohemian Rhapsody released',              '1975-10-31', 'Released the groundbreaking six-minute single from A Night at the Opera.', '#B5573A', 'achievement'),
    ev(freddieId, 'fm7',  'We Will Rock You / We Are the Champions', '1977-10-07', 'Released the anthems that became sporting events staples worldwide.', '#C9A847', 'achievement'),
    ev(freddieId, 'fm8',  'Live Aid — Wembley Stadium',              '1985-07-13', 'Queen\'s 21-minute set was widely considered the greatest live performance in rock history.', '#C9A847', 'achievement'),
    ev(freddieId, 'fm9',  'Barcelona duet with Montserrat Caballé',  '1987-10-10', 'Released the duet "Barcelona" which became the anthem of the 1992 Olympics.', '#A08AA8', 'achievement'),
    ev(freddieId, 'fm10', 'Final studio recording with Queen',       '1991-05-23', 'Recorded his final vocal performances for the Made in Heaven album.', '#5E728B', 'milestone'),
    ev(freddieId, 'fm11', 'Publicly confirmed AIDS diagnosis',       '1991-11-23', 'Released a statement confirming he had AIDS, one day before his death.', '#9E8A7C', 'milestone'),
    ev(freddieId, 'fm12', 'Died in London',                          '1991-11-24', 'Died at his home in Kensington, London, from bronchopneumonia as a complication of AIDS.', '#9E8A7C', 'milestone'),
  ],
  eras: [
    era(freddieId, 'fm_e1', 'Zanzibar Childhood',         '1946-09-05', '1954-01-01', false, '#C17F4E', 'location'),
    era(freddieId, 'fm_e2', 'Boarding School — India',    '1954-01-01', '1963-08-01', false, '#C9A847', 'education', 'St. Peter\'s School, Panchgani, India.'),
    era(freddieId, 'fm_e3', 'Life in England',             '1964-09-01', '1991-11-24', false, '#6B9EC4', 'location'),
    era(freddieId, 'fm_e4', 'The Queen Years',             '1970-07-27', '1991-11-24', false, '#B5573A', 'career'),
    era(freddieId, 'fm_e5', 'Living with HIV/AIDS',        '1987-01-01', '1991-11-24', false, '#A08AA8', 'health', 'Diagnosed in 1987; kept private until his final day.'),
    era(freddieId, 'fm_e6', 'Relationship with Mary Austin', '1969-01-01', '1976-01-01', false, '#C47F85', 'relationship', 'Long-term partner; remained his closest friend for life.'),
  ],
};

// ─── Frida Kahlo (1907–1954) ──────────────────────────────────────────────────

const fridaId = 'frida';
const frida: FamousPersonData = {
  profile: {
    ...fp(fridaId),
    name: 'Frida Kahlo',
    birthday: '1907-07-06',
    bio: 'Mexican artist known for her many portraits, self-portraits, and works inspired by the nature and artifacts of Mexico.',
  },
  events: [
    ev(fridaId, 'fk1',  'Born in Coyoacán, Mexico',           '1907-07-06', 'Born Magdalena Carmen Frida Kahlo y Calderón.', '#C17F4E', 'milestone'),
    ev(fridaId, 'fk2',  'Survived polio at age 6',            '1913-01-01', 'Contracted polio, leaving her right leg thinner than the left.', '#B5573A', 'health'),
    ev(fridaId, 'fk3',  'Bus accident',                        '1925-09-17', 'Severely injured in a traffic collision; spent months in recovery and started painting.', '#B5573A', 'health'),
    ev(fridaId, 'fk4',  'First self-portrait',                 '1926-01-01', 'Painted her first self-portrait while recovering, beginning her distinctive style.', '#A08AA8', 'achievement'),
    ev(fridaId, 'fk5',  'Married Diego Rivera (1st time)',     '1929-08-21', 'Married the celebrated muralist Diego Rivera.', '#C47F85', 'family'),
    ev(fridaId, 'fk6',  'Moved to the United States',          '1930-11-01', 'Accompanied Diego to San Francisco, Detroit, and New York.', '#6B9EC4', 'travel'),
    ev(fridaId, 'fk7',  'The Two Fridas — iconic painting',   '1939-07-01', 'Created her first large-scale canvas following her divorce from Diego.', '#A08AA8', 'achievement'),
    ev(fridaId, 'fk8',  'Divorced Diego Rivera',               '1939-11-06', 'Filed for divorce citing incompatibility and mutual infidelities.', '#9E8A7C', 'family'),
    ev(fridaId, 'fk9',  'Remarried Diego Rivera',              '1940-12-08', 'Remarried Diego on his 54th birthday, on the condition of financial independence.', '#C47F85', 'family'),
    ev(fridaId, 'fk10', 'First solo exhibition in Mexico',     '1953-04-13', 'First and only solo exhibition in Mexico, attended in her hospital bed.', '#C9A847', 'achievement'),
    ev(fridaId, 'fk11', 'Died in Coyoacán',                    '1954-07-13', 'Died at La Casa Azul, her lifelong home. Cause unclear — possibly pulmonary embolism.', '#9E8A7C', 'milestone'),
  ],
  eras: [
    era(fridaId, 'fk_e1', 'Childhood — La Casa Azul',          '1907-07-06', '1925-09-17', false, '#C17F4E', 'location', 'The Blue House in Coyoacán, now the Frida Kahlo Museum.'),
    era(fridaId, 'fk_e2', 'Recovery & Early Art',               '1925-09-17', '1929-08-21', false, '#B5573A', 'health', '30+ surgeries throughout her life stemming from the 1925 accident.'),
    era(fridaId, 'fk_e3', 'Life with Diego (1st marriage)',     '1929-08-21', '1939-11-06', false, '#C47F85', 'relationship'),
    era(fridaId, 'fk_e4', 'Independence & Global Recognition', '1939-11-06', '1940-12-08', false, '#A08AA8', 'career'),
    era(fridaId, 'fk_e5', 'Life with Diego (2nd marriage)',     '1940-12-08', '1954-07-13', false, '#C47F85', 'relationship'),
    era(fridaId, 'fk_e6', 'Artistic Career',                    '1926-01-01', '1954-07-13', false, '#8B8B5E', 'career', 'Produced 143 paintings, 55 of which are self-portraits.'),
  ],
};

// ─── Nikola Tesla (1856–1943) ─────────────────────────────────────────────────

const teslaId = 'tesla';
const tesla: FamousPersonData = {
  profile: {
    ...fp(teslaId),
    name: 'Nikola Tesla',
    birthday: '1856-07-10',
    bio: 'Serbian-American inventor and engineer who laid the foundations of modern AC electricity supply systems. A visionary and prolific inventor.',
  },
  events: [
    ev(teslaId, 'nt1',  'Born in Smiljan, Serbia',                 '1856-07-10', 'Born at midnight during a lightning storm — the midwife reportedly called him "a child of light".', '#C17F4E', 'milestone'),
    ev(teslaId, 'nt2',  'Enrolled at Graz University of Technology', '1875-01-01', 'Studied electrical engineering and physics; reportedly studied up to 19 hours a day.', '#7BA68A', 'achievement'),
    ev(teslaId, 'nt3',  'Joined Edison\'s company in Paris',       '1882-01-01', 'Began working for the Continental Edison Company in Paris.', '#C9A847', 'work'),
    ev(teslaId, 'nt4',  'Arrived in New York, joined Edison',      '1884-06-06', 'Arrived in the USA with four cents, a letter of introduction, and a head full of ideas.', '#6B9EC4', 'milestone'),
    ev(teslaId, 'nt5',  'Left Edison; founded Tesla Electric Light', '1885-01-01', 'Parted ways with Edison over unpaid promises; started his own company.', '#B5573A', 'work'),
    ev(teslaId, 'nt6',  'AC motor & polyphase system patents',     '1887-10-12', 'Filed a series of patents for his AC motor and polyphase electrical system.', '#B5573A', 'achievement'),
    ev(teslaId, 'nt7',  'Partnership with Westinghouse',           '1888-07-01', 'George Westinghouse licensed Tesla\'s AC patents, launching the War of Currents.', '#7BA68A', 'achievement'),
    ev(teslaId, 'nt8',  'Niagara Falls power plant opened',        '1895-11-16', 'The world\'s first large-scale AC hydroelectric power plant began transmitting electricity.', '#C9A847', 'achievement'),
    ev(teslaId, 'nt9',  'Lab destroyed in fire',                   '1895-03-13', 'His South Fifth Avenue laboratory was devastated by fire, destroying years of research.', '#9E8A7C', 'health'),
    ev(teslaId, 'nt10', 'Wardenclyffe Tower construction begins',  '1901-01-01', 'Began building his ambitious wireless transmission tower on Long Island.', '#A08AA8', 'achievement'),
    ev(teslaId, 'nt11', 'Wardenclyffe project collapsed',          '1906-01-01', 'JP Morgan withdrew funding; the dream of free global wireless energy transmission ended.', '#9E8A7C', 'work'),
    ev(teslaId, 'nt12', 'Died alone in New York',                  '1943-01-07', 'Died alone and nearly penniless in Room 3327 of the New Yorker Hotel, aged 86.', '#9E8A7C', 'milestone'),
  ],
  eras: [
    era(teslaId, 'nt_e1', 'Serbian Childhood',            '1856-07-10', '1875-01-01', false, '#C17F4E', 'location'),
    era(teslaId, 'nt_e2', 'European Education & Work',    '1875-01-01', '1884-06-05', false, '#7BA68A', 'education'),
    era(teslaId, 'nt_e3', 'Early USA — Edison & AC War',  '1884-06-06', '1900-01-01', false, '#6B9EC4', 'career'),
    era(teslaId, 'nt_e4', 'Wardenclyffe Dream',           '1900-01-01', '1917-01-01', false, '#A08AA8', 'career', 'Attempted to build a global wireless power transmission system.'),
    era(teslaId, 'nt_e5', 'Later Years & Decline',        '1906-01-01', '1943-01-07', false, '#9E8A7C', 'career', 'Continued inventing but struggled financially despite earlier fame.'),
    era(teslaId, 'nt_e6', 'New York City Life',           '1884-06-06', '1943-01-07', false, '#5E728B', 'location'),
  ],
};

// ─── Exports ─────────────────────────────────────────────────────────────────

export const FAMOUS_PEOPLE: FamousPersonData[] = [einstein, curie, freddie, frida, tesla];

export function getFamousPersonById(id: string): FamousPersonData | undefined {
  return FAMOUS_PEOPLE.find(p => p.profile.id === id);
}

export function getFamousPersonByShareId(shareId: string): FamousPersonData | undefined {
  return FAMOUS_PEOPLE.find(p => p.profile.shareId === shareId);
}
