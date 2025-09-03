export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          report_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          report_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          report_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          email: string | null
          feedback_type: string
          id: string
          message: string
          nama: string | null
          photo_url: string | null
          rating: number
          response: string | null
          status: string | null
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          feedback_type: string
          id?: string
          message: string
          nama?: string | null
          photo_url?: string | null
          rating: number
          response?: string | null
          status?: string | null
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          feedback_type?: string
          id?: string
          message?: string
          nama?: string | null
          photo_url?: string | null
          rating?: number
          response?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nama: string
          nomor_telepon: string | null
          role: Database["public"]["Enums"]["user_role"]
          unit_kerja: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          nama: string
          nomor_telepon?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          unit_kerja?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nama?: string
          nomor_telepon?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          unit_kerja?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          catatan_petugas: string | null
          created_at: string | null
          deskripsi: string | null
          id: string
          judul: string
          kategori: Database["public"]["Enums"]["report_category"]
          koordinat_lat: number | null
          koordinat_lng: number | null
          lokasi: string
          nomor_laporan: string
          pelapor_email: string | null
          pelapor_nama: string
          pelapor_telepon: string | null
          petugas_hp: string | null
          petugas_id: string | null
          petugas_nama: string | null
          petugas_polres: string | null
          prioritas: Database["public"]["Enums"]["report_priority"]
          status: Database["public"]["Enums"]["report_status"]
          tanggal_laporan: string | null
          tanggal_selesai: string | null
          updated_at: string | null
        }
        Insert: {
          catatan_petugas?: string | null
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          judul: string
          kategori: Database["public"]["Enums"]["report_category"]
          koordinat_lat?: number | null
          koordinat_lng?: number | null
          lokasi: string
          nomor_laporan: string
          pelapor_email?: string | null
          pelapor_nama: string
          pelapor_telepon?: string | null
          petugas_hp?: string | null
          petugas_id?: string | null
          petugas_nama?: string | null
          petugas_polres?: string | null
          prioritas?: Database["public"]["Enums"]["report_priority"]
          status?: Database["public"]["Enums"]["report_status"]
          tanggal_laporan?: string | null
          tanggal_selesai?: string | null
          updated_at?: string | null
        }
        Update: {
          catatan_petugas?: string | null
          created_at?: string | null
          deskripsi?: string | null
          id?: string
          judul?: string
          kategori?: Database["public"]["Enums"]["report_category"]
          koordinat_lat?: number | null
          koordinat_lng?: number | null
          lokasi?: string
          nomor_laporan?: string
          pelapor_email?: string | null
          pelapor_nama?: string
          pelapor_telepon?: string | null
          petugas_hp?: string | null
          petugas_id?: string | null
          petugas_nama?: string | null
          petugas_polres?: string | null
          prioritas?: Database["public"]["Enums"]["report_priority"]
          status?: Database["public"]["Enums"]["report_status"]
          tanggal_laporan?: string | null
          tanggal_selesai?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_petugas_id_fkey"
            columns: ["petugas_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_lp_report_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_report_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_profile_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_profiles_for_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string | null
          email: string
          id: string
          nama: string
          nomor_telepon: string | null
          role: Database["public"]["Enums"]["user_role"]
          unit_kerja: string | null
          updated_at: string | null
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      report_category:
        | "kecelakaan"
        | "pencurian"
        | "kekerasan"
        | "penipuan"
        | "lainnya"
      report_priority: "rendah" | "sedang" | "tinggi" | "darurat"
      report_status: "menunggu" | "diproses" | "selesai" | "ditolak"
      user_role: "admin" | "petugas" | "dispatcher"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      report_category: [
        "kecelakaan",
        "pencurian",
        "kekerasan",
        "penipuan",
        "lainnya",
      ],
      report_priority: ["rendah", "sedang", "tinggi", "darurat"],
      report_status: ["menunggu", "diproses", "selesai", "ditolak"],
      user_role: ["admin", "petugas", "dispatcher"],
    },
  },
} as const
