
import React from 'react';
import { Bell, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarTrigger, useSidebar } from './ui/sidebar';

const TopBar = () => {
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  
  return (
    <div className="h-16 bg-background border-b z-10 fixed top-0 right-0 left-0 flex items-center justify-between px-4 md:pl-64 transition-all duration-300">
      <div className="flex items-center">
        {isMobile ? (
          <Button variant="ghost" size="icon" onClick={() => setOpenMobile(true)}>
            <span className="sr-only">Toggle menu</span>
            <span className="h-5 w-5 flex items-center justify-center">
              <Menu className="h-5 w-5" />
            </span>
          </Button>
        ) : (
          <SidebarTrigger className="mr-2" />
        )}
        <h1 className="text-lg font-semibold md:hidden">Dineng Compras</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <Button variant="ghost" size="icon" asChild>
          <a href="/settings">
            <Settings className="h-5 w-5" />
          </a>
        </Button>
        
        <UserMenu />
      </div>
    </div>
  );
};

export default TopBar;
