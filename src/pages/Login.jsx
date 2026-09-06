import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useSeo } from "../lib/seo";

export default function Login(){
  useSeo({ title:"Login", description:"Login to OnionSetu as Farmer or Grader with Gmail or phone — access assessments, reports and verification for Lasalgaon APMC.", canonical:"/login" });
  const { login, demoLogin } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const next = loc.state?.from || "/";
  const [role, setRole] = useState("grader");
  const [identifier, setIdentifier] = useState("grader@gmail.com");
  const [password, setPassword] = useState("123456");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  function submit(e){
    e.preventDefault();
    setErr("");
    if(!identifier.trim()){ setErr("Enter your Gmail or phone number."); return; }
    setBusy(true);
    const r = login(identifier.trim(), password, role);
    setBusy(false);
    if(!r.ok) setErr(r.error);
    else nav(next, { replace:true });
  }
  function onRole(r){
    setRole(r);
    if(r==="grader"){ setIdentifier("grader@gmail.com"); setPassword("123456"); }
    else { setIdentifier("farmer@gmail.com"); setPassword("123456"); }
  }
  function usePhone(){
    if(role==="grader") setIdentifier("9876543210");
    else setIdentifier("9876543211");
  }

  return (
    <div style={{minHeight:"100dvh", background:"#FDFBF9", display:"grid", placeItems:"center", padding:"20px 12px"}}>
      <div style={{width:"100%", maxWidth:920, display:"grid", gridTemplateColumns:"1fr 1fr", gap:18}} className="login-grid">
        <div style={{display:"grid", gap:14, alignContent:"center"}}>
          <div style={{display:"flex", gap:10, alignItems:"center"}}>
            <div style={{width:36,height:36, background:"#7A263A", color:"white", display:"grid", placeItems:"center", borderRadius:10, fontFamily:"Fraunces, serif", fontWeight:700}}>◉</div>
            <div><div style={{fontFamily:"Fraunces, serif", fontWeight:700, fontSize:18}}>ONIONSETU</div><div style={{fontSize:10, letterSpacing:".14em", textTransform:"uppercase", color:"#8a7a74", fontWeight:700}}>AI-Assisted Grading</div></div>
          </div>
          <h1 className="h-display" style={{margin:0, fontSize:32, lineHeight:.95}}>Welcome back to<br/><span style={{color:"#7A263A"}}>OnionSetu</span></h1>
          <p style={{margin:0, color:"#6B5A54", fontSize:14}}>Choose your role — <b>Farmer</b> views and verifies your lots; <b>Grader</b> grades, reviews and manages policy.</p>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
            <RoleCard active={role==="farmer"} onClick={()=> onRole("farmer")} title="Farmer" desc="View my lots, reports & QR verification" icon="🌾" />
            <RoleCard active={role==="grader"} onClick={()=> onRole("grader")} title="Grader" desc="Grade lots, human review, policy" icon="◉" />
          </div>
          <div style={{fontSize:12, color:"#8a7a74", background:"white", border:"1px solid #EDE3DC", borderRadius:10, padding:10}}>
            <b>Demo accounts</b> — click a role above (auto-fills). Password is <span className="mono">123456</span><br/>
            Farmer: <span className="mono" style={{fontSize:11}}>farmer@gmail.com</span> or <span className="mono" style={{fontSize:11}}>9876543211</span><br/>
            Grader: <span className="mono" style={{fontSize:11}}>grader@gmail.com</span> or <span className="mono" style={{fontSize:11}}>9876543210</span>
            <div style={{display:"flex", gap:8, marginTop:8, flexWrap:"wrap"}}>
              <button className="btn btn-secondary" style={{fontSize:12, flex:1}} onClick={()=>{ demoLogin("farmer"); nav(next,{replace:true}); }}>Quick as Farmer</button>
              <button className="btn btn-secondary" style={{fontSize:12, flex:1}} onClick={()=>{ demoLogin("grader"); nav(next,{replace:true}); }}>Quick as Grader</button>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="card card-pad" style={{display:"grid", gap:14, alignContent:"start"}}>
          <div>
            <h2 style={{margin:0, fontSize:18, fontWeight:700}}>Login</h2>
            <p style={{margin:"4px 0 0", color:"#6B5A54", fontSize:13}}>Use your Gmail or phone number with the selected role.</p>
          </div>

          <div style={{display:"flex", gap:8, padding:4, background:"#FBF6F0", border:"1px solid #EDE3DC", borderRadius:10}}>
            <button type="button" onClick={()=> onRole("farmer")} className={role==="farmer" ? "btn btn-primary":"btn btn-ghost"} style={{flex:1, fontSize:13, minHeight:38}}>🌾 Farmer</button>
            <button type="button" onClick={()=> onRole("grader")} className={role==="grader" ? "btn btn-primary":"btn btn-ghost"} style={{flex:1, fontSize:13, minHeight:38}}>◉ Grader</button>
          </div>

          <label style={{display:"grid", gap:6}}>
            <span className="label">Gmail or Phone number *</span>
            <input className="input" type="text" required value={identifier} onChange={e=> setIdentifier(e.target.value)} placeholder="farmer@gmail.com or 9876543211" autoComplete="username" inputMode="email" />
            <button type="button" className="btn btn-ghost" style={{fontSize:11, padding:"4px 6px", justifySelf:"start"}} onClick={usePhone}>Use phone instead: {role==="grader" ? "9876543210" : "9876543211"}</button>
          </label>
          <label style={{display:"grid", gap:6}}><span className="label">Password</span>
            <input className="input" type="password" required value={password} onChange={e=> setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </label>

          {err && <div style={{background:"#FDECEC", border:"1px solid #F5C2C2", color:"#B33A3A", borderRadius:10, padding:"10px 12px", fontSize:13}}>{err}</div>}

          <button className="btn btn-primary" type="submit" disabled={busy} style={{width:"100%", minHeight:44}}>{busy ? "Signing in…" : `Login as ${role==="grader"?"Grader":"Farmer"} →`}</button>

          <div style={{textAlign:"center", fontSize:13, color:"#6B5A54"}}>No account? <Link to="/signup" style={{color:"#7A263A", fontWeight:700, textDecoration:"underline"}}>Create one</Link> · <Link to="/landing" style={{color:"#8a7a74"}}>Learn more</Link></div>

          <div style={{fontSize:11, color:"#8a7a74", textAlign:"center", borderTop:"1px solid #F3EAE2", paddingTop:10}}>
            Lasalgaon APMC · Nashik, MH — <Link to="/policy" style={{color:"#7A263A"}}>Policy {role==="grader"?"v2026.1":""}</Link> · <Link to="/sitemap.xml" style={{color:"#7A263A"}}>Sitemap</Link>
          </div>
        </form>
      </div>
      <style>{`@media(max-width:800px){ .login-grid{ grid-template-columns:1fr !important } }`}</style>
    </div>
  );
}
function RoleCard({active, onClick, title, desc, icon}){
  return (
    <button type="button" onClick={onClick} className="card" style={{textAlign:"left", padding:12, borderColor: active ? "#7A263A" : "#EDE3DC", background: active ? "#fdf2f4" : "white", cursor:"pointer"}}>
      <div style={{display:"flex", gap:10, alignItems:"center"}}>
        <span style={{width:32,height:32, borderRadius:8, background: active ? "#7A263A":"#FBF6F0", color: active ? "white":"#7A263A", display:"grid", placeItems:"center", fontWeight:700}}>{icon}</span>
        <div style={{fontWeight:700, fontSize:13}}>{title} {active && <span className="badge badge-maroon" style={{marginLeft:6, fontSize:9}}>Selected</span>}</div>
      </div>
      <div style={{fontSize:11, color:"#6B5A54", marginTop:6}}>{desc}</div>
    </button>
  );
}
