
import { useState } from "react";
import { BarChart3, TrendingUp, Users, AlertTriangle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useReportsStats } from "@/hooks/useReports";
import { useProfilesStats } from "@/hooks/useProfiles";
import MobileNav from "@/components/MobileNav";

const Statistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("bulan");
  const { data: reportsStats } = useReportsStats();
  const { data: profilesStats } = useProfilesStats();

  // Sample data for charts
  const monthlyData = [
    { name: 'Jan', laporan: 12, selesai: 8 },
    { name: 'Feb', laporan: 19, selesai: 15 },
    { name: 'Mar', laporan: 15, selesai: 12 },
    { name: 'Apr', laporan: 22, selesai: 18 },
    { name: 'Mei', laporan: 18, selesai: 14 },
    { name: 'Jun', laporan: 25, selesai: 20 },
  ];

  const categoryData = [
    { name: 'Kriminal', value: 35, color: 'hsl(var(--primary))' },
    { name: 'Lalu Lintas', value: 25, color: 'hsl(var(--secondary))' },
    { name: 'Darurat', value: 20, color: 'hsl(var(--destructive))' },
    { name: 'Lainnya', value: 20, color: 'hsl(var(--muted))' },
  ];

  const performanceData = [
    { name: 'Sen', waktu: 2.5 },
    { name: 'Sel', waktu: 3.2 },
    { name: 'Rab', waktu: 2.8 },
    { name: 'Kam', waktu: 3.5 },
    { name: 'Jum', waktu: 2.9 },
    { name: 'Sab', waktu: 2.1 },
    { name: 'Min', waktu: 1.8 },
  ];

  const summaryStats = [
    {
      title: "Total Laporan",
      value: reportsStats?.total?.toString() || "0",
      change: "+12%",
      icon: BarChart3,
      trend: "up"
    },
    {
      title: "Tingkat Penyelesaian",
      value: "87%",
      change: "+5%",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Petugas Aktif",
      value: profilesStats?.total?.toString() || "0",
      change: "+2",
      icon: Users,
      trend: "up"
    },
    {
      title: "Rata-rata Respons",
      value: "2.5 jam",
      change: "-15 min",
      icon: AlertTriangle,
      trend: "down"
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <MobileNav />
      
      <div className="flex-1">
        <Header title="" />
        
        <main className="p-4 lg:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Statistik & Analisis</h1>
              <p className="text-muted-foreground">Ringkasan performa dan analisis laporan</p>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40 bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="hari" className="text-foreground">Hari Ini</SelectItem>
                  <SelectItem value="minggu" className="text-foreground">Minggu Ini</SelectItem>
                  <SelectItem value="bulan" className="text-foreground">Bulan Ini</SelectItem>
                  <SelectItem value="tahun" className="text-foreground">Tahun Ini</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                Export Data
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className={`text-xs mt-1 ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change} dari periode sebelumnya
                        </p>
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

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart - Monthly Reports */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Laporan Bulanan</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                      }} 
                    />
                    <Bar dataKey="laporan" fill="hsl(var(--primary))" name="Total Laporan" />
                    <Bar dataKey="selesai" fill="hsl(var(--secondary))" name="Selesai" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart - Category Distribution */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Distribusi Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Waktu Respons Rata-rata (Jam)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="waktu" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Statistics;
