import test from 'node:test';
import assert from 'node:assert/strict';
import {formatReelDate} from '../lib/ai-reel-lettering.mjs';
test('reel dates read as 24th December 2026',()=>{
 assert.equal(formatReelDate('2026-12-24'),'24th December 2026');
 assert.equal(formatReelDate('2026-01-01'),'1st January 2026');
 assert.equal(formatReelDate('2026-03-02'),'2nd March 2026');
 assert.equal(formatReelDate('2026-05-23'),'23rd May 2026');
 assert.equal(formatReelDate('2026-06-11'),'11th June 2026');
 assert.equal(formatReelDate('2026-06-12'),'12th June 2026');
 assert.equal(formatReelDate('2026-06-13'),'13th June 2026');
 assert.equal(formatReelDate('2026-08-31'),'31st August 2026');
});
test('empty or free-text dates are left alone',()=>{
 assert.equal(formatReelDate(''),'');
 assert.equal(formatReelDate(undefined),'');
 assert.equal(formatReelDate('Next Sunday'),'Next Sunday');
});
import {formatReelTime} from '../lib/ai-reel-lettering.mjs';
test('reel times read as 7:30 PM',()=>{
 assert.equal(formatReelTime('19:30'),'7:30 PM');
 assert.equal(formatReelTime('07:05'),'7:05 AM');
 assert.equal(formatReelTime('00:15'),'12:15 AM');
 assert.equal(formatReelTime('12:00'),'12:00 PM');
 assert.equal(formatReelTime(''),'');
 assert.equal(formatReelTime('Evening'),'Evening');
});
