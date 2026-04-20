import InputError from "@/components/input-error";
import InputLabel from "@/components/input-label";
import PrimaryButton from "@/components/primary-button";
import TextInput from "@/components/text-input";
import { Head, useForm } from "@inertiajs/react";
import { SubmitEventHandler } from "react";

export default function ResetPassword({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: "",
    password_confirmation: "",
  });

  const submit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    post(route("password.store"), {
      onFinish: () => reset("password", "password_confirmation"),
    });
  };

  return (
    <>
      <Head title="Reset Password" />

      <form onSubmit={submit}>
        <div>
          <InputLabel htmlFor="email" value="Email" />

          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="username"
            onChange={(e: { target: { value: string } }) =>
              setData("email", e.target.value)
            }
            ref={undefined}
          />

          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password" value="Password" />

          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="new-password"
            isFocused={true}
            onChange={(e: { target: { value: string } }) =>
              setData("password", e.target.value)
            }
            ref={undefined}
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel
            htmlFor="password_confirmation"
            value="Confirm Password"
          />

          <TextInput
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e: { target: { value: string } }) =>
              setData("password_confirmation", e.target.value)
            }
            ref={undefined}
          />

          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="mt-4 flex items-center justify-end">
          <PrimaryButton className="ms-4" disabled={processing}>
            Reset Password
          </PrimaryButton>
        </div>
      </form>
    </>
  );
}
ResetPassword.layout = {
  breadcrumbs: [
    {
      title: "Reset Password",
    },
  ],
};
