 "use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  CircleHelp,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Package,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
type AuthMode = "login" | "signup" | "forgot" | "verify" | "reset" | "welcome";
type AuthPageProps = {
  mode: AuthMode;
};
const routeByMode: Record<AuthMode, string> = {
  login: "/login",
  signup: "/signup",
  forgot: "/forgot-password",
  verify: "/verify-email",
  reset: "/reset-password",
  welcome: "/welcome",
};
const copyByMode: Record<AuthMode, { eyebrow: string; title: string; description: string }> = {
  login: {
    eyebrow: "AUTONOMOUS SUPPLY ENGINE",
    title: "Predictive retail intelligence, right at your fingertips.",
    description:
      "Turn everyday sales and inventory data into smarter decisions. Spot demand shifts, reduce stockouts, and keep every store moving.",
  },
  signup: {
    eyebrow: "START WITH STOCKSENSE",
    title: "Build a smarter, more resilient retail business.",
    description:
      "Create your workspace and bring your inventory, sales, and demand signals into one clear view.",
  },
  forgot: {
    eyebrow: "ACCOUNT RECOVERY",
    title: "Get back to making confident decisions.",
    description:
      "Recover access to your StockSense workspace with a simple, secure password reset process.",
  },
  verify: {
    eyebrow: "VERIFY YOUR ACCOUNT",
    title: "One quick check. A smarter workspace awaits.",
    description:
      "Confirm your email address to protect your account and finish setting up your StockSense workspace.",
  },
  reset: {
    eyebrow: "SECURE YOUR ACCOUNT",
    title: "A fresh password for your business intelligence.",
    description:
      "Choose a strong password that helps keep your retail data and workspace protected.",
  },
  welcome: {
    eyebrow: "YOU'RE READY",
    title: "Welcome to a clearer view of your business.",
    description:
      "Your StockSense account setup is complete. You can now explore your workspace and start turning data into decisions.",
  },
};
function Brand() {
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label="StockSense home">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-lime-300/20 bg-lime-300/10 text-lime-300 shadow-[0_0_24px_rgba(183,243,74,0.10)]">
        <Activity size={21} strokeWidth={2.5} />
      </span>
      <span className="text-xl font-semibold tracking-tight text-slate-100">
        Stock<span className="text-lime-300">Sense</span>
      </span>
    </Link>
  );
}
function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-5 w-5">
      <path fill="#FFC107" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4.1 6v5h6.6c3.9-3.6 6.1-8.8 6.1-14.7Z" />
      <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2C9.2 39.5 16 44 24 44Z" />
      <path fill="#4A90E2" d="M12.6 27.7a12 12 0 0 1 0-7.4v-5.2H5.8a20 20 0 0 0 0 17.8l6.8-5.2Z" />
      <path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.9 29.5 4 24 4 16 4 9.2 8.5 5.8 15.1l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z" />
    </svg>
  );
}
function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  required = true,
  autoComplete,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  icon?: "mail" | "lock";
  required?: boolean;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword && visible ? "text" : type;
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <span className="relative flex items-center">
        {icon === "mail" && <Mail className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-500" />}
        {icon === "lock" && <LockKeyhole className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-500" />}
        <input
          type={actualType}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border border-slate-700/80 bg-[#090C09] py-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-lime-300/70 focus:ring-4 focus:ring-lime-300/10 ${icon ? "pl-11" : "pl-4"} ${isPassword ? "pr-12" : "pr-4"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            className="absolute right-3.5 rounded-md p-1 text-slate-500 transition hover:text-lime-200"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </span>
    </label>
  );
}
function PrimaryButton({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 py-3.5 text-sm font-semibold text-[#06201e] shadow-[0_8px_28px_rgba(183,243,74,0.12)] transition hover:-translate-y-0.5 hover:bg-lime-200 hover:shadow-[0_10px_32px_rgba(183,243,74,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
      <ArrowRight size={17} className="transition group-hover:translate-x-1" />
    </button>
  );
}
function FormHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold tracking-[0.19em] text-lime-300">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-[34px]">{title}</h2>
      <p className="max-w-md text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
function DashboardPreview() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-[#111612] p-5 shadow-2xl shadow-black/20 sm:p-6">
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-lime-300/10 blur-3xl" />
      <div className="relative space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-300/10 text-lime-300"><Package size={17} /></span>
            Store telemetry
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/20 bg-lime-400/10 px-2.5 py-1 text-[10px] font-semibold text-lime-300">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-300" /> LIVE PREVIEW
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-700/50 bg-[#0D110D] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Monthly sales</p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">₹24.8L</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-lime-300"><TrendingUp size={13} /> +18.6% vs target</p>
          </div>
          <div className="rounded-xl border border-slate-700/50 bg-[#0D110D] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Stock health</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">94%</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-lime-300 text-[10px] font-bold text-lime-200">94</div>
            </div>
            <p className="mt-1 text-xs font-medium text-lime-300">Optimal stock</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#0D110D] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-300">Demand trajectory</p>
            <div className="flex gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><i className="h-1.5 w-3 rounded-full bg-lime-300" /> Predicted</span>
              <span className="flex items-center gap-1"><i className="h-1.5 w-3 rounded-full bg-lime-400" /> Actuals</span>
            </div>
          </div>
          <svg viewBox="0 0 440 145" className="mt-4 h-32 w-full" role="img" aria-label="Illustrative demand trend chart">
            <defs>
              <linearGradient id="stockSenseChartFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#B7F34A" stopOpacity=".24" />
                <stop offset="100%" stopColor="#B7F34A" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[30, 65, 100].map((y) => <line key={y} x1="8" x2="432" y1={y} y2={y} stroke="#30382A" strokeDasharray="4 5" />)}
            <path d="M8 112 C65 98 80 84 122 77 S184 99 220 73 S294 47 332 43 S393 34 432 18 L432 135 L8 135Z" fill="url(#stockSenseChartFill)" />
            <path d="M8 112 C65 98 80 84 122 77 S184 99 220 73 S294 47 332 43 S393 34 432 18" fill="none" stroke="#B7F34A" strokeWidth="3" strokeLinecap="round" />
            <path d="M8 118 C65 104 83 91 122 84 S184 105 220 79 S294 55 332 49 S393 40 432 27" fill="none" stroke="#8EAE3C" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
            <circle cx="220" cy="73" r="4.5" fill="#B7F34A" stroke="#0D110D" strokeWidth="3" />
          </svg>
          <div className="flex justify-between text-[10px] text-slate-600"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <TrendingUp size={14} />, label: "Revenue pace", value: "+18.6%" },
            { icon: <Package size={14} />, label: "Stock alerts", value: "04 active" },
            { icon: <Sparkles size={14} />, label: "AI insights", value: "Ready" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-slate-800/70 p-3">
              <div className="text-lime-300">{item.icon}</div>
              <p className="mt-2 truncate text-[10px] text-slate-500">{item.label}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-200">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [agree, setAgree] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [notice, setNotice] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const pageCopy = copyByMode[mode];
  const passwordScore = useMemo(() => {
    return [
      password.length >= 8,
      /[A-Z]/.test(password) && /[a-z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;
  }, [password]);
  const passwordLabel = ["Add a password", "Weak", "Fair", "Good", "Strong"][passwordScore];
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    if (mode === "signup") {
      if (password.length < 8) {
        setNotice("Please use a password with at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setNotice("Your passwords do not match.");
        return;
      }
      if (!agree) {
        setNotice("Please accept the terms to continue.");
        return;
      }
      router.push(routeByMode.verify);
      return;
    }
    if (mode === "verify") {
      if (otp.some((digit) => !digit)) {
        setNotice("Enter all 6 digits to continue.");
        return;
      }
      router.push(routeByMode.welcome);
      return;
    }
    if (mode === "reset") {
      if (password.length < 8 || password !== confirmPassword) {
        setNotice("Check your password and confirmation. They must match and contain at least 8 characters.");
        return;
      }
      router.push(routeByMode.login);
      return;
    }
    if (mode === "forgot") {
      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        setNotice("Demo mode: connect an email/authentication provider to send a real reset link.");
      }, 650);
      return;
    }
    if (mode === "login") {
      setNotice("Demo mode: connect your authentication backend to sign in securely.");
    }
  }
  async function handleGoogle() {
    try {
      setBusy(true);
      setNotice("");
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setNotice(error.message);
        setBusy(false);
      }
    } catch {
      setNotice("Unable to connect to Google. Please try again.");
      setBusy(false);
    }
  }
  function updateOtp(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((current) => current.map((item, itemIndex) => itemIndex === index ? digit : item));
    if (digit && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }
  function resendOtp() {
    setOtpMessage("Demo mode: connect your email provider to send a new verification code.");
  }
  return (
    <main className="min-h-screen overflow-hidden bg-[#0B0D0C] text-slate-100 selection:bg-lime-300 selection:text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-[#0B0D0C]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Brand />
          <div className="hidden items-center gap-2 rounded-full border border-lime-400/15 bg-lime-400/5 px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-lime-300 sm:flex">
            <ShieldCheck size={14} /> SECURE ACCOUNT ACCESS
          </div>
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-lime-200">
            <CircleHelp size={16} /> <span className="hidden sm:inline">Need help?</span>
          </Link>
        </div>
      </header>
      <div className="pointer-events-none fixed -left-48 top-20 h-125 w-125 rounded-full bg-lime-400/[0.07] blur-[130px]" />
      <div className="pointer-events-none fixed -right-48 bottom-0 h-130 w-130 rounded-full bg-lime-400/6 blur-[140px]" />
      <section className="relative mx-auto grid min-h-[calc(100vh-144px)] max-w-7xl grid-cols-1 items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-14">
        <div className="space-y-7 lg:py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-lime-300/15 bg-lime-300/6 px-3 py-1.5 text-[10px] font-bold tracking-[0.17em] text-lime-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300" />
            {pageCopy.eyebrow}
          </div>
          <div className="max-w-xl space-y-4">
            <h1 className="text-4xl font-semibold leading-[1.12] tracking-[-0.04em] text-white sm:text-5xl">
              {pageCopy.title}
            </h1>
            <p className="max-w-lg text-base leading-7 text-slate-400">{pageCopy.description}</p>
          </div>
          <DashboardPreview />
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <ShieldCheck size={16} />, title: "Secure access", sub: "Account protection" },
              { icon: <Zap size={16} />, title: "Smart insights", sub: "Demand intelligence" },
              { icon: <Activity size={16} />, title: "Live visibility", sub: "Inventory signals" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-2 rounded-xl border border-slate-800/80 bg-slate-900/50 p-3">
                <span className="mt-0.5 text-lime-300">{item.icon}</span>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-slate-200">{item.title}</p>
                  <p className="mt-0.5 hidden text-[10px] text-slate-500 sm:block">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-130">
          <div className="absolute -inset-3 rounded-[28px] bg-linear-to-br from-lime-300/10 via-transparent to-lime-300/10 blur-xl" />
          <div className="relative rounded-2xl border border-slate-700/80 bg-[#111612]/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-9">
            {notice && (
              <div role="status" className="mb-5 flex items-start gap-2 rounded-xl border border-lime-300/20 bg-lime-300/10 px-4 py-3 text-xs leading-5 text-lime-100">
                <CircleHelp size={16} className="mt-0.5 shrink-0" /> {notice}
              </div>
            )}
            {mode === "login" && (
              <div className="space-y-6">
                <FormHeading eyebrow="SECURITY CLEARANCE" title="Welcome back" description="Sign in to continue to your StockSense workspace." />
                <button type="button" onClick={handleGoogle} className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800">
                  <GoogleMark /> Continue with Google
                </button>
                <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600"><span className="h-px flex-1 bg-slate-700" /> or sign in with email <span className="h-px flex-1 bg-slate-700" /></div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Field label="Work email" type="email" placeholder="you@yourbusiness.com" value={email} onChange={setEmail} icon="mail" autoComplete="email" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-200">Password</span>
                      <Link href="/forgot-password" className="text-xs font-medium text-lime-300 transition hover:text-lime-200">Forgot password?</Link>
                    </div>
                    <Field label="" type="password" placeholder="Enter your password" value={password} onChange={setPassword} icon="lock" autoComplete="current-password" />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-400">
                    <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-slate-900 accent-lime-300" />
                    Remember me on this device
                  </label>
                  <PrimaryButton>Sign in to workspace</PrimaryButton>
                </form>
                <p className="text-center text-sm text-slate-400">Don&apos;t have an account? <Link href="/signup" className="font-semibold text-lime-300 hover:text-lime-200">Create one for free</Link></p>
              </div>
            )}
            {mode === "signup" && (
              <div className="space-y-6">
                <FormHeading eyebrow="FREE ACCOUNT SETUP" title="Create your account" description="Start managing your business with smarter inventory intelligence." />
                <button type="button" onClick={handleGoogle} className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"><GoogleMark /> Sign up with Google</button>
                <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600"><span className="h-px flex-1 bg-slate-700" /> or create with email <span className="h-px flex-1 bg-slate-700" /></div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" placeholder="Your name" value={name} onChange={setName} autoComplete="name" />
                    <Field label="Business / store" placeholder="Your business" value={business} onChange={setBusiness} />
                  </div>
                  <Field label="Work email" type="email" placeholder="you@yourbusiness.com" value={email} onChange={setEmail} icon="mail" autoComplete="email" />
                  <Field label="Create password" type="password" placeholder="At least 8 characters" value={password} onChange={setPassword} icon="lock" autoComplete="new-password" />
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((item) => <span key={item} className={`h-1.5 rounded-full ${passwordScore >= item ? "bg-lime-300" : "bg-slate-700"}`} />)}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500"><span>Password strength: <span className={passwordScore >= 3 ? "text-lime-300" : "text-slate-400"}>{passwordLabel}</span></span><span>8+ characters recommended</span></div>
                  </div>
                  <Field label="Confirm password" type="password" placeholder="Re-enter your password" value={confirmPassword} onChange={setConfirmPassword} icon="lock" autoComplete="new-password" />
                  <label className="flex items-start gap-2 text-xs leading-5 text-slate-400">
                    <input type="checkbox" checked={agree} onChange={(event) => setAgree(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 rounded border-slate-600 bg-slate-900 accent-lime-300" />
                    <span>I agree to the <a href="#" className="text-lime-300 hover:underline">Terms of Service</a> and <a href="#" className="text-lime-300 hover:underline">Privacy Policy</a>.</span>
                  </label>
                  <PrimaryButton>Create free account</PrimaryButton>
                </form>
                <p className="text-center text-sm text-slate-400">Already have an account? <Link href="/login" className="font-semibold text-lime-300 hover:text-lime-200">Sign in</Link></p>
              </div>
            )}
            {mode === "forgot" && (
              <div className="space-y-6">
                <FormHeading eyebrow="ACCOUNT RECOVERY" title="Forgot your password?" description="Enter the email address associated with your account. We'll guide you through resetting your password." />
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Field label="Account email" type="email" placeholder="you@yourbusiness.com" value={email} onChange={setEmail} icon="mail" autoComplete="email" />
                  <PrimaryButton disabled={busy}>{busy ? "Preparing reset..." : "Send reset instructions"}</PrimaryButton>
                </form>
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-lime-200"><ArrowLeft size={16} /> Back to sign in</Link>
              </div>
            )}
            {mode === "verify" && (
              <div className="space-y-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-300"><Mail size={26} /></div>
                <FormHeading eyebrow="EMAIL VERIFICATION" title="Check your inbox" description={`We've prepared a verification step${email ? ` for ${email}` : ""}. Enter the 6-digit code from your email to continue.`} />
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        value={digit}
                        onChange={(event) => updateOtp(index, event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Backspace" && !digit && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
                        }}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        aria-label={`Verification digit ${index + 1}`}
                        className="h-12 min-w-0 w-full rounded-xl border border-slate-700 bg-[#090C09] text-center text-xl font-semibold text-lime-200 outline-none transition focus:border-lime-300 focus:ring-4 focus:ring-lime-300/10"
                      />
                    ))}
                  </div>
                  <PrimaryButton>Verify email</PrimaryButton>
                </form>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <span>{otpMessage || "Didn't receive a code?"}</span>
                  <button type="button" onClick={resendOtp} className="font-semibold text-lime-300 hover:text-lime-200">Resend code</button>
                </div>
                <Link href="/signup" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-lime-200"><ArrowLeft size={16} /> Change signup details</Link>
              </div>
            )}
            {mode === "reset" && (
              <div className="space-y-6">
                <FormHeading eyebrow="PASSWORD RESET" title="Create a new password" description="Choose a new password for your StockSense account. Use at least 8 characters." />
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Field label="New password" type="password" placeholder="Enter new password" value={password} onChange={setPassword} icon="lock" autoComplete="new-password" />
                  <Field label="Confirm new password" type="password" placeholder="Re-enter new password" value={confirmPassword} onChange={setConfirmPassword} icon="lock" autoComplete="new-password" />
                  <PrimaryButton>Update password</PrimaryButton>
                </form>
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-lime-200"><ArrowLeft size={16} /> Return to sign in</Link>
              </div>
            )}
            {mode === "welcome" && (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-lime-300/20 bg-lime-300/10 text-lime-300 shadow-[0_0_35px_rgba(183,243,74,0.10)]"><CheckCircle2 size={42} /></div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold tracking-[0.19em] text-lime-300">ACCOUNT SETUP COMPLETE</p>
                  <h2 className="text-3xl font-semibold tracking-tight text-white">You&apos;re all set!</h2>
                  <p className="text-sm leading-6 text-slate-400">Welcome to StockSense. Your next step is exploring your workspace and connecting your store data.</p>
                </div>
                <div className="space-y-3 rounded-xl border border-slate-700/70 bg-[#0D110D] p-4 text-left">
                  {["Your account details are ready", "Your workspace is ready to configure", "Connect your inventory data to get started"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-slate-300"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-400/10 text-lime-300"><Check size={14} /></span>{item}</div>
                  ))}
                </div>
                <Link href="/" className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 py-3.5 text-sm font-semibold text-[#06201e] shadow-[0_8px_28px_rgba(183,243,74,0.12)] transition hover:bg-lime-200">Explore StockSense <ArrowUpRight size={17} /></Link>
                <Link href="/login" className="text-xs text-slate-500 hover:text-lime-200">Sign in with another account</Link>
              </div>
            )}
          </div>
          <p className="mt-5 text-center text-[11px] leading-5 text-slate-600"><ShieldCheck size={13} className="mr-1 inline text-lime-400" /> Your account details should be handled securely. Real authentication is not enabled until a backend/provider is connected.</p>
        </div>
      </section>
      <footer className="border-t border-slate-800/70 bg-[#090C09]/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-[11px] text-slate-600 sm:flex-row sm:px-8">
          <span>© {2026} StockSense. All rights reserved.</span>
          <div className="flex items-center gap-5"><Link href="/" className="hover:text-lime-200">Home</Link><a href="#" className="hover:text-lime-200">Privacy</a><a href="#" className="hover:text-lime-200">Terms</a></div>

        </div>
      </footer>
    </main>
  );
}