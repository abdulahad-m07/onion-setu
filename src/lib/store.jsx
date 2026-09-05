import { createContext, useContext, useEffect, useState } from "react";
import { assessmentsSeed, policies, generateId, generateLotId } from "./mockData";
import { gradeLot } from "./grading";

const StoreContext = createContext(null);

export function useStore(){ return useContext(StoreContext); }

const LS_KEY = "onion-setu-v1";

export function StoreProvider({ children }){
  const [assessments, setAssessments] = useState(()=>{
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(raw) return JSON.parse(raw).assessments || assessmentsSeed;
    }catch{}
    return assessmentsSeed;
  });
  const [activePolicy, setActivePolicy] = useState(()=>{
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(raw) return JSON.parse(raw).activePolicy || policies.find(p=>p.isActive);
    }catch{}
    return policies.find(p=>p.isActive);
  });
  const [offline, setOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(()=>{
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(raw) return JSON.parse(raw).pendingCount ?? 1;
    }catch{}
    return 1;
  });

  useEffect(()=>{
    localStorage.setItem(LS_KEY, JSON.stringify({ assessments, activePolicy, pendingCount }));
  },[assessments, activePolicy, pendingCount]);

  function addAssessment(data){
    const id = generateId();
    const lotId = data.lotId || generateLotId();
    const grading = gradeLot(data.onions || [], activePolicy);
    const entry = {
      id,
      lotId,
      farmer: data.farmer,
      center: data.center,
      location: data.location,
      date: new Date().toISOString(),
      assessor: data.assessor,
      policyVersion: activePolicy.version,
      modelVersion: "onion-grade-v1.1 (MobileNetV2)",
      sampleSize: data.onions?.length || grading.total,
      gradeA: grading.gradeA,
      urs: grading.urs,
      status: data.status || "Completed",
      sync: offline ? "Offline" : "Synced",
      humanReviews: data.humanReviews ?? 0,
      confidence: data.confidence ?? Math.round((data.onions||[]).reduce((a,b)=>a+b.confidence,0)/Math.max(1,(data.onions||[]).length)),
      onions: grading.details,
      hash: data.hash || "a3f9c1e7 8b2d 4f0a 9e11 d6c3a5b8e902",
      acknowledged: { farmer:false, grader:false },
      ...data,
      id, lotId,
    };
    setAssessments(prev=>[entry, ...prev]);
    if(offline) setPendingCount(c=>c+1);
    return entry;
  }

  function updateAssessment(id, patch){
    setAssessments(prev=> prev.map(a=> a.id===id ? { ...a, ...patch } : a));
  }

  function syncAll(){
    setAssessments(prev=> prev.map(a=> a.sync==="Offline" ? { ...a, sync:"Synced", status: a.status==="Sync Pending" ? "Completed" : a.status } : a));
    setPendingCount(0);
    setOffline(false);
  }

  function setPolicy(version){
    const p = policies.find(x=>x.version===version);
    if(p) setActivePolicy(p);
  }

  // derived
  const activeAssessments = assessments;

  return (
    <StoreContext.Provider value={{
      assessments: activeAssessments,
      policies,
      activePolicy,
      setPolicy,
      addAssessment,
      updateAssessment,
      offline, setOffline,
      pendingCount, setPendingCount,
      syncAll,
    }}>
      {children}
    </StoreContext.Provider>
  );
}
