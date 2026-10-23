import {readColor} from '../shared/colors';
import {ThemePreference} from '../domain/models';

export function readThemePreference(value:unknown):ThemePreference {
 return value==='light'||value==='dark'?value:'system';
}

export function resolveTheme(preference:ThemePreference,systemDark:boolean):'light'|'dark' {
 return preference==='system'?(systemDark?'dark':'light'):preference;
}

export function cachedThemePreference():ThemePreference {
 try{return readThemePreference(localStorage.getItem('draft-bound-theme'));}catch{return 'system';}
}

export function applyTheme(preference:ThemePreference,systemDark:boolean):void {
 const theme=resolveTheme(preference,systemDark);
 document.documentElement.dataset['theme']=theme;
 document.querySelector('meta[name="theme-color"]')?.setAttribute('content',readColor('--paper'));
 try{localStorage.setItem('draft-bound-theme',preference);}catch{/* IndexedDB remains the authoritative settings store. */}
}
