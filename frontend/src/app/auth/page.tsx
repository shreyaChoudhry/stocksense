import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserPlus,
  UserRound,
} from "lucide-react";

const pages = [
  {
    title: "Login",
    description: "Sign in to your StockSense workspace.",
    href: "/login",
    icon: UserRound,
    tag: "Existing users",
  },
  {
    title: "Create account",
    description: "Register a new StockSense business account.",
    href: "/signup",
    icon: UserPlus,
    tag: "New users",
  },
  {
    title: "Forgot password",
    description: "Start the account recovery process.",
    href: "/forgot-password",
    icon: KeyRound,
    tag: "Account recovery",
  },
  {
    title: "Email verification",
    description: "Enter your six-digit email verification code.",
    href: "/verify-email",
    icon: Mail,
    tag: "Verification",
  },
  {
    title: "Reset password",
    description: "Choose a new password for your account.",
    href: "/reset-password",
    icon: LockKeyhole,
    tag: "Security",
  },
  {
    title: "Welcome",
    description: "View the account setup success screen.",
    href: "/welcome",
    icon: CheckCircle2,
    tag: "Success screen",
  },
];

export default function AuthHubPage() {
  return (
    <main className="min-h-screen bg-[#0b1020] px-5 py-12 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-300/20 bg-teal-300/10 text-teal-300">
              <Activity size={21} />
            </span>
            <span className="text-xl font-semibold tracking-tight">
              Stock<span className="text-teal-300">Sense</span>
            </span>
          </Link>
          <Link href="/" className="text-sm text-slate-400 transition hover:text-teal-200">
            Back to homepage
          </Link>
        </header>

        <section className="relative mt-14 overflow-hidden rounded-3xl border border-slate-700/70 bg-[#111a2b] p-7 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-teal-300/10 blur-[100px]" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-teal-200">
              <ShieldCheck size={13} /> AUTHENTICATION CENTER
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Your StockSense access hub.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Open any authentication screen from one place. Choose a page below
              to preview the complete StockSense account experience.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-teal-300 px-5 py-3 text-sm font-semibold text-[#06201e] transition hover:bg-teal-200">
                Go to login <ArrowRight size={16} />
              </Link>
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/70 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-teal-300/50 hover:text-teal-200">
                Create account <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-teal-300">ALL AUTH SCREENS</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Explore the authentication flow</h2>
            </div>
            <span className="text-xs text-slate-500">6 pages available</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page, index) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className="group rounded-2xl border border-slate-800 bg-[#111a2b] p-5 transition duration-200 hover:-translate-y-1 hover:border-teal-300/40 hover:bg-[#152238]"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-300/15 bg-teal-300/10 text-teal-300">
                      <Icon size={20} />
                    </span>
                    <span className="text-xs font-medium text-slate-600">0{index + 1}</span>
                  </div>
                  <p className="mt-5 text-lg font-semibold text-slate-100">{page.title}</p>
                  <p className="mt-2 min-h-10 text-sm leading-5 text-slate-400">{page.description}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{page.tag}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-300 transition group-hover:gap-2">
                      Open page <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
<footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-600">
  <span>© 2026 StockSense</span>
  <span>Authentication page directory</span>
</footer>
      </div>
    </main>
  );
}
