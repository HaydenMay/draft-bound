import { PositionDefinition } from './models';
export const RULES_VERSION='wr-1.2';
export const WR_DEFINITION:PositionDefinition={id:'wr',displayName:'Wide receiver',rulesVersion:RULES_VERSION,sourceCatalogId:'wr-original-75-v1',attributes:[
 {id:'speed',label:'Speed',short:'SPD',description:'Separation downfield and breakaway pace.',weight:.14},
 {id:'acceleration',label:'Acceleration',short:'ACC',description:'Burst off the line and out of breaks.',weight:.08},
 {id:'hands',label:'Hands',short:'HND',description:'Finishing catches and avoiding drops.',weight:.16},
 {id:'routeRunning',label:'Route running',short:'RTE',description:'Creating space with precise routes.',weight:.18},
 {id:'release',label:'Release',short:'REL',description:'Escaping press coverage.',weight:.12},
 {id:'vertical',label:'Vertical',short:'VRT',description:'Reaching high throws.',weight:.08},
 {id:'bodyControl',label:'Body control',short:'BCT',description:'Finishing difficult and contested catches.',weight:.10},
 {id:'yardsAfterCatch',label:'After catch',short:'YAC',description:'Turning completions into extra yards.',weight:.08},
 {id:'awareness',label:'Awareness',short:'AWR',description:'Reading coverage and earning opportunities.',weight:.06},
]};
export const POSITION_DEFINITIONS:Readonly<Record<string,PositionDefinition>>={wr:WR_DEFINITION};
