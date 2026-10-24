import { useState, type ReactNode } from "react";
import {
  PanelLeft, Search, BookOpen, HelpCircle, Bell, ChevronDown, Plus,
  PhoneCall, ArrowRight,
} from "lucide-react";
import { NAV, FOOTER_NAV } from "../nav";

export function Sidebar({
  route, onNavigate, open,
}: { route: string; onNavigate: (r: string) => void; open: boolean }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand-row">
        <div>
          <div className="wordmark">
            OUTPER<span className="ring" aria-hidden />
          </div>
          <div className="brand-sub">
            <span className="dot" />
            AI PHONE CALLING
          </div>
        </div>
        <button className="icon-square" aria-label="Collapse sidebar">
          <PanelLeft size={17} />
        </button>
      </div>

      <nav className="nav-scroll">
        {NAV.map((g) => (
          <div className="nav-group" key={g.group}>
            <div className="nav-label">{g.group}</div>
            {g.items.map((it) => {
              const Icon = it.icon;
              return (
                <button
                  key={it.id}
                  className={`nav-item ${route === it.id ? "active" : ""}`}
                  onClick={() => onNavigate(it.id)}
                >
                  <Icon />
                  {it.label}
                  {it.badge && <span className="nav-badge">{it.badge}</span>}
                </button>
              );
            })}
          </div>
        ))}
        <div className="nav-group">
          {FOOTER_NAV.map((it) => {
            const Icon = it.icon;
            return (
              <button
                key={it.id}
                className={`nav-item ${route === it.id ? "active" : ""}`}
                onClick={() => onNavigate(it.id)}
              >
                <Icon />
                {it.label}
                {it.badge && <span className="nav-badge">{it.badge}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="team-card">
        <div className="row">
          <span className="title">Your team</span>
          <span className="working">0 working</span>
        </div>
        <div className="body">No employees yet</div>
      </div>

      <div className="side-foot">
        <div className="links">
          <a href="#" onClick={(e) => e.preventDefault()}>Help &amp; Docs</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Refund</a>
        </div>
        <div className="second">
          <a href="#" onClick={(e) => e.preventDefault()}>Contact</a>
          <a href="#" onClick={(e) => e.preventDefault()}>outpero.com</a>
        </div>
      </div>
    </aside>
  );
}

export function TopBar({ onToggleNav }: { onToggleNav: () => void }) {
  return (
    <header className="topbar">
      <button className="icon-square mobile-only" onClick={onToggleNav} aria-label="Toggle navigation">
        <PanelLeft size={17} />
      </button>

      <label className="search">
        <Search size={16} />
        <input placeholder="Search employees, pages…" />
        <span className="kbd">⌘K</span>
      </label>

      <div className="live-pill">
        <span className="dot" />
        <div>
          <div className="t1">0 on calls now · 0.0 calls/min</div>
          <div className="t2">0 talking · 0 ringing</div>
        </div>
      </div>

      <div className="minutes-pill">
        <PhoneCall size={15} color="#97721d" />
        <span className="t">7–10 min</span>
        <button className="plus" aria-label="Add credits"><Plus size={15} /></button>
      </div>

      <div className="top-actions">
        <button className="top-icon" aria-label="Docs"><BookOpen size={17} /></button>
        <button className="top-icon" aria-label="Help"><HelpCircle size={17} /></button>
        <button className="top-icon" aria-label="Notifications">
          <Bell size={17} />
          <span className="badge" />
        </button>
      </div>

      <button className="account">
        <span className="avatar">SA</span>
        <span className="who">
          <b>sa</b>
          <span>you@business.com</span>
        </span>
        <ChevronDown size={16} className="chev" />
      </button>
    </header>
  );
}

export function Banner({ onStart }: { onStart?: () => void }) {
  return (
    <div className="banner">
      <span className="ico"><PhoneCall size={17} /></span>
      <div className="txt">
        <div className="t1">Build your first employee</div>
        <div className="t2">About three minutes, and free to build and test.</div>
      </div>
      <button className="btn btn-gold btn-sm" onClick={onStart}>Start</button>
    </div>
  );
}

export function AppShell({
  route, onNavigate, children,
}: { route: string; onNavigate: (r: string) => void; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="app">
      <Sidebar route={route} onNavigate={onNavigate} open={open} />
      <div className="main">
        <TopBar onToggleNav={() => setOpen((v) => !v)} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export function SoftLink({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button className="link-accent" onClick={onClick} style={{ border: 0, background: "none", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 4 }}>
      {children} <ArrowRight size={14} />
    </button>
  );
}
