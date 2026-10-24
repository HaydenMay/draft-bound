import {it,expect} from 'vitest';
import {simulateProfessional} from './professional';
import frozen from './fixtures/v1.3.2-professional-baseline.json';
import {completeRun} from './test-fixtures';
it('keeps v1.3.2 missing-version career simulations byte-stable',()=>{for(const item of frozen.cases){const entry=structuredClone(item.entry) as any;expect(simulateProfessional(entry)).toEqual(item.career);}});
it('uses deterministic v1.4 career rules only for v1.4-tagged drafts',()=>{const entry=completeRun(73,3).entry!;entry.draft.professionalRulesVersion='v1.4';const first=simulateProfessional(entry);expect(simulateProfessional(entry)).toEqual(first);const legacy={...entry,draft:{...entry.draft,professionalRulesVersion:'legacy-v1.3.2' as const}};expect(simulateProfessional(legacy)).not.toEqual(first);});
