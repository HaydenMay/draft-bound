import {describe,it,expect} from 'vitest';
import {resolveTheme,readThemePreference} from './theme';
describe('interface theme',()=>{
 it('follows the device only when System is selected',()=>{expect(resolveTheme('system',true)).toBe('dark');expect(resolveTheme('system',false)).toBe('light');expect(resolveTheme('light',true)).toBe('light');expect(resolveTheme('dark',false)).toBe('dark');});
 it('defaults old saves to System and rejects unknown theme values',()=>{expect(readThemePreference(undefined)).toBe('system');expect(readThemePreference('dark')).toBe('dark');expect(readThemePreference('sepia')).toBe('system');});
});
