import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";

const nav = [
  { to:"/", label:"Dashboard", icon: IconDashboard },
  { to:"/new", label:"New Assessment", icon: IconPlus },
  { to:"/assessments", label:"Assessments", icon: IconClipboard },
  { to:"/reviews", label:"Reviews", icon: IconEye },
  { to:"/reports", label:"Reports", icon: IconFile },
  { to:"/policy", label:"Policy", icon: IconScale },
  { to:"/settings", label:"Settings", icon: IconGear },
];

export default function Layout({ children }){
  const { offline, setOffline, pendingCount, syncAll, activePolicy } = useStore();
  const loc = useLocation();
  const nav2 = useNavigate();
  const isLanding = loc.pathname === "/landing";
  const [menuOpen, setMenuOpen] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const sidebarRef = useRef(null);

  // close on route change
  useEffect(()=>{ setMenuOpen(false); }, [loc.pathname]);

  // close on window resize to desktop
  useEffect(()=>{
    const onResize = ()=>{ if(window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return ()=> window.removeEventListener("resize", onResize);
  },[]);

  // lock body scroll when menu open on mobile
  useEffect(()=>{
    if(menuOpen && window.innerWidth <= 900){
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return ()=>{ document.body.style.overflow = ""; };
  },[menuOpen]);

  // swipe to close: swipe left on sidebar or swipe from left edge
  function onTouchStart(e){
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function onTouchMove(e){
    if(touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // if horizontal swipe left is dominant, prevent scroll
    if(menuOpen && dx < -10 && Math.abs(dx) > Math.abs(dy)){
      // allow native scroll to be interrupted
    }
  }
  function onTouchEnd(e){
    if(touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // swipe left to close (sidebar open) OR swipe right from edge to open
    if(menuOpen && dx < -60 && Math.abs(dx) > Math.abs(dy)){
      setMenuOpen(false);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }

  if(isLanding) return children;

  return (
    <div className="app-shell" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      {/* Backdrop */}
      {menuOpen && (
        <div
          aria-hidden="true"
          onClick={()=> setMenuOpen(false)}
          style={{position:"fixed", inset:0, background:"rgba(23,17,15,.32)", backdropFilter:"blur(2px)", zIndex:39}}
        />
      )}
      <aside
        ref={sidebarRef}
        id="sidebar"
        className={`sidebar ${menuOpen ? "open" : ""}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-hidden={menuOpen ? "false" : undefined}
      >
        <div className="sidebar-brand">
          <div className="brand-mark">
            <div className="brand-icon">◉</div>
            <div>
              <div className="brand-name">ONIONSETU</div>
              <div className="brand-sub">AI-Assisted Grading</div>
            </div>
          </div>
          <div style={{marginTop:10, fontSize:11, color:"#8a7a74", lineHeight:1.4}}>
            Procurement-grade<br/>evidence ledger
          </div>
        </div>
        <nav className="nav" aria-label="Primary">
          <div className="nav-group-label">Workspace</div>
          {nav.map(item=>(
            <NavLink key={item.to} to={item.to} onClick={()=> setMenuOpen(false)} className={({isActive})=> isActive ? "nav-link active" : "nav-link"}>
              <item.icon />
              {item.label}
            </NavLink>
          ))}
          <div className="nav-group-label" style={{marginTop:14}}>System</div>
          <div style={{padding:"8px 10px"}}>
            <div style={{fontSize:12, fontWeight:600}}>Active policy</div>
            <div style={{fontSize:13, color:"#7A263A", fontWeight:700}}>{activePolicy.version} · {activePolicy.sizeBand.min}–{activePolicy.sizeBand.max} mm</div>
            <div style={{fontSize:11, color:"#8a7a74", marginTop:2}}>{activePolicy.label}</div>
          </div>
        </nav>
        <div className="sidebar-foot">
          <div className="sync-card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <span className={offline ? "badge badge-offline" : "badge badge-success"} style={{fontSize:10}}>
                <span className="dot" style={{background: offline ? "#D99024" : "#3F7D4A"}} /> {offline ? "Offline" : "Online"}
              </span>
              <button className="btn btn-ghost" style={{padding:"4px 8px",fontSize:12}} onClick={()=> setOffline(v=>!v)}>{offline ? "Go online" : "Go offline"}</button>
            </div>
            <div style={{fontSize:12, color:"#6B5A54"}}>
              {offline ? `${pendingCount} assessment${pendingCount!==1?"s":""} queued locally.` : "All assessments synced to Supabase."}
              <br/>Local encrypted queue → Supabase
            </div>
            {offline && pendingCount>0 && (
              <button className="btn btn-primary" style={{width:"100%",marginTop:10,fontSize:13}} onClick={syncAll}>Simulate sync</button>
            )}
            <div style={{marginTop:8, display:"flex", gap:6}}>
              <span className="kbd">Supabase</span><span className="kbd">Postgres</span><span className="kbd">SHA-256</span>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10, marginTop:12}}>
            <img src="https://i.pravatar.cc/100?img=12" alt="" style={{width:32,height:32,borderRadius:"50%",objectFit:"cover"}}/>
            <div>
              <div style={{fontSize:13,fontWeight:600}}>S. Kulkarni</div>
              <div style={{fontSize:11,color:"#8a7a74"}}>Grader · Lasalgaon</div>
            </div>
            <span className="badge" style={{marginLeft:"auto",fontSize:10}}>Grader</span>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="btn btn-secondary mobile-menu-btn" onClick={()=> setMenuOpen(v=>!v)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="sidebar">
              {menuOpen ? "✕" : "☰"}
            </button>
            <div style={{display:"flex",alignItems:"center",gap:10, minWidth:0}}>
              <div className="brand-icon" style={{width:30,height:30,fontSize:13}}>◉</div>
              <div className="topbar-brand-text" style={{minWidth:0}}>
                <div className="brand-title">ONIONSETU</div>
                <div className="brand-subtitle">AI-Assisted Onion Quality Assessment</div>
              </div>
            </div>
          </div>
          <div className="topbar-right">
            <span className="badge badge-maroon" style={{display:"none"}} id="top-policy">v2026.1</span>
            <button className="btn btn-ghost" style={{fontSize:13}} onClick={()=>{ setMenuOpen(false); nav2("/policy"); }}>Policy {activePolicy.version}</button>
            <button className="btn btn-primary" onClick={()=>{ setMenuOpen(false); nav2("/new"); }}><IconPlus/> <span>Start</span></button>
          </div>
        </header>
        <div className="content">
          {children}
        </div>
      </div>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        <NavLink to="/" onClick={()=> setMenuOpen(false)} className={({isActive})=> isActive?"bnav-link active":"bnav-link"}><IconDashboard/>Dashboard</NavLink>
        <NavLink to="/new" onClick={()=> setMenuOpen(false)} className={({isActive})=> isActive?"bnav-link active":"bnav-link"}><IconPlus/>New</NavLink>
        <NavLink to="/assessments" onClick={()=> setMenuOpen(false)} className={({isActive})=> isActive?"bnav-link active":"bnav-link"}><IconClipboard/>Assess</NavLink>
        <NavLink to="/reviews" onClick={()=> setMenuOpen(false)} className={({isActive})=> isActive?"bnav-link active":"bnav-link"}><IconEye/>Reviews</NavLink>
        <NavLink to="/reports" onClick={()=> setMenuOpen(false)} className={({isActive})=> isActive?"bnav-link active":"bnav-link"}><IconFile/>Reports</NavLink>
      </nav>
    </div>
  );
}

function IconDashboard(){ return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>; }
function IconPlus(){ return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14"/></svg>; }
function IconClipboard(){ return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>; }
function IconEye(){ return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>; }
function IconFile(){ return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M10 13H8M16 17H8M13 13h2"/></svg>; }
function IconScale(){ return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3v18"/><path d="M4 7l8-3 8 3-8 3-8-3Z"/><path d="M4 17l8 3 8-3"/></svg>; }
function IconGear(){ return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>; }
