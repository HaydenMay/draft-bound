import {describe,it,expect} from 'vitest';
import {recruitRating} from './recruiting';
import {createCollege} from './test-fixtures';
import {values} from './development';

describe('recruiting assessment',()=>{
 it('blends 75% position-weighted potential with 25% initial ability',()=>{
  const p=createCollege().prospect!;p.initial=values(()=>60);Object.values(p.traits).forEach(t=>t.ceiling=92);
  expect(recruitRating(p)).toMatchObject({score:84,stars:4,startingOvr:60,potentialOvr:92});
 });
 it('stays frozen as the prospect develops and never changes their attributes',()=>{
  const p=createCollege().prospect!,before=structuredClone(p),rating=recruitRating(p);
  expect(p).toEqual(before);p.current=values(id=>p.traits[id].ceiling);
  expect(recruitRating(p)).toEqual(rating);
 });
 it.each([[73,1],[74,2],[78,3],[82,4],[86,5],[99,5]] as const)('uses fixed bands for score %i', (score,stars)=>{
  const p=createCollege().prospect!;p.initial=values(()=>score);Object.values(p.traits).forEach(t=>t.ceiling=score);
  expect(recruitRating(p).stars).toBe(stars);
 });
});
