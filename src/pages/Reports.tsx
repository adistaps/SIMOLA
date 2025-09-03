// src/pages/Reports.tsx

import { useState } from "react";
import { Eye, FileText, Filter, Plus, Search, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ReportExcelUpload from "@/components/ReportExcelUpload";
import QuickStatusUpdate from "@/components/QuickStatusUpdate";
import MobileNav from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useReports, useDeleteReport } from "@/hooks/useReports";
import { toast } from "@/hooks/use-toast";

const Reports = () => {
  const navigate = useNavigate();
  const { data: reports = [], isLoading, error } = useReports();
  const deleteReportMutation = useDeleteReport();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [categoryFilter, setCategoryFilter] = useState("semua");

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.nomor_laporan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.pelapor_nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.lokasi?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "semua" || report.status === statusFilter;
    const matchesCategory = categoryFilter === "semua" || report.kategori === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      menunggu: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      diproses: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      selesai: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      ditolak: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      rendah: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      sedang: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      tinggi: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      darurat: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[priority] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDeleteReport = async (reportId: string, reportNumber: string) => {
    try {
      await deleteReportMutation.mutateAsync(reportId);
      toast({
        title: "Berhasil",
        description: `Laporan ${reportNumber} berhasil dihapus`,
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus laporan",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background overflow-x-hidden">
        <Sidebar />
        <MobileNav />
        <div className="flex-1">
          <Header title="Laporan" />
          <main className="p-4 lg:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Memuat data laporan...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background overflow-x-hidden">
        <Sidebar />
        <MobileNav />
        <div className="flex-1">
          <Header title="Laporan" />
          <main className="p-4 lg:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-destructive">Error memuat data: {error.message}</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <Sidebar />
      <MobileNav />

      <div className="flex-1">
        <Header title="" />

        <main className="p-3 lg:p-4 max-w-screen-xl w-full mx-auto">
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">Daftar Laporan</h1>
                <p className="text-muted-foreground mt-1 text-sm">Kelola dan pantau semua laporan yang masuk</p>
              </div>
              <Link to="/add-report">
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Laporan
                </Button>
              </Link>
            </div>
          </div>

          <div className="mb-4">
            <ReportExcelUpload />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {["Total Laporan", "Menunggu", "Diproses", "Selesai"].map((label, idx) => {
              const count =
                label === "Total Laporan" ? filteredReports.length :
                filteredReports.filter(r => r.status === label.toLowerCase()).length;

              const colorMap = {
                Menunggu: "text-yellow-600 dark:text-yellow-400",
                Diproses: "text-blue-600 dark:text-blue-400",
                Selesai: "text-green-600 dark:text-green-400",
              };

              return (
                <Card key={label} className="bg-card border-border">
                  <CardContent className="p-3 text-center">
                    <div className={`text-xl lg:text-2xl font-bold ${colorMap[label] || "text-foreground"}`}>
                      {count}
                    </div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mb-4 bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-foreground text-base">
                <Filter className="h-4 w-4" />
                Filter & Pencarian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari laporan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background border-border text-foreground h-9"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-background border-border text-foreground h-9">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {["semua", "menunggu", "diproses", "selesai", "ditolak"].map((status) => (
                      <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-background border-border text-foreground h-9">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {["semua", "kecelakaan", "pencurian", "kekerasan", "penipuan", "lainnya"].map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("semua");
                  setCategoryFilter("semua");
                }} className="border-border text-foreground hover:bg-muted h-9">
                  Reset Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-foreground text-base">
                <FileText className="h-4 w-4" />
                Data Laporan ({filteredReports.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground w-32 text-xs">No. Laporan</TableHead>
                      <TableHead className="text-muted-foreground w-20 text-xs">Tanggal</TableHead>
                      <TableHead className="text-muted-foreground min-w-48 text-xs">Judul</TableHead>
                      <TableHead className="text-muted-foreground w-24 text-xs">Kategori</TableHead>
                      <TableHead className="text-muted-foreground w-20 text-xs">Status</TableHead>
                      <TableHead className="text-muted-foreground w-20 text-xs">Prioritas</TableHead>
                      <TableHead className="text-muted-foreground w-24 text-xs">Pelapor</TableHead>
                      <TableHead className="text-muted-foreground w-32 text-xs">Lokasi</TableHead>
                      <TableHead className="text-muted-foreground w-28 text-xs">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length === 0 ? (
                      <TableRow className="border-border">
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground text-sm">
                          {reports.length === 0 ? "Belum ada laporan" : "Tidak ada laporan yang sesuai filter"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReports.map((report) => (
                        <TableRow key={report.id} className="border-border">
                          <TableCell className="font-mono text-xs p-2">{report.nomor_laporan || 'N/A'}</TableCell>
                          <TableCell className="text-xs p-2">{formatDate(report.tanggal_laporan || report.created_at)}</TableCell>
                          <TableCell className="p-2">
                            <div className="max-w-48 truncate text-xs" title={report.judul || 'Tidak ada judul'}>
                              {report.judul || 'Tidak ada judul'}
                            </div>
                          </TableCell>
                          <TableCell className="p-2">
                            <Badge variant="outline" className="text-xs px-1 py-0">{report.kategori}</Badge>
                          </TableCell>
                          <TableCell className="p-2">
                            <Badge className={`${getStatusBadge(report.status)} text-xs px-1 py-0`}>{report.status}</Badge>
                          </TableCell>
                          <TableCell className="p-2">
                            <Badge className={`${getPriorityBadge(report.prioritas)} text-xs px-1 py-0`}>{report.prioritas}</Badge>
                          </TableCell>
                          <TableCell className="p-2">
                            <div className="max-w-24 truncate text-xs" title={report.pelapor_nama || 'Tidak diketahui'}>
                              {report.pelapor_nama || 'Tidak diketahui'}
                            </div>
                          </TableCell>
                          <TableCell className="p-2">
                            <div className="max-w-32 truncate text-xs" title={report.lokasi || 'Tidak ada lokasi'}>
                              {report.lokasi || 'Tidak ada lokasi'}
                            </div>
                          </TableCell>
                          <TableCell className="p-2">
                            <div className="flex gap-1">
                              <Link to={`/reports/${report.id}`}>
                                <Button variant="outline" size="sm" className="border-border hover:bg-muted h-7 w-7 p-0">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </Link>
                              <QuickStatusUpdate reportId={report.id} currentStatus={report.status} reportNumber={report.nomor_laporan || 'N/A'} />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="border-border hover:bg-destructive/10 h-7 w-7 p-0">
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-background border-border">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus Laporan</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Yakin ingin menghapus laporan {report.nomor_laporan}? Tindakan ini tidak bisa dibatalkan.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteReport(report.id, report.nomor_laporan || 'N/A')}>
                                      Hapus
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Reports;
