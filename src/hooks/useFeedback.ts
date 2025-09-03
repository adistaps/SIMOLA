
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useFeedback = () => {
  return useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      console.log('Fetching feedback...');
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching feedback:', error);
        throw error;
      }
      
      console.log('Feedback fetched:', data?.length || 0);
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useFeedbackById = (id: string) => {
  return useQuery({
    queryKey: ['feedback', id],
    queryFn: async () => {
      console.log('Fetching feedback by ID:', id);
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching feedback:', error);
        throw error;
      }
      
      console.log('Feedback fetched:', data);
      return data;
    },
    enabled: !!id,
  });
};

export const useFeedbackStats = () => {
  return useQuery({
    queryKey: ['feedback-stats'],
    queryFn: async () => {
      console.log('Fetching feedback statistics...');
      const { data, error } = await supabase
        .from('feedback')
        .select('*');
      
      if (error) {
        console.error('Error fetching feedback stats:', error);
        throw error;
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const stats = {
        total: data?.length || 0,
        todayCount: data?.filter(item => {
          const itemDate = new Date(item.created_at);
          itemDate.setHours(0, 0, 0, 0);
          return itemDate.getTime() === today.getTime();
        }).length || 0,
        averageRating: data?.length ? data.reduce((acc, item) => acc + (item.rating || 0), 0) / data.length : 0,
        byType: data?.reduce((acc: Record<string, number>, item) => {
          acc[item.feedback_type] = (acc[item.feedback_type] || 0) + 1;
          return acc;
        }, {}) || {}
      };
      
      console.log('Feedback stats calculated:', stats);
      return stats;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUploadFeedbackPhoto = () => {
  return useMutation({
    mutationFn: async ({ file, filename }: { file: File; filename: string }) => {
      console.log('Uploading feedback photo:', filename);
      
      const { data, error } = await supabase.storage
        .from('feedback-photos')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading photo:', error);
        throw error;
      }
      
      const { data: publicData } = supabase.storage
        .from('feedback-photos')
        .getPublicUrl(data.path);
      
      console.log('Photo uploaded successfully:', publicData.publicUrl);
      return publicData.publicUrl;
    },
    onError: (error) => {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Gagal mengupload foto.",
        variant: "destructive"
      });
    }
  });
};

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (feedbackData: {
      feedback_type: string;
      subject: string;
      message: string;
      rating: number;
      email?: string | null;
      nama: string;
      photo_url?: string | null;
      user_id?: string | null;
      status?: string;
    }) => {
      console.log('Creating feedback with data:', feedbackData);
      
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          feedback_type: feedbackData.feedback_type,
          subject: feedbackData.subject,
          message: feedbackData.message,
          rating: feedbackData.rating,
          email: feedbackData.email,
          photo_url: feedbackData.photo_url,
          status: feedbackData.status || 'menunggu',
          user_id: feedbackData.user_id || null
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating feedback:', error);
        throw error;
      }
      
      console.log('Feedback created successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Feedback creation successful, refreshing queries...');
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['feedback-stats'] });
      toast({
        title: "Feedback Berhasil Dibuat",
        description: "Feedback telah ditambahkan ke sistem.",
      });
    },
    onError: (error) => {
      console.error('Error creating feedback:', error);
      toast({
        title: "Error",
        description: "Gagal membuat feedback baru. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      console.log('Updating feedback:', id, updateData);
      
      const { data, error } = await supabase
        .from('feedback')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating feedback:', error);
        throw error;
      }
      
      console.log('Feedback updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Feedback update successful, refreshing queries...');
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['feedback', data?.id] });
      queryClient.invalidateQueries({ queryKey: ['feedback-stats'] });
      toast({
        title: "Feedback Berhasil Diperbarui",
        description: "Data feedback telah diperbarui.",
      });
    },
    onError: (error) => {
      console.error('Error updating feedback:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui feedback.",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (feedbackId: string) => {
      console.log('Deleting feedback:', feedbackId);
      
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);
      
      if (error) {
        console.error('Error deleting feedback:', error);
        throw error;
      }
      
      console.log('Feedback deleted successfully');
    },
    onSuccess: () => {
      console.log('Feedback deletion successful, refreshing queries...');
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['feedback-stats'] });
      toast({
        title: "Feedback Dihapus",
        description: "Feedback berhasil dihapus dari sistem.",
      });
    },
    onError: (error) => {
      console.error('Error deleting feedback:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus feedback.",
        variant: "destructive"
      });
    }
  });
};

export const useSyncExternalFeedback = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      console.log('Syncing external feedback data...');
      
      try {
        const response = await fetch('https://bgvxnummhuxnaatbrhfs.supabase.co/functions/v1/get-feedback-data');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const externalData = await response.json();
        console.log('External feedback data:', externalData);
        
        if (!externalData || !Array.isArray(externalData)) {
          throw new Error('Invalid data format from external API');
        }
        
        let syncCount = 0;
        for (const item of externalData) {
          try {
            // Check if feedback already exists
            const { data: existing } = await supabase
              .from('feedback')
              .select('id')
              .eq('subject', item.subject)
              .eq('message', item.message)
              .eq('email', item.email)
              .single();
            
            if (!existing) {
              // Insert new feedback
              await supabase
                .from('feedback')
                .insert({
                  feedback_type: item.feedback_type || 'saran',
                  subject: item.subject,
                  message: item.message,
                  rating: item.rating || 3,
                  email: item.email,
                  status: 'menunggu',
                  user_id: null
                });
              syncCount++;
            }
          } catch (itemError) {
            console.error('Error processing feedback item:', itemError);
          }
        }
        
        return { syncCount, total: externalData.length };
      } catch (error) {
        console.error('Error syncing external feedback:', error);
        throw error;
      }
    },
    onSuccess: (result) => {
      console.log('External feedback sync successful:', result);
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['feedback-stats'] });
      toast({
        title: "Sinkronisasi Berhasil",
        description: `${result.syncCount} feedback baru dari web survei telah disinkronkan.`,
      });
    },
    onError: (error) => {
      console.error('Error syncing external feedback:', error);
      toast({
        title: "Error Sinkronisasi",
        description: "Gagal menyinkronkan data dari web survei.",
        variant: "destructive"
      });
    }
  });
};
