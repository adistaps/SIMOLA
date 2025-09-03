import React, { useState, useEffect } from "react";
import { User, Edit, Save, Camera, Shield, Clock } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile, useChangePassword } from "@/hooks/useProfile";

const Profile = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nama: "",
    nomor_telepon: "",
    unit_kerja: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        nama: profile.nama || "",
        nomor_telepon: profile.nomor_telepon || "",
        unit_kerja: profile.unit_kerja || "",
        email: profile.email || "",
      });
    } else if (user && !profile) {
      setProfileData({
        nama: "",
        nomor_telepon: "",
        unit_kerja: "",
        email: user.email || "",
      });
    }
  }, [profile, user]);

  // Updated activity log with 2025 dates
  const activityLog = [
    { id: 1, action: "Login ke sistem", timestamp: "2025-08-21 09:30:15" },
    { id: 2, action: "Melihat laporan RPT001", timestamp: "2025-08-21 09:25:30" },
    { id: 3, action: "Update status laporan", timestamp: "2025-08-21 08:45:22" },
    { id: 4, action: "Download laporan bulanan", timestamp: "2025-08-20 16:20:18" },
  ];

  // Function to format date in Indonesian format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta'
    };
    return date.toLocaleString('id-ID', options);
  };

  // Function to get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
    
    return formatDate(dateString);
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileData);
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      alert("Mohon lengkapi semua field password");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok");
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <div className="flex-1">
          <Header title="Profile" />
          <main className="p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Memuat profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1">
        <Header title="" />

        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground">
              Kelola informasi profil dan pengaturan akun Anda
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informasi Personal
                    </CardTitle>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Simpan
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="text-lg">AS</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Ganti Foto
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nama">Nama Lengkap</Label>
                      <Input
                        id="nama"
                        value={profileData.nama}
                        onChange={(e) => setProfileData({ ...profileData, nama: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profileData.email} disabled />
                    </div>
                    <div>
                      <Label htmlFor="unit_kerja">Unit Kerja</Label>
                      <Input
                        id="unit_kerja"
                        value={profileData.unit_kerja}
                        onChange={(e) =>
                          setProfileData({ ...profileData, unit_kerja: e.target.value })
                        }
                        disabled={!isEditing}
                        placeholder="Masukkan unit kerja"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nomor_telepon">Nomor Telepon</Label>
                      <Input
                        id="nomor_telepon"
                        value={profileData.nomor_telepon}
                        onChange={(e) =>
                          setProfileData({ ...profileData, nomor_telepon: e.target.value })
                        }
                        disabled={!isEditing}
                        placeholder="Masukkan nomor telepon"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Ubah Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Password Saat Ini</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, currentPassword: e.target.value })
                      }
                      placeholder="Masukkan password saat ini"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Password Baru</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, newPassword: e.target.value })
                      }
                      placeholder="Masukkan password baru"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirmPassword: e.target.value })
                      }
                      placeholder="Konfirmasi password baru"
                    />
                  </div>
                  <Button onClick={handleChangePassword} className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Ubah Password
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status Akun</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <Badge className="bg-green-600 text-white">Aktif</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Role</span>
                      <Badge className="bg-blue-600 text-white">
                        {profile?.role || "admin"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email</span>
                      <span className="text-sm text-muted-foreground">{user?.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Member Since</span>
                      <span className="text-sm text-muted-foreground">
                        {profile?.created_at
                          ? new Date(profile.created_at).toLocaleDateString('id-ID')
                          : "6/29/2025"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Aktivitas Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityLog.map((activity) => (
                      <div key={activity.id} className="text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-b-0 last:pb-0">
                        <p className="font-medium text-foreground">{activity.action}</p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {getRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    ))}
                    
                    <div className="pt-2">
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;