import { useState, useEffect, useRef } from "react";
import { useI18n } from "../lib/i18n";

const GOOGLE_SUPPORTED = new Set(["hi","bn","te","mr","ta","gu","ur","kn","ml","or","pa","as","ne","sd","sa","en"]);

function setGoogleCookie(lang){
  // Google Translate expects /en/<target>
  const target = lang === "en" ? "/en/en" : `/en/${lang}`;
  document.cookie = `googtrans=${target};path=/`;
  document.cookie = `googtrans=${target};path=/;domain=${window.location.hostname}`;
  // For Vercel preview domains, also set without domain
  window.location.reload();
}
function clearGoogleCookie(){
  document.cookie = "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
  document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname}`;
  window.location.reload();
}

export default function MyTranslator({ variant="topbar" }){
  const { lang, setLang, languages } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = languages.find(l=> l.code===lang) || languages[0];

  useEffect(()=>{
    function onClick(e){
      if(ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return ()=> document.removeEventListener("mousedown", onClick);
  },[]);

  function select(code){
    setOpen(false);
    // Always set manual language for offline perfect terms (Hindi/Marathi etc.)
    setLang(code);
    // Also trigger Google for 100% coverage if supported and not English
    if(GOOGLE_SUPPORTED.has(code)){
      if(code==="en"){
        clearGoogleCookie();
      } else {
        // Small delay to let manual set, then Google
        setTimeout(()=> setGoogleCookie(code), 150);
      }
    } else {
      // For unsupported (Bodo, Santali etc.), manual is enough — clear Google to avoid English fallback
      if(code!=="en") clearGoogleCookie();
    }
  }

  const isTopbar = variant==="topbar";
  const isGate = variant==="gate";
  const isSidebar = variant==="sidebar";
  return (
    <div ref={ref} style={{position:"relative", display: isGate || isSidebar ? "block" : "inline-block", width: isGate || isSidebar ? "100%" : "auto"}}>
      <button
        onClick={()=> setOpen(v=>!v)}
        className="btn btn-secondary"
        style={{
          display:"inline-flex", alignItems:"center", gap:8,
          padding: isGate ? "12px 16px" : isSidebar ? "0 10px" : isTopbar ? "0 12px" : "10px 14px",
          height: isSidebar ? 36 : isGate ? 48 : isTopbar ? 36 : 40,
          borderRadius: isGate ? 14 : 10, border:"1px solid #EDE3DC",
          background: open ? "#fdf2f4" : isGate || isSidebar ? "white" : "#FBF6F0",
          color: open ? "#7A263A" : "#17110F",
          fontWeight:600, fontSize: isSidebar ? 12 : isGate ? 14 : isTopbar ? 12 : 13,
          minWidth: isSidebar ? "100%" : isGate ? "100%" : isTopbar ? 132 : 180,
          width: isSidebar || isGate ? "100%" : "auto",
          justifyContent:"space-between", boxShadow: isGate ? "0 4px 16px rgba(23,17,15,.06)" : "none"
        }}
        aria-haspopup="listbox" aria-expanded={open}
      >
        <span style={{display:"flex", gap:8, alignItems:"center", minWidth:0}}>
          <span style={{fontSize:14}}>{current.flag}</span>
          <span style={{whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{current.native}</span>
          <span style={{fontSize:10, color:"#8a7a74", fontWeight:500}}>{current.code.toUpperCase()}</span>
        </span>
        <span style={{fontSize:10, color:"#7A263A"}}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div
          role="listbox"
          style={{
            position:"absolute", top:"calc(100% + 8px)", right: isTopbar || isSidebar ? 0 : isGate ? 0 : "auto", left: isTopbar || isSidebar ? "auto" : 0,
            width: isSidebar ? "100%" : isGate ? "100%" : isTopbar ? 280 : 320, maxHeight:360, overflow:"auto",
            background:"white", border:"1px solid #EDE3DC", borderRadius:14,
            boxShadow:"0 12px 32px rgba(23,17,15,.12)", zIndex:50, padding:8
          }}
        >
          <div style={{fontSize:11, letterSpacing:".08em", textTransform:"uppercase", fontWeight:700, color:"#8a7a74", padding:"6px 8px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <span>My Translator — 22 Languages</span>
            <span style={{fontSize:10, background:"#7A263A", color:"white", borderRadius:999, padding:"2px 6px"}}>ONIONSETU</span>
          </div>
          <div style={{fontSize:11, color:"#6B5A54", padding:"0 8px 8px", borderBottom:"1px solid #F3EAE2"}}>Manual perfect for Hindi/Marathi + Google 100% for all — works offline (manual) & online (Google).</div>
          {languages.map(l=>(
            <button
              key={l.code}
              role="option"
              aria-selected={lang===l.code}
              onClick={()=> select(l.code)}
              style={{
                width:"100%", display:"flex", gap:10, alignItems:"center",
                padding:"9px 10px", borderRadius:10, border:"none", cursor:"pointer",
                background: lang===l.code ? "#fdf2f4" : "white",
                color: lang===l.code ? "#7A263A" : "#17110F",
                fontWeight: lang===l.code ? 700 : 500, textAlign:"left"
              }}
            >
              <span style={{width:28,height:28, borderRadius:8, background: lang===l.code ? "#7A263A" : "#FBF6F0", color: lang===l.code ? "white":"#7A263A", display:"grid", placeItems:"center", fontSize:13}}>{l.flag}</span>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{l.native} <span style={{color:"#8a7a74", fontWeight:500, fontSize:11}}>· {l.name}</span></div>
                <div style={{fontSize:11, color:"#8a7a74"}}>{GOOGLE_SUPPORTED.has(l.code) ? "Google + Manual" : "Manual (offline)"} · {l.code}</div>
              </div>
              {lang===l.code && <span style={{color:"#7A263A", fontWeight:800}}>✓</span>}
            </button>
          ))}
          <div style={{padding:"8px 8px 4px", fontSize:10, color:"#8a7a74", borderTop:"1px solid #F3EAE2", marginTop:8}}>
            Powered by OnionSetu Translator — wrapping Google Translate with our design, offline fallback, and per-user memory in Supabase.
          </div>
        </div>
      )}
    </div>
  );
}
