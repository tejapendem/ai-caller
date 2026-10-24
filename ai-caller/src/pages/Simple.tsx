import { RefreshCw, UserPlus, PhoneCall, Users, BookOpen } from "lucide-react";
import { PageHeader, EmptyState } from "../components/UI";

export function Employees({ onNavigate }: { onNavigate: (r: string) => void }) {
  return (
    <>
      <PageHeader
        eyebrow="MY TEAM"
        title="My Employees"
        actions={
          <>
            <button className="icon-square" aria-label="Refresh"><RefreshCw size={16} /></button>
            <button className="btn btn-primary" onClick={() => onNavigate("store")}>
              <UserPlus size={17} /> New employee
            </button>
          </>
        }
      />
      <EmptyState
        icon={<UserPlus />}
        title="Hire your first AI employee"
        body="It answers calls and chases leads while you sleep — no salary, no sick days. Build and test one free before it goes live."
        action={
          <button className="btn btn-primary" onClick={() => onNavigate("store")}>
            <UserPlus size={17} /> New employee
          </button>
        }
      />
    </>
  );
}

export function Talk({ onNavigate }: { onNavigate: (r: string) => void }) {
  return (
    <>
      <PageHeader eyebrow="TALK" title="Build someone to talk to" />
      <div style={{ marginTop: 18 }}>
        <EmptyState
          icon={<PhoneCall />}
          title="You don't have an employee yet"
          body="You don't have an employee yet. Build one — it takes a couple of minutes — and you can hear them speak before you ever pay for a hire."
          action={
            <button className="btn btn-primary" onClick={() => onNavigate("store")}>
              <UserPlus size={17} /> Build an employee
            </button>
          }
        />
      </div>
    </>
  );
}

export function Teach() {
  return (
    <>
      <PageHeader
        eyebrow="TEACH"
        title="Teach your employee"
        subtitle="Tell it about your business in your own words — it learns the facts and the rules."
        actions={<button className="btn btn-outline btn-sm"><RefreshCw size={15} /> Refresh</button>}
      />
      <div className="empty-card" style={{ padding: 48 }}>
        <div className="empty-tile"><BookOpen /></div>
        <div className="empty-title">No employees yet</div>
        <p className="empty-body">Hire an employee first, then come back to teach them.</p>
      </div>
    </>
  );
}

export function Inbound({ onNavigate }: { onNavigate: (r: string) => void }) {
  return (
    <>
      <div className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", marginBottom: 20 }}>
        <span className="tile lav" style={{ width: 32, height: 32 }}><PhoneCall size={16} /></span>
        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>
          Add an Inbound Calling employee to unlock this panel
        </span>
        <button className="link-accent" style={{ border: 0, background: "none" }} onClick={() => onNavigate("store")}>
          Add one
        </button>
      </div>

      <PageHeader
        eyebrow="INBOUND CALLS"
        title="Every call answered, day or night."
        subtitle="Your employee picks up, answers questions, and books the job — then logs everything to your leads."
      />

      <div className="empty-card" style={{ padding: 48 }}>
        <div className="empty-tile"><Users /></div>
        <div className="empty-title">No inbound calls yet</div>
        <p className="empty-body">
          Buy a phone number and attach it to an employee, and every incoming
          call will show up here with a transcript and outcome.
        </p>
        <div style={{ marginTop: 18 }}>
          <button className="btn btn-primary" onClick={() => onNavigate("numbers")}>
            <PhoneCall size={17} /> Get a phone number
          </button>
        </div>
      </div>
    </>
  );
}
