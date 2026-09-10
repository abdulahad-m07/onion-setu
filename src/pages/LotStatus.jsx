import { Link } from "react-router-dom";
import { useStore } from "../lib/store";
import { useAuth } from "../lib/auth";
import { useSeo, Breadcrumbs } from "../lib/seo";
import { useI18n } from "../lib/i18n";
import { useState } from "react";

export default function LotStatus(){
  const { assessments, updateAssessment } = useStore();
  const { user } = useAuth();
  const { t } = useI18n();
  const isGrader = user?.role==="grader";
  useSeo({ title:"Lot Status", description:"Lot acceptance — Accepted or Human Review. Grader can Accept or Reject lots here.", canonical:"/lot-status" });
  const [filter, setFilter] = useState("All"); // All, Accepted, Human Review
  // Only show Accepted or Human Review, not Rejected (as requested)
  const base = assessments.filter(a=> (a.acceptance==="Accepted" || a.status==="Human Review") && a.acceptance!=="Rejected");
  const filtered = base.filter(a=>{
    if(filter==="Accepted" && a.acceptance!=="Accepted") return false;
    if(filter==="Human Review" && a.status!=="Human Review") return false;
    return true;
  });
  return (
    <div style={{display:"grid", gap:14}}>
      <Breadcrumbs items={[{label:"Home", href:"/"},{label:"Lot Status", href:"/lot-status"}]} />
      <div style={{display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:12, alignItems:"end"}}>
        <div>
          <h1 className="h-display" style={{fontSize:28, margin:0}}>Lot Status</h1>
          <p style={{margin:"4px 0 0", color:"#6B5A54", fontSize:13}}>Only <b>Accepted</b> or <b>Human Review</b> lots — Rejected are hidden. Grader can Accept or Reject from here.</p>
        </div>
        <div style={{display:"flex", gap:8}}>
          <button className={filter==="All"?"btn btn-primary":"btn btn-secondary"} style={{fontSize:12}} onClick={()=> setFilter("All")}>All ({base.length})</button>
          <button className={filter==="Accepted"?"btn btn-primary":"btn btn-secondary"} style={{fontSize:12}} onClick={()=> setFilter("Accepted")}>Accepted</button>
          <button className={filter==="Human Review"?"btn btn-primary":"btn btn-secondary"} style={{fontSize:12}} onClick={()=> setFilter("Human Review")}>Human Review</button>
        </div>
      </div>
      <div style={{display:"grid", gap:10}}>
        {filtered.length===0 ? (
          <div className="card card-pad" style={{textAlign:"center", color:"#6B5A54"}}>No lots in this filter. Rejected lots are hidden here — see Assessments for all.</div>
        ) : filtered.map(a=>(
          <div key={a.id} className="card card-pad" style={{display:"flex", gap:14, alignItems:"center", flexWrap:"wrap"}}>
            <div style={{width:48,height:48, borderRadius:10, background: a.acceptance==="Accepted" ? "#EDF5EF" : "#FEF3D8", border:"1px solid #EDE3DC", display:"grid", placeItems:"center", fontWeight:700, color: a.acceptance==="Accepted" ? "#3F7D4A" : "#D99024"}}>{a.acceptance==="Accepted" ? "A" : "H"}</div>
            <div style={{flex:1, minWidth:200}}>
              <div style={{fontWeight:700}}>{a.id} — {a.lotId} <span className={`badge ${a.status==="Human Review"?"badge-warning":"badge-success"}`} style={{marginLeft:6}}>{a.status}</span> <span className={`badge ${a.acceptance==="Accepted"?"badge-success":"badge-warning"}`} style={{marginLeft:6}}>{a.acceptance}</span></div>
              <div style={{fontSize:12, color:"#6B5A54"}}>{a.farmer} · {a.center} · {a.gradeA}% Grade A / {a.urs}% URS · {new Date(a.date).toLocaleDateString()}</div>
            </div>
            <div style={{display:"flex", gap:8, alignItems:"center"}}>
              <Link to={`/reports/${a.id}`} className="btn btn-secondary" style={{fontSize:12}}>Open report →</Link>
              {isGrader ? (
                <>
                  <button className={`btn ${a.acceptance==="Accepted"?"btn-primary":"btn-secondary"}`} style={{fontSize:12}} onClick={()=> updateAssessment(a.id, { acceptance:"Accepted" })}>Accept</button>
                  <button className={`btn ${a.acceptance==="Rejected"?"btn-primary":"btn-secondary"}`} style={{fontSize:12, background: a.acceptance==="Rejected" ? "#B33A3A" : undefined, borderColor: a.acceptance==="Rejected" ? "#B33A3A" : undefined, color: a.acceptance==="Rejected" ? "white" : undefined}} onClick={()=> updateAssessment(a.id, { acceptance:"Rejected" })}>Reject</button>
                </>
              ) : (
                <span className="badge" style={{fontSize:10}}>Grader only can Accept/Reject</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{fontSize:11, color:"#8a7a74", textAlign:"center"}}>Rejected lots are hidden here — they remain in Assessments and Reports for audit, but not in Lot Status. Lot Status is Accepted / Human Review only, manually updated by grader.</div>
    </div>
  );
}
