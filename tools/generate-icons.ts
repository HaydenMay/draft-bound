import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {ICON_PATHS,IconPart,iconTransform} from '../src/app/shared/icon-paths';

const palette=readFileSync(new URL('../src/colors.css',import.meta.url),'utf8');
const ink=palette.match(/--icon-asset-ink:\s*(#[0-9a-f]{6});/i)?.[1];
const accent=palette.match(/--orange:\s*(#[0-9a-f]{6});/i)?.[1]??ink;
if(!ink)throw Error('Define --icon-asset-ink as a six-digit hex color in src/colors.css.');
const directory=new URL('../public/assets/icons/',import.meta.url);
mkdirSync(directory,{recursive:true});
for(const [name,parts] of Object.entries(ICON_PATHS)) {
  const paths=(parts as readonly IconPart[]).map(part=>`<path d="${part.d}" fill="${part.solid?(part.accent?accent:ink):'none'}" stroke="${part.solid?'none':part.accent?accent:ink}"${part.scale?` transform="${iconTransform(part)}"`:''}/>`).join('');
  writeFileSync(new URL(`${name}.svg`,directory),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill-rule="evenodd" stroke="${ink}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>\n`);
}

// Native select backgrounds cannot inherit currentColor across an SVG image boundary.
for(const appearance of ['light','dark']){
 const color=palette.match(new RegExp(`--select-asset-${appearance}:\\s*(#[0-9a-f]{6});`,'i'))?.[1];
 if(!color)throw Error(`Missing select asset color for ${appearance}.`);
 const paths=ICON_PATHS.chevron.map(part=>`<path d="${part.d}" fill="none" stroke="${color}"/>`).join('');
 writeFileSync(new URL(`chevron-${appearance}.svg`,directory),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>\n`);
}
