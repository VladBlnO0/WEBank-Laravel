import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 ">
      <div>
        <Link href="/">
          <ApplicationLogo className="h-20 w-20 fill-current text-blue-400" />
        </Link>
      </div>

      <div className="mt-6 w-full overflow-hidden bg-white px-8 py-8 shadow-md sm:max-w-md sm:rounded-sm ">
        {children}
      </div>
    </div>
  );
}
