import { useState } from "react";
import {
  Sparkles, Mic, Building2, GraduationCap, Stethoscope, Car, Sofa,
  Mic2, UserPlus, Megaphone, Wallet, Hash, Database, PhoneCall,
  ArrowRight, Phone, X, ChevronRight, LayoutGrid,
} from "lucide-react";
import { SectionLabel } from "../components/UI";
import { LANGUAGES, INDUSTRIES, QUICK_ACTIONS } from "../nav";

const ICONS: Record<string, any> = {
  userPlus: UserPlus, megaphone: Megaphone, wallet: Wallet,
  hash: Hash, database: Database, phone: PhoneCall,
};

const INDUSTRY_ICONS: Record<string, any> = {
  "Real estate": Building2,
  "Coaching & tuition": GraduationCap,
  "Hospital & clinic": Stethoscope,
  "Car & bike dealership": Car,
  "Interiors & construction": Sofa,
  "Local services": Mic2,
};

function Composer({ tall = false }: { tall?: boolean }) {
  const hireModes = ["Instant Lead Caller", "Bulk Caller", "Receptionist & Support"];
  const dashModes = ["Instant Lead Calling", "Bulk Calling", "Inbound Calling"];
  const modes = tall ? hireModes : dashModes;
  const [mode, setMode] = useState(modes[0]);
  const [lang, setLang] = useState("English");
  const [text, setText] = useState("");

  return (
    <div className="hero">
      <button className="hero-float" aria-label="Layout options"><LayoutGrid size={16} /></button>
      <div className="hero-kicker"><Sparkles size={13} /> Describe the job · we build the employee</div>
      <div className="hero-title-row">
        <span className="hero-title">Build your AI employee</span>
        <span className="free-chip">FREE</span>
      </div>
      <p className="hero-sub">Describe the job in a few sentences. You only pay for the calls they make.</p>

      <div className="hero-row">
        {modes.map((m) => (
          <button key={m} className={`hero-chip ${mode === m ? "active" : ""}`} onClick={() => setMode(m)}>
            {m === "Instant Lead Calling" ? <Sparkles size={14} /> : <PhoneCall size={14} />}
            {m}
          </button>
        ))}
        <div className="lang-strip">
          <span className="lang-label">PRIMARY</span>
          {LANGUAGES.map((l) => (
            <button key={l} className={`lang ${lang === l ? "active" : ""}`} onClick={() => setLang(l)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <textarea
        className={tall ? "tall" : undefined}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          tall
            ? "e.g. We're Sai Constructions — we build 2 & 3BHK flats. Tell us the call step by step:\n1. Greet them and mention they just enquired about our flats\n2. Ask their budget and which configuration (2 or 3BHK)\n3. If interested, book a site visit\n4. Thank them and say we'll send details on WhatsApp"
            : "e.g. Call every new enquiry from my Instagram ad, ask what they need, and book a visit."
        }
      />

      <div className="hero-foot">
        <button className="mic-btn" aria-label="Dictate"><Mic size={16} /></button>
        <span className="divider-v" />
        {INDUSTRIES.slice(0, 5).map((name) => {
          const Icon = INDUSTRY_ICONS[name] ?? Building2;
          return (
            <button key={name} className="industry">
              <Icon size={14} /> {name}
            </button>
          );
        })}
        {text.trim() !== "" && <span className="enter-hint">⌘ Enter to build</span>}
        <button className="btn btn-gold" style={{ padding: "0 22px" }}>
          <Sparkles size={16} /> Build my employee
        </button>
      </div>
    </div>
  );
}

export default function Dashboard({ onNavigate }: { onNavigate: (r: string) => void }) {
  const [credits, setCredits] = useState(() => {
    const seen = sessionStorage.getItem("outpero.credits-seen");
    if (seen) return false;
    sessionStorage.setItem("outpero.credits-seen", "1");
    return true;
  });

  return (
    <>
      <Composer />

      <div className="dash-grid">
        <div>
          <SectionLabel>Quick actions</SectionLabel>
          <div className="grid-2">
            {QUICK_ACTIONS.map((q) => {
              const Icon = ICONS[q.icon];
              return (
                <button key={q.title} className="quick" onClick={() => onNavigate(q.id)}>
                  <span className={`tile ${q.tone}`}><Icon /></span>
                  <span>
                    <span className="t1" style={{ display: "block" }}>{q.title}</span>
                    <span className="t2" style={{ display: "block" }}>{q.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <SectionLabel
            right={
              <button className="link-accent" style={{ border: 0, background: "none", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 3 }} onClick={() => onNavigate("employees")}>
                View all <ChevronRight size={14} />
              </button>
            }
          >
            Your AI employees
          </SectionLabel>

          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "18px", textAlign: "center", fontSize: 13, color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
              No employees yet. <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("store"); }} className="link-accent">Build your first</a>
            </div>
            <div style={{ padding: 12 }}>
              <button
                onClick={() => onNavigate("store")}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                  background: "#fff", border: "1px dashed #d9cff5", borderRadius: 14, color: "var(--accent)",
                  fontSize: 13.5, fontWeight: 600,
                }}
              >
                <span style={{ width: 34, height: 34, borderRadius: "50%", border: "1px dashed #b9a4ee", display: "grid", placeItems: "center" }}>
                  <UserPlus size={16} />
                </span>
                Build your first employee
              </button>
            </div>
          </div>
        </div>
      </div>

      {credits && (
        <div className="modal-backdrop" onClick={() => setCredits(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="x" onClick={() => setCredits(false)} aria-label="Close"><X size={18} /></button>
            <div className="glyph"><Phone size={24} /></div>
            <div className="big">₹50</div>
            <h3>free credits, added to your account</h3>
            <p>
              That's about 6 real calls — enough to hear your employee work.
              Yours to spend whenever you like — they never expire, and
              there's nothing to enter.
            </p>
            <div className="acts">
              <button className="btn btn-gold" onClick={() => { setCredits(false); onNavigate("store"); }}>
                <Sparkles size={16} /> Start my first call
              </button>
              <button className="btn" style={{ background: "none", color: "var(--muted)" }} onClick={() => setCredits(false)}>
                Look around first
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { Composer };
