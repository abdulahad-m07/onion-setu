export const CONFIDENCE_THRESHOLD = 60;

export function classifyOnion(onion, policy){
  const { sizeMm, defect } = onion;
  const { min, max } = policy.sizeBand;
  const sizeOk = sizeMm >= min && sizeMm <= max;
  const defectFail = defect === "Rotten" || defect === "Sprouted";
  const damaged = defect === "Damaged";
  // Damaged is tolerated up to policy, but for per-onion we mark URS if rotten/sprouted or out-of-size
  // Damaged counts toward URS in aggregate via tolerances — simplified per-onion rule: out-of-size OR rotten/sprouted = URS
  if (!sizeOk || defectFail) return "URS";
  if (damaged) return "URS"; // conservative demo — policy tolerances shown in aggregate explanation
  return "Grade A";
}

export function gradeLot(onions, policy){
  let gradeACount = 0;
  const details = onions.map(o => {
    const grade = classifyOnion(o, policy);
    if (grade === "Grade A") gradeACount++;
    return { ...o, grade };
  });
  const total = onions.length || 1;
  const gradeAPct = Math.round((gradeACount/total)*100);
  return { details, gradeA: gradeAPct, urs: 100-gradeAPct, total };
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
