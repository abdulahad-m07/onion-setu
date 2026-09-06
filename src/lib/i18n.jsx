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

const en = {
  appName:"ONIONSETU", appSubtitle:"AI-Assisted Grading",
  selectLanguage:"Select Language", selectLanguageDesc:"Choose your preferred language — you can change it anytime in Settings.",
  continue:"Continue", back:"Back", next:"Next", save:"Save", loading:"Loading...", search:"Search", viewAll:"View all", openReport:"Open report", newAssessment:"New Assessment",
  dashboard:"Dashboard", assessments:"Assessments", reviews:"Reviews", reports:"Reports", policy:"Policy", settings:"Settings",
  farmer:"Farmer", grader:"Grader", farmerDesc:"View my lots, reports & QR verification", graderDesc:"Grade lots, human review, policy",
  login:"Login", signup:"Sign up", logout:"Logout", welcomeBack:"Welcome back to", welcomeCreate:"Create your", onionSetu:"OnionSetu",
  gmailOrPhone:"Gmail or Phone number", password:"Password", fullName:"Full name", villageCenter:"Village / Center",
  sendOtp:"Send OTP", verifyOtp:"Verify OTP", resendOtp:"Resend OTP", enterOtp:"Enter 6-digit OTP", demoAccounts:"Demo accounts", quickLogin:"Quick login", noAccount:"No account?", haveAccount:"Already have an account?",
  myAssessments:"My assessments", allAssessments:"All assessments", todaysAssessments:"Today's Assessments", gradeAPercent:"Grade A %", humanReviews:"Human Reviews", pendingDisputes:"Pending Disputes", recentAssessments:"Recent assessments", activity:"Activity", howItWorks:"How it works",
  qualityReports:"Quality reports", reportId:"Report ID", date:"Date", location:"Location", policyVersion:"Policy version", gradeA:"Grade A %", urs:"URS %", confidence:"Confidence", farmerAck:"Farmer acknowledgement", graderAck:"Grader acknowledgement", disputeStatus:"Dispute status", sampleSize:"Sample size", lotId:"Lot ID", hash:"Hash (SHA-256)", uploadedImages:"Uploaded Images", perOnionResults:"Per-Onion Results",
  downloadInSelected:"Download in", downloadInEnglish:"Download in English", qrVerify:"QR Verification", openVerification:"Open verification",
  gradingPolicy:"Grading policy", sizeBand:"Size band", defectTolerances:"Defect tolerances", offlineSync:"Offline & Sync", system:"System", languageSettings:"Language", changeLanguage:"Change language",
  myFarm:"My farm — grading overview", procOverview:"AI-assisted procurement overview", newAssessmentTitle:"New assessment", farmerGraderSession:"Farmer + Grader joint session · AI assists, human decides",
  storedReportData:"Stored Report Data", finalReport:"Final Report", viewOf:"View", withRef:"with 25mm ref", storedIn:"Stored in Supabase Storage", demoPlaceholder:"Demo placeholder",
  acknowledged:"Acknowledged", pending:"Pending", noDispute:"No dispute", underReview:"Under review", disputed:"Disputed", generatePdf:"Generate PDF · Print", markAck:"Mark acknowledged", flagReview:"Flag Report / Second Review",
  verification:"Verification", reportVerified:"Report Verified",
};

function f(t){ return { ...en, ...t }; }
const dict = {
  en,
  hi: f({ selectLanguage:"भाषा चुनें", selectLanguageDesc:"अपनी पसंदीदा भाषा चुनें — आप इसे सेटिंग्स में कभी भी बदल सकते हैं।", continue:"जारी रखें", back:"पीछे", next:"आगे", save:"सहेजें", loading:"लोड हो रहा है...", search:"खोजें", viewAll:"सभी देखें", openReport:"रिपोर्ट खोलें", newAssessment:"नया मूल्यांकन", dashboard:"डैशबोर्ड", assessments:"मूल्यांकन", reviews:"समीक्षा", reports:"रिपोर्ट", policy:"नीति", settings:"सेटिंग्स", farmer:"किसान", grader:"ग्रेडर", farmerDesc:"मेरे लॉट, रिपोर्ट और QR सत्यापन देखें", graderDesc:"लॉट ग्रेड करें, समीक्षा, नीति", login:"लॉगिन", signup:"साइन अप", logout:"लॉगआउट", welcomeBack:"वापसी पर स्वागत है", welcomeCreate:"अपना बनाएं", onionSetu:"ओनियनसेतु", gmailOrPhone:"जीमेल या फोन नंबर", password:"पासवर्ड", fullName:"पूरा नाम", villageCenter:"गाँव / केंद्र", sendOtp:"OTP भेजें", verifyOtp:"OTP सत्यापित करें", resendOtp:"OTP पुनः भेजें", enterOtp:"6-अंकों का OTP दर्ज करें", demoAccounts:"डेमो खाते", quickLogin:"त्वरित लॉगिन", noAccount:"खाता नहीं है?", haveAccount:"पहले से खाता है?", myAssessments:"मेरे मूल्यांकन", allAssessments:"सभी मूल्यांकन", todaysAssessments:"आज के मूल्यांकन", gradeAPercent:"ग्रेड A %", humanReviews:"मानव समीक्षा", pendingDisputes:"लंबित विवाद", recentAssessments:"हाल के मूल्यांकन", activity:"गतिविधि", howItWorks:"कैसे काम करता है", qualityReports:"गुणवत्ता रिपोर्ट", reportId:"रिपोर्ट आईडी", date:"तारीख", location:"स्थान", policyVersion:"नीति संस्करण", gradeA:"ग्रेड A %", urs:"URS %", confidence:"विश्वास", farmerAck:"किसान स्वीकृति", graderAck:"ग्रेडर स्वीकृति", disputeStatus:"विवाद स्थिति", sampleSize:"नमूना आकार", lotId:"लॉट आईडी", hash:"हैश (SHA-256)", uploadedImages:"अपलोड की गई तस्वीरें", perOnionResults:"प्रति प्याज परिणाम", downloadInSelected:"डाउनलोड करें", downloadInEnglish:"अंग्रेजी में डाउनलोड", qrVerify:"QR सत्यापन", openVerification:"सत्यापन खोलें", gradingPolicy:"ग्रेडिंग नीति", sizeBand:"आकार सीमा", defectTolerances:"दोष सहनशीलता", offlineSync:"ऑफलाइन और सिंक", system:"सिस्टम", languageSettings:"भाषा", changeLanguage:"भाषा बदलें", myFarm:"मेरा खेत — ग्रेडिंग अवलोकन", procOverview:"AI-सहायित खरीद अवलोकन", newAssessmentTitle:"नया मूल्यांकन", farmerGraderSession:"किसान + ग्रेडर संयुक्त सत्र", storedReportData:"संग्रहीत रिपोर्ट डेटा", finalReport:"अंतिम रिपोर्ट", acknowledged:"स्वीकृत ✓", pending:"लंबित", noDispute:"कोई विवाद नहीं", underReview:"समीक्षाधीन", disputed:"विवादित", generatePdf:"PDF बनाएं · प्रिंट", markAck:"स्वीकृति दर्ज करें", flagReview:"रिपोर्ट फ्लैग करें", verification:"सत्यापन", reportVerified:"रिपोर्ट सत्यापित", }),
  bn: f({ selectLanguage:"ভাষা নির্বাচন করুন", selectLanguageDesc:"আপনার পছন্দের ভাষা চয়ন করুন — সেটিংসে যে কোনো সময় পরিবর্তন করতে পারেন।", continue:"চালিয়ে যান", back:"পিছনে", next:"পরবর্তী", save:"সংরক্ষণ", loading:"লোড হচ্ছে...", search:"অনুসন্ধান", viewAll:"সব দেখুন", openReport:"রিপোর্ট খুলুন", newAssessment:"নতুন মূল্যায়ন", dashboard:"ড্যাশবোর্ড", assessments:"মূল্যায়ন", reviews:"পর্যালোচনা", reports:"রিপোর্ট", policy:"নীতি", settings:"সেটিংস", farmer:"কৃষক", grader:"গ্রেডার", farmerDesc:"আমার লট, রিপোর্ট ও QR যাচাই দেখুন", graderDesc:"লট গ্রেড করুন, পর্যালোচনা, নীতি", login:"লগইন", signup:"সাইন আপ", logout:"লগআউট", welcomeBack:"ফিরে আসার জন্য স্বাগতম", gmailOrPhone:"জিমেইল বা ফোন নম্বর", password:"পাসওয়ার্ড", fullName:"পুরো নাম", sendOtp:"OTP পাঠান", verifyOtp:"OTP যাচাই করুন", enterOtp:"৬-সংখ্যার OTP লিখুন", demoAccounts:"ডেমো অ্যাকাউন্ট", myAssessments:"আমার মূল্যায়ন", allAssessments:"সমস্ত মূল্যায়ন", todaysAssessments:"আজকের মূল্যায়ন", gradeAPercent:"গ্রেড A %", humanReviews:"মানব পর্যালোচনা", pendingDisputes:"মুলতুবি বিরোধ", recentAssessments:"সাম্প্রতিক মূল্যায়ন", activity:"কার্যকলাপ", howItWorks:"কিভাবে কাজ করে", qualityReports:"গুণমান রিপোর্ট", reportId:"রিপোর্ট আইডি", date:"তারিখ", location:"অবস্থান", policyVersion:"নীতি সংস্করণ", gradeA:"গ্রেড A %", urs:"URS %", confidence:"আত্মবিশ্বাস", farmerAck:"কৃষক স্বীকৃতি", graderAck:"গ্রেডার স্বীকৃতি", disputeStatus:"বিরোধের অবস্থা", sampleSize:"নমুনার আকার", lotId:"লট আইডি", hash:"হ্যাশ", uploadedImages:"আপলোড করা ছবি", perOnionResults:"প্রতি পেঁয়াজ ফলাফল", downloadInSelected:"ডাউনলোড করুন", downloadInEnglish:"ইংরেজিতে ডাউনলোড", qrVerify:"QR যাচাই", gradingPolicy:"গ্রেডিং নীতি", languageSettings:"ভাষা", changeLanguage:"ভাষা পরিবর্তন", }),
  te: f({ selectLanguage:"భాషను ఎంచుకోండి", continue:"కొనసాగించు", back:"వెనుకకు", next:"తదుపరి", dashboard:"డాష్‌బోర్డ్", assessments:"మూల్యాంకనాలు", reviews:"సమీక్షలు", reports:"నివేదికలు", policy:"విధానం", settings:"సెట్టింగ్‌లు", farmer:"రైతు", grader:"గ్రేడర్", farmerDesc:"నా లాట్‌లు, నివేదికలు & QR ధృవీకరణ", login:"లాగిన్", signup:"సైన్ అప్", gmailOrPhone:"జీమెయిల్ లేదా ఫోన్", password:"పాస్‌వర్డ్", sendOtp:"OTP పంపండి", verifyOtp:"OTP ధృవీకరించు", myAssessments:"నా మూల్యాంకనాలు", allAssessments:"అన్ని మూల్యాంకనాలు", todaysAssessments:"నేటి మూల్యాంకనాలు", gradeAPercent:"గ్రేడ్ A %", humanReviews:"మానవ సమీక్షలు", pendingDisputes:"పెండింగ్ వివాదాలు", recentAssessments:"ఇటీవలి మూల్యాంకనాలు", qualityReports:"నాణ్యత నివేదికలు", reportId:"నివేదిక ఐడి", date:"తేదీ", location:"ప్రదేశం", gradeA:"గ్రేడ్ A %", uploadedImages:"అప్‌లోడ్ చేసిన చిత్రాలు", downloadInEnglish:"ఇంగ్లీష్‌లో డౌన్‌లోడ్", gradingPolicy:"గ్రేడింగ్ విధానం", languageSettings:"భాష", }),
  mr: f({ selectLanguage:"भाषा निवडा", continue:"पुढे जा", back:"मागे", next:"पुढील", dashboard:"डॅशबोर्ड", assessments:"मूल्यमापन", reviews:"पुनरावलोकन", reports:"अहवाल", policy:"धोरण", settings:"सेटिंग्ज", farmer:"शेतकरी", grader:"ग्रेडर", farmerDesc:"माझे लॉट, अहवाल व QR पडताळणी", login:"लॉगिन", signup:"साइन अप", gmailOrPhone:"जीमेल किंवा फोन", password:"पासवर्ड", sendOtp:"OTP पाठवा", myAssessments:"माझे मूल्यमापन", allAssessments:"सर्व मूल्यमापन", todaysAssessments:"आजचे मूल्यमापन", gradeAPercent:"ग्रेड A %", humanReviews:"मानवी पुनरावलोकन", recentAssessments:"अलीकडील मूल्यमापन", qualityReports:"गुणवत्ता अहवाल", reportId:"अहवाल आयडी", date:"तारीख", location:"स्थान", gradeA:"ग्रेड A %", uploadedImages:"अपलोड केलेल्या प्रतिमा", downloadInEnglish:"इंग्रजीत डाउनलोड", gradingPolicy:"ग्रेडिंग धोरण", }),
  ta: f({ selectLanguage:"மொழியைத் தேர்ந்தெடுக்கவும்", continue:"தொடரவும்", back:"பின்", next:"அடுத்து", dashboard:"டாஷ்போர்டு", assessments:"மதிப்பீடுகள்", reviews:"மறுஆய்வுகள்", reports:"அறிக்கைகள்", policy:"கொள்கை", settings:"அமைப்புகள்", farmer:"விவசாயி", grader:"தரநிர்ணயிப்பாளர்", farmerDesc:"என் லாட்கள், அறிக்கைகள் & QR சரிபார்ப்பு", login:"உள்நுழை", signup:"பதிவு", gmailOrPhone:"ஜிமெயில் அல்லது தொலைபேசி", password:"கடவுச்சொல்", sendOtp:"OTP அனுப்பு", verifyOtp:"OTP சரிபார்", myAssessments:"என் மதிப்பீடுகள்", allAssessments:"அனைத்து மதிப்பீடுகள்", todaysAssessments:"இன்றைய மதிப்பீடுகள்", gradeAPercent:"கிரேடு A %", humanReviews:"மனித மதிப்பாய்வுகள்", recentAssessments:"சமீபத்திய மதிப்பீடுகள்", qualityReports:"தர அறிக்கைகள்", reportId:"அறிக்கை ஐடி", date:"தேதி", location:"இடம்", gradeA:"கிரேடு A %", uploadedImages:"பதிவேற்றிய படங்கள்", downloadInEnglish:"ஆங்கிலத்தில் பதிவிறக்க", }),
  gu: f({ selectLanguage:"ભાષા પસંદ કરો", continue:"ચાલુ રાખો", back:"પાછળ", next:"આગળ", dashboard:"ડેશબોર્ડ", assessments:"મૂલ્યાંકન", reviews:"સમીક્ષા", reports:"રિપોર્ટ", policy:"નીતિ", settings:"સેટિંગ્સ", farmer:"ખેડૂત", grader:"ગ્રેડર", login:"લોગિન", signup:"સાઇન અપ", gmailOrPhone:"જીમેઇલ અથવા ફોન", password:"પાસવર્ડ", sendOtp:"OTP મોકલો", myAssessments:"મારા મૂલ્યાંકન", allAssessments:"બધા મૂલ્યાંકન", todaysAssessments:"આજના મૂલ્યાંકન", gradeAPercent:"ગ્રેડ A %", qualityReports:"ગુણવત્તા રિપોર્ટ", reportId:"રિપોર્ટ આઈડી", gradeA:"ગ્રેડ A %", uploadedImages:"અપલોડ કરેલી છબીઓ", }),
  ur: f({ selectLanguage:"زبان منتخب کریں", continue:"جاری رکھیں", back:"پیچھے", next:"اگلا", dashboard:"ڈیش بورڈ", assessments:"تشخیص", reviews:"جائزہ", reports:"رپورٹس", policy:"پالیسی", settings:"ترتیبات", farmer:"کسان", grader:"گریڈر", login:"لاگ ان", signup:"سائن اپ", gmailOrPhone:"جیمیل یا فون", password:"پاس ورڈ", sendOtp:"OTP بھیجیں", myAssessments:"میری تشخیص", allAssessments:"تمام تشخیص", gradeA:"گریڈ A %", reportId:"رپورٹ آئی ڈی", uploadedImages:"اپ لوڈ کردہ تصاویر", }),
  kn: f({ selectLanguage:"ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", continue:"ಮುಂದುವರಿಸಿ", dashboard:"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", assessments:"ಮೌಲ್ಯಮಾಪನ", reviews:"ವಿಮರ್ಶೆ", reports:"ವರದಿಗಳು", policy:"ನೀತಿ", settings:"ಸೆಟ್ಟಿಂಗ್‌ಗಳು", farmer:"ರೈತ", grader:"ಗ್ರೇಡರ್", login:"ಲಾಗಿನ್", gmailOrPhone:"ಜಿಮೇಲ್ ಅಥವಾ ಫೋನ್", sendOtp:"OTP ಕಳುಹಿಸಿ", myAssessments:"ನನ್ನ ಮೌಲ್ಯಮಾಪನ", allAssessments:"ಎಲ್ಲಾ ಮೌಲ್ಯಮಾಪನ", gradeAPercent:"ಗ್ರೇಡ್ A %", qualityReports:"ಗುಣಮಟ್ಟ ವರದಿಗಳು", reportId:"ವರದಿ ಐಡಿ", gradeA:"ಗ್ರೇಡ್ A %", uploadedImages:"ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಚಿತ್ರಗಳು", }),
  ml: f({ selectLanguage:"ഭാഷ തിരഞ്ഞെടുക്കുക", continue:"തുടരുക", dashboard:"ഡാഷ്‌ബോർഡ്", assessments:"മൂല്യനിർണയം", reviews:"അവലോകനം", reports:"റിപ്പോർട്ടുകൾ", policy:"നയം", settings:"ക്രമീകരണങ്ങൾ", farmer:"കർഷകൻ", grader:"ഗ്രേഡർ", login:"ലോഗിൻ", gmailOrPhone:"ജിമെയിൽ അല്ലെങ്കിൽ ഫോൺ", sendOtp:"OTP അയയ്ക്കുക", myAssessments:"എന്റെ മൂല്യനിർണയങ്ങൾ", allAssessments:"എല്ലാ മൂല്യനിർണയങ്ങൾ", gradeAPercent:"ഗ്രേഡ് A %", qualityReports:"ഗുണനിലവാര റിപ്പോർട്ടുകൾ", reportId:"റിപ്പോർട്ട് ഐഡി", uploadedImages:"അപ്‌ലോഡ് ചെയ്ത ചിത്രങ്ങൾ", }),
  or: f({ selectLanguage:"ଭାଷା ବାଛନ୍ତୁ", dashboard:"ଡ୍ୟାସବୋର୍ଡ", assessments:"ମୂଲ୍ୟାଙ୍କନ", reviews:"ସମୀକ୍ଷା", reports:"ରିପୋର୍ଟ", farmer:"ଚାଷୀ", grader:"ଗ୍ରେଡର", login:"ଲଗଇନ୍", gradeA:"ଗ୍ରେଡ୍ A %" }),
  pa: f({ selectLanguage:"ਭਾਸ਼ਾ ਚੁਣੋ", continue:"ਜਾਰੀ ਰੱਖੋ", dashboard:"ਡੈਸ਼ਬੋਰਡ", assessments:"ਮੁਲਾਂਕਣ", reviews:"ਸਮੀਖਿਆ", reports:"ਰਿਪੋਰਟਾਂ", farmer:"ਕਿਸਾਨ", grader:"ਗ੍ਰੇਡਰ", login:"ਲਾਗਇਨ", gmailOrPhone:"ਜੀਮੇਲ ਜਾਂ ਫੋਨ", sendOtp:"OTP ਭੇਜੋ", myAssessments:"ਮੇਰੇ ਮੁਲਾਂਕਣ", allAssessments:"ਸਾਰੇ ਮੁਲਾਂਕਣ", gradeAPercent:"ਗ੍ਰੇਡ A %", qualityReports:"ਗੁਣਵੱਤਾ ਰਿਪੋਰਟਾਂ", reportId:"ਰਿਪੋਰਟ ਆਈਡੀ", uploadedImages:"ਅੱਪਲੋਡ ਕੀਤੀਆਂ ਤਸਵੀਰਾਂ", }),
  as: f({ selectLanguage:"ভাষা বাছনি কৰক", dashboard:"ডেশ্বব'ৰ্ড", assessments:"মূল্যায়ন", reports:"প্ৰতিবেদন", farmer:"কৃষক", grader:"গ্ৰেডাৰ", login:"লগইন", gradeA:"গ্ৰেড A %", reportId:"প্ৰতিবেদন আইডি" }),
  mai: f({ selectLanguage:"भाषा चुनू", dashboard:"डैशबोर्ड", farmer:"किसान", grader:"ग्रेडर", login:"लॉगिन", reports:"रिपोर्ट", gradeA:"ग्रेड A %" }),
  sat: f({ selectLanguage:"ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ", dashboard:"ᱰᱮᱥᱵᱚᱨᱰ", farmer:"ᱪᱟᱹᱥᱤ", reports:"ᱨᱤᱯᱚᱴ", gradeA:"ᱜᱨᱮᱰ A %" }),
  ks: f({ selectLanguage:"زَبان چُنِو", dashboard:"ڈیش بورڈ", farmer:"کسان", reports:"رپورٹ", gradeA:"گریڈ A %" }),
  ne: f({ selectLanguage:"भाषा छान्नुहोस्", dashboard:"ड्यासबोर्ड", farmer:"किसान", reports:"रिपोर्ट", gradeA:"ग्रेड A %" }),
  sd: f({ selectLanguage:"ٻولي چونڊيو", dashboard:"ڊيش بورڊ", farmer:"هاري", reports:"رپورٽ", gradeA:"گريڊ A %" }),
  kok: f({ selectLanguage:"भास निवडा", dashboard:"डॅशबोर्ड", farmer:"शेतकार", reports:"अहवाल", gradeA:"ग्रेड A %" }),
  doi: f({ selectLanguage:"भाषा चुनो", dashboard:"डैशबोर्ड", farmer:"किसान", reports:"रिपोर्ट", gradeA:"ग्रेड A %" }),
  mni: f({ selectLanguage:"লোল চয়ন তৌ", dashboard:"ড্যাসবোর্ড", farmer:"লৌমী", reports:"রিপোর্ট", gradeA:"গ্রেড A %" }),
  brx: f({ selectLanguage:"राव बाछा", dashboard:"डैशबोर्ड", farmer:"बिरुवा गामि", reports:"रिपोर्ट", gradeA:"बर' A %" }),
  sa: f({ selectLanguage:"भाषां चिनोतु", dashboard:"फलकम्", farmer:"कृषकः", grader:"श्रेणीकारः", login:"प्रवेशः", reports:"प्रतिवेदनम्", gradeA:"श्रेणी A %", assessments:"मूल्याङ्कनम्" }),
};

const LS_LANG = "onion-setu-lang";
const I18nContext = createContext(null);
export function useI18n(){ return useContext(I18nContext); }
export function I18nProvider({ children }){
  const [lang, setLangState] = useState(()=>{
    try{ const v=localStorage.getItem(LS_LANG); if(v && dict[v]) return v; }catch{}
    return "";
  });
  const [ready, setReady] = useState(Boolean(lang));
  function setLang(code){
    if(!dict[code]) code="en";
    localStorage.setItem(LS_LANG, code);
    try{
      const raw = localStorage.getItem("onion-setu-auth-v1");
      if(raw){ const u=JSON.parse(raw); localStorage.setItem("onion-setu-auth-v1", JSON.stringify({...u, preferredLang: code})); }
    }catch{}
    setLangState(code); setReady(true); document.documentElement.lang = code;
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
