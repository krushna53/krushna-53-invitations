import test from 'node:test';
import assert from 'node:assert/strict';
import {completedReelRecord,selectedReelSources} from '../lib/ai-completed-reel.mjs';

test('finished reel keeps all source clips in order and editable settings',()=>{
 const clips=[{videoUrl:'opening',ceremony:'journey-opening',actualCostUsd:.46},{videoUrl:'finale',ceremony:'journey-finale',actualCostUsd:.31}];
 const editor={trims:{opening:.6,finale:1},details:{brideName:'A',groomName:'B'},sharedEvents:[{kind:'haldi',venue:'Pune'}],musicSettings:{choice:'festive'}};
 const r=completedReelRecord({id:'reel-1',clips,seconds:28.4,editor,now:123});
 assert.equal(r.videoUrl,'local-reel:reel-1');assert.equal(r.localReel,true);
 assert.deepEqual(r.clips.map(c=>c.videoUrl),['opening','finale']);
 assert.deepEqual(r.editor,editor);assert.equal(r.seconds,28.4);assert.equal(r.actualCostUsd,.77);assert.equal(r.ceremony,'combined');
});
test('story reels stay in the story gallery and repeating a clip does not double billed credits',()=>{
 const c={videoUrl:'story-1',ceremony:'story',actualCostUsd:.46};
 const r=completedReelRecord({id:'story',clips:[c,c],seconds:30,editor:{}});
 assert.equal(r.ceremony,'story');assert.equal(r.actualCostUsd,.46);assert.equal(r.clips.length,2);
});
test('a missing provider charge is not invented as a zero combined charge',()=>{
 const r=completedReelRecord({id:'x',clips:[{videoUrl:'a',actualCostUsd:.46},{videoUrl:'b'}],seconds:30,editor:{}});
 assert.equal(r.actualCostUsd,undefined);
 assert.throws(()=>completedReelRecord({id:'empty',clips:[],seconds:0,editor:{}}));
});

test('manual recovery respects the chosen order and does not infer matching couples',()=>{
 const clips=[{videoUrl:'a',ceremony:'journey-opening'},{videoUrl:'b',ceremony:'journey-finale'},{videoUrl:'c',ceremony:'journey-opening'}];
 assert.deepEqual(selectedReelSources(clips,['c','b']).map(c=>c.videoUrl),['c','b']);
 assert.throws(()=>selectedReelSources(clips,['a']));
 assert.throws(()=>selectedReelSources(clips,['a','a']));
 assert.throws(()=>selectedReelSources(clips,['a','missing']));
 assert.throws(()=>selectedReelSources([...clips,{videoUrl:'saved',localReel:true}],['a','saved']));
 assert.throws(()=>selectedReelSources([...clips,{videoUrl:'story',ceremony:'story'}],['a','story']));
});
import {mergedReelEditor} from '../lib/ai-completed-reel.mjs';
test('a saved complete reel can be combined with a new opening clip',()=>{
 const reel={videoUrl:'local-reel:r1',localReel:true,ceremony:'combined',clips:[{videoUrl:'a',ceremony:'journey-opening'},{videoUrl:'b',ceremony:'journey-finale'}],editor:{look:'blush',trims:{a:1},framing:{b:{mode:'fill',zoom:60}}}};
 const all=[reel,{videoUrl:'opening',ceremony:'wedding'},{videoUrl:'a',ceremony:'journey-opening'}];
 assert.deepEqual(selectedReelSources(all,['opening','local-reel:r1']).map(c=>c.videoUrl),['opening','a','b']);
 assert.throws(()=>selectedReelSources(all,['a','local-reel:r1']));
 const ed=mergedReelEditor(all,['opening','local-reel:r1']);
 assert.equal(ed.look,'blush');assert.deepEqual(ed.trims,{a:1});assert.deepEqual(ed.framing,{b:{mode:'fill',zoom:60}});
 assert.equal(mergedReelEditor(all,['opening','a']),null);
});
