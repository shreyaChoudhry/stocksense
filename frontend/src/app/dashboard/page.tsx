"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Boxes,
  ChevronDown,
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

const sage = "#A9B89A";

function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-[15px] border border-[#465044] bg-[#20251f]"
      style={{ width: size + 18, height: size + 18 }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M2.5 16h6.2l4.2-11 7.1 22 4.2-11h5.3" stroke={sage} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`min-w-0 rounded-[20px] border border-[#2b302b] bg-[#171a18] shadow-[0_10px_32px_rgba(0,0,0,0.14)] ${className}`}>
      {children}
    </section>
  );
}

function Metric({
  label,
  value,
  detail,
  positive = true,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  positive?: boolean;
  icon: typeof TrendingUp;
}) {
  return (
    <Panel className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium text-[#a4aaa0]">{label}</p>
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#252a24] text-[#a9b89a]">
          <Icon size={15} strokeWidth={1.8} />
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
        <p className="text-[clamp(1.45rem,2vw,1.9rem)] font-semibold tracking-tight text-[#f0f1ed]">{value}</p>
        <span className={`mb-1 text-[10px] font-medium ${positive ? "text-[#a9b89a]" : "text-[#c49a78]"}`}>{detail}</span>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-[#303330] pt-3 text-[10px] text-[#777e75]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#78866e]" />
        Compared with previous period
      </div>
    </Panel>
  );
}

function SalesChart({ period }: { period: string }) {
  const paths: Record<string, string> = {
    Daily: "M10 170 C70 145 90 160 145 128 S220 142 270 105 S345 120 400 82 S475 95 530 55 S585 48 615 24",
    Weekly: "M10 160 C65 155 75 115 130 126 S205 142 255 95 S330 112 380 76 S455 95 505 48 S565 55 615 24",
    Monthly: "M10 165 C60 145 75 120 130 135 S210 118 255 91 S330 113 380 74 S455 88 505 49 S565 52 615 20",
  };
  const line = paths[period] ?? paths.Monthly;

  return (
    <div className="mt-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-[10px] text-[#a4aaa0]">
        <div className="flex gap-4">
          <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#a9b89a]" /> Actual sales</span>
          <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#78866e]" /> Forecast</span>
        </div>
        <span className="text-[#777e75]">REVENUE · INR</span>
      </div>
      <svg viewBox="0 0 640 230" className="h-52 w-full" role="img" aria-label="Illustrative sales and forecast chart">
        <defs>
          <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a9b89a" stopOpacity=".18" />
            <stop offset="100%" stopColor="#a9b89a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[30, 75, 120, 165, 205].map((y) => (
          <line key={y} x1="8" x2="630" y1={y} y2={y} stroke="#303530" strokeDasharray="3 7" />
        ))}
        <path d={`${line} L615 205 L10 205 Z`} fill="url(#salesFill)" />
        <path d={line} fill="none" stroke="#a9b89a" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M395 76 C455 66 520 45 615 18" fill="none" stroke="#78866e" strokeWidth="2" strokeDasharray="5 7" />
        <line x1="395" x2="395" y1="20" y2="205" stroke="#69745f" strokeDasharray="3 7" opacity=".65" />
        <circle cx="395" cy="72" r="5" fill="#c3cdb8" stroke="#171917" strokeWidth="2" />
        {["01", "05", "10", "15", "20", "25", "30"].map((d, i) => (
          <text key={d} x={[10, 110, 210, 310, 410, 510, 615][i]} y="224" fill="#777e75" fontSize="9" textAnchor="middle">{d} OCT</text>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap justify-between gap-2 text-[10px] text-[#777e75]">
        <span>Sales trajectory · illustrative sample data</span>
        <span className="text-[#a9b89a]">Forecast confidence: sample 98.7%</span>
      </div>
    </div>
  );
}

function MiniBars() {
  const heights = [30, 48, 38, 67, 53, 82, 62, 94, 72, 108, 87, 120, 98, 136, 115, 150];
  return (
    <div className="flex h-20 items-end gap-1.5">
      {heights.map((height, index) => (
        <div
          key={index}
          className="flex-1 rounded-t-sm"
          style={{ height: `${height / 1.6}%`, background: index > 11 ? "#a9b89a" : "#78866e", opacity: index > 11 ? 1 : 0.65 }}
        />
      ))}
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

  const filteredItems = useMemo(
    () =>
      stockItems.filter((item) => {
        const matchesFilter = filter === "All" || item.status === filter;
        return matchesFilter && `${item.name} ${item.sku} ${item.vendor}`.toLowerCase().includes(query.toLowerCase());
      }),
    [filter, query]
  );

  async function logout() {
    try {
      await createClient().auth.signOut();
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  function exportCsv() {
    const rows = [
      ["Product", "SKU", "Current stock", "Threshold", "Vendor", "Status"],
      ...filteredItems.map((item) => [item.name, item.sku, String(item.stock), String(item.threshold), item.vendor, item.status]),
    ];
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
    setNotice(`${label}: this is currently a dashboard preview action. Connect the relevant backend workflow to execute it.`);
    window.setTimeout(() => setBusyAction(""), 700);
  }

  const sidebar = (
    <>
      <div className="flex h-22 items-center gap-3 border-b border-[#303330] px-5">
        <BrandMark size={25} />
        <div className="min-w-0">
          <p className="text-[16px] font-semibold tracking-tight text-[#f0f1ed]">Stock<span className="text-[#a9b89a]">Sense</span></p>
          <p className="mt-1 text-[9px] font-medium tracking-[.18em] text-[#858d80]">RETAIL INTELLIGENCE</p>
        </div>
        <span className="ml-auto h-2 w-2 rounded-full bg-[#a9b89a]" />
      </div>

      <div className="px-5 pb-2 pt-7 text-[10px] font-medium text-[#858d80]">Workspace</div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navigation.map(({ label, icon: Icon, tag, count }) => (
          <button
            key={label}
            onClick={() => {
              setActiveNav(label);
              setMobileOpen(false);
              if (label !== "Overview") setNotice(`${label} is a preview section. Overview remains the active dashboard.`);
            }}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[12px] transition ${
              activeNav === label
                ? "bg-[#292e28] text-[#f0f1ed] shadow-inner"
                : "text-[#a2a89e] hover:bg-[#202420] hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3"><Icon size={16} strokeWidth={1.8} />{label}</span>
            {tag && <span className="text-[9px] font-semibold text-[#a9b89a]">{tag}</span>}
            {count && <span className="rounded-full bg-[#30372e] px-2 py-0.5 text-[9px] text-[#c3cdb8]">{count}</span>}
          </button>
        ))}
      </nav>

      <div className="border-t border-[#303330] p-4">
        <div className="mb-4 flex items-center gap-2 text-[9px] text-[#858d80]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#a9b89a]" />
          SYSTEM STATUS
          <span className="ml-auto text-[#a9b89a]">OPERATIONAL</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full border border-[#465044] bg-[#252b23] text-[10px] font-semibold text-[#c3cdb8]">SS</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-[#e7e9e3]">StockSense User</p>
            <p className="text-[10px] text-[#858d80]">Retail workspace</p>
          </div>
          <button onClick={logout} title="Log out" className="rounded-lg p-2 text-[#a2a89e] transition hover:bg-[#292e28] hover:text-white">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="stocksense-dashboard min-h-screen bg-[#101210] text-[#e8eae4]">
      <style jsx global>{`
        .stocksense-dashboard {
          color-scheme: dark;
        }
        .stocksense-dashboard h1,
        .stocksense-dashboard h2,
        .stocksense-dashboard h3,
        .stocksense-dashboard p {
          margin-block: 0;
          letter-spacing: normal;
          text-transform: none;
          position: static;
          transform: none;
          text-shadow: none;
        }
        .stocksense-dashboard h1 { line-height: 1.2 !important; }
        .stocksense-dashboard h2 { line-height: 1.35 !important; font-size: 16px !important; }
        .stocksense-dashboard h3 { line-height: 1.4 !important; }
        .stocksense-dashboard p { line-height: 1.5; }
        .stocksense-dashboard button,
        .stocksense-dashboard input { font-family: inherit; }
        .stocksense-dashboard button { border-radius: 11px; }
        .stocksense-dashboard input { border-radius: 11px; }
        .stocksense-dashboard section { min-width: 0; }
        .stocksense-dashboard aside { scrollbar-width: thin; scrollbar-color: #454b43 transparent; }
        .stocksense-dashboard svg { flex-shrink: 0; }
      `}</style>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-63 flex-col border-r border-[#2b302b] bg-[#131613] xl:flex">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 xl:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="flex h-full w-70 flex-col border-r border-[#2b302b] bg-[#131613]" onClick={(event) => event.stopPropagation()}>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="xl:pl-63">
        <header className="sticky top-0 z-30 flex min-h-17 flex-wrap items-center justify-between gap-3 border-b border-[#2b302b] bg-[#131613]/95 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 text-[#a2a89e] xl:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
              <Menu size={19} />
            </button>
            <div className="hidden items-center gap-2 text-[10px] text-[#858d80] sm:flex">
              <span>WORKSPACE</span><span className="text-[#596052]">/</span><span className="font-semibold text-[#e0e4db]">{activeNav.toUpperCase()}</span>
            </div>
            <span className="hidden h-4 w-px bg-[#343a33] sm:block" />
            <span className="flex items-center gap-2 text-[10px] text-[#a9b89a]"><i className="h-1.5 w-1.5 rounded-full bg-[#a9b89a]" /> SYSTEM ONLINE</span>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
            <label className="relative hidden max-w-70 flex-1 md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#858d80]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products, SKU or supplier..."
                className="h-9 w-full rounded-xl border border-[#343a33] bg-[#1b1f1c] pl-9 pr-3 text-[11px] text-white outline-none placeholder:text-[#777e75] focus:border-[#78866e]"
              />
            </label>
            <div className="hidden text-right sm:block">
              <p className="text-[9px] text-[#777e75]">WORKSPACE</p>
              <p className="text-[11px] font-semibold text-[#e0e4db]">Retail Operations <ChevronDown size={11} className="ml-1 inline" /></p>
            </div>
            <button onClick={() => setNotice("You have 8 illustrative stock alerts to review.")} className="relative grid h-9 w-9 place-items-center rounded-xl border border-[#343a33] text-[#a2a89e] transition hover:bg-[#252a24]" aria-label="Notifications">
              <Bell size={15} /><i className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#a9b89a]" />
            </button>
            <button onClick={logout} className="hidden h-9 items-center gap-2 rounded-xl border border-[#485044] px-3 text-[10px] font-semibold text-[#c3cdb8] transition hover:bg-[#292e28] sm:flex">
              <LogOut size={14} /> LOG OUT
            </button>
          </div>
        </header>

        <main className="dashboard-content mx-auto w-full space-y-5 p-4 sm:p-6 lg:p-7">
          {notice && (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-[#4a5542] bg-[#20271e] px-4 py-3 text-[11px] text-[#d3dccb]">
              <span>{notice}</span>
              <button onClick={() => setNotice("")} aria-label="Dismiss" className="text-[#b8c3ad]"><X size={14} /></button>
            </div>
          )}

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-[.14em] text-[#a9b89a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#a9b89a]" /> STOCKSENSE INTELLIGENCE
              </div>
              <h1 className="text-[25px] font-semibold tracking-tight text-[#f0f1ed] sm:text-[30px]">
                Good evening. <span className="font-normal text-[#a6ada1]">Here&apos;s your business pulse.</span>
              </h1>
              <p className="mt-2 text-[11px] text-[#858d80]">Retail performance, inventory exposure and demand signals · illustrative demo data</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => runAction("Scenario simulation")} className="flex items-center gap-2 rounded-xl border border-[#3b403a] bg-[#1b1f1c] px-4 py-2.5 text-[10px] text-[#c3c9bd] transition hover:bg-[#252a24]">
                <Activity size={14} /> SIMULATE
              </button>
              <button onClick={() => runAction("Purchase order batch")} className="flex items-center gap-2 rounded-xl bg-[#b5c2a8] px-4 py-2.5 text-[10px] font-semibold text-[#182017] transition hover:bg-[#c2cdb7]">
                <Zap size={14} /> GENERATE PO <ArrowRight size={13} />
              </button>
            </div>
          </div>

          <section className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-5">
            <Metric label="Net sales · month" value="₹24.85L" detail="+18.6%" icon={TrendingUp} />
            <Metric label="Inventory health" value="94.2%" detail="OPTIMAL" icon={ShieldCheck} />
            <Metric label="Orders processed" value="12,845" detail="+12.4%" icon={Boxes} />
            <Metric label="Stockout exposure" value="08 SKUs" detail="ATTENTION" positive={false} icon={AlertTriangle} />
            <Metric label="Forecast signal" value="16.4%" detail="RISING" icon={Activity} />
          </section>

          <section className="grid gap-4 2xl:grid-cols-12">
            <Panel className="p-5 sm:p-6 2xl:col-span-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold tracking-[.13em] text-[#a9b89a]">01 / PERFORMANCE</p>
                  <h2 className="mt-2 font-semibold text-[#edf0e9]">Sales performance &amp; demand trajectory</h2>
                  <p className="mt-1 text-[10px] text-[#858d80]">Actual sales compared with the illustrative forecast horizon</p>
                </div>
                <div className="flex rounded-xl border border-[#343a33] bg-[#1b1f1c] p-1">
                  {["Daily", "Weekly", "Monthly"].map((item) => (
                    <button key={item} onClick={() => setPeriod(item)} className={`rounded-lg px-3 py-2 text-[10px] transition ${period === item ? "bg-[#343d31] text-[#e3e9dc]" : "text-[#92998d] hover:text-white"}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <SalesChart period={period} />
              <div className="mt-5 grid gap-4 border-t border-[#303530] pt-4 sm:grid-cols-3">
                <div><p className="text-[9px] tracking-wider text-[#858d80]">PERIOD HIGH</p><p className="mt-1 text-[17px] font-medium text-[#e8ebe4]">₹2.84L</p></div>
                <div><p className="text-[9px] tracking-wider text-[#858d80]">AVERAGE DAILY SALES</p><p className="mt-1 text-[17px] font-medium text-[#e8ebe4]">₹82.6K</p></div>
                <div><p className="text-[9px] tracking-wider text-[#858d80]">FORECAST DELTA</p><p className="mt-1 text-[17px] font-medium text-[#a9b89a]">+8.2%</p></div>
              </div>
            </Panel>

            <Panel className="p-5 sm:p-6 2xl:col-span-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold tracking-[.13em] text-[#a9b89a]">02 / AI OVERVIEW</p>
                  <h2 className="mt-2 font-semibold text-[#edf0e9]">StockSense AI brief</h2>
                </div>
                <span className="flex items-center gap-1 rounded-lg border border-[#41483d] px-2.5 py-1.5 text-[9px] text-[#b6c3a9]"><Sparkles size={11} /> INSIGHTS</span>
              </div>
              <p className="mt-3 text-[10px] leading-5 text-[#9ca397]">A concise view of demand movement, inventory cover and supplier signals.</p>
              <div className="mt-4 rounded-2xl border border-[#303630] bg-[#121613] p-4">
                <div className="flex items-center justify-between gap-2 text-[9px]">
                  <span className="text-[#b6c3a9]">● ACTIVE SIGNAL · FMCG</span>
                  <span className="text-[#777e75]">Updated just now</span>
                </div>
                <h3 className="mt-3 text-[15px] font-semibold leading-6 text-[#eef0eb]">Weekend demand is building across essential categories.</h3>
                <p className="mt-2 text-[10px] leading-5 text-[#9ca397]">The sample model indicates a stronger replenishment requirement for dairy and packaged staples.</p>
                <div className="mt-4 space-y-3">
                  <div className="flex gap-2.5"><TrendingUp size={14} className="mt-0.5 shrink-0 text-[#a9b89a]" /><p className="text-[10px] leading-5 text-[#aeb4a9]"><b className="text-[#e2e6de]">Dairy demand:</b> sample trajectory up 22%; review short supplier lead times.</p></div>
                  <div className="flex gap-2.5"><Boxes size={14} className="mt-0.5 shrink-0 text-[#a9b89a]" /><p className="text-[10px] leading-5 text-[#aeb4a9]"><b className="text-[#e2e6de]">Inventory cover:</b> two sample SKUs sit below reorder threshold.</p></div>
                  <div className="flex gap-2.5"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#a9b89a]" /><p className="text-[10px] leading-5 text-[#aeb4a9]"><b className="text-[#e2e6de]">Action:</b> validate supplier availability before drafting purchase orders.</p></div>
                </div>
              </div>
              <button onClick={() => runAction("AI insight review")} className="mt-3 flex w-full items-center justify-between rounded-xl border border-[#3b4238] px-4 py-3 text-[10px] font-medium text-[#c3cdb8] transition hover:bg-[#242a22]">
                REVIEW FULL BRIEF <ArrowUpRight size={14} />
              </button>
            </Panel>
          </section>

          <section className="grid gap-4 lg:grid-cols-12">
            <Panel className="p-5 sm:p-6 lg:col-span-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold tracking-[.13em] text-[#a9b89a]">03 / INVENTORY</p>
                  <h2 className="mt-2 font-semibold text-[#edf0e9]">Stock health &amp; allocation</h2>
                  <p className="mt-1 text-[10px] text-[#858d80]">Illustrative distribution across 1,420 sample SKUs</p>
                </div>
                <span className="text-[9px] text-[#858d80]">ALL LOCATIONS <ChevronDown size={11} className="inline" /></span>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_1.3fr] sm:items-center">
                <div className="relative mx-auto grid h-40 w-40 place-items-center rounded-full" style={{ background: "conic-gradient(#a9b89a 0 72%, #b39a70 72% 88%, #a87568 88% 95%, #394238 95% 100%)" }}>
                  <div className="grid h-28 w-28 place-items-center rounded-full bg-[#171917] text-center">
                    <div><p className="text-2xl font-semibold text-[#edf0e9]">1,420</p><p className="text-[9px] tracking-widest text-[#858d80]">TOTAL SKUS</p></div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[["In stock", "1,022", "72%", "#a9b89a"], ["Low stock", "227", "16%", "#b39a70"], ["Out of stock", "99", "7%", "#a87568"], ["Overstocked", "72", "5%", "#65705e"]].map(([name, count, pct, color]) => (
                    <div key={name}>
                      <div className="mb-1.5 flex justify-between text-[10px]"><span className="text-[#aeb4a9]">{name}</span><span className="text-[#e1e5dc]">{count}<span className="ml-2 text-[#858d80]">{pct}</span></span></div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#303630]"><div className="h-full rounded-full" style={{ width: pct, background: color }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            <Panel className="p-5 sm:p-6 lg:col-span-5">
              <div className="flex items-start justify-between">
                <div><p className="text-[10px] font-semibold tracking-[.13em] text-[#a9b89a]">04 / DEMAND OUTLOOK</p><h2 className="mt-2 font-semibold text-[#edf0e9]">Next 7-day velocity</h2></div>
                <span className="rounded-lg bg-[#252b24] px-2.5 py-1.5 text-[9px] text-[#b6c3a9]">SAMPLE MODEL</span>
              </div>
              <div className="mt-6 flex items-end justify-between gap-4">
                <div><p className="text-3xl font-semibold tracking-tight text-[#edf0e9]">+16.4%</p><p className="mt-1 text-[10px] text-[#858d80]">Expected demand movement</p></div>
                <div className="w-[48%]"><MiniBars /></div>
              </div>
              <div className="mt-6 space-y-3 border-t border-[#303630] pt-4">
                {[["Dairy & fresh foods", "+22%"], ["Edible oils & grains", "+14%"], ["Snacks & confectionery", "+19%"]].map(([name, value]) => (
                  <div key={name} className="flex justify-between text-[10px]"><span className="text-[#aeb4a9]">{name}</span><b className="font-medium text-[#b6c3a9]">{value}</b></div>
                ))}
              </div>
            </Panel>
          </section>

          <Panel className="p-5 sm:p-6" >
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <p className="text-[10px] font-semibold tracking-[.13em] text-[#a9b89a]">05 / ACTION QUEUE</p>
                <h2 className="mt-2 font-semibold text-[#edf0e9]">Stock vulnerability &amp; reorder monitor</h2>
                <p className="mt-1 text-[10px] text-[#858d80]">Review sample products that may need replenishment.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="relative md:hidden">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#858d80]" />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search SKU" className="h-9 w-32 rounded-xl border border-[#343a33] bg-[#1b1f1c] pl-8 pr-2 text-[10px] outline-none focus:border-[#78866e]" />
                </label>
                <div className="flex rounded-xl border border-[#343a33] bg-[#1b1f1c] p-1">
                  {["All", "Critical", "Warning", "Healthy"].map((value) => (
                    <button key={value} onClick={() => setFilter(value)} className={`rounded-lg px-2.5 py-2 text-[9px] transition ${filter === value ? "bg-[#343d31] text-[#e3e9dc]" : "text-[#a2a89e] hover:text-white"}`}>{value}</button>
                  ))}
                </div>
                <button onClick={exportCsv} className="grid h-9 w-9 place-items-center rounded-xl border border-[#343a33] text-[#aeb8a4] transition hover:bg-[#252a24]" title="Export CSV"><Download size={14} /></button>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-190 text-left text-[10px]">
                <thead><tr className="border-b border-[#343a33] text-[9px] tracking-wider text-[#858d80]">
                  <th className="pb-3 pr-4 font-medium">PRODUCT</th><th className="pb-3 pr-4 font-medium">SKU</th><th className="pb-3 pr-4 font-medium">ON HAND</th><th className="pb-3 pr-4 font-medium">THRESHOLD</th><th className="pb-3 pr-4 font-medium">SUPPLIER</th><th className="pb-3 pr-4 font-medium">STATUS / ETA</th><th className="pb-3 text-right font-medium">ACTION</th>
                </tr></thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.sku} className="border-b border-[#2d322d] last:border-0 transition hover:bg-[#202520]">
                      <td className="py-4 pr-4"><p className="font-medium text-[#e5e8e1]">{item.name}</p><p className="mt-1 text-[9px] text-[#858d80]">{item.category}</p></td>
                      <td className="py-4 pr-4 font-mono text-[#aeb4a9]">{item.sku}</td>
                      <td className="py-4 pr-4"><b className={item.status === "Critical" ? "font-medium text-[#c49a78]" : item.status === "Warning" ? "font-medium text-[#c4ae7c]" : "font-medium text-[#a9b89a]"}>{item.stock} units</b><div className="mt-2 h-1 w-16 overflow-hidden rounded-full bg-[#303630]"><div className="h-full rounded-full" style={{ width: `${Math.min(100, (item.stock / item.threshold) * 100)}%`, background: item.status === "Critical" ? "#c49a78" : item.status === "Warning" ? "#c4ae7c" : "#a9b89a" }} /></div></td>
                      <td className="py-4 pr-4 text-[#aeb4a9]">{item.threshold}</td>
                      <td className="py-4 pr-4 text-[#aeb4a9]">{item.vendor}</td>
                      <td className="py-4 pr-4"><span className={item.status === "Critical" ? "text-[#c49a78]" : item.status === "Warning" ? "text-[#c4ae7c]" : "text-[#a9b89a]"}>{item.status === "Healthy" ? "HEALTHY" : `IN ${item.eta}`}</span></td>
                      <td className="py-4 text-right">{item.status === "Healthy" ? <span className="text-[#65705e]">—</span> : <button disabled={busyAction === item.sku} onClick={() => runAction(`Reorder for ${item.sku}`)} className="rounded-lg border border-[#485044] px-3 py-2 text-[9px] font-medium text-[#c3cdb8] transition hover:bg-[#343d31] disabled:opacity-50">{busyAction === item.sku ? "WORKING" : `DRAFT PO · ${item.reorder}U`}</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredItems.length === 0 && <p className="py-8 text-center text-[10px] text-[#858d80]">No matching products found.</p>}
            </div>
            <p className="mt-3 text-[9px] text-[#777e75]">Showing {filteredItems.length} illustrative records. Connect the inventory API to display live stock data.</p>
          </Panel>

          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[#303330] py-4 text-[9px] tracking-wide text-[#777e75]">
            <span>STOCKSENSE · RETAIL INTELLIGENCE</span>
            <span>DEMO ENVIRONMENT · SAMPLE DATA · NOT LIVE BUSINESS METRICS</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
