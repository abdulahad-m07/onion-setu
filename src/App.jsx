import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./lib/store";
import Layout from "./components/Layout";
import { SplashScreen } from "./components/OnionSetuLoader";

const Dashboard = lazy(()=> import("./pages/Dashboard"));
const NewAssessment = lazy(()=> import("./pages/NewAssessment"));
const Assessments = lazy(()=> import("./pages/Assessments"));
const Reviews = lazy(()=> import("./pages/Reviews"));
import { ReportsList, ReportDetail } from "./pages/Reports";
const Policy = lazy(()=> import("./pages/Policy"));
const Settings = lazy(()=> import("./pages/Settings"));
const Verification = lazy(()=> import("./pages/Verification"));
const Landing = lazy(()=> import("./pages/Landing"));
const NotFound = lazy(()=> import("./pages/NotFound"));

function Loader(){
  return <div style={{padding:40, textAlign:"center", color:"#8a7a74", fontSize:14}}>Loading OnionSetu…</div>;
}

export default function App(){
  const [loading, setLoading] = useState(true);
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
        <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/*" element={
            <Layout>
              <Suspense fallback={<Loader/>}>
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
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </Layout>
          } />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </StoreProvider>
  );
}
