import { useState, useEffect } from "react";
import { Bell, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useReports } from "@/hooks/useReports";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate();
  const { user: authUser, signOut } = useAuth();
  const { data: reports = [] } = useReports();
  const [user, setUser] = useState<any>(null);

  // Get recent reports for notifications (last 3 reports with status 'menunggu')
  const recentReports = reports
    .filter(report => report.status === 'menunggu')
    .slice(0, 3);

  const notificationCount = recentReports.length;

  useEffect(() => {
    // Get current user profile data
    const getCurrentUser = async () => {
      if (authUser) {
        // Get profile data from database
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        
        setUser({ ...authUser, profile });
      }
    };

    getCurrentUser();
  }, [authUser]);

  const handleNotificationClick = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout Berhasil",
        description: "Anda telah berhasil logout dari sistem",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal logout: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="h-16 bg-card border-b border-border px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        {/* Title for Mobile */}
        <div className="block lg:hidden">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Title for Desktop */}
        <div className="hidden lg:block mr-4">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        </div>

        {/* Smart Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-muted">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-card border-border">
            <div className="p-3 border-b border-border">
              <h3 className="font-semibold text-foreground">Notifikasi</h3>
              <p className="text-sm text-muted-foreground">
                {notificationCount > 0 ? `${notificationCount} laporan menunggu` : 'Tidak ada notifikasi baru'}
              </p>
            </div>
            {recentReports.length === 0 ? (
              <div className="p-3 text-center text-muted-foreground">
                Tidak ada notifikasi baru
              </div>
            ) : (
              recentReports.map((report) => (
                <DropdownMenuItem 
                  key={report.id} 
                  className="p-3 border-b border-border cursor-pointer text-foreground hover:bg-muted"
                  onClick={() => handleNotificationClick(report.id)}
                >
                  <div className="flex flex-col space-y-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Laporan Baru</span>
                      <Badge className="text-xs bg-yellow-500 hover:bg-yellow-600">
                        Menunggu
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.judul}</p>
                    <p className="text-sm text-muted-foreground">{report.lokasi}</p>
                    <p className="text-xs text-muted-foreground/70">
                      {new Date(report.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            <div className="p-2">
              <Button 
                variant="ghost" 
                className="w-full text-sm text-foreground hover:bg-muted"
                onClick={() => navigate('/reports')}
              >
                Lihat Semua Laporan
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted text-foreground">
                  {user?.profile?.nama ? user.profile.nama.charAt(0).toUpperCase() : 
                   user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {user?.profile?.nama || user?.email?.split('@')[0] || "User"}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.profile?.role || "petugas"}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border-border">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">
                {user?.profile?.nama || user?.email?.split('@')[0] || "User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.email || "No email"}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => navigate("/profile")}
              className="text-foreground hover:bg-muted"
            >
              <User className="h-4 w-4 mr-2" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate("/settings")}
              className="text-foreground hover:bg-muted"
            >
              <Settings className="h-4 w-4 mr-2" />
              Pengaturan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;