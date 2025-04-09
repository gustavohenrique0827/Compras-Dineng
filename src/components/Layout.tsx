
import React from 'react';
import Navbar from './Navbar';
import TopBar from './TopBar';
import { SidebarProvider } from './ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Navbar />
        <div className="flex flex-col flex-1">
          <TopBar />
          <main className="flex-1 p-4 pt-20 md:ml-64 transition-all duration-300 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
