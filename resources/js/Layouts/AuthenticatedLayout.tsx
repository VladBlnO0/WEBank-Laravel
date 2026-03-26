import ApplicationLogo from "@/Components/ApplicationLogo";
import Footer from "@/Components/Footer";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import type { User } from "@/types";
import { Transition, TransitionChild } from "@headlessui/react";
import { usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useRef, useState } from "react";
export default function Authenticated({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  const user: User = usePage().props.auth.user;
  const closeTimer = useRef<number | null>(null);

  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <nav
        className="sticky top-0 z-50"
        onMouseEnter={() => {
          if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
          }
        }}
        onMouseLeave={() => {
          closeTimer.current = window.setTimeout(() => {
            setShowingNavigationDropdown(false);
          }, 100);
        }}
      >
        <div className="border-b border-gray-100 bg-white shadow-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex items-center gap-4">
                <ApplicationLogo className="sticky block h-10 w-auto fill-current text-green-700" />
                <NavLink
                  href={route("user-dashboard")}
                  active={route().current("user-dashboard")}
                >
                  <div className="flex gap-3 text-base">
                    <p>Dashboard</p>
                  </div>
                </NavLink>

                <NavLink
                  href={route("user-transfer")}
                  active={route().current("user-transfer")}
                >
                  <div className="flex gap-3 text-base">
                    <p>Transfer</p>
                  </div>
                </NavLink>
              </div>

              <div className="font-sm -me-2 flex items-center text-base text-gray-800">
                <NavLink
                  href={route("profile.edit")}
                  className="mr-2"
                  active={route().current("profile.edit")}
                >
                  <div>{user.name}</div>
                  <div>{user.email}</div>
                </NavLink>
                <button
                  onClick={() =>
                    setShowingNavigationDropdown(
                      (previousState) => !previousState,
                    )
                  }
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
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
          </div>
        </div>
        <Transition show={showingNavigationDropdown} leave="duration-100">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="absolute top-16 right-0 left-0 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div
                className={`${showingNavigationDropdown ? "block" : "hidden"} mt-2 overflow-hidden rounded-md border border-gray-100 bg-white shadow-lg`}
              >
                <div className="mt-3 mb-1 space-y-1">
                  <div className="space-y-1 pt-2 pb-3">
                    <ResponsiveNavLink
                      href={route("user-dashboard")}
                      active={route().current("user-dashboard")}
                    >
                      <div className="flex gap-3">
                        <i className="bi bi-bank2"></i>
                        <p>Dashboard</p>
                      </div>
                    </ResponsiveNavLink>

                    <ResponsiveNavLink
                      href={route("user-transfer")}
                      active={route().current("user-transfer")}
                    >
                      <div className="flex gap-3">
                        <i className="bi bi-arrow-repeat"></i>
                        <p>Transfer</p>
                      </div>
                    </ResponsiveNavLink>
                  </div>

                  <div className="border-t border-gray-200 pb-1">
                    <ResponsiveNavLink
                      href={route("profile.edit")}
                      active={route().current("profile.edit")}
                    >
                      <div className="flex gap-3">
                        <i className="bi bi-person"></i>
                        <p>
                          {user.name} {user.email}
                        </p>
                      </div>
                    </ResponsiveNavLink>
                    <div className="border-t border-gray-300" />
                    <ResponsiveNavLink
                      className="text-red-500 hover:text-red-700"
                      method="post"
                      href={route("logout")}
                      as="button"
                    >
                      <div className="flex gap-3">
                        <i className="bi bi-box-arrow-right"></i>
                        <p>Log Out</p>
                      </div>
                    </ResponsiveNavLink>
                  </div>
                </div>
              </div>
            </div>
          </TransitionChild>
        </Transition>
      </nav>
      {showingNavigationDropdown && (
        <div
          className="fixed inset-0 z-40 bg-gray-500/75 transition-opacity duration-1000"
          onClick={() => {
            setShowingNavigationDropdown(false);
          }}
        />
      )}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
