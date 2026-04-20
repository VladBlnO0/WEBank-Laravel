import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import UpdatePasswordForm from "./partials/update-password-form";
import UpdateProfileInformationForm from "./partials/update-profile-informationForm";

export default function Edit({
  mustVerifyEmail,
  status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
  return (
    <main>
      <meta name="description" content="Edit profile page" />
      <Head title="Profile" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
          <div className="bg-white p-4 shadow ring-1 ring-white/5 transition duration-300 hover:ring-gray-400 sm:rounded-lg sm:p-8">
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              className="max-w-xl"
            />
          </div>

          <div className="bg-white p-4 shadow ring-1 ring-white/5 transition duration-300 hover:ring-gray-400 sm:rounded-lg sm:p-8">
            <UpdatePasswordForm className="max-w-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}

Edit.layout = {
  breadcrumbs: [
    {
      title: "Edit Profile",
    },
  ],
};
