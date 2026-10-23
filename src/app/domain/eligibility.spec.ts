import {it,expect} from 'vitest';
import {cosmeticProfile} from './eligibility';
import {completeRun} from './test-fixtures';
it('preserves an unsupported historical card without executing WR achievements',()=>{const entry=completeRun().entry!;entry.positionId='qb-future';delete (entry.draft as any).transfers;expect(()=>cosmeticProfile([entry])).not.toThrow();});
