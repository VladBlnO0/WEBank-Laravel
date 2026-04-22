import { useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import axios from "axios";

export default function TwoFactorAuthenticationForm({ className = "" }: { className?: string }) {
  const user = usePage().props.auth.user as any;

  const [enabling, setEnabling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
    code: "",
  });

  // Check if 2FA is fully enabled and confirmed
  const isEnabled = user?.two_factor_confirmed_at !== null && user?.two_factor_confirmed_at !== undefined;

  const enableTwoFactorAuthentication = () => {
    setEnabling(true);
    // Fortify endpoint to initialize 2FA
    router.post(
      "/user/two-factor-authentication",
      {},
      {
        preserveScroll: true,
        onSuccess: () => Promise.all([showQrCode()]),
        onFinish: () => setEnabling(false),
      }
    );
  };

  const showQrCode = () => {
    // Fortify returns the QR code as a raw SVG string inside a JSON response
    return axios.get("/user/two-factor-qr-code").then((response) => {
      setQrCode(response.data.svg);
    });
  };

  const confirmTwoFactorAuthentication = (e: React.FormEvent) => {
    e.preventDefault();
    // Fortify endpoint to confirm the code from the Authenticator App
    post("/user/confirmed-two-factor-authentication", {
      preserveScroll: true,
      onSuccess: () => {
        setQrCode(null);
        reset("code");
      },
    });
  };

  const disableTwoFactorAuthentication = () => {
    // Fortify endpoint to turn off 2FA
    router.delete("/user/two-factor-authentication", {
      preserveScroll: true,
      onSuccess: () => setQrCode(null),
    });
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add additional security to your account using two-factor authentication.
        </p>
      </header>

      <div className="mt-6">
        {!isEnabled && !qrCode && (
          <button
            onClick={enableTwoFactorAuthentication}
            disabled={enabling}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
          >
            Enable 2FA
          </button>
        )}

        {/* Step 2: Show QR Code and ask for confirmation */}
        {qrCode && !isEnabled && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 font-medium mb-4">
              To finish enabling two-factor authentication, scan the following QR code using your phone's authenticator application (like Google Authenticator or Authy) and provide the generated OTP code.
            </p>

            {/* Render the SVG securely */}
            <div
              className="p-2 inline-block bg-white"
              dangerouslySetInnerHTML={{ __html: qrCode }}
            />

            <form onSubmit={confirmTwoFactorAuthentication} className="mt-4 flex flex-col gap-4 max-w-xs">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Confirmation Code
                </label>
                <input
                  id="code"
                  type="text"
                  name="code"
                  value={data.code}
                  onChange={(e) => setData("code", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  autoFocus
                />
                {errors.code && <span className="text-sm text-red-600 mt-1">{errors.code}</span>}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={disableTwoFactorAuthentication}
                  className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Fully Enabled State */}
        {isEnabled && (
          <div>
            <div className="rounded-md bg-green-50 p-4 mb-4 border border-green-200">
              <p className="text-sm font-medium text-green-800">
                You have enabled two-factor authentication.
              </p>
            </div>
            <button
              onClick={disableTwoFactorAuthentication}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            >
              Disable 2FA
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
