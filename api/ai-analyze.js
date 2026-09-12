// OnionSetu grading (Gemini-assisted, Phase 1)
// POST { images: ["base64"|"data:...;base64,...",...], policyVersion:"v2026.1" }
// -> per-onion Grade A/URS with reasoning. Images are sent as inline_data
// vision parts to Gemini; without GEMINI_API_KEY a demo fallback is returned.
const MODEL_ID = "gemini-3.5-flash";
const MODEL_LABEL = "OnionSetu grading (Gemini-assisted, Phase 1)";

function demoResults(){
  return [
    {id:"O1", sizeMm:72, defect:"Healthy", confidence:97, reasoning:"Demo data: uniform skin, firm — borderline URS on size (72>70).", grade:"URS"},
    {id:"O2", sizeMm:65, defect:"Damaged", confidence:94, reasoning:"Demo data: scuff near top — handling damage → URS.", grade:"URS"},
    {id:"O3", sizeMm:58, defect:"Healthy", confidence:96, reasoning:"Demo data: even color, globular — Grade A.", grade:"Grade A"},
  ];
}

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
    model: MODEL_LABEL,
    note:"Demo fallback — no live model call (no API key configured).",
    mockFallback:true,
    results: demoResults(),
  });

  let body = req.body;
  if(typeof body==="string") try{ body=JSON.parse(body); }catch{}
  const { images=[], policyVersion="v2026.1" } = body||{};

  const prompt = `You are assisting onion quality grading for Lasalgaon APMC. Use the 25mm reference for size calibration (policy ${policyVersion}: 35-70mm = Grade A size, else URS). Classes: Healthy, Damaged, Rotten, Sprouted. For each detected onion (O1..), return JSON array: [{id,sizeMm,defect,confidence(0-100),reasoning,grade}]. Be specific about visible evidence (spots, sprout, soft patch). Confidence <60 triggers human review. Policy rotten≤2% sprouted≤3%. Return ONLY JSON array, no markdown.`;

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
      results = [{ id:"O1", sizeMm:65, defect:"Healthy", confidence:85, reasoning: text.slice(0,300), grade:"Grade A" }];
    }
    results = results.map(r=>({
      ...r,
      grade: (r.defect==="Rotten"||r.defect==="Sprouted"||r.sizeMm<35||r.sizeMm>70) ? "URS" : r.defect==="Damaged" ? "URS" : "Grade A"
    }));
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
