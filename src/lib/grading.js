export const CONFIDENCE_THRESHOLD = 60;

export function classifyOnion(onion, policy){
  const { sizeMm, defect } = onion;
  const { min, max } = policy.sizeBand;
  const sizeOk = sizeMm >= min && sizeMm <= max;
  if (!sizeOk) return "URS";
  if (defect === "Rotten" || defect === "Sprouted") return "URS";
  if (defect === "Damaged") return "URS";
  return "Grade A";
}

export function gradeLot(onions, policy){
  const total = onions.length;
  if(!total) return { details: [], gradeA: 0, urs: 0, total: 0,
    rottenPct: 0, sproutedPct: 0, damagedPct: 0,
    lotStatus: "No sample", toleranceBreaches: [] };
  // Per-onion classification — each onion graded individually against the
  // active policy size band + defect rules; percentages are the real
  // distribution across the sample (e.g. 68% Grade A / 32% URS).
  let gradeACount = 0, rotten = 0, sprouted = 0, damaged = 0;
  const details = onions.map(o => {
    const grade = classifyOnion(o, policy);
    if (grade === "Grade A") gradeACount++;
    if (o.defect === "Rotten") rotten++;
    if (o.defect === "Sprouted") sprouted++;
    if (o.defect === "Damaged") damaged++;
    return { ...o, grade };
  });
  const pct = n => Math.round((n/total)*100);
  const gradeA = pct(gradeACount);
  const rottenPct = pct(rotten), sproutedPct = pct(sprouted), damagedPct = pct(damaged);
  // Overall lot verdict from policy tolerances (defect rates vs allowed %).
  const tol = policy.tolerances || {};
  const toleranceBreaches = [];
  if(rottenPct > (tol.rotten ?? 100)) toleranceBreaches.push(`rotten ${rottenPct}% > ${tol.rotten}% allowed`);
  if(sproutedPct > (tol.sprouted ?? 100)) toleranceBreaches.push(`sprouted ${sproutedPct}% > ${tol.sprouted}% allowed`);
  if(damagedPct > (tol.damaged ?? 100)) toleranceBreaches.push(`damaged ${damagedPct}% > ${tol.damaged}% allowed`);
  let lotStatus = "Within tolerance";
  if(rottenPct > (tol.rotten ?? 100) || sproutedPct > (tol.sprouted ?? 100)) lotStatus = "Reject";
  else if(toleranceBreaches.length) lotStatus = "URS";
  return { details, gradeA, urs: 100-gradeA, total,
    rottenPct, sproutedPct, damagedPct, lotStatus, toleranceBreaches };
}

export function needsHumanReview(onion){
  return onion.confidence < CONFIDENCE_THRESHOLD;
}

export function lotConfidence(onions){
  if (!onions.length) return 0;
  return Math.round(onions.reduce((a,b)=>a+b.confidence,0)/onions.length);
}

export function sha256Placeholder(seed="photo-set"){
  // deterministic fake hash for demo — label clearly as demo
  let h="";
  const chars="abcdef0123456789";
  let s=0; for(let i=0;i<seed.length;i++) s+=seed.charCodeAt(i);
  for(let i=0;i<64;i++){ h+=chars[(s*i*9301+49297)%16]; if((i+1)%8===0 && i!==63) h+=" "; }
  return h;
}
