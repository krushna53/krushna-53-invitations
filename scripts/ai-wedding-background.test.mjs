import test from 'node:test';
import assert from 'node:assert/strict';
import {weddingScenesPrompt,weddingSceneDefaults} from '../lib/ai-wedding-scenes.mjs';
test('every look replaces the uploaded background and asks for distinct guests',()=>{
 for(const look of ['realistic','likeness','illustrated']){
  const p=weddingScenesPrompt({style:'Gujarati wedding',ceremony:'sagan',seconds:5,scenes:weddingSceneDefaults('Gujarati wedding','sagan'),look});
  assert.match(p,/replace its whole background, walls, furniture, fans/);
  assert.match(p,/never identical, cloned or repeated people/);
 }
});
