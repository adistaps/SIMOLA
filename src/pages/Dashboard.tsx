
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, AlertTriangle, FileText, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Header from "@/components/Header";
import { useReportsStats, useReports } from "@/hooks/useReports";
import { useProfilesStats } from "@/hooks/useProfiles";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: reportsStats } = useReportsStats();
  const { data: reports } = useReports();
  const { data: profilesStats } = useProfilesStats();

  const mainStats = [
    {
      title: "Total Laporan Hari Ini",
      value: reportsStats?.todayReports?.toString() || "0",
      change: "Data real-time",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Laporan Darurat",
      value: reportsStats?.emergency?.toString() || "0",
      change: "Perlu perhatian",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Total Petugas",
      value: profilesStats?.total?.toString() || "0",
      change: "Terdaftar",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Laporan Selesai",
      value: reportsStats?.byStatus.selesai?.toString() || "0",
      change: "Total diselesaikan",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
  ];

  // Get recent 3 reports
  const recentActivities = reports?.slice(0, 3).map(report => ({
    title: `${report.judul}`,
    id: report.id,
    reportId: report.id,
    time: new Date(report.created_at).toLocaleString('id-ID'),
    status: report.status === 'menunggu' ? 'Menunggu' : 
           report.status === 'diproses' ? 'Diproses' :
           report.status === 'selesai' ? 'Selesai' : 'Ditolak',
    location: report.lokasi
  })) || [];

  const todayOverview = [
    { label: "Laporan Masuk", value: reportsStats?.todayReports?.toString() || "0", icon: FileText },
    { label: "Sedang Diproses", value: reportsStats?.byStatus.diproses?.toString() || "0", icon: Clock },
    { label: "Selesai Ditangani", value: reportsStats?.byStatus.selesai?.toString() || "0", icon: CheckCircle },
    { label: "Menunggu", value: reportsStats?.byStatus.menunggu?.toString() || "0", icon: TrendingUp },
  ];

  const handleActivityClick = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Diproses": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Selesai": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Ditolak": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <MobileNav />
      
      <div className="flex-1">
        <Header title="" />
        
        <main className="p-4 lg:p-6 space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-primary-foreground">
            <h1 className="text-2xl font-bold mb-2">Selamat Datang di SIMOLA 110</h1>
            <p className="text-primary-foreground/80">Sistem Informasi Monitoring Laporan - POLDA Daerah Istimewa Yogyakarta</p>
            <div className="mt-4 text-sm">
              <span className="bg-primary-foreground/20 px-3 py-1 rounded-full">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Main Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                      </div>
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Today's Overview */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Ringkasan Hari Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {todayOverview.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                      <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold text-foreground">{item.value}</p>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Belum ada laporan yang masuk</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-background border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleActivityClick(activity.reportId)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <div>
                          <p className="font-medium text-foreground">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
