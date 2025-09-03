import { useState } from "react";
import { ArrowLeft, MapPin, Clock, User, Phone, Mail, Edit, CheckCircle, AlertCircle, XCircle, Upload, Eye, Trash2, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PhotoViewer from "@/components/PhotoViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReport, useUpdateReport } from "@/hooks/useReports";
import { useReportAttachments, useUploadAttachment, useDeleteAttachment } from "@/hooks/useReportAttachments";
import { toast } from "@/hooks/use-toast";

const ReportDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notes, setNotes] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string; alt: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: report, isLoading, error } = useReport(id || '');
  const { data: attachments = [], refetch: refetchAttachments } = useReportAttachments(id || "");
  const updateReportMutation = useUpdateReport();
  const uploadAttachmentMutation = useUploadAttachment();
  const deleteAttachmentMutation = useDeleteAttachment();

  console.log('Report detail data:', report);

  const handleStatusUpdate = async () => {
    if (!newStatus || !report) return;

    try {
      await updateReportMutation.mutateAsync({
        id: report.id,
        updates: {
          status: newStatus as any,
          catatan_petugas: notes || report.catatan_petugas,
          tanggal_selesai: newStatus === 'selesai' ? new Date().toISOString() : null
        }
      });
      
      setNotes("");
      setNewStatus("");
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleAddNote = async () => {
    if (!notes.trim() || !report) return;

    try {
      await updateReportMutation.mutateAsync({
        id: report.id,
        updates: {
          catatan_petugas: notes
        }
      });
      
      setNotes("");
      toast({
        title: "Catatan Ditambahkan",
        description: "Catatan petugas berhasil disimpan.",
      });
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !id) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadAttachmentMutation.mutateAsync({
          reportId: id,
          file: file
        });
      }
      
      toast({
        title: "Berhasil",
        description: "File berhasil diupload"
      });
      
      refetchAttachments();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Gagal mengupload file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteAttachment = async (attachmentPath: string) => {
    try {
      await deleteAttachmentMutation.mutateAsync(attachmentPath);
      toast({
        title: "Berhasil",
        description: "File berhasil dihapus"
      });
      refetchAttachments();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus file",
        variant: "destructive"
      });
    }
  };

  const handleViewPhoto = (attachment: any) => {
    const publicUrl = `https://rqkqfgepcpkjenwnogob.supabase.co/storage/v1/object/public/report-attachments/${attachment.name}`;
    setSelectedPhoto({
      src: publicUrl,
      alt: attachment.name
    });
    setPhotoViewerOpen(true);
  };

  const isImage = (filename: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "diproses":
        return <Badge className="bg-blue-500">Diproses</Badge>;
      case "selesai":
        return <Badge className="bg-green-500">Selesai</Badge>;
      case "menunggu":
        return <Badge className="bg-yellow-500">Menunggu</Badge>;
      case "ditolak":
        return <Badge className="bg-red-500">Ditolak</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (prioritas: string) => {
    switch (prioritas) {
      case "tinggi":
        return <Badge variant="destructive">Tinggi</Badge>;
      case "sedang":
        return <Badge variant="secondary">Sedang</Badge>;
      case "rendah":
        return <Badge variant="outline">Rendah</Badge>;
      case "darurat":
        return <Badge className="bg-red-600">Darurat</Badge>;
      default:
        return <Badge>{prioritas}</Badge>;
    }
  };

  const getTimelineSteps = () => {
    if (!report) return [];
    
    const steps = [
      {
        title: "Laporan Masuk",
        description: "Laporan diterima dalam sistem",
        date: report.created_at,
        status: "completed",
        icon: <AlertCircle className="h-5 w-5" />
      }
    ];

    if (report.status === 'diproses' || report.status === 'selesai') {
      steps.push({
        title: "Diproses",
        description: "Laporan sedang ditangani petugas",
        date: report.updated_at,
        status: "completed",
        icon: <Clock className="h-5 w-5" />
      });
    }

    if (report.status === 'selesai') {
      steps.push({
        title: "Selesai",
        description: "Laporan telah diselesaikan",
        date: report.tanggal_selesai || report.updated_at,
        status: "completed",
        icon: <CheckCircle className="h-5 w-5" />
      });
    }

    if (report.status === 'ditolak') {
      steps.push({
        title: "Ditolak",
        description: "Laporan tidak dapat diproses",
        date: report.updated_at,
        status: "rejected",
        icon: <XCircle className="h-5 w-5" />
      });
    }

    return steps;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1">
          <Header title="Detail Laporan" />
          <main className="p-4 lg:p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Memuat detail laporan...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1">
          <Header title="Detail Laporan" />
          <main className="p-4 lg:p-6">
            <div className="text-center py-8">
              <p className="text-destructive">Laporan tidak ditemukan atau error: {error?.message}</p>
              <Button onClick={() => navigate('/reports')} className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Daftar Laporan
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1">
        <Header title="" />
        
        <main className="p-4 lg:p-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => navigate('/reports')} className="border-border text-foreground hover:bg-muted">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Detail Laporan {report.nomor_laporan}
                  </h1>
                  <p className="text-muted-foreground mt-2">Informasi lengkap dan timeline penanganan</p>
                </div>
              </div>
              <Button onClick={() => navigate(`/reports/${id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Laporan
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Informasi Laporan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">ID Laporan</span>
                          <p className="font-medium text-foreground">{report.nomor_laporan}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Tanggal & Waktu</span>
                          <p className="text-foreground">{new Date(report.created_at || '').toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Jenis</span>
                          <p className="capitalize text-foreground">{report.kategori}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Kategori</span>
                          <p className="capitalize text-foreground">{report.kategori}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Status</span>
                          <div className="mt-1">
                            {getStatusBadge(report.status)}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Prioritas</span>
                          <div className="mt-1">
                            {getPriorityBadge(report.prioritas)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {report.deskripsi && (
                    <div className="mt-6">
                      <span className="text-sm font-medium text-muted-foreground">Deskripsi Kejadian</span>
                      <p className="mt-1 text-foreground">{report.deskripsi}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <MapPin className="h-5 w-5" />
                    Lokasi Kejadian
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Alamat</span>
                      <p className="mt-1 text-foreground">{report.lokasi}</p>
                    </div>
                    {(report.koordinat_lat && report.koordinat_lng) && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Koordinat</span>
                        <p className="mt-1 text-foreground">{report.koordinat_lat}, {report.koordinat_lng}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Lampiran</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="attachments" className="text-foreground">Upload File</Label>
                      <div className="mt-2">
                        <input
                          id="attachments"
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('attachments')?.click()}
                          disabled={uploading}
                          className="border-border text-foreground hover:bg-muted"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading ? "Mengupload..." : "Pilih File"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Maksimal 5MB per file. Format: JPG, PNG, PDF, DOC, DOCX
                      </p>
                    </div>

                    {attachments.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 text-foreground">File Terlampir</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {attachments.map((attachment, index) => (
                            <div key={index} className="border border-border rounded-lg p-3 bg-muted/10">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {attachment.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {(attachment.metadata?.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                                <div className="flex gap-1 ml-2">
                                  {isImage(attachment.name) ? (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleViewPhoto(attachment)}
                                      className="border-border hover:bg-muted"
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                  ) : (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const publicUrl = `https://rqkqfgepcpkjenwnogob.supabase.co/storage/v1/object/public/report-attachments/${attachment.name}`;
                                        window.open(publicUrl, '_blank');
                                      }}
                                      className="border-border hover:bg-muted"
                                    >
                                      <FileText className="h-3 w-3" />
                                    </Button>
                                  )}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteAttachment(attachment.name)}
                                    className="border-border hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Clock className="h-5 w-5" />
                    Timeline Penanganan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getTimelineSteps().map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          step.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' :
                          step.status === 'rejected' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' :
                          'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(step.date).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <User className="h-5 w-5" />
                    Informasi Pelapor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Nama Pelapor</span>
                      <p className="mt-1 text-foreground">{report.pelapor_nama}</p>
                    </div>
                    {report.pelapor_telepon && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          Nomor Telepon
                        </span>
                        <p className="mt-1 text-foreground">{report.pelapor_telepon}</p>
                      </div>
                    )}
                    {report.pelapor_email && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          Email
                        </span>
                        <p className="mt-1 text-foreground">{report.pelapor_email}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Update Status</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="mt-1 bg-background border-border text-foreground">
                        <SelectValue placeholder="Pilih status baru" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="menunggu">Menunggu</SelectItem>
                        <SelectItem value="diproses">Diproses</SelectItem>
                        <SelectItem value="selesai">Selesai</SelectItem>
                        <SelectItem value="ditolak">Ditolak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleStatusUpdate} 
                    className="w-full"
                    disabled={!newStatus || updateReportMutation.isPending}
                  >
                    {updateReportMutation.isPending ? 'Memperbarui...' : 'Update Status'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Tambah Catatan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Masukkan catatan atau update..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="bg-background border-border text-foreground"
                  />
                  <Button 
                    onClick={handleAddNote} 
                    className="w-full"
                    disabled={!notes.trim() || updateReportMutation.isPending}
                  >
                    {updateReportMutation.isPending ? 'Menyimpan...' : 'Tambah Catatan'}
                  </Button>
                </CardContent>
              </Card>

              {(report.petugas_nama || report.petugas_polres) && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Informasi Penugasan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {report.petugas_nama && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Petugas yang Menangani</span>
                        <p className="mt-1 text-foreground">{report.petugas_nama}</p>
                      </div>
                    )}
                    {report.petugas_polres && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Unit/Polres</span>
                        <p className="mt-1 text-foreground">{report.petugas_polres}</p>
                      </div>
                    )}
                    {report.petugas_hp && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Nomor HP Petugas</span>
                        <p className="mt-1 text-foreground">{report.petugas_hp}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {report.catatan_petugas && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Catatan Petugas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{report.catatan_petugas}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      {selectedPhoto && (
        <PhotoViewer
          src={selectedPhoto.src}
          alt={selectedPhoto.alt}
          isOpen={photoViewerOpen}
          onClose={() => setPhotoViewerOpen(false)}
        />
      )}
    </div>
  );
};

export default ReportDetail;
