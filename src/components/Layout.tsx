
import React from 'react';
import Navbar from './Navbar';
import TopBar from './TopBar';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex flex flex-col ${!isMobile ? 'ml-64' : 'mt-16'}`}>
        <TopBar />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="container mx-auto max-w-[1200px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
