
-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  feedback_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  email TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'menunggu',
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all feedback" ON public.feedback FOR SELECT USING (true);
CREATE POLICY "Users can insert their own feedback" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own feedback" ON public.feedback FOR UPDATE USING (auth.uid() = user_id);

-- Create storage bucket for feedback photos
INSERT INTO storage.buckets (id, name, public) VALUES ('feedback-photos', 'feedback-photos', true);

-- Create policy for feedback photos bucket
CREATE POLICY "Anyone can view feedback photos" ON storage.objects FOR SELECT USING (bucket_id = 'feedback-photos');
CREATE POLICY "Authenticated users can upload feedback photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'feedback-photos' AND auth.role() = 'authenticated');

-- Add nomor_telepon column to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nomor_telepon TEXT;

-- Add unit_kerja column to profiles if not exists  
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS unit_kerja TEXT;

-- Update the handle_new_user function to include additional profile fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, nama, email, role, nomor_telepon, unit_kerja)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'nama', new.email),
    new.email,
    'petugas',
    new.raw_user_meta_data ->> 'nomor_telepon',
    new.raw_user_meta_data ->> 'unit_kerja'
  );
  RETURN new;
END;
$$;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
