import { useState } from "react";
import { 
  CreditCard, 
  Phone, 
  BarChart3, 
  Settings as SettingsIcon, 
  Code2, 
  Plus, 
  ChevronRight, 
  AlertCircle 
} from "lucide-react";

// --- BILLING PAGE ---
export function Billing() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8">
      <div className="flex justify-between items-end">
        <div className="text-left">
          <h2 className="text-3xl font-bold text-ink">Billing</h2>
          <p className="text-muted">Manage your credits and payment methods.</p>
        </div>
        <div className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-200">
          <CreditCard size={18} />
          <span className="text-sm">≈ 10 min left</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-line">
            <h3 className="font-bold text-ink mb-4">Top up credits</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Starter", mins: "60 min", price: "₹499" },
                { label: "Growth", mins: "300 min", price: "₹1,999" },
                { label: "Scale", mins: "1000 min", price: "₹5,999" },
              ].map(plan => (
                <button key={plan.label} className="p-4 rounded-2xl border-2 border-line hover:border-purple-600 transition-all text-left group">
                  <div className="text-xs font-bold text-muted uppercase mb-1">{plan.label}</div>
                  <div className="text-xl font-bold text-ink group-hover:text-purple-600">{plan.price}</div>
                  <div className="text-sm text-muted">{plan.mins}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-line">
            <h3 className="font-bold text-ink mb-4">Payment History</h3>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-line/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold">{i}</div>
                    <span className="text-sm font-medium text-ink">Payment #{1024 + i}</span>
                  </div>
                  <span className="text-sm font-bold text-ink">₹{499 * i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-purple-50 p-6 rounded-3xl border-2 border-purple-200 space-y-4">
            <h3 className="font-bold text-purple-800">Credit Usage</h3>
            <div className="text-4xl font-black text-purple-600">7.4<span className="text-sm font-normal text-purple-400 ml-1">min</span></div>
            <p className="text-xs text-purple-700 leading-relaxed">Your average call lasts 2.1 minutes. You have enough credits for approx. 3 more calls.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- NUMBERS PAGE ---
export function Numbers() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <h2 className="text-3xl font-bold text-ink">Phone Numbers</h2>
          <p className="text-muted">Buy new lines and route them to your employees.</p>
        </div>
        <button className="bg-ink text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all">
          <Plus size={18} />
          Buy Number
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-white p-6 rounded-3xl border-2 border-line flex justify-between items-center group hover:border-purple-600 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-line rounded-2xl flex items-center justify-center text-ink">
                <Phone size={24} />
              </div>
              <div className="text-left">
                <div className="font-bold text-ink text-lg">+91 98765 {43210 + i}</div>
                <div className="text-xs text-muted">Active • Routed to <span className="text-purple-600 font-semibold">Employee {i}</span></div>
              </div>
            </div>
            <button className="p-2 text-muted hover:text-ink transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- PERFORMANCE PAGE ---
export function Performance() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8">
      <h2 className="text-3xl font-bold text-ink">Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Calls", val: "1,284", color: "text-blue-600" },
          { label: "Conv. Rate", val: "12.4%", color: "text-green-600" },
          { label: "Avg. Duration", val: "3m 12s", color: "text-purple-600" },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border-2 border-line text-center">
            <div className="text-xs font-bold text-muted uppercase mb-2">{stat.label}</div>
            <div className={`text-3xl font-black ${stat.color}`}>{stat.val}</div>
          </div>
        ))}
      </div>
      <div className="bg-white p-8 rounded-3xl border-2 border-line h-64 flex items-center justify-center text-muted italic">
        [Performance Graph Visualization Placeholder]
      </div>
    </div>
  );
}

// --- SETTINGS PAGE ---
export function Settings() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-6 space-y-8">
      <h2 className="text-3xl font-bold text-ink">Settings</h2>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border-2 border-line space-y-4">
          <h3 className="font-bold text-ink flex items-center gap-2">
            <SettingsIcon size={18} />
            Account Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-line">
              <span className="text-sm text-muted">Notification Email</span>
              <span className="text-sm font-medium text-ink">saiteja14419@gmail.com</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-line">
              <span className="text-sm text-muted">Timezone</span>
              <span className="text-sm font-medium text-ink">Asia/Kolkata (IST)</span>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 p-6 rounded-3xl border-2 border-red-100 space-y-4">
          <h3 className="font-bold text-red-800 flex items-center gap-2">
            <AlertCircle size={18} />
            Danger Zone
          </h3>
          <button className="w-full py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// --- DEVELOPERS PAGE ---
export function Developers() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <h2 className="text-3xl font-bold text-ink">Developers</h2>
          <p className="text-muted">Integrate Outpero AI employees into your own apps.</p>
        </div>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-purple-700 transition-all">
          <Code2 size={18} />
          Generate API Key
        </button>
      </div>

      <div className="bg-zinc-900 text-zinc-300 p-6 rounded-3xl font-mono text-sm space-y-4 overflow-x-auto">
        <div className="flex items-center gap-2 text-zinc-500 border-b border-zinc-800 pb-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-xs">curl -X POST https://api.outpero.com/v1/call</span>
        </div>
        <pre className="leading-relaxed">
{`{
  "employee_id": "emp_8v2n_4kS",
  "phone_number": "+919876543210",
  "context": {
    "customer_name": "Rahul",
    "last_interaction": "Instagram Ad"
  }
}`}
        </pre>
      </div>
    </div>
  );
}
