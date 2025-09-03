
import { useState, useEffect } from "react";
import { Moon, Sun, Palette } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
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
import MobileNav from "@/components/MobileNav";

const Settings = () => {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Apply the selected theme
    root.classList.add(theme);
    
    // Store theme preference
    localStorage.setItem('theme', theme);
    
    // Force re-render by triggering a custom event
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast({
      title: "Tema Berhasil Diubah",
      description: `Tema telah diubah ke ${getThemeLabel(newTheme)}`,
    });
  };

  const getThemeLabel = (themeValue: string) => {
    const themeLabels: Record<string, string> = {
      light: "Terang",
      dark: "Gelap"
    };
    return themeLabels[themeValue] || themeValue;
  };

  const getThemeIcon = (themeValue: string) => {
    if (themeValue === 'light') return <Sun className="h-4 w-4" />;
    if (themeValue === 'dark') return <Moon className="h-4 w-4" />;
    return <Palette className="h-4 w-4" />;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <MobileNav />
      
      <div className="flex-1">
        <Header title="" />
        
        <main className="p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Pengaturan Sistem</h1>
            <p className="text-muted-foreground mt-2">Kelola preferensi dan konfigurasi aplikasi</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tema Aplikasi */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Palette className="h-5 w-5" />
                  Tema Aplikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme" className="text-foreground">Pilih Tema</Label>
                  <Select value={theme} onValueChange={handleThemeChange}>
                    <SelectTrigger className="mt-2 bg-background border-border text-foreground">
                      <SelectValue placeholder="Pilih tema" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="light" className="text-foreground">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Terang
                        </div>
                      </SelectItem>
                      <SelectItem value="dark" className="text-foreground">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Gelap
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    Tema saat ini: <span className="font-medium text-foreground">{getThemeLabel(theme)}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {getThemeIcon(theme)}
                    <span className="text-sm text-foreground">Preview tema aktif</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informasi Sistem */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Informasi Sistem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Versi Aplikasi</span>
                    <span className="font-medium text-foreground">v1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database</span>
                    <span className="font-medium text-foreground">Supabase</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Server Status</span>
                    <span className="font-medium text-green-600">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Terakhir Update</span>
                    <span className="font-medium text-foreground">{new Date().toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
