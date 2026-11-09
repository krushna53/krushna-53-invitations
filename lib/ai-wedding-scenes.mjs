import {WEDDING_TRADITIONS} from './ai-wedding-prompt.mjs';
import {ANIMATED_OPENING,continuationDirection} from './ai-continuation.mjs';
import {GENERIC_WEDDING_OPTIONS,styleWeddingOptions} from './ai-wedding-options.mjs';
const GROUPS={'journey-opening':['blessing','mehndi','haldi'],'journey-finale':['sangeet','wedding','reception']};
export const CEREMONY_NAMES={blessing:'Blessing / welcome',engagement:'Engagement',mehndi:'Mehendi',haldi:'Haldi',sangeet:'Sangeet',wedding:'Wedding',reception:'Reception',sagan:'Sagan / Roka',cocktail:'Cocktail party',baraat:'Baraat',custom:'Other ritual'};
const ACTIONS={
 blessing:[['blessings','Temple / peaceful welcome','The animated couple respectfully enter the peaceful ceremonial setting and bow with folded hands. Warm lamps glow and flower garlands sway gently.'],['entrance','Floral arch entrance','The animated couple walk slowly beneath a flower-covered entrance and exchange a warm smile.']],
 mehndi:[['henna','Mehendi artist applying henna','The bride is seated with her open hands resting on a cushion. A mehendi artist carefully applies fine henna patterns to her palms while the groom sits beside her and smiles. Keep hands away from noses; nobody smells, eats or tastes henna.'],['palms','Showing finished mehendi','The seated bride gently presents her finished decorated palms to the groom and smiles. Her hands stay at chest height, away from her face.']],
 haldi:[['cheeks','Family applying haldi on cheeks','The bride and groom sit side by side. An elder gently dabs a small amount of turmeric paste onto each partner’s cheeks with fingertips; they smile and react softly. This is a seated haldi ritual, not Holi: no throwing powder, coloured water, water guns or splashing.'],['couple','Couple applying haldi gently','The seated bride gently applies a little turmeric paste to the groom’s cheek, then he applies a little to hers. Close family smile behind them. No powder throwing or water splashes.']],
 sangeet:[['dance','Couple dancing on a fairy-lit stage','The couple perform a short graceful celebratory dance on a warmly lit stage, with small coordinated steps and a gentle turn. Family clap in the background.'],['entry','Couple entrance with musicians','The couple enter a fairy-lit celebration venue together as instrumental musicians play and family welcome them with smiles.']],
 wedding:[['ritual','Traditional wedding ceremony','Show one respectful wedding ritual appropriate to the selected culture, with clear gentle movements and happy silent expressions.'],['flowers','Wedding welcome with flowers','The couple stand together beneath a flower-covered wedding arch while loved ones offer blessings and a light shower of petals.']],
 reception:[['firstdance','Couple first dance under chandeliers','Under warm chandelier light, the couple share a slow, graceful first dance in the centre of the floor. He holds her hand, she leans gently against his shoulder, and guests watch smiling from the edges.'],['entrance','Elegant reception entrance','The couple walk hand in hand into an elegant reception hall, pause beneath a floral arch and share a warm smile as a few rose petals fall.'],['portrait','Animated reception portrait','The couple pose naturally together beneath chandeliers, then turn towards each other with a gentle smile while the camera slowly pulls back.']],
};
Object.assign(ACTIONS,{
 sagan:[['tilak','Elders bless the couple','Elders lovingly place a red tilak on the groom’s forehead and offer a shagun thali with sweets and a coconut; the couple fold their hands and smile warmly at the family.'],['gifts','Exchange of shagun gifts','Both families exchange decorated shagun gift trays and sweets, embrace warmly, and the couple share a shy, happy smile in the middle.']],
 cocktail:[['toast','Toast with friends','Under warm fairy lights at an elegant evening party, the couple raise their glasses in a cheerful toast with friends, laugh together and share a happy glance.'],['dance','Couple dance','The couple share a playful, graceful dance in the middle of the party; he twirls her once, she laughs, and friends cheer and clap around them under glowing lights.'],['entry','Grand entry','The couple walk into the evening party hand in hand as friends turn, cheer and raise their glasses; the couple pause, smile at everyone and then at each other as soft sparkles of light glow around them.'],['romantic','Romantic moment','At a quiet corner of the party under fairy lights, the couple stand close together, she rests her hand on his shoulder, and they share a warm, loving look while friends celebrate softly in the background.']],
 baraat:[['horse','Groom arrives on a decorated horse','The groom arrives on a decorated white horse as family dance joyfully around him to dhol beats; he smiles and waves while marigold petals fly in the air.'],['welcome','Baraat welcomed at the venue','The baraat reaches the decorated venue gate; the bride’s family welcome the smiling groom with folded hands, a garland and a shower of petals.']],
});

// More ready-made scene options per ceremony. The first option of each ceremony stays its default.
ACTIONS.engagement=[['rings','Exchange of rings','The couple stand facing each other on a softly lit, flower-decorated stage. He gently slips a ring onto her finger and she smiles shyly; then she places a ring on his finger. Family around them clap warmly and shower a few rose petals as the couple share a joyful, loving look.'],['showrings','Showing the rings','After exchanging rings, the couple turn towards the family with bright smiles and gently raise their hands to show the rings while loved ones cheer and clap.'],['kneel','Ring on one knee','On the decorated stage he kneels and offers a ring; she covers her mouth in happy surprise, nods, and family cheer as he slips the ring onto her finger.'],['hug','Warm embrace','After the ring exchange the couple share a warm embrace as family and friends cheer and shower soft rose petals around them.']];
const MORE_ACTIONS={
 blessing:[['aarti','Aarti together','The couple stand together before a softly glowing diya, fold their hands and gently offer an aarti while elders smile and bless them.'],['elders','Blessings from elders','The couple bend to touch their elders\u2019 feet; the elders place their hands on the couple\u2019s heads in blessing and everyone shares a warm smile.']],
 sagan:[['sweets','Feeding sweets','The couple feed each other a small piece of sweet with shy smiles while both families laugh and clap around them.']],
 mehndi:[['dance','Friends dancing around the bride','Friends dance happily around the seated bride in a colourful courtyard while she claps along, her palms decorated with fresh henna, and the groom smiles from beside her.']],
 haldi:[['petals','Petal shower after haldi','After the haldi ritual, family gently shower yellow marigold petals over the seated couple; the couple laugh and look at each other, cheeks lightly touched with turmeric. No powder throwing or water.'],['cousins','Cousins join the fun','Cousins gather around the seated couple, laughing and gently dabbing a little turmeric on each other\u2019s cheeks while the couple smile happily in the middle. No powder throwing or water.']],
 sangeet:[['duet','Couple dance duet','The couple perform a short romantic dance duet under a soft spotlight, ending with a gentle twirl as everyone cheers.'],['family','Family dance performance','Both families perform a joyful group dance on the stage while the couple watch from the front, laughing and clapping, then join in for the last steps.']],
 wedding:[['varmala','Varmala','The couple face each other on a flower-covered platform and exchange garlands as family cheer and shower petals.'],['mandap','Seated at the mandap','The couple sit side by side at the decorated mandap with folded hands, glancing at each other with calm, happy smiles as elders bless them.']],
 reception:[['stage','Greeting guests on stage','The couple stand together on a flower-decorated reception stage; close family come up to greet them, and the couple share a happy, relaxed smile as the camera slowly pulls back.'],['cake','Cutting the cake','The couple cut a tall white wedding cake together, smile at each other and share a small bite as guests applaud.']],
 baraat:[['dance','Groom dancing with family','The groom joins his family in a joyful dance in the middle of the baraat, laughing as friends raise their hands and cheer around him to dhol beats.'],['car','Arrival in a decorated car','The groom arrives in a flower-decorated vintage car, steps out with a big smile and greets his dancing family as petals fly.']],
};
for(const [kind,list] of Object.entries(MORE_ACTIONS))ACTIONS[kind]=[...(ACTIONS[kind]||[]),...list];
const SETTINGS={blessing:'Carved stone entrance, warm golden dawn, brass lamps and white-and-marigold flowers',mehndi:'A lush courtyard with pink and green drapes, jasmine strings, cushions and soft lanterns',haldi:'A sunlit courtyard decorated with yellow marigolds, brass bowls and a mango-leaf toran',sangeet:'A night celebration stage with warm fairy lights, floral arches and instrumental musicians',wedding:'An elegant flower-decorated ceremonial setting appropriate to the selected culture',reception:'A grand reception hall with chandeliers, ivory roses, hanging flowers and warm golden light'};
const uniqueById=(items)=>items.filter((item,i)=>items.findIndex(other=>other.id===item.id)===i);
export function weddingActions(kind,style='Marathi wedding'){
 if(kind==='custom')return [{id:'custom',label:'Describe this ritual',description:''}];
const own=styleWeddingOptions(style).actions?.[kind]||[];return uniqueById([...own,...(ACTIONS[kind]||ACTIONS.wedding)].map(([id,label,description])=>({id,label,description}))).concat({id:'custom',label:'Describe my own action',description:''});}
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
const LIKENESS_LOOK="Keep both people clearly recognisable from the uploaded image: the same face shape, eyes, nose, smile, skin tone, hairstyle, facial hair and glasses. Render them as polished stylized 3D illustrated characters with clean illustrative outlines, expressive animated eyes, smooth illustrated skin shading, natural blinking and gentle animated movement. Never make them photorealistic footage or different characters. Keep these same animated faces consistent in every scene, but follow the couple outfit instructions separately for EVERY scene. Use natural proportions, rich fabric textures, gentle natural smiles, warm golden lighting and restrained petal transitions.";
const LIKENESS_OPENING_WEDDING="Begin directly inside the first described setting with an establishing medium-wide shot and action already in motion. Use the uploaded image only for both people's recognisable facial identity, never as a displayed photo, static portrait, collage, slideshow or opening face close-up. Render polished illustrated animated faces from the opening moment; no photorealistic photo-to-animation reveal or sudden style change.";
const OUTFIT_RULE="Use the uploaded image only for the couple's faces; never copy the clothes from the uploaded image. From the very first frame the couple already wear the scene 1 outfits below, and each later scene uses its own outfits.";
// Image-to-video tends to keep the uploaded clothes; state the outfit rule once, right before the scene list.
const lowerFirst=text=>String(text || '').trim().replace(/^[A-Z](?![A-Z])/,c=>c.toLowerCase()).replace(/[.\s]+$/,'');
const withOutfitRule=(prompt,scenes=[])=>{
 const first=scenes[0],bride=lowerFirst(first?.brideOutfit),groom=lowerFirst(first?.groomOutfit);
 const change=bride&&groom?' Change their outfits to '+bride+' for her and '+groom+' for him.':'';
 return prompt.replace('\nNEW SCENES ONLY, in this order:',' '+OUTFIT_RULE+change+'\nNEW SCENES ONLY, in this order:');
};
export function weddingScenesPrompt(options){
 const prompt=withOutfitRule(baseWeddingScenesPrompt(options),options.scenes);
 if(options.look!=='likeness')return prompt;
 // Photo likeness: swap every cartoon/3D-character instruction for one clear direction (same faces, the uploaded image's own style).
 return prompt
  .replace(/cinematic stylized 3D animated (.+?) invitation\. Reimagine the couple as expressive illustrated 3D characters, not photographic people\. Keep consistent cartoon character designs, but follow the couple outfit instructions separately for EVERY scene\. Use soft rounded features, rich silk textures, gentle natural smiles, warm golden lighting, elegant floral arches, hanging jasmine, carved heritage details and restrained petal transitions\./,(m,st)=>'cinematic gently animated '+st+' invitation. '+LIKENESS_LOOK)
  .replace(ANIMATED_OPENING,LIKENESS_OPENING_WEDDING);
}
function baseWeddingScenesPrompt({style,ceremony,seconds=15,scenes,layout='cinematic',previousCeremony=''}){
 const tradition=WEDDING_TRADITIONS[style] || WEDDING_TRADITIONS['Marathi wedding'];
 const continuation=previousCeremony?continuationDirection('The previous '+(previousCeremony==='journey-opening'?'opening portion':'clip')+' is complete. No earlier action instructions are supplied.')+'\n':'';
 const timeline=weddingSceneRanges(scenes,ceremony,seconds).map(({scene,start,end})=>`${Number(start.toFixed(1))}–${Number(end.toFixed(1))}s, ${scene.title || CEREMONY_NAMES[scene.kind]}: ${scene.description} Setting: ${scene.setting}. COUPLE OUTFITS FOR THIS SCENE ONLY: bride wears ${scene.brideOutfit}; groom wears ${scene.groomOutfit}. These clothes belong to the couple, not to the background guests. Apply them from the beginning of this scene; change clothes at the next scene cut, without a clothing-morph effect.`).join('\n');
 return continuation+`Create ONE ${seconds}-second portrait 9:16 cinematic stylized 3D animated ${style} invitation. Reimagine the couple as expressive illustrated 3D characters, not photographic people. Keep consistent cartoon character designs, but follow the couple outfit instructions separately for EVERY scene. Use soft rounded features, rich silk textures, gentle natural smiles, warm golden lighting, elegant floral arches, hanging jasmine, carved heritage details and restrained petal transitions. Use readable medium or full-body framing and show one clear action per scene.\nNEW SCENES ONLY, in this order:\n${timeline}\n`+(layout==='invitation'?'Composition: reserve the left 46% for a blank ivory ornamental invitation panel, framed by delicate flowers; keep the animated couple and ritual visible on the right. Never generate writing on the panel; the website adds editable ceremony titles, dates and venue.':'Composition: use the full portrait scene with the couple clearly visible and leave calm space in the upper third for editable lettering.')+` Keep rituals, decor and modest attire respectful of ${style}. No previous ceremony recap and no extra scenes. ${ANIMATED_OPENING} No generated text, logos or watermarks. No dialogue, lip-sync, singing or murmuring. Only ${tradition.music}.`;
}
export function validWeddingScenes(scenes){
 return scenes===undefined || Array.isArray(scenes)&&scenes.length>=1&&scenes.length<=6&&scenes.every(s=>s&&Object.hasOwn(CEREMONY_NAMES,s.kind)&&['description','setting','brideOutfit','groomOutfit'].every(k=>typeof s[k]==='string'&&s[k].trim()&&s[k].length<=({description:1500,setting:500,brideOutfit:240,groomOutfit:240}[k]))&&['id','title','date','time','venue'].every(k=>s[k]===undefined||typeof s[k]==='string'&&s[k].length<=({id:80,title:80,date:20,time:20,venue:160}[k]))&&(s.kind!=='custom'||!!s.title?.trim()));
}
export function newWeddingScene(kind,style){
 if(kind==='custom')return {id:crypto.randomUUID(),kind,title:'',action:'custom',description:'The couple take part in this celebration together, surrounded by smiling family and friends, and share a warm, happy look as soft petals fall.',settingChoice:'custom',setting:'An elegant venue decorated with fresh flowers and warm golden lights',outfit:'custom',brideOutfit:'Elegant festive Indian outfit with traditional jewellery',groomOutfit:'Festive silk kurta with a Nehru jacket'};
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
