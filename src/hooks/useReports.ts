
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type ReportCategory = "kecelakaan" | "pencurian" | "kekerasan" | "penipuan" | "lainnya";

export type ReportStatus = "menunggu" | "diproses" | "selesai" | "ditolak";

export type ReportPriority = "rendah" | "sedang" | "tinggi" | "darurat";

export interface CreateReportData {
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

export interface Report {
  id: string;
  nomor_laporan: string;
  judul: string;
  deskripsi: string;
  kategori: ReportCategory;
  status: ReportStatus;
  prioritas: ReportPriority;
  lokasi: string;
  koordinat_lat?: number;
  koordinat_lng?: number;
  pelapor_nama: string;
  pelapor_telepon?: string;
  pelapor_email?: string;
  catatan_petugas?: string;
  petugas_nama?: string;
  petugas_polres?: string;
  petugas_hp?: string;
  tanggal_laporan: string;
  tanggal_selesai?: string;
  created_at: string;
  updated_at: string;
  petugas_id?: string;
  petugas?: {
    nama: string;
    email: string;
  };
}

// Helper function to generate report number
const generateReportNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = String(Date.now()).slice(-4);
  return `LP/${year}${month}${day}/${time}`;
};

export const useReports = () => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      console.log("Fetching reports...");
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          petugas:petugas_id(nama, email)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reports:", error);
        throw error;
      }

      console.log("Reports fetched successfully:", data?.length);
      return data as Report[];
    },
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportData: CreateReportData) => {
      console.log("Creating report with data:", reportData);

      // Parse coordinates if provided
      let koordinat_lat = null;
      let koordinat_lng = null;
      
      if (reportData.koordinat && reportData.koordinat.includes(',')) {
        const coords = reportData.koordinat.split(',').map(coord => parseFloat(coord.trim()));
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          koordinat_lat = coords[0];
          koordinat_lng = coords[1];
        }
      }

      // Format tanggal_laporan
      let tanggal_laporan = new Date().toISOString();
      if (reportData.tanggal && reportData.waktu) {
        const datetime = `${reportData.tanggal}T${reportData.waktu}:00`;
        tanggal_laporan = new Date(datetime).toISOString();
      } else if (reportData.tanggal) {
        tanggal_laporan = new Date(reportData.tanggal).toISOString();
      }

      // Map category to database enum - ensure proper typing
      const categoryMapping: Record<string, ReportCategory> = {
        'kecelakaan': 'kecelakaan',
        'pencurian': 'pencurian', 
        'kebakaran': 'kekerasan', 
        'kekerasan': 'kekerasan',
        'penipuan': 'penipuan',
        'gangguan': 'lainnya',
        'kehilangan': 'lainnya',
        'pembuatan_skck': 'lainnya',
        'pembuatan_sim': 'lainnya',
        'info_lalu_lintas': 'lainnya',
        'info_umum': 'lainnya',
        'prank': 'lainnya',
        'pengawalan': 'lainnya'
      };

      const insertData = {
        nomor_laporan: generateReportNumber(),
        judul: `Laporan ${reportData.jenis} - ${reportData.kategori}`,
        kategori: categoryMapping[reportData.kategori] || 'lainnya' as ReportCategory,
        deskripsi: reportData.deskripsi || '',
        prioritas: (reportData.prioritas || 'sedang') as ReportPriority,
        status: 'menunggu' as ReportStatus,
        lokasi: reportData.lokasi,
        koordinat_lat,
        koordinat_lng,
        pelapor_nama: reportData.pelapor,
        pelapor_telepon: reportData.telepon || null,
        pelapor_email: reportData.email || null,
        petugas_nama: reportData.petugasNama || null,
        petugas_polres: reportData.petugasPolres || null,
        petugas_hp: reportData.petugasHp || null,
        tanggal_laporan
      };

      console.log("Inserting data:", insertData);

      const { data, error } = await supabase
        .from("reports")
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error("Error creating report:", error);
        throw error;
      }

      console.log("Report created successfully:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast({
        title: "Berhasil",
        description: "Laporan berhasil dibuat"
      });
    },
    onError: (error: any) => {
      console.error("Error creating report:", error);
      toast({
        title: "Error",
        description: "Gagal membuat laporan: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  });
};

export const useReport = (id: string) => {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          petugas:petugas_id(nama, email)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching report:", error);
        throw error;
      }

      return data as Report;
    },
    enabled: !!id,
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Report> }) => {
      // Clean updates to match database schema
      const cleanUpdates = { ...updates };
      
      // Remove any undefined values
      Object.keys(cleanUpdates).forEach(key => {
        if (cleanUpdates[key as keyof typeof cleanUpdates] === undefined) {
          delete cleanUpdates[key as keyof typeof cleanUpdates];
        }
      });

      const { data, error } = await supabase
        .from("reports")
        .update(cleanUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast({
        title: "Berhasil",
        description: "Laporan berhasil diperbarui"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Gagal memperbarui laporan",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error: any) => {
      console.error("Error deleting report:", error);
      throw error;
    }
  });
};

export const useReportsStats = () => {
  return useQuery({
    queryKey: ["reports-stats"],
    queryFn: async () => {
      const { data: reports, error } = await supabase
        .from("reports")
        .select("*");

      if (error) {
        console.error("Error fetching reports stats:", error);
        throw error;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayReports = reports?.filter(report => 
        new Date(report.created_at) >= today
      ).length || 0;

      const emergency = reports?.filter(report => 
        report.prioritas === 'darurat'
      ).length || 0;

      const byStatus = {
        menunggu: reports?.filter(r => r.status === 'menunggu').length || 0,
        diproses: reports?.filter(r => r.status === 'diproses').length || 0,
        selesai: reports?.filter(r => r.status === 'selesai').length || 0,
        ditolak: reports?.filter(r => r.status === 'ditolak').length || 0,
      };

      const byCategory = reports?.reduce((acc: Record<string, number>, report) => {
        acc[report.kategori] = (acc[report.kategori] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        total: reports?.length || 0,
        todayReports,
        emergency,
        byStatus,
        byCategory
      };
    },
  });
};

export const useCreateReportsFromExcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportsData: CreateReportData[]) => {
      console.log("Creating reports from Excel:", reportsData);
      
      const insertDataArray = reportsData.map(reportData => {
        // Parse coordinates if provided
        let koordinat_lat = null;
        let koordinat_lng = null;
        
        if (reportData.koordinat && reportData.koordinat.includes(',')) {
          const coords = reportData.koordinat.split(',').map(coord => parseFloat(coord.trim()));
          if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
            koordinat_lat = coords[0];
            koordinat_lng = coords[1];
          }
        }

        // Format tanggal_laporan
        let tanggal_laporan = new Date().toISOString();
        if (reportData.tanggal && reportData.waktu) {
          const datetime = `${reportData.tanggal}T${reportData.waktu}:00`;
          tanggal_laporan = new Date(datetime).toISOString();
        } else if (reportData.tanggal) {
          tanggal_laporan = new Date(reportData.tanggal).toISOString();
        }

        // Map category to database enum
        const categoryMapping: Record<string, ReportCategory> = {
          'kecelakaan': 'kecelakaan',
          'pencurian': 'pencurian', 
          'kebakaran': 'kekerasan',
          'kekerasan': 'kekerasan',
          'penipuan': 'penipuan',
          'gangguan': 'lainnya',
          'kehilangan': 'lainnya',
          'pembuatan_skck': 'lainnya',
          'pembuatan_sim': 'lainnya',
          'info_lalu_lintas': 'lainnya',
          'info_umum': 'lainnya',
          'prank': 'lainnya',
          'pengawalan': 'lainnya'
        };

        return {
          nomor_laporan: generateReportNumber(),
          judul: `Laporan ${reportData.jenis} - ${reportData.kategori}`,
          kategori: categoryMapping[reportData.kategori] || 'lainnya' as ReportCategory,
          deskripsi: reportData.deskripsi || '',
          prioritas: (reportData.prioritas || 'sedang') as ReportPriority,
          status: 'menunggu' as ReportStatus,
          lokasi: reportData.lokasi,
          koordinat_lat,
          koordinat_lng,
          pelapor_nama: reportData.pelapor,
          pelapor_telepon: reportData.telepon || null,
          pelapor_email: reportData.email || null,
          petugas_nama: reportData.petugasNama || null,
          petugas_polres: reportData.petugasPolres || null,
          petugas_hp: reportData.petugasHp || null,
          tanggal_laporan
        };
      });

      const { data, error } = await supabase
        .from("reports")
        .insert(insertDataArray)
        .select();

      if (error) {
        console.error("Error creating reports from Excel:", error);
        throw error;
      }

      console.log("Reports created successfully from Excel:", data.length);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast({
        title: "Berhasil",
        description: `${data.length} laporan berhasil diimpor dari Excel`
      });
    },
    onError: (error: any) => {
      console.error("Error creating reports from Excel:", error);
      toast({
        title: "Error",
        description: "Gagal mengimpor laporan dari Excel: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    }
  });
};
