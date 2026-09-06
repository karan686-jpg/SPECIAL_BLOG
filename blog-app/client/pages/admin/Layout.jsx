import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../../src/components/Navbar'
import Sidebar from '../../src/components/admin/Sidebar'
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#090d16] text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="w-20 md:w-56 lg:w-64 bg-white dark:bg-[#0c0e17] border-r border-gray-200/80 dark:border-gray-800/80 p-3 sm:p-4 shrink-0 transition-colors">
          <Sidebar />
        </aside>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
