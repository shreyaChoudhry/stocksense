"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Boxes,
  Check,
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type StockItem = {
  name: string;
  category: string;
  sku: string;
  stock: number;
  threshold: number;
  vendor: string;
  eta: string;
  status: "Critical" | "Warning" | "Healthy";
  reorder: number;
};

const stockItems: StockItem[] = [
  { name: "Amul Taaza Homogenised Toned Milk (1L)", category: "Dairy & Fresh Essentials", sku: "AML-TZ-1000", stock: 42, threshold: 150, vendor: "Gujarat Co-operative Ltd", eta: "1.2 days", status: "Critical", reorder: 100 },
  { name: "Fortune Sunlite Refined Sunflower Oil (1L)", category: "Edible Oils & Ghee", sku: "FTN-OL-094", stock: 18, threshold: 80, vendor: "Adani Wilmar Distro", eta: "2.4 days", status: "Critical", reorder: 80 },
  { name: "Tata Salt Vacuum Evaporated Iodized (1kg)", category: "Staples & Spices", sku: "TAT-SL-1001", stock: 85, threshold: 200, vendor: "Tata Consumer Products", eta: "4.1 days", status: "Warning", reorder: 120 },
  { name: "Maggi 2-Minute Masala Noodles (Pack of 4)", category: "Packaged & Instant Foods", sku: "MAG-NDL-004", stock: 65, threshold: 160, vendor: "Nestlé India Logistics", eta: "4.8 days", status: "Warning", reorder: 100 },
  { name: "Aashirvaad Superior MP Sharbati Atta (5kg)", category: "Flours & Grains", sku: "ASH-ATA-500", stock: 210, threshold: 120, vendor: "ITC Limited Supply", eta: "15+ days", status: "Healthy", reorder: 0 },
];

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Sales Analytics", icon: TrendingUp },
  { label: "Inventory Management", icon: Package },
  { label: "Demand Forecasting", icon: Activity },
  { label: "AI Insights", icon: Sparkles, tag: "AI" },
  { label: "Stock Alerts", icon: AlertTriangle, count: "8" },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings },
];

function MetricCard({
  label,
  value,
  change,
  note,
  icon: Icon,
  tone = "teal",
}: {
  label: string;
  value: string;
  change?: string;
  note: string;
  icon: typeof TrendingUp;
  tone?: "teal" | "green" | "amber" | "red";
}) {
  const tones = {
    teal: "bg-teal-400/10 text-teal-300",
    green: "bg-emerald-400/10 text-emerald-300",
    amber: "bg-amber-400/10 text-amber-300",
    red: "bg-rose-400/10 text-rose-300",
  };
  return (
    <article className="rounded-2xl border border-white/6 bg-[#111a2b] p-5 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-teal-300/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
        </div>
        <span className={`rounded-xl p-2.5 ${tones[tone]}`}><Icon size={19} /></span>
      </div>
      <div className="mt-5 flex items-center justify-between gap-2 text-xs">
        {change ? <span className="flex items-center gap-1 font-semibold text-emerald-300"><ArrowUpRight size={14} />{change}</span> : <span className="text-teal-300">● {note}</span>}
        {change && <span className="text-slate-500">{note}</span>}
      </div>
    </article>
  );
}

function SalesChart() {
  return (
    <div className="mt-5">
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
        <span className="flex items-center gap-2"><i className="h-0.5 w-5 rounded bg-teal-300" />Actual revenue</span>
        <span className="flex items-center gap-2"><i className="h-0.5 w-5 border-t-2 border-dashed border-emerald-300" />AI forecast</span>
      </div>
      <div className="h-56 w-full">
        <svg viewBox="0 0 720 220" className="h-full w-full" role="img" aria-label="Illustrative sales revenue trend chart">
          {[25, 70, 115, 160, 200].map((y) => <line key={y} x1="35" x2="710" y1={y} y2={y} stroke="#293449" strokeDasharray="4 5" />)}
          <defs><linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4df6df" stopOpacity=".25" /><stop offset="100%" stopColor="#4df6df" stopOpacity="0" /></linearGradient></defs>
          <path d="M35 170 C80 165 100 130 150 142 S220 125 260 98 S330 115 375 82 S450 92 495 58 L495 200 L35 200Z" fill="url(#salesFill)" />
          <path d="M35 170 C80 165 100 130 150 142 S220 125 260 98 S330 115 375 82 S450 92 495 58" fill="none" stroke="#4df6df" strokeWidth="3" strokeLinecap="round" />
          <path d="M495 58 C545 55 575 43 620 38 S675 24 710 18" fill="none" stroke="#5ade95" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" />
          <line x1="495" x2="495" y1="20" y2="200" stroke="#4df6df" strokeDasharray="3 5" opacity=".5" />
          {["Oct 01", "Oct 06", "Oct 12", "Oct 18", "Today", "Oct 27", "Oct 30"].map((label, i) => <text key={label} x={[35, 145, 255, 365, 495, 605, 710][i]} y="217" fill={i === 4 ? "#4df6df" : "#8492a6"} fontSize="10" textAnchor="middle">{label}</text>)}
          <circle cx="495" cy="58" r="5" fill="#4df6df" stroke="#111a2b" strokeWidth="3" />
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-500"><span>Revenue trend · illustrative sample data</span><span className="text-emerald-300">Forecast accuracy: sample 98.7%</span></div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("Overview");
  const [period, setPeriod] = useState("Monthly");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [busyAction, setBusyAction] = useState("");

  const filteredItems = useMemo(() => stockItems.filter((item) => {
    const matchesFilter = filter === "All" || item.status === filter;
    const text = `${item.name} ${item.sku} ${item.vendor}`.toLowerCase();
    return matchesFilter && text.includes(query.toLowerCase());
  }), [filter, query]);

  async function logout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  function exportCsv() {
    const rows = [["Product", "SKU", "Current stock", "Threshold", "Vendor", "Status"], ...filteredItems.map((item) => [item.name, item.sku, String(item.stock), String(item.threshold), item.vendor, item.status])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "stocksense-stock-alerts.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function runAction(label: string) {
    setBusyAction(label);
    setNotice(`${label} is a UI demo action. Connect the backend to execute it for real.`);
    window.setTimeout(() => setBusyAction(""), 700);
  }

  const SidebarContent = (
    <>
      <div className="flex h-20 items-center justify-between border-b border-white/6 px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-300 text-[#062522] shadow-lg shadow-teal-300/20"><Boxes size={21} /></div>
          <div><p className="text-lg font-bold tracking-tight text-white">StockSense</p><p className="text-[10px] font-bold tracking-[0.22em] text-teal-300">INTELLIGENCE</p></div>
        </div>
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
      </div>
      <div className="px-4 pb-3 pt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Operational units</div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navigation.map(({ label, icon: Icon, tag, count }) => (
          <button key={label} onClick={() => { setActiveNav(label); setMobileOpen(false); if (label !== "Overview") setNotice(`${label} section is coming next. The overview dashboard is currently active.`); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition ${activeNav === label ? "bg-teal-300 font-semibold text-[#062522] shadow-lg shadow-teal-300/10" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
            <span className="flex items-center gap-3"><Icon size={18} />{label}</span>
            {tag && <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${activeNav === label ? "bg-black/10" : "bg-teal-300/10 text-teal-300"}`}>{tag}</span>}
            {count && <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[10px] font-bold text-rose-300">{count}</span>}
          </button>
        ))}
      </nav>
      <div className="m-3 rounded-xl border border-white/6 bg-[#111a2b] p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-teal-300/15 text-sm font-bold text-teal-200">SS</div>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">StockSense User</p><p className="truncate text-xs text-slate-500">Retail workspace</p></div>
          <button onClick={logout} title="Log out" className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"><LogOut size={17} /></button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0e1323] text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/6 bg-[#080d1d] lg:flex">{SidebarContent}</aside>
      {mobileOpen && <div className="fixed inset-0 z-50 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)}><aside className="flex h-full w-72 flex-col bg-[#080d1d]" onClick={(e) => e.stopPropagation()}>{SidebarContent}</aside></div>}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/6 bg-[#080d1d]/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-slate-300 hover:bg-white/5 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><span>Workspace</span><span>/</span><span className="font-semibold text-slate-200">{activeNav}</span></div>
            <span className="hidden h-4 w-px bg-white/10 sm:block" />
            <span className="flex items-center gap-2 text-[11px] text-slate-400"><i className="h-2 w-2 rounded-full bg-emerald-400" />Demo data</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <label className="relative hidden md:block"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products or SKUs..." className="h-9 w-56 rounded-lg border border-white/7 bg-white/4 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-500 focus:border-teal-300/50" /></label>
            <button onClick={exportCsv} className="hidden h-9 items-center gap-2 rounded-lg border border-white/8 bg-white/4 px-3 text-xs font-medium text-slate-300 hover:bg-white/8 sm:flex"><Download size={15} />Export</button>
            <button onClick={() => setNotice("You have 8 sample stock alerts to review.")} className="relative grid h-9 w-9 place-items-center rounded-lg bg-white/4 text-slate-300 hover:bg-white/8" aria-label="Notifications"><Bell size={17} /><i className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-400" /></button>
            <button onClick={logout} className="hidden h-9 items-center gap-2 rounded-lg bg-teal-300/10 px-3 text-xs font-semibold text-teal-200 hover:bg-teal-300/20 sm:flex"><LogOut size={15} />Logout</button>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          {notice && <div className="flex items-start justify-between gap-3 rounded-xl border border-teal-300/20 bg-teal-300/10 px-4 py-3 text-sm text-teal-100"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss"><X size={16} /></button></div>}
          <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div><div className="mb-2 flex flex-wrap items-center gap-2"><span className="rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-200"><Zap size={12} className="mr-1 inline" />Intelligence engine active</span><span className="text-xs text-slate-500">Synced just now · INR</span></div><h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Good morning, welcome back.</h1><p className="mt-2 text-sm text-slate-400">Here&apos;s what&apos;s happening across your retail operations today.</p></div>
            <div className="flex flex-wrap gap-2"><button onClick={() => runAction("Scenario simulation")} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/8"><Activity size={15} />Simulate scenario</button><button onClick={() => runAction("Purchase order batch generation")} className="flex items-center gap-2 rounded-lg bg-teal-300 px-4 py-2.5 text-xs font-bold text-[#062522] shadow-lg shadow-teal-300/15 hover:bg-teal-200"><Zap size={15} />Generate PO batch <ArrowRight size={14} /></button></div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total revenue" value="₹24.85L" change="+18.6%" note="vs previous period" icon={TrendingUp} />
            <MetricCard label="Total orders" value="12,845" change="+12.4%" note="vs previous period" icon={Package} tone="green" />
            <MetricCard label="Inventory health" value="94.2%" note="Optimal stock levels" icon={ShieldCheck} tone="teal" />
            <MetricCard label="Stockout risk" value="08 SKUs" note="Needs attention" icon={AlertTriangle} tone="red" />
          </section>

          <section className="grid gap-4 xl:grid-cols-12">
            <article className="rounded-2xl border border-white/6 bg-[#111a2b] p-5 shadow-lg xl:col-span-8 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold text-white">Sales performance & forecast</h2><p className="mt-1 text-xs text-slate-500">Revenue trend with illustrative AI trajectory</p></div><div className="flex rounded-lg bg-black/20 p-1">{["Daily", "Weekly", "Monthly"].map((p) => <button key={p} onClick={() => setPeriod(p)} className={`rounded-md px-3 py-1.5 text-xs ${period === p ? "bg-white/10 font-semibold text-teal-200" : "text-slate-500 hover:text-white"}`}>{p}</button>)}</div></div>
              <SalesChart />
            </article>
            <article className="rounded-2xl border border-white/6 bg-[#111a2b] p-5 shadow-lg xl:col-span-4 sm:p-6">
              <div><h2 className="font-semibold text-white">Inventory distribution</h2><p className="mt-1 text-xs text-slate-500">Stock allocation across 1,420 sample SKUs</p></div>
              <div className="relative mx-auto my-6 grid h-44 w-44 place-items-center">
                <div className="h-full w-full rounded-full" style={{ background: "conic-gradient(#4df6df 0 72%, #f4b841 72% 88%, #fb7185 88% 95%, #394356 95% 100%)" }} />
                <div className="absolute grid h-28 w-28 place-items-center rounded-full bg-[#111a2b] text-center"><div><p className="text-2xl font-semibold text-white">1,420</p><p className="text-[10px] uppercase tracking-wider text-slate-500">Total SKUs</p></div></div>
              </div>
              <div className="space-y-3 text-xs">
                {[["In stock","1,022","72%","bg-teal-300"],["Low stock","227","16%","bg-amber-300"],["Out of stock","99","7%","bg-rose-400"],["Overstocked","72","5%","bg-slate-500"]].map(([label, count, pct, color]) => <div key={label} className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-400"><i className={`h-2 w-2 rounded-full ${color}`} />{label}</span><span className="font-semibold text-slate-200">{count} <span className="ml-2 font-normal text-slate-500">{pct}</span></span></div>)}
              </div>
            </article>
          </section>

          <section className="relative overflow-hidden rounded-2xl border border-teal-300/15 bg-linear-to-r from-[#122b35] via-[#142536] to-[#111a2b] p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-teal-300/10 blur-3xl" />
            <div className="relative"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-300 text-[#062522]"><Sparkles size={18} /></span><div><h2 className="font-semibold text-white">AI demand horizon · next 7 days</h2><p className="text-xs text-slate-400">Illustrative forecast insight</p></div></div><span className="rounded-full bg-emerald-300/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-200">Sample confidence: 99.4%</span></div>
              <p className="mt-5 max-w-4xl text-lg leading-relaxed text-slate-200">Demand for high-velocity <strong className="text-teal-200">FMCG & dairy staples</strong> is forecast to rise by <strong className="text-emerald-300">16.4%</strong> over the upcoming weekend window.</p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">{[["Dairy & fresh foods","+22% demand velocity",Truck],["Edible oils & grains","+14% steady run rate",Boxes],["Snacks & confectionery","+19% basket presence",Package]].map(([name, stat, Icon]) => { const ItemIcon = Icon as typeof Truck; return <div key={name as string} className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 p-3"><ItemIcon size={19} className="text-teal-200" /><div><p className="text-xs font-semibold text-white">{name as string}</p><p className="mt-1 text-xs text-emerald-300">{stat as string}</p></div></div>; })}</div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="flex items-center gap-2 text-xs text-slate-400"><Check size={15} className="text-teal-200" />4 sample purchase orders drafted for review.</p><button onClick={() => runAction("Forecast inspection")} className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10">Inspect forecast <ArrowRight size={14} className="ml-1 inline" /></button></div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/6 bg-[#111a2b] p-5 shadow-lg sm:p-6" id="stock-alerts">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold text-white">Stockout vulnerability & reorder queue</h2><span className="rounded-full bg-rose-400/10 px-2.5 py-1 text-[10px] font-bold text-rose-300">8 sample alerts</span></div><p className="mt-1 text-xs text-slate-500">Review products that may need replenishment.</p></div>
              <div className="flex flex-wrap items-center gap-2"><label className="relative md:hidden"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search SKU..." className="h-9 w-40 rounded-lg border border-white/10 bg-black/20 pl-8 pr-2 text-xs outline-none focus:border-teal-300/40" /></label><div className="flex rounded-lg bg-black/20 p-1">{["All", "Critical", "Warning", "Healthy"].map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded-md px-2.5 py-1.5 text-[11px] ${filter === f ? "bg-white/10 font-semibold text-teal-200" : "text-slate-500 hover:text-white"}`}>{f}</button>)}</div><button onClick={exportCsv} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 hover:bg-white/5" title="Export CSV"><Download size={15} /></button></div>
            </div>
            <div className="mt-5 overflow-x-auto"><table className="w-full min-w-212.5 text-left text-xs"><thead><tr className="border-b border-white/7 text-[10px] uppercase tracking-wider text-slate-500"><th className="pb-3 pr-4 font-semibold">Product</th><th className="pb-3 pr-4 font-semibold">SKU</th><th className="pb-3 pr-4 font-semibold">Current stock</th><th className="pb-3 pr-4 font-semibold">Threshold</th><th className="pb-3 pr-4 font-semibold">Vendor</th><th className="pb-3 pr-4 font-semibold">Stockout ETA</th><th className="pb-3 text-right font-semibold">Action</th></tr></thead><tbody>{filteredItems.map((item) => <tr key={item.sku} className="border-b border-white/5 last:border-0 hover:bg-white/2"><td className="py-4 pr-4"><p className="font-semibold text-slate-200">{item.name}</p><p className="mt-1 text-[11px] text-slate-500">{item.category}</p></td><td className="py-4 pr-4 font-mono text-slate-400">{item.sku}</td><td className="py-4 pr-4"><span className={item.status === "Critical" ? "font-semibold text-rose-300" : item.status === "Warning" ? "font-semibold text-amber-300" : "font-semibold text-emerald-300"}>{item.stock} units</span><div className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${item.status === "Critical" ? "bg-rose-400" : item.status === "Warning" ? "bg-amber-300" : "bg-emerald-300"}`} style={{ width: `${Math.min(100, item.stock / item.threshold * 100)}%` }} /></div></td><td className="py-4 pr-4 text-slate-400">{item.threshold} units</td><td className="py-4 pr-4 text-slate-400">{item.vendor}</td><td className="py-4 pr-4"><span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${item.status === "Critical" ? "bg-rose-400/10 text-rose-300" : item.status === "Warning" ? "bg-amber-300/10 text-amber-200" : "bg-emerald-300/10 text-emerald-200"}`}>{item.status === "Healthy" ? "Healthy" : `In ${item.eta}`}</span></td><td className="py-4 text-right">{item.status === "Healthy" ? <span className="text-slate-500">No action</span> : <button disabled={busyAction === item.sku} onClick={() => runAction(`Reorder for ${item.sku}`)} className="rounded-lg bg-teal-300 px-3 py-2 text-[11px] font-bold text-[#062522] hover:bg-teal-200 disabled:opacity-60">{busyAction === item.sku ? "Processing..." : `Draft PO (${item.reorder}u)`}</button>}</td></tr>)}</tbody></table>{filteredItems.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No matching products found.</p>}</div>
            <p className="mt-4 text-[11px] text-slate-500">Showing {filteredItems.length} illustrative records. Connect your inventory API to display live stock data.</p>
          </section>

          <section><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-semibold text-white">Autonomous intelligence feed</h2><p className="mt-1 text-xs text-slate-500">Example recommendations generated for the demo dashboard.</p></div><span className="text-xs text-teal-200">AI recommendations · Demo</span></div>
            <div className="grid gap-4 lg:grid-cols-3">
              {[{title:"Cross-merchandising opportunity",value:"+₹42,000 potential GMV",body:"Customers buying atta may also purchase salt. Test a bundled offer to increase basket size.",icon:TrendingUp,tone:"teal",action:"Review bundle idea"},{title:"Dead stock rebalance",value:"₹1,45,000 tied up",body:"One store may have excess stock while another needs replenishment. Review a transfer before ordering more.",icon:Boxes,tone:"amber",action:"Review transfer"},{title:"Supplier lead-time anomaly",value:"+1.8 days variance",body:"Recent sample deliveries suggest a longer lead time. Consider reviewing safety stock levels.",icon:Truck,tone:"red",action:"Review supplier"}].map((card) => <article key={card.title} className="rounded-2xl border border-white/6 bg-[#111a2b] p-5"><div className="flex items-center justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${card.tone === "teal" ? "bg-teal-300/10 text-teal-200" : card.tone === "amber" ? "bg-amber-300/10 text-amber-200" : "bg-rose-400/10 text-rose-300"}`}><card.icon size={19} /></span><span className="text-xs font-semibold text-teal-200">{card.value}</span></div><h3 className="mt-4 font-semibold text-white">{card.title}</h3><p className="mt-2 min-h-16 text-xs leading-5 text-slate-400">{card.body}</p><button onClick={() => runAction(card.action)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10">{card.action}<ArrowRight size={14} /></button></article>)}
            </div>
          </section>
          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/6 py-4 text-[11px] text-slate-600"><span>StockSense · Retail intelligence workspace</span><span>Dashboard UI preview · Sample data, not live business metrics</span></footer>
        </main>
      </div>
    </div>
  );
}
