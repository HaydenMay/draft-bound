export const INFORMATION_PAGES=['about','privacy','terms','contact'] as const;
export type InformationPageId=typeof INFORMATION_PAGES[number];
export type GameView='home'|'play'|'binder'|'entry'|'career'|'card'|InformationPageId;
export function isInformationPage(view:string):view is InformationPageId{return (INFORMATION_PAGES as readonly string[]).includes(view);}
export function parseLocation(hash:string):{view:GameView;id?:string;edition:'draft'|'career'}|null{
 const [view,id,edition]=hash.replace(/^#/,'').split('/');
 if(!view)return {view:'home',edition:'draft'};
 if(!['home','play','binder','entry','career','card',...INFORMATION_PAGES].includes(view))return null;
 return {view:view as GameView,id,edition:edition==='career'?'career':'draft'};
}
