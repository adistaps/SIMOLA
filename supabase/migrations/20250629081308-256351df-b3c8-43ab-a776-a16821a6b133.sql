
-- Create enum types
CREATE TYPE report_category AS ENUM ('kecelakaan', 'pencurian', 'kekerasan', 'penipuan', 'lainnya');
CREATE TYPE report_status AS ENUM ('menunggu', 'diproses', 'selesai', 'ditolak');
CREATE TYPE report_priority AS ENUM ('rendah', 'sedang', 'tinggi', 'darurat');
CREATE TYPE user_role AS ENUM ('admin', 'petugas', 'dispatcher');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'petugas',
  nomor_telepon TEXT,
  unit_kerja TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_laporan TEXT UNIQUE NOT NULL,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  kategori report_category NOT NULL,
  status report_status NOT NULL DEFAULT 'menunggu',
  prioritas report_priority NOT NULL DEFAULT 'sedang',
  lokasi TEXT NOT NULL,
  pelapor_nama TEXT NOT NULL,
  pelapor_telepon TEXT,
  pelapor_email TEXT,
  petugas_id UUID REFERENCES public.profiles(id),
  koordinat_lat DECIMAL(10, 8),
  koordinat_lng DECIMAL(11, 8),
  tanggal_laporan TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tanggal_selesai TIMESTAMP WITH TIME ZONE,
  catatan_petugas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity logs table
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for reports
CREATE POLICY "Anyone can view reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Petugas can update reports" ON public.reports FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for activity logs
CREATE POLICY "Anyone can view activity logs" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nama, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'nama', new.email),
    new.email,
    'petugas'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to generate report number
CREATE OR REPLACE FUNCTION generate_report_number()
RETURNS TEXT AS $$
DECLARE
  current_year TEXT;
  report_count INTEGER;
  report_number TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM NOW())::TEXT;
  
  SELECT COUNT(*) + 1 INTO report_count
  FROM public.reports
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  
  report_number := 'LAP-' || current_year || '-' || LPAD(report_count::TEXT, 4, '0');
  
  RETURN report_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate report number
CREATE OR REPLACE FUNCTION set_report_number()
RETURNS trigger AS $$
BEGIN
  IF NEW.nomor_laporan IS NULL OR NEW.nomor_laporan = '' THEN
    NEW.nomor_laporan := generate_report_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_report_number
  BEFORE INSERT ON public.reports
  FOR EACH ROW EXECUTE FUNCTION set_report_number();
