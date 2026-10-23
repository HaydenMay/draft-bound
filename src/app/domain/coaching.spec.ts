import {describe,it,expect} from 'vitest';
import {detectIntervention} from './coaching';
import {createCollege} from './test-fixtures';
import {emptyStats} from './simulation';
import {values} from './development';
import {GameRecord,WrGameStats} from './models';

function block(stats:Partial<WrGameStats>,skills:Record<string,number>={}){
 const run=createCollege();run.prospect!.current=values(()=>92);Object.values(run.prospect!.traits).forEach(t=>t.ceiling=99);
 Object.assign(run.prospect!.current,skills);run.gameNumber=4;
 run.lastBlock={year:1,block:1,games:[{stats:{...emptyStats(),routes:120,targets:40,receptions:30,yards:500,grade:85,...stats},events:[]}] as unknown as GameRecord[],gains:{},startOvr:60,endOvr:70,training:{mode:'balanced'},intervention:null,fulfilled:null};return run;
}
describe('performance and skill based coaching',()=>{
 it('does not prescribe corrective JUGS to a 94-hands receiver even after a bad block',()=>{
  expect(detectIntervention(block({drops:8},{hands:94}))).toBeNull();
 });
 it('requires both a meaningful drop rate and a developable hands weakness',()=>{
  expect(detectIntervention(block({drops:6},{hands:70}))?.type).toBe('wr.jugs');
  expect(detectIntervention(block({targets:80,receptions:70,drops:5},{hands:70}))).toBeNull();
  expect(detectIntervention(block({targets:5,receptions:1,drops:4},{hands:70}))).toBeNull();
 });
 it.each([
  ['wr.press',{pressReps:30,pressLosses:18},{release:65}],
  ['wr.contested',{contestedTargets:12,contestedCatches:2},{bodyControl:65}],
  ['wr.routes',{targets:20,receptions:16},{routeRunning:60}],
  ['wr.burst',{targets:20,receptions:16},{acceleration:60}],
  ['wr.tracking',{contestedTargets:12,contestedCatches:2},{vertical:60}],
  ['wr.yac',{receptions:20,yards:140},{yardsAfterCatch:60}],
  ['wr.film',{targets:18,receptions:14},{awareness:60}],
  ['wr.speed',{receptions:20,yards:220},{speed:60}],
 ] as const)('makes %s reachable from corresponding performance and skill evidence',(type,stats,skills)=>{
  expect(detectIntervention(block(stats,skills))?.type).toBe(type);
 });
 it('selects the stronger need instead of always taking JUGS first',()=>{
  expect(detectIntervention(block({drops:5,pressReps:40,pressLosses:36},{hands:85,release:60}))?.type).toBe('wr.press');
 });
 it('excludes capped traits, yearly repeats and the final block',()=>{
  const run=block({drops:6},{hands:70});run.prospect!.traits['hands'].ceiling=70;expect(detectIntervention(run)).toBeNull();
  run.prospect!.traits['hands'].ceiling=99;run.usedInterventions=['wr.jugs'];expect(detectIntervention(run)).toBeNull();
  run.usedInterventions=[];run.gameNumber=12;expect(detectIntervention(run)).toBeNull();
 });
});
