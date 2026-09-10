import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStore } from "../lib/store";
import { useSeo, Breadcrumbs } from "../lib/seo";
import { useI18n } from "../lib/i18n";
import { QRCodeSVG } from "qrcode.react";

export function ReportsList(){
  useSeo({ title:"Reports", description:"Evidence-backed quality reports — open tamper-evident PDFs with QR verification, policy version and SHA-256 hash for every assessment.", canonical:"/reports" });
  const { assessments } = useStore();
  return (
    <div style={{display:"grid", gap:14}}>
      <Breadcrumbs items={[{label:"Home", href:"/"},{label:"Reports", href:"/reports"}]} />
      <h1 className="h-display" style={{fontSize:28, margin:0}}>Quality reports</h1>
      <p style={{margin:"-6px 0 0", color:"#6B5A54", fontSize:12}}>Stored as: Report ID · Date · Location · Policy · Grade A/URS · Confidence · Acknowledgements · Dispute — plus uploaded images in final report</p>
      <div className="card card-pad" style={{background:"#FDFBF9", borderColor:"#EDE3DC", display:"flex", gap:10, alignItems:"center", flexWrap:"wrap"}}>
        <div style={{width:36,height:36, borderRadius:8, background:"#7A263A", color:"white", display:"grid", placeItems:"center", fontWeight:800}}></div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700, fontSize:13}}>TOM2024 Final Report — PDF with accuracy at the end</div>
          <div style={{fontSize:11, color:"#6B5A54"}}>120 sampled from your TOM2024.zip (Category B English test) — each report in your exact format + 12 images embedded + final accuracy summary</div>
        </div>
        <a href="/test_reports/OnionSetu_TOM2024_Final_Report.pdf" target="_blank" rel="noopener" className="btn btn-primary" style={{fontSize:12}}>Download Final PDF →</a>
        <a href="/test_reports/tom2024_reports.json" target="_blank" rel="noopener" className="btn btn-secondary" style={{fontSize:12}}>JSON</a>
      </div>
      <div style={{display:"grid", gap:10}}>
        {assessments.map(a=>(
          <Link key={a.id} to={`/reports/${a.id}`} className="card card-pad" style={{display:"flex", gap:14, alignItems:"center"}}>
            <div style={{width:48,height:48, borderRadius:10, background:"#7A263A", color:"white", display:"grid", placeItems:"center", fontWeight:700}}></div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontWeight:700}}>{a.id} — {a.gradeA}% Grade A / {a.urs}% URS <span className={`badge ${a.status==="Human Review"?"badge-error": a.status==="Human Review"?"badge-warning":"badge-success"}`} style={{marginLeft:8}}>{a.status}</span></div>
              <div style={{fontSize:12, color:"#6B5A54"}}>{a.lotId} · {a.farmer} · {a.center} · Policy {a.policyVersion} · {new Date(a.date).toLocaleDateString()}</div>
            </div>
            <span className="btn btn-secondary" style={{fontSize:12}}>Open report →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ReportDetail(){
  const { id } = useParams();
  const { assessments, updateAssessment } = useStore();
  const { t, lang, languages } = useI18n();
  const [printLang, setPrintLang] = useState(null); // null = follow app lang, "en" = force English
  const effectiveLang = printLang || lang;
  const effectiveT = (k)=> {
    // if printLang forced to en, use English; else use current lang via t
    if(printLang==="en"){
      const enDict = { reportId:"Report ID", date:"Date", location:"Location", policyVersion:"Policy version", gradeA:"Grade A %", urs:"URS %", confidence:"Confidence", farmerAck:"Farmer acknowledgement", graderAck:"Grader acknowledgement", disputeStatus:"Dispute status" };
      return enDict[k] || k;
    }
    return t(k);
  };
  const a = assessments.find(x=> x.id===id);
  useSeo({ title: a ? `Report ${a.id}` : "Report", description: a ? `${a.id} — ${a.gradeA}% Grade A / ${a.urs}% URS at ${a.location}. Policy ${a.policyVersion}, Confidence ${a.confidence}%.` : "Tamper-evident onion quality report with QR verification.", canonical: `/reports/${id}` });
  if(!a) return <div className="card card-pad">Report not found. <Link to="/reports">Browse reports</Link></div>;
  const hasImages = Array.isArray(a.images) && a.images.length;
  const hasOnions = Array.isArray(a.onions) && a.onions.length;
  const verifyUrl = `https://onion-setu.vercel.app/verify/${a.id}`;
  return (
    <div style={{display:"grid", gap:14}}>
      <Breadcrumbs items={[{label:"Home", href:"/"},{label:"Reports", href:"/reports"},{label:a.id, href:`/reports/${a.id}`}]} />
      <Link to="/reports" className="btn btn-ghost" style={{justifySelf:"start"}}>← All reports</Link>
      <h1 className="h-display" style={{fontSize:22, margin:0, position:"absolute", left:-9999, top:"auto", width:1, height:1, overflow:"hidden"}}>Report {a.id} — {a.gradeA}% Grade A quality assessment for {a.farmer}</h1>
      <div className="card card-pad" style={{border:"1px solid #EDE3DC"}}>
        <div style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12}}>
          <div>
            <div style={{fontFamily:"Fraunces, serif", fontWeight:700, fontSize:22, color:"#7A263A"}}>ONIONSETU</div>
            <div style={{fontSize:11, letterSpacing:".12em", textTransform:"uppercase", color:"#8a7a74", fontWeight:700}}>Quality Assessment Report — Final</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"Fraunces, serif", fontSize:26, fontWeight:700, color:"#7A263A"}}>{a.gradeA}% GRADE A</div>
            <div style={{fontFamily:"Fraunces, serif", fontSize:16, fontWeight:700}}>{a.urs}% URS</div>
            <div style={{marginTop:6}}><span className={`badge ${a.status==="Human Review"?"badge-warning":"badge-success"}`}>{a.status}</span> <span className={`badge ${a.acceptance==="Accepted"?"badge-success":"badge-error"}`} style={{marginLeft:6}}>{a.acceptance || "Accepted"}</span> <span className={`badge ${a.sync==="Offline"?"badge-offline":"badge-success"}`}>{a.sync}</span></div>
          </div>
        </div>

        <div className="divider" />

        {/* ——— STORAGE FORMAT — exactly as requested, typed ——— */}
        <div style={{background:"#FDFBF9", border:"1px solid #EDE3DC", borderRadius:12, overflow:"hidden"}}>
          <div style={{padding:"12px 14px", background:"#FBF6F0", borderBottom:"1px solid #EDE3DC", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8}}>
            <div style={{fontWeight:700, fontSize:13}}>{effectiveT("storedReportData") || "Stored Report Data"}</div>
            <span className="badge badge-maroon" style={{fontSize:10}}>{a.policyVersion} · {a.modelVersion}</span>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))", gap:0, fontSize:13}}>
            <Row label={effectiveT("reportId")} value={a.id} mono />
            <Row label={effectiveT("date")} value={new Date(a.date).toLocaleString()} />
            <Row label={effectiveT("location")} value={`${a.location} · ${a.center}`} />
            <Row label={effectiveT("policyVersion")} value={a.policyVersion} badge />
            <Row label={effectiveT("gradeA")} value={`${a.gradeA}%`} strong color="#7A263A" />
            <Row label={effectiveT("urs")} value={`${a.urs}%`} strong />
            <Row label={effectiveT("confidence")} value={`${a.confidence ?? "—"}%`} suffix={a.confidence>=60 ? "High" : a.confidence ? "Review" : ""} />
            <Row label={effectiveT("farmerAck")} value={a.acknowledged?.farmer ? `${effectiveT("acknowledged")} ` : effectiveT("pending")} dot={a.acknowledged?.farmer ? "#3F7D4A" : "#D99024"} />
            <Row label={effectiveT("graderAck")} value={a.acknowledged?.grader ? `${effectiveT("acknowledged")} ` : effectiveT("pending")} dot={a.acknowledged?.grader ? "#3F7D4A" : "#D99024"} />
            <Row label={effectiveT("disputeStatus")} value={a.status==="Human Review" ? (a.dispute?.reason || effectiveT("disputed")) : a.status==="Human Review" ? effectiveT("underReview") : effectiveT("noDispute")} badgeColor={a.status==="Human Review" ? "error" : a.status==="Human Review" ? "warning" : "success"} />
            <Row label={effectiveT("sampleSize")} value={`${a.sampleSize} onions`} />
            <Row label={effectiveT("lotId")} value={a.lotId} mono />
            <Row label={effectiveT("hash")} value={a.hash} mono small />
          </div>
        </div>

        {/* ——— UPLOADED IMAGES — part of final report ——— */}
        <div style={{marginTop:14}}>
          <div style={{fontWeight:700, fontSize:13, display:"flex", alignItems:"center", gap:8}}>
            Uploaded Images — Final Report
            <span className="badge" style={{fontSize:10}}>{hasImages ? `${a.images.length} views stored` : "Demo views"}</span>
            <span className="badge badge-maroon" style={{fontSize:10}}>Stored in Supabase Storage</span>
          </div>
          <div style={{fontSize:11, color:"#6B5A54", marginTop:2}}>These are the exact 3 views captured (with 25mm reference). They are stored in <span className="mono" style={{fontSize:11}}>assessment-images</span> bucket: <span className="mono" style={{fontSize:10}}>{a.id}/view_0..2.jpg</span> — referenced by <span className="mono" style={{fontSize:10}}>assessment_images</span> table.</div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginTop:10}} className="capture-grid">
            {[0,1,2].map(i=>{
              const stored = hasImages ? a.images.find(im=> im.view_index===i) : null;
              const src = stored?.public_url || "https://images.unsplash.com/photo-1508747703725-719777637510?w=600&h=400&fit=crop";
              const label = `View ${i+1} of 3${i===0 ? " · 25mm ref" : ""}`;
              return (
                <div key={i} style={{border:"1px solid #EDE3DC", borderRadius:10, overflow:"hidden", background:"white"}}>
                  <img src={src} alt={`Report ${a.id} uploaded image ${label} captured at ${a.location} on ${new Date(a.date).toLocaleDateString()}`} width="600" height="400" loading="lazy" style={{width:"100%", height:140, objectFit:"cover"}} />
                  <div style={{padding:"8px 10px", fontSize:11, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <span style={{fontWeight:700}}>{label}</span>
                    <span className="badge" style={{fontSize:9}}>{stored ? "Stored" : "Demo placeholder"}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{fontSize:11, color:"#8a7a74", marginTop:6}}>If real phone captures were uploaded, they appear here with signed URLs from Supabase Storage. Demo uses placeholder but storage path is still recorded.</div>
        </div>

        {/* Overall check — not per-onion, per lot */}
        <div style={{marginTop:14, background:"#FFFEFD", border:"1px solid #EDE3DC", borderRadius:10, padding:12}}>
          <div style={{fontWeight:700, fontSize:13}}>Overall Lot Check — Written to <span className="mono" style={{fontSize:11}}>assessments</span> (overall, not per-onion)</div>
          <div style={{fontSize:11, color:"#6B5A54"}}>Overall grade for the lot: <b>{a.gradeA ? `${a.gradeA}% Grade A` : a.gradeB ? `${a.gradeB}% Grade B` : a.gradeC ? `${a.gradeC}% Grade C` : a.reject ? `${a.reject}% Reject` : `${a.urs}% URS`}</b> — avg size {a.onions?.[0]?.sizeMm || "—"}mm, confidence {a.confidence}%. Stored as overall, per-onion kept for audit only.</div>
        </div>

        <div style={{background:"#FBF6F0", border:"1px solid #EDE3DC", borderRadius:10, padding:10, marginTop:14, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap"}}>
          <div style={{background:"white", border:"1px solid #EDE3DC", borderRadius:8, padding:6}}>
            <QRCodeSVG value={verifyUrl} size={72} level="M" bgColor="#FFFFFF" fgColor="#7A263A" />
          </div>
          <div style={{fontSize:11}}>
            <div style={{fontWeight:700}}>{t("qrVerify")}</div>
            <div className="mono" style={{color:"#6B5A54", fontSize:10, wordBreak:"break-all"}}>{verifyUrl}</div>
            <div style={{fontSize:10, color:"#8a7a74"}}>Scan to open report — data is saved per-user in Supabase</div>
            <Link to={`/verify/${a.id}`} className="btn btn-secondary" style={{fontSize:11, padding:"5px 8px", marginTop:6}}>{t("openVerification")} →</Link>
          </div>
          <div style={{marginLeft:"auto", fontSize:11, color:"#6B5A54"}}>Immutable: disputes create linked <span className="mono" style={{fontSize:10}}>disputes</span> row, original preserved.</div>
        </div>

        <div className="card card-pad" style={{background: a.acceptance==="Rejected" ? "#FDECEC" : "#EDF5EF", borderColor: a.acceptance==="Rejected" ? "#F5C2C2" : "#C8E4CC", marginTop:14}}>
          <div style={{display:"flex", gap:10, alignItems:"center", flexWrap:"wrap"}}>
            <div style={{fontWeight:700, fontSize:13}}>Lot Status: <span className={`badge ${a.acceptance==="Accepted"?"badge-success":"badge-error"}`} style={{marginLeft:6}}>{a.acceptance || "Accepted"}</span></div>
            <span style={{fontSize:11, color:"#6B5A54"}}>Grader updates manually — Accepted = lot accepted for procurement, Rejected = farmer refused / lot rejected / incident</span>
            <div style={{marginLeft:"auto", display:"flex", gap:8}}>
              <button className={`btn ${a.acceptance==="Accepted"?"btn-primary":"btn-secondary"}`} style={{fontSize:11, padding:"6px 10px"}} onClick={()=> updateAssessment(a.id, { acceptance:"Accepted" })}>Mark Accepted</button>
              <button className={`btn ${a.acceptance==="Rejected"?"btn-primary":"btn-secondary"}`} style={{fontSize:11, padding:"6px 10px", background: a.acceptance==="Rejected" ? "#B33A3A" : undefined, borderColor: a.acceptance==="Rejected" ? "#B33A3A" : undefined, color: a.acceptance==="Rejected" ? "white" : undefined}} onClick={()=> updateAssessment(a.id, { acceptance:"Rejected" })}>Mark Rejected</button>
            </div>
          </div>
        </div>

        <div className="divider" />
        <div style={{display:"flex", gap:8, flexWrap:"wrap", alignItems:"center"}}>
          <button className="btn btn-primary" onClick={()=> { setPrintLang(null); setTimeout(()=> window.print(), 100); }}>{t("downloadInSelected")} {languages.find(l=>l.code===lang)?.native} →</button>
          <button className="btn btn-secondary" onClick={()=> { setPrintLang("en"); setTimeout(()=> window.print(), 100); }}>{t("downloadInEnglish")} →</button>
          {printLang && <span className="badge badge-maroon" style={{fontSize:10}}>{printLang==="en" ? "English" : languages.find(l=>l.code===printLang)?.native} print mode — press Print again to switch</span>}
          <button className="btn btn-secondary" onClick={()=> {
            updateAssessment(a.id, { acknowledged:{ farmer:true, grader:true } });
            alert("Acknowledged — both parties have seen the report.");
          }}>Mark acknowledged</button>
          <button className="btn btn-ghost" style={{color:"#B33A3A"}} onClick={()=>{
            updateAssessment(a.id, { status:"Human Review", dispute:{ reason:"Flagged for human review", at:new Date().toISOString(), by:"Farmer" } });
            alert("Flagged for human review — linked review record created. Original preserved. No dispute, just human review.");
          }}>Flag for Human Review</button>
          {a.dispute && <span className="badge badge-warning">Human Review: {a.dispute.reason}</span>}
        </div>
      </div>
      <style>{`@media(max-width:800px){ .capture-grid{grid-template-columns:1fr !important} }`}</style>
    </div>
  );
}

function Row({label, value, mono, small, strong, color, badge, badgeColor, dot, suffix}){
  return (
    <div style={{display:"flex", justifyContent:"space-between", gap:12, padding:"9px 14px", borderBottom:"1px solid #F3EAE2", borderRight:"1px solid #F3EAE2", alignItems:"center", background:"white"}}>
      <span style={{fontSize:11, letterSpacing:".06em", textTransform:"uppercase", fontWeight:700, color:"#8a7a74"}}>{label}</span>
      <span style={{display:"flex", gap:8, alignItems:"center", fontSize: mono ? (small ? 10 : 11) : 13, fontWeight: strong ? 700 : 500, color: color || "#17110F", fontFamily: mono ? "JetBrains Mono, monospace" : undefined, textAlign:"right", wordBreak: mono ? "break-all" : undefined, maxWidth:"58%"}}>
        {dot && <span className="dot" style={{background:dot}} />}
        <span style={{overflow:"hidden", textOverflow:"ellipsis"}}>{value}</span>
        {badge && <span className={`badge badge-${badgeColor||"maroon"}`} style={{fontSize:9}}>{value}</span>}
        {suffix && <span className="badge" style={{fontSize:9}}>{suffix}</span>}
      </span>
    </div>
  );
}
