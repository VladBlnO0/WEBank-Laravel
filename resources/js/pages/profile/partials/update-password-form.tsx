import InputError from "@/components/input-error";
import InputLabel from "@/components/input-label";
import PrimaryButton from "@/components/primary-button";
import TextInput from "@/components/text-input";
import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { SubmitEventHandler, useRef } from "react";

export default function UpdatePasswordForm({
  className = "",
}: {
  className?: string;
}) {
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const currentPasswordInputRef = useRef<HTMLInputElement>(null);

  const { data, setData, errors, put, reset, processing, recentlySuccessful } =
    useForm({
      current_password: "",
      password: "",
      password_confirmation: "",
    });

  const updatePassword: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset("password", "password_confirmation");
          passwordInputRef.current?.focus();
        }

        if (errors.current_password) {
          reset("current_password");
          currentPasswordInputRef.current?.focus();
        }
      },
    });
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">Update Password</h2>

        <p className="mt-1 text-sm text-gray-600">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </header>

      <form onSubmit={updatePassword} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="current_password" value="Current Password" />

          <TextInput
            id="current_password"
            ref={currentPasswordInputRef}
            value={data.current_password}
            onChange={(e: { target: { value: string } }) =>
              setData("current_password", e.target.value)
            }
            type="password"
            className="mt-1 block w-full"
            autoComplete="current-password"
          />

          <InputError message={errors.current_password} className="mt-2" />
        </div>

        <div>
          <InputLabel htmlFor="password" value="New Password" />

          <TextInput
            id="password"
            ref={passwordInputRef}
            value={data.password}
            onChange={(e: { target: { value: string } }) =>
              setData("password", e.target.value)
            }
            type="password"
            className="mt-1 block w-full"
            autoComplete="new-password"
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div>
          <InputLabel
            htmlFor="password_confirmation"
            value="Confirm Password"
          />

          <TextInput
            id="password_confirmation"
            value={data.password_confirmation}
            onChange={(e: { target: { value: string } }) =>
              setData("password_confirmation", e.target.value)
            }
            type="password"
            className="mt-1 block w-full"
            autoComplete="new-password"
            ref={undefined}
          />

          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing}>Save</PrimaryButton>

          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-gray-600">Saved.</p>
          </Transition>
        </div>
      </form>
    </section>
  );
}
