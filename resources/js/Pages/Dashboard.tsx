import SidebarMenu from '@/Components/Sidebar/SidebarMenu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card } from '@/types';
import { Head } from '@inertiajs/react';

export default function Dashboard({ userData = [] as Card[] }) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">
          Dashboard
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="flex overflow-hidden rounded p-2 shadow">
                <SidebarMenu />
                <div className="text-muted">Головна картка</div>
                <ul>
                  {userData.map((item) => (
                    // The 'key' prop is important for performance and identifying elements
                    <li key={item.id}>{item.number}</li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
