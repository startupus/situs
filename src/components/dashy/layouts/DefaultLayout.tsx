import { useState } from 'react';
// import Sidebar from '../components/Sidebar/index.jsx';
// import DarkModeToggle from '../components/DarkModeToggle.jsx';
// import Header from '../components/Header/index.jsx';
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <div className="relative flex items-start w-full min-h-screen">
        <div>Sidebar</div>

        <div className="w-full xl:pl-[300px]">
          <div>Header</div>

          <div className="p-[30px]">
            <Outlet />
          </div>
        </div>
      </div>

      <div>DarkModeToggle</div>
    </>
  );
};

export default DefaultLayout;
