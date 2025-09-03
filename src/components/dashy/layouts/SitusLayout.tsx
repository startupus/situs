import { useState } from 'react';
import Sidebar from '../Sidebar';
import DarkModeToggle from '../DarkModeToggle';
import Header from '../Header/index';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../../hooks/useTheme';

const SitusLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { resolvedTheme } = useTheme();

  return (
    <>
      <div className={`relative flex items-start w-full min-h-screen ${resolvedTheme === 'dark' ? 'dark' : ''}`}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="w-full xl:pl-[300px]">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <div className="p-[30px]">
            <Outlet />
          </div>
        </div>
      </div>

      <DarkModeToggle />
    </>
  );
};

export default SitusLayout;
