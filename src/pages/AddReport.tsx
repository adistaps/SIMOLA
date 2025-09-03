
import { useState } from "react";
import { ArrowLeft, Save, MapPin, Calendar, Clock, User, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useCreateReport } from "@/hooks/useReports";
import MobileNav from "@/components/MobileNav";

const AddReport = () => {
  const navigate = useNavigate();
  const createReportMutation = useCreateReport();
  const [formData, setFormData] = useState({
    jenis: "",
    kategori: "",
    lokasi: "",
    koordinat: "",
    pelapor: "",
    telepon: "",
    email: "",
    prioritas: "",
    deskripsi: "",
    tanggal: "",
    waktu: "",
    petugasNama: "",
    petugasPolres: "",
    petugasHp: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.jenis || !formData.kategori || !formData.lokasi || !formData.pelapor || !formData.deskripsi) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }

    console.log("Submitting new report:", formData);
    
    createReportMutation.mutate(formData, {
      onSuccess: () => {
        navigate("/reports");
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <MobileNav />
      
      <div className="flex-1">
        <Header title="" />
        
        <main className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" onClick={() => navigate("/reports")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Tambah Laporan Baru</h1>
                <p className="text-muted-foreground">Buat laporan baru untuk sistem SIMOLA 110</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informasi Laporan */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Laporan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jenis">Kategori *</Label>
                      <Select value={formData.jenis} onValueChange={(value) => handleInputChange("jenis", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pengaduan">Pengaduan</SelectItem>
                          <SelectItem value="informasi">Informasi</SelectItem>
                          <SelectItem value="prank">Prank</SelectItem>
                          <SelectItem value="permintaan">Permintaan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="kategori">Sub Kategori *</Label>
                      <Select value={formData.kategori} onValueChange={(value) => handleInputChange("kategori", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih sub kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.jenis === "informasi" && (
                            <>
                              <SelectItem value="pembuatan_skck">Pembuatan SKCK</SelectItem>
                              <SelectItem value="pembuatan_sim">Pembuatan SIM</SelectItem>
                              <SelectItem value="info_lalu_lintas">Info Lalu Lintas</SelectItem>
                              <SelectItem value="info_umum">Informasi Umum</SelectItem>
                            </>
                          )}
                          {formData.jenis === "prank" && (
                            <SelectItem value="prank">Prank</SelectItem>
                          )}
                          {formData.jenis === "permintaan" && (
                            <SelectItem value="pengawalan">Pengawalan</SelectItem>
                          )}
                          {formData.jenis === "pengaduan" && (
                            <>
                              <SelectItem value="kecelakaan">Kecelakaan</SelectItem>
                              <SelectItem value="pencurian">Pencurian</SelectItem>
                              <SelectItem value="kebakaran">Kebakaran</SelectItem>
                              <SelectItem value="gangguan">Gangguan</SelectItem>
                              <SelectItem value="penipuan">Penipuan</SelectItem>
                              <SelectItem value="kehilangan">Kehilangan</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tanggal">Tanggal Kejadian</Label>
                      <Input
                        type="date"
                        value={formData.tanggal}
                        onChange={(e) => handleInputChange("tanggal", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="waktu">Waktu Kejadian</Label>
                      <Input
                        type="time"
                        value={formData.waktu}
                        onChange={(e) => handleInputChange("waktu", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="prioritas">Prioritas</Label>
                    <Select value={formData.prioritas} onValueChange={(value) => handleInputChange("prioritas", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih prioritas" />
                      </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="darurat">Darurat</SelectItem>
                           <SelectItem value="tinggi">Tinggi</SelectItem>
                           <SelectItem value="sedang">Sedang</SelectItem>
                           <SelectItem value="rendah">Rendah</SelectItem>
                         </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="lokasi">Lokasi Kejadian *</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Masukkan alamat lengkap lokasi kejadian"
                        value={formData.lokasi}
                        onChange={(e) => handleInputChange("lokasi", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="koordinat">Koordinat (Opsional)</Label>
                    <Input
                      placeholder="Contoh: -7.7956, 110.3695"
                      value={formData.koordinat}
                      onChange={(e) => handleInputChange("koordinat", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="deskripsi">Deskripsi Kejadian *</Label>
                    <Textarea
                      placeholder="Jelaskan detail kejadian yang dilaporkan..."
                      value={formData.deskripsi}
                      onChange={(e) => handleInputChange("deskripsi", e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Informasi Pelapor */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Pelapor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="pelapor">Nama Pelapor *</Label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Masukkan nama lengkap pelapor"
                        value={formData.pelapor}
                        onChange={(e) => handleInputChange("pelapor", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="telepon">Nomor Telepon</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Contoh: 081234567890"
                        value={formData.telepon}
                        onChange={(e) => handleInputChange("telepon", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email (Opsional)</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="contoh@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                  </div>

                   <div>
                     <Label htmlFor="petugasNama">Nama Petugas yang Menangani</Label>
                     <div className="flex items-center gap-2">
                       <User className="h-4 w-4 text-muted-foreground" />
                       <Input
                         placeholder="Masukkan nama petugas"
                         value={formData.petugasNama}
                         onChange={(e) => handleInputChange("petugasNama", e.target.value)}
                       />
                     </div>
                   </div>

                   <div>
                     <Label htmlFor="petugasPolres">Polres/Unit Kerja</Label>
                     <Input
                       placeholder="Contoh: Polres Kota Yogyakarta"
                       value={formData.petugasPolres}
                       onChange={(e) => handleInputChange("petugasPolres", e.target.value)}
                     />
                   </div>

                   <div>
                     <Label htmlFor="petugasHp">Nomor HP Petugas</Label>
                     <div className="flex items-center gap-2">
                       <Phone className="h-4 w-4 text-muted-foreground" />
                       <Input
                         placeholder="Contoh: 081234567890"
                         value={formData.petugasHp}
                         onChange={(e) => handleInputChange("petugasHp", e.target.value)}
                       />
                     </div>
                   </div>

                   <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                     <h4 className="font-medium text-blue-900 mb-2">Petunjuk Pengisian:</h4>
                     <ul className="text-sm text-blue-700 space-y-1">
                       <li>• Field yang bertanda (*) wajib diisi</li>
                       <li>• Pastikan informasi yang diberikan akurat</li>
                       <li>• Koordinat dapat membantu petugas menemukan lokasi</li>
                       <li>• Deskripsi yang detail akan mempercepat penanganan</li>
                     </ul>
                   </div>

                  <div className="flex gap-4 mt-6">
                     <Button 
                       type="submit" 
                       className="flex-1"
                       disabled={createReportMutation.isPending}
                     >
                       <Save className="h-4 w-4 mr-2" />
                       {createReportMutation.isPending ? "Menyimpan..." : "Simpan Laporan"}
                     </Button>
                    <Button type="button" variant="outline" onClick={() => navigate("/reports")}>
                      Batal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddReport;
