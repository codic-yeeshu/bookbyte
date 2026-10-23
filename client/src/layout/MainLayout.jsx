import React from 'react';
import { clsx } from 'clsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileTabbar from '../components/MobileTabbar';
import { MobileChromeProvider, useMobileChromeState } from '../context/MobileChromeContext';

const Shell = ({ children }) => {
  const { hideTabbar } = useMobileChromeState();
  return (
    <div className={clsx('flex min-h-screen flex-col bg-bg text-ink lg:pb-0', !hideTabbar && 'pb-[calc(68px+env(safe-area-inset-bottom))]')}>
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <Footer />
      <MobileTabbar />
    </div>
  );
};

const MainLayout = ({ children }) => (
  <MobileChromeProvider>
    <Shell>{children}</Shell>
  </MobileChromeProvider>
);

export default MainLayout;
