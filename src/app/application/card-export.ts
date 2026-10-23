import {CardViewModel} from '../domain/models';
export function downloadBlob(blob:Blob,name:string):void{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
/** Render the same card data and original artwork at a fixed, portable resolution. */
export async function renderCard(card:CardViewModel):Promise<Blob>{
 await document.fonts.ready;const canvas=document.createElement('canvas');canvas.width=900;canvas.height=1350;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Card export is unavailable in this browser.');
 const image=new Image();image.src=new URL(card.art,document.baseURI).href;await image.decode();
 const colors:Record<string,string>={classic:'#f4f0e4',silver:'#d4dce1',gold:'#e8c678',training:'#b5c4a1',transfer:'#92bdc2',legend:'#b0a5ce'};
 ctx.fillStyle=colors[card.frame]??colors['classic'];ctx.fillRect(0,0,900,1350);ctx.strokeStyle=card.colors[0];ctx.lineWidth=18;ctx.strokeRect(19,19,862,1312);
 ctx.fillStyle='#182620';ctx.font='700 58px "Barlow Condensed",sans-serif';ctx.fillText('DB',48,88);ctx.font='600 24px "DM Sans",sans-serif';ctx.fillText(card.edition==='career'?'CAREER COLLECTION':'DRAFT COLLECTION',150,75);ctx.font='700 68px "Barlow Condensed",sans-serif';ctx.textAlign='right';ctx.fillText(String(card.ovr),845,85);ctx.textAlign='left';
 const x=45,y=116,w=810,h=820,ratio=Math.max(w/image.width,h/image.height),dw=image.width*ratio,dh=image.height*ratio;
 ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.drawImage(image,x+(w-dw)/2,y+(h-dh)*.2,dw,dh);
 const gradient=ctx.createLinearGradient(0,680,0,936);gradient.addColorStop(0,'transparent');gradient.addColorStop(1,'#071914');ctx.fillStyle=gradient;ctx.fillRect(x,680,w,256);
 if(card.foil){const foil=ctx.createLinearGradient(0,0,900,1350);foil.addColorStop(0,'#ffffff00');foil.addColorStop(.4,'#adf6e644');foil.addColorStop(.52,'#ffffff66');foil.addColorStop(.65,'#e7b4fa33');foil.addColorStop(1,'#ffffff00');ctx.fillStyle=foil;ctx.fillRect(x,y,w,h);}
 ctx.fillStyle='#fff8e9';ctx.font='600 26px "DM Sans",sans-serif';ctx.fillText(card.title.toUpperCase(),74,820);ctx.font='700 62px "Barlow Condensed",sans-serif';
 const words=card.name.split(' ');let line='',lineY=885;for(const word of words){if(ctx.measureText(line+word).width>735&&line){ctx.fillText(line.trim(),74,lineY-58);line='';}line+=word+' ';}ctx.fillText(line.trim(),74,lineY);
 if(card.stamp){ctx.save();ctx.translate(690,220);ctx.rotate(.12);ctx.fillStyle='#e7c16a';ctx.beginPath();ctx.arc(0,0,108,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#1c302a';ctx.lineWidth=4;ctx.stroke();ctx.fillStyle='#1c302a';ctx.textAlign='center';ctx.font='700 25px "Barlow Condensed",sans-serif';const label=card.stamp.length>20?['HALL OF','FAME']:card.stamp.split(' ');label.forEach((s,i)=>ctx.fillText(s,0,(i-(label.length-1)/2)*28+7));ctx.restore();}
 ctx.fillStyle=card.colors[0];ctx.font='700 32px "Barlow Condensed",sans-serif';ctx.fillText(card.school.toUpperCase().slice(0,40),55,985);ctx.fillStyle='#182620';ctx.font='700 34px "Barlow Condensed",sans-serif';ctx.fillText(card.draftLabel.slice(0,53),55,1030);ctx.font='400 23px "DM Sans",sans-serif';ctx.fillText((card.team||card.subtitle).slice(0,55),55,1069);
 const stats=card.statLines.slice(0,4),cell=790/Math.max(1,stats.length);stats.forEach((stat,i)=>{ctx.textAlign='center';ctx.font='700 53px "Barlow Condensed",sans-serif';ctx.fillText(stat.value,55+cell*(i+.5),1170);ctx.font='600 19px "DM Sans",sans-serif';ctx.fillText(stat.label.toUpperCase(),55+cell*(i+.5),1205);});ctx.textAlign='left';ctx.strokeStyle='#18262055';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(55,1250);ctx.lineTo(845,1250);ctx.stroke();ctx.font='600 20px "DM Sans",sans-serif';ctx.fillText('DRAFT BOUND',55,1290);ctx.textAlign='right';ctx.fillText(card.sceneName.toUpperCase(),845,1290);
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Could not export card.')),'image/png'));
}

