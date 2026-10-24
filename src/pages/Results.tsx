import { useState } from "react";
import {
  RefreshCw, Download, Search, LayoutGrid, List, Rows3, User, ChevronDown,
  PhoneIncoming, Zap, Megaphone, MessageCircle, Target, Coins, TrendingUp,
} from "lucide-react";
import { PageHeader, Stat } from "../components/UI";

export function Leads({ onNavigate }: { onNavigate: (r: string) => void }) {
  const [view, setView] = useState("list");
  const [channel, setChannel] = useState("All channels");

  return (
    <>
      <PageHeader
        eyebrow="RESULTS"
        title="Leads & Results"
        subtitle="Every contact your employees have spoken with — across inbound, instant and bulk."
        actions={
          <>
            <button className="icon-square" aria-label="Refresh"><RefreshCw size={16} /></button>
            <button className="btn btn-soft"><Download size={16} /> Export</button>
          </>
        }
      />

      <div className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", marginBottom: 16 }}>
        <span className="dot" style={{ background: "#c9c9d4" }} />
        <b style={{ fontSize: 13 }}>Live calls (0)</b>
        <span style={{ fontSize: 13, color: "var(--faint)" }}>No calls in flight right now.</span>
      </div>

      <div className="stats-4" style={{ marginBottom: 16 }}>
        <Stat label="Total leads" value="0" caption="people · 0 calls made" dot="#7a50dc" />
        <Stat label="Qualified" value="0" caption="positive outcome" dot="#2fb457" />
        <Stat label="Pending callback" value="0" caption="need follow-up" dot="#d4a346" />
        <Stat label="Hot leads" value="0" caption="interested · last 7d" dot="#e2683f" />
      </div>

      <div className="spread" style={{ marginBottom: 12, flexWrap: "wrap" }}>
        <label className="search-inline" style={{ flex: "0 1 420px" }}>
          <Search size={15} />
          <input placeholder="Search name, phone or captured info…" />
        </label>
        <div className="row">
          <button className="chip"><ChevronDown size={14} /> Most recent</button>
          <div className="seg">
            {[["list", List], ["grid", LayoutGrid], ["rows", Rows3]].map(([id, Icon]: any) => (
              <button key={id} className={view === id ? "on" : ""} onClick={() => setView(id)} aria-label={id}>
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="toolbar" style={{ marginBottom: 10 }}>
        {["All channels", "Inbound", "Instant", "Bulk"].map((c) => (
          <button key={c} className={`chip ${channel === c ? "on" : ""}`} onClick={() => setChannel(c)}>
            {c === "Inbound" && <PhoneIncoming size={14} />}
            {c === "Instant" && <Zap size={14} />}
            {c === "Bulk" && <Megaphone size={14} />}
            {c}
          </button>
        ))}
        <button className="chip"><User size={14} /> All employees <ChevronDown size={14} /></button>
        <button className="chip">Any time <ChevronDown size={14} /></button>
      </div>
      <div className="toolbar" style={{ marginBottom: 14 }}>
        <button className="chip"><TrendingUp size={14} /> All outcomes <ChevronDown size={14} /></button>
        <button className="chip"><Zap size={14} /> Hot only</button>
        <button className="chip"><List size={14} /> More filters <ChevronDown size={14} /></button>
      </div>

      <div style={{ fontSize: 12.5, color: "var(--faint)", marginBottom: 10 }}>
        Showing <b style={{ color: "var(--text)" }}>0</b> leads
      </div>

      <div className="empty-card" style={{ padding: 52 }}>
        <div className="empty-tile"><User /></div>
        <div className="empty-title">No leads yet</div>
        <p className="empty-body">
          Everyone your employees call or answer lands here — with the outcome,
          the details they captured, and a full transcript. Get an employee
          working to start filling this in.
        </p>
        <div style={{ marginTop: 18 }}>
          <button className="btn btn-primary" onClick={() => onNavigate("employees")}>Go to my employees</button>
        </div>
      </div>
    </>
  );
}

export function Conversations() {
  const [channel, setChannel] = useState<string[]>(["Inbound"]);
  const [range, setRange] = useState("All time");

  const toggle = (v: string) =>
    setChannel((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  return (
    <>
      <PageHeader
        eyebrow="CONVERSATIONS"
        title="Conversations"
        subtitle="Every call your employees handled — filter, sort, and export."
        actions={
          <>
            <button className="icon-square" aria-label="Refresh"><RefreshCw size={16} /></button>
            <button className="btn btn-soft"><Download size={16} /> Export CSV</button>
          </>
        }
      />
      <p style={{ fontSize: 12.5, color: "var(--faint)", marginBottom: 16 }}>
        Call recordings are kept for 90 days, then automatically deleted — the transcript
        and summary stay for as long as your account is active.
      </p>

      <div className="stats-3" style={{ marginBottom: 16 }}>
        <div className="card" style={{ padding: 18 }}>
          <span className="tile lav"><MessageCircle size={17} /></span>
          <div style={{ marginTop: 14, fontSize: 13, color: "var(--muted)" }}>Calls</div>
          <div className="val" style={{ fontFamily: "Outfit", fontSize: 26, fontWeight: 800, marginTop: 6 }}>0</div>
          <div style={{ fontSize: 12, color: "var(--faint)", marginTop: 4 }}>all time</div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <span className="tile amber"><Target size={17} /></span>
          <div style={{ marginTop: 14, fontSize: 13, color: "var(--muted)" }}>Qualified</div>
          <div style={{ fontFamily: "Outfit", fontSize: 26, fontWeight: 800, marginTop: 6 }}>0</div>
          <div style={{ fontSize: 12, color: "var(--faint)", marginTop: 4 }}>all time</div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <span className="tile blue"><Coins size={17} /></span>
          <div style={{ marginTop: 14, fontSize: 13, color: "var(--muted)" }}>Credits used</div>
          <div style={{ fontFamily: "Outfit", fontSize: 26, fontWeight: 800, marginTop: 6 }}>₹0</div>
          <div style={{ fontSize: 12, color: "var(--faint)", marginTop: 4 }}>all time</div>
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <label className="search-inline" style={{ width: "100%", marginBottom: 12 }}>
          <Search size={15} />
          <input placeholder="Search contact, phone, employee, summary…" />
        </label>

        <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
          {["All directions", "Recording: any", "Ended: any", "All time", "Any length"].map((p) => (
            <select key={p} className="select" defaultValue={p}>
              <option>{p}</option>
            </select>
          ))}
          <div className="row">
            <input className="input" placeholder="credits" style={{ maxWidth: 140 }} />
            <span className="faint">–</span>
            <input className="input" placeholder="credits" style={{ maxWidth: 140 }} />
          </div>
        </div>

        {[
          { label: "Channel", items: ["Inbound", "Instant", "Bulk"] },
          { label: "Outcome", items: ["Qualified", "Interested", "Callback", "Not interested", "No response", "No answer", "Busy", "Call failed", "Voicemail"] },
          { label: "Sentiment", items: ["Positive", "Neutral", "Negative"] },
          { label: "Sort", items: ["Time", "Duration", "Credits", "Outcome"] },
        ].map((g) => (
          <div key={g.label} style={{ marginBottom: 12 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>{g.label}</div>
            <div className="toolbar">
              {g.items.map((it) => (
                <button
                  key={it}
                  className={`chip ${g.label === "Channel" && channel.includes(it) ? "on" : ""}`}
                  onClick={() => g.label === "Channel" && toggle(it)}
                >
                  {it}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="toolbar" style={{ marginTop: 16 }}>
          {["All time", "Today", "Last 7 days", "Last 30 days", "Custom range"].map((r) => (
            <button key={r} className={`chip ${range === r ? "on" : ""}`} onClick={() => setRange(r)}>{r}</button>
          ))}
        </div>
      </div>
    </>
  );
}
