/** One shield silhouette for small honor icons, collectible seals and PNG export. */
export const SHIELD_PATH='M12 2 21 5v6c0 5.5-3.5 9-9 11-5.5-2-9-5.5-9-11V5Z';
export function stampLines(label:string):string[]{return label.length>20?['HALL OF','FAME']:label.split(' ');}
