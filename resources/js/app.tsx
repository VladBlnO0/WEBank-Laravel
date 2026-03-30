import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import "bootstrap-icons/font/bootstrap-icons.css";
import AuthenticatedLayout from "./Layouts/AuthenticatedLayout";
import GuestLayout from "./Layouts/GuestLayout";
const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  layout: (name) => {
    switch (true) {
      case name === "welcome" || name === "faq":
        return null;
      case name.startsWith("Auth/"):
        return GuestLayout;
      case name.startsWith("Profile/"):
        return [AuthenticatedLayout];
      case name.startsWith("User/"):
        return [AuthenticatedLayout];
      default:
        return AuthenticatedLayout;
    }
  },
  progress: {
    color: "#4B5563",
  },
});
