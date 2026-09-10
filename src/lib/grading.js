export const CONFIDENCE_THRESHOLD = 60;

export function classifyOnion(onion, policy){
  // Kept for reference — overall grading now uses aggregate, not per-onion
  const { sizeMm, defect } = onion;
  const { min, max } = policy.sizeBand;
  const isURS = sizeMm < min || defect === "Rotten" || defect === "Sprouted";
  if (isURS) return "URS";
  if (defect === "Damaged") return "Reject";
  if (sizeMm < min || sizeMm > max) return "Reject";
  if (sizeMm >= 60) return "Grade A";
  if (sizeMm >= 50) return "Grade B";
  if (sizeMm >= 35) return "Grade C";
  return "Reject";
}

export function gradeLot(onions, policy){
  // Overall lot check — aggregate visible defect + size distribution, not per-onion table
  if(!onions.length) return { total:0, gradeA:0, gradeB:0, gradeC:0, reject:0, urs:0, counts:{A:0,B:0,C:0,Reject:0,URS:0}, overallGrade:"URS", details:[] };
  const avgSize = onions.reduce((s,o)=> s+o.sizeMm,0)/onions.length;
  const avgConf = onions.reduce((s,o)=> s+o.confidence,0)/onions.length;
  const defectCounts = { Healthy:0, Damaged:0, Rotten:0, Sprouted:0 };
  onions.forEach(o=> defectCounts[o.defect] = (defectCounts[o.defect]||0)+1 );
  const rottenPct = (defectCounts.Rotten/onions.length)*100;
  const sproutedPct = (defectCounts.Sprouted/onions.length)*100;
  const damagedPct = (defectCounts.Damaged/onions.length)*100;
  // URS if rotten/sprouted exceed tolerance or avg size out of band
  const { min, max } = policy.sizeBand;
  const outOfBand = avgSize < min || avgSize > max;
  const isURS = rottenPct > policy.tolerances.rotten || sproutedPct > policy.tolerances.sprouted || outOfBand;
  let overallGrade = "Grade A";
  if(isURS) overallGrade = "URS";
  else if(damagedPct > policy.tolerances.damaged) overallGrade = "Reject";
  else if(avgSize >= 60) overallGrade = "Grade A";
  else if(avgSize >= 50) overallGrade = "Grade B";
  else if(avgSize >= 35) overallGrade = "Grade C";
  else overallGrade = "Reject";

  // For display, map to percentages (overall, not per-onion breakdown)
  const counts = { A:0, B:0, C:0, Reject:0, URS:0 };
  if(overallGrade==="Grade A") counts.A = 100;
  else if(overallGrade==="Grade B") counts.B = 100;
  else if(overallGrade==="Grade C") counts.C = 100;
  else if(overallGrade==="Reject") counts.Reject = 100;
  else counts.URS = 100;

  return {
    total: onions.length,
    gradeA: counts.A, gradeB: counts.B, gradeC: counts.C, reject: counts.Reject, urs: counts.URS,
    counts, overallGrade, avgSize: Math.round(avgSize), avgConf: Math.round(avgConf),
    // Keep details for audit but UI will show overall only
    details: onions.map(o=> ({...o, grade: overallGrade })),
  };
}

export function needsHumanReview(onion){
  return onion.confidence < CONFIDENCE_THRESHOLD;
}

export function lotConfidence(onions){
  if (!onions.length) return 0;
  return Math.round(onions.reduce((a,b)=>a+b.confidence,0)/onions.length);
}

export function sha256Placeholder(seed="photo-set"){
  let h="";
  const chars="abcdef0123456789";
  let s=0; for(let i=0;i<seed.length;i++) s+=seed.charCodeAt(i);
  for(let i=0;i<64;i++){ h+=chars[(s*i*9301+49297)%16]; if((i+1)%8===0 && i!==63) h+=" "; }
  return h;
}
