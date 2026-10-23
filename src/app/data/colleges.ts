import type { CollegeProgram } from '../domain/models';
import { WR_ATTRIBUTE_IDS } from './source-players';

/** Original fictional programs. Coaching applies to the listed specialties. */
export const COLLEGES: CollegeProgram[] = [
  {
    id: 'technical', name: 'Meridian Institute', location: 'Meridian Falls', shortName: 'MERIDIAN',
    colors: ['#243B63', '#E9B86B'], specialty: 'Routes & release', specialties: ['routeRunning', 'release'],
    description: 'A precise passing laboratory. Refine your footwork with specialist coaching and compete for every target.',
    coaching: 1.25, opportunity: 0.80, offense: 1.00,
  },
  {
    id: 'explosive', name: 'Cinder Ridge University', location: 'Cinder Ridge', shortName: 'CINDER RIDGE',
    colors: ['#B84632', '#F4D991'], specialty: 'Speed & vertical', specialties: ['speed', 'vertical'],
    description: 'An attacking program built around space and the deep ball. Specialist coaching develops speed and elevation.',
    coaching: 1.25, opportunity: 0.90, offense: 1.00,
  },
  {
    id: 'opportunity', name: 'Openwater State', location: 'Port Openwater', shortName: 'OPENWATER',
    colors: ['#1B756B', '#D5F2E2'], specialty: 'Opportunity & balance', specialties: [...WR_ATTRIBUTE_IDS],
    description: 'An open depth chart and a balanced development room. More playing opportunities with modest coaching across every skill.',
    coaching: 1.05, opportunity: 1.10, offense: 1.00,
  },
];
