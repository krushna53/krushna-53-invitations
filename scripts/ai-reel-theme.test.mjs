import test from 'node:test';
import assert from 'node:assert/strict';
import {drawReelLettering,DEFAULT_LETTERING} from '../lib/ai-reel-lettering.mjs';
const plain={...DEFAULT_LETTERING,surface:'none'};
import {validWeddingScenes,weddingSceneDefaults} from '../lib/ai-wedding-scenes.mjs';
function fakeCtx(){const texts=[];return {texts,save(){},restore(){},fillRect(){},strokeRect(){},createLinearGradient(){return {addColorStop(){}};},measureText(t){return {width:String(t).length*15};},fillText(t){texts.push(t);},set font(v){},set fillStyle(v){},set strokeStyle(v){},set lineWidth(v){},set shadowColor(v){},set shadowBlur(v){},set textAlign(v){}};}
test('ceremony theme is drawn under the venue',()=>{
 const ctx=fakeCtx();
 drawReelLettering(ctx,{event:{title:'Engagement',date:'2026-11-23',time:'17:30',venue:'Bel-La Monde, NH8, Delhi',theme:'The Great Gatsby era'},names:'A & B',lettering:plain});
 assert.ok(ctx.texts.includes('Theme: The Great Gatsby era'));
 assert.ok(ctx.texts.indexOf('Theme: The Great Gatsby era')>ctx.texts.findIndex(t=>/Bel-La Monde|Delhi/.test(t)));
});
test('no theme line when the box is empty, and themes are valid scene fields',()=>{
 const ctx=fakeCtx();drawReelLettering(ctx,{event:{title:'Haldi',venue:'X'},names:'A & B',lettering:plain});
 assert.ok(!ctx.texts.some(t=>t.startsWith('Theme:')));
 const scenes=weddingSceneDefaults('Gujarati wedding','haldi').map(s=>({...s,theme:'The Bluorng Haldi'}));
 assert.equal(validWeddingScenes(scenes),true);
});
