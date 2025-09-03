
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useUploadReportAttachment = () => {
  return useMutation({
    mutationFn: async ({ file, filename }: { file: File; filename: string }) => {
      console.log('Uploading report attachment:', filename, 'Size:', file.size, 'Type:', file.type);
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Ukuran file maksimal 10MB');
      }

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('report-attachments')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('report-attachments')
        .getPublicUrl(filename);

      console.log('Attachment uploaded successfully:', publicUrl);
      return {
        url: publicUrl,
        name: file.name,
        size: file.size,
        type: file.type
      };
    },
    onError: (error) => {
      console.error('Error uploading attachment:', error);
      toast({
        title: "Error Upload",
        description: error.message || "Gagal mengupload file.",
        variant: "destructive"
      });
    }
  });
};

export const useReportAttachments = (reportId: string) => {
  return useQuery({
    queryKey: ['report-attachments', reportId],
    queryFn: async () => {
      console.log('Fetching attachments for report:', reportId);
      
      const { data, error } = await supabase.storage
        .from('report-attachments')
        .list('', {
          limit: 100,
          offset: 0
        });

      if (error) {
        console.error('Error fetching attachments:', error);
        throw new Error(`Failed to fetch attachments: ${error.message}`);
      }

      // Filter files that start with the report ID
      const reportAttachments = data.filter(file => 
        file.name.startsWith(`${reportId}_`) || file.name.includes(`report_${reportId}`)
      );

      console.log('Found attachments:', reportAttachments);
      return reportAttachments;
    },
    enabled: !!reportId
  });
};

export const useUploadAttachment = () => {
  return useMutation({
    mutationFn: async ({ reportId, file }: { reportId: string; file: File }) => {
      console.log('Uploading attachment for report:', reportId, 'File:', file.name);
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Ukuran file maksimal 5MB');
      }

      // Create unique filename with report ID
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const filename = `${reportId}_${timestamp}.${fileExtension}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('report-attachments')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }
      
      console.log('Attachment uploaded successfully:', filename);
      return {
        name: filename,
        originalName: file.name,
        size: file.size,
        type: file.type
      };
    },
    onError: (error) => {
      console.error('Error uploading attachment:', error);
      toast({
        title: "Error Upload",
        description: error.message || "Gagal mengupload file.",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteAttachment = () => {
  return useMutation({
    mutationFn: async (filename: string) => {
      console.log('Deleting attachment:', filename);
      
      const { error } = await supabase.storage
        .from('report-attachments')
        .remove([filename]);

      if (error) {
        console.error('Delete error:', error);
        throw new Error(`Failed to delete file: ${error.message}`);
      }
      
      console.log('Attachment deleted successfully:', filename);
      return filename;
    },
    onError: (error) => {
      console.error('Error deleting attachment:', error);
      toast({
        title: "Error Delete",
        description: error.message || "Gagal menghapus file.",
        variant: "destructive"
      });
    }
  });
};
