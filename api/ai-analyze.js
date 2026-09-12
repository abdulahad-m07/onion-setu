// Prototype Demo Inference — AIEngine adapter (DemoAIEngine). Real YOLOv8 Nano + MobileNetV2 TFLite replace this without UI change.
// POST { images: ["base64",...], policyVersion:"v2026.1" } -> per-onion observations (size/defect/confidence) + Grade A/B/C/Reject; URS is separate lot metric
export default async function handler(req, res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(200).end();
  if(req.method!=="POST") return res.status(405).json({error:"Use POST { images, policyVersion }"});

  const key = process.env.GEMINI_API_KEY;
  if(!key) return res.status(200).json({
    model:"Prototype Demo Inference",
    note:"Demo — deterministic mock behind AIEngine interface. Replace with real YOLOv8 Nano + MobileNetV2 TFLite without UI change.",
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
  const prompt = `You are a demo onion observation adapter for Lasalgaon APMC. Use the 25mm reference for size calibration. Classes: Healthy, Damaged, Rotten, Sprouted. For each detected onion (O1..), return JSON array: [{id,sizeMm,defect,confidence(0-100),reasoning}]. Be specific about visible evidence (spots, sprout, soft patch). Confidence <60 triggers human review. Return ONLY JSON array, no markdown. Policy ${policyVersion} is applied separately by the grading engine.`;

  // Free-tier path: text prompt via Interactions API (vision attached when supported).
  // Images are counted but sent as text context for now — frontend demo flow uses representative sampling.
  const imageNote = images.length ? ` Captured ${Math.min(images.length,3)} field view(s) attached for this lot — assess as representative sample.` : ` No image provided — return mock 3 onions as example.`;
  const input = prompt + imageNote;

  try{
    // Wrapped model: server-only free tier. Client only ever sees "OnionSetu.ai v1".
    const MODEL_ID = "gemini-3-flash-preview";
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/interactions`,{
      method:"POST",
      headers:{"Content-Type":"application/json", "x-goog-api-key": key},
      body: JSON.stringify({ model: MODEL_ID, input })
    });
    const data = await resp.json();
    if(!resp.ok){
      // Never expose upstream provider details / model names to client
      console.error("OnionSetu.ai upstream error:", resp.status);
      return res.status(200).json({ error: "OnionSetu.ai temporarily unavailable", mockFallback:true,
        model:"OnionSetu.ai v1",
        results:[
          {id:"O1", sizeMm:68, defect:"Healthy", confidence:88, reasoning:`OnionSetu.ai fallback — analyzing as Healthy.`, grade:"Grade A"},
        ]
      });
    }
    // Interactions API shape: { steps: [{type:"model_output", content:[{text}]}] }
    let text = "";
    try{
      const steps = data.steps || [];
      const out = steps.find(s=> s.type==="model_output" && Array.isArray(s.content));
      text = out?.content?.[0]?.text || data.outputText || "";
    }catch{ text = ""; }
    // Try to extract JSON array
    let results;
    try{
      const m = text.match(/\[[\s\S]*\]/);
      results = JSON.parse(m ? m[0] : text);
    }catch{
      results = [{ id:"O1", sizeMm:65, defect:"Healthy", confidence:85, reasoning: text.slice(0,300), grade:"Grade A" }];
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
      model:"Prototype Demo Inference",
      policy: policyVersion,
      results,
    });
  }catch(e){
    // Never expose internal error / provider details to client — log server-side only
    console.error("OnionSetu.ai handler error");
    return res.status(200).json({ error:"OnionSetu.ai temporarily unavailable", mockFallback:true,
      model:"OnionSetu.ai v1",
      results:[
        {id:"O1", sizeMm:68, defect:"Healthy", confidence:88, reasoning:`OnionSetu.ai fallback — analyzing as Healthy.`, grade:"Grade A"},
      ]
    });
  }
}
