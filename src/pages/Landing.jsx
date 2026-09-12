import { Link } from "react-router-dom";
import { useSeo } from "../lib/seo";

export default function Landing(){
  useSeo({ title:"Landing", description:"Onion quality assessment — standardized sampling and grading for procurement centers.", canonical:"/landing" });
  return (
    <div style={{maxWidth:720, margin:"0 auto", padding:"40px 16px", display:"grid", gap:16, textAlign:"center"}}>
      <div style={{display:"grid", gap:8, justifyItems:"center"}}>
        <div style={{width:40,height:40, background:"#7A263A", color:"white", display:"grid", placeItems:"center", borderRadius:10, fontFamily:"Fraunces, serif", fontWeight:700}}>O</div>
        <div style={{fontFamily:"Fraunces, serif", fontWeight:700, fontSize:18}}>ONIONSETU</div>
        <div style={{fontSize:11, letterSpacing:".12em", textTransform:"uppercase", color:"#8a7a74", fontWeight:700}}>Digital Onion Grading</div>
      </div>
      <h1 className="h-display" style={{fontSize:28, margin:0}}>Onion quality assessment for procurement</h1>
      <p style={{color:"#6B5A54", fontSize:14, margin:0}}>Standardized sampling · image validation · size and visible defect check · versioned policy (A/B/C/Reject + URS) · human review · report with QR and SHA-256. Works offline, syncs when online.</p>
      <div style={{display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginTop:8}}>
        <Link to="/new" className="btn btn-primary" style={{padding:"10px 18px"}}>Start Assessment</Link>
        <Link to="/" className="btn btn-secondary" style={{padding:"10px 18px"}}>Open app</Link>
      </div>
      <p style={{fontSize:11, color:"#8a7a74"}}>Visible external assessment only — internal defects require physical inspection. See limitations in Settings.</p>
    </div>
  );
}
