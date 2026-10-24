import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Hire from "./pages/Hire";
import { Employees, Talk, Teach, Inbound } from "./pages/Simple";
import { Instant, Bulk } from "./pages/Calling";
import { Leads, Conversations } from "./pages/Results";
import { Numbers, Performance, Billing, Settings, Developers } from "./pages/Setup";
import { AppShell, Banner } from "./components/Shell";
import { ROUTES } from "./nav";
import { api } from "./api";

function readRoute(): string {
  const h = window.location.hash.replace(/^#\/?/, "");
  return ROUTES.includes(h) ? h : "dashboard";
}

export default function App() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("outpero.token"));
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    if (authed && !user) {
      const token = localStorage.getItem("outpero.token");
      // Dev mode: skip real auth check when no backend is running
      if (token === "dev") {
        setUser({ id: "dev", email: "demo@outpero.com", name: "Demo User", credits: 5000 });
        return;
      }
      api.auth.me().then(setUser).catch(() => {
        localStorage.removeItem("outpero.token");
        setAuthed(false);
      });
    }
  }, [authed]);

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

  // Show landing page if not authed and not trying to auth
  if (!authed && !showAuth) {
    return <Landing onStartFree={() => setShowAuth(true)} />;
  }

  if (!authed) {
    return (
      <Auth
        onAuth={(token: string, userData: Record<string, unknown>) => {
          localStorage.setItem("outpero.token", token);
          setUser(userData);
          setAuthed(true);
          setShowAuth(false);
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
