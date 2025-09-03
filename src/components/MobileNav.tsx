
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  MessageSquare,
  Download,
  BarChart3,
  Menu,
  X,
  Plus,
  UserPlus,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
    },
    {
      title: "Laporan",
      icon: FileText,
      href: "/reports",
    },
    {
      title: "Tambah Laporan",
      icon: Plus,
      href: "/add-report",
    },
    {
      title: "Pengguna",
      icon: Users,
      href: "/users",
    },
    {
      title: "Tambah Pengguna",
      icon: UserPlus,
      href: "/add-user",
    },
    {
      title: "Kelola Pengguna",
      icon: Shield,
      href: "/manage-users",
    },
    {
      title: "Statistik",
      icon: BarChart3,
      href: "/statistics",
    },
    {
      title: "Feedback",
      icon: MessageSquare,
      href: "/feedback",
    },
    {
      title: "Unduh",
      icon: Download,
      href: "/download",
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

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-background border border-border shadow-md text-foreground hover:bg-muted"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-card border-border">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-foreground">SIMOLA 110</h1>
                    <p className="text-xs text-muted-foreground">Sistem Informasi</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted",
                        isActive && "bg-muted text-foreground font-medium"
                      )
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <div className="text-xs text-muted-foreground text-center">
                SIMOLA 110 v1.0.0
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
