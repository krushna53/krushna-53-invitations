import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneGuideIndex,updateGuidedScene,guideForScene,settingsForScene} from '../lib/ai-scene-guide.mjs';
import {storyFilmPrompt} from '../lib/ai-story.mjs';
const empty={id:'one',title:'',description:'',location:'Pune',date:'2023'};
test('guide answers build an editable scene that enters the video prompt',()=>{let scene=updateGuidedScene(empty,0,'moment','college');scene=updateGuidedScene(scene,0,'mood','shy');assert.match(scene.description,/meet at college/);assert.match(scene.description,/Shy and sweet/);assert.equal(scene.title,'Our first meeting');assert.equal(scene.location,'Pune');assert.equal(scene.date,'2023');assert.ok(storyFilmPrompt([scene]).includes(scene.description));});
test('changing dropdown answers preserves manual and AI edits',()=>{const first=updateGuidedScene(empty,1,'moment','coffee');const written={...first,title:'Our special day',description:'We met at a rooftop cafe in Mumbai.'};const changed=updateGuidedScene(written,1,'setting','rooftop-cafe');assert.equal(changed.description,written.description);assert.equal(changed.title,written.title);assert.match(changed.guide.draft,/rooftop café/);assert.notEqual(changed.guide.draft,written.description);});
test('guided scene keeps its question and choices when reordered',()=>{const first=updateGuidedScene(empty,0,'moment','college');const reordered=updateGuidedScene(first,4,'mood','playful');assert.equal(reordered.guide.kind,0);assert.match(reordered.description,/college/);assert.equal(guideForScene(reordered.guide.kind).question,'How did your story begin?');});

test('school locations match the selected meeting and incompatible old locations reset',()=>{let scene=updateGuidedScene(empty,0,'moment','school');const options=settingsForScene(0,scene.guide);assert.ok(options.some(item=>item.id==='classroom'));assert.ok(options.some(item=>item.id==='playground'));assert.ok(!options.some(item=>item.id==='hills'));scene=updateGuidedScene(scene,0,'setting','classroom');assert.match(scene.description,/school classroom/);scene=updateGuidedScene(scene,0,'moment','work');assert.equal(scene.guide.setting,'');assert.doesNotMatch(scene.description,/school classroom/);});
test('custom setting is included in the generated scene draft',()=>{let scene=updateGuidedScene(empty,0,'moment','school');scene=updateGuidedScene(scene,0,'setting','custom');scene=updateGuidedScene(scene,0,'customSetting','Our school auditorium in Pune');assert.match(scene.description,/Our school auditorium in Pune/);assert.ok(storyFilmPrompt([scene]).includes('Our school auditorium in Pune'));});

test('continuations ask for the next moments rather than restarting at first meeting',()=>{
 for(let i=0;i<6;i++){
  const kind=sceneGuideIndex(empty,i,2),guide=guideForScene(kind);
  assert.ok(kind>=6);assert.doesNotMatch(guide.question,/first met|story begin/i);
  assert.ok(guide.options.some(item=>item.id==='travel'));
  assert.ok(!guide.options.some(item=>['school','college','chance'].includes(item.id)));
 }
 assert.equal(sceneGuideIndex({guide:{kind:0}},0,3),6);
 assert.equal(sceneGuideIndex({guide:{kind:8}},0,3),8);
 assert.equal(sceneGuideIndex(empty,0,1),0);
});
test('continuation drafts, locations and prompts describe only the new chapter',()=>{
 let scene=updateGuidedScene({...empty,guide:{kind:6}},6,'moment','travel');
 assert.ok(settingsForScene(6,scene.guide).some(item=>item.id==='hills'));
 scene=updateGuidedScene(scene,6,'setting','hills');
 assert.match(scene.description,/new outing/);
 const prompt=storyFilmPrompt([scene],{part:2,previousSummary:'Met at college'});
 assert.match(prompt,/new outing/);assert.match(prompt,/context only, do not replay/);
 const moved=updateGuidedScene(scene,10,'mood','playful');
 assert.equal(moved.guide.kind,6);assert.match(guideForScene(moved.guide.kind).question,/What happened next/);
});
