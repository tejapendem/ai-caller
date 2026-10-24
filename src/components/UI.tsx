import type { ReactNode } from "react";

export function PageHeader({
  eyebrow, title, subtitle, actions,
}: { eyebrow: string; title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      {actions && <div className="head-actions">{actions}</div>}
    </div>
  );
}

export function Stat({
  label, value, caption, dot = "#7a50dc",
}: { label: string; value: string; caption?: string; dot?: string }) {
  return (
    <div className="stat">
      <div className="lbl">
        <span className="dotc" style={{ background: dot }} />
        {label}
      </div>
      <div className="val">{value}</div>
      {caption && <div className="cap">{caption}</div>}
    </div>
  );
}

export function EmptyState({
  icon, title, body, action, wide = true,
}: { icon: ReactNode; title: string; body: string; action?: ReactNode; wide?: boolean }) {
  return (
    <div className="empty-card" style={wide ? undefined : { padding: 40 }}>
      <div className="empty-tile">{icon}</div>
      <div className="empty-title">{title}</div>
      <p className="empty-body">{body}</p>
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  );
}

export function Segmented<T extends string>({
  options, value, onChange,
}: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.value} className={o.value === value ? "on" : ""} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return <button className={`toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)} aria-pressed={on} />;
}

export function SectionLabel({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="spread" style={{ marginBottom: 12 }}>
      <h3 className="section-label">{children}</h3>
      {right}
    </div>
  );
}
