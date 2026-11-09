import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneWardrobe} from '../lib/ai-story-wardrobe.mjs';
import {storyFilmPrompt,storyScenePrompt,validStoryScene} from '../lib/ai-story.mjs';

test('automatic outfits differ per scene and match work versus travel',()=>{
  const first=sceneWardrobe({guide:{kind:0,moment:'work'}},0);
  const next=sceneWardrobe({guide:{kind:2,moment:'travel'}},1);
  assert.match(first.bride,/blouse and trousers/);
  assert.match(next.bride,/light jacket/);
  assert.notEqual(first.bride,next.bride);
  assert.notEqual(first.groom,next.groom);
});
test('custom outfits enter their own scene in the actual combined generation prompt',()=>{
  const events=[{title:'Meet',description:'Meet at college',brideOutfit:'blue salwar suit',groomOutfit:'white shirt and jeans'}, {title:'Dinner',description:'Have dinner',wardrobe:'traditional',brideOutfit:'red Paithani saree',groomOutfit:'ivory kurta'}];
  const prompt=storyFilmPrompt(events);
  assert.match(prompt,/scene 1: Meet[\s\S]*blue salwar suit/);
  assert.match(prompt,/scene 2: Dinner[\s\S]*red Paithani saree/);
  assert.match(prompt,/same cartoon designs, not the same outfits/);
  assert.match(storyScenePrompt(events[0]),/blue salwar suit/);
});
test('outfits survive metadata validation and invalid or oversized choices are rejected',()=>{
  const scene={wardrobe:'traditional',brideOutfit:'green saree',groomOutfit:'cream kurta'};
  assert.equal(validStoryScene({index:0,count:1,scenes:[scene]}),true);
  assert.equal(validStoryScene({index:0,count:1,scenes:[{...scene,brideOutfit:'x'.repeat(241)}]}),false);
  assert.equal(validStoryScene({index:0,count:1,scenes:[{wardrobe:'invalid'}]}),false);
  assert.equal(validStoryScene({index:0,count:1,scenes:[{title:'Old saved scene'}]}),true);
});
test('reordering a guided scene keeps its automatic palette and outfits',()=>{
  const scene={guide:{kind:2,moment:'festival'}};
  assert.deepEqual(sceneWardrobe(scene,2),sceneWardrobe(scene,0));
});

test('journey requests cartoon faces from the first frame rather than exact photographic likeness',()=>{for(const prompt of [storyFilmPrompt([{title:'Meet',description:'Meet at a cafe'}]),storyScenePrompt({title:'Meet',description:'Meet at a cafe'})]){assert.match(prompt,/cartoon characters from the very first visible frame/);assert.match(prompt,/do not preserve realistic photographic faces/);assert.doesNotMatch(prompt,/preserve both people's recognizable facial features/);}});
