import { describe, it, expect } from 'vitest';
import { calculateOvr, integrateGrowth, practiceAllocation, develop } from './development';
import { WR_DEFINITION } from './positions';
describe('development rules', () => {
  it('rounds OVR only for presentation', () => { expect(calculateOvr(Object.fromEntries(WR_DEFINITION.attributes.map(a=>[a.id,98.5])))).toEqual({raw:98.5,display:99}); });
  it('integrates work across slowdown bands and never crosses a ceiling', () => {
    expect(integrateGrowth(69,4,99)).toBeCloseTo(72.4);
    expect(integrateGrowth(94,6,99)).toBeCloseTo(96);
    expect(integrateGrowth(98,100,99)).toBe(99);
  });
  it('keeps each practice budget at 7.2, with focused allocating 4.32', () => {
    for(const mode of ['balanced','focused','intensive'] as const) expect(Object.values(practiceAllocation({mode,attributeId:'hands'})).reduce((a,b)=>a+b,0)).toBeCloseTo(7.2);
    expect(practiceAllocation({mode:'focused',attributeId:'hands'}).hands).toBe(4.32);
  });
  it('allows practice without routes and gives no general work without participation', () => {
    const values=Object.fromEntries(WR_DEFINITION.attributes.map(a=>[a.id,50]));
    const result=develop(values, Object.fromEntries(WR_DEFINITION.attributes.map(a=>[a.id,99])), {mode:'balanced'},1,{coaching:1,specialties:[]},0,{});
    expect(result.current.hands).toBeCloseTo(51.2); expect(Object.values(result.general).every(v=>v===0)).toBe(true);
  });
  it('accounts for actual general and practice gains after bands and clipping',()=>{
    const result=develop(Object.fromEntries(WR_DEFINITION.attributes.map(a=>[a.id,98])),Object.fromEntries(WR_DEFINITION.attributes.map(a=>[a.id,99])),{mode:'focused',attributeId:'hands'},1,{coaching:1.25,specialties:['hands']},30,{});
    for(const a of WR_DEFINITION.attributes)expect(result.general[a.id]+result.practice[a.id]).toBeCloseTo(result.gains[a.id]);
  });
  it('makes the final stretch toward an A ceiling a real investment in the new profile',()=>{
    expect(integrateGrowth(90,4,93,'v1.2')).toBeLessThan(integrateGrowth(90,4,93,'legacy'));
    expect(integrateGrowth(90,4,93,'legacy')).toBe(92);
    expect(integrateGrowth(98,100,99,'v1.2')).toBe(99);
  });
  it('retains the carefully constructed displayed-99 reachability witness',()=>{
    let current=Object.fromEntries(WR_DEFINITION.attributes.map(a=>[a.id,a.id==='routeRunning'?94:65]));
    const ceiling=Object.fromEntries(WR_DEFINITION.attributes.map(a=>[a.id,99]));
    const plans=[['focused','bodyControl'],['focused','acceleration'],['focused','yardsAfterCatch'],['focused','release'],['focused','vertical'],['focused','awareness'],['intensive','hands'],['intensive','speed'],['focused','release']] as const;
    plans.forEach(([mode,attributeId],block)=>{for(let g=0;g<4;g++)current=develop(current,ceiling,{mode,attributeId},Math.floor(block/3)+1,{coaching:1.05,specialties:WR_DEFINITION.attributes.map(a=>a.id)},36,{}).current;});
    expect(calculateOvr(current).raw).toBeCloseTo(98.763418,5);expect(calculateOvr(current).display).toBe(99);
  });
});
