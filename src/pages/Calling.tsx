import { Zap, Upload, PhoneCall, CheckCircle2, ArrowRight, ArrowDownRight, Mic, BarChart3 } from "lucide-react";
import { PageHeader } from "../components/UI";

function Unlock({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <div className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", marginBottom: 20 }}>
      <span className="tile lav" style={{ width: 32, height: 32 }}><Zap size={16} /></span>
      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>
        Add a {label} employee to unlock this panel
      </span>
      <button className="link-accent" style={{ border: 0, background: "none" }} onClick={onAdd}>Add one</button>
    </div>
  );
}

function Flow({ steps }: { steps: { num: string; icon: any; title: string; sub: string }[] }) {
  return (
    <div className="step-flow">
      {steps.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={s.num} style={{ display: "contents" }}>
            <div className="step-card">
              <div className="spread" style={{ alignItems: "flex-start" }}>
                <span className="step-num">{s.num}</span>
                <span className="tile lav" style={{ width: 34, height: 34 }}><Icon size={16} /></span>
              </div>
              <div style={{ marginTop: 22, fontSize: 13.5, fontWeight: 700 }}>{s.title}</div>
              <div style={{ marginTop: 4, fontSize: 12.5, color: "var(--faint)" }}>{s.sub}</div>
            </div>
            {i < steps.length - 1 && (
              <div className="step-arrow"><ArrowRight size={18} /></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Instant({ onNavigate }: { onNavigate: (r: string) => void }) {
  return (
    <>
      <Unlock label="Instant Lead Calling" onAdd={() => onNavigate("store")} />
      <PageHeader
        eyebrow="INSTANT LEADS"
        title="A lead lands, the call is already dialing."
        subtitle="From your site, a form, an ad, your CRM — the instant a lead arrives, this employee calls. Here's exactly how:"
      />

      <Flow
        steps={[
          { num: "01", icon: ArrowDownRight, title: "New lead hits your webhook", sub: "From any source you connect" },
          { num: "02", icon: PhoneCall, title: "Employee calls within seconds", sub: "Before they've closed the tab" },
          { num: "03", icon: CheckCircle2, title: "Qualified", sub: "Outcome logged in your funnel" },
        ]}
      />

      <div style={{ marginTop: 18 }}>
        <button className="btn btn-primary"><Zap size={16} /> Get your webhook URL</button>
      </div>
    </>
  );
}

export function Bulk({ onNavigate }: { onNavigate: (r: string) => void }) {
  return (
    <>
      <Unlock label="Bulk Calling" onAdd={() => onNavigate("store")} />
      <PageHeader
        eyebrow="BULK CAMPAIGNS"
        title="One list in, fully worked, while you're elsewhere."
        subtitle="Old leads, a customer base, a cold list — upload it once and this employee dials the whole thing, at a pace you set. Here's exactly how:"
      />

      <Flow
        steps={[
          { num: "01", icon: Upload, title: "Upload your list", sub: "A CSV, or pulled from Leads" },
          { num: "02", icon: Mic, title: "Employee dials automatically", sub: "At the pace you set" },
          { num: "03", icon: BarChart3, title: "Watch it dial — live", sub: "Full analytics as it runs" },
        ]}
      />

      <div style={{ marginTop: 18 }}>
        <button className="btn btn-primary"><MegaphoneIcon /> Create your first campaign</button>
      </div>
    </>
  );
}

function MegaphoneIcon() {
  return <Zap size={16} />;
}
