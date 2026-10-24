import { useState } from "react";
import {
  ArrowRight, Play, Check, ChevronDown, Mic, Phone,
  Zap, Megaphone, PhoneIncoming, RefreshCw, Hash, Shield,
  MessageSquare, Calendar, Database, Smartphone, PhoneCall,
} from "lucide-react";

/* ─── design tokens from outpero.com ─────────────────────────── */
const T = {
  ink:     "#0f0f14",
  muted:   "#6b6b78",
  faint:   "#a0a0ac",
  canvas:  "#f6f6f8",
  line:    "#e4e4e9",
  paper:   "#ffffff",
  brand:   "#7c3aed",
  brand50: "#f5f3ff",
  brand100:"#ede9fe",
  brand700:"#6d28d9",
};

const FONT = "'Geist','Inter',ui-sans-serif,system-ui,'Nirmala UI','Noto Sans',sans-serif";

/* ─── data ────────────────────────────────────────────────────── */
const LANGUAGES  = ["हिन्दी","తెలుగు","தமிழ்","ಕನ್ನಡ","മലയാളം","मराठी","English"];
const INDUSTRIES = ["Remind about renewals","Call new property leads","Remind patients","Wake up an old list","Book test drives"];

const VOICE_CARDS = [
  { industry:"LOANS & INSURANCE", dur:"1:10", title:"Screens eligibility and chases documents",        name:"Sneha",  voice:"Voice P02", dir:"Outbound" },
  { industry:"REAL ESTATE",       dur:"1:10", title:"Qualifies a property lead and books a site visit", name:"Neha",   voice:"Voice P01", dir:"Outbound" },
  { industry:"COACHING",          dur:"1:12", title:"Explains batches and fees, books a demo class",    name:"Ankit",  voice:"Voice P09", dir:"Outbound" },
  { industry:"HOSPITALS",         dur:"1:12", title:"Answers a patient and books an appointment",       name:"Pooja",  voice:"Voice P02", dir:"Inbound"  },
  { industry:"CAR DEALERSHIP",    dur:"1:09", title:"Follows up an enquiry and books a test drive",     name:"Rahul",  voice:"Voice P07", dir:"Outbound" },
  { industry:"E-COMMERCE",        dur:"1:07", title:"Confirms a cash-on-delivery order",                name:"Kavya",  voice:"Voice P06", dir:"Outbound" },
  { industry:"RESTAURANTS",       dur:"1:11", title:"Takes a table or party booking",                   name:"Riya",   voice:"Voice P06", dir:"Inbound"  },
  { industry:"RECRUITMENT",       dur:"1:00", title:"Screens a candidate's notice period and salary",   name:"Vishal", voice:"Voice P09", dir:"Outbound" },
];

const BUILT_IN = [
  {
    title:"Numbers in 5 mins",
    body:"Complete digital KYC and get an IVRS-ready business number.",
    tags:["KYC done","IVRS-ready"],
    demo: (
      <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:8}}>
        {["+91 88521 •••••","+91 90758 •••••","+91 70412 •••••"].map((n,i)=>(
          <div key={n} style={{display:"flex",alignItems:"center",gap:10,background:i===0?"#f5f3ff":T.paper,border:`1px solid ${i===0?T.brand:T.line}`,borderRadius:10,padding:"10px 14px",fontSize:13}}>
            <span style={{width:22,height:22,borderRadius:"50%",background:i===0?T.brand:T.canvas,color:i===0?"#fff":T.muted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</span>
            <span style={{fontFamily:"monospace",flex:1}}>{n}</span>
            {i===0 && <Check size={14} color={T.brand}/>}
          </div>
        ))}
      </div>
    ),
  },
  {
    title:"Auto-retries",
    body:'Busy, no answer or "call me later": handled on its own.',
    tags:[],
    demo:(
      <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:0}}>
        {[
          {time:"10:00 AM · Call 1",status:"Busy",color:"#ef4444",dot:true},
          {time:"Auto-scheduled",status:"for 5:00 PM",color:T.brand,dot:false,arrow:true},
          {time:"5:00 PM · Call 2",status:"Connected · site visit booked",color:"#22c55e",dot:true},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"8px 0",position:"relative"}}>
            {r.dot && <span style={{width:10,height:10,borderRadius:"50%",background:r.color,flexShrink:0,marginTop:4}}/>}
            {r.arrow && <span style={{fontSize:16,color:T.brand,flexShrink:0,marginTop:2}}>↓</span>}
            <div>
              <div style={{fontSize:12,fontWeight:600,color:T.ink}}>{r.time}</div>
              <div style={{fontSize:12,color:r.dot?r.color:T.brand}}>{r.status}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title:"Trust & compliance",
    body:"DLT-registered numbers and consent checks, built in.",
    tags:[],
    demo:(
      <div style={{marginTop:14,display:"flex",gap:10}}>
        {[{icon:"🔒",label:"DLT Registered"},{icon:"✅",label:"Consent checks"}].map(b=>(
          <div key={b.label} style={{flex:1,background:T.canvas,borderRadius:10,padding:"10px",textAlign:"center",fontSize:12,color:T.muted}}>
            <div style={{fontSize:22,marginBottom:4}}>{b.icon}</div>{b.label}
          </div>
        ))}
      </div>
    ),
  },
  {
    title:"Never drops the ball",
    body:"",
    tags:[],
    demo:(
      <ul style={{marginTop:14,display:"flex",flexDirection:"column",gap:8,listStyle:"none",padding:0}}>
        {["Recovers mid-call","Never calls anyone twice","Steady under load","Auto-pause on carrier refusals","Spend floor on every call"].map(f=>(
          <li key={f} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:T.ink}}>
            <Check size={14} color={T.brand}/>{f}
          </li>
        ))}
      </ul>
    ),
  },
];

const AGENTIC_NODES = [
  {label:"WhatsApp",      sub:"Location sent",    color:"#22c55e", icon:"💬", angle:225},
  {label:"Google Calendar",sub:"Booked Sat, 11:00",color:"#3b82f6",icon:"📅", angle:315},
  {label:"Your CRM",       sub:"Lead fetched",     color:"#f97316", icon:"🗃", angle:45},
  {label:"Custom API",     sub:"EMI ₹1.04L/mo",    color:"#8b5cf6", icon:"{ }", angle:135},
  {label:"Caller memory",  sub:"Remembered Rahul", color:"#06b6d4", icon:"🧠", angle:200},
  {label:"Call transfer",  sub:"Sent to your team",color:"#10b981", icon:"📲", angle:160},
];

const FOOTER_COLS = [
  { title:"Product",    links:["Instant leads","Bulk campaigns","Inbound","Voices","Pricing"] },
  { title:"Industries", links:["BFSI","Real estate","Healthcare","Education","Automotive","E-commerce","All industries"] },
  { title:"By language",links:["Tamil AI voice agents","Telugu AI voice agents","Kannada AI voice agents","Malayalam AI voice agents","Hindi AI voice agents","Marathi AI voice agents","Free AI voice agent"] },
  { title:"Resources",  links:["Docs","Blog","Glossary","Comparisons","Contact","Agency services"] },
];

/* ─── helpers ─────────────────────────────────────────────────── */
const Pill = ({children, style={}}: {children:any, style?:any}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:4,background:T.brand50,color:T.brand,borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:700,letterSpacing:"0.04em",...style}}>{children}</span>
);

const SectionLabel = ({children}:{children:string}) => (
  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:20}}>
    <span style={{width:6,height:6,borderRadius:"50%",background:T.brand,display:"inline-block"}}/>
    <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:T.brand,textTransform:"uppercase"}}>{children}</span>
  </div>
);

/* ─── component ───────────────────────────────────────────────── */
export default function Landing({ onStartFree }: { onStartFree: () => void }) {
  const [activeLang, setActiveLang] = useState("हिन्दी");
  const [brief, setBrief]           = useState("");
  const [activeChan, setActiveChan] = useState("Bulk campaigns");

  return (
    <div style={{fontFamily:FONT,color:T.ink,background:T.paper,overflowX:"hidden"}}>

      {/* ── NAV ────────────────────────────────────────────────── */}
      <header style={{
        position:"sticky",top:0,zIndex:100,
        background:"rgba(255,255,255,0.9)",backdropFilter:"blur(16px)",
        borderBottom:`1px solid ${T.line}`,
      }}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 32px",height:64,display:"flex",alignItems:"center",gap:8}}>
          {/* Logo */}
          <a href="#" style={{fontWeight:900,fontSize:22,letterSpacing:"-0.5px",color:T.ink,textDecoration:"none",display:"flex",alignItems:"center",gap:1,marginRight:8}}>
            OUTPER<span style={{width:11,height:11,borderRadius:"50%",border:`2.5px solid ${T.brand}`,display:"inline-block",marginBottom:2}}/>
          </a>
          {/* Nav links */}
          <nav style={{display:"flex",gap:2,flex:1}}>
            {["Product ↓","Voices","Pricing","Contact","Docs","API"].map(l=>(
              <a key={l} href={`#${l.toLowerCase().replace(" ↓","")}`} style={{
                fontSize:13,fontWeight:500,color:T.muted,textDecoration:"none",
                padding:"6px 12px",borderRadius:99,
              }}
              onMouseEnter={e=>{e.currentTarget.style.color=T.ink;e.currentTarget.style.background=T.canvas;}}
              onMouseLeave={e=>{e.currentTarget.style.color=T.muted;e.currentTarget.style.background="transparent";}}
              >{l}</a>
            ))}
          </nav>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={onStartFree} style={{background:"none",border:"none",fontSize:13,fontWeight:500,cursor:"pointer",color:T.muted,padding:"6px 12px",borderRadius:99}}
              onMouseEnter={e=>{e.currentTarget.style.color=T.ink;e.currentTarget.style.background=T.canvas;}}
              onMouseLeave={e=>{e.currentTarget.style.color=T.muted;e.currentTarget.style.background="transparent";}}
            >Sign in</button>
            <button onClick={onStartFree} style={{
              background:T.brand,color:"#fff",border:"none",borderRadius:99,
              padding:"8px 18px",fontSize:13,fontWeight:600,cursor:"pointer",
              display:"flex",alignItems:"center",gap:6,
            }}>Start free <ArrowRight size={14}/></button>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{background:T.paper,padding:"80px 32px 0",position:"relative",overflow:"hidden"}}>
        {/* Grid background */}
        <div style={{
          position:"absolute",inset:0,zIndex:0,
          backgroundImage:`linear-gradient(${T.line} 1px,transparent 1px),linear-gradient(90deg,${T.line} 1px,transparent 1px)`,
          backgroundSize:"48px 48px",opacity:0.5,
        }}/>
        {/* Purple glow */}
        <div style={{
          position:"absolute",left:"50%",top:"40%",transform:"translate(-50%,-50%)",
          width:900,height:500,borderRadius:"50%",
          background:"radial-gradient(closest-side,#8c66e4,transparent)",
          opacity:0.12,filter:"blur(40px)",zIndex:0,
        }}/>

        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
          {/* Voice pill */}
          <div style={{
            display:"inline-flex",alignItems:"center",gap:10,
            background:"rgba(255,255,255,0.9)",border:`1px solid ${T.line}`,
            borderRadius:99,padding:"6px 16px 6px 8px",fontSize:13,marginBottom:28,
            boxShadow:"0 1px 6px rgba(0,0,0,0.06)",backdropFilter:"blur(8px)",
          }}>
            <span style={{width:26,height:26,borderRadius:"50%",background:T.brand,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Phone size={12} color="#fff"/>
            </span>
            <span style={{fontSize:13,color:"#555",letterSpacing:"0.1em"}}>▐▌▐▌▐</span>
            <span style={{fontWeight:700}}>नमस्ते</span>
            <span style={{color:T.faint,borderLeft:`1px solid ${T.line}`,paddingLeft:10}}>Speaks 7 Indian languages</span>
            <button style={{
              display:"flex",alignItems:"center",gap:5,
              background:T.brand50,border:"none",borderRadius:99,
              padding:"4px 12px",fontSize:12,fontWeight:600,color:T.brand,cursor:"pointer",
            }}><Play size={10} fill={T.brand}/> Hear a call</button>
          </div>

          <h1 style={{
            fontSize:"clamp(52px,9vw,96px)",fontWeight:900,letterSpacing:"-3px",
            lineHeight:1.0,marginBottom:16,color:T.ink,
          }}>AI telecalling software.</h1>

          <p style={{
            fontSize:"clamp(20px,3vw,30px)",fontWeight:500,color:T.muted,marginBottom:40,
            lineHeight:1.3,
          }}>
            India's most{" "}
            <span style={{color:T.brand,fontWeight:700,fontStyle:"italic"}}>natural-sounding</span>
            {" "}voice agents.
          </p>

          {/* 3 product pills */}
          <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap",marginBottom:40}}>
            {[
              {icon:Zap,          label:"Instant leads",  sub:"Calls new enquiries within 30 seconds"},
              {icon:Megaphone,    label:"Bulk campaigns",  sub:"Works through lists, many calls at once"},
              {icon:PhoneIncoming,label:"Inbound",         sub:"Answers your number, day and night"},
            ].map(f=>{
              const Icon=f.icon;
              return (
                <div key={f.label} style={{
                  display:"flex",alignItems:"center",gap:12,
                  background:T.paper,border:`1px solid ${T.line}`,
                  borderRadius:14,padding:"12px 18px",
                  boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
                }}>
                  <span style={{
                    width:32,height:32,borderRadius:10,background:T.brand50,
                    display:"flex",alignItems:"center",justifyContent:"center",color:T.brand,flexShrink:0,
                  }}><Icon size={15}/></span>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:13,fontWeight:700,color:T.ink}}>{f.label}</div>
                    <div style={{fontSize:12,color:T.faint}}>{f.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dark composer */}
          <div style={{
            background:"linear-gradient(160deg,#13002e 0%,#220850 60%,#1a0040 100%)",
            borderRadius:24,padding:"24px 24px 18px",
            boxShadow:"0 24px 80px rgba(124,58,237,0.35)",
            textAlign:"left",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <span style={{color:"#e0d0ff",fontSize:15,fontWeight:600}}>What should your AI telecaller do?</span>
              <button style={{
                display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,0.08)",
                border:"1px solid rgba(255,255,255,0.15)",borderRadius:99,
                padding:"4px 12px",fontSize:12,color:"#c0a0ff",cursor:"pointer",
              }}>in Hindi <ChevronDown size={12}/></button>
            </div>
            <textarea
              value={brief}
              onChange={e=>setBrief(e.target.value)}
              placeholder="e.g. Remind customers whose EMI is due this week, and note who promises to pay."
              rows={3}
              style={{
                width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:14,padding:"14px 16px",color:"#fff",fontSize:14,resize:"none",
                outline:"none",boxSizing:"border-box",
              }}
            />
            <div style={{marginTop:10,marginBottom:14,display:"flex",flexWrap:"wrap",gap:8}}>
              <span style={{fontSize:12,color:"#a080c0",marginRight:4}}>Try:</span>
              {INDUSTRIES.map(i=>(
                <button key={i} onClick={()=>setBrief(i)} style={{
                  display:"flex",alignItems:"center",gap:5,
                  background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:99,padding:"4px 12px",fontSize:12,color:"#c0a0ff",cursor:"pointer",
                }}>{i}</button>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
              <button style={{
                display:"flex",alignItems:"center",gap:8,
                background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:99,padding:"9px 18px",color:"#c0a0ff",fontSize:13,cursor:"pointer",
              }}>
                <span style={{width:28,height:28,borderRadius:"50%",background:T.brand,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Mic size={13} color="#fff"/>
                </span>
                Describe it by voice
                <span style={{fontSize:11,color:"#8060a0"}}>Speak in your language. We'll write it up.</span>
              </button>
              <button onClick={onStartFree} style={{
                display:"flex",alignItems:"center",gap:8,
                background:T.paper,color:T.ink,border:"none",
                borderRadius:12,padding:"11px 24px",fontSize:14,fontWeight:700,cursor:"pointer",
              }}>Build my employee <ArrowRight size={15}/></button>
            </div>
          </div>

          {/* Trust strip */}
          <div style={{padding:"20px 0 60px",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <div style={{
              display:"inline-flex",alignItems:"center",gap:8,
              background:T.paper,border:`1px solid ${T.line}`,borderRadius:99,
              padding:"7px 16px",fontSize:13,fontWeight:600,
              boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <Check size={14} color="#22c55e"/> Trusted by 5,000+ businesses
            </div>
            <div style={{fontSize:12,color:T.faint}}>
              50 free credits · No card required · <span style={{color:T.brand}}>From ₹5 per minute</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section style={{background:T.canvas,borderTop:`1px solid ${T.line}`,borderBottom:`1px solid ${T.line}`,padding:"80px 32px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <h2 style={{textAlign:"center",fontSize:38,fontWeight:800,letterSpacing:"-1px",marginBottom:24}}>How it works</h2>
          <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:48,flexWrap:"wrap"}}>
            {LANGUAGES.map(l=>(
              <button key={l} onClick={()=>setActiveLang(l)} style={{
                padding:"6px 18px",borderRadius:99,fontSize:13,fontWeight:600,cursor:"pointer",border:"none",
                background:activeLang===l?T.ink:T.paper,
                color:activeLang===l?"#fff":T.muted,
                boxShadow:activeLang===l?"none":`0 0 0 1px ${T.line}`,
              }}>{l}</button>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,alignItems:"start"}}>
            {/* Phone mockup */}
            <div style={{
              background:"linear-gradient(160deg,#13002e,#220850)",
              borderRadius:28,overflow:"hidden",
              boxShadow:"0 20px 60px rgba(124,58,237,0.3)",
            }}>
              {/* phone header bar */}
              <div style={{background:"rgba(255,255,255,0.04)",borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",gap:5}}>
                  {["#ff5f57","#febc2e","#28c840"].map(c=><span key={c} style={{width:9,height:9,borderRadius:"50%",background:c}}/>)}
                </div>
                <span style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>OUTPERO / Conversations</span>
                <span style={{background:"#1a3a2a",color:"#4ade80",fontSize:10,borderRadius:99,padding:"2px 8px",fontWeight:600}}>✓ Site visit booked</span>
              </div>
              {/* contact row */}
              <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:12}}>
                <span style={{width:36,height:36,borderRadius:"50%",background:"#4c1d95",display:"flex",alignItems:"center",justifyContent:"center",color:"#c4b5fd",fontWeight:700,fontSize:13,flexShrink:0}}>AV</span>
                <div>
                  <div style={{color:"#fff",fontWeight:600,fontSize:13}}>Aman Verma</div>
                  <div style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>+91 98••• •••210 · Meta ad · Noida</div>
                </div>
                <span style={{marginLeft:"auto",background:"rgba(196,181,253,0.15)",color:"#c4b5fd",fontSize:11,borderRadius:6,padding:"2px 8px"}}>Hindi + English</span>
              </div>
              {/* captured fields */}
              <div style={{padding:"12px 18px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[{l:"Looking for",v:"2BHK, Sector 150"},{l:"Purpose",v:"To live in"},{l:"Budget",v:"~₹90L"},{l:"Site visit",v:"Sat, 11:00 AM"}].map(r=>(
                  <div key={r.l} style={{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"10px 12px"}}>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginBottom:4}}>{r.l}</div>
                    <div style={{fontSize:13,fontWeight:600,color:"#fff",display:"flex",alignItems:"center",gap:6}}>
                      {r.v} <Check size={11} color="#4ade80"/>
                    </div>
                  </div>
                ))}
              </div>
              {/* summary */}
              <div style={{padding:"0 18px 14px",fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.5}}>
                Wants a 2BHK in Sector 150, Noida to live in, around ₹90L. Site visit booked for Saturday 11 AM; location sent on WhatsApp.
              </div>
              {/* action chips */}
              <div style={{padding:"0 18px 18px",display:"flex",gap:8,flexWrap:"wrap"}}>
                {[
                  {label:"WhatsApp",      sub:"Location sent",        color:"#22c55e"},
                  {label:"Google Sheets", sub:"Row added",             color:"#3b82f6"},
                  {label:"Your CRM",      sub:"Lead updated",          color:"#f97316"},
                ].map(a=>(
                  <div key={a.label} style={{
                    display:"flex",alignItems:"center",gap:8,
                    background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",
                    borderRadius:10,padding:"8px 12px",fontSize:12,
                  }}>
                    <Check size={12} color={a.color}/>
                    <div>
                      <div style={{color:"#fff",fontWeight:600}}>{a.label}</div>
                      <div style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>{a.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right explanation */}
            <div>
              <div style={{fontSize:13,fontWeight:700,color:T.brand,marginBottom:8,letterSpacing:"0.05em"}}>HOW IT WORKS</div>
              <h3 style={{fontSize:28,fontWeight:800,letterSpacing:"-0.5px",marginBottom:16,lineHeight:1.2}}>
                Your employee calls, qualifies, and logs everything.
              </h3>
              <p style={{color:T.muted,lineHeight:1.7,marginBottom:28,fontSize:15}}>
                The moment a lead arrives — from Meta, your site, or a list — your employee calls. They ask the right questions, book the appointment, and send the details on WhatsApp. Everything lands in your CRM.
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {[
                  {step:"01",text:"New lead hits your webhook or list"},
                  {step:"02",text:"Employee calls within seconds"},
                  {step:"03",text:"Qualifies, books, logs — automatically"},
                ].map(s=>(
                  <div key={s.step} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",background:T.canvas,borderRadius:12,border:`1px solid ${T.line}`}}>
                    <span style={{width:28,height:28,borderRadius:"50%",background:T.brand,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0}}>{s.step}</span>
                    <span style={{fontSize:14,fontWeight:500}}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HEAR OUR VOICES ────────────────────────────────────── */}
      <section id="voices" style={{padding:"80px 32px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <h2 style={{fontSize:36,fontWeight:800,letterSpacing:"-1px",marginBottom:24}}>Hear our voices</h2>
          <div style={{display:"flex",gap:8,marginBottom:36,flexWrap:"wrap"}}>
            {LANGUAGES.map(l=>(
              <button key={l} onClick={()=>setActiveLang(l)} style={{
                padding:"5px 16px",borderRadius:99,fontSize:13,fontWeight:600,cursor:"pointer",border:"none",
                background:activeLang===l?T.ink:T.canvas,
                color:activeLang===l?"#fff":T.muted,
              }}>{l}</button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
            {VOICE_CARDS.map(c=>(
              <div key={c.title} style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:16,padding:"18px",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <span style={{fontSize:10,fontWeight:700,color:T.faint,letterSpacing:"0.1em"}}>{c.industry}</span>
                  <span style={{fontSize:11,color:T.faint}}>{c.dur}</span>
                </div>
                <div style={{fontSize:14,fontWeight:600,color:T.ink,marginBottom:14,lineHeight:1.4}}>{c.title}</div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                  <span style={{width:22,height:22,borderRadius:"50%",background:T.canvas,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.muted}}>{c.name[0]}</span>
                  <span style={{fontSize:12,color:T.muted}}>{c.name} · {c.voice}</span>
                  <span style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:4,fontSize:11,color:T.faint}}>
                    <PhoneCall size={11}/>{c.dir}
                  </span>
                </div>
                {/* Waveform + play */}
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <button style={{width:36,height:36,borderRadius:"50%",background:T.ink,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                    <Play size={14} fill="#fff" color="#fff"/>
                  </button>
                  <div style={{flex:1,height:32,display:"flex",alignItems:"center",gap:1}}>
                    {Array.from({length:40},(_,i)=>(
                      <div key={i} style={{width:3,borderRadius:2,background:T.line,height:`${8+Math.sin(i*0.8)*10+Math.random()*8}px`}}/>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:28}}>
            <button style={{display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",fontSize:14,fontWeight:600,color:T.brand,cursor:"pointer"}}>
              Browse all voices <ArrowRight size={15}/>
            </button>
          </div>
        </div>
      </section>

      {/* ── ONE EMPLOYEE, EVERY CHANNEL ────────────────────────── */}
      <section style={{padding:"80px 32px",background:T.canvas,borderTop:`1px solid ${T.line}`,borderBottom:`1px solid ${T.line}`}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <SectionLabel>ONE OUTPERO EMPLOYEE, EVERY CHANNEL</SectionLabel>
          <h2 style={{fontSize:36,fontWeight:800,letterSpacing:"-1px",marginBottom:32}}>
            New leads, old lists, incoming calls. <span style={{color:T.faint}}>Same employee.</span>
          </h2>
          <div style={{display:"flex",gap:12,marginBottom:36,flexWrap:"wrap"}}>
            {[
              {label:"Instant leads",  sub:"Call every enquiry in 30s"},
              {label:"Bulk campaigns", sub:"Work through your lists"},
              {label:"Inbound",        sub:"Answer your number 24/7"},
            ].map(t=>(
              <button key={t.label} onClick={()=>setActiveChan(t.label)} style={{
                display:"flex",alignItems:"center",gap:12,padding:"14px 20px",
                borderRadius:14,cursor:"pointer",flex:"1 1 200px",
                background:activeChan===t.label?T.paper:"transparent",
                border:`1px solid ${activeChan===t.label?T.brand:T.line}`,
                boxShadow:activeChan===t.label?"0 2px 8px rgba(0,0,0,0.06)":"none",
                textAlign:"left",
              }}>
                <span style={{width:36,height:36,borderRadius:10,background:activeChan===t.label?T.brand:T.canvas,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {t.label==="Instant leads"?<Zap size={16} color={activeChan===t.label?"#fff":T.muted}/>:t.label==="Bulk campaigns"?<Megaphone size={16} color={activeChan===t.label?"#fff":T.muted}/>:<PhoneIncoming size={16} color={activeChan===t.label?"#fff":T.muted}/>}
                </span>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:T.ink}}>{t.label}</div>
                  <div style={{fontSize:12,color:T.faint}}>{t.sub}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Campaign demo */}
          <div style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:20,padding:"20px",boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,borderBottom:`1px solid ${T.line}`,paddingBottom:14}}>
              <div style={{display:"flex",gap:5}}>
                {["#ddd","#ddd","#ddd"].map((c,i)=><span key={i} style={{width:9,height:9,borderRadius:"50%",background:c}}/>)}
              </div>
              <span style={{fontSize:12,color:T.faint,flex:1,textAlign:"center"}}>OUTPERO / Campaigns</span>
              <span style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#22c55e",fontWeight:600}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#22c55e"}}/>Running
              </span>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div>
                  <div style={{fontSize:15,fontWeight:700}}>Festive offer · past enquiries</div>
                  <div style={{fontSize:12,color:T.faint}}>1,240 contacts · 10:00–19:00 · Hindi + English</div>
                </div>
                <Pill>12 calls at a time</Pill>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:13,color:T.muted}}>768 of 1,240 called</span>
                <span style={{fontSize:12,color:T.faint}}>~43 min left</span>
              </div>
              <div style={{background:T.line,borderRadius:99,height:6,overflow:"hidden"}}>
                <div style={{width:"62%",height:"100%",background:`linear-gradient(90deg,${T.brand},#22c55e)`,borderRadius:99}}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {[{label:"Interested",val:"36",color:"#22c55e"},{label:"Call back",val:"141",color:"#3b82f6"},{label:"Not interested",val:"89",color:T.faint},{label:"No answer",val:"502",color:T.faint}].map(s=>(
                <div key={s.label} style={{textAlign:"center",padding:"12px",background:T.canvas,borderRadius:12}}>
                  <div style={{fontSize:11,color:T.faint,marginBottom:4}}>{s.label}</div>
                  <div style={{fontSize:22,fontWeight:800,color:s.color}}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AGENTIC — INDIA'S BEST VOICES ─────────────────────── */}
      <section style={{padding:"80px 32px",overflow:"hidden"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
          <div>
            <SectionLabel>AGENTIC, NOT JUST TALKING</SectionLabel>
            <h2 style={{fontSize:34,fontWeight:800,letterSpacing:"-1px",lineHeight:1.2,marginBottom:16}}>
              India's best voices.<br/><span style={{color:T.brand}}>Now with hands.</span>
            </h2>
            <p style={{color:T.muted,fontSize:15,lineHeight:1.7}}>
              While she talks, she works: books, sends, looks things up and hands over, mid-call.
            </p>
          </div>
          {/* Spider diagram */}
          <div style={{position:"relative",height:340,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {/* Center node */}
            <div style={{
              position:"absolute",zIndex:2,
              width:80,height:80,borderRadius:"50%",
              background:"linear-gradient(135deg,#220850,#4c1d95)",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              boxShadow:"0 0 0 12px rgba(124,58,237,0.12), 0 0 0 24px rgba(124,58,237,0.06)",
            }}>
              <Mic size={24} color="#c4b5fd"/>
              <span style={{fontSize:10,color:"#c4b5fd",marginTop:4,fontWeight:700}}>Meera</span>
              <span style={{fontSize:9,color:"rgba(196,181,253,0.6)"}}>on a call, in Hindi</span>
            </div>
            {/* Orbital nodes */}
            {AGENTIC_NODES.map(n=>{
              const rad=n.angle*(Math.PI/180);
              const r=130;
              const x=Math.cos(rad)*r;
              const y=Math.sin(rad)*r;
              return (
                <div key={n.label} style={{
                  position:"absolute",
                  transform:`translate(${x}px,${y}px)`,
                  zIndex:2,
                }}>
                  <div style={{
                    background:T.paper,border:`1px solid ${T.line}`,borderRadius:12,
                    padding:"8px 12px",boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
                    display:"flex",alignItems:"center",gap:8,minWidth:120,
                    transform:"translate(-50%,-50%)",
                  }}>
                    <span style={{fontSize:16}}>{n.icon}</span>
                    <div>
                      <div style={{fontSize:11,fontWeight:700,color:T.ink}}>{n.label}</div>
                      <div style={{fontSize:10,color:n.color,fontWeight:600}}>{n.sub}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BUILT IN ───────────────────────────────────────────── */}
      <section style={{padding:"80px 32px",background:T.paper,borderTop:`1px solid ${T.line}`}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <SectionLabel>BUILT IN</SectionLabel>
          <h2 style={{fontSize:34,fontWeight:800,letterSpacing:"-1px",marginBottom:48}}>Built in, so you don't have to.</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:20}}>
            {BUILT_IN.map(f=>(
              <div key={f.title} style={{background:T.paper,border:`1px solid ${T.line}`,borderRadius:20,padding:"24px",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                <div style={{fontSize:15,fontWeight:700,marginBottom:6}}>{f.title}</div>
                {f.body && <div style={{fontSize:13,color:T.muted,lineHeight:1.6,marginBottom:6}}>{f.body}</div>}
                {f.tags.length>0 && (
                  <div style={{display:"flex",gap:6,marginBottom:8}}>
                    {f.tags.map(t=><Pill key={t}>{t}</Pill>)}
                  </div>
                )}
                {f.demo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── API SECTION ────────────────────────────────────────── */}
      <section style={{padding:"80px 32px"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
          <div>
            <SectionLabel>FOR DEVELOPERS</SectionLabel>
            <h2 style={{fontSize:32,fontWeight:800,letterSpacing:"-1px",marginBottom:16}}>Build on Outpero with our API.</h2>
            <p style={{color:T.muted,fontSize:15,lineHeight:1.7,marginBottom:24}}>
              Send leads in with one request, get every call's outcome back by webhook.
            </p>
            <button style={{display:"inline-flex",alignItems:"center",gap:6,background:T.brand,color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
              Read the API docs <ArrowRight size={14}/>
            </button>
          </div>
          {/* Code block */}
          <div style={{background:"#0f0f14",borderRadius:16,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
            <div style={{background:"#1a1a24",padding:"10px 16px",display:"flex",alignItems:"center",gap:6,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <span style={{fontSize:11,color:"#888"}}>Send a lead</span>
            </div>
            <div style={{padding:"16px 20px",fontFamily:"'Fira Code','Courier New',monospace",fontSize:12,lineHeight:1.7}}>
              <div style={{color:"#888"}}>POST /lead-intake/&#123;slug&#125;</div>
              <div style={{color:"#888"}}>X-Outpero-Lead-Secret: ••••••</div>
              <div style={{marginTop:10,color:"#e0e0e0"}}>{`{`}</div>
              <div style={{paddingLeft:16}}>
                <span style={{color:"#c4b5fd"}}>"phone"</span>
                <span style={{color:"#888"}}>: </span>
                <span style={{color:"#86efac"}}>"+9198•••••210"</span>
                <span style={{color:"#888"}}>,</span>
              </div>
              <div style={{paddingLeft:16}}>
                <span style={{color:"#c4b5fd"}}>"name"</span>
                <span style={{color:"#888"}}>: </span>
                <span style={{color:"#86efac"}}>"Rahul"</span>
              </div>
              <div style={{color:"#e0e0e0"}}>{`}`}</div>
              <div style={{marginTop:10,color:"#4ade80"}}>→ 202 Accepted · calling in 30s</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────── */}
      <section id="pricing" style={{background:T.canvas,borderTop:`1px solid ${T.line}`,borderBottom:`1px solid ${T.line}`,padding:"80px 32px"}}>
        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <SectionLabel>PRICING</SectionLabel>
          <h2 style={{fontSize:36,fontWeight:800,letterSpacing:"-1px",marginBottom:12}}>Pay for talk time. Nothing else.</h2>
          <p style={{color:T.muted,fontSize:15,marginBottom:48,maxWidth:520,margin:"0 auto 48px"}}>
            One credit is one rupee. Pick a voice per employee, top up when you need to, and your credits never expire.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:28}}>
            {[
              {label:"Standard",price:"₹5",  unit:"/min",tag:"MOST CHOSEN",desc:"More expressive voices for everyday sales and support.",   cta:"Start free",   hi:false},
              {label:"Premium", price:"₹6.8",unit:"/min",tag:null,         desc:"Our most lifelike voices, for calls where the voice is the brand.", cta:"Start free",   hi:false},
              {label:"Custom",  price:"₹3.5",unit:"/min",tag:null,         desc:"For high call volumes, with setup help from our team.",    cta:"Talk to us",  hi:false,aslow:true},
            ].map((p,i)=>(
              <div key={p.label} style={{
                background:T.paper,border:`1px solid ${p.label==="Standard"?T.brand:T.line}`,
                borderRadius:20,padding:"24px",position:"relative",textAlign:"left",
              }}>
                {p.label==="Standard" && (
                  <div style={{
                    position:"absolute",top:-12,left:20,
                    background:T.brand,color:"#fff",fontSize:10,fontWeight:800,
                    borderRadius:99,padding:"3px 12px",letterSpacing:"0.08em",
                  }}>MOST CHOSEN</div>
                )}
                <div style={{fontSize:13,fontWeight:700,color:T.muted,marginBottom:8,textTransform:"capitalize"}}>{p.label}</div>
                {p.aslow && <div style={{fontSize:11,color:T.faint,marginBottom:2}}>as low as</div>}
                <div style={{fontSize:44,fontWeight:900,letterSpacing:"-2px",color:T.ink,lineHeight:1}}>
                  {p.price}<span style={{fontSize:15,fontWeight:400,color:T.faint}}>{p.unit}</span>
                </div>
                <p style={{fontSize:13,color:T.muted,margin:"12px 0 20px",lineHeight:1.6}}>{p.desc}</p>
                <button onClick={onStartFree} style={{
                  width:"100%",padding:"10px",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",
                  background:p.cta==="Talk to us"?T.canvas:T.ink,
                  color:p.cta==="Talk to us"?T.ink:"#fff",
                  border:`1px solid ${p.cta==="Talk to us"?T.line:"transparent"}`,
                }}>{p.cta}</button>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:24,flexWrap:"wrap",fontSize:13,color:T.muted}}>
            {["50 free credits, no card","No setup or base fee","Business number ₹649/month"].map(n=>(
              <span key={n} style={{display:"flex",alignItems:"center",gap:5}}>
                <Check size={13} color="#22c55e"/>{n}
              </span>
            ))}
            <span style={{color:T.faint}}>Prices exclude GST</span>
          </div>
          <button style={{marginTop:16,background:"none",border:"none",fontSize:13,color:T.brand,cursor:"pointer",fontWeight:600}}>
            See full pricing →
          </button>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section style={{padding:"80px 32px"}}>
        <div style={{
          maxWidth:900,margin:"0 auto",
          background:"linear-gradient(135deg,#13002e 0%,#2d0f5e 60%,#1a0040 100%)",
          borderRadius:28,padding:"64px 48px",textAlign:"center",
          boxShadow:"0 20px 60px rgba(124,58,237,0.3)",
        }}>
          <h2 style={{fontSize:38,fontWeight:900,color:"#fff",letterSpacing:"-1px",marginBottom:12,lineHeight:1.15}}>
            Your first employee can<br/>be calling leads today.
          </h2>
          <p style={{color:"#c0a0ff",fontSize:16,marginBottom:36}}>
            Start with 50 free credits. No card, no setup fee. Pay per minute after that.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={onStartFree} style={{
              display:"flex",alignItems:"center",gap:8,
              background:T.paper,color:T.ink,border:"none",
              borderRadius:12,padding:"14px 28px",fontSize:15,fontWeight:800,cursor:"pointer",
            }}>Start free <ArrowRight size={16}/></button>
            <button style={{
              display:"flex",alignItems:"center",gap:8,
              background:"rgba(255,255,255,0.08)",color:"#fff",
              border:"1px solid rgba(255,255,255,0.2)",
              borderRadius:12,padding:"14px 28px",fontSize:15,fontWeight:700,cursor:"pointer",
            }}>Talk to us</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{background:"#fff",borderTop:`1px solid ${T.line}`,padding:"64px 32px 40px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"1.8fr 1fr 1fr 1fr 1fr",gap:40,marginBottom:48}}>
            <div>
              <div style={{fontWeight:900,fontSize:20,color:T.ink,letterSpacing:"-0.5px",marginBottom:12,display:"flex",alignItems:"center",gap:2}}>
                OUTPER<span style={{width:10,height:10,borderRadius:"50%",border:`2.5px solid ${T.brand}`,display:"inline-block",marginBottom:1}}/>
              </div>
              <p style={{fontSize:13,color:T.muted,lineHeight:1.7,marginBottom:14,maxWidth:220}}>
                AI employees that make your business calls: every lead, every list, in seven Indian languages.
              </p>
              <a href="mailto:support@outpero.com" style={{color:T.brand,fontSize:13,textDecoration:"none",fontWeight:500}}>support@outpero.com</a>
            </div>
            {FOOTER_COLS.map(col=>(
              <div key={col.title}>
                <div style={{fontWeight:700,fontSize:13,color:T.ink,marginBottom:14}}>{col.title}</div>
                {col.links.map(l=>(
                  <div key={l} style={{marginBottom:10}}>
                    <a href="#" style={{color:T.muted,fontSize:13,textDecoration:"none"}}
                      onMouseEnter={e=>e.currentTarget.style.color=T.ink}
                      onMouseLeave={e=>e.currentTarget.style.color=T.muted}
                    >{l}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{borderTop:`1px solid ${T.line}`,paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
              <span style={{fontSize:12,color:T.faint}}>© 2026 Outpero</span>
              {["Terms","Privacy","Refunds"].map(l=>(
                <a key={l} href="#" style={{fontSize:12,color:T.faint,textDecoration:"none"}}>{l}</a>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:11,color:T.faint}}>Supported by</span>
              <span style={{fontSize:13,fontWeight:700,color:T.ink}}>sarvam</span>
              <span style={{fontSize:11,color:T.faint}}>·</span>
              <span style={{fontSize:13,fontWeight:700,color:T.ink}}>✦ CARTESIA</span>
              <span style={{fontSize:11,color:T.faint}}>Startups</span>
            </div>
          </div>
          {/* Big watermark */}
          <div style={{textAlign:"center",marginTop:32,fontSize:"clamp(60px,12vw,120px)",fontWeight:900,color:T.canvas,letterSpacing:"-4px",userSelect:"none",lineHeight:1}}>
            OUTPERO
          </div>
        </div>
      </footer>
    </div>
  );
}
