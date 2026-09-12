export const CONFIDENCE_THRESHOLD = 60;

// Canonical grading: observation (size + defect + confidence) + policy → Grade A/B/C/Reject
// URS is NOT a grade — it is a separate lot metric.
export function classifyOnion(onion, policy){
  const { sizeMm, defect } = onion;
  const { min, max } = policy.sizeBand;
  // Defect: Rotten/Sprouted are always Reject (not URS as grade)
  if (defect === "Rotten" || defect === "Sprouted") return "Reject";
  if (defect === "Damaged") return "Reject";
  // Size bands for A/B/C — per v2026.1 35-70: C 35-50, B 50-60, A 60-70; outside = Reject
  if (sizeMm < min || sizeMm > max) return "Reject";
  if (sizeMm >= 60) return "Grade A";
  if (sizeMm >= 50) return "Grade B";
  if (sizeMm >= 35) return "Grade C";
  return "Reject";
}

export function gradeLot(onions, policy){
  if(!onions.length) return { total:0, gradeA:0, gradeB:0, gradeC:0, gradeReject:0, urs:0, counts:{A:0,B:0,C:0,Reject:0}, details:[], overallGrade:"Reject" };
  const counts = { A:0, B:0, C:0, Reject:0 };
  const details = onions.map(o => {
    const grade = classifyOnion(o, policy);
    const key = grade === "Grade A" ? "A" : grade === "Grade B" ? "B" : grade === "Grade C" ? "C" : "Reject";
    counts[key]++;
    return { ...o, grade };
  });
  const total = onions.length;
  const gradeA = Math.round((counts.A/total)*100);
  const gradeB = Math.round((counts.B/total)*100);
  const gradeC = Math.round((counts.C/total)*100);
  const gradeReject = Math.round((counts.Reject/total)*100);
  // URS is separate lot metric: % of undersized + rotten + sprouted (policy violation)
  const ursCount = onions.filter(o=> o.sizeMm < policy.sizeBand.min || o.defect==="Rotten" || o.defect==="Sprouted").length;
  const urs = Math.round((ursCount/total)*100);
  // overallGrade for convenience (most frequent)
  const overallGrade = counts.A >= counts.B && counts.A >= counts.C && counts.A >= counts.Reject ? "Grade A"
    : counts.B >= counts.C && counts.B >= counts.Reject ? "Grade B"
    : counts.C >= counts.Reject ? "Grade C" : "Reject";
  return { details, gradeA, gradeB, gradeC, gradeReject, urs, counts, total, overallGrade };
}

export function needsHumanReview(onion){
  return onion.confidence < CONFIDENCE_THRESHOLD;
}

export function lotConfidence(onions){
  if (!onions.length) return 0;
  return Math.round(onions.reduce((a,b)=>a+b.confidence,0)/onions.length);
}

// Real SHA-256 where Web Crypto is available, fallback to placeholder for old environments
export async function sha256(text){
  if(typeof crypto !== "undefined" && crypto.subtle){
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map(b=> b.toString(16).padStart(2,"0")).join("");
  }
  return sha256Placeholder(text);
}

export function sha256Placeholder(seed="photo-set"){
  let h="";
  const chars="abcdef0123456789";
  let s=0; for(let i=0;i<seed.length;i++) s+=seed.charCodeAt(i);
  for(let i=0;i<64;i++){ h+=chars[(s*i*9301+49297)%16]; if((i+1)%8===0 && i!==63) h+=" "; }
  return h;
}
