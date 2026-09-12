import { useStore } from "../lib/store";
import { useSeo, Breadcrumbs } from "../lib/seo";
import { useI18n } from "../lib/i18n";
import MyTranslator from "../components/MyTranslator";

export default function Settings(){
  const { offline, setOffline, syncAll, pendingCount, activePolicy } = useStore();
  const { lang, setLang, languages, t } = useI18n();
  useSeo({ title:"Settings", description:"Manage offline sync, language, and system status for OnionSetu.", canonical:"/settings" });
  return (
    <div style={{display:"grid", gap:14, maxWidth:820}}>
      <Breadcrumbs items={[{label:"Home", href:"/"},{label:"Settings", href:"/settings"}]} />
      <h1 className="h-display" style={{fontSize:28, margin:0}}>{t("settings")}</h1>

      <div className="card card-pad" style={{borderLeft:"3px solid #7A263A"}}>
        <h3 style={{margin:"0 0 10px", fontSize:14, fontWeight:700}}>{t("languageSettings")} — My Translator</h3>
        <p style={{margin:"0 0 10px", fontSize:12, color:"#6B5A54"}}>All 22 Indian languages + English. Wrapped Google Translate + perfect Hindi/Marathi manual. Saved per-device and per-user.</p>
        <MyTranslator variant="settings" />
        <div style={{marginTop:8, fontSize:11, color:"#8a7a74"}}>Current: <b>{languages.find(l=>l.code===lang)?.flag} {languages.find(l=>l.code===lang)?.native} ({lang.toUpperCase()})</b> — change here, in top bar, or on first screen. Report can be downloaded in your language or English.</div>
      </div>

      <div className="card card-pad">
        <h3 style={{margin:"0 0 10px", fontSize:14, fontWeight:700}}>{t("offlineSync")}</h3>
        <div style={{display:"flex", gap:10, alignItems:"center", flexWrap:"wrap"}}>
          <span className={offline ? "badge badge-offline":"badge badge-success"}>{offline ? "Offline mode":"Online"}</span>
          <button className="btn btn-secondary" onClick={()=> setOffline(v=>!v)}>{offline ? "Go online":"Go offline"}</button>
          <button className="btn btn-primary" onClick={syncAll} disabled={!offline && pendingCount===0}>Sync now</button>
          <span style={{fontSize:12, color:"#6B5A54"}}>{pendingCount} pending — per-user Supabase sync</span>
        </div>
        <p style={{margin:"10px 0 0", fontSize:12, color:"#6B5A54"}}>Data is saved per-user in Supabase Postgres + Storage (RLS). Farmer sees only own lots, grader sees all. Works offline, syncs when online.</p>
      </div>
      <div className="card card-pad">
        <h3 style={{margin:"0 0 10px", fontSize:14, fontWeight:700}}>{t("system")}</h3>
        <div style={{display:"grid", gap:8, fontSize:13}}>
          <div><b>Active policy:</b> {activePolicy.version} ({activePolicy.sizeBand.min}–{activePolicy.sizeBand.max} mm)</div>
          <div><b>Model:</b> OnionSetu grading (Gemini-assisted, Phase 1)</div>
          <div><b>Confidence threshold:</b> 60%</div>
          <div><b>Backend:</b> Supabase — per-user RLS, Storage for images/reports, QR-linked verification</div>
          <div><b>Language:</b> {languages.find(l=>l.code===lang)?.native} · <span className="badge badge-maroon">{lang}</span></div>
        </div>
      </div>
      <div className="card card-pad" style={{background:"#FFFEFD"}}>
        <h3 style={{margin:"0 0 8px", fontSize:14, fontWeight:700}}>Known Limitations</h3>
        <ul style={{margin:0, paddingLeft:18, fontSize:12, color:"#6B5A54", lineHeight:1.6}}>
          <li>Analyzes visible characteristics only — cannot reliably detect internal rot</li>
          <li>Depends on image quality and representative sampling</li>
          <li>Uses human review for uncertain cases; requires real-world validation</li>
        </ul>
      </div>
    </div>
  );
}
