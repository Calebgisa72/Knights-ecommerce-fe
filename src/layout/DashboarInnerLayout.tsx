import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboarInnerLayout = () => {
  return (
    <div className="flex flex-col items-start w-full h-full">
      <Outlet />
    </div>
  );
};

export default DashboarInnerLayout;
