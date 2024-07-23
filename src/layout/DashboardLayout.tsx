import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSideBar from '../components/Dashboard/DashboardSideBar/DashboardSideBar';
import DashboardNavbar from '../components/Dashboard/DashboardNavbar/DashboardNavbar';

const DashboardLayout: React.FC = () => {
  const [openNav, setOpenNav] = useState(false);

  return (
    <div className="h-screen flex w-full" data-testid="dashboard-layout">
      <DashboardSideBar setOpenNav={setOpenNav} openNav={openNav} />
      <div className="overflow-scroll w-full ">
        <DashboardNavbar setOpenNav={setOpenNav} />
        <main className="flex-grow overflow-auto" data-testid="outlet">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
