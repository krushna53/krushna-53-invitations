import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {serveAiVideo} from '../lib/ai-video-service.mjs';
import {hasRepeatedGenerationPrompt,storyContinuationContext,savedStoryContext} from '../lib/ai-prompt-audit.mjs';
import {weddingContinuationPrompt} from '../lib/ai-wedding-continuation.mjs';
import {weddingVideoPrompt,AI_WEDDING_STYLES} from '../lib/ai-wedding-prompt.mjs';
import {storyFilmPrompt} from '../lib/ai-story.mjs';

const bad='Continue the previous video. Previous events (context only, do not replay): Use the uploaded image as reference. Create a 15-second film. Then Haldi.';
const bytes=Buffer.from([137,80,78,71,13,10,26,10,1,2,3]);
const image='data:image/png;base64,'+bytes.toString('base64');
const base={model:'grok-imagine-video-1.5-lite',seconds:15,resolution:'720p',style:'Marathi wedding',ceremony:'wedding',photoHash:createHash('sha256').update(bytes).digest('hex'),promptMode:'replace'};
test('editing an older saved story cannot reload raw earlier generation instructions',()=>{
 assert.doesNotMatch(savedStoryContext('Use the uploaded image as reference. Create a 15-second film.'),/Use the uploaded image|Create a/);
 assert.equal(savedStoryContext('Completed part 1. A family dinner in Pune.'),'Completed part 1. A family dinner in Pune.');
});
function harness(){const jobs=new Map(),requests=[];const deps={apiKey:'fake-test-key',accessCode:'test-only-access-123456789',now:1000000,store:{get:async k=>jobs.get(k),set:async(k,v)=>jobs.set(k,v),claim:async(k,v)=>{if(jobs.has(k))return false;jobs.set(k,v);return true;}},fetcher:async(url,init)=>{requests.push({url,...JSON.parse(init.body)});return Response.json({request_id:'mocked-generation'});}};return{requests,call:(action,body)=>serveAiVideo(new Request('https://example.test/api/ai-video/'+action,{method:'POST',headers:{origin:'https://example.test','x-ai-access-code':deps.accessCode},body:JSON.stringify(body)}),deps)};}

test('old nested prompt is blocked before a paid request, while ordinary creative edits remain valid',async()=>{
 assert.equal(hasRepeatedGenerationPrompt(bad),true);
 assert.equal(hasRepeatedGenerationPrompt('Use a blue saree. Show Sangeet followed by Reception.'),false);
 const h=harness();const r=await h.call('quote',{...base,customPrompt:bad});
 assert.equal(r.status,400);assert.match((await r.json()).error,/repeats the earlier generation/);assert.equal(h.requests.length,0);
});
test('wedding first clip and next clip submit exactly their separate confirmed prompts, without a second wrapper',async()=>{
 for(const style of AI_WEDDING_STYLES){
  const h=harness();
  const prompts=[weddingVideoPrompt(style,'journey-opening'),weddingContinuationPrompt(style,'journey-finale',15,'journey-opening')];
  for(const [i,customPrompt] of prompts.entries()){
   assert.equal(hasRepeatedGenerationPrompt(customPrompt),false);
   const quote=await(await h.call('quote',{...base,style,ceremony:i?'journey-finale':'journey-opening',customPrompt})).json();
   assert.ok(quote.token);assert.equal(h.requests.length,i);
   await h.call('generate',{token:quote.token,confirmed:true,image});
   assert.equal(h.requests[i].prompt,customPrompt);
   await h.call('generate',{token:quote.token,confirmed:true,image});assert.equal(h.requests.length,i+1);
  }
  assert.match(h.requests[1].prompt,/Sangeet celebration/);
  assert.equal((h.requests[1].prompt.match(/Create a 15-second/g)||[]).length,1);
 }
});
test('story continuation carries scene labels, not previous descriptions, prompts or old nested summaries',async()=>{
 const previous={customPrompt:bad,storyScene:{part:2,previousSummary:bad,scenes:[{title:'Family dinner',location:'Pune',description:'OLD ACTION MARKER'}]}};
 const context=storyContinuationContext(previous);
 assert.match(context,/Family dinner/);assert.match(context,/Pune/);
 assert.doesNotMatch(context,/OLD ACTION MARKER|Use the uploaded image|Then Haldi/);
 const scenes=[{title:'Our trip',description:'Walk along the coast',wardrobe:'travel'}];
 const prompt=storyFilmPrompt(scenes,{part:3,previousSummary:context});
 const h=harness();const q=await(await h.call('quote',{...base,ceremony:'story',customPrompt:prompt,storyScene:{index:0,count:1,part:3,previousSummary:context,scenes}})).json();
 assert.ok(q.token);assert.equal(h.requests.length,0);
 await h.call('generate',{token:q.token,confirmed:true,image});
 assert.equal(h.requests[0].prompt,prompt);assert.match(h.requests[0].prompt,/Walk along the coast/);assert.doesNotMatch(h.requests[0].prompt,/OLD ACTION MARKER/);
});
