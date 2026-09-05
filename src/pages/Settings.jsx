import { useStore } from "../lib/store";

export default function Settings(){
  const { offline, setOffline, syncAll, pendingCount, activePolicy } = useStore();
  return (
    <div style={{display:"grid", gap:14, maxWidth:820}}>
      <h1 className="h-display" style={{fontSize:28, margin:0}}>Settings</h1>
      <div className="card card-pad">
        <h3 style={{margin:"0 0 10px", fontSize:14, fontWeight:700}}>Offline & Sync</h3>
        <div style={{display:"flex", gap:10, alignItems:"center", flexWrap:"wrap"}}>
          <span className={offline ? "badge badge-offline":"badge badge-success"}>{offline ? "Offline mode":"Online"}</span>
          <button className="btn btn-secondary" onClick={()=> setOffline(v=>!v)}>{offline ? "Go online":"Go offline"}</button>
          <button className="btn btn-primary" onClick={syncAll} disabled={!offline && pendingCount===0}>Sync now</button>
          <span style={{fontSize:12, color:"#6B5A54"}}>{pendingCount} pending · Local encrypted queue → Supabase Storage + PostgreSQL</span>
        </div>
        <p style={{margin:"10px 0 0", fontSize:12, color:"#6B5A54"}}>Complete capture-to-report works offline. Only sync requires connectivity — deliberate for rural mandi gaps. Report is usable via QR immediately after generation.</p>
      </div>
      <div className="card card-pad">
        <h3 style={{margin:"0 0 10px", fontSize:14, fontWeight:700}}>System</h3>
        <div style={{display:"grid", gap:8, fontSize:13}}>
          <div><b>Active policy:</b> {activePolicy.version} ({activePolicy.sizeBand.min}–{activePolicy.sizeBand.max} mm)</div>
          <div><b>Model:</b> onion-grade-v1.1 (MobileNetV2) — demo inference</div>
          <div><b>Confidence threshold:</b> 60% (prototype, configurable)</div>
          <div><b>Backend:</b> Supabase — PostgreSQL · Storage · Auth · RLS · SHA-256 tamper evidence</div>
        </div>
      </div>
      <div className="card card-pad" style={{background:"#FFFEFD"}}>
        <h3 style={{margin:"0 0 8px", fontSize:14, fontWeight:700}}>Known Limitations (transparent)</h3>
        <ul style={{margin:0, paddingLeft:18, fontSize:12, color:"#6B5A54", lineHeight:1.6}}>
          <li>Analyzes visible characteristics only — cannot reliably detect internal rot invisible externally</li>
          <li>Does not guarantee perfect accuracy; depends on image quality and representative sampling</li>
          <li>Size estimation accuracy decreases for strongly non-globular onions</li>
          <li>Uses human review for uncertain cases; requires real-world validation before production deployment</li>
          <li>SHA-256 provides tamper evidence for stored photo set, not proof of physical sample authenticity</li>
        </ul>
      </div>
      <div className="card card-pad" style={{background:"#7A263A", color:"white"}}>
        <div style={{fontWeight:700}}>Research positioning</div>
        <div style={{fontSize:12, opacity:.9, marginTop:4}}>OnionSetu does not claim a new CNN. Innovation is the integrated procurement workflow: multi-view capture + representative sampling + quality gate + on-device AI + size estimation + confidence gate + human review + versioned policy + evidence + auditability + offline-first.</div>
      </div>
    </div>
  );
}
