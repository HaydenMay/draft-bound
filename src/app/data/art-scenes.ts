import type { ArtScene } from '../domain/models';

/** Shared original illustrations; eligibility lives in the rules and saved evidence. */
export const ART_SCENES: ArtScene[] = [
  { id: 'prospect_journey', name: 'Prospect Journey', description: 'The first chapter of a new football life.', art: 'art/journey.png', accent: '#57D6BB' },
  { id: 'draft_night', name: 'Draft Night', description: 'The moment a professional team calls your name.', art: 'art/draft.png', accent: '#E8BD72' },
  { id: 'breakaway_star', name: 'Breakaway Star', description: 'A long scoring catch becomes an open-field escape.', art: 'art/breakaway.png', accent: '#62DCC8' },
  { id: 'spectacular_catch', name: 'Spectacular Catch', description: 'A difficult, contested reception earns its own frame.', art: 'art/spectacular.png', accent: '#B3B8FF' },
  { id: 'red_zone_monster', name: 'Red Zone Monster', description: 'Repeated scoring catches near the goal line.', art: 'art/spectacular.png', accent: '#F18D79' },
  { id: 'breakout_star', name: 'Breakout Star', description: 'A standout college receiving performance.', art: 'art/breakaway.png', accent: '#E8BD72' },
  { id: 'reliable_hands', name: 'Reliable Hands', description: 'A sustained record of dependable receiving.', art: 'art/journey.png', accent: '#8DDDB3' },
  { id: 'transfer_breakout', name: 'Transfer Breakout', description: 'A new program and a documented step forward.', art: 'art/journey.png', accent: '#80BCEA' },
  { id: 'award_ceremony', name: 'Award Ceremony', description: 'A modeled college or professional accolade.', art: 'art/awards.png', accent: '#F3CC80' },
  { id: 'rookie_breakout', name: 'Rookie Breakout', description: 'A productive first professional season.', art: 'art/breakaway.png', accent: '#7DE2CE' },
  { id: 'canton_bust', name: 'Canton Bust', description: 'An inducted career remembered in bronze.', art: 'art/hall-of-fame.png', accent: '#CE9D6D' },
  { id: 'gold_jacket', name: 'Gold Jacket', description: 'The closing honor of an inducted career.', art: 'art/hall-of-fame.png', accent: '#E8BD72' },
];
