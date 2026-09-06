import { createContext, useContext, useEffect, useState } from "react";

export const languages = [
  { code:"en", name:"English", native:"English", flag:"🇬🇧" },
  { code:"hi", name:"Hindi", native:"हिन्दी", flag:"🇮🇳" },
  { code:"bn", name:"Bengali", native:"বাংলা", flag:"🇮🇳" },
  { code:"te", name:"Telugu", native:"తెలుగు", flag:"🇮🇳" },
  { code:"mr", name:"Marathi", native:"मराठी", flag:"🇮🇳" },
  { code:"ta", name:"Tamil", native:"தமிழ்", flag:"🇮🇳" },
  { code:"gu", name:"Gujarati", native:"ગુજરાતી", flag:"🇮🇳" },
  { code:"ur", name:"Urdu", native:"اردو", flag:"🇮🇳" },
  { code:"kn", name:"Kannada", native:"ಕನ್ನಡ", flag:"🇮🇳" },
  { code:"ml", name:"Malayalam", native:"മലയാളം", flag:"🇮🇳" },
  { code:"or", name:"Odia", native:"ଓଡ଼ିଆ", flag:"🇮🇳" },
  { code:"pa", name:"Punjabi", native:"ਪੰਜਾਬੀ", flag:"🇮🇳" },
  { code:"as", name:"Assamese", native:"অসমীয়া", flag:"🇮🇳" },
  { code:"mai", name:"Maithili", native:"मैथिली", flag:"🇮🇳" },
  { code:"sat", name:"Santali", native:"ᱥᱟᱱᱛᱟᱲᱤ", flag:"🇮🇳" },
  { code:"ks", name:"Kashmiri", native:"کٲشُر", flag:"🇮🇳" },
  { code:"ne", name:"Nepali", native:"नेपाली", flag:"🇮🇳" },
  { code:"sd", name:"Sindhi", native:"سنڌي", flag:"🇮🇳" },
  { code:"kok", name:"Konkani", native:"कोंकणी", flag:"🇮🇳" },
  { code:"doi", name:"Dogri", native:"डोगरी", flag:"🇮🇳" },
  { code:"mni", name:"Manipuri", native:"মণিপুরী", flag:"🇮🇳" },
  { code:"brx", name:"Bodo", native:"बर'", flag:"🇮🇳" },
  { code:"sa", name:"Sanskrit", native:"संस्कृतम्", flag:"🇮🇳" },
];

// Base English keys
const en = {
  appName:"ONIONSETU", appSubtitle:"AI-Assisted Grading",
  selectLanguage:"Select Language", selectLanguageDesc:"Choose your preferred language — you can change it anytime in Settings.",
  continue:"Continue", back:"Back", next:"Next", save:"Save", loading:"Loading...",
  search:"Search", viewAll:"View all", openReport:"Open report", newAssessment:"New Assessment",
  dashboard:"Dashboard", assessments:"Assessments", reviews:"Reviews", reports:"Reports", policy:"Policy", settings:"Settings",
  farmer:"Farmer", grader:"Grader",
  farmerDesc:"View my lots, reports & QR verification", graderDesc:"Grade lots, human review, policy",
  login:"Login", signup:"Sign up", logout:"Logout",
  welcomeBack:"Welcome back to", welcomeCreate:"Create your", onionSetu:"OnionSetu",
  gmailOrPhone:"Gmail or Phone number", password:"Password", fullName:"Full name", villageCenter:"Village / Center",
  sendOtp:"Send OTP", verifyOtp:"Verify OTP", resendOtp:"Resend OTP", enterOtp:"Enter 6-digit OTP",
  demoAccounts:"Demo accounts", quickLogin:"Quick login", noAccount:"No account?", haveAccount:"Already have an account?",
  myAssessments:"My assessments", allAssessments:"All assessments", todaysAssessments:"Today's Assessments", gradeAPercent:"Grade A %", humanReviews:"Human Reviews", pendingDisputes:"Pending Disputes",
  recentAssessments:"Recent assessments", activity:"Activity", howItWorks:"How it works",
  qualityReports:"Quality reports", reportId:"Report ID", date:"Date", location:"Location", policyVersion:"Policy version",
  gradeA:"Grade A %", urs:"URS %", confidence:"Confidence", farmerAck:"Farmer acknowledgement", graderAck:"Grader acknowledgement", disputeStatus:"Dispute status",
  sampleSize:"Sample size", lotId:"Lot ID", hash:"Hash (SHA-256)", uploadedImages:"Uploaded Images", perOnionResults:"Per-Onion Results",
  downloadInSelected:"Download in", downloadInEnglish:"Download in English", qrVerify:"QR Verification", openVerification:"Open verification",
  gradingPolicy:"Grading policy", sizeBand:"Size band", defectTolerances:"Defect tolerances",
  offlineSync:"Offline & Sync", system:"System", languageSettings:"Language", changeLanguage:"Change language",
  myFarm:"My farm — grading overview", procOverview:"AI-assisted procurement overview",
  newAssessmentTitle:"New assessment", farmerGraderSession:"Farmer + Grader joint session · AI assists, human decides",
  storedReportData:"Stored Report Data", finalReport:"Final Report",
  viewOf:"View", withRef:"with 25mm ref", storedIn:"Stored in Supabase Storage", demoPlaceholder:"Demo placeholder",
  acknowledged:"Acknowledged", pending:"Pending", noDispute:"No dispute", underReview:"Under review", disputed:"Disputed",
  generatePdf:"Generate PDF · Print", markAck:"Mark acknowledged", flagReview:"Flag Report / Second Review",
  verification:"Verification", reportVerified:"Report Verified", languageGateTitle:"Choose your language", languageGateDesc:"OnionSetu works in all Indian languages — pick one to continue. You can change it later in Settings.",
};

// Helper to create fallback dict (English fallback for missing keys)
function f(translations){ return { ...en, ...translations }; }

const dict = {
  en,
  hi: f({
    selectLanguage:"भाषा चुनें", selectLanguageDesc:"अपनी पसंदीदा भाषा चुनें — आप इसे सेटिंग्स में कभी भी बदल सकते हैं।",
    continue:"जारी रखें", back:"पीछे", next:"आगे", save:"सहेजें", loading:"लोड हो रहा है...",
    dashboard:"डैशबोर्ड", assessments:"मूल्यांकन", reviews:"समीक्षा", reports:"रिपोर्ट", policy:"नीति", settings:"सेटिंग्स",
    farmer:"किसान", grader:"ग्रेडर", farmerDesc:"मेरे लॉट, रिपोर्ट और QR सत्यापन देखें", graderDesc:"लॉट ग्रेड करें, समीक्षा, नीति",
    login:"लॉगिन", signup:"साइन अप", logout:"लॉगआउट",
    welcomeBack:"वापसी पर स्वागत है", welcomeCreate:"अपना बनाएं", gmailOrPhone:"जीमेल या फोन नंबर", password:"पासवर्ड", fullName:"पूरा नाम",
    sendOtp:"OTP भेजें", verifyOtp:"OTP सत्यापित करें", enterOtp:"6-अंकों का OTP दर्ज करें",
    myAssessments:"मेरे मूल्यांकन", allAssessments:"सभी मूल्यांकन", qualityReports:"गुणवत्ता रिपोर्ट",
    reportId:"रिपोर्ट आईडी", date:"तारीख", location:"स्थान", policyVersion:"नीति संस्करण", gradeA:"ग्रेड A %", urs:"URS %", confidence:"आत्मविश्वास",
    farmerAck:"किसान स्वीकृति", graderAck:"ग्रेडर स्वीकृति", disputeStatus:"विवाद स्थिति",
    uploadedImages:"अपलोड की गई तस्वीरें", perOnionResults:"प्रति प्याज परिणाम", downloadInSelected:"डाउनलोड करें", downloadInEnglish:"अंग्रेजी में डाउनलोड", qrVerify:"QR सत्यापन",
    gradingPolicy:"ग्रेडिंग नीति", sizeBand:"आकार सीमा", languageSettings:"भाषा", changeLanguage:"भाषा बदलें",
  }),
  bn: f({ selectLanguage:"ভাষা নির্বাচন করুন", dashboard:"ড্যাশবোর্ড", assessments:"মূল্যায়ন", reviews:"পর্যালোচনা", reports:"রিপোর্ট", policy:"নীতি", settings:"সেটিংস", farmer:"কৃষক", grader:"গ্রেডার", login:"লগইন", signup:"সাইন আপ", gradeA:"গ্রেড A %", reportId:"রিপোর্ট আইডি", date:"তারিখ", location:"অবস্থান", uploadedImages:"আপলোড করা ছবি", downloadInEnglish:"ইংরেজিতে ডাউনলোড" }),
  te: f({ selectLanguage:"భాషను ఎంచుకోండి", dashboard:"డాష్‌బోర్డ్", assessments:"మూల్యాంకనాలు", reports:"నివేదికలు", farmer:"రైతు", grader:"గ్రేడర్", login:"లాగిన్", gradeA:"గ్రేడ్ A %", reportId:"రిపోర్ట్ ఐడి", date:"తేదీ", location:"ప్రదేశం", uploadedImages:"అప్‌లోడ్ చేసిన చిత్రాలు" }),
  mr: f({ selectLanguage:"भाषा निवडा", dashboard:"डॅशबोर्ड", assessments:"मूल्यमापन", reports:"अहवाल", farmer:"शेतकरी", grader:"ग्रेडर", login:"लॉगिन", gradeA:"ग्रेड A %", reportId:"अहवाल आयडी", uploadedImages:"अपलोड केलेल्या प्रतिमा" }),
  ta: f({ selectLanguage:"மொழியைத் தேர்ந்தெடுக்கவும்", dashboard:"டாஷ்போர்டு", assessments:"மதிப்பீடுகள்", reports:"அறிக்கைகள்", farmer:"விவசாயி", grader:"தரநிர்ணயிப்பாளர்", login:"உள்நுழை", gradeA:"கிரேடு A %", reportId:"அறிக்கை ஐடி", uploadedImages:"பதிவேற்றிய படங்கள்" }),
  gu: f({ selectLanguage:"ભાષા પસંદ કરો", dashboard:"ડેશબોર્ડ", assessments:"મૂલ્યાંકન", reports:"રિપોર્ટ", farmer:"ખેડૂત", grader:"ગ્રેડર", login:"લોગિન", gradeA:"ગ્રેડ A %", uploadedImages:"અપલોડ કરેલી છબીઓ" }),
  ur: f({ selectLanguage:"زبان منتخب کریں", dashboard:"ڈیش بورڈ", assessments:"تشخیص", reports:"رپورٹس", farmer:"کسان", grader:"گریڈر", login:"لاگ ان", gradeA:"گریڈ A %", reportId:"رپورٹ آئی ڈی", uploadedImages:"اپ لوڈ کردہ تصاویر" }),
  kn: f({ selectLanguage:"ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", dashboard:"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", assessments:"ಮೌಲ್ಯಮಾಪನ", reports:"ವರದಿಗಳು", farmer:"ರೈತ", grader:"ಗ್ರೇಡರ್", login:"ಲಾಗಿನ್", gradeA:"ಗ್ರೇಡ್ A %", uploadedImages:"ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಚಿತ್ರಗಳು" }),
  ml: f({ selectLanguage:"ഭാഷ തിരഞ്ഞെടുക്കുക", dashboard:"ഡാഷ്‌ബോർഡ്", assessments:"മൂല്യനിർണയം", reports:"റിപ്പോർട്ടുകൾ", farmer:"കർഷകൻ", grader:"ഗ്രേഡർ", login:"ലോഗിൻ", gradeA:"ഗ്രേഡ് A %", uploadedImages:"അപ്‌ലോഡ് ചെയ്ത ചിത്രങ്ങൾ" }),
  or: f({ selectLanguage:"ଭାଷା ବାଛନ୍ତୁ", dashboard:"ଡ୍ୟାସବୋର୍ଡ", assessments:"ମୂଲ୍ୟାଙ୍କନ", reports:"ରିପୋର୍ଟ", farmer:"ଚାଷୀ", grader:"ଗ୍ରେଡର", login:"ଲଗଇନ୍", gradeA:"ଗ୍ରେଡ୍ A %" }),
  pa: f({ selectLanguage:"ਭਾਸ਼ਾ ਚੁਣੋ", dashboard:"ਡੈਸ਼ਬੋਰਡ", assessments:"ਮੁਲਾਂਕਣ", reports:"ਰਿਪੋਰਟਾਂ", farmer:"ਕਿਸਾਨ", grader:"ਗ੍ਰੇਡਰ", login:"ਲਾਗਇਨ", gradeA:"ਗ੍ਰੇਡ A %", uploadedImages:"ਅੱਪਲੋਡ ਕੀਤੀਆਂ ਤਸਵੀਰਾਂ" }),
  as: f({ selectLanguage:"ভাষা বাছনি কৰক", dashboard:"ডেশ্বব'ৰ্ড", assessments:"মূল্যায়ন", reports:"প্ৰতিবেদন", farmer:"কৃষক", grader:"গ্ৰেডাৰ", login:"লগইন" }),
  mai: f({ selectLanguage:"भाषा चुनू", dashboard:"डैशबोर्ड", farmer:"किसान", grader:"ग्रेडर", login:"लॉगिन", reports:"रिपोर्ट" }),
  sat: f({ selectLanguage:"ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ", dashboard:"ᱰᱮᱥᱵᱚᱨᱰ", farmer:"ᱪᱟᱹᱥᱤ", reports:"ᱨᱤᱯᱚᱴ" }),
  ks: f({ selectLanguage:"زَبان چُنِو", dashboard:"ڈیش بورڈ", farmer:"کسان", reports:"رپورٹ" }),
  ne: f({ selectLanguage:"भाषा छान्नुहोस्", dashboard:"ड्यासबोर्ड", farmer:"किसान", reports:"रिपोर्ट" }),
  sd: f({ selectLanguage:"ٻولي چونڊيو", dashboard:"ڊيش بورڊ", farmer:"هاري", reports:"رپورٽ" }),
  kok: f({ selectLanguage:"भास निवडा", dashboard:"डॅशबोर्ड", farmer:"शेतकार", reports:"अहवाल" }),
  doi: f({ selectLanguage:"भाषा चुनो", dashboard:"डैशबोर्ड", farmer:"किसान", reports:"रिपोर्ट" }),
  mni: f({ selectLanguage:"লোল চয়ন তৌ", dashboard:"ড্যাসবোর্ড", farmer:"লৌমী", reports:"রিপোর্ট" }),
  brx: f({ selectLanguage:"राव बाछा", dashboard:"डैशबोर्ड", farmer:"बिरुवा गामि", reports:"रिपोर्ट" }),
  sa: f({ selectLanguage:"भाषां चिनोतु", dashboard:"फलकम्", farmer:"कृषकः", grader:"श्रेणीकारः", login:"प्रवेशः", reports:"प्रतिवेदनम्", gradeA:"श्रेणी A %" }),
};

const LS_LANG = "onion-setu-lang";
const I18nContext = createContext(null);
export function useI18n(){ return useContext(I18nContext); }

export function I18nProvider({ children }){
  const [lang, setLangState] = useState(()=>{
    try{ const v=localStorage.getItem(LS_LANG); if(v && dict[v]) return v; }catch{}
    return ""; // empty = not chosen yet
  });
  const [ready, setReady] = useState(Boolean(lang));

  function setLang(code){
    if(!dict[code]) code="en";
    localStorage.setItem(LS_LANG, code);
    // also try to persist to Supabase profile language if logged in
    try{
      const raw = localStorage.getItem("onion-setu-auth-v1");
      if(raw){
        const u=JSON.parse(raw);
        localStorage.setItem("onion-setu-auth-v1", JSON.stringify({...u, preferredLang: code}));
      }
    }catch{}
    setLangState(code);
    setReady(true);
    document.documentElement.lang = code;
  }

  useEffect(()=>{ if(lang) document.documentElement.lang = lang; },[lang]);

  function t(key, fallback){
    const d = dict[lang] || dict.en;
    return d[key] || dict.en[key] || fallback || key;
  }

  return (
    <I18nContext.Provider value={{ lang: lang || "en", setLang, t, languages, ready, hasChosen: Boolean(lang) }}>
      {children}
    </I18nContext.Provider>
  );
}
