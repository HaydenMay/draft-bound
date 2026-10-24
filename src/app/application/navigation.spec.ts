import {it,expect} from 'vitest';
import {parseLocation} from './navigation';
it('supports a refreshable achievements deep link without an entry identifier',()=>{expect(parseLocation('#achievements')).toEqual({view:'achievements',edition:'draft'});});
