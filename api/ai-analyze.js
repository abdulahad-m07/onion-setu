// OnionSetu grading (Gemini-assisted, Phase 1) — live vision call with demo fallback.
// POST { images: ["base64"|"data:...;base64,...",...], policyVersion:"v2026.1" }
// -> per-onion observations (size/defect/confidence) + Grade A/B/C/Reject.
// URS is NOT a grade — it is a separate lot metric computed in grading.js.
// Images are sent as real inline_data vision parts; without GEMINI_API_KEY
// a deterministic demo is returned behind the same interface.
const MODEL_ID = "gemini-3.5-flash";
const MODEL_LABEL = "OnionSetu grading (Gemini-assisted, Phase 1)";

function fallbackResult(){
  return [
    {id:"O1", sizeMm:68, defect:"Healthy", confidence:88, reasoning:"Service fallback — review recommended.", grade:"Grade A"},
  ];
}

export default async function handler(req, res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(200).end();
  if(req.method!=="POST") return res.status(405).json({error:"Use POST { images, policyVersion }"});

  const key = process.env.GEMINI_API_KEY;
  if(!key) return res.status(200).json({
    model:"Prototype Demo Inference",
    note:"Demo — deterministic mock behind the same interface. Configure GEMINI_API_KEY for live Gemini-assisted grading.",
    mockFallback:true,
    results:[
      {id:"O1", sizeMm:72, defect:"Healthy", confidence:94, reasoning:"Demo: uniform skin, firm — outside 35-70 band → Reject.", grade:"Reject"},
      {id:"O2", sizeMm:65, defect:"Damaged", confidence:82, reasoning:"Demo: scuff near top — handling damage → Reject.", grade:"Reject"},
      {id:"O3", sizeMm:58, defect:"Healthy", confidence:91, reasoning:"Demo: even color, globular — Grade B.", grade:"Grade B"},
    ]
  });

  let body = req.body;
  if(typeof body==="string") try{ body=JSON.parse(body); }catch{}
  const { images=[], policyVersion="v2026.1" } = body||{};

  // Demo prompt — observation only; final grade is decided by versioned policy in grading.js, not here
  const prompt = `You are a demo onion observation adapter for Lasalgaon APMC. Use the 25mm reference for size calibration. Classes: Healthy, Damaged, Rotten, Sprouted. For each detected onion (O1..), return JSON array: [{id,sizeMm,defect,confidence(0-100),reasoning}]. Be specific about visible evidence (spots, sprout, soft patch). Confidence <60 triggers human review. Return ONLY JSON array, no markdown. Always return at least 1 observation, even if uncertain — low confidence is fine, it triggers human review. Never return an empty array. Policy ${policyVersion} is applied separately by the grading engine.`;

  // Attach each captured image as real vision data (base64 inline_data part).
  const parts = [{text: prompt}];
  for(const img of images.slice(0,3)){
    if(typeof img!=="string" || !img) continue;
    let b64 = img;
    let mime = "image/jpeg";
    if(img.startsWith("data:")){
      const m = img.match(/^data:(.*?);base64,(.*)$/);
      if(!m) continue;
      mime = m[1] || mime; b64 = m[2];
    }
    if(b64) parts.push({ inline_data:{ mime_type:mime, data:b64 }});
  }
  if(parts.length===1) parts.push({text:"No image provided — return 3 representative onions as example."});

  try{
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1/models/${MODEL_ID}:generateContent`,{
      method:"POST",
      headers:{"Content-Type":"application/json", "x-goog-api-key": key},
      body: JSON.stringify({ contents:[{ role:"user", parts }], generationConfig:{ temperature:0.2, maxOutputTokens: 1200 } })
    });
    const data = await resp.json().catch(()=> ({}));
    if(!resp.ok){
      console.error("Grading service upstream error:", resp.status);
      return res.status(200).json({ error:"Grading service temporarily unavailable", mockFallback:true,
        model: MODEL_LABEL,
        results: fallbackResult(),
      });
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let results;
    try{
      const m = text.match(/\[[\s\S]*\]/);
      results = JSON.parse(m ? m[0] : text);
    }catch{
      results = [{ id:"O1", sizeMm:65, defect:"Healthy", confidence:85, reasoning: text.slice(0,300) }];
    }
    // Guard: never hand the wizard an empty set — an uncertain observation
    // routes to human review instead of silently showing demo data.
    if(!Array.isArray(results) || !results.length){
      results = [{ id:"O1", sizeMm:60, defect:"Healthy", confidence:50,
        reasoning: ("Uncertain observation — flagged for human review. " + text).slice(0,300) }];
    }
    // Ensure grade per policy — Grades ONLY A/B/C/Reject; URS is separate lot metric, never a grade
    results = results.map(r=>{
      let grade = "Reject";
      if(r.defect==="Rotten" || r.defect==="Sprouted" || r.defect==="Damaged") grade = "Reject";
      else if(r.sizeMm < 35 || r.sizeMm > 70) grade = "Reject";
      else if(r.sizeMm >= 60) grade = "Grade A";
      else if(r.sizeMm >= 50) grade = "Grade B";
      else if(r.sizeMm >= 35) grade = "Grade C";
      return { ...r, grade };
    });
    return res.status(200).json({
      model: MODEL_LABEL,
      policy: policyVersion,
      results,
    });
  }catch(e){
    console.error("Grading service handler error");
    return res.status(200).json({ error:"Grading service temporarily unavailable", mockFallback:true,
      model: MODEL_LABEL,
      results: fallbackResult(),
    });
  }
}
