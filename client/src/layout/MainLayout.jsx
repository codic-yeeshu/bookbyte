import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileTabbar from '../components/MobileTabbar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-bg pb-[calc(68px+env(safe-area-inset-bottom))] text-ink lg:pb-0">
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <Footer />
      <MobileTabbar />
    </div>
  );
};

export default MainLayout;
