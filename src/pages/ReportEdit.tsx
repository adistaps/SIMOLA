import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, Eye, Trash2, FileText } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PhotoViewer from "@/components/PhotoViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useReport, useUpdateReport, type ReportCategory, type ReportPriority, type ReportStatus } from "@/hooks/useReports";
import { useReportAttachments, useUploadAttachment, useDeleteAttachment } from "@/hooks/useReportAttachments";

const ReportEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: report, isLoading, error } = useReport(id || "");
  const { data: attachments = [], refetch: refetchAttachments } = useReportAttachments(id || "");
  const updateReportMutation = useUpdateReport();
  const uploadAttachmentMutation = useUploadAttachment();
  const deleteAttachmentMutation = useDeleteAttachment();

  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string; alt: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    judul: "",
    kategori: "",
    prioritas: "",
    status: "",
    lokasi: "",
    deskripsi: "",
    pelapor_nama: "",
    pelapor_telepon: "",
    pelapor_email: "",
    catatan_petugas: "",
    petugas_nama: "",
    petugas_polres: "",
    petugas_hp: "",
  });

  useEffect(() => {
    if (report) {
      setFormData({
        judul: report.judul || "",
        kategori: report.kategori || "",
        prioritas: report.prioritas || "",
        status: report.status || "",
        lokasi: report.lokasi || "",
        deskripsi: report.deskripsi || "",
        pelapor_nama: report.pelapor_nama || "",
        pelapor_telepon: report.pelapor_telepon || "",
        pelapor_email: report.pelapor_email || "",
        catatan_petugas: report.catatan_petugas || "",
        petugas_nama: report.petugas_nama || "",
        petugas_polres: report.petugas_polres || "",
        petugas_hp: report.petugas_hp || "",
      });
    }
  }, [report]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !report) return;

    try {
      const updates = {
        judul: formData.judul,
        kategori: formData.kategori as ReportCategory,
        prioritas: formData.prioritas as ReportPriority,
        status: formData.status as ReportStatus,
        lokasi: formData.lokasi,
        deskripsi: formData.deskripsi,
        pelapor_nama: formData.pelapor_nama,
        pelapor_telepon: formData.pelapor_telepon,
        pelapor_email: formData.pelapor_email,
        catatan_petugas: formData.catatan_petugas,
        petugas_nama: formData.petugas_nama,
        petugas_polres: formData.petugas_polres,
        petugas_hp: formData.petugas_hp,
        tanggal_selesai: formData.status === 'selesai' && report.status !== 'selesai' ? new Date().toISOString() : report.tanggal_selesai
      };

      await updateReportMutation.mutateAsync({
        id: report.id,
        updates
      });
      
      toast({
        title: "Berhasil",
        description: "Laporan berhasil diperbarui"
      });
      
      navigate(`/reports/${id}`);
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui laporan",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1">
          <Header title="Edit Laporan" />
          <main className="p-4 lg:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Memuat data laporan...</div>
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
          <Header title="Edit Laporan" />
          <main className="p-4 lg:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-destructive">
                {error?.message || "Laporan tidak ditemukan"}
              </div>
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
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="mb-4 border-border text-foreground hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Edit Laporan</h1>
              <p className="text-muted-foreground mt-2">
                Nomor: {report.nomor_laporan}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Informasi Laporan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="judul" className="text-foreground">Judul Laporan</Label>
                    <Input
                      id="judul"
                      value={formData.judul}
                      onChange={(e) => handleInputChange("judul", e.target.value)}
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="kategori" className="text-foreground">Kategori</Label>
                    <Select value={formData.kategori} onValueChange={(value) => handleInputChange("kategori", value)}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="kecelakaan">Kecelakaan</SelectItem>
                        <SelectItem value="pencurian">Pencurian</SelectItem>
                        <SelectItem value="kekerasan">Kekerasan</SelectItem>
                        <SelectItem value="penipuan">Penipuan</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="prioritas" className="text-foreground">Prioritas</Label>
                    <Select value={formData.prioritas} onValueChange={(value) => handleInputChange("prioritas", value)}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Pilih prioritas" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="rendah">Rendah</SelectItem>
                        <SelectItem value="sedang">Sedang</SelectItem>
                        <SelectItem value="tinggi">Tinggi</SelectItem>
                        <SelectItem value="darurat">Darurat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-foreground">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="menunggu">Menunggu</SelectItem>
                        <SelectItem value="diproses">Diproses</SelectItem>
                        <SelectItem value="selesai">Selesai</SelectItem>
                        <SelectItem value="ditolak">Ditolak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="lokasi" className="text-foreground">Lokasi</Label>
                    <Input
                      id="lokasi"
                      value={formData.lokasi}
                      onChange={(e) => handleInputChange("lokasi", e.target.value)}
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="deskripsi" className="text-foreground">Deskripsi</Label>
                    <Textarea
                      id="deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) => handleInputChange("deskripsi", e.target.value)}
                      rows={4}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Informasi Pelapor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="pelapor_nama" className="text-foreground">Nama Pelapor</Label>
                    <Input
                      id="pelapor_nama"
                      value={formData.pelapor_nama}
                      onChange={(e) => handleInputChange("pelapor_nama", e.target.value)}
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="pelapor_telepon" className="text-foreground">Telepon Pelapor</Label>
                    <Input
                      id="pelapor_telepon"
                      value={formData.pelapor_telepon}
                      onChange={(e) => handleInputChange("pelapor_telepon", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pelapor_email" className="text-foreground">Email Pelapor</Label>
                    <Input
                      id="pelapor_email"
                      type="email"
                      value={formData.pelapor_email}
                      onChange={(e) => handleInputChange("pelapor_email", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div>
                    <Label htmlFor="catatan_petugas" className="text-foreground">Catatan Petugas</Label>
                    <Textarea
                      id="catatan_petugas"
                      value={formData.catatan_petugas}
                      onChange={(e) => handleInputChange("catatan_petugas", e.target.value)}
                      rows={4}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div>
                    <Label htmlFor="petugas_nama" className="text-foreground">Nama Petugas</Label>
                    <Input
                      id="petugas_nama"
                      value={formData.petugas_nama}
                      onChange={(e) => handleInputChange("petugas_nama", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div>
                    <Label htmlFor="petugas_polres" className="text-foreground">Polres Petugas</Label>
                    <Input
                      id="petugas_polres"
                      value={formData.petugas_polres}
                      onChange={(e) => handleInputChange("petugas_polres", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div>
                    <Label htmlFor="petugas_hp" className="text-foreground">HP Petugas</Label>
                    <Input
                      id="petugas_hp"
                      value={formData.petugas_hp}
                      onChange={(e) => handleInputChange("petugas_hp", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

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

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                type="submit" 
                disabled={updateReportMutation.isPending}
                className="flex-1 sm:flex-none"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateReportMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="flex-1 sm:flex-none border-border text-foreground hover:bg-muted"
              >
                Batal
              </Button>
            </div>
          </form>
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

export default ReportEdit;
