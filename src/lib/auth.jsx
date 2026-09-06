import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
export function useAuth(){ return useContext(AuthContext); }

const LS_KEY = "onion-setu-auth-v1";
const USERS_KEY = "onion-setu-users-v1";

const DEMO_USERS = [
  { id:"u-grader", name:"S. Kulkarni", email:"grader@gmail.com", phone:"9876543210", password:"123456", role:"grader", center:"Lasalgaon APMC — NAFED", location:"Nashik, MH" },
  { id:"u-farmer", name:"Ramesh Patil", email:"farmer@gmail.com", phone:"9876543211", password:"123456", role:"farmer", center:"Lasalgaon APMC", location:"Nashik, MH" },
];

function loadUsers(){
  try{
    const raw = localStorage.getItem(USERS_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      // migrate old onionsetu.in users to gmail demo if needed — keep existing custom users
      return parsed;
    }
  }catch{}
  return DEMO_USERS;
}
function saveUsers(users){
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeContact(v){ return String(v).trim().toLowerCase(); }
function isPhone(v){ return /^[6-9]\d{9}$/.test(String(v).trim()); }

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

  function login(identifier, password, role){
    const idNorm = normalizeContact(identifier);
    const found = users.find(u=> {
      if(u.role !== role) return false;
      const emailMatch = u.email && normalizeContact(u.email)===idNorm;
      const phoneMatch = u.phone && String(u.phone).trim()===String(identifier).trim();
      return emailMatch || phoneMatch;
    });
    if(!found) return { ok:false, error:"No account found for that role. Try demo accounts or sign up with Gmail / phone." };
    if(found.password !== password) return { ok:false, error:"Incorrect password." };
    setUser({ id:found.id, name:found.name, email:found.email, phone:found.phone, role:found.role, center:found.center, location:found.location });
    return { ok:true };
  }
  function signup({ name, email, phone, password, role, center }){
    const emailNorm = email ? normalizeContact(email) : "";
    const phoneNorm = phone ? String(phone).trim() : "";
    if(!emailNorm && !phoneNorm) return { ok:false, error:"Enter a Gmail address or phone number." };
    if(emailNorm && users.some(u=> u.email && normalizeContact(u.email)===emailNorm && u.role===role)){
      return { ok:false, error:"An account with that email and role already exists." };
    }
    if(phoneNorm && users.some(u=> u.phone && String(u.phone).trim()===phoneNorm && u.role===role)){
      return { ok:false, error:"An account with that phone and role already exists." };
    }
    const nu = {
      id:`u-${Date.now()}`,
      name,
      email: emailNorm || `${phoneNorm}@phone.local`,
      phone: phoneNorm || "",
      password,
      role,
      center: center || (role==="grader" ? "Lasalgaon APMC — NAFED" : "Lasalgaon APMC"),
      location:"Nashik, MH"
    };
    const next = [...users, nu];
    setUsers(next);
    setUser({ id:nu.id, name:nu.name, email:nu.email, phone:nu.phone, role:nu.role, center:nu.center, location:nu.location });
    return { ok:true };
  }
  function logout(){ setUser(null); }
  function demoLogin(role){
    const d = DEMO_USERS.find(u=> u.role===role);
    setUser({ id:d.id, name:d.name, email:d.email, phone:d.phone, role:d.role, center:d.center, location:d.location });
  }
  const isGrader = user?.role==="grader";
  const isFarmer = user?.role==="farmer";
  return (
    <AuthContext.Provider value={{ user, users: DEMO_USERS, isGrader, isFarmer, login, signup, logout, demoLogin, isPhone }}>
      {children}
    </AuthContext.Provider>
  );
}

export const FEATURES = {
  farmer: { canCreateAssessment:true, canReview:false, canSwitchPolicy:false, canViewAllAssessments:false, canDispute:true, canVerify:true },
  grader: { canCreateAssessment:true, canReview:true, canSwitchPolicy:true, canViewAllAssessments:true, canDispute:true, canVerify:true },
};
