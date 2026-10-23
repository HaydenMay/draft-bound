/** Approved Draft Bound vector pack, normalized to paths for UI and Canvas.
 * This is the authoritative catalog; no font glyphs or external icon library. */
export interface IconPart {readonly d:string;readonly solid?:boolean;readonly accent?:boolean;readonly scale?:number}
export const ICON_PATHS={
  "advance": [
    {
      "d": "M5 12h14m-7-7 7 7-7 7"
    }
  ],
  "next": [
    {
      "d": "M5 12h14m-7-7 7 7-7 7"
    }
  ],
  "back": [
    {
      "d": "M19 12H5m7-7-7 7 7 7"
    }
  ],
  "reroll": [
    {
      "d": "M20 8a8 8 0 0 0-14-2L4 8m0-4v4h4"
    },
    {
      "d": "M4 16a8 8 0 0 0 14 2l2-2m0 4v-4h-4",
      "accent": true
    }
  ],
  "settings": [
    {
      "d": "M10 2h4l.6 2.5 2.1.9 2.2-1.3 2.8 2.8-1.3 2.2.9 2.1L23 12l-1.7 2.8-.9 2.1 1.3 2.2-2.8 2.8-2.2-1.3-2.1.9L14 23h-4l-.6-2.5-2.1-.9-2.2 1.3-2.8-2.8 1.3-2.2-.9-2.1L1 12l1.7-2.8.9-2.1-1.3-2.2 2.8-2.8 2.2 1.3 2.1-.9Z",
      "scale": 0.86
    },
    {
      "d": "M15 12a3 3 0 1 0 -6 0a3 3 0 1 0 6 0Z",
      "accent": true,
      "scale": 0.86
    }
  ],
  "close": [
    {
      "d": "M5 5 19 19M19 5 5 19"
    }
  ],
  "check": [
    {
      "d": "M4 12l5 5L20 6"
    }
  ],
  "lock": [
    {
      "d": "M7 10h10a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7a2 2 0 0 1 2 -2Z"
    },
    {
      "d": "M8 10V7a4 4 0 0 1 8 0v3"
    },
    {
      "d": "M13 15a1 1 0 1 0 -2 0a1 1 0 1 0 2 0Z",
      "accent": true
    }
  ],
  "favorite": [
    {
      "d": "M12 2l3.2 6.3 7 1-5.1 5 .9 7L12 18l-6 3.3.9-7-5.1-5 7-1Z"
    }
  ],
  "mark": [
    {
      "d": "M12 1.5l2.8 6.8L22 6.8 17.3 12l4.7 5.2-7.2-1.5-2.8 6.8-2.8-6.8L2 17.2 6.7 12 2 6.8l7.2 1.5ZM11 8v8h2V8Z",
      "solid": true
    }
  ],
  "play": [
    {
      "d": "M7 4 20 12 7 20Z",
      "accent": true
    }
  ],
  "pause": [
    {
      "d": "M6 4h4v16H6ZM14 4h4v16h-4Z",
      "solid": true
    }
  ],
  "fast": [
    {
      "d": "M2 5l9 7-9 7ZM12 5l9 7-9 7ZM22 5v14"
    }
  ],
  "search": [
    {
      "d": "M17 10.5a6.5 6.5 0 1 0 -13 0a6.5 6.5 0 1 0 13 0Z"
    },
    {
      "d": "m15.5 15.5 5 5"
    }
  ],
  "add": [
    {
      "d": "M12 4v16M4 12h16"
    }
  ],
  "alert": [
    {
      "d": "M10 2h4l8 17-2 3H4l-2-3ZM12 8v6M12 18h.01"
    }
  ],
  "balanced": [
    {
      "d": "M5 20V9m-3 3 3-3 3 3M12 20V4m-3 3 3-3 3 3M19 20V9m-3 3 3-3 3 3"
    }
  ],
  "focused": [
    {
      "d": "M5 20v-7M12 20V4m-4 4 4-4 4 4M19 20v-7"
    }
  ],
  "intensive": [
    {
      "d": "M5 20h14M12 17V3M7 8l5-5 5 5"
    }
  ],
  "transfer": [
    {
      "d": "M2 19h4l12-14M13 5h5v5M3 5h4l3 4M14 16l4 3h4M18 15l4 4-4 3"
    }
  ],
  "download": [
    {
      "d": "M12 3v12m-5-5 5 5 5-5",
      "accent": true
    },
    {
      "d": "M4 17v4h16v-4"
    }
  ],
  "upload": [
    {
      "d": "M12 16V4m-5 5 5-5 5 5",
      "accent": true
    },
    {
      "d": "M4 17v4h16v-4"
    }
  ],
  "chevron": [
    {
      "d": "M5 9l7 7 7-7"
    }
  ],
  "achievements": [
    {
      "d": "M7 4h10v7a5 5 0 0 1-10 0ZM7 6H4v3a4 4 0 0 0 4 4M17 6h3v3a4 4 0 0 1-4 4M12 16v4m-5 1h10"
    },
    {
      "d": "m10 9 2-2 2 2-2 3Z",
      "accent": true
    }
  ],
  "collection": [
    {
      "d": "M5.4 6h11.2a1.4 1.4 0 0 1 1.4 1.4v12.2a1.4 1.4 0 0 1 -1.4 1.4h-11.2a1.4 1.4 0 0 1 -1.4 -1.4v-12.2a1.4 1.4 0 0 1 1.4 -1.4Z"
    },
    {
      "d": "M7 3h13v15"
    },
    {
      "d": "M15 6v5h-5V6",
      "accent": true
    }
  ],
  "delete": [
    {
      "d": "M5 7h14M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"
    },
    {
      "d": "M12 11v6",
      "accent": true
    }
  ],
  "edit": [
    {
      "d": "M13 5H5v14h14v-8"
    },
    {
      "d": "m10 14 9-9 2 2-9 9-3 1Z",
      "accent": true
    }
  ],
  "external-link": [
    {
      "d": "M12 5H5v14h14v-7"
    },
    {
      "d": "M13 4h7v7M20 4l-9 9",
      "accent": true
    }
  ],
  "filter": [
    {
      "d": "M4 6h16M4 12h16M4 18h16"
    },
    {
      "d": "M11 6a2 2 0 1 0 -4 0a2 2 0 1 0 4 0Z",
      "accent": true
    },
    {
      "d": "M17 12a2 2 0 1 0 -4 0a2 2 0 1 0 4 0Z"
    },
    {
      "d": "M13 18a2 2 0 1 0 -4 0a2 2 0 1 0 4 0Z",
      "accent": true
    }
  ],
  "forward": [
    {
      "d": "M5 12h14m-7-7 7 7-7 7"
    }
  ],
  "home": [
    {
      "d": "M3.5 10.5 12 3l8.5 7.5V21H3.5Z",
      "accent": true
    },
    {
      "d": "M9.5 21v-7h5v7"
    }
  ],
  "info": [
    {
      "d": "M21 12a9 9 0 1 0 -18 0a9 9 0 1 0 18 0Z"
    },
    {
      "d": "M12 11v6M12 7v.5",
      "accent": true
    }
  ],
  "menu": [
    {
      "d": "M4 6h16M4 12h16M4 18h16"
    }
  ],
  "new-prospect": [
    {
      "d": "M5 3h9l4 4v5M14 3v5h4M5 3v18h8M9 12h4"
    },
    {
      "d": "M18 15v7M14.5 18.5h7",
      "accent": true
    }
  ],
  "profile": [
    {
      "d": "M16 7a4 4 0 1 0 -8 0a4 4 0 1 0 8 0Z"
    },
    {
      "d": "M4 21v-2a8 8 0 0 1 16 0v2"
    }
  ],
  "randomize": [
    {
      "d": "M3 6h3c5 0 7 12 12 12h3m-4-4 4 4-4 4",
      "accent": true
    },
    {
      "d": "M3 18h3c2.5 0 4-2 5-4M14 8c1-1 2-2 4-2h3m-4-4 4 4-4 4"
    }
  ],
  "share": [
    {
      "d": "M8 12 17 6M8 12l9 6",
      "accent": true
    },
    {
      "d": "M8.3 12a2.3 2.3 0 1 0 -4.6 0a2.3 2.3 0 1 0 4.6 0Z"
    },
    {
      "d": "M21.3 5a2.3 2.3 0 1 0 -4.6 0a2.3 2.3 0 1 0 4.6 0Z"
    },
    {
      "d": "M21.3 19a2.3 2.3 0 1 0 -4.6 0a2.3 2.3 0 1 0 4.6 0Z"
    }
  ],
  "sort": [
    {
      "d": "M7 20V4m-4 4 4-4 4 4",
      "accent": true
    },
    {
      "d": "M17 4v16m-4-4 4 4 4-4"
    }
  ],
  "stats": [
    {
      "d": "M4 20V14h3v6M10.5 20V9h3v11M17 20V4h3v16",
      "accent": true
    },
    {
      "d": "M3 21h18"
    }
  ],
  "sync": [
    {
      "d": "M20 8a8 8 0 0 0-14-2L4 8m0-4v4h4"
    },
    {
      "d": "M4 16a8 8 0 0 0 14 2l2-2m0 4v-4h-4",
      "accent": true
    }
  ]
} as const satisfies Record<string,readonly IconPart[]>;
export type IconName=keyof typeof ICON_PATHS;
export function iconTransform(part:IconPart):string|null {return part.scale?'translate('+12*(1-part.scale)+' '+12*(1-part.scale)+') scale('+part.scale+')':null;}
export function drawIcon(ctx:CanvasRenderingContext2D,name:IconName,x:number,y:number,size:number,color:string,accent=color):void {
 ctx.save();ctx.translate(x,y);ctx.scale(size/24,size/24);ctx.lineWidth=1.9;ctx.lineCap='round';ctx.lineJoin='round';
 for(const part of ICON_PATHS[name] as readonly IconPart[]){ctx.save();if(part.scale){ctx.translate(12*(1-part.scale),12*(1-part.scale));ctx.scale(part.scale,part.scale);}ctx.strokeStyle=ctx.fillStyle=part.accent?accent:color;const shape=new Path2D(part.d);if(part.solid)ctx.fill(shape,'evenodd');else ctx.stroke(shape);ctx.restore();}ctx.restore();
}
