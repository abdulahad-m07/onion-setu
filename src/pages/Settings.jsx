import { useStore } from "../lib/store";
import { useSeo, Breadcrumbs } from "../lib/seo";
import { useI18n } from "../lib/i18n";

export default function Settings(){
  const { offline, setOffline, syncAll, pendingCount, activePolicy } = useStore();
  const { lang, setLang, languages, t } = useI18n();
  useSeo({ title:"Settings", description:"Manage offline sync, language, and system status for OnionSetu.", canonical:"/settings" });
  return (
    <div style={{display:"grid", gap:14, maxWidth:820}}>
      <Breadcrumbs items={[{label:"Home", href:"/"},{label:"Settings", href:"/settings"}]} />
      <h1 className="h-display" style={{fontSize:28, margin:0}}>{t("settings")}</h1>

      <div className="card card-pad" style={{borderLeft:"3px solid #7A263A"}}>
        <h3 style={{margin:"0 0 10px", fontSize:14, fontWeight:700}}>{t("languageSettings")}</h3>
        <p style={{margin:"0 0 10px", fontSize:12, color:"#6B5A54"}}>English is primary. Hindi and Marathi supported for core workflow.</p>
        <select className="select" value={lang} onChange={e=> setLang(e.target.value)} style={{maxWidth:320}}>
          {languages.map(l=> <option key={l.code} value={l.code}>{l.native} — {l.name}</option>)}
        </select>
      </div>

      <div className="card card-pad">
        <h3 style={{margin:"0 0 10px", fontSize:14, fontWeight:700}}>{t("offlineSync")}</h3>
        <div style={{display:"flex", gap:10, alignItems:"center", flexWrap:"wrap"}}>
          <span className={offline ? "badge badge-offline":"badge badge-success"}>{offline ? "Offline mode":"Online"}</span>
          <button className="btn btn-secondary" onClick={()=> setOffline(v=>!v)}>{offline ? "Go online":"Go offline"}</button>
          <button className="btn btn-primary" onClick={syncAll} disabled={!offline && pendingCount===0}>Sync now</button>
          <span style={{fontSize:12, color:"#6B5A54"}}>{pendingCount} pending — per-user Supabase sync</span>
        </div>
        <p style={{margin:"10px 0 0", fontSize:12, color:"#6B5A54"}}>Data is saved per-user in Supabase Postgres + Storage (RLS). Works offline, syncs when online. This assessment evaluates visible external characteristics only.</p>
      </div>
      <div className="card card-pad">
        <h3 style={{margin:"0 0 10px", fontSize:14, fontWeight:700}}>{t("system")}</h3>
        <div style={{display:"grid", gap:8, fontSize:13}}>
          <div><b>Active policy:</b> {activePolicy.version} ({activePolicy.sizeBand.min}–{activePolicy.sizeBand.max} mm)</div>
          <div><b>Detection:</b> YOLOv8n prototype · <b>Defect:</b> MobileNetV2 prototype · <b>Size:</b> OpenCV + 25mm ref</div>
          <div><b>Inference:</b> Prototype Demo Inference — on-device adapter ready</div>
          <div><b>Confidence threshold:</b> 60%</div>
          <div><b>Backend:</b> Supabase — per-user RLS, Storage for images/reports, QR verification</div>
        </div>
      </div>
      <div className="card card-pad" style={{background:"#FFFEFD"}}>
        <h3 style={{margin:"0 0 8px", fontSize:14, fontWeight:700}}>Visible external assessment only</h3>
        <p style={{margin:0, fontSize:12, color:"#6B5A54", lineHeight:1.6}}>This assessment evaluates visible external characteristics from captured images. Internal defects that are not visible externally cannot be reliably detected by this system and may require physical inspection or additional sensing.</p>
      </div>
    </div>
  );
}
