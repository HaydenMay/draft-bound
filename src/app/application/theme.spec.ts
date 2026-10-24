import {describe,it,expect} from 'vitest';
import {resolveTheme,readThemePreference,readPalette} from './theme';
import {PALETTES} from '../data/palettes';
import {readFileSync} from 'node:fs';
describe('interface theme',()=>{
 it('includes all researched palettes without removing saved legacy identities or duplicating Navy Gold',()=>{
  expect(PALETTES).toHaveLength(16);expect(new Set(PALETTES.map(p=>p.id)).size).toBe(16);
  for(const id of ['forest','copper','navy','charcoal','teal','midnight-blues','burgundy-bronze','champion-royale','deep-sea','rustic-charm','dark-sunset','coastal-vibes','vintage-sunset','summit-ice','cobalt-crown','garnet-legacy'])expect(readPalette(id)).toBe(id);
  const boot=readFileSync('src/index.html','utf8');for(const p of PALETTES)expect(boot).toContain(JSON.stringify(p.id));
 });
 it('follows the device only when System is selected',()=>{expect(resolveTheme('system',true)).toBe('dark');expect(resolveTheme('system',false)).toBe('light');expect(resolveTheme('light',true)).toBe('light');expect(resolveTheme('dark',false)).toBe('dark');});
 it('defaults old saves to System and rejects unknown theme values',()=>{expect(readThemePreference(undefined)).toBe('system');expect(readThemePreference('dark')).toBe('dark');expect(readThemePreference('sepia')).toBe('system');});
 it('keeps palette choice independent of light/dark appearance and defaults legacy palettes',()=>{
  expect(readPalette(undefined)).toBe('forest');expect(readPalette('not-a-palette')).toBe('forest');
  for(const id of ['forest','copper','navy','charcoal','teal'])expect(readPalette(id)).toBe(id);
  expect(resolveTheme('light',true)).toBe('light');
 });
});
