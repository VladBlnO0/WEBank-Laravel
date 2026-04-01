import ApplicationLogo from "@/components/application-logo";
import Footer from "@/components/footer";
import { PageProps } from "@/types/index";
import { Head, Link } from "@inertiajs/react";

const highlights = [
  {
    value: "24/7",
    label: "Smart fraud monitoring",
  },
  {
    value: "1.2s",
    label: "Average transfer confirmation",
  },
  {
    value: "99.98%",
    label: "Service uptime this year",
  },
];

const featureCards = [
  {
    title: "Instant local transfers",
    copy: "Send money between accounts in seconds with clear status updates at every step.",
  },
  {
    title: "Card controls in one place",
    copy: "Freeze, unfreeze, and track card activity from your dashboard without support calls.",
  },
  {
    title: "AI spending guidance",
    copy: "Receive practical monthly insights that help you reduce costs and grow savings.",
  },
  {
    title: "Protected by design",
    copy: "Multi-layer authentication and intelligent anomaly detection keep your funds safer.",
  },
];

export default function Welcome({
  auth,
  laravelVersion,
  phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
  return (
    <>
      <Head title="WEBank" />

      <div
        className="min-h-screen text-slate-900"
        style={{
          background:
            "radial-gradient(circle at 20% 10%, #d7f0df 0%, transparent 35%), radial-gradient(circle at 80% 0%, #f9d9b8 0%, transparent 38%), linear-gradient(180deg, #f3f0e8 0%, #f7f5ef 45%, #f3f3ec 100%)",
          fontFamily:
            '"Space Grotesk", "IBM Plex Sans", "Avenir Next", "Segoe UI", sans-serif',
        }}
      >
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -top-28 right-8 h-64 w-64 rounded-full bg-emerald-200/70 blur-3xl" />
            <div className="absolute top-52 -left-10 h-72 w-72 rounded-full bg-orange-200/70 blur-3xl" />
            <div className="absolute right-1/4 -bottom-16 h-56 w-56 rounded-full bg-cyan-200/70 blur-3xl" />
          </div>

          <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-8">
            <header className="animate-fade-up flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-white/80 p-2 shadow-md backdrop-blur-sm">
                  <ApplicationLogo className="h-8 w-8 fill-current text-emerald-700" />
                </span>
                <div>
                  <p className="text-xl font-semibold tracking-tight text-slate-900">
                    WEBank
                  </p>
                  <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
                    Digital banking, refined
                  </p>
                </div>
              </div>

              <nav className="flex items-center gap-2 text-sm font-medium">
                {auth.user ? (
                  <Link
                    href={route("user-dashboard")}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Open dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href={route("login")}
                      className="rounded-xl border border-slate-300 bg-white/80 px-4 py-2.5 text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-white"
                    >
                      Log in
                    </Link>
                    <Link
                      href={route("register")}
                      className="rounded-xl bg-emerald-700 px-4 py-2.5 text-white transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-600"
                    >
                      Create account
                    </Link>
                  </>
                )}
              </nav>
            </header>

            <main className="relative z-10 mt-14 grid flex-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <section className="animate-fade-up [animation-delay:120ms]">
                <p className="mb-4 inline-flex rounded-full border border-emerald-300/70 bg-white/70 px-4 py-1 text-xs font-semibold tracking-[0.18em] text-emerald-800 uppercase backdrop-blur-sm">
                  New era personal banking
                </p>
                <h1 className="max-w-xl text-4xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Bank with speed, clarity, and confidence every day.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                  WEBank combines real-time transfers, intelligent card
                  controls, and transparent insights so you always know where
                  your money stands.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Link
                    href={
                      auth.user ? route("user-dashboard") : route("register")
                    }
                    className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    {auth.user ? "Go to dashboard" : "Start in 2 minutes"}
                  </Link>
                  {!auth.user && (
                    <Link
                      href={route("login")}
                      className="rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-white"
                    >
                      I already have an account
                    </Link>
                  )}
                </div>

                <div className="mt-10 grid gap-3 sm:grid-cols-3">
                  {highlights.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm"
                    >
                      <p className="text-2xl font-semibold tracking-tight text-slate-900">
                        {item.value}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="animate-fade-up [animation-delay:240ms]">
                <div className="relative rounded-3xl border border-white/80 bg-white/70 p-6 shadow-xl backdrop-blur-sm sm:p-8">
                  <div className="absolute -top-5 right-6 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold tracking-wide text-white">
                    Secure session
                  </div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                    Account snapshot
                  </p>
                  <div className="mt-4 rounded-2xl bg-slate-900 p-5 text-white shadow-lg">
                    <p className="text-xs tracking-[0.16em] text-slate-300 uppercase">
                      Main balance
                    </p>
                    <p className="mt-2 text-4xl font-semibold tracking-tight">
                      $24,802.19
                    </p>
                    <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
                      <span>Monthly inflow</span>
                      <span className="font-semibold text-emerald-300">
                        +$5,430.10
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
                      <span>Monthly outflow</span>
                      <span className="font-semibold text-orange-300">
                        -$2,918.42
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                      <p className="text-xs font-semibold tracking-[0.15em] text-emerald-800 uppercase">
                        Card status
                      </p>
                      <p className="mt-2 text-lg font-semibold text-emerald-900">
                        Active and protected
                      </p>
                    </div>
                    <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                      <p className="text-xs font-semibold tracking-[0.15em] text-cyan-800 uppercase">
                        Transfer speed
                      </p>
                      <p className="mt-2 text-lg font-semibold text-cyan-900">
                        Real-time internal
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>

        <section className="mx-auto w-full max-w-7xl px-6 pb-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature, index) => (
              <article
                key={feature.title}
                className="animate-fade-up rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  {feature.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {feature.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 w-full max-w-7xl px-6 pb-20 lg:px-8">
          <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white/85 p-8 shadow-sm backdrop-blur-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Security first
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                Built with strong safeguards and a transparent experience.
              </h2>
              <p className="mt-4 max-w-2xl text-slate-600">
                Advanced identity verification, encrypted transactions, and
                continuous risk monitoring work together to protect every
                action.
              </p>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                MFA and step-up verification for sensitive actions.
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                Instant alerts for transfers, card charges, and login events.
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                Session and device controls available directly from your
                account.
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1">
              Laravel {laravelVersion}
            </span>
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1">
              PHP {phpVersion}
            </span>
            <span className="rounded-full border border-slate-300 bg-white px-3 py-1">
              Inertia + React
            </span>
          </div>
        </section>

        <Footer className="text-center text-sm text-slate-700" />
      </div>

      <style>{`
        .animate-fade-up {
          opacity: 0;
          transform: translateY(18px);
          animation: fadeUp 700ms cubic-bezier(0.2, 0.7, 0.25, 1) forwards;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
