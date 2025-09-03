
import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { useCreateFeedback } from "@/hooks/useFeedback";
import * as XLSX from "xlsx";

interface ExcelFeedbackData {
  feedback_type: string;
  subject: string;
  message: string;
  rating: number;
  email?: string;
  nama: string;
}

const FeedbackExcelUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createFeedbackMutation = useCreateFeedback();

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

      console.log('Excel data loaded:', jsonData);

      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        try {
          // Validate required fields with more flexible field name checking
          const feedbackType = row.feedback_type || row['Feedback Type'] || row['feedback type'] || row.jenis_feedback;
          const subject = row.subject || row.Subject || row.subjek || row.judul;
          const message = row.message || row.Message || row.pesan || row.isi;
          const rating = row.rating || row.Rating || row.nilai || row.penilaian;
          const nama = row.nama || row.Nama || row.name || row.Name;
          const email = row.email || row.Email || row['E-mail'];

          if (!feedbackType || !subject || !message || !rating || !nama) {
            throw new Error(`Baris ${i + 2}: Field wajib tidak lengkap. Diperlukan: feedback_type, subject, message, rating, nama`);
          }

          // Validate feedback_type with case insensitive checking
          const validFeedbackTypes = ['saran', 'keluhan', 'pujian', 'bug_report', 'fitur_request'];
          const normalizedFeedbackType = feedbackType.toString().toLowerCase().trim();
          
          if (!validFeedbackTypes.includes(normalizedFeedbackType)) {
            throw new Error(`Baris ${i + 2}: Jenis feedback tidak valid (${feedbackType}). Harus salah satu dari: ${validFeedbackTypes.join(', ')}`);
          }

          // Validate and convert rating
          let numericRating: number;
          if (typeof rating === 'number') {
            numericRating = rating;
          } else {
            numericRating = parseFloat(rating.toString());
          }
          
          if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            throw new Error(`Baris ${i + 2}: Rating harus berupa angka 1-5 (nilai: ${rating})`);
          }

          const feedbackData = {
            feedback_type: normalizedFeedbackType,
            subject: subject.toString().trim(),
            message: message.toString().trim(),
            rating: Math.round(numericRating), // Ensure integer rating
            email: email ? email.toString().trim() : null,
            nama: nama.toString().trim()
          };

          console.log(`Processing row ${i + 1}:`, feedbackData);

          await createFeedbackMutation.mutateAsync(feedbackData);
          successCount++;
          console.log(`Row ${i + 1} processed successfully`);
          
        } catch (error) {
          failedCount++;
          const errorMessage = error instanceof Error ? error.message : `Baris ${i + 2}: Error tidak diketahui`;
          console.error(`Error processing row ${i + 1}:`, errorMessage);
          errors.push(errorMessage);
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
          description: `${successCount} feedback berhasil diimport`,
        });
      }

      if (failedCount > 0 && successCount === 0) {
        toast({
          title: "Upload Gagal",
          description: `Semua ${failedCount} data gagal diimport. Periksa format data.`,
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
        feedback_type: "saran",
        subject: "Contoh Saran Perbaikan",
        message: "Saran untuk meningkatkan layanan 110",
        rating: 4,
        email: "user@email.com",
        nama: "John Doe"
      },
      {
        feedback_type: "keluhan",
        subject: "Contoh Keluhan Layanan",
        message: "Keluhan mengenai respon time yang lambat",
        rating: 2,
        email: "user2@email.com",
        nama: "Jane Smith"
      },
      {
        feedback_type: "pujian",
        subject: "Pelayanan Sangat Baik",
        message: "Terima kasih atas pelayanan yang memuaskan",
        rating: 5,
        email: "user3@email.com",
        nama: "Alice Johnson"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Feedback");
    XLSX.writeFile(workbook, "template_feedback.xlsx");
    
    toast({
      title: "Template Downloaded",
      description: "Template Excel telah diunduh",
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileSpreadsheet className="h-5 w-5" />
          Upload Feedback dari Excel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Format kolom Excel yang diperlukan:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>feedback_type</strong> (wajib): saran, keluhan, pujian, bug_report, fitur_request</li>
            <li><strong>subject</strong> (wajib): Subjek feedback</li>
            <li><strong>message</strong> (wajib): Pesan feedback</li>
            <li><strong>rating</strong> (wajib): Rating 1-5</li>
            <li><strong>nama</strong> (wajib): Nama pengirim</li>
            <li><strong>email</strong>: Email pengirim (opsional)</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={downloadTemplate}
            className="border-border text-foreground hover:bg-muted"
          >
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
          <Alert className="border-border bg-muted/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Hasil Upload:</strong></p>
                <p className="text-green-600 dark:text-green-400">✅ Berhasil: {uploadResults.success} feedback</p>
                <p className="text-red-600 dark:text-red-400">❌ Gagal: {uploadResults.failed} feedback</p>
                
                {uploadResults.errors.length > 0 && (
                  <div>
                    <p className="font-medium text-foreground">Error yang ditemukan:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {uploadResults.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {uploadResults.errors.length >= 10 && (
                        <li>... dan error lainnya</li>
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

export default FeedbackExcelUpload;
