import test from 'node:test';
import assert from 'node:assert/strict';
import {rangesWithCuts,weddingSceneRanges} from '../lib/ai-wedding-scenes.mjs';
const scenes=[{kind:'sagan'},{kind:'engagement'},{kind:'cocktail'}];
test('custom cut times move when each ceremony text appears',()=>{
 const r=rangesWithCuts(weddingSceneRanges(scenes,'custom',15),[6.2,11.5],15);
 assert.deepEqual(r.map(x=>[x.start,x.end]),[[0,6.2],[6.2,11.5],[11.5,15]]);
});
test('no cuts keeps the planned timing',()=>{
 const planned=weddingSceneRanges(scenes,'custom',15);
 assert.deepEqual(rangesWithCuts(planned,undefined,15),planned);
});
test('an empty box keeps that scene at its planned start',()=>{
 const r=rangesWithCuts(weddingSceneRanges(scenes,'custom',15),['',12],15);
 assert.equal(r[1].start,5);assert.equal(r[2].start,12);
});
