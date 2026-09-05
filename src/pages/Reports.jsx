import { Link, useParams } from "react-router-dom";
import { useStore } from "../lib/store";

export function ReportsList(){
  const { assessments } = useStore();
  return (
    <div style={{display:"grid", gap:14}}>
      <h1 className="h-display" style={{fontSize:28, margin:0}}>Reports</h1>
      <div style={{display:"grid", gap:10}}>
        {assessments.map(a=>(
          <Link key={a.id} to={`/reports/${a.id}`} className="card card-pad" style={{display:"flex", gap:14, alignItems:"center"}}>
            <div style={{width:48,height:48, borderRadius:10, background:"#7A263A", color:"white", display:"grid", placeItems:"center", fontWeight:700}}>◉</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700}}>{a.id} — {a.gradeA}% Grade A / {a.urs}% URS <span className={`badge ${a.status==="Disputed"?"badge-error": a.status==="Human Review"?"badge-warning":"badge-success"}`} style={{marginLeft:8}}>{a.status}</span></div>
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
  const a = assessments.find(x=> x.id===id);
  if(!a) return <div className="card card-pad">Report not found.</div>;
  return (
    <div style={{display:"grid", gap:14}}>
      <Link to="/reports" className="btn btn-ghost" style={{justifySelf:"start"}}>← All reports</Link>
      <div className="card card-pad" style={{border:"1px solid #EDE3DC"}}>
        <div style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12}}>
          <div>
            <div style={{fontFamily:"Fraunces, serif", fontWeight:700, fontSize:22, color:"#7A263A"}}>ONIONSETU</div>
            <div style={{fontSize:11, letterSpacing:".12em", textTransform:"uppercase", color:"#8a7a74", fontWeight:700}}>Quality Assessment Report</div>
            <div style={{marginTop:8, fontSize:13}}><b>Assessment ID:</b> <span className="mono">{a.id}</span> · <b>Lot:</b> {a.lotId} · <b>Center:</b> {a.center}</div>
            <div style={{fontSize:13}}><b>Farmer:</b> {a.farmer} · <b>Assessor:</b> {a.assessor} · <b>Date:</b> {new Date(a.date).toLocaleString()}</div>
            <div style={{fontSize:12, color:"#6B5A54"}}>Policy {a.policyVersion} · Model {a.modelVersion} · Location {a.location}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"Fraunces, serif", fontSize:28, fontWeight:700, color:"#7A263A"}}>{a.gradeA}% GRADE A</div>
            <div style={{fontFamily:"Fraunces, serif", fontSize:18, fontWeight:700}}>{a.urs}% URS</div>
            <div style={{marginTop:6}}><span className={`badge ${a.status==="Disputed"?"badge-error":a.status==="Human Review"?"badge-warning":"badge-success"}`}>{a.status}</span> <span className={`badge ${a.sync==="Offline"?"badge-offline":"badge-success"}`}>{a.sync}</span></div>
          </div>
        </div>
        <div className="divider" />
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}} className="report-grid">
          <div>
            <div style={{fontWeight:700, fontSize:13}}>Sample & Results</div>
            <div style={{fontSize:12, color:"#6B5A54"}}>Sample size: {a.sampleSize} onions · Confidence (avg): {a.confidence}% · Human reviews: {a.humanReviews}</div>
            <div style={{marginTop:8, display:"grid", gap:6}}>
              {(a.onions||[]).map(o=>(
                <div key={o.id} style={{display:"flex", gap:8, alignItems:"center", fontSize:12, padding:"6px 8px", border:"1px solid #F3EAE2", borderRadius:8, background:"white"}}>
                  <b>{o.id}</b><span>{o.sizeMm} mm</span><span>·</span><span>{o.defect}</span><span>·</span><span>{o.confidence}%</span>
                  <span style={{marginLeft:"auto"}} className={`badge ${o.grade==="Grade A"?"badge-success":"badge-warning"}`} style={{fontSize:10}}>{o.grade|| (o.sizeMm>=35&&o.sizeMm<=70 && o.defect==="Healthy" ? "Grade A":"URS")}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"grid", gap:10}}>
            <div style={{border:"1px solid #EDE3DC", borderRadius:10, overflow:"hidden"}}>
              <img src="https://images.unsplash.com/photo-1508747703725-719777637510?w=600&h=400&fit=crop" alt="Evidence" style={{width:"100%", height:160, objectFit:"cover"}} />
              <div style={{padding:8, fontSize:11, color:"#6B5A54"}}>Photo evidence — 3 views · Representative sample on mat with 25 mm reference</div>
            </div>
            <div style={{background:"#FBF6F0", border:"1px solid #EDE3DC", borderRadius:10, padding:10}}>
              <div style={{fontWeight:700, fontSize:12}}>Evidence & Integrity</div>
              <div style={{fontSize:11, color:"#6B5A54", marginTop:4, wordBreak:"break-all"}}><b>SHA-256:</b> <span className="mono">{a.hash}</span></div>
              <div style={{fontSize:11, color:"#6B5A54"}}>Timestamp: {new Date(a.date).toLocaleString()} · Farmer ack: {a.acknowledged?.farmer?"Yes":"Pending"} · Grader ack: {a.acknowledged?.grader?"Yes":"Pending"}</div>
              <div style={{fontSize:11, color:"#8a7a74", marginTop:6}}>SHA-256 provides tamper evidence for the stored photo set — not a blockchain.</div>
            </div>
            <div style={{border:"1px solid #EDE3DC", borderRadius:10, padding:10, display:"flex", gap:10, alignItems:"center"}}>
              <div style={{width:64,height:64, border:"1px solid #EDE3DC", borderRadius:8, display:"grid", placeItems:"center", fontSize:10, textAlign:"center", background:"white"}}>QR<br/>Verify</div>
              <div style={{fontSize:11}}>
                <div style={{fontWeight:700}}>QR Verification</div>
                <div className="mono" style={{color:"#6B5A54"}}> /verify/{a.id}</div>
                <Link to={`/verify/${a.id}`} className="btn btn-secondary" style={{fontSize:11, padding:"5px 8px", marginTop:6}}>Open verification →</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="divider" />
        <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={()=> window.print()}>Generate PDF · Print</button>
          <button className="btn btn-secondary" onClick={()=> {
            updateAssessment(a.id, { acknowledged:{ farmer:true, grader:true } });
            alert("Acknowledged — both parties have seen the report.");
          }}>Mark acknowledged</button>
          <button className="btn btn-ghost" style={{color:"#B33A3A"}} onClick={()=>{
            updateAssessment(a.id, { status:"Disputed", dispute:{ reason:"Flagged for second review", at:new Date().toISOString(), by:"Grader" } });
            alert("Flagged — linked review record created. Original preserved (immutability).");
          }}>Flag Report / Second Review</button>
          {a.dispute && <span className="badge badge-error">Disputed: {a.dispute.reason}</span>}
        </div>
        <div style={{marginTop:10, fontSize:11, color:"#8a7a74"}}>Audit: Report is immutable once finalized; disputes create linked records. Supabase PostgreSQL stores structured data; Storage holds photo sets; RLS controls access.</div>
      </div>
      <style>{`@media(max-width:800px){ .report-grid{grid-template-columns:1fr !important} }`}</style>
    </div>
  );
}
