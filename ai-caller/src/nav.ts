import {
  LayoutGrid, Users, Plus, PhoneCall, Zap, Megaphone, PhoneIncoming,
  Database, MessageCircle, BookOpen, Hash, BarChart3, CreditCard,
  Settings, Code2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = { id: string; label: string; icon: LucideIcon; badge?: string };
export type NavGroup = { group: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
      { id: "employees", label: "My Employees", icon: Users },
      { id: "store", label: "New employee", icon: Plus },
      { id: "talk", label: "Talk to an employee", icon: PhoneCall },
    ],
  },
  {
    group: "Calling",
    items: [
      { id: "instant", label: "Instant Leads", icon: Zap },
      { id: "bulk", label: "Bulk Campaigns", icon: Megaphone },
      { id: "inbound", label: "Inbound Calls", icon: PhoneIncoming, badge: "NEW" },
    ],
  },
  {
    group: "Results & Setup",
    items: [
      { id: "leads", label: "Leads & Results", icon: Database },
      { id: "conversations", label: "All Conversations", icon: MessageCircle },
      { id: "teach", label: "Train Employees", icon: BookOpen },
      { id: "numbers", label: "Phone Numbers", icon: Hash },
      { id: "performance", label: "Performance", icon: BarChart3 },
      { id: "billing", label: "Billing", icon: CreditCard },
    ],
  },
];

export const FOOTER_NAV: NavItem[] = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "developers", label: "Developers", icon: Code2, badge: "NEW" },
];

export const LANGUAGES = ["తెలుగు", "हिन्दी", "தமிழ்", "ಕನ್ನಡ", "മലയാളം", "मराठी", "English"];

export const INDUSTRIES = [
  "Real estate", "Coaching & tuition", "Hospital & clinic", "Car & bike dealership",
  "Interiors & construction", "Local services", "Jewellery & fashion", "Hotels & restaurants",
  "Insurance & finance", "Travel & tours", "Solar & home improvement", "Recruitment & staffing",
  "Wholesale & distribution",
];

export const QUICK_ACTIONS = [
  { id: "store", title: "New employee", sub: "Add an AI teammate", tone: "lav", icon: "userPlus" },
  { id: "bulk", title: "New campaign", sub: "Bulk-call a list", tone: "lav", icon: "megaphone" },
  { id: "billing", title: "Add credits", sub: "≈ 10 min left", tone: "amber", icon: "wallet" },
  { id: "numbers", title: "Phone numbers", sub: "Buy & route lines", tone: "blue", icon: "hash" },
  { id: "leads", title: "View leads", sub: "Results & follow-ups", tone: "green", icon: "database" },
  { id: "conversations", title: "Call log", sub: "Every conversation", tone: "violet", icon: "phone" },
] as const;

export const ROUTES = [
  "dashboard", "employees", "store", "talk", "instant", "bulk", "inbound",
  "leads", "conversations", "teach", "numbers", "performance", "billing",
  "settings", "developers",
];
