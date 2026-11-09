import test from 'node:test';
import assert from 'node:assert/strict';
import {STORY_STYLES,PHOTO_LIKENESS_STYLE,storyFilmPrompt,storyScenePrompt} from '../lib/ai-story.mjs';
const scene={title:'First meeting',description:'They meet in a conference room.'};
test('photo likeness style keeps recognisable faces in a clearly illustrated animation',()=>{
 assert.ok(STORY_STYLES.includes(PHOTO_LIKENESS_STYLE));
 for(const prompt of [storyFilmPrompt([scene],{style:PHOTO_LIKENESS_STYLE}),storyScenePrompt(scene,{style:PHOTO_LIKENESS_STYLE})]){
  assert.match(prompt,/clearly recognisable from the photo/);
  assert.match(prompt,/polished stylized 3D illustrated versions/);
  assert.doesNotMatch(prompt,/do not preserve realistic photographic faces/);
  assert.doesNotMatch(prompt,/cartoon designs/);
 }
});
test('other styles stay clearly cartoon',()=>{
 const prompt=storyFilmPrompt([scene],{style:'Stylized 3D animation'});
 assert.match(prompt,/do not preserve realistic photographic faces/);
 assert.match(prompt,/same cartoon designs, not the same outfits/);
 assert.doesNotMatch(prompt,/clearly recognisable from the photo/);
});
test('photo likeness prompt carries recognisable animated-face direction',()=>{
 const prompt=storyFilmPrompt([scene],{style:PHOTO_LIKENESS_STYLE,seconds:10});
 assert.doesNotMatch(prompt,/cartoon/i);
 assert.match(prompt,/polished illustrated animated faces/);
});
