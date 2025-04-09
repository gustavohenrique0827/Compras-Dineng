
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
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel
} from '@/components/ui/sidebar';

const navItems = [
  { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
  { to: '/request/new', icon: <FilePlus size={20} />, label: 'Nova Solicitação' },
  { to: '/requests', icon: <FileSearch size={20} />, label: 'Solicitações' },
  { to: '/purchases', icon: <FileText size={20} />, label: 'Cotações' },
  { to: '/suppliers', icon: <Users size={20} />, label: 'Fornecedores' },
  { to: '/reports', icon: <BarChart3 size={20} />, label: 'Relatórios' },
  { to: '/settings', icon: <Settings size={20} />, label: 'Configurações' }
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.includes(path);
  };
  
  const handleNavItemClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };
  
  if (isMobile) {
    return (
      <>
        {/* Mobile header with menu button handled by TopBar */}
        
        {/* Mobile slide-out menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-background z-40 pt-16 animate-fadeIn">
            <div className="p-3">
              <div className="flex items-center gap-3 px-6 py-5">
                <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center text-primary-foreground font-bold">
                  D
                </div>
                <h1 className="text-xl font-bold">Dineng Compras</h1>
              </div>
              
              <div className="px-3 space-y-1 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      isActive(item.to) 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-secondary"
                    )}
                    onClick={handleNavItemClick}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center text-primary-foreground font-bold">
            D
          </div>
          <h1 className="text-xl font-bold">Dineng Compras</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroupLabel>Navegação</SidebarGroupLabel>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton 
                asChild 
                isActive={isActive(item.to)}
                tooltip={item.label}
              >
                <Link to={item.to}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground">
          Dineng Compras © {new Date().getFullYear()}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Navbar;
