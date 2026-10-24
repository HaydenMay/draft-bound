export const PALETTES=[
 {id:'forest',name:'Forest & Coral'},
 {id:'copper',name:'Midnight copper'},
 {id:'navy',name:'Navy Gold'},
 {id:'charcoal',name:'Charcoal & orange'},
 {id:'teal',name:'Deep teal & cream'},
 {id:'midnight-blues',name:'Midnight Blues Mystery'},
 {id:'burgundy-bronze',name:'Burgundy Bronze'},
 {id:'champion-royale',name:'Champion Royale'},
 {id:'deep-sea',name:'Deep Sea'},
 {id:'rustic-charm',name:'Rustic Charm'},
 {id:'dark-sunset',name:'Dark Sunset'},
 {id:'coastal-vibes',name:'Coastal Vibes'},
 {id:'vintage-sunset',name:'Vintage Sunset'},
 {id:'summit-ice',name:'Summit Ice'},
 {id:'cobalt-crown',name:'Cobalt Crown'},
 {id:'garnet-legacy',name:'Garnet Legacy'},
] as const;
export type PaletteId=typeof PALETTES[number]['id'];
