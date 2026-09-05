import { useParams, Link } from "react-router-dom";
import { useStore } from "../lib/store";

export default function Verification(){
  const { id } = useParams();
  const { assessments } = useStore();
  const a = assessments.find(x=> x.id===id);
  if(!a) return <div className="card card-pad">No record found for {id}. <Link to="/reports" className="btn btn-secondary" style={{marginLeft:8}}>Browse reports</Link></div>;
  return (
    <div style={{maxWidth:560, margin:"0 auto", display:"grid", gap:14}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"Fraunces, serif", fontWeight:700, fontSize:20, color:"#7A263A"}}>ONIONSETU</div>
        <div style={{fontSize:11, letterSpacing:".12em", textTransform:"uppercase", color:"#8a7a74", fontWeight:700}}>Verification</div>
      </div>
      <div className="card card-pad" style={{textAlign:"center"}}>
        <div style={{width:64,height:64, borderRadius:"50%", background:"#EDF5EF", border:"2px solid #C8E4CC", display:"grid", placeItems:"center", margin:"0 auto", color:"#3F7D4A", fontWeight:800, fontSize:22}}>✓</div>
        <div style={{fontWeight:700, marginTop:10}}>Report Verified</div>
        <div style={{fontSize:12, color:"#6B5A54"}}>This QR corresponds to a valid assessment record.</div>
        <div style={{marginTop:12, background:"#FBF6F0", border:"1px solid #EDE3DC", borderRadius:10, padding:12, textAlign:"left", fontSize:12}}>
          <div><b>Assessment ID:</b> <span className="mono">{a.id}</span></div>
          <div><b>Lot:</b> {a.lotId} · <b>Center:</b> {a.center}</div>
          <div><b>Policy:</b> {a.policyVersion} · <b>Grade:</b> {a.gradeA}% Grade A / {a.urs}% URS</div>
          <div><b>Timestamp:</b> {new Date(a.date).toLocaleString()}</div>
          <div><b>Status:</b> {a.status} · <b>Sync:</b> {a.sync}</div>
          <div style={{marginTop:6, wordBreak:"break-all"}}><b>SHA-256:</b> <span className="mono" style={{fontSize:10}}>{a.hash}</span></div>
        </div>
        <div style={{marginTop:10, fontSize:11, color:"#8a7a74"}}>Recompute the photo-set hash and compare to the stored hash to verify integrity.</div>
        <Link to={`/reports/${a.id}`} className="btn btn-primary" style={{marginTop:12}}>Open full report</Link>
      </div>
    </div>
  );
}
