import InputError from "@/components/input-error";
import InputLabel from "@/components/input-label";
import PrimaryButton from "@/components/primary-button";
import TextInput from "@/components/text-input";
import { Head, useForm } from "@inertiajs/react";
import { SubmitEventHandler } from "react";

export default function TwoFactorChallenge({
  status,
}: {
  status?: string;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    code: "",
  });

  const submit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    post(route("login.challenge.store"), {
      onFinish: () => reset("code"),
    });
  };

  return (
    <>
      <Head title="Login code" />

      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold text-slate-900">Check your email</h1>
        <p className="mt-2 text-sm text-slate-600">
          We sent a one-time login code to your email address. Enter it below to continue.
        </p>

        {status && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {status}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <InputLabel htmlFor="code" value="Login code" />
            <TextInput
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              className="mt-1 block w-full"
              value={data.code}
              onChange={(event) => setData("code", event.target.value)}
              ref={undefined}
            />
            <InputError className="mt-2" message={errors.code} />
          </div>

          <div className="flex items-center justify-end gap-3">
            <PrimaryButton disabled={processing} type="submit">
              Verify code
            </PrimaryButton>
          </div>
        </form>
      </div>
    </>
  );
}

TwoFactorChallenge.layout = {
  breadcrumbs: [
    {
      title: "Login code",
    },
  ],
};