import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  Play, 
  MessageSquare, 
  Globe, 
  CheckCircle2, 
  Zap, 
  Smartphone, 
  Database, 
  Calendar 
} from "lucide-react";

const LANGUAGES = ["Hindi", "Telugu", "Tamil", "Kannada", "Malayalam", "Marathi", "English"];

export default function Landing({ onStartFree }: { onStartFree: () => void }) {
  const [selectedLang, setSelectedLang] = useState("Hindi");
  const [brief, setBrief] = useState("");

  return (
    <div className="bg-bg text-ink font-sans overflow-x-hidden">
      {/* --- NAVIGATION --- */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full relative z-50">
        <div className="flex items-center gap-8">
          <div className="w-32 h-auto bg-contain bg-no-repeat bg-left" 
               style={{ backgroundImage: 'url("/assets/outpero-wordmark-CGOgLVTx.png")', aspectRatio: '302/54' }} />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
            <a href="#product" className="hover:text-ink transition">Product</a>
            <a href="#voices" className="hover:text-ink transition">Voices</a>
            <a href="#pricing" className="hover:text-ink transition">Pricing</a>
            <a href="#contact" className="hover:text-ink transition">Contact</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onStartFree} className="text-sm font-semibold hover:text-purple-600 transition">Sign in</button>
          <button onClick={onStartFree} className="bg-ink text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-black transition-all">Start free</button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
              <Globe size={14} />
              <span>Speaks 7 Indian languages</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter leading-[1.1]">
              AI telecalling <br />
              <span className="text-purple-600">software.</span>
            </h1>
            <p className="text-xl text-muted leading-relaxed max-w-lg">
              India's most natural-sounding voice agents. They answer, qualify, and follow up so you don't have to.
            </p>

            <div className="flex flex-wrap gap-4">
              {['Instant leads', 'Bulk campaigns', 'Inbound'].map(feature => (
                <div key={feature} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-line text-sm font-medium text-muted">
                  <CheckCircle2 size={16} className="text-success" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Quick-Build Widget */}
          <div className="bg-white p-8 rounded-3xl border-2 border-line shadow-2xl space-y-6 relative">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">What should your AI telecaller do?</h3>
              <p className="text-sm text-muted">Describe the job in a few sentences.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase text-muted2">Language</span>
                <select 
                  value={selectedLang} 
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-line px-3 py-1 rounded-lg text-xs font-semibold outline-none"
                >
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <textarea 
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="e.g. Remind customers whose EMI is due this week..."
                className="w-full p-4 rounded-2xl border-2 border-line focus:border-purple-600 outline-none min-h-[100px] text-sm transition-all"
              />
              <button 
                onClick={onStartFree}
                className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
              >
                <Zap size={20} fill="currentColor" />
                Build my employee
              </button>
            </div>
            <p className="text-center text-[11px] text-muted2">
              Trusted by 5,000+ businesses • 50 free credits • No card required
            </p>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS / TRANSCRIPT SECTION --- */}
      <section id="product" className="py-24 bg-zinc-50 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">How it works</h2>
            <div className="flex justify-center gap-2">
              {LANGUAGES.map(l => (
                <button key={l} className="px-3 py-1 text-xs rounded-full bg-white border border-line hover:bg-purple-50 transition">{l}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-ink text-white p-8 rounded-[40px] shadow-2xl space-y-6 relative">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">M</div>
                  <div className="text-left">
                    <div className="text-sm font-bold">Meera (AI)</div>
                    <div className="text-[10px] text-zinc-400">Nest Realty • Noida</div>
                  </div>
                </div>
                <div className="text-xs text-zinc-500">1:08</div>
              </div>
              <div className="space-y-4">
                <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm leading-relaxed">
                  नमस्ते अमन जी! मैं Meera, Nest Realty से। आपने Sector 150 के 2BHK के लिए enquiry की थी। दो मिनट बात कर सकते हैं?
                </div>
                <div className="bg-purple-600 p-3 rounded-2xl rounded-tr-none max-w-[80%] ml-auto text-sm leading-relaxed">
                  हाँ जी, बोलिए।
                </div>
                <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm leading-relaxed">
                  रहने के लिए देख रहे हैं, या investment के लिए?
                </div>
                <div className="bg-purple-600 p-3 rounded-2xl rounded-tr-none max-w-[80%] ml-auto text-sm leading-relaxed">
                  रहने के लिए। Budget लगभग 90 लाख है।
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Agentic, not just talking.</h3>
              <p className="text-muted leading-relaxed">While she talks, she works: books, sends, looks things up and hands over, mid-call.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: MessageSquare, text: "WhatsApp Location sent", color: "text-green-600" },
                  { icon: Calendar, text: "Google Calendar Booked", color: "text-blue-600" },
                  { icon: Database, text: "CRM Lead updated", color: "text-orange-600" },
                  { icon: Smartphone, text: "Custom API Call", color: "text-purple-600" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-line text-sm font-medium">
                    <item.icon size={18} className={item.color} />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Pay for talk time. Nothing else.</h2>
            <p className="text-muted max-w-2xl mx-auto">One credit is one rupee. Pick a voice per employee, top up when you need to, and your credits never expire.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-s3 gap-8">
            {[
              { name: "Standard", price: "₹ 5", desc: "More expressive voices for everyday sales.", pop: false },
              { name: "Premium", price: "₹ 6.8", desc: "Our most lifelike voices, where voice is the brand.", pop: true },
              { name: "Custom", price: "₹ 3.5", desc: "For high call volumes, with setup help.", pop: false },
            ].map(plan => (
              <div key={plan.name} className={`p-8 rounded-3xl border-2 transition-all ${plan.pop ? "border-purple-600 bg-purple-50 shadow-xl scale-105" : "border-line bg-white"}`}>
                <div className="text-sm font-bold uppercase text-muted mb-4">{plan.name}</div>
                <div className="text-4xl font-black mb-2">{plan.price}<span className="text-lg font-normal text-muted">/min</span></div>
                <p className="text-sm text-muted mb-8 leading-relaxed">{plan.desc}</p>
                <button onClick={onStartFree} className={`w-full py-3 rounded-xl font-bold transition-all ${plan.pop ? "bg-purple-600 text-white" : "bg-line text-ink hover:bg-zinc-200"}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-zinc-900 text-zinc-400 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="w-24 h-auto bg-contain bg-no-repeat bg-left invert brightness-200" 
                 style={{ backgroundImage: 'url("/assets/outpero-wordmark-CGOgLVTx.png")', aspectRatio: '302/54' }} />
            <p className="text-xs leading-relaxed">AI employees that make your business calls: every lead, every list, in seven Indian languages.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">Instant Leads</a></li>
              <li><a href="#" className="hover:text-white transition">Bulk Campaigns</a></li>
              <li><a href="#" className="hover:text-white transition">Inbound Calls</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Terms</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <p className="text-sm">Questions? Email us at</p>
            <a href="mailto:support@outpero.com" className="text-sm text-white font-medium hover:underline">support@outpero.com</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-zinc-800 text-center text-xs">
          © 2026 Outpero. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
