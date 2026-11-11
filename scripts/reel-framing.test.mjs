import test from 'node:test';
import assert from 'node:assert/strict';
import {fullSceneRect,drawFullScene} from '../lib/reel-framing.mjs';
test('landscape source remains fully visible inside portrait reel',()=>{const rect=fullSceneRect(1920,1080);assert.equal(rect.width,720);assert.equal(rect.height,405);assert.equal(rect.x,0);assert.equal(rect.y,437.5);});
test('portrait and tall sources fit without cutting source edges',()=>{assert.deepEqual(fullSceneRect(720,1280),{x:0,y:0,width:720,height:1280});const r=fullSceneRect(600,1600);assert.equal(r.height,1280);assert.equal(r.width,480);assert.equal(r.x,120);});
test('sharp foreground uses the complete source image after the blurred background',()=>{const draws=[];const ctx={save(){},restore(){},fillRect(){},drawImage(...args){draws.push(args)}};const video={videoWidth:1920,videoHeight:1080};drawFullScene(ctx,video,720,1280);assert.equal(draws.length,2);assert.deepEqual(draws.at(-1),[video,0,437.5,720,405]);});

test('decoded canvas export has the same full-scene framing as video preview',()=>{const draws=[];const ctx={save(){},restore(){},fillRect(){},drawImage(...args){draws.push(args)}};const canvas={width:1920,height:1080};drawFullScene(ctx,canvas,720,1280);assert.deepEqual(draws.at(-1),[canvas,0,437.5,720,405]);});
import {fillSceneRect} from '../lib/reel-framing.mjs';
test('fill mode covers the whole portrait frame and crops the sides of a wide clip',()=>{
 const r=fillSceneRect(1280,720,720,1280,50);
 assert.equal(r.height,1280);assert.ok(r.width>720);assert.equal(r.y,0);assert.equal(Math.round(r.x),Math.round((720-r.width)/2));
 assert.equal(fillSceneRect(1280,720,720,1280,0).x+0,0);
 assert.equal(Math.round(fillSceneRect(1280,720,720,1280,100).x),Math.round(720-r.width));
});
import {inviteSceneRect} from '../lib/reel-framing.mjs';
test('invitation layout keeps the whole wide video at the bottom with space on top',()=>{
 const r=inviteSceneRect(1280,720,720,1280,0);
 assert.equal(r.width,720);assert.equal(r.x,0);assert.equal(r.y,1280-405);
 const big=inviteSceneRect(1280,720,720,1280,100);
 assert.ok(big.height>r.height);assert.equal(big.y+big.height,1280);assert.ok(big.y>=1280*0.12);
});
