
import React from 'react';
import { Bell, Sun, Moon } from 'lucide-react';
import UserMenu from './UserMenu';
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";

const TopBar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <div className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex items-center justify-end px-4 w-full">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        
        <Button variant="outline" size="icon" className="rounded-full relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <UserMenu />
      </div>
    </div>
  );
};

export default TopBar;
