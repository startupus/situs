import React, { useState } from 'react';
import SitusSidebar from '../Sidebar/SitusSidebar';
import SitusHeader from '../Header/SitusHeader';
import { Outlet } from 'react-router-dom';

interface SitusMainLayoutProps {}

const SitusMainLayout: React.FC<SitusMainLayoutProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <>
      <div className="relative flex min-h-screen w-full items-start">
        <SitusSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="w-full xl:pl-[90px]">
          <SitusHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          <div className="px-6 pt-6 pb-6">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default SitusMainLayout;
