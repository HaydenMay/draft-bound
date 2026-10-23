/** Resolve a palette token for browser APIs that cannot consume CSS var() directly. */
export function readColor(name:`--${string}`,styles:CSSStyleDeclaration=getComputedStyle(document.documentElement)):string {
  const value=styles.getPropertyValue(name).trim();
  if(!value)throw Error(`Missing color ${name} in src/colors.css.`);
  return value;
}
