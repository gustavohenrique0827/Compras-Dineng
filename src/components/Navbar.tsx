
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FilePlus, 
  FileSearch, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Bell,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active, onClick }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
        active 
          ? "bg-primary text-primary-foreground" 
          : "text-foreground hover:bg-secondary"
      )}
      onClick={onClick}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleNavItemClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };
  
  const navContent = (
    <>
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center text-primary-foreground font-bold">
          D
        </div>
        <h1 className="text-xl font-bold">Dineng Compras</h1>
      </div>
      
      <div className="px-3 space-y-1">
        <NavItem 
          to="/" 
          icon={<Home size={20} />} 
          label="Dashboard" 
          active={isActive('/')} 
          onClick={handleNavItemClick}
        />
        <NavItem 
          to="/request/new" 
          icon={<FilePlus size={20} />} 
          label="Nova Solicitação" 
          active={isActive('/request/new')} 
          onClick={handleNavItemClick}
        />
        <NavItem 
          to="/requests" 
          icon={<FileSearch size={20} />} 
          label="Solicitações" 
          active={isActive('/requests')} 
          onClick={handleNavItemClick}
        />
        <NavItem 
          to="/purchases" 
          icon={<FileText size={20} />} 
          label="Cotações" 
          active={location.pathname.includes('/purchases')} 
          onClick={handleNavItemClick}
        />
        <NavItem 
          to="/suppliers" 
          icon={<Users size={20} />} 
          label="Fornecedores" 
          active={location.pathname.includes('/suppliers')} 
          onClick={handleNavItemClick}
        />
        <NavItem 
          to="/reports" 
          icon={<BarChart3 size={20} />} 
          label="Relatórios" 
          active={location.pathname.includes('/reports')} 
          onClick={handleNavItemClick}
        />
        <NavItem 
          to="/settings" 
          icon={<Settings size={20} />} 
          label="Configurações" 
          active={location.pathname.includes('/settings')} 
          onClick={handleNavItemClick}
        />
      </div>
    </>
  );
  
  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-md w-7 h-7 flex items-center justify-center text-primary-foreground font-bold">
              D
            </div>
            <h1 className="text-lg font-bold">Dineng</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full bg-secondary">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button 
              className="p-2 rounded-full bg-secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      )}
      
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-64 h-screen bg-card border-r fixed left-0 top-0 overflow-y-auto glass">
          {navContent}
        </div>
      )}
      
      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 bg-background z-40 pt-16 animate-fadeIn">
          <div className="p-3">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
