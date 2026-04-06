import { AiOperatorChat } from "@/components/ai-operator-chat";
import ApplicationLogo from "@/components/application-logo";
import Footer from "@/components/footer";
import ResponsiveNavLink from "@/components/responsive-nav-link";
import type { User } from "@/types";
import { Transition, TransitionChild } from "@headlessui/react";
import { Link, usePage } from "@inertiajs/react";
import { Bell } from "lucide-react";
import { PropsWithChildren, ReactNode, useState } from "react";
import { useRoute } from "ziggy-js";

export default function Authenticated({
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  const user = (usePage().props.auth?.user as User) ?? null;
  const notificationCount =
    Math.min(usePage().props.auth?.notificationCount as number, 9) ?? null;

  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);
  const route = useRoute();

  return (
    <div className="flex min-h-screen flex-col bg-mauve-100">
      <nav className="sticky top-0 z-50 bg-white shadow-[0_8px_24px_-18px_rgba(15,23,42,0.5)] backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-2xl px-2 py-1">
                <span className="rounded-xl bg-emerald-100 p-2 text-emerald-800">
                  <ApplicationLogo className="block h-7 w-auto fill-current" />
                </span>
                <span>
                  <p className="block text-sm font-semibold tracking-tight text-slate-900">
                    WEBank
                  </p>
                </span>
              </div>

              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href={route("user.dashboard.index")}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    route().current("user.dashboard.index")
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href={route("user.transfer.index")}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    route().current("user.transfer.index")
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Transfer
                </Link>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              {notificationCount > 0 && (
                <Link
                  className="relative py-2 pr-2 text-lg text-gray-500"
                  href={route("notification.index")}
                >
                  <Bell />
                  <div
                    v-if="notificationCount"
                    className="absolute top-0 right-0 h-5 w-5 rounded-full border border-white bg-red-700 text-center text-xs font-medium text-white dark:border-gray-900 dark:bg-red-400"
                  >
                    {notificationCount}
                  </div>
                </Link>
              )}
              {user && (
                <Link
                  href={route("profile.edit")}
                  className={`rounded-xl px-4 py-2 text-sm transition ${
                    route().current("profile.edit")
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {user.email}
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
      </nav>
      <div className="md:hidden">
        <Transition show={showingNavigationDropdown} leave="duration-200">
          <TransitionChild
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-x-0 top-18 z-50 md:hidden">
              <div className="mx-auto w-full max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden border border-slate-200 bg-white shadow-lg">
                  <ResponsiveNavLink
                    href={route("user.dashboard.index")}
                    active={route().current("user.dashboard.index")}
                    onClick={() => setShowingNavigationDropdown(false)}
                  >
                    <div className="flex gap-3">
                      <i className="bi bi-bank2"></i>
                      <p>Dashboard</p>
                    </div>
                  </ResponsiveNavLink>
                  <ResponsiveNavLink
                    href={route("user.transfer.index")}
                    active={route().current("user.transfer.index")}
                    onClick={() => setShowingNavigationDropdown(false)}
                  >
                    <div className="flex gap-3">
                      <i className="bi bi-arrow-repeat"></i>
                      <p>Transfer</p>
                    </div>
                  </ResponsiveNavLink>
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
                            <p>{user.email}</p>
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
      </div>
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
