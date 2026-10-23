const images=new Map<string,Promise<HTMLImageElement>>();
/** Standalone SVG images need resolved colors; DOM custom properties do not cross into them. */
export function loadBrandImage(primary:string,accent:string):Promise<HTMLImageElement>{
 const key=primary+'|'+accent,existing=images.get(key);if(existing)return existing;
 const result=(async()=>{
  const response=await fetch(new URL('assets/brand/db-mark.svg',document.baseURI));
  if(!response.ok)throw Error('The card logo could not be loaded.');
  const source=(await response.text()).replaceAll('var(--brand-accent, currentColor)',accent).replaceAll('currentColor',primary);
  const url=URL.createObjectURL(new Blob([source],{type:'image/svg+xml'}));
  try{const image=new Image();image.src=url;await image.decode();return image;}finally{URL.revokeObjectURL(url);}
 })();images.set(key,result);result.catch(()=>images.delete(key));
 if(images.size>12)images.delete(images.keys().next().value!);
 return result;
}
