import {readFileSync,writeFileSync} from 'node:fs';
import {PALETTES} from '../src/app/data/palettes';
const file=new URL('../src/index.html',import.meta.url);
const script=`<script data-theme-bootstrap>
    (() => {
      let preference = 'system';
      document.documentElement.dataset.palette = 'forest';
      try { const palette=localStorage.getItem('draft-bound-palette'); document.documentElement.dataset.palette=${JSON.stringify(PALETTES.map(p=>p.id))}.includes(palette)?palette:'forest'; } catch {}
      try { preference = localStorage.getItem('draft-bound-theme') || 'system'; } catch {}
      document.documentElement.dataset.theme = preference === 'dark' || (preference !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    })();
  </script>`;
const html=readFileSync(file,'utf8');
if(!/<script(?: data-theme-bootstrap)?>[\s\S]*?<\/script>/.test(html))throw Error('Missing theme bootstrap script');
writeFileSync(file,html.replace(/<script(?: data-theme-bootstrap)?>[\s\S]*?<\/script>/,script));
