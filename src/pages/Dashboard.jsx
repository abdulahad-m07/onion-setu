import { Link } from "react-router-dom";
import { useStore } from "../lib/store";
import { useAuth } from "../lib/auth";
import { useSeo, Breadcrumbs } from "../lib/seo";

export default function Dashboard(){
  const { user } = useAuth();
  const isFarmer = user?.role==="farmer";
  useSeo({ title:"Dashboard", description: isFarmer ? "Farmer dashboard — track your lots, Grade A results and verified reports at Lasalgaon APMC." : "Live overview of onion grading at Lasalgaon APMC — today's assessments, Grade A averages, pending reviews and recent evidence-backed reports.", canonical:"/" });
  const { assessments, activePolicy } = useStore();
  const visible = isFarmer ? assessments.filter(a=> a.farmer.toLowerCase().includes(user.name.toLowerCase()) || a.farmer==="Ramesh Patil") : assessments;
  const today = assessments.filter(a=> a.date.startsWith("2026-09-05")).length;
  const gradeAAvg = Math.round(assessments.slice(0,3).reduce((s,a)=>s+a.gradeA,0)/Math.max(1,Math.min(3,assessments.length)));
  const humanReviews = assessments.reduce((s,a)=>s+a.humanReviews,0);
  const pending = assessments.filter(a=> a.status==="Human Review" || a.status==="Disputed").length;

  return (
    <div style={{display:"grid", gap:18}}>
      <Breadcrumbs items={[{label:"Home", href:"/"},{label:"Dashboard", href:"/"}]} />
      <div style={{display:"flex", flexWrap:"wrap", alignItems:"end", justifyContent:"space-between", gap:12}}>
        <div>
          <h1 className="h-display" style={{fontSize:32, margin:0}}>{isFarmer ? "My farm — grading overview" : "Onion grading dashboard"}</h1>
          <p style={{margin:"6px 0 0", color:"#6B5A54", fontSize:14}}>{isFarmer ? <>Welcome, <b style={{color:"#7A263A"}}>{user.name}</b> · Farmer · {user.center}</> : <>AI-assisted procurement overview — Lasalgaon APMC · <span style={{color:"#7A263A", fontWeight:600}}>NAFED / NCCF</span> — Logged in as <b>{user?.role}</b></>}</p>
        </div>
        <div style={{display:"flex", gap:8}}>
          <Link to="/new" className="btn btn-primary">Start Assessment</Link>
          <Link to="/assessments" className="btn btn-secondary">View all</Link>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px,1fr))", gap:12}}>
        <Metric label={isFarmer ? "My Assessments" : "Today's Assessments"} value={isFarmer ? visible.length : today} sub={isFarmer ? "Linked to your account" : "Sep 5, 2026"} />
        <Metric label="Grade A %" value={`${gradeAAvg}%`} sub={`Policy ${activePolicy.version}`} accent />
        <Metric label="Human Reviews" value={humanReviews} sub={isFarmer ? "Grader will review" : "Flagged by gate"} />
        <Metric label="Pending Disputes" value={pending} sub="Needs attention" warn={pending>0} />
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1.2fr .8fr", gap:12}} className="dash-grid">
        <div className="card">
          <div style={{padding:"16px 18px", borderBottom:"1px solid #EDE3DC", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <h3 style={{margin:0, fontSize:14, fontWeight:700}}>Recent assessments</h3>
            <Link to="/assessments" style={{fontSize:13, color:"#7A263A", fontWeight:600}}>View all →</Link>
          </div>
          <div style={{divide:""}}>
            {visible.slice(0,4).map(a=>(
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
          <div className="card card-pad">
            <div style={{fontSize:12, letterSpacing:".08em", textTransform:"uppercase", color:"#8a7a74", fontWeight:700}}>How it works</div>
            <div style={{marginTop:8, fontSize:13, color:"#17110F", lineHeight:1.5}}>Capture once · Get instant Grade A / URS · Review together · Walk away with a verified report.</div>
            <div style={{marginTop:8, fontSize:12, color:"#6B5A54"}}>If the result is uncertain, it’s flagged for the grader to confirm — the original record is always preserved.</div>
          </div>
        </div>
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
