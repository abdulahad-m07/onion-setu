import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useSeo } from "../lib/seo";

export default function Signup(){
  useSeo({ title:"Sign up", description:"Create a Farmer or Grader account on OnionSetu with Gmail or phone — get access tailored to your role.", canonical:"/signup" });
  const { signup } = useAuth();
  const nav = useNavigate();
  const [role, setRole] = useState("farmer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [center, setCenter] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  function submit(e){
    e.preventDefault();
    setErr("");
    if(!name.trim() || !password) { setErr("Please fill name and password."); return; }
    if(!email.trim() && !phone.trim()){ setErr("Enter a Gmail address or phone number."); return; }
    if(email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){ setErr("Enter a valid Gmail address (e.g., ramesh@gmail.com)."); return; }
    if(phone.trim() && !/^[6-9]\d{9}$/.test(phone.trim())){ setErr("Enter a valid 10-digit phone number starting with 6-9."); return; }
    setBusy(true);
    const r = signup({ name: name.trim(), email: email.trim(), phone: phone.trim(), password, role, center: center.trim() });
    setBusy(false);
    if(!r.ok) setErr(r.error);
    else nav("/", { replace:true });
  }

  return (
    <div style={{minHeight:"100dvh", background:"#FDFBF9", display:"grid", placeItems:"center", padding:"20px 12px"}}>
      <div style={{width:"100%", maxWidth:920, display:"grid", gridTemplateColumns:"1fr 1fr", gap:18}} className="login-grid">
        <div style={{display:"grid", gap:14, alignContent:"center"}}>
          <div style={{display:"flex", gap:10, alignItems:"center"}}>
            <div style={{width:36,height:36, background:"#7A263A", color:"white", display:"grid", placeItems:"center", borderRadius:10, fontFamily:"Fraunces, serif", fontWeight:700}}>◉</div>
            <div><div style={{fontFamily:"Fraunces, serif", fontWeight:700, fontSize:18}}>ONIONSETU</div><div style={{fontSize:10, letterSpacing:".14em", textTransform:"uppercase", color:"#8a7a74", fontWeight:700}}>AI-Assisted Grading</div></div>
          </div>
          <h1 className="h-display" style={{margin:0, fontSize:32, lineHeight:.95}}>Create your<br/><span style={{color:"#7A263A"}}>OnionSetu</span> account</h1>
          <p style={{margin:0, color:"#6B5A54", fontSize:14}}>One account, two roles. Use Gmail or phone — no onionsetu.in needed.</p>
          <div style={{background:"white", border:"1px solid #EDE3DC", borderRadius:12, padding:12, fontSize:12, color:"#6B5A54"}}>
            <b>Farmer</b> can: view Dashboard (my lots), Assessments (my lots), Reports + QR verify, Policy (read-only).<br/>
            <b>Grader</b> can: everything Farmer can + create assessments, human review queue, switch active policy.
          </div>
        </div>

        <form onSubmit={submit} className="card card-pad" style={{display:"grid", gap:14, alignContent:"start"}}>
          <h2 style={{margin:0, fontSize:18, fontWeight:700}}>Sign up</h2>

          <div style={{display:"flex", gap:8, padding:4, background:"#FBF6F0", border:"1px solid #EDE3DC", borderRadius:10}}>
            <button type="button" onClick={()=> setRole("farmer")} className={role==="farmer" ? "btn btn-primary":"btn btn-ghost"} style={{flex:1, fontSize:13}}>🌾 Farmer</button>
            <button type="button" onClick={()=> setRole("grader")} className={role==="grader" ? "btn btn-primary":"btn btn-ghost"} style={{flex:1, fontSize:13}}>◉ Grader</button>
          </div>

          <label style={{display:"grid", gap:6}}><span className="label">Full name *</span>
            <input className="input" required value={name} onChange={e=> setName(e.target.value)} placeholder={role==="grader" ? "S. Kulkarni" : "Ramesh Patil"} autoComplete="name" />
          </label>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}} className="signup-grid">
            <label style={{display:"grid", gap:6}}><span className="label">Gmail *</span>
              <input className="input" type="email" value={email} onChange={e=> setEmail(e.target.value)} placeholder="ramesh@gmail.com" autoComplete="email" />
            </label>
            <label style={{display:"grid", gap:6}}><span className="label">Phone *</span>
              <input className="input" type="tel" inputMode="numeric" value={phone} onChange={e=> setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="9876543211" autoComplete="tel" />
            </label>
          </div>
          <div style={{fontSize:11, color:"#8a7a74", marginTop:-8}}>Enter Gmail <b>or</b> phone (or both). At least one is required. Phone must be 10 digits.</div>
          <label style={{display:"grid", gap:6}}><span className="label">Password *</span>
            <input className="input" type="password" required value={password} onChange={e=> setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" />
          </label>
          <label style={{display:"grid", gap:6}}><span className="label">{role==="grader" ? "Procurement center" : "Village / Center"} <span style={{color:"#8a7a74", fontWeight:400}}>(optional)</span></span>
            <input className="input" value={center} onChange={e=> setCenter(e.target.value)} placeholder={role==="grader" ? "Lasalgaon APMC — NAFED" : "Lasalgaon"} />
          </label>

          {err && <div style={{background:"#FDECEC", border:"1px solid #F5C2C2", color:"#B33A3A", borderRadius:10, padding:"10px 12px", fontSize:13}}>{err}</div>}

          <button className="btn btn-primary" type="submit" disabled={busy} style={{width:"100%", minHeight:44}}>{busy ? "Creating…" : `Create ${role} account →`}</button>

          <div style={{textAlign:"center", fontSize:13, color:"#6B5A54"}}>Already have an account? <Link to="/login" style={{color:"#7A263A", fontWeight:700, textDecoration:"underline"}}>Log in</Link></div>
        </form>
      </div>
      <style>{`@media(max-width:800px){ .login-grid{ grid-template-columns:1fr !important } .signup-grid{ grid-template-columns:1fr !important } }`}</style>
    </div>
  );
}
