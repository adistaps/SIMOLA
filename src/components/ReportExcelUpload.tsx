
import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { useCreateReport } from "@/hooks/useReports";
import * as XLSX from "xlsx";

interface ExcelReportData {
  jenis: string;
  kategori: string;
  deskripsi: string;
  prioritas: string;
  lokasi: string;
  koordinat?: string;
  pelapor: string;
  telepon?: string;
  email?: string;
  tanggal?: string;
  waktu?: string;
  petugasNama?: string;
  petugasPolres?: string;
  petugasHp?: string;
}

const ReportExcelUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createReportMutation = useCreateReport();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Format File Salah",
        description: "Mohon upload file Excel (.xlsx atau .xls)",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setUploadResults(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      console.log("Excel data loaded:", jsonData);

      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        try {
          // Validate required fields
          if (!row.jenis || !row.kategori || !row.lokasi || !row.pelapor) {
            throw new Error(`Baris ${i + 2}: Field wajib tidak lengkap (jenis, kategori, lokasi, pelapor)`);
          }

          // Validate jenis
          const validJenis = ['pengaduan', 'informasi', 'prank', 'permintaan'];
          if (!validJenis.includes(row.jenis?.toLowerCase())) {
            throw new Error(`Baris ${i + 2}: Jenis tidak valid (${row.jenis}). Harus salah satu: ${validJenis.join(', ')}`);
          }

          // Validate prioritas
          const validPrioritas = ['rendah', 'sedang', 'tinggi', 'darurat'];
          const prioritas = row.prioritas?.toLowerCase() || 'sedang';
          if (!validPrioritas.includes(prioritas)) {
            throw new Error(`Baris ${i + 2}: Prioritas tidak valid (${row.prioritas}). Harus salah satu: ${validPrioritas.join(', ')}`);
          }

          // Validate kategori based on jenis
          const validKategoriMap: { [key: string]: string[] } = {
            'pengaduan': ['kecelakaan', 'pencurian', 'kebakaran', 'gangguan', 'penipuan', 'kehilangan'],
            'informasi': ['pembuatan_skck', 'pembuatan_sim', 'info_lalu_lintas', 'info_umum'],
            'prank': ['prank'],
            'permintaan': ['pengawalan']
          };

          const validKategori = validKategoriMap[row.jenis.toLowerCase()];
          if (!validKategori || !validKategori.includes(row.kategori?.toLowerCase())) {
            throw new Error(`Baris ${i + 2}: Kategori "${row.kategori}" tidak valid untuk jenis "${row.jenis}". Kategori valid: ${validKategori?.join(', ') || 'tidak ada'}`);
          }

          const reportData = {
            jenis: row.jenis.toLowerCase(),
            kategori: row.kategori.toLowerCase(),
            deskripsi: row.deskripsi || '',
            prioritas: prioritas,
            lokasi: row.lokasi,
            koordinat: row.koordinat || '',
            pelapor: row.pelapor,
            telepon: row.telepon || '',
            email: row.email || '',
            tanggal: row.tanggal || '',
            waktu: row.waktu || '',
            petugasNama: row.petugasNama || '',
            petugasPolres: row.petugasPolres || '',
            petugasHp: row.petugasHp || ''
          };

          console.log(`Processing row ${i + 1}:`, reportData);

          await createReportMutation.mutateAsync(reportData);
          successCount++;
          console.log(`Row ${i + 1} processed successfully`);
          
        } catch (error) {
          failedCount++;
          const errorMessage = error instanceof Error ? error.message : `Baris ${i + 2}: Error tidak diketahui`;
          errors.push(errorMessage);
          console.error(`Error processing row ${i + 1}:`, errorMessage);
        }
      }

      setUploadResults({
        success: successCount,
        failed: failedCount,
        errors: errors.slice(0, 10) // Show only first 10 errors
      });

      if (successCount > 0) {
        toast({
          title: "Upload Berhasil",
          description: `${successCount} laporan berhasil diimport`,
        });
      }

      if (failedCount > 0) {
        toast({
          title: "Sebagian Import Gagal",
          description: `${failedCount} laporan gagal diimport. Periksa detail error di bawah.`,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Error processing Excel file:', error);
      toast({
        title: "Error",
        description: "Gagal memproses file Excel: " + (error instanceof Error ? error.message : "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        jenis: "pengaduan",
        kategori: "kecelakaan", 
        deskripsi: "Deskripsi detail laporan",
        prioritas: "tinggi",
        lokasi: "Jl. Malioboro, Yogyakarta",
        koordinat: "-7.7956, 110.3695",
        pelapor: "John Doe",
        telepon: "081234567890",
        email: "john@email.com",
        tanggal: "2024-01-15",
        waktu: "10:30",
        petugasNama: "Bripka Ahmad",
        petugasPolres: "Polres Kota Yogyakarta", 
        petugasHp: "081234567891"
      },
      {
        jenis: "informasi",
        kategori: "pembuatan_skck",
        deskripsi: "Pertanyaan tentang syarat pembuatan SKCK",
        prioritas: "sedang",
        lokasi: "Polres Bantul",
        koordinat: "",
        pelapor: "Jane Smith",
        telepon: "087654321098", 
        email: "jane@email.com",
        tanggal: "",
        waktu: "",
        petugasNama: "Briptu Siti",
        petugasPolres: "Polres Bantul",
        petugasHp: "087654321099"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "template_laporan.xlsx");
    
    toast({
      title: "Template Downloaded",
      description: "Template Excel berhasil didownload"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Upload Laporan dari Excel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-2">Format kolom Excel yang diperlukan:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Kolom Wajib:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>jenis</strong>: pengaduan, informasi, prank, permintaan</li>
                <li><strong>kategori</strong>: sesuai jenis (lihat template)</li>
                <li><strong>lokasi</strong>: Lokasi kejadian</li>
                <li><strong>pelapor</strong>: Nama pelapor</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Kolom Opsional:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>deskripsi</strong>: Detail laporan</li>
                <li><strong>prioritas</strong>: rendah/sedang/tinggi/darurat</li>
                <li><strong>koordinat</strong>: lat, lng (contoh: -7.7956, 110.3695)</li>
                <li><strong>telepon, email</strong>: Kontak pelapor</li>
                <li><strong>tanggal, waktu</strong>: Waktu kejadian (YYYY-MM-DD, HH:MM)</li>
                <li><strong>petugasNama, petugasPolres, petugasHp</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadTemplate}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Download Template
          </Button>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isProcessing ? "Memproses..." : "Upload Excel"}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />

        {uploadResults && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Hasil Upload:</strong></p>
                <p>✅ Berhasil: {uploadResults.success} laporan</p>
                <p>❌ Gagal: {uploadResults.failed} laporan</p>
                
                {uploadResults.errors.length > 0 && (
                  <div>
                    <p className="font-medium">Error yang ditemukan:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {uploadResults.errors.map((error, index) => (
                        <li key={index} className="text-red-600">{error}</li>
                      ))}
                      {uploadResults.errors.length >= 10 && (
                        <li className="text-gray-500">... dan error lainnya</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportExcelUpload;
