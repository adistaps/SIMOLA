
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Users, BarChart3, MessageSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/image/ef233736-ae43-43ec-bc55-a51913d43b87.png')`
      }}
    >
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
          <div className="container mx-auto px-4 py-4">
            <div className="text-white text-center">
              <h1 className="text-2xl font-bold"></h1>
              <p className="text-sm opacity-90"></p>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              SIMOLA 110
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Sistem Informasi Monitoring Layanan 110<br />
              Kepolisian Daerah Istimewa Yogyakarta
            </p>
            <p className="text-lg mb-12 opacity-80 max-w-2xl mx-auto">
              Platform terpadu untuk monitoring dan pengelolaan layanan darurat 110 
              yang memungkinkan pelaporan, tracking, dan analisis data secara real-time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="bg-white bg-opacity-20 backdrop-blur-md border-white border-opacity-30">
                <CardHeader className="pb-2">
                  <FileText className="h-8 w-8 text-white mx-auto mb-2" />
                  <CardTitle className="text-white text-lg">Laporan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white text-sm opacity-90">
                    Kelola dan monitor semua laporan darurat secara terpusat.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white bg-opacity-20 backdrop-blur-md border-white border-opacity-30">
                <CardHeader className="pb-2">
                  <Users className="h-8 w-8 text-white mx-auto mb-2" />
                  <CardTitle className="text-white text-lg">Pengguna</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white text-sm opacity-90">
                    Manajemen petugas dan dispatcher dalam sistem.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white bg-opacity-20 backdrop-blur-md border-white border-opacity-30">
                <CardHeader className="pb-2">
                  <BarChart3 className="h-8 w-8 text-white mx-auto mb-2" />
                  <CardTitle className="text-white text-lg">Statistik</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white text-sm opacity-90">
                    Analisis data dan laporan kinerja layanan 110.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white bg-opacity-20 backdrop-blur-md border-white border-opacity-30">
                <CardHeader className="pb-2">
                  <MessageSquare className="h-8 w-8 text-white mx-auto mb-2" />
                  <CardTitle className="text-white text-lg">Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white text-sm opacity-90">
                    Evaluasi kepuasan dan masukan dari masyarakat.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button 
              onClick={() => navigate("/login")}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-3"
            >
              Mulai Sekarang
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white bg-opacity-10 backdrop-blur-md border-t border-white border-opacity-20 py-6">
          <div className="container mx-auto px-4 text-center text-white">
            <p className="opacity-80">
              © 2025 SIMOLA 110 - Kepolisian Daerah Istimewa Yogyakarta
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
