import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import AuthenticatedLayout from "./layouts/authenticated-layout";
import GuestLayout from "./layouts/guest-layout";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob("./pages/**/*.tsx"),
    ),
  layout: (name) => {
    switch (true) {
      case name === "faq":
        return null;
      case name.startsWith("auth/"):
        return GuestLayout;
      case name.startsWith("profile/"):
        return [AuthenticatedLayout];
      case name.startsWith("user/"):
        return [AuthenticatedLayout];
    }
  },
  progress: {
    // The color of the progress bar...
    color: "#29d",
    // Whether to include the default NProgress styles...
    includeCSS: true,
    // Whether the NProgress spinner will be shown...
    showSpinner: true,
  },
});
