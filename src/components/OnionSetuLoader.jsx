import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { OnionMark } from './OnionMark';

const MAROON = '#7A263A';
const GAP = 22;

export function OnionSetuLoader({ loop = false, onRevealComplete }){
  const reducedMotion = useReducedMotion();
  const wordRef = useRef(null);
  const [wordWidth, setWordWidth] = useState(0);
  const progress = useMotionValue(0);
  const pop = useMotionValue(0);
  const settle = useMotionValue(1);
  const offset = (GAP + wordWidth) / 2;
  const x = useTransform(progress, [0, 1], [offset, 0]);
  const wordX = useTransform(progress, [0, 1], [-wordWidth, GAP]);

  useEffect(()=>{
    const measure = ()=>{ if(wordRef.current) setWordWidth(wordRef.current.offsetWidth); };
    measure();
    window.addEventListener('resize', measure);
    return ()=> window.removeEventListener('resize', measure);
  },[]);

  useEffect(()=>{
    if(!wordWidth) return;
    if(reducedMotion){
      pop.set(1); progress.set(1); onRevealComplete?.(); return;
    }
    const controls = animate([
      [pop, 1, { duration: 0.7, ease: [0.16, 1, 0.3, 1] }],
      [progress, 1, { at: 1.1, duration: 1.9, ease: [0.62, 0, 0.32, 1] }],
      [settle, [0.994, 1], { at: 3.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }],
    ],{
      repeat: loop ? Infinity : 0,
      repeatDelay: 1.4,
      onComplete: ()=> onRevealComplete?.()
    });
    return ()=> controls.stop();
  },[wordWidth, loop, reducedMotion, pop, progress, settle, onRevealComplete]);

  return (
    <div style={{display:'flex', width:'100%', minHeight:'100%', alignItems:'center', justifyContent:'center', background:'white', padding:'48px 24px'}} role="status" aria-label="OnionSetu is loading">
      <div style={{transform:'scale(min(1, calc((100vw - 48px) / 460)))', transformOrigin:'center'}}>
        <motion.div style={{display:'flex', alignItems:'center', x, scale: settle}}>
          <motion.div style={{scale: pop, flexShrink:0}}>
            <OnionMark style={{display:'block', height:132, width:104}} />
          </motion.div>
          <div style={{flexShrink:0, overflow:'hidden', width: wordWidth ? GAP + wordWidth : undefined, paddingTop:10, paddingBottom:10, paddingRight:6, marginTop:-10, marginBottom:-10, marginRight:-6}}>
            <motion.span ref={wordRef} style={{display:'block', width:'max-content', whiteSpace:'nowrap', lineHeight:1, x: wordWidth ? wordX : -9999, fontFamily:'"Times New Roman", Times, serif', fontSize:76, letterSpacing:'-0.005em'}}>
              <span style={{color:'#FFFFFF', WebkitTextStrokeWidth:'2.2px', WebkitTextStrokeColor: MAROON}}>Onion</span>
              <span style={{color: MAROON}}>Setu</span>
            </motion.span>
          </div>
        </motion.div>
      </div>
      <span style={{position:'absolute', width:1, height:1, overflow:'hidden', clip:'rect(0,0,0,0)'}}>Loading OnionSetu</span>
    </div>
  );
}

// Full-screen overlay used on app startup — kept minimal, no flashy effect
export function SplashScreen({ onDone }){
  const [fade, setFade] = useState(false);
  useEffect(()=>{
    const t1 = setTimeout(()=> setFade(true), 1200);
    const t2 = setTimeout(()=> onDone?.(), 1600);
    return ()=>{ clearTimeout(t1); clearTimeout(t2); };
  },[onDone]);
  return (
    <motion.div
      initial={{opacity:1}}
      animate={{opacity: fade ? 0 : 1}}
      transition={{duration:0.6, ease:[0.16,1,0.3,1]}}
      style={{position:'fixed', inset:0, zIndex:9999, background:'white', display:'flex', alignItems:'center', justifyContent:'center', pointerEvents: fade ? 'none' : 'auto'}}
    >
      <OnionSetuLoader loop={false} />
    </motion.div>
  );
}
