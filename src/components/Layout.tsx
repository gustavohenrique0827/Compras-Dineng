import React from 'react';
import Navbar from './Navbar';
import TopBar from './TopBar';
import { useIsMobile } from '@/hooks/use-mobile';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const isMobile = useIsMobile();
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-1 flex flex-col ${!isMobile ? 'ml-64' : 'mt-16'}`}>
        <TopBar />
        
        
      </div>
    </div>;
};
export default Layout;