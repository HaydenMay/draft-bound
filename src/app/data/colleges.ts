import type { CollegeProgram } from '../domain/models';
import { WR_ATTRIBUTE_IDS } from './source-players';

/** Original fictional programs. Coaching applies to the listed specialties. */
export const COLLEGES: CollegeProgram[] = [
  {
    id: 'technical', prestige: 4, name: 'Meridian Institute', location: 'Meridian Falls', shortName: 'MERIDIAN',
    colors: ['#243B63', '#E9B86B'], specialty: 'Routes & release', specialties: ['routeRunning', 'release'],
    description: 'A precise passing laboratory. Refine your footwork with specialist coaching and compete for every target.',
    coaching: 1.25, opportunity: 0.80, offense: 1.00,
  },
  {
    id: 'explosive', prestige: 4, name: 'Cinder Ridge University', location: 'Cinder Ridge', shortName: 'CINDER RIDGE',
    colors: ['#B84632', '#F4D991'], specialty: 'Speed & vertical', specialties: ['speed', 'vertical'],
    description: 'An attacking program built around space and the deep ball. Specialist coaching develops speed and elevation.',
    coaching: 1.25, opportunity: 0.90, offense: 1.00,
  },
  {
    id: 'opportunity', prestige: 2, name: 'Openwater State', location: 'Port Openwater', shortName: 'OPENWATER',
    colors: ['#1B756B', '#D5F2E2'], specialty: 'Opportunity & balance', specialties: [...WR_ATTRIBUTE_IDS],
    description: 'An open depth chart and a balanced development room. More playing opportunities with modest coaching across every skill.',
    coaching: 1.05, opportunity: 1.10, offense: 1.00,
  },
  ...[
    ['pine-valley','Pine Valley College','PINE VALLEY',1,['hands','awareness'],'Reliable hands',1.08,1.15],
    ['red-mesa','Red Mesa College','RED MESA',1,['speed','acceleration'],'First-step speed',1.08,1.12],
    ['harbor-point','Harbor Point College','HARBOR POINT',1,['bodyControl','vertical'],'Ball skills',1.08,1.12],
    ['lake-cedar','Lake Cedar State','LAKE CEDAR',2,['routeRunning','release'],'Route craft',1.12,1.08],
    ['silver-prairie','Silver Prairie State','SILVER PRAIRIE',2,['yardsAfterCatch','awareness'],'Space and vision',1.12,1.08],
    ['summit-coast','Summit Coast University','SUMMIT COAST',3,['hands','bodyControl','vertical'],'Contested catches',1.18,1.00],
    ['ironwood','Ironwood University','IRONWOOD',3,['speed','acceleration','yardsAfterCatch'],'Open-field play',1.18,1.00],
    ['northstar','Northstar University','NORTHSTAR',4,['hands','awareness','bodyControl'],'Dependable production',1.25,.88],
    ['canyon-union','Canyon Union University','CANYON UNION',4,['acceleration','yardsAfterCatch'],'Explosive movement',1.25,.88],
    ['crown-athletic','Crown Athletic University','CROWN ATHLETIC',5,['speed','acceleration','vertical'],'Elite athletic development',1.25,.78],
    ['westhaven','Westhaven University','WESTHAVEN',5,['hands','bodyControl','yardsAfterCatch'],'Elite receiving skills',1.25,.78],
    ['grand-lakes','Grand Lakes University','GRAND LAKES',5,['routeRunning','release','awareness'],'Elite technical development',1.25,.78],
  ].map(([id,name,shortName,prestige,specialties,specialty,coaching,opportunity],index)=>({
    id,name,location:name,shortName,prestige,specialties,specialty,coaching,opportunity,offense:1,
    colors:[['#315748','#E6D6AB'],['#8C3F32','#EDD3AA'],['#244D62','#C8DCDD'],['#2C5369','#E1D5B5'],['#65554B','#D9D5CC'],['#285866','#EACD9B'],['#3B4D37','#DDD8B2'],['#293C68','#C6D5E1'],['#7C3B35','#E6C48A'],['#42315F','#E1CA8E'],['#1F5C52','#EBE0C3'],['#283C63','#D8C17F']][index] as [string,string],
    description:[
      'Build dependable hands and coverage awareness with an open path to playing time.',
      'Develop your first step in a speed room with plenty of snaps to compete for.',
      'Work on tracking and contested catches while earning a role on the coast.',
      'A route-focused staff pairs technical practice with an accessible depth chart.',
      'Learn to find space and turn catches into extra yards.',
      'A specialist receiving room for high-point catches, secure hands and body control.',
      'An open-field program for acceleration, speed and yards after the catch.',
      'Refine reliable receiving technique in a competitive passing program.',
      'A movement-focused staff develops acceleration and run-after-catch ability.',
      'An elite athletic staff can unlock 99 specialty ceilings. Competition limits playing opportunities.',
      'An elite receiving room can unlock 99 specialty ceilings. Every target must be earned.',
      'An elite technical program can unlock 99 specialty ceilings. A demanding depth chart rewards readiness.',
    ][index],
  } as CollegeProgram)),
];
/** Frozen choices for prospects created before the recruiting release. */
export const LEGACY_COLLEGES=COLLEGES.slice(0,3);
