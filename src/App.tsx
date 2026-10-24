import { useEffect, useState } from "react";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Hire from "./pages/Hire";
import { Employees, Talk, Teach, Inbound } from "./pages/Simple";
import { Instant, Bulk } from "./pages/Calling";
import { Leads, Conversations } from "./pages/Results";
import { Numbers, Performance, Billing, Settings, Developers } from "./pages/Setup";
import { AppShell, Banner } from "./components/Shell";
import { ROUTES } from "./nav";

function readRoute(): string {
  const h = window.location.hash.replace(/^#\/?/, "");
  return ROUTES.includes(h) ? h : "dashboard";
}

export default function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem("outpero.session") === "1");
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (r: string) => {
    window.location.hash = `#${r}`;
    setRoute(r);
    window.scrollTo({ top: 0 });
  };

  if (!authed) {
    return (
      <Auth
        onAuth={() => {
          localStorage.setItem("outpero.session", "1");
          setAuthed(true);
        }}
      />
    );
  }

  const page = () => {
    switch (route) {
      case "employees": return <Employees onNavigate={navigate} />;
      case "store": return <Hire />;
      case "talk": return <Talk onNavigate={navigate} />;
      case "instant": return <Instant onNavigate={navigate} />;
      case "bulk": return <Bulk onNavigate={navigate} />;
      case "inbound": return <Inbound onNavigate={navigate} />;
      case "leads": return <Leads onNavigate={navigate} />;
      case "conversations": return <Conversations />;
      case "teach": return <Teach />;
      case "numbers": return <Numbers />;
      case "performance": return <Performance />;
      case "billing": return <Billing />;
      case "settings": return <Settings />;
      case "developers": return <Developers />;
      default: return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <AppShell route={route} onNavigate={navigate}>
      <Banner onStart={() => navigate("store")} />
      {page()}
    </AppShell>
  );
}
