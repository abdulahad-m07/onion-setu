import { Link } from "react-router-dom";
import { useStore } from "../lib/store";

export default function Dashboard(){
  const { assessments, activePolicy } = useStore();
  const today = assessments.filter(a=> a.date.startsWith("2026-09-05")).length;
  const gradeAAvg = Math.round(assessments.slice(0,3).reduce((s,a)=>s+a.gradeA,0)/Math.max(1,Math.min(3,assessments.length)));
  const humanReviews = assessments.reduce((s,a)=>s+a.humanReviews,0);
  const pending = assessments.filter(a=> a.status==="Human Review" || a.status==="Disputed").length;

  return (
    <div style={{display:"grid", gap:18}}>
      <div style={{display:"flex", flexWrap:"wrap", alignItems:"end", justifyContent:"space-between", gap:12}}>
        <div>
          <h1 className="h-display" style={{fontSize:32, margin:0}}>Dashboard</h1>
          <p style={{margin:"6px 0 0", color:"#6B5A54", fontSize:14}}>AI-assisted procurement overview — Lasalgaon APMC · <span style={{color:"#7A263A", fontWeight:600}}>NAFED / NCCF</span></p>
        </div>
        <div style={{display:"flex", gap:8}}>
          <Link to="/new" className="btn btn-primary">Start Assessment</Link>
          <Link to="/assessments" className="btn btn-secondary">View all</Link>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px,1fr))", gap:12}}>
        <Metric label="Today's Assessments" value={today} sub="Sep 5, 2026" />
        <Metric label="Grade A %" value={`${gradeAAvg}%`} sub={`Policy ${activePolicy.version}`} accent />
        <Metric label="Human Reviews" value={humanReviews} sub="Flagged by gate" />
        <Metric label="Pending Disputes" value={pending} sub="Needs attention" warn={pending>0} />
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1.2fr .8fr", gap:12}} className="dash-grid">
        <div className="card">
          <div style={{padding:"16px 18px", borderBottom:"1px solid #EDE3DC", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <h3 style={{margin:0, fontSize:14, fontWeight:700}}>Recent assessments</h3>
            <Link to="/assessments" style={{fontSize:13, color:"#7A263A", fontWeight:600}}>View all →</Link>
          </div>
          <div style={{divide:""}}>
            {assessments.slice(0,4).map(a=>(
              <div key={a.id} style={{display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderBottom:"1px solid #F3EAE2"}}>
                <div style={{width:42,height:42, borderRadius:10, background:"#FBF6F0", border:"1px solid #EDE3DC", display:"grid", placeItems:"center", fontFamily:"Fraunces, serif", fontWeight:700, color:"#7A263A"}}>{a.id.slice(-2)}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:700, fontSize:13.5}}>{a.id} <span style={{color:"#8a7a74", fontWeight:500}}>· {a.lotId}</span></div>
                  <div style={{fontSize:12, color:"#6B5A54"}}>{a.farmer} · {a.center}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:700, fontSize:13}}>{a.gradeA}% Grade A <span style={{color:"#8a7a74", fontWeight:500}}>/ {a.urs}% URS</span></div>
                  <div><StatusBadge status={a.status} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"grid", gap:12}}>
          <div className="card card-pad">
            <h3 style={{margin:"0 0 10px", fontSize:14, fontWeight:700}}>Activity</h3>
            <div style={{display:"grid", gap:10, fontSize:13}}>
              <Activity dot="#3F7D4A" text="Assessment completed — OG-2026-0241 (68% Grade A)" time="10:24 AM" />
              <Activity dot="#D99024" text="Human review requested — O8 (47% confidence)" time="10:22 AM" />
              <Activity dot="#7A263A" text="Report generated — SHA-256 stamped" time="10:25 AM" />
              <Activity dot="#17110F" text="Policy in use — v2026.1 (35–70 mm)" time="Active" />
              <Activity dot="#B33A3A" text="Dispute opened — OG-2026-0238" time="Yesterday" />
            </div>
          </div>
          <div className="card card-pad" style={{background:"#7A263A", color:"white", borderColor:"#7A263A"}}>
            <div style={{fontSize:12, letterSpacing:".08em", textTransform:"uppercase", opacity:.8, fontWeight:700}}>Differentiators</div>
            <ul style={{margin:"10px 0 0", paddingLeft:18, fontSize:13, lineHeight:1.6}}>
              <li>Multi-view capture with reference calibration</li>
              <li>On-device AI · Image Quality Gate</li>
              <li>Human-in-the-loop · Versioned Policy</li>
              <li>Evidence-backed reports · Offline-first</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card card-pad">
        <h3 style={{margin:"0 0 12px", fontSize:14, fontWeight:700}}>Architecture</h3>
        <div style={{display:"flex", flexWrap:"wrap", gap:8, alignItems:"center", fontSize:12, fontWeight:600, color:"#6B5A54"}}>
          <span className="badge">Capture</span> <span>→</span>
          <span className="badge">Quality Gate</span> <span>→</span>
          <span className="badge">Detection</span> <span>→</span>
          <span className="badge">Size + Defect</span> <span>→</span>
          <span className="badge" style={{background:"#FEF3D8", borderColor:"#FBE2A8"}}>Confidence Gate</span> <span>→</span>
          <span className="badge">Human Review</span> <span>→</span>
          <span className="badge" style={{background:"#fdf2f4", borderColor:"#F0D0D8", color:"#7A263A"}}>Versioned Policy</span> <span>→</span>
          <span className="badge" style={{background:"#EDF5EF", borderColor:"#C8E4CC", color:"#3F7D4A"}}>Grade A / URS</span> <span>→</span>
          <span className="badge">Farmer + Grader Review</span> <span>→</span>
          <span className="badge">Report · SHA-256 · QR</span> <span>→</span>
          <span className="badge">Offline Sync → Supabase</span>
        </div>
        <div style={{marginTop:10, fontSize:12, color:"#8a7a74"}}>AI assists the grader — it does not replace the grader. Low-confidence results are flagged for human review and original records are preserved.</div>
      </div>

      <style>{`@media(max-width:900px){ .dash-grid{grid-template-columns:1fr !important} }`}</style>
    </div>
  );
}
function Metric({label,value,sub,accent,warn}){
  return (
    <div className="card card-pad" style={{borderLeft: accent ? "3px solid #7A263A" : warn ? "3px solid #D99024" : "1px solid #EDE3DC"}}>
      <div style={{fontSize:11, letterSpacing:".08em", textTransform:"uppercase", color:"#8a7a74", fontWeight:700}}>{label}</div>
      <div style={{fontFamily:"Fraunces, serif", fontWeight:700, fontSize:28, marginTop:6, color: accent ? "#7A263A" : "#17110F"}}>{value}</div>
      <div style={{fontSize:12, color:"#6B5A54"}}>{sub}</div>
    </div>
  );
}
function StatusBadge({status}){
  const map={ Completed:"badge-success", "Human Review":"badge-warning", Disputed:"badge-error", "Sync Pending":"badge-offline", Synced:"badge-success" };
  return <span className={`badge ${map[status]||""}`} style={{fontSize:10}}>{status}</span>;
}
function Activity({dot,text,time}){
  return (
    <div style={{display:"flex", gap:10, alignItems:"start"}}>
      <span className="dot" style={{background:dot, marginTop:7, flexShrink:0}} />
      <div style={{flex:1}}>{text}</div>
      <span style={{fontSize:11, color:"#8a7a74", whiteSpace:"nowrap"}}>{time}</span>
    </div>
  );
}
