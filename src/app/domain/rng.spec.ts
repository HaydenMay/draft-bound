import {it,expect} from 'vitest';
import {Random} from './rng';
it('persists a deterministic stream and samples all bounded outcomes',()=>{
 const a=new Random(719),b=new Random(719); expect(Array.from({length:40},()=>a.int(0,74))).toEqual(Array.from({length:40},()=>b.int(0,74)));
 const resume=new Random(a.state); expect(a.next()).toBe(resume.next());
 const seen=new Set(Array.from({length:10000},()=>a.int(0,74))); expect(seen.size).toBe(75);
});
