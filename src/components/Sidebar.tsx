import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  Settings,
  MessageSquare,
  Download,
  BarChart3,
  User,
  Shield,
  Menu,
  X,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarItem {
  title: string;
  icon: LucideIcon;
  href: string;
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dasbor",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Laporan",
      icon: FileText,
      href: "/reports",
    },
    {
      title: "Pengguna",
      icon: Users,
      href: "/users",
    },
    {
      title: "Statistik",
      icon: BarChart3,
      href: "/statistics",
    },
    {
      title: "Unduh Laporan",
      icon: Download,
      href: "/download",
    },
    {
      title: "Masukan",
      icon: MessageSquare,
      href: "/feedback",
    },
    {
      title: "Profil",
      icon: User,
      href: "/profile",
    },
    {
      title: "Pengaturan",
      icon: Settings,
      href: "/settings",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const toggleButton = document.getElementById('sidebar-toggle');
      
      if (isOpen && sidebar && !sidebar.contains(event.target as Node) && 
          toggleButton && !toggleButton.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Toggle Button */}
      <Button
        id="sidebar-toggle"
        variant="ghost"
        size="sm"
        className={cn(
          "fixed top-4 left-4 z-50 h-10 w-10 p-0 bg-background border shadow-sm transition-all duration-300",
          "lg:opacity-0 lg:pointer-events-none", // Hide on desktop
          isOpen && "left-[268px]" // Move button when sidebar is open (264px width + 4px padding)
        )}
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        id="sidebar"
        className={cn(
          "fixed left-0 top-0 z-40 flex flex-col h-screen bg-card border-r border-border w-64 transition-all duration-300 ease-in-out",
          // Mobile behavior
          "lg:translate-x-0", // Always visible on desktop
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0" // Toggle on mobile, always visible on desktop
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img 
                src="/favicon.ico" 
                alt="Logo Polda" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-foreground leading-tight">Sistem Informasi</h1>
              <p className="text-sm text-muted-foreground leading-tight">Monitoring Layanan 110</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-4 py-3 text-sm font-medium transition-colors border-r-2 border-transparent",
                    isActive
                      ? "bg-muted text-foreground border-r-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )
                }
                onClick={() => {
                  // Close sidebar on mobile when navigating
                  if (window.innerWidth < 1024) {
                    setIsOpen(false);
                  }
                }}
              >
                <Icon className="mr-3 h-5 w-5" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Spacer for desktop layout */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
};

export default Sidebar;