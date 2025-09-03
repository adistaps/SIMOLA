-- Update reports table to add officer information fields
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS petugas_nama TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS petugas_polres TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS petugas_hp TEXT;

-- Create function to generate LP report numbers
CREATE OR REPLACE FUNCTION public.generate_lp_report_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  report_count INTEGER;
  report_number TEXT;
BEGIN
  SELECT COUNT(*) + 1 INTO report_count
  FROM public.reports;
  
  report_number := 'LP' || LPAD(report_count::TEXT, 3, '0');
  
  RETURN report_number;
END;
$$;

-- Update the trigger to use LP numbering system
CREATE OR REPLACE FUNCTION public.set_lp_report_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.nomor_laporan IS NULL OR NEW.nomor_laporan = '' THEN
    NEW.nomor_laporan := generate_lp_report_number();
  END IF;
  RETURN NEW;
END;
$$;

-- Drop the old trigger if it exists
DROP TRIGGER IF EXISTS set_report_number_trigger ON public.reports;

-- Create new trigger for LP numbering
CREATE TRIGGER set_lp_report_number_trigger
  BEFORE INSERT ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.set_lp_report_number();