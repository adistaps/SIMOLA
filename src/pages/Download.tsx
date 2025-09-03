
import { useState } from "react";
import { Download as DownloadIcon, FileText, Calendar, Users } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { toast } from "@/hooks/use-toast";
import { useReports } from "@/hooks/useReports";
import { useProfiles } from "@/hooks/useProfiles";
import { DateRange } from "react-day-picker";
import MobileNav from "@/components/MobileNav";

const Download = () => {
  const [reportType, setReportType] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: reports = [] } = useReports();
  const { data: profiles = [] } = useProfiles();

  const downloadCSV = (data: any[], filename: string, headers: string[]) => {
    try {
      // Create CSV content
      const csvHeaders = headers.join(',');
      const csvRows = data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape quotes and wrap in quotes if contains comma
          const stringValue = String(value).replace(/"/g, '""');
          return stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"') 
            ? `"${stringValue}"` 
            : stringValue;
        }).join(',')
      );
      
      const csvContent = [csvHeaders, ...csvRows].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Berhasil",
        description: `File ${filename}.csv telah diunduh`,
      });
    } catch (error) {
      console.error('Error generating CSV:', error);
      toast({
        title: "Error",
        description: "Gagal mengunduh file CSV",
        variant: "destructive",
      });
    }
  };

  const generateReport = async () => {
    if (!reportType) {
      toast({
        title: "Error",
        description: "Silakan pilih jenis laporan",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      if (reportType === "reports") {
        let filteredReports = [...reports];

        // Filter by date range
        if (dateRange?.from && dateRange?.to) {
          filteredReports = filteredReports.filter(report => {
            const reportDate = new Date(report.created_at);
            return reportDate >= dateRange.from! && reportDate <= dateRange.to!;
          });
        }

        // Filter by status
        if (statusFilter !== "all") {
          filteredReports = filteredReports.filter(report => report.status === statusFilter);
        }

        if (filteredReports.length === 0) {
          toast({
            title: "Tidak Ada Data",
            description: "Tidak ada laporan yang sesuai dengan filter yang dipilih",
            variant: "destructive",
          });
          return;
        }

        // Prepare data for CSV
        const csvData = filteredReports.map(report => ({
          'Nomor Laporan': report.nomor_laporan,
          'Judul': report.judul,
          'Kategori': report.kategori,
          'Status': report.status,
          'Prioritas': report.prioritas,
          'Lokasi': report.lokasi,
          'Deskripsi': report.deskripsi || '',
          'Pelapor': report.pelapor_nama,
          'Telepon Pelapor': report.pelapor_telepon || '',
          'Email Pelapor': report.pelapor_email || '',
          'Petugas': report.petugas_nama || '',
          'Polres': report.petugas_polres || '',
          'HP Petugas': report.petugas_hp || '',
          'Tanggal Laporan': new Date(report.tanggal_laporan || report.created_at).toLocaleDateString('id-ID'),
          'Tanggal Dibuat': new Date(report.created_at).toLocaleDateString('id-ID'),
          'Catatan Petugas': report.catatan_petugas || ''
        }));

        const headers = [
          'Nomor Laporan', 'Judul', 'Kategori', 'Status', 'Prioritas', 'Lokasi', 
          'Deskripsi', 'Pelapor', 'Telepon Pelapor', 'Email Pelapor', 
          'Petugas', 'Polres', 'HP Petugas', 'Tanggal Laporan', 'Tanggal Dibuat', 'Catatan Petugas'
        ];

        const filename = `laporan_${new Date().toISOString().split('T')[0]}`;
        downloadCSV(csvData, filename, headers);

      } else if (reportType === "users") {
        if (profiles.length === 0) {
          toast({
            title: "Tidak Ada Data",
            description: "Tidak ada data pengguna untuk diunduh",
            variant: "destructive",
          });
          return;
        }

        // Prepare data for CSV
        const csvData = profiles.map(profile => ({
          'Nama': profile.nama,
          'Email': profile.email,
          'Role': profile.role,
          'Nomor Telepon': profile.nomor_telepon || '',
          'Unit Kerja': profile.unit_kerja || '',
          'Tanggal Dibuat': new Date(profile.created_at).toLocaleDateString('id-ID'),
          'Terakhir Update': new Date(profile.updated_at).toLocaleDateString('id-ID')
        }));

        const headers = ['Nama', 'Email', 'Role', 'Nomor Telepon', 'Unit Kerja', 'Tanggal Dibuat', 'Terakhir Update'];
        const filename = `pengguna_${new Date().toISOString().split('T')[0]}`;
        downloadCSV(csvData, filename, headers);
      }

    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Gagal membuat laporan",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <MobileNav />
      
      <div className="flex-1">
        <Header title="" />
        
        <main className="p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Unduh Laporan</h1>
            <p className="text-muted-foreground mt-2">Generate dan unduh laporan dalam format CSV</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Configuration */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5" />
                  Konfigurasi Laporan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reportType" className="text-foreground">Jenis Laporan</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="mt-2 bg-background border-border">
                      <SelectValue placeholder="Pilih jenis laporan" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="reports">Laporan Kejadian</SelectItem>
                      <SelectItem value="users">Data Pengguna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {reportType === "reports" && (
                  <>
                    <div>
                      <Label className="text-foreground">Rentang Tanggal</Label>
                      <div className="mt-2">
                        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="statusFilter" className="text-foreground">Filter Status</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="mt-2 bg-background border-border">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="menunggu">Menunggu</SelectItem>
                          <SelectItem value="diproses">Diproses</SelectItem>
                          <SelectItem value="selesai">Selesai</SelectItem>
                          <SelectItem value="ditolak">Ditolak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Button 
                  onClick={generateReport} 
                  disabled={isGenerating || !reportType}
                  className="w-full"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  {isGenerating ? "Mengunduh..." : "Unduh CSV"}
                </Button>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Statistik Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-foreground">Total Laporan</span>
                    </div>
                    <span className="font-semibold text-foreground">{reports.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-foreground">Total Pengguna</span>
                    </div>
                    <span className="font-semibold text-foreground">{profiles.length}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-foreground">Laporan Hari Ini</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {reports.filter(report => {
                        const today = new Date();
                        const reportDate = new Date(report.created_at);
                        return reportDate.toDateString() === today.toDateString();
                      }).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Format Information */}
          <Card className="mt-6 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Informasi Format</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Format CSV</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• File dapat dibuka dengan Excel atau Google Sheets</li>
                    <li>• Data dipisahkan dengan koma (,)</li>
                    <li>• Encoding UTF-8 untuk karakter Indonesia</li>
                    <li>• Header kolom dalam bahasa Indonesia</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Kolom Laporan Kejadian</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Nomor laporan, judul, kategori, status</li>
                    <li>• Data pelapor (nama, telepon, email)</li>
                    <li>• Data petugas dan lokasi kejadian</li>
                    <li>• Tanggal laporan dan catatan petugas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Download;
