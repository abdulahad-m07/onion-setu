import { useStore } from "../lib/store";
import { useState } from "react";

export default function Reviews(){
  const { assessments, updateAssessment } = useStore();
  const uncertain = assessments.flatMap(a=> (a.onions||[]).filter(o=> o.confidence<60).map(o=> ({...o, assessmentId:a.id, lotId:a.lotId, farmer:a.farmer})));
  const [decisions, setDecisions] = useState({});
  function act(o, action){
    setDecisions(prev=> ({...prev, [o.id+o.assessmentId]: action}));
  }
  return (
    <div style={{display:"grid", gap:14}}>
      <div>
        <h1 className="h-display" style={{fontSize:28, margin:0}}>Review Center</h1>
        <p style={{margin:"4px 0 0", color:"#6B5A54", fontSize:13}}>Human-in-the-loop — uncertain results flagged by the {60}% confidence gate. AI assists, human decides.</p>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", gap:12}}>
        {uncertain.length===0 ? (
          <div className="card card-pad" style={{background:"#EDF5EF", borderColor:"#C8E4CC"}}>No pending reviews — all recent assessments are high-confidence.</div>
        ) : uncertain.map(o=>(
          <div key={o.id+o.assessmentId} className="card card-pad" style={{display:"grid", gap:10}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <span style={{fontWeight:800, color:"#7A263A"}}>{o.id} <span style={{color:"#8a7a74", fontWeight:500}}>· {o.assessmentId}</span></span>
              <span className="badge badge-warning">REVIEW</span>
            </div>
            <div style={{fontSize:13}}><b>AI:</b> {o.defect} · <b>Confidence:</b> {o.confidence}% · <b>Size:</b> {o.sizeMm} mm</div>
            <div style={{fontSize:12, color:"#6B5A54"}}>Reason: Below configured threshold ({60}%) · Lot {o.lotId} · {o.farmer}</div>
            <div style={{display:"flex", gap:8}}>
              <button className={`btn ${decisions[o.id+o.assessmentId]==="accepted" ? "btn-primary":"btn-secondary"}`} style={{flex:1, fontSize:12}} onClick={()=> act(o,"accepted")}>Accept AI</button>
              <button className={`btn ${decisions[o.id+o.assessmentId]==="changed" ? "btn-primary":"btn-secondary"}`} style={{flex:1, fontSize:12}} onClick={()=> act(o,"changed")}>Change</button>
              <button className="btn btn-ghost" style={{fontSize:12}} onClick={()=> act(o,"reviewed")}>Review</button>
            </div>
            {decisions[o.id+o.assessmentId] && <div className="badge badge-success" style={{justifySelf:"start"}}>Decision recorded: {decisions[o.id+o.assessmentId]}</div>}
          </div>
        ))}
      </div>
      <div className="card card-pad" style={{background:"#FBF6F0"}}>
        <div style={{fontWeight:700, fontSize:13}}>How review works</div>
        <div style={{fontSize:12, color:"#6B5A54", display:"flex", flexWrap:"wrap", gap:6, marginTop:6, alignItems:"center"}}>
          <span className="badge">System-triggered: low confidence</span> <span>→</span> <span className="badge">User-triggered: Flag Report</span> <span>→</span> <span className="badge badge-success">Linked review record — original preserved</span>
        </div>
      </div>
    </div>
  );
}
