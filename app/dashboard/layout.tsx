import React from 'react';
import SideBar from '../components/SideBar';
import Navbar from '../navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}


const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div>
      {/* <Navbar />
      <SideBar /> */}
      <main className='w-screen lg:w-screen h-screen lg:h-screen pt-24 px-4 md:px-12 lg:px-24 mb-20'>
        {children}
      </main>
    </div>

  );
};

export default DashboardLayout;
