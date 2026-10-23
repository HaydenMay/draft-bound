const FIRST=['Adrian','Andre','Ashton','Blake','Bryce','Cameron','Carter','Darius','Devin','Dominic','Elias','Elijah','Evan','Isaiah','Jalen','Jamal','Jayden','Jordan','Julian','Kai','Kendrick','Logan','Malik','Marcus','Mason','Micah','Miles','Noah','Nolan','Quentin','Rashad','Roman','Tariq','Theo','Trey','Tyler'];
const LAST=['Banks','Bennett','Brooks','Caldwell','Carter','Coleman','Cross','Daniels','Ellis','Foster','Grant','Griffin','Harris','Hayes','Henderson','Holloway','Jackson','James','Knight','Lawson','Marshall','Mercer','Mitchell','Monroe','Morgan','Parker','Pierce','Reed','Reynolds','Rhodes','Robinson','Shaw','Simmons','Sullivan','Walker','Warren'];
/** A separate cosmetic seed. Never accepts or mutates a gameplay Random instance. */
export function prospectName(seed:number,previous=''):string {
 const first=FIRST[(seed>>>0)%FIRST.length];let last=Math.floor((seed>>>0)/FIRST.length)%LAST.length;
 if(`${first} ${LAST[last]}`===previous)last=(last+1)%LAST.length;
 return `${first} ${LAST[last]}`;
}
