import ApplicationLogo from "@/components/application-logo";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
      <div>
        <ApplicationLogo className="h-20 w-20 fill-current text-green-500" />
      </div>

      <div className="mt-6 w-full overflow-hidden bg-white px-8 py-8 shadow-md sm:max-w-md sm:rounded-sm">
        {children}
      </div>
    </div>
  );
}
