import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StoreProvider } from "./lib/store";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import NewAssessment from "./pages/NewAssessment";
import Assessments from "./pages/Assessments";
import Reviews from "./pages/Reviews";
import { ReportsList, ReportDetail } from "./pages/Reports";
import Policy from "./pages/Policy";
import Settings from "./pages/Settings";
import Verification from "./pages/Verification";
import Landing from "./pages/Landing";
import { SplashScreen } from "./components/OnionSetuLoader";

export default function App(){
  const [loading, setLoading] = useState(true);
  // show splash only once per session — skip if already seen
  useEffect(()=>{
    if(sessionStorage.getItem("onionsetu_splash_seen")){
      setLoading(false);
    }
  },[]);
  function handleDone(){
    sessionStorage.setItem("onionsetu_splash_seen","1");
    setLoading(false);
  }
  return (
    <StoreProvider>
      <BrowserRouter>
        {loading && <SplashScreen onDone={handleDone} />}
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/new" element={<NewAssessment />} />
                <Route path="/assessments" element={<Assessments />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/reports" element={<ReportsList />} />
                <Route path="/reports/:id" element={<ReportDetail />} />
                <Route path="/verify/:id" element={<Verification />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
