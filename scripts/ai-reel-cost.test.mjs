import test from "node:test";
import assert from "node:assert/strict";
import { reelCost } from "../lib/ai-reel-cost.mjs";
test("one clip shows its actual cost and duration",()=>{assert.deepEqual(reelCost([{token:"a",seconds:15,actualCostUsd:.46}]),{actualUsd:.46,pending:0,unavailable:0,complete:true,seconds:15});});
test("two clips sum provider charges rather than multiplying an estimate",()=>{const result=reelCost([{token:"a",seconds:15,actualCostUsd:.46},{token:"b",seconds:15,actualCostUsd:.39}]);assert.equal(result.actualUsd,.85);assert.equal(result.seconds,30);assert.equal(result.complete,true);});
test("missing and imported charges never appear as a complete total",()=>{const result=reelCost([{token:"a",seconds:15,actualCostUsd:.46},{token:"b",seconds:15},{videoUrl:"blob:file"}]);assert.equal(result.complete,false);assert.equal(result.pending,1);assert.equal(result.unavailable,1);assert.equal(result.actualUsd,.46);});
test("reusing a generated clip does not double its generation charge",()=>{const result=reelCost([{token:"a",seconds:15,actualCostUsd:.46},{token:"a",seconds:15,actualCostUsd:.46}]);assert.equal(result.actualUsd,.46);assert.equal(result.seconds,30);});
test("zero is a valid actual charge; an empty reel is not a billed reel",()=>{assert.equal(reelCost([{token:"a",actualCostUsd:0}]).complete,true);assert.equal(reelCost([]).complete,false);});
