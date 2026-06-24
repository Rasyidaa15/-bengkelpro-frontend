import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarUser from '../components/common/SidebarUser';

const UserLayout = () => {
  const [active, setActive] = useState('dashboard');
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    setActive(path || 'dashboard');
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SidebarUser active={active} onNavigate={setActive} />
      <div className="ml-16 md:ml-64 min-h-screen">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">{active}</h2>
        </div>
        <div className="p-4 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;