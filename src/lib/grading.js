export const CONFIDENCE_THRESHOLD = 60;

export function classifyOnion(onion, policy){
  const { sizeMm, defect } = onion;
  const { min, max } = policy.sizeBand;
  // URS is distinct from Reject — URS = undersized/rotten/sprouted (policy violation), Reject = grade D
  const isURS = sizeMm < min || defect === "Rotten" || defect === "Sprouted";
  if (isURS) return "URS";
  if (defect === "Damaged") return "Reject"; // damaged → Reject (grade D)
  if (sizeMm < min || sizeMm > max) return "Reject";
  if (sizeMm >= 60) return "Grade A";
  if (sizeMm >= 50) return "Grade B";
  if (sizeMm >= 35) return "Grade C";
  return "Reject";
}

export function gradeLot(onions, policy){
  const counts = { A:0, B:0, C:0, Reject:0, URS:0 };
  const details = onions.map(o => {
    const grade = classifyOnion(o, policy);
    let key = "Reject";
    if(grade==="Grade A") key="A"; else if(grade==="Grade B") key="B"; else if(grade==="Grade C") key="C"; else if(grade==="URS") key="URS"; else key="Reject";
    counts[key]++;
    return { ...o, grade };
  });
  const total = onions.length || 1;
  const gradeA = Math.round((counts.A/total)*100);
  const gradeB = Math.round((counts.B/total)*100);
  const gradeC = Math.round((counts.C/total)*100);
  const reject = Math.round((counts.Reject/total)*100);
  const urs = Math.round((counts.URS/total)*100);
  // For display, keep URS separate, Reject is grade D
  return { details, gradeA, gradeB, gradeC, reject, urs, counts, total };
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
