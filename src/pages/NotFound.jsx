import { Link } from "react-router-dom";
import { useSeo } from "../lib/seo";
export default function NotFound(){
  useSeo({ title:"Page not found", description:"The page you requested does not exist. Return to OnionSetu dashboard or start a new assessment.", canonical:"/404", noindex:true });
  return (
    <div style={{maxWidth:560, margin:"40px auto", textAlign:"center", display:"grid", gap:16, padding:"24px 12px"}}>
      <div style={{width:64,height:64, borderRadius:"50%", background:"#FDECEC", border:"2px solid #F5C2C2", display:"grid", placeItems:"center", margin:"0 auto", color:"#B33A3A", fontWeight:800, fontSize:28}}>!</div>
      <h1 className="h-display" style={{margin:0}}>Page not found</h1>
      <p style={{margin:0, color:"#6B5A54", fontSize:14}}>The link you followed may be broken or the page has moved. OnionSetu reports are still accessible from your dashboard.</p>
      <div style={{display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap"}}>
        <Link to="/" className="btn btn-primary">Go to dashboard</Link>
        <Link to="/assessments" className="btn btn-secondary">View assessments</Link>
        <Link to="/new" className="btn btn-ghost">Start new assessment</Link>
      </div>
      <div style={{fontSize:12, color:"#8a7a74", display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap"}}>
        <Link to="/policy" style={{color:"#7A263A", textDecoration:"underline"}}>Policy</Link>
        <span>·</span>
        <Link to="/reports" style={{color:"#7A263A", textDecoration:"underline"}}>Reports</Link>
        <span>·</span>
        <Link to="/sitemap.xml" style={{color:"#7A263A", textDecoration:"underline"}}>Sitemap</Link>
      </div>
    </div>
  );
}
