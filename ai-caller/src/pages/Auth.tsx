import { useState } from "react";
import { Mail, Lock, Chrome } from "lucide-react";
import { api } from "../api";

interface AuthProps {
  onAuth: (token: string, user: Record<string, unknown>) => void;
}

export default function Auth({ onAuth }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    try {
      const res = isLogin
        ? await api.auth.login(email, password)
        : await api.auth.register(email, password);
      onAuth(res.token, res.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[420px] space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div 
            role="img" 
            aria-label="Outpero" 
            className="w-32 h-auto bg-contain bg-no-repeat bg-left" 
            style={{ backgroundImage: 'url("/assets/outpero-wordmark-CGOgLVTx.png")', aspectRatio: '302/54' }}
          />
          <span className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-muted2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            AI PHONE EMPLOYEES
          </span>
          <h2 className="text-2xl font-semibold tracking-tight">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </h2>
          <p className="text-muted text-sm">Manage your AI employees and calls.</p>
        </div>

        <div className="card p-7 sm:p-8 pt-6 bg-white rounded-3xl border-2 border-line shadow-sm space-y-6">
          <button
            onClick={() => { setLoading(true); api.auth.me().catch(() => {}).finally(() => setLoading(false)); }}
            className="w-full py-3 px-4 rounded-xl border-2 border-line flex items-center justify-center gap-3 font-semibold hover:bg-line/10 transition-all"
          >
            <Chrome size={18} />
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-line"></div>
            <span className="text-[11.5px] font-semibold text-muted2 uppercase tracking-wide">or use email</span>
            <div className="flex-1 h-px bg-line"></div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@business.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-line focus:border-purple-600 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-muted">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs font-semibold text-purple-600 hover:text-purple-700">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-line focus:border-purple-600 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 disabled:opacity-60"
            >
              {loading ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold text-muted hover:text-ink transition-colors"
            >
              {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-[11.5px] text-muted2">
          <a href="/terms" className="hover:text-muted transition">Terms</a>
          <a href="/privacy" className="hover:text-muted transition">Privacy</a>
          <a href="/refund" className="hover:text-muted transition">Refund</a>
          <a href="/legal" className="hover:text-muted transition">Legal Centre</a>
          <a href="/contact" className="hover:text-muted transition">Contact</a>
        </div>
      </div>
    </div>
  );
}
