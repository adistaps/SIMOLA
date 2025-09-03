-- Create storage bucket for report attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('report-attachments', 'report-attachments', true);

-- Create policies for report attachments
CREATE POLICY "Report attachments are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'report-attachments');

CREATE POLICY "Authenticated users can upload report attachments" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'report-attachments' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update report attachments" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'report-attachments' AND auth.uid() IS NOT NULL);