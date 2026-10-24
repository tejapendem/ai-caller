import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Mic, 
  Zap, 
  Layers, 
  Volume2, 
  Building2, 
  GraduationCap, 
  Stethoscope, 
  Car, 
  Home, 
  Wrench, 
  Gem, 
  Utensils, 
  ShieldCheck, 
  Plane, 
  Sun, 
  Briefcase, 
  Package 
} from "lucide-react";

type CallType = "instant" | "bulk" | "inbound";
type Language = "Telugu" | "Hindi" | "Tamil" | "Kannada" | "Malayalam" | "Marathi" | "English";

const LANGUAGES: Language[] = ["Telugu", "Hindi", "Tamil", "Kannada", "Malayalam", "Marathi", "English"];
const INDUSTRIES = [
  { name: "Real estate", icon: Building2, help: "Site visits, plot and flat enquiries, follow-ups" },
  { name: "Coaching & tuition", icon: GraduationCap, help: "Admission enquiries, demo classes, fee follow-ups" },
  { name: "Hospital & clinic", icon: Stethoscope, help: "Appointments, reminders, follow-up after treatment" },
  { name: "Car & bike dealership", icon: Car, help: "Test drives, EMI enquiries, service reminders" },
  { name: "Interiors & construction", icon: Home, help: "Site measurements, quotations, project follow-ups" },
  { name: "Local services", icon: Wrench, help: "Salons, gyms, repairs — bookings and renewals" },
  { name: "Jewellery & fashion", icon: Gem, help: "New collections, orders ready, festival buying" },
  { name: "Hotels & restaurants", icon: Utensils, help: "Reservations, function enquiries, feedback" },
  { name: "Insurance & finance", icon: ShieldCheck, help: "Renewals, new enquiries, pending documents" },
  { name: "Travel & tours", icon: Plane, help: "Package enquiries, departures, feedback" },
  { name: "Solar & home improvement", icon: Sun, help: "Site surveys, quotations, subsidy questions" },
  { name: "Recruitment & staffing", icon: Briefcase, help: "Screening candidates, scheduling interviews" },
  { name: "Wholesale & distribution", icon: Package, help: "Dealer reorders, payments, new schemes" },
];

const BUILD_STAGES = [
  { id: "brief", text: "Reading your brief …" },
  { id: "details", text: "A few quick details" },
  { id: "plan", text: "Planning the call, step by step" },
  { id: "voice", text: "Choosing a voice" },
];

export default function Hire() {
  const [isBuilding, setIsBuilding] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [type, setType] = useState<CallType>("instant");
  const [lang, setLang] = useState<Language>("English");
  const [brief, setBrief] = useState("");

  const handleBuild = () => {
    if (!brief) return alert("Please describe the job first!");
    setIsBuilding(true);
    setCurrentStage(0);
  };

  useEffect(() => {
    if (isBuilding && currentStage < BUILD_STAGES.length) {
      const timer = setTimeout(() => {
        setCurrentStage(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isBuilding, currentStage]);

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 font-sans">
      {!isBuilding ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-ink">Build your AI employee <span className="text-purple-600">FREE</span></h2>
            <p className="text-muted text-lg">Describe the job in a few sentences. You only pay for the calls they make.</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {(['instant', 'bulk', 'inbound'] as CallType[]).map(t => (
              <button 
                key={t} 
                onClick={() => setType(t)}
                className={`p-4 rounded-xl border-2 transition-all text-sm font-semibold capitalize ${
                  type === t ? "border-purple-600 bg-purple-50 text-purple-700 shadow-sm" : "border-line text-muted hover:border-muted"
                }`}
              >
                {t === 'instant' ? 'Instant Lead Calling' : t === 'bulk' ? 'Bulk Calling' : 'Inbound Calling'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted2">Primary Language</span>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(l => (
                <button 
                  key={l} 
                  onClick={() => setLang(l)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    lang === l ? "bg-ink text-white" : "bg-line text-muted hover:bg-muted"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <textarea 
                className="w-full p-4 rounded-2xl border-2 border-line focus:border-purple-600 focus:ring-0 min-h-[120px] text-ink bg-white transition-all"
                placeholder="e.g. Call every new enquiry from my Instagram ad, ask what they need, and book a visit."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
              />
              <button className="absolute bottom-3 right-3 p-2 bg-line rounded-full text-muted hover:text-ink transition-colors">
                <Mic size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {INDUSTRIES.map(ind => (
              <button 
                key={ind.name} 
                onClick={() => setBrief(prev => prev + ` Focus on ${ind.name}: ${ind.help}`)}
                className="flex items-center gap-3 p-3 rounded-xl border border-line text-left hover:bg-muted transition-colors group"
              >
                <ind.icon size={20} className="text-muted group-hover:text-purple-600 transition-colors" />
                <span className="text-xs font-medium text-muted group-hover:text-ink">{ind.name}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={handleBuild}
            className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
          >
            <Zap size={20} fill="currentColor" />
            Build my employee
          </button>
        </div>
      ) : (
        <div className="max-w-md mx-auto py-20 text-center space-y-10">
          <div className="space-y-4">
            <div className="relative inline-block">
              <div className="absolute inset-0 animate-ping bg-purple-400 rounded-full opacity-20"></div>
              <div className="relative bg-purple-600 p-6 rounded-full text-white">
                <Layers size={48} className="animate-bounce" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-ink">BUILDING YOUR AI EMPLOYEE</h2>
            <p className="text-muted">Our AI is crafting your employee's personality and script...</p>
          </div>

          <div className="space-y-4">
            {BUILD_STAGES.map((stage, idx) => (
              <div 
                key={stage.id} 
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  idx === currentStage ? "bg-purple-50 border-2 border-purple-200 text-purple-700 scale-105" : 
                  idx < currentStage ? "bg-line text-success opacity-60" : "bg-white text-muted opacity-40"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === currentStage ? "bg-purple-600 text-white animate-pulse" : 
                  idx < currentStage ? "bg-success text-white" : "bg-line text-muted"
                }`}>
                  {idx < currentStage ? "✓" : idx + 1}
                </div>
                <span className={`font-medium ${idx === currentStage ? "font-bold" : ""}`}>
                  {stage.text}
                </span>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {currentStage >= BUILD_STAGES.length && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-success/10 border-2 border-success/20 rounded-3xl text-center space-y-4"
              >
                <Volume2 size={40} className="mx-auto text-success" />
                <h3 className="text-xl font-bold text-ink">Employee Ready!</h3>
                <p className="text-muted text-sm">Your AI teammate is trained and ready to make calls.</p>
                <button 
                  onClick={() => setIsBuilding(false)} 
                  className="px-6 py-2 bg-success text-white rounded-full font-semibold hover:bg-success/90 transition-all"
                >
                  View Employee
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
