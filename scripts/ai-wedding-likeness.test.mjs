import test from 'node:test';
import assert from 'node:assert/strict';
import {weddingScenesPrompt,weddingSceneDefaults} from '../lib/ai-wedding-scenes.mjs';
const opts={style:'Marwari wedding',ceremony:'haldi',seconds:10,scenes:weddingSceneDefaults('Marwari wedding','haldi')};
test('photo likeness wedding prompt keeps recognisable faces in a polished illustrated animation',()=>{
 const p=weddingScenesPrompt({...opts,look:'likeness'});
 assert.match(p,/clearly recognisable from the uploaded image/);
 assert.match(p,/polished stylized 3D illustrated characters/);
 assert.match(p,/no photorealistic photo-to-animation reveal/);
 assert.match(p,/Haldi/);
});
test('the UI default uses animated likeness for a recognisable uploaded couple',()=>{
 const p=weddingScenesPrompt({...opts,look:'likeness'});
 assert.match(p,/same animated faces consistent/);
});
test('both looks tell the model not to reuse the uploaded clothes',()=>{
 for(const look of ['illustrated','likeness']){
  const p=weddingScenesPrompt({...opts,look});
  assert.match(p,/never copy the clothes from the uploaded image/);
  assert.match(p,/From the very first frame the couple already wear the scene 1 outfits/);
 }
});
test('first scene outfits are stated as an outfit change from the uploaded image',()=>{
 const scenes=[{kind:'custom',title:'Sagan Ceremony',description:'Elders bless the couple.',setting:'A decorated home',brideOutfit:'Powder pink embroidered anarkali',groomOutfit:'Ivory silk kurta with a light pink Nehru jacket'}];
 const p=weddingScenesPrompt({style:'Gujarati wedding',ceremony:'custom',seconds:5,scenes,look:'likeness'});
 assert.match(p,/Change their outfits to a?\s?powder pink embroidered anarkali for her and ivory silk kurta with a light pink Nehru jacket for him\./);
});
