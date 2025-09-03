
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      console.log('Fetching profiles...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }
      
      console.log('Profiles fetched:', data?.length || 0);
      return data || [];
    },
  });
};

export const useProfilesStats = () => {
  return useQuery({
    queryKey: ['profiles-stats'],
    queryFn: async () => {
      console.log('Fetching profiles stats...');
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('role');
      
      if (error) {
        console.error('Error fetching profiles stats:', error);
        throw error;
      }
      
      const total = profiles?.length || 0;
      const byRole = {
        admin: profiles?.filter(p => p.role === 'admin').length || 0,
        petugas: profiles?.filter(p => p.role === 'petugas').length || 0,
        dispatcher: profiles?.filter(p => p.role === 'dispatcher').length || 0,
      };
      
      console.log('Profiles stats calculated:', { total, byRole });
      return { total, byRole };
    },
  });
};

export const useProfile = (profileId: string) => {
  return useQuery({
    queryKey: ['profile', profileId],
    queryFn: async () => {
      console.log('Fetching profile by ID:', profileId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      console.log('Profile fetched:', data);
      return data;
    },
    enabled: !!profileId,
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: any) => {
      console.log('Creating profile:', profileData);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }
      
      console.log('Profile created successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Profile creation successful, refreshing queries...');
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profiles-stats'] });
      toast({
        title: "Pengguna Berhasil Dibuat",
        description: "Pengguna baru telah ditambahkan ke sistem.",
      });
    },
    onError: (error) => {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: "Gagal membuat pengguna baru.",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      console.log('Updating profile:', id, updateData);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      console.log('Profile updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Profile update successful, refreshing queries...');
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profiles-stats'] });
      queryClient.invalidateQueries({ queryKey: ['profile', data?.id] });
      toast({
        title: "Pengguna Berhasil Diperbarui",
        description: "Data pengguna telah diperbarui.",
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui pengguna.",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileId: string) => {
      console.log('Deleting profile:', profileId);
      
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);
      
      if (error) {
        console.error('Error deleting profile:', error);
        throw error;
      }
      
      console.log('Profile deleted successfully');
    },
    onSuccess: () => {
      console.log('Profile deletion successful, refreshing queries...');
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profiles-stats'] });
      toast({
        title: "Pengguna Dihapus",
        description: "Pengguna berhasil dihapus dari sistem.",
      });
    },
    onError: (error) => {
      console.error('Error deleting profile:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus pengguna.",
        variant: "destructive"
      });
    }
  });
};
