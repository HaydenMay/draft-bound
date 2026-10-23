/** Original Draft Bound artwork. 24-unit grid, clipped turns and playbook routes.
 * Pure geometry is shared by Angular, native controls, and collectible PNG export.
 * Add icons here rather than introducing emoji, font glyphs, or a second library.
 */
export interface IconPart { readonly d: string; readonly solid?: boolean }
export const ICON_PATHS = {
  advance: [{d:'M3 19h5l11-14M10 5h9v9M3 14v5'}],
  next: [{d:'M2 15h6l3-3h10M15 6l6 6-6 6'}],
  back: [{d:'M22 9h-6l-3 3H3M9 6l-6 6 6 6'}],
  reroll: [{d:'M19 8a8 8 0 1 0 1 7M19 3v5h-5M4 16h4'}],
  settings: [{d:'M3 6h10m5 0h3M3 18h3m5 0h10M3 12h3m5 0h10M13 3h5v6h-5ZM6 9h5v6H6ZM6 15h5v6H6Z'}],
  close: [{d:'M5 5h3l11 14M19 5h-3L5 19'}],
  check: [{d:'M3 12l5 6h3L21 5'}],
  lock: [{d:'M7 10V7a5 5 0 0 1 10 0v3M5 10h14v9l-2 2H7l-2-2ZM12 14v3'}],
  favorite: [{d:'M12 2l3.2 6.3 7 1-5.1 5 .9 7L12 18l-6 3.3.9-7-5.1-5 7-1Z'}],
  mark: [{d:'M12 1.5l2.8 6.8L22 6.8 17.3 12l4.7 5.2-7.2-1.5-2.8 6.8-2.8-6.8L2 17.2 6.7 12 2 6.8l7.2 1.5ZM11 8v8h2V8Z',solid:true}],
  play: [{d:'M5 3h3l12 9L8 21H5ZM9 8v8'}],
  fast: [{d:'M2 5l9 7-9 7ZM12 5l9 7-9 7ZM22 5v14'}],
  search: [{d:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM15 15l6 6M6 10h3'}],
  add: [{d:'M12 3v18M3 12h18M3 8v4h4'}],
  alert: [{d:'M10 2h4l8 17-2 3H4l-2-3ZM12 8v6M12 18h.01'}],
  balanced: [{d:'M12 21V5M8 9l4-4 4 4M4 21V11l-2 2M20 21V11l2 2M2 7h4M18 7h4'}],
  focused: [{d:'M3 21h5l8-8V3M12 7l4-4 4 4M3 16v5M4 10h4'}],
  intensive: [{d:'M4 21h5l9-9V2M14 6l4-4 4 4M2 15h5l5-5V2M8 6l4-4 4 4'}],
  transfer: [{d:'M2 19h4l12-14M13 5h5v5M3 5h4l3 4M14 16l4 3h4M18 15l4 4-4 3'}],
  download: [{d:'M12 2v13M7 10l5 5 5-5M3 16v4l2 2h14l2-2v-4'}],
  upload: [{d:'M12 15V2M7 7l5-5 5 5M3 16v4l2 2h14l2-2v-4'}],
  chevron: [{d:'M3 8h4l5 7 5-7h4'}],
} as const satisfies Record<string, readonly IconPart[]>;
export type IconName = keyof typeof ICON_PATHS;

/** Uses the same vector paths as the UI; never relies on an installed symbol font. */
export function drawIcon(ctx:CanvasRenderingContext2D,name:IconName,x:number,y:number,size:number,color:string):void {
  ctx.save();ctx.translate(x,y);ctx.scale(size/24,size/24);
  ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=1.7;ctx.lineCap='round';ctx.lineJoin='round';
  for(const part of ICON_PATHS[name] as readonly IconPart[]) {
    const path=new Path2D(part.d);
    if(part.solid)ctx.fill(path,'evenodd');else ctx.stroke(path);
  }
  ctx.restore();
}
