import { useState } from "react";
import { useI18n } from "../lib/i18n";

export default function LanguageGate(){
  const { languages, setLang } = useI18n();
  const [pick, setPick] = useState("en");
  return (
    <div style={{minHeight:"100dvh", background:"#FDFBF9", display:"grid", placeItems:"center", padding:"24px 12px"}}>
      <div style={{width:"100%", maxWidth:460, display:"grid", gap:16, textAlign:"center", justifyItems:"center"}}>
        <div style={{width:48,height:48, background:"#7A263A", color:"white", display:"grid", placeItems:"center", borderRadius:14, fontFamily:"Fraunces, serif", fontWeight:700, fontSize:20}}>O</div>
        <div>
          <h1 className="h-display" style={{margin:0, fontSize:26}}>Choose your language</h1>
          <p style={{margin:"8px 0 0", color:"#6B5A54", fontSize:13}}>English is primary. Hindi and Marathi are supported for core grading workflow.</p>
        </div>
        <div style={{display:"grid", gap:8, width:"100%"}}>
          {languages.map(l=>(
            <button key={l.code} onClick={()=> setPick(l.code)} className="card" style={{padding:12, textAlign:"left", borderColor: pick===l.code ? "#7A263A" : "#EDE3DC", background: pick===l.code ? "#fdf2f4" : "white", cursor:"pointer"}}>
              <b style={{fontSize:13}}>{l.native}</b> <span style={{fontSize:11, color:"#8a7a74"}}>· {l.name}</span>
              {pick===l.code && <span style={{float:"right", color:"#7A263A", fontWeight:800}}>✓</span>}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" style={{minWidth:200, minHeight:44}} onClick={()=> setLang(pick)}>Continue →</button>
      </div>
    </div>
  );
}
