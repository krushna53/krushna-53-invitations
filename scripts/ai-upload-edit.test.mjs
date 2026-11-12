import test from "node:test";
import assert from "node:assert/strict";
import { generationSettingsForClip, estimateAiVideo, AI_VIDEO_MODELS } from "../lib/ai-video-pricing.mjs";

test("uploaded videos with arbitrary durations open with valid generation settings without changing source media", () => {
  for (const seconds of [0.8, 7, 14.967, 30, 120]) {
    const clip = { uploaded: true, seconds, resolution: "2160p", videoUrl: "local-upload:test" };
    const before = {...clip};
    const settings = generationSettingsForClip(clip);
    assert.equal(settings.seconds, 15);
    assert.doesNotThrow(() => estimateAiVideo(settings));
    assert.deepEqual(clip, before);
  }
});
test("supported settings survive reopening, and unknown models use valid defaults", () => {
  const settings = {model: AI_VIDEO_MODELS[1].id, resolution: "1080p", seconds: 10};
  assert.deepEqual(generationSettingsForClip(settings), settings);
  assert.doesNotThrow(() => estimateAiVideo(generationSettingsForClip({model: "old-model"})));
});
