import { useState } from "react";
import { useI18n } from "../lib/i18n";

export default function LanguageGate(){
  const { languages, setLang, t } = useI18n();
  const [pick, setPick] = useState("");

  return (
    <div style={{minHeight:"100dvh", background:"#FDFBF9", display:"grid", placeItems:"center", padding:"24px 12px"}}>
      <div style={{width:"100%", maxWidth:820, display:"grid", gap:18}}>
        <div style={{textAlign:"center", display:"grid", gap:8, justifyItems:"center"}}>
          <div style={{width:48,height:48, background:"#7A263A", color:"white", display:"grid", placeItems:"center", borderRadius:14, fontFamily:"Fraunces, serif", fontWeight:700, fontSize:20}}>◉</div>
          <h1 className="h-display" style={{margin:0, fontSize:28}}>Choose your language <span style={{color:"#7A263A"}}>/ भाषा चुनें</span></h1>
          <p style={{margin:0, color:"#6B5A54", fontSize:13, maxWidth:560}}>OnionSetu works in all Indian languages — pick one to continue. You can change it anytime in Settings. / सभी भारतीय भाषाओं में उपलब्ध — आगे बढ़ने के लिए चुनें।</p>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px,1fr))", gap:10}}>
          {languages.map(l=>(
            <button key={l.code} onClick={()=> setPick(l.code)} className="card" style={{padding:14, textAlign:"left", borderColor: pick===l.code ? "#7A263A" : "#EDE3DC", background: pick===l.code ? "#fdf2f4" : "white", cursor:"pointer", display:"flex", gap:12, alignItems:"center"}}>
              <span style={{width:36,height:36, borderRadius:8, background: pick===l.code ? "#7A263A" : "#FBF6F0", color: pick===l.code ? "white":"#7A263A", display:"grid", placeItems:"center", fontWeight:700}}>{l.flag}</span>
              <div>
                <div style={{fontWeight:700, fontSize:13}}>{l.native} <span style={{color:"#8a7a74", fontWeight:500, fontSize:11}}>· {l.name}</span></div>
                <div style={{fontSize:11, color:"#6B5A54"}}>{l.code.toUpperCase()}</div>
              </div>
              {pick===l.code && <span style={{marginLeft:"auto", color:"#7A263A", fontWeight:800}}>✓</span>}
            </button>
          ))}
        </div>
        <div style={{display:"grid", placeItems:"center", gap:8}}>
          <button className="btn btn-primary" style={{minWidth:200, minHeight:44}} disabled={!pick} onClick={()=> setLang(pick)}>{pick ? `Continue in ${languages.find(l=>l.code===pick)?.native} →` : "Select a language"}</button>
          <div style={{fontSize:11, color:"#8a7a74"}}>22 languages + English · Report can be downloaded in your language or English</div>
        </div>
      </div>
    </div>
  );
}
