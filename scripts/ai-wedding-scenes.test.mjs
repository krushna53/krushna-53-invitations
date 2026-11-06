import test from 'node:test';
import assert from 'node:assert/strict';
import {weddingSceneDefaults,weddingSceneRanges,weddingScenesPrompt,newWeddingScene,validWeddingScenes,weddingOutfits,migrateWeddingScenes} from '../lib/ai-wedding-scenes.mjs';
import {AI_WEDDING_STYLES} from '../lib/ai-wedding-prompt.mjs';
import {DEFAULT_LETTERING,reelEditKey,drawReelLettering,addressLines} from '../lib/ai-reel-lettering.mjs';

test('Sangeet can be removed from the next clip without remaining in its prompt or timeline',()=>{
 const scenes=weddingSceneDefaults('Marathi wedding','journey-finale').filter(s=>s.kind!=='sangeet');
 const prompt=weddingScenesPrompt({style:'Marathi wedding',ceremony:'journey-finale',scenes,previousCeremony:'journey-opening'});
 assert.doesNotMatch(prompt,/Sangeet|Lavani|Mandir|Mehendi|Haldi/);
 assert.match(prompt,/Wedding/);assert.match(prompt,/Reception/);
 const ranges=weddingSceneRanges(scenes,'journey-finale');assert.equal(ranges[0].start,0);assert.equal(ranges[0].end,7.5);assert.equal(ranges[1].end,15);
});
test('a custom ritual is named, validated and placed in the chosen order',()=>{
 const custom={...newWeddingScene('custom','Marathi wedding'),title:'Grah Shanti',description:'Family sit together for blessings.',setting:'Our home courtyard',brideOutfit:'Green saree',groomOutfit:'Cream kurta',date:'2027-02-12',time:'09:00',venue:'Our home'};
 assert.equal(validWeddingScenes([custom]),true);assert.equal(validWeddingScenes([{...custom,title:''}]),false);
 assert.equal(validWeddingScenes([]),false);assert.equal(validWeddingScenes(Array(7).fill(custom)),false);
 const scenes=[custom,...weddingSceneDefaults('Marathi wedding','reception')];
 const prompt=weddingScenesPrompt({style:'Marathi wedding',ceremony:'journey-finale',scenes});
 assert.ok(prompt.indexOf('Grah Shanti')<prompt.indexOf('Reception'));
 assert.match(prompt,/bride wears Green saree; groom wears Cream kurta/);
 assert.equal(weddingSceneRanges(scenes,'journey-finale').at(-1).end,15);
});
test('default outfit, action and setting fields are valid across all cultures',()=>{
 for(const style of AI_WEDDING_STYLES)for(const ceremony of ['journey-opening','journey-finale','haldi','mehndi','sangeet','wedding','reception']){
  const scenes=weddingSceneDefaults(style,ceremony);assert.equal(validWeddingScenes(scenes),true,style+': '+ceremony);
  assert.ok(weddingOutfits(scenes[0].kind,style).length>=2);
  const prompt=weddingScenesPrompt({style,ceremony,scenes});assert.match(prompt,/COUPLE OUTFITS FOR THIS SCENE ONLY/);
 }
});

test('changing culture keeps removed ceremonies removed and preserves user-written details',()=>{
 const scenes=weddingSceneDefaults('Marathi wedding','journey-finale').filter(s=>s.kind!=='sangeet');
 scenes[1]={...scenes[1],outfit:'custom',brideOutfit:'Champagne gown',groomOutfit:'Blue suit'};
 const next=migrateWeddingScenes(scenes,'Bengali wedding');
 assert.deepEqual(next.map(s=>s.kind),['wedding','reception']);
 assert.match(next[0].brideOutfit,/Banarasi/);assert.equal(next[1].brideOutfit,'Champagne gown');
});
test('render-only parent updates do not invalidate the exported file and share controls',()=>{
 const values={clips:[{videoUrl:'clip-1',ceremony:'haldi',actualCostUsd:.46}],details:{brideName:'A',venue:'Pune'},lettering:DEFAULT_LETTERING};
 assert.equal(reelEditKey(values),reelEditKey(structuredClone(values)));
 assert.equal(reelEditKey(values),reelEditKey({...values,clips:[{...values.clips[0],actualCostUsd:.47,token:'renewed-token'}]}));
 assert.notEqual(reelEditKey(values),reelEditKey({...values,details:{...values.details,venue:'Mumbai'}}));
 assert.notEqual(reelEditKey(values),reelEditKey({...values,lettering:{...DEFAULT_LETTERING,heading:68}}));
});
test('larger ceremony and address sizes are drawn without losing the full text',()=>{
 const drawn=[];const ctx={save(){},restore(){},fillRect(){},strokeRect(){},measureText:t=>({width:t.length*14}),fillText(text,x,y,width){drawn.push({text,font:this.font,x,y,width});},createLinearGradient:()=>({addColorStop(){}})};
 drawReelLettering(ctx,{event:{title:'Reception',date:'14 Feb',time:'7 PM',venue:'Shree Krishna Lawns Pune'},names:'A & B',lettering:{heading:68,address:42,font:'Georgia'},panel:true});
 assert.equal(drawn[0].font,'68px Georgia');assert.ok(drawn.some(d=>d.font==='42px Georgia'));
 assert.match(drawn.map(d=>d.text).join(' '),/Shree Krishna Lawns Pune/);
});

test('venue wraps into readable lines and a long panel address uses the wider footer without truncation',()=>{
 const ctx={measureText:t=>({width:t.length*14})};
 const wrapped=addressLines(ctx,'Shree Krishna Lawns Pune',650);
 assert.ok(wrapped.length>=2&&wrapped.length<=3);assert.equal(wrapped.join(' '),'Shree Krishna Lawns Pune');
 const drawn=[];const canvas={...ctx,save(){},restore(){},fillRect(){},strokeRect(){},fillText(text,x,y,width){drawn.push({text,x,y,width});}};
 const venue='Shree Krishna Wedding Lawns Near Ganesh Temple Baner Road Pune Maharashtra';
 drawReelLettering(canvas,{event:{title:'Wedding',venue},names:'A & B',panel:true});
 const address=drawn.filter(d=>d.width===650);
 assert.ok(address.length>=2&&address.length<=3);assert.equal(address.map(d=>d.text).join(' '),venue);
});
