-- Add DELETE policy for reports table to allow authenticated users to delete reports
CREATE POLICY "Authenticated users can delete reports" 
ON public.reports 
FOR DELETE 
USING (auth.uid() IS NOT NULL);