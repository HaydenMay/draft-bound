import {mkdirSync,writeFileSync} from 'node:fs';
import {ICON_PATHS,IconPart} from '../src/app/shared/icon-paths';

const directory=new URL('../public/assets/icons/',import.meta.url);
mkdirSync(directory,{recursive:true});
for(const [name,parts] of Object.entries(ICON_PATHS)) {
  const paths=(parts as readonly IconPart[]).map(part=>`<path d="${part.d}" fill="${part.solid?'#788474':'none'}"${part.solid?' stroke="none"':''}/>`).join('');
  writeFileSync(new URL(`${name}.svg`,directory),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill-rule="evenodd" stroke="#788474" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>\n`);
}
