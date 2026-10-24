import {loadBrandImage} from './brand-image';
import {readColor} from '../shared/colors';
import {SHIELD_PATH,stampLines} from '../shared/badge-geometry';
import {CardViewModel} from '../domain/models';
export function downloadBlob(blob:Blob,name:string):void{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
/** Render the same card data and original artwork at a fixed, portable resolution. */
export async function renderCard(card:CardViewModel):Promise<Blob>{
 const palette=getComputedStyle(document.documentElement);const color=(name:`--${string}`)=>readColor(name,palette);
 await document.fonts.ready;const canvas=document.createElement('canvas');canvas.width=900;canvas.height=1350;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Card export is unavailable in this browser.');
 const image=new Image();image.src=new URL(card.art,document.baseURI).href;await image.decode();
 const colors:Record<string,string>={classic:color('--export-frame-classic'),silver:color('--export-frame-silver'),gold:color('--export-frame-gold'),training:color('--export-frame-training'),transfer:color('--export-frame-transfer'),legend:color('--export-frame-legend')};
 ctx.fillStyle=colors[card.frame]??colors['classic'];ctx.fillRect(0,0,900,1350);ctx.strokeStyle=card.colors[0];ctx.lineWidth=18;ctx.strokeRect(19,19,862,1312);
 ctx.fillStyle=color('--export-ink');const brand=await loadBrandImage(color('--print-brand-primary'),color('--print-brand-accent'));ctx.drawImage(brand,48,34,88,54);ctx.font='600 24px "DM Sans",sans-serif';ctx.fillText(card.edition==='career'?'CAREER COLLECTION':'DRAFT COLLECTION',150,75);ctx.font='700 68px "Barlow Condensed",sans-serif';ctx.textAlign='right';ctx.fillText(String(card.ovr),845,85);ctx.textAlign='left';
 const x=45,y=116,w=810,h=820,ratio=Math.max(w/image.width,h/image.height),dw=image.width*ratio,dh=image.height*ratio;
 ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.drawImage(image,x+(w-dw)/2,y+(h-dh)*.2,dw,dh);
 const gradient=ctx.createLinearGradient(0,680,0,936);gradient.addColorStop(0,'transparent');gradient.addColorStop(1,color('--export-vignette'));ctx.fillStyle=gradient;ctx.fillRect(x,680,w,256);
 if(card.foil){const foil=ctx.createLinearGradient(0,0,900,1350);foil.addColorStop(0,color('--export-foil-clear'));foil.addColorStop(.4,color('--export-foil-green'));foil.addColorStop(.52,color('--export-foil-white'));foil.addColorStop(.65,color('--export-foil-pink'));foil.addColorStop(1,color('--export-foil-clear'));ctx.fillStyle=foil;ctx.fillRect(x,y,w,h);}
 ctx.fillStyle=color('--export-on-art');ctx.font='600 26px "DM Sans",sans-serif';ctx.fillText(card.title.toUpperCase(),74,820);ctx.font='700 62px "Barlow Condensed",sans-serif';
 const words=card.name.split(' ');let line='',lineY=885;for(const word of words){if(ctx.measureText(line+word).width>735&&line){ctx.fillText(line.trim(),74,lineY-58);line='';}line+=word+' ';}ctx.fillText(line.trim(),74,lineY);
 if(card.stamp){ctx.save();ctx.translate(690,220);ctx.rotate(.12);ctx.save();ctx.scale(10,10);ctx.translate(-12,-12);const shield=new Path2D(SHIELD_PATH);ctx.fillStyle=color('--export-stamp-paper');ctx.strokeStyle=color('--print-stamp-border');ctx.lineWidth=.4;ctx.fill(shield);ctx.stroke(shield);ctx.restore();ctx.fillStyle=color('--export-stamp-ink');ctx.textAlign='center';ctx.font='700 25px "DM Sans",sans-serif';const label=stampLines(card.stamp);label.forEach((s,i)=>ctx.fillText(s,0,(i-(label.length-1)/2)*28));ctx.restore();}
 ctx.restore();
 ctx.fillStyle=card.colors[0];ctx.font='700 32px "Barlow Condensed",sans-serif';ctx.fillText(card.school.toUpperCase().slice(0,40),55,985);ctx.fillStyle=color('--export-ink');ctx.font='700 34px "Barlow Condensed",sans-serif';ctx.fillText(card.draftLabel.slice(0,53),55,1030);ctx.font='400 23px "DM Sans",sans-serif';ctx.fillText((card.team||card.subtitle).slice(0,55),55,1069);
 const stats=card.statLines.slice(0,4),cell=790/Math.max(1,stats.length);stats.forEach((stat,i)=>{ctx.textAlign='center';ctx.font='700 53px "Barlow Condensed",sans-serif';ctx.fillText(stat.value,55+cell*(i+.5),1170);ctx.font='600 19px "DM Sans",sans-serif';ctx.fillText(stat.label.toUpperCase(),55+cell*(i+.5),1205);});ctx.textAlign='left';ctx.strokeStyle=color('--export-rule');ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(55,1250);ctx.lineTo(845,1250);ctx.stroke();ctx.font='600 20px "DM Sans",sans-serif';ctx.fillText('DRAFT BOUND',55,1290);ctx.textAlign='right';ctx.fillText(card.sceneName.toUpperCase(),845,1290);
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Could not export card.')),'image/png'));
}

