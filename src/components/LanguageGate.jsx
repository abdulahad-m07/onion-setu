import MyTranslator from "./MyTranslator";

export default function LanguageGate(){
  return (
    <div style={{minHeight:"100dvh", background:"#FDFBF9", display:"grid", placeItems:"center", padding:"24px 12px"}}>
      <div style={{width:"100%", maxWidth:560, display:"grid", gap:20, textAlign:"center", justifyItems:"center"}}>
        <div style={{width:56,height:56, background:"#7A263A", color:"white", display:"grid", placeItems:"center", borderRadius:16, fontFamily:"Fraunces, serif", fontWeight:700, fontSize:22}}>O</div>
        <div>
          <h1 className="h-display" style={{margin:0, fontSize:28}}>Choose your language</h1>
          <p style={{margin:"8px 0 0", color:"#6B5A54", fontSize:14}}>Select your preferred language to continue. This is <b>My Translator</b> — OnionSetu's wrapped Google Translate, styled for the app. Works everywhere, from the first screen.</p>
        </div>
        <div style={{width:"100%", maxWidth:360}}>
          <MyTranslator variant="gate" />
        </div>
        <div style={{fontSize:11, color:"#8a7a74", maxWidth:400}}>
          22 Indian languages + English · Your choice is remembered per-device and per-user in Supabase. You can change it anytime in the top bar or Settings. Translations are 100% via My Translator.
        </div>
      </div>
    </div>
  );
}
