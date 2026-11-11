import test from 'node:test';
import assert from 'node:assert/strict';
import {curtainProgress,drawCurtainReveal} from '../lib/reel-curtain.mjs';
test('curtains hold closed briefly, then open smoothly and stay open',()=>{
 assert.equal(curtainProgress(0),0);assert.equal(curtainProgress(0.4),0);
 assert.ok(curtainProgress(1.5)>0&&curtainProgress(1.5)<1);
 assert.equal(curtainProgress(2.6),1);assert.equal(curtainProgress(10),1);
 let drawn=0;const ctx={save(){},restore(){},createLinearGradient(){return {addColorStop(){}};},fillRect(){drawn++;},beginPath(){},arc(){},fill(){},set fillStyle(v){}};
 drawCurtainReveal(ctx,720,1280,1,'royal');assert.equal(drawn,0);
 drawCurtainReveal(ctx,720,1280,0.3,'royal');assert.ok(drawn>0);
});
