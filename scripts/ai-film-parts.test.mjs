import test from 'node:test';
import assert from 'node:assert/strict';
import {weddingSceneDefaults,weddingScenesPrompt,validWeddingScenes,CEREMONY_LABELS} from '../lib/ai-wedding-scenes.mjs';
import {AI_CEREMONIES} from '../lib/ai-wedding-prompt.mjs';
const style='Marwari wedding';
test('film parts hold the planned ceremonies with reference-style defaults',()=>{
 assert.deepEqual(weddingSceneDefaults(style,'film-part-1').map(s=>s.title),['Sagan Ceremony','Engagement','Cocktail Dinner']);
 assert.deepEqual(weddingSceneDefaults(style,'film-part-2').map(s=>s.title),['Haldi Ceremony','Baraat','Pheras']);
 assert.deepEqual(weddingSceneDefaults(style,'film-part-3').map(s=>s.title),['Reception Dinner']);
 for(const c of ['film-opening','film-part-1','film-part-2','film-part-3']){assert.ok(AI_CEREMONIES.includes(c));assert.ok(CEREMONY_LABELS[c]);assert.equal(validWeddingScenes(weddingSceneDefaults(style,c)),true,c);}
 const p2=weddingScenesPrompt({style,ceremony:'film-part-2',seconds:15,scenes:weddingSceneDefaults(style,'film-part-2'),look:'likeness'});
 assert.match(p2,/Elders gently dab a little turmeric/);assert.match(p2,/decorated white horse/);assert.match(p2,/Pheras/);assert.match(p2,/Yellow floral sharara/i);
});
test('the opening animates the uploaded image without any couple',()=>{
 const p=weddingScenesPrompt({style,ceremony:'film-opening',seconds:8,scenes:weddingSceneDefaults(style,'film-opening'),look:'likeness'});
 assert.match(p,/hibiscus/);assert.match(p,/no bride or groom, no couple/);
 assert.doesNotMatch(p,/COUPLE OUTFITS|recognisable from the uploaded/);
});
test('the opening asks for one continuous bloom without a cut',()=>{
 const p=weddingScenesPrompt({style,ceremony:'film-opening',seconds:10,scenes:weddingSceneDefaults(style,'film-opening')});
 assert.match(p,/one smooth continuous take with no cuts/);assert.match(p,/same flower opens in place/);
});
test('every scene and the opening keep a wide camera without zooming in',()=>{
 for(const c of ['film-part-1','film-part-2','film-part-3']){const p=weddingScenesPrompt({style,ceremony:c,seconds:15,scenes:weddingSceneDefaults(style,c),look:'likeness'});assert.match(p,/no zoom-ins or push-ins/);assert.doesNotMatch(p,/push-in/i.source?/camera push-in/:/x/);}
 const o=weddingScenesPrompt({style,ceremony:'film-opening',seconds:10,scenes:weddingSceneDefaults(style,'film-opening')});
 assert.match(o,/no zoom or push-in/);assert.doesNotMatch(o,/camera push-in/);
});
