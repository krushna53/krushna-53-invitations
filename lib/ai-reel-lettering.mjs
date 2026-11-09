export const DEFAULT_LETTERING={heading:58,address:36,font:'Georgia'};
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
// "2026-12-24" -> "24th December 2026"; any other text is shown unchanged.
export function formatReelDate(value){
 const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || '').trim());
 if(!m)return String(value || '').trim();
 const day=Number(m[3]),month=Number(m[2]);
 if(month<1||month>12||day<1||day>31)return m[0];
 const suffix=day%100>=11&&day%100<=13?'th':({1:'st',2:'nd',3:'rd'}[day%10] || 'th');
 return day+suffix+' '+MONTHS[month-1]+' '+m[1];
}
// "19:30" -> "7:30 PM", "00:15" -> "12:15 AM"; any other text is shown unchanged.
export function formatReelTime(value){
 const m=/^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(String(value || '').trim());
 if(!m)return String(value || '').trim();
 const hour=Number(m[1]);if(hour>23||Number(m[2])>59)return m[0];
 return (hour%12 || 12)+':'+m[2]+' '+(hour<12?'AM':'PM');
}
export function reelEditKey({clips=[],...settings}){
 return JSON.stringify({...settings,clips:clips.map(c=>({videoUrl:c.videoUrl,ceremony:c.ceremony,editableDetails:c.editableDetails,storyScene:c.storyScene,weddingScenes:c.weddingScenes,weddingLayout:c.weddingLayout}))});
}
function lines(ctx,text,width){
 const words=String(text || '').trim().split(/\s+/),result=[];let line='';
 for(const word of words){const next=line?line+' '+word:word;if(line&&ctx.measureText(next).width>width){result.push(line);line=word;}else line=next;}if(line)result.push(line);return result;
}
export function addressLines(ctx,text,width){
 const value=String(text || '').trim();if(!value)return [];
 const target=value.length>65?3:value.length>16?2:1;
 const balancedWidth=Math.min(width,Math.max(Math.min(width,160),ctx.measureText(value).width/target*(target===2?1.25:1.12)));
 let wrapped=lines(ctx,value,balancedWidth);
 if(wrapped.length>3)wrapped=lines(ctx,value,width);
 // Do not silently discard lines of a long address.
 return wrapped;
}
// Let each ritual play before its invitation copy appears. The action is visible
// first, then the ceremony details fade in during the same scene.
export function occasionRevealProgress(progress){
 const value=Number(progress);
 if(!Number.isFinite(value)||value<=0.3)return 0;
 return Math.min(1,(value-0.3)/0.14);
}
export function drawReelLettering(ctx,{event,names,look='gold',lettering=DEFAULT_LETTERING,panel=false,reveal=1}){
 const opacity=Math.max(0,Math.min(1,Number(reveal)));
 if(opacity===0)return;
 const font=['Georgia','Arial','Trebuchet MS'].includes(lettering.font)?lettering.font:'Georgia';
 const heading=[48,58,68].includes(Number(lettering.heading))?Number(lettering.heading):58;
 const address=[30,36,42].includes(Number(lettering.address))?Number(lettering.address):36;
 const x=panel?197:360,width=panel?280:650;let y=panel?415:100;
 ctx.save();
 ctx.globalAlpha=opacity;
 if(panel){ctx.fillStyle='rgba(255,248,232,.96)';ctx.fillRect(25,290,344,830);ctx.strokeStyle='#b99053';ctx.lineWidth=3;ctx.strokeRect(37,304,320,802);ctx.fillStyle=look==='gold'?'#71322b':'#292044';}
 else{const gradient=ctx.createLinearGradient(0,0,0,610);gradient.addColorStop(0,'#140b19dd');gradient.addColorStop(1,'#140b1900');ctx.fillStyle=gradient;ctx.fillRect(0,0,720,610);ctx.fillStyle=look==='gold'?'#ffe3a0':'#ffffff';ctx.shadowColor='#000';ctx.shadowBlur=8;}
 ctx.textAlign='center';
 function block(text,size,maxLines){ctx.font=size+'px '+font;const wrapped=lines(ctx,text,width);for(const line of wrapped.slice(0,maxLines)){ctx.fillText(line,x,y,width);y+=size*1.2;}y+=14;}
 block(event.title,heading,2);block(names,34,panel?3:2);
 block([formatReelDate(event.date),formatReelTime(event.time)].filter(Boolean).join(' · '),30,panel?2:1);
 ctx.font=address+'px '+font;
 let venueLines=addressLines(ctx,event.venue,width);
 if(panel&&venueLines.length>3){
  venueLines=addressLines(ctx,event.venue,650);
  const lineHeight=address*1.2,top=Math.max(700,1230-venueLines.length*lineHeight);
  ctx.fillStyle='rgba(20,11,25,.85)';ctx.fillRect(16,top-address-12,688,venueLines.length*lineHeight+address+24);
  ctx.fillStyle='#fff5df';ctx.shadowColor='#000';ctx.shadowBlur=5;
  venueLines.forEach((line,i)=>ctx.fillText(line,360,top+i*lineHeight,650));
 }else{venueLines.forEach(line=>{ctx.fillText(line,x,y,width);y+=address*1.2;});}
 ctx.restore();
}
