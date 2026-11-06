export function completedReelRecord({id,clips,seconds,editor,now=Date.now()}){
 if(!clips.length)throw new Error('A finished reel needs at least one source clip.');
 const unique=[...new Map(clips.map(c=>[c.videoUrl,c])).values()];
 const known=unique.every(c=>Number.isFinite(c.actualCostUsd));
 const story=clips.every(c=>c.ceremony==='story');
 return {id,localReel:true,videoUrl:'local-reel:'+id,ceremony:story?'story':'combined',seconds,resolution:'720p',updated:now,clips:clips.map(c=>({...c})),editor,editableDetails:{title:story?'Complete story':'Complete wedding reel'},...(known?{actualCostUsd:Math.round(unique.reduce((n,c)=>n+c.actualCostUsd,0)*1e10)/1e10}:{})};
}

export function selectedReelSources(clips,orderedUrls){
 const sources=orderedUrls.map(url=>clips.find(c=>c.videoUrl===url&&!c.localReel));
 if(sources.length<2||sources.some(c=>!c)||new Set(orderedUrls).size!==orderedUrls.length)throw new Error('Select at least two different available source clips.');
 if(sources.some(c=>(c.ceremony==='story')!==(sources[0].ceremony==='story')))throw new Error('Choose clips from the same video mode.');
 return sources;
}
