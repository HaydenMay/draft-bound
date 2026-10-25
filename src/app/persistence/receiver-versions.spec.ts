import {describe, expect, it} from 'vitest';
import fixtures from './fixtures/v1.4.2-receiver-checkpoints.json';
import {emptySave, previewSave} from './save';
import {createRun, transition} from '../domain/engine';
import {step, completeRun} from '../domain/test-fixtures';
import type {GameCommandPayload, RunState} from '../domain/models';
import {RECEIVER_CATALOG_VERSION} from '../data/receiver-catalog';
import {COLLEGES} from '../data/colleges';

describe('receiver pool versions', () => {
  it('pins new prospects to the curated catalog and identifies it on draft snapshots', () => {
    const run = createRun('New Prospect', 11, 219);
    expect((run as any).receiverCatalogVersion).toBe(RECEIVER_CATALOG_VERSION);
    expect(RECEIVER_CATALOG_VERSION).not.toBe('wr-v1.4.1-provisional-498');
    expect(completeRun(82).entry!.draft.contentVersion).toBe(RECEIVER_CATALOG_VERSION);
  });

  it.each(fixtures)('resumes a frozen $save.run.creationMode save without changing old rerolls or assignments', fixture => {
    const restored = previewSave(JSON.stringify(fixture.save));
    expect(restored.errors).toEqual([]);
    expect(restored.data).toEqual(fixture.save);
    let run = restored.data!.run!;
    for (const command of fixture.commands) run = step(run, command as GameCommandPayload);
    expect(run).toEqual(fixture.expected);
    const save = emptySave(); save.run = run;
    expect(previewSave(JSON.stringify(save)).errors).toEqual([]);
  });

  it('rejects unknown explicit pool versions rather than silently using another catalog', () => {
    const save = emptySave(); save.run = createRun('Version Test', 11, 82);
    (save.run as any).receiverCatalogVersion = 'unrecognized-pool';
    expect(previewSave(JSON.stringify(save)).ok).toBe(false);
  });

  it.each(fixtures)('keeps the original catalog on a completed archived $save.run.creationMode draft and imported card', fixture => {
    let run = step(structuredClone(fixture.expected) as RunState, {type:'continue'});
    run = step(run, {type:'choose-college',collegeId:COLLEGES[0].id});
    for(let year=1;year<=2;year++){
      for(let block=0;block<3;block++){
        run=step(run,{type:'train',plan:{mode:'balanced'}});run=step(run,{type:'continue'});
      }
      if(year===1){run=step(run,{type:'continue'});run=step(run,{type:'transfer',collegeId:COLLEGES[0].id});}
      else run=step(run,{type:'declare'});
    }
    const result = transition(run,{type:'scout',id:'archived-draft'});
    expect(result.entry!.draft.contentVersion).toBe('wr-v1.4.1-provisional-498');
    expect(result.entry!.draft.prospect.traits).toEqual(fixture.expected.prospect.traits);
    const save=emptySave();save.run=result.run;save.entries=[result.entry!];
    const json=JSON.stringify(save);
    expect(previewSave(json).errors).toEqual([]);
    expect(JSON.stringify(previewSave(json).data!.entries)).toBe(JSON.stringify(save.entries));
    expect(previewSave(json).data!.run).toEqual(save.run);
  });

  it('rejects changing an archived committed roll to a different pool version', () => {
    const save = structuredClone(fixtures[0].save);
    (save.run as unknown as RunState & {receiverCatalogVersion:string}).receiverCatalogVersion = RECEIVER_CATALOG_VERSION;
    expect(previewSave(JSON.stringify(save)).ok).toBe(false);
  });
});
