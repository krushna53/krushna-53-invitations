import {WEDDING_TRADITIONS} from './ai-wedding-prompt.mjs';
import {ANIMATED_OPENING,continuationDirection} from './ai-continuation.mjs';
import {GENERIC_WEDDING_OPTIONS,styleWeddingOptions} from './ai-wedding-options.mjs';
const GROUPS={'journey-opening':['blessing','mehndi','haldi'],'journey-finale':['sangeet','wedding','reception']};
export const CEREMONY_NAMES={blessing:'Blessing / welcome',engagement:'Engagement',mehndi:'Mehendi',haldi:'Haldi',sangeet:'Sangeet',wedding:'Wedding',reception:'Reception',custom:'Other ritual'};
const ACTIONS={
 blessing:[['blessings','Temple / peaceful welcome','The animated couple respectfully enter the peaceful ceremonial setting and bow with folded hands. Warm lamps glow and flower garlands sway gently.'],['entrance','Floral arch entrance','The animated couple walk slowly beneath a flower-covered entrance and exchange a warm smile.']],
 mehndi:[['henna','Mehendi artist applying henna','The bride is seated with her open hands resting on a cushion. A mehendi artist carefully applies fine henna patterns to her palms while the groom sits beside her and smiles. Keep hands away from noses; nobody smells, eats or tastes henna.'],['palms','Showing finished mehendi','The seated bride gently presents her finished decorated palms to the groom and smiles. Her hands stay at chest height, away from her face.']],
 haldi:[['cheeks','Family applying haldi on cheeks','The bride and groom sit side by side. An elder gently dabs a small amount of turmeric paste onto each partner’s cheeks with fingertips; they smile and react softly. This is a seated haldi ritual, not Holi: no throwing powder, coloured water, water guns or splashing.'],['couple','Couple applying haldi gently','The seated bride gently applies a little turmeric paste to the groom’s cheek, then he applies a little to hers. Close family smile behind them. No powder throwing or water splashes.']],
 sangeet:[['dance','Couple dancing on a fairy-lit stage','The couple perform a short graceful celebratory dance on a warmly lit stage, with small coordinated steps and a gentle turn. Family clap in the background.'],['entry','Couple entrance with musicians','The couple enter a fairy-lit celebration venue together as instrumental musicians play and family welcome them with smiles.']],
 wedding:[['ritual','Traditional wedding ceremony','Show one respectful wedding ritual appropriate to the selected culture, with clear gentle movements and happy silent expressions.'],['flowers','Wedding welcome with flowers','The couple stand together beneath a flower-covered wedding arch while loved ones offer blessings and a light shower of petals.']],
 reception:[['firstdance','Couple first dance under chandeliers','Under warm chandelier light, the couple share a slow, graceful first dance in the centre of the floor. He holds her hand, she leans gently against his shoulder, and guests watch smiling from the edges.'],['entrance','Elegant reception entrance','The couple walk hand in hand into an elegant reception hall, pause beneath a floral arch and share a warm smile as a few rose petals fall.'],['portrait','Animated reception portrait','The couple pose naturally together beneath chandeliers, then turn towards each other with a gentle smile while the camera slowly pulls back.']],
};
const SETTINGS={blessing:'Carved stone entrance, warm golden dawn, brass lamps and white-and-marigold flowers',mehndi:'A lush courtyard with pink and green drapes, jasmine strings, cushions and soft lanterns',haldi:'A sunlit courtyard decorated with yellow marigolds, brass bowls and a mango-leaf toran',sangeet:'A night celebration stage with warm fairy lights, floral arches and instrumental musicians',wedding:'An elegant flower-decorated ceremonial setting appropriate to the selected culture',reception:'A grand reception hall with chandeliers, ivory roses, hanging flowers and warm golden light'};
const uniqueById=(items)=>items.filter((item,i)=>items.findIndex(other=>other.id===item.id)===i);
export function weddingActions(kind,style='Marathi wedding'){
 if(kind==='custom')return [{id:'custom',label:'Describe this ritual',description:''}];
 if(kind==='engagement')return [{id:'rings',label:'Exchange of rings',description:'The animated couple gently exchange rings, smile at each other and receive warm congratulations from loved ones.'},{id:'custom',label:'Describe my own action',description:''}];const own=styleWeddingOptions(style).actions?.[kind]||[];return uniqueById([...own,...(ACTIONS[kind]||ACTIONS.wedding)].map(([id,label,description])=>({id,label,description}))).concat({id:'custom',label:'Describe my own action',description:''});}
export function weddingSettings(kind,style='Marathi wedding'){const own=styleWeddingOptions(style).settings?.[kind]||[],generic=GENERIC_WEDDING_OPTIONS.settings[kind]||GENERIC_WEDDING_OPTIONS.settings.wedding;return uniqueById([...own,...(kind==='wedding'&&own.length?[]:generic)].map(([id,label,text])=>({id,label,text}))).concat({id:'custom',label:'Describe my own setting',text:''});}
export function weddingOutfits(kind,style='Marathi wedding'){
 const own=styleWeddingOptions(style).outfits?.[kind]||[],generic=kind==='wedding'?[]:(GENERIC_WEDDING_OPTIONS.outfits[kind]||[]);
 const choices=own.length||generic.length?[...own,...generic]:(styleWeddingOptions('Marathi wedding').outfits.wedding);
 return uniqueById(choices.map(([id,label,bride,groom])=>({id,label,bride,groom}))).concat({id:'custom',label:'Describe our outfits',bride:'',groom:''});
}
export function weddingSceneDefaults(style,ceremony){
 const tradition=WEDDING_TRADITIONS[style] || WEDDING_TRADITIONS['Marathi wedding'];
 return (GROUPS[ceremony]||[ceremony]).map(kind=>{
  const outfit=weddingOutfits(kind,style)[0],action=weddingActions(kind,style)[0],place=weddingSettings(kind,style)[0];
  return {id:kind,kind,title:CEREMONY_NAMES[kind],action:action.id,description:action.description,settingChoice:place.id,setting:place.text || SETTINGS[kind] || tradition.opening,outfit:outfit.id,brideOutfit:outfit.bride,groomOutfit:outfit.groom};
 });
}
export function weddingSceneRanges(scenes,ceremony,seconds=15){
 const original=scenes.map(s=>s.kind).join(',')===(GROUPS[ceremony]||[]).join(',');
 const weights=original&&ceremony==='journey-opening'?[4,5,6]:original&&ceremony==='journey-finale'?[4,7,4]:scenes.map(()=>1);
 const total=weights.slice(0,scenes.length).reduce((a,b)=>a+b,0);let cursor=0;
 return scenes.map((scene,i)=>{const start=cursor;cursor+=seconds*(weights[i]||1)/total;return {scene,start,end:cursor};});
}
export function weddingScenesPrompt({style,ceremony,seconds=15,scenes,layout='cinematic',previousCeremony=''}){
 const tradition=WEDDING_TRADITIONS[style] || WEDDING_TRADITIONS['Marathi wedding'];
 const continuation=previousCeremony?continuationDirection('The previous '+(previousCeremony==='journey-opening'?'opening portion':'clip')+' is complete. No earlier action instructions are supplied.')+'\n':'';
 const timeline=weddingSceneRanges(scenes,ceremony,seconds).map(({scene,start,end})=>`${Number(start.toFixed(1))}–${Number(end.toFixed(1))}s, ${scene.title || CEREMONY_NAMES[scene.kind]}: ${scene.description} Setting: ${scene.setting}. COUPLE OUTFITS FOR THIS SCENE ONLY: bride wears ${scene.brideOutfit}; groom wears ${scene.groomOutfit}. These clothes belong to the couple, not to the background guests. Apply them from the beginning of this scene; change clothes at the next scene cut, without a clothing-morph effect.`).join('\n');
 return continuation+`Create ONE ${seconds}-second portrait 9:16 cinematic stylized 3D animated ${style} invitation. Reimagine the couple as expressive illustrated 3D characters, not photographic people. Keep consistent cartoon character designs, but follow the couple outfit instructions separately for EVERY scene. Use soft rounded features, rich silk textures, gentle natural smiles, warm golden lighting, elegant floral arches, hanging jasmine, carved heritage details and restrained petal transitions. Use readable medium or full-body framing and show one clear action per scene.\nNEW SCENES ONLY, in this order:\n${timeline}\n`+(layout==='invitation'?'Composition: reserve the left 46% for a blank ivory ornamental invitation panel, framed by delicate flowers; keep the animated couple and ritual visible on the right. Never generate writing on the panel; the website adds editable ceremony titles, dates and venue.':'Composition: use the full portrait scene with the couple clearly visible and leave calm space in the upper third for editable lettering.')+` Keep rituals, decor and modest attire respectful of ${style}. No previous ceremony recap and no extra scenes. ${ANIMATED_OPENING} No generated text, logos or watermarks. No dialogue, lip-sync, singing or murmuring. Only ${tradition.music}.`;
}
export function validWeddingScenes(scenes){
 return scenes===undefined || Array.isArray(scenes)&&scenes.length>=1&&scenes.length<=6&&scenes.every(s=>s&&Object.hasOwn(CEREMONY_NAMES,s.kind)&&['description','setting','brideOutfit','groomOutfit'].every(k=>typeof s[k]==='string'&&s[k].trim()&&s[k].length<=({description:1500,setting:500,brideOutfit:240,groomOutfit:240}[k]))&&['id','title','date','time','venue'].every(k=>s[k]===undefined||typeof s[k]==='string'&&s[k].length<=({id:80,title:80,date:20,time:20,venue:160}[k]))&&(s.kind!=='custom'||!!s.title?.trim()));
}
export function newWeddingScene(kind,style){
 if(kind==='custom')return {id:crypto.randomUUID(),kind,title:'',action:'custom',description:'',settingChoice:'custom',setting:'',outfit:'custom',brideOutfit:'',groomOutfit:''};
 return {...weddingSceneDefaults(style,kind)[0],id:crypto.randomUUID()};
}
export function migrateWeddingScenes(scenes,nextStyle){
 return scenes.map(scene=>{
  if(scene.kind==='custom')return scene;
  const defaults=weddingSceneDefaults(nextStyle,scene.kind)[0];
  return {...defaults,id:scene.id || defaults.id,title:scene.title || defaults.title,date:scene.date,time:scene.time,venue:scene.venue,
   ...(scene.action==='custom'?{action:'custom',description:scene.description}:{}),
   ...(scene.settingChoice==='custom'?{settingChoice:'custom',setting:scene.setting}:{}),
   ...(scene.outfit==='custom'?{outfit:'custom',brideOutfit:scene.brideOutfit,groomOutfit:scene.groomOutfit}:{})};
 });
}
