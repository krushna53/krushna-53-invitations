import test from 'node:test';
import assert from 'node:assert/strict';
import {clipWindow,estimatedReelMegabytes} from '../lib/ai-reel-export.mjs';
import {ANIMATED_OPENING,continuationDirection} from '../lib/ai-continuation.mjs';
import {weddingVideoPrompt} from '../lib/ai-wedding-prompt.mjs';
import {storyFilmPrompt} from '../lib/ai-story.mjs';

test('both generated clip openings are skipped, leaving a shorter combined film',()=>{
  const clips=[clipWindow(15),clipWindow(15)];
  assert.deepEqual(clips,[{start:.6,duration:14.4},{start:.6,duration:14.4}]);
  assert.equal(clips.reduce((s,c)=>s+c.duration,0),28.8);
  assert.equal(clipWindow(15,0).duration,15);
  assert.equal(clipWindow(15,1.5).start,1.5);
});
test('trim cannot remove the entire clip or move before the beginning',()=>{
  assert.deepEqual(clipWindow(5,100),{start:4.75,duration:.25});
  assert.deepEqual(clipWindow(5,-2),{start:0,duration:5});
  assert.deepEqual(clipWindow(0,1),{start:0,duration:0});
});
test('smaller-file export targets about one third of the previous 6 Mbps file size',()=>{
  assert.equal(estimatedReelMegabytes(30,'standard',false),7.5);
  assert.equal(estimatedReelMegabytes(30,'standard',true),7.98);
  assert.ok(estimatedReelMegabytes(30,'high')>estimatedReelMegabytes(30));
});
test('wedding and story defaults request animated action rather than a reference-photo intro',()=>{
  const wedding=weddingVideoPrompt('Marathi wedding','journey-opening',15);
  const story=storyFilmPrompt([{title:'First meeting',description:'Meet in a school courtyard'}]);
  for(const prompt of [wedding,story])assert.ok(prompt.includes(ANIMATED_OPENING));
  assert.doesNotMatch(wedding,/may begin with the supplied image/);
});
test('continuation uses the previous ending as context, without replaying earlier events',()=>{
  const direction=continuationDirection('Haldi in the courtyard');
  assert.match(direction,/final animated frame/);assert.match(direction,/No restart/);
  assert.match(direction,/context only, do not replay/);
  const story=storyFilmPrompt([{title:'Next',description:'Travel together'}],{part:2,previousSummary:'First meeting'});
  assert.match(story,/final animated frame/);assert.match(story,/First meeting/);
});
