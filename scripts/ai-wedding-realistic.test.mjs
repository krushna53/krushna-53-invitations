import test from 'node:test';
import assert from 'node:assert/strict';
import {weddingScenesPrompt,weddingSceneDefaults,CEREMONY_NAMES} from '../lib/ai-wedding-scenes.mjs';
const style='Gujarati wedding';
test('real look keeps real faces with only a light animated touch',()=>{
 for(const kind of Object.keys(CEREMONY_NAMES).filter(k=>k!=='custom')){
  const p=weddingScenesPrompt({style,ceremony:kind,seconds:5,scenes:weddingSceneDefaults(style,kind),look:'realistic'});
  assert.match(p,/recognisable as their real selves/);
  assert.match(p,/about 80% real and 20% animated/);
  assert.doesNotMatch(p,/illustrat|cel shading|outline|3D|stylized/i,kind);
  assert.match(p,/never copy the clothes from the uploaded image/);
 }
});
