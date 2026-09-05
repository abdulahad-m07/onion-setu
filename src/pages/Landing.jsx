import { Link } from "react-router-dom";

export default function Landing(){
  return (
    <div style={{display:"grid", gap:20, maxWidth:1100, margin:"0 auto", padding:"18px 14px 40px"}}>
      <header style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:12}}>
        <div style={{display:"flex", gap:10, alignItems:"center"}}>
          <div style={{width:34,height:34, background:"#7A263A", color:"white", display:"grid", placeItems:"center", borderRadius:10, fontFamily:"Fraunces, serif", fontWeight:700}}>◉</div>
          <div><div style={{fontFamily:"Fraunces, serif", fontWeight:700}}>ONIONSETU</div><div style={{fontSize:10, letterSpacing:".12em", textTransform:"uppercase", color:"#8a7a74", fontWeight:700}}>AI-Assisted Onion Quality Assessment</div></div>
        </div>
        <Link to="/" className="btn btn-primary">Open app →</Link>
      </header>
      <div style={{display:"grid", gridTemplateColumns:"1.1fr .9fr", gap:18, alignItems:"center"}} className="landing-hero">
        <div>
          <h1 className="h-display" style={{fontSize:44, margin:0, lineHeight:.9}}>Smarter<br/>Onion Grading.<br/><span style={{color:"#7A263A"}}>Stronger</span><br/>Procurement<br/>Evidence.</h1>
          <p style={{color:"#6B5A54", fontSize:15, marginTop:12, maxWidth:560}}>AI-assisted, smartphone-based onion quality assessment designed for practical procurement workflows. Representative sampling · Multi-view capture · Human-in-the-loop.</p>
          <div style={{display:"flex", gap:10, marginTop:14, flexWrap:"wrap"}}>
            <Link to="/new" className="btn btn-primary" style={{padding:"12px 18px"}}>Start Assessment</Link>
            <Link to="/" className="btn btn-secondary" style={{padding:"12px 18px"}}>View Demo</Link>
          </div>
          <div style={{display:"flex", gap:8, marginTop:14, flexWrap:"wrap"}}>
            <span className="badge">Offline-first</span><span className="badge badge-maroon">Versioned Policy</span><span className="badge badge-success">SHA-256 Evidence</span><span className="badge">Supabase</span>
          </div>
        </div>
        <div className="card" style={{overflow:"hidden"}}>
          <img src="https://images.unsplash.com/photo-1508747703725-719777637510?w=800&h=600&fit=crop" alt="Onions" style={{width:"100%", height:320, objectFit:"cover"}} />
          <div style={{padding:12, display:"flex", gap:8, flexWrap:"wrap"}}>
            <span className="badge badge-success">68% Grade A</span><span className="badge">32% URS</span><span className="badge badge-maroon">v2026.1</span><span className="badge">SHA-256</span>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:800px){ .landing-hero{grid-template-columns:1fr !important} }`}</style>
    </div>
  );
}
