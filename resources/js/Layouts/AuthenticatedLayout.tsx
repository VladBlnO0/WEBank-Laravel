import { AiOperatorChat } from "@/Components/AiOperatorChat";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Footer from "@/Components/Footer";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import type { User } from "@/types";
import { Transition, TransitionChild } from "@headlessui/react";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";
import { useRoute } from "ziggy-js";
export default function Authenticated({
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  const user = (usePage().props.auth?.user as User | null | undefined) ?? null;
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);
  const route = useRoute();
  const homeUrl = route("Welcome");

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background:
          "radial-gradient(circle at 15% -5%, #d9efe4 0%, transparent 30%), radial-gradient(circle at 85% 0%, #f4e3ca 0%, transparent 30%), #f5f5ef",
      }}
    >
      <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/70 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.5)] backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href={homeUrl}
                className="flex items-center gap-3 rounded-2xl px-2 py-1"
              >
                <span className="rounded-xl bg-emerald-100 p-2 text-emerald-800">
                  <ApplicationLogo className="block h-7 w-auto fill-current" />
                </span>
                <span>
                  <span className="block text-sm font-semibold tracking-tight text-slate-900">
                    WEBank
                  </span>
                  <span className="block text-xs tracking-wide text-slate-500 uppercase">
                    Secure Area
                  </span>
                </span>
              </Link>

              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href={route("user-dashboard")}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    route().current("user-dashboard")
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href={route("user-transfer")}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    route().current("user-transfer")
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Transfer
                </Link>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              {user && (
                <Link
                  href={route("profile.edit")}
                  className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-right text-sm transition hover:border-slate-300"
                >
                  <div className="font-semibold text-slate-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </Link>
              )}
              <Link
                method="post"
                href={route("logout")}
                as="button"
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
              >
                Log Out
              </Link>
            </div>

            <button
              onClick={() =>
                setShowingNavigationDropdown((previousState) => !previousState)
              }
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/90 p-2 text-slate-600 transition hover:bg-slate-50 md:hidden"
              aria-label="Toggle mobile menu"
              aria-expanded={showingNavigationDropdown}
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  className={
                    !showingNavigationDropdown ? "inline-flex" : "hidden"
                  }
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  className={
                    showingNavigationDropdown ? "inline-flex" : "hidden"
                  }
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <Transition show={showingNavigationDropdown} leave="duration-100">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
          >
            <div className="mx-auto mt-1 w-full max-w-7xl px-4 pb-3 sm:px-6 md:hidden lg:px-8">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-lg">
                <div className="space-y-1 p-2">
                  <div className="space-y-1">
                    <ResponsiveNavLink
                      href={route("user-dashboard")}
                      active={route().current("user-dashboard")}
                      onClick={() => setShowingNavigationDropdown(false)}
                    >
                      <div className="flex gap-3">
                        <i className="bi bi-bank2"></i>
                        <p>Dashboard</p>
                      </div>
                    </ResponsiveNavLink>

                    <ResponsiveNavLink
                      href={route("user-transfer")}
                      active={route().current("user-transfer")}
                      onClick={() => setShowingNavigationDropdown(false)}
                    >
                      <div className="flex gap-3">
                        <i className="bi bi-arrow-repeat"></i>
                        <p>Transfer</p>
                      </div>
                    </ResponsiveNavLink>
                  </div>

                  <div className="border-t border-slate-200 pt-1">
                    {user && (
                      <>
                        <ResponsiveNavLink
                          href={route("profile.edit")}
                          active={route().current("profile.edit")}
                          onClick={() => setShowingNavigationDropdown(false)}
                        >
                          <div className="flex gap-3">
                            <i className="bi bi-person"></i>
                            <p>
                              {user.name} {user.email}
                            </p>
                          </div>
                        </ResponsiveNavLink>
                        <div className="border-t border-slate-200" />
                        <ResponsiveNavLink
                          className="text-rose-600 hover:text-rose-700"
                          method="post"
                          href={route("logout")}
                          as="button"
                          onClick={() => setShowingNavigationDropdown(false)}
                        >
                          <div className="flex gap-3">
                            <i className="bi bi-box-arrow-right"></i>
                            <p>Log Out</p>
                          </div>
                        </ResponsiveNavLink>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TransitionChild>
        </Transition>
      </nav>

      {showingNavigationDropdown && (
        <div
          className="fixed inset-0 z-40 bg-slate-700/30 transition-opacity duration-300 md:hidden"
          onClick={() => {
            setShowingNavigationDropdown(false);
          }}
        />
      )}

      <main className="flex-1 overflow-auto pt-5">
        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <AiOperatorChat />

      <Footer />
    </div>
  );
}
