import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
export function useAuth(){ return useContext(AuthContext); }

const LS_KEY = "onion-setu-auth-v1";
const USERS_KEY = "onion-setu-users-v1";

const DEMO_USERS = [
  { id:"u-grader", name:"S. Kulkarni", email:"grader@onionsetu.in", password:"123456", role:"grader", center:"Lasalgaon APMC — NAFED", location:"Nashik, MH" },
  { id:"u-farmer", name:"Ramesh Patil", email:"farmer@onionsetu.in", password:"123456", role:"farmer", center:"Lasalgaon APMC", location:"Nashik, MH" },
];

function loadUsers(){
  try{
    const raw = localStorage.getItem(USERS_KEY);
    if(raw) return JSON.parse(raw);
  }catch{}
  return DEMO_USERS;
}
function saveUsers(users){
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }){
  const [user, setUser] = useState(()=>{
    try{
      const raw = localStorage.getItem(LS_KEY);
      if(raw) return JSON.parse(raw);
    }catch{}
    return null;
  });
  const [users, setUsers] = useState(()=> loadUsers());

  useEffect(()=>{
    if(user) localStorage.setItem(LS_KEY, JSON.stringify(user));
    else localStorage.removeItem(LS_KEY);
  },[user]);

  useEffect(()=>{ saveUsers(users); },[users]);

  function login(email, password, role){
    const found = users.find(u=> u.email.toLowerCase()===email.toLowerCase() && u.role===role);
    if(!found) return { ok:false, error:"No account found for that role. Try demo accounts or sign up." };
    if(found.password !== password) return { ok:false, error:"Incorrect password." };
    setUser({ id:found.id, name:found.name, email:found.email, role:found.role, center:found.center, location:found.location });
    return { ok:true };
  }
  function signup({ name, email, password, role, center }){
    if(users.some(u=> u.email.toLowerCase()===email.toLowerCase() && u.role===role)){
      return { ok:false, error:"An account with that email and role already exists." };
    }
    const nu = { id:`u-${Date.now()}`, name, email, password, role, center: center || (role==="grader" ? "Lasalgaon APMC — NAFED" : "Lasalgaon APMC"), location:"Nashik, MH" };
    const next = [...users, nu];
    setUsers(next);
    setUser({ id:nu.id, name:nu.name, email:nu.email, role:nu.role, center:nu.center, location:nu.location });
    return { ok:true };
  }
  function logout(){
    setUser(null);
  }
  function demoLogin(role){
    const d = DEMO_USERS.find(u=> u.role===role);
    setUser({ id:d.id, name:d.name, email:d.email, role:d.role, center:d.center, location:d.location });
  }
  const isGrader = user?.role==="grader";
  const isFarmer = user?.role==="farmer";

  return (
    <AuthContext.Provider value={{ user, users: DEMO_USERS, isGrader, isFarmer, login, signup, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

// Feature map per role
export const FEATURES = {
  farmer: {
    canCreateAssessment: true,
    canReview: false,
    canSwitchPolicy: false,
    canViewAllAssessments: false, // only own
    canDispute: true,
    canVerify: true,
  },
  grader: {
    canCreateAssessment: true,
    canReview: true,
    canSwitchPolicy: true,
    canViewAllAssessments: true,
    canDispute: true,
    canVerify: true,
  },
};
