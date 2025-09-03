import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ArrowLeft } from "lucide-react";

type UserRole = "admin" | "petugas" | "dispatcher";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    role: "petugas" as UserRole,
    nomor_telepon: "",
    unit_kerja: ""
  });

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        nama: data.nama || "",
        email: data.email || "",
        role: (data.role as UserRole) || "petugas",
        nomor_telepon: data.nomor_telepon || "",
        unit_kerja: data.unit_kerja || ""
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pengguna",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nama: formData.nama,
          email: formData.email,
          role: formData.role,
          nomor_telepon: formData.nomor_telepon,
          unit_kerja: formData.unit_kerja,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Data pengguna berhasil diperbarui"
      });

      navigate('/users');
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui data pengguna",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData({...formData, role: value as UserRole});
  };

  if (loading) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1">
        <Header title="" />
        
        <main className="p-6">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/users')}
              className="mb-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Pengguna
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Pengguna</h1>
            <p className="text-gray-600 dark:text-gray-400">Perbarui informasi pengguna</p>
          </div>

          <Card className="max-w-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white">Informasi Pengguna</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nama" className="text-gray-700 dark:text-gray-300">
                      Nama Lengkap
                    </Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      required
                      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">
                      Role
                    </Label>
                    <Select value={formData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <SelectItem 
                          value="admin" 
                          className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Admin
                        </SelectItem>
                        <SelectItem 
                          value="petugas"
                          className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Petugas
                        </SelectItem>
                        <SelectItem 
                          value="dispatcher"
                          className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Dispatcher
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="nomor_telepon" className="text-gray-700 dark:text-gray-300">
                      Nomor Telepon
                    </Label>
                    <Input
                      id="nomor_telepon"
                      value={formData.nomor_telepon}
                      onChange={(e) => setFormData({...formData, nomor_telepon: e.target.value})}
                      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="unit_kerja" className="text-gray-700 dark:text-gray-300">
                      Unit Kerja
                    </Label>
                    <Input
                      id="unit_kerja"
                      value={formData.unit_kerja}
                      onChange={(e) => setFormData({...formData, unit_kerja: e.target.value})}
                      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                  >
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/users')}
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default EditUser;