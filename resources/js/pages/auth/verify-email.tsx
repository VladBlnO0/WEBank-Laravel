import PrimaryButton from "@/components/primary-button";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { SubmitEventHandler } from "react";

export default function VerifyEmail({ status }: { status?: string }) {
  const { flash } = usePage().props as any;

  const { post, processing } = useForm({});

  const submit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    post(route("verification.send"));
  };

  return (
    <>
      <Head title="Email Verification" />
      {flash?.status && (
        <p className="mb-4 rounded-md border border-green-200 bg-green-50 p-2 shadow-sm dark:border-green-800 dark:bg-green-900">
          {flash.status}
        </p>
      )}
      <p className="mb-4 text-sm text-gray-600">
        Before getting started, could you verify your email address by clicking
        on the link we just emailed to you?
      </p>
      <p className="mb-4 text-sm text-gray-600">
        If you didn't receive the email, we will gladly send you another.
      </p>
      {status === "verification-link-sent" && (
        <div className="mb-4 text-sm font-medium text-green-600">
          A new verification link has been sent to the email address you
          provided during registration.
        </div>
      )}

      <form onSubmit={submit}>
        <div className="mt-4 flex w-full flex-col items-center justify-between gap-5">
          <PrimaryButton disabled={processing}>
            Resend Verification Email
          </PrimaryButton>

          <Link
            href={route("logout")}
            method="post"
            as="button"
            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Log Out
          </Link>
        </div>
      </form>
    </>
  );
}
VerifyEmail.layout = {
  breadcrumbs: [
    {
      title: "Verify Email",
    },
  ],
};
