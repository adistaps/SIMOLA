import { useState } from "react";
import { ArrowLeft, Save, User, Mail, Phone, Building, Lock, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MobileNav from "@/components/MobileNav";

type UserRole = "admin" | "petugas" | "dispatcher";

const AddUser = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    role: "" as UserRole,
    nomor_telepon: "",
    unit_kerja: "",
    password: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.email || !formData.role || !formData.password) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Creating new user:", formData);
      
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nama: formData.nama
          }
        }
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      console.log("Auth user created:", authData);

      // Then create the profile manually to ensure it exists
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            nama: formData.nama,
            email: formData.email,
            role: formData.role,
            nomor_telepon: formData.nomor_telepon || null,
            unit_kerja: formData.unit_kerja || null
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Don't throw error here as the trigger might have already created the profile
          console.log("Profile might already exist from trigger");
        } else {
          console.log("Profile created successfully");
        }
      }

      toast({
        title: "Berhasil",
        description: "Pengguna berhasil ditambahkan. Email konfirmasi telah dikirim.",
      });

      // Reset form
      setFormData({
        nama: "",
        email: "",
        role: "" as UserRole,
        nomor_telepon: "",
        unit_kerja: "",
        password: ""
      });

      // Navigate back to users page after a short delay
      setTimeout(() => {
        navigate("/users");
      }, 1000);

    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Gagal menambahkan pengguna: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <MobileNav />
      
      <div className="flex-1 lg:ml-64">
        <Header title="" />
        
        <main className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate("/users")}
              className="mb-6 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-gray-200 dark:border-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tambah Pengguna Baru</h1>
              <p className="text-gray-600 dark:text-gray-400">Buat akun pengguna baru untuk sistem SIMOLA 110</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-sm border-0 bg-white dark:bg-gray-800">
              <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-xl text-gray-900 dark:text-white">Informasi Pengguna</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-blue-500 dark:border-blue-400 pl-4">
                      Informasi Personal
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nama" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            id="nama"
                            placeholder="Masukkan nama lengkap"
                            value={formData.nama}
                            onChange={(e) => handleInputChange("nama", e.target.value)}
                            className="pl-10 h-12 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="contoh@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="pl-10 h-12 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Information Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-green-500 dark:border-green-400 pl-4">
                      Informasi Akun
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Role <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.role} onValueChange={(value: UserRole) => handleInputChange("role", value)}>
                          <SelectTrigger className="h-12 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400">
                            <SelectValue placeholder="Pilih role pengguna" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                            <SelectItem value="admin" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span>Admin</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="petugas" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Petugas</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="dispatcher" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Dispatcher</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Masukkan password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className="pl-10 h-12 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Password minimal 6 karakter</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-purple-500 dark:border-purple-400 pl-4">
                      Informasi Kontak & Kerja
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nomor_telepon" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nomor Telepon
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            id="nomor_telepon"
                            placeholder="081234567890"
                            value={formData.nomor_telepon}
                            onChange={(e) => handleInputChange("nomor_telepon", e.target.value)}
                            className="pl-10 h-12 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="unit_kerja" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Unit Kerja
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            id="unit_kerja"
                            placeholder="Contoh: Polres Kota"
                            value={formData.unit_kerja}
                            onChange={(e) => handleInputChange("unit_kerja", e.target.value)}
                            className="pl-10 h-12 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-100 dark:border-gray-700">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate("/users")}
                      className="px-6 py-3 h-auto hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    >
                      Batal
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="px-8 py-3 h-auto bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Menyimpan..." : "Simpan Pengguna"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddUser;