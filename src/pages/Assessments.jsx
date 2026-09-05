import { Link } from "react-router-dom";
import { useStore } from "../lib/store";
import { useState } from "react";

export default function Assessments(){
  const { assessments } = useStore();
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const statuses = ["All","Completed","Human Review","Disputed","Sync Pending"];
  const filtered = assessments.filter(a=>{
    if(filter!=="All" && a.status!==filter) return false;
    if(q && !(`${a.id} ${a.lotId} ${a.farmer} ${a.center}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });
  return (
    <div style={{display:"grid", gap:14}}>
      <div style={{display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:12, alignItems:"end"}}>
        <div>
          <h1 className="h-display" style={{fontSize:28, margin:0}}>Assessments</h1>
          <p style={{margin:"4px 0 0", color:"#6B5A54", fontSize:13}}>History — every report is immutable; corrections create linked records.</p>
        </div>
        <Link to="/new" className="btn btn-primary">New Assessment</Link>
      </div>
      <div className="card card-pad" style={{display:"flex", gap:8, flexWrap:"wrap", alignItems:"center"}}>
        <input className="input" placeholder="Search ID, lot, farmer, center…" value={q} onChange={e=>setQ(e.target.value)} style={{maxWidth:320}} />
        <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
          {statuses.map(s=>(
            <button key={s} className={filter===s ? "btn btn-primary":"btn btn-secondary"} style={{fontSize:12, padding:"7px 10px"}} onClick={()=>setFilter(s)}>{s}</button>
          ))}
        </div>
        <span style={{marginLeft:"auto", fontSize:12, color:"#8a7a74"}}>{filtered.length} records</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Assessment ID</th><th>Lot · Farmer</th><th>Date</th><th>Grade</th><th>Status</th><th>Sync</th><th>Policy</th><th></th></tr></thead>
          <tbody>
            {filtered.map(a=>(
              <tr key={a.id}>
                <td><span className="mono" style={{fontWeight:700, color:"#7A263A"}}>{a.id}</span><div style={{fontSize:11, color:"#8a7a74"}}>{a.lotId}</div></td>
                <td><div style={{fontWeight:600, fontSize:13}}>{a.farmer}</div><div style={{fontSize:11, color:"#6B5A54"}}>{a.center}</div></td>
                <td style={{fontSize:12}}>{new Date(a.date).toLocaleDateString()}<div style={{fontSize:11, color:"#8a7a74"}}>{a.assessor}</div></td>
                <td><b>{a.gradeA}%</b> <span style={{color:"#8a7a74"}}>/ {a.urs}%</span><div style={{fontSize:11, color:"#6B5A54"}}>{a.sampleSize} onions</div></td>
                <td><Status status={a.status} /></td>
                <td><span className={`badge ${a.sync==="Offline"||a.sync==="Sync Pending" ? "badge-offline":"badge-success"}`} style={{fontSize:10}}>{a.sync}</span></td>
                <td><span className="badge badge-maroon" style={{fontSize:10}}>{a.policyVersion}</span></td>
                <td><Link to={`/reports/${a.id}`} className="btn btn-secondary" style={{fontSize:12, padding:"6px 10px"}}>Report →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Status({status}){
  const map={ Completed:"badge-success", "Human Review":"badge-warning", Disputed:"badge-error", "Sync Pending":"badge-offline" };
  return <span className={`badge ${map[status]||"badge"}`} style={{fontSize:10}}>{status}</span>;
}
