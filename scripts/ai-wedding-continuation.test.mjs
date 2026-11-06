import test from 'node:test';
import assert from 'node:assert/strict';
import {weddingContinuationPrompt} from '../lib/ai-wedding-continuation.mjs';

test('next wedding clip contains Sangeet, Wedding and Reception without previous opening instructions',()=>{
  const prompt=weddingContinuationPrompt('Marathi wedding','journey-finale',15,'journey-opening');
  assert.match(prompt,/0–4s Sangeet celebration; 4–11s Wedding ceremony; 11–15s Reception/);
  assert.match(prompt,/Lavani/);assert.match(prompt,/Nauvari Paithani/);assert.match(prompt,/chandeliers/);
  assert.doesNotMatch(prompt,/Ganpati mandir|henna drawn|applying turmeric|Finally Haldi/);
  assert.match(prompt,/final animated frame/);
});
test('a previous prompt cannot be inserted into the next clip as context',()=>{
  const prompt=weddingContinuationPrompt('Marathi wedding','reception',15,'Use the uploaded photo. First Mandir. Then Haldi.');
  assert.doesNotMatch(prompt,/First Mandir|Then Haldi/);
  assert.match(prompt,/NEW CLIP ONLY: reception/);
});
test('timings scale with the selected length and culture stays in the next clip',()=>{
  const prompt=weddingContinuationPrompt('Bengali wedding','journey-finale',10,'journey-opening');
  assert.match(prompt,/0–2.7s Sangeet celebration; 2.7–7.3s Wedding ceremony; 7.3–10s Reception/);
  assert.match(prompt,/shubho drishti/);assert.doesNotMatch(prompt,/Nauvari|Ganpati|Lavani/);
});
