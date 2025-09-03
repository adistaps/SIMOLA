
import { ArrowLeft, Star, Calendar, User, Image } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FeedbackDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Sample feedback data - in real app this would come from API based on id
  const feedback = {
    id: id || "1",
    type: "Kepuasan",
    subject: "Pelayanan Sangat Memuaskan",
    message: "Terima kasih atas penanganan laporan pencurian motor saya yang sangat cepat dan profesional. Petugas yang datang ke lokasi sangat ramah dan membantu. Proses penanganan hanya memerlukan waktu 30 menit dari laporan masuk hingga petugas tiba di lokasi. Sangat puas dengan pelayanan POLDA DIY!",
    rating: 5,
    date: "2024-01-15",
    status: "Direspon",
    response: "Terima kasih atas feedback positifnya. Kami akan terus meningkatkan pelayanan untuk masyarakat DIY. Apresiasi Anda sangat berarti bagi kami.",
    photos: [
      "foto_kepuasan_1.jpg",
      "foto_petugas_ramah.jpg",
      "foto_proses_penanganan.jpg"
    ],
    reporter: {
      name: "Budi Santoso",
      email: "budi.santoso@email.com",
      phone: "081234567890"
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? "text-yellow-400 fill-current" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Direspon":
        return <Badge className="bg-green-500">Direspon</Badge>;
      case "Diperbaiki":
        return <Badge className="bg-blue-500">Diperbaiki</Badge>;
      case "Dalam Pengembangan":
        return <Badge className="bg-yellow-500">Dalam Pengembangan</Badge>;
      case "Menunggu":
        return <Badge variant="outline">Menunggu</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5: return "Sangat Puas";
      case 4: return "Puas";
      case 3: return "Cukup Puas";
      case 2: return "Tidak Puas";
      case 1: return "Sangat Tidak Puas";
      default: return "Tidak Ada Rating";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <Header title="Detail Feedback" />
        
        <main className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" onClick={() => navigate("/feedback")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Detail Feedback</h1>
                <p className="text-gray-600">Informasi lengkap feedback dari masyarakat</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Feedback Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{feedback.subject}</CardTitle>
                    {getStatusBadge(feedback.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {feedback.date}
                    </div>
                    <Badge variant="outline">{feedback.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">Rating Kepuasan</span>
                      <span className="text-sm text-gray-700">({getRatingText(feedback.rating)})</span>
                    </div>
                    {renderStars(feedback.rating)}
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-2">Pesan Feedback</span>
                    <p className="text-gray-700 leading-relaxed">{feedback.message}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Photos */}
              {feedback.photos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Foto Bukti Kepuasan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {feedback.photos.map((photo, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                          <div className="text-center">
                            <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">{photo}</p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Lihat Foto
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Response */}
              {feedback.response && (
                <Card>
                  <CardHeader>
                    <CardTitle>Respon POLDA DIY</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800">{feedback.response}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Reporter Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informasi Pelapor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">Nama</span>
                    <p className="font-semibold">{feedback.reporter.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">Email</span>
                    <p className="text-sm">{feedback.reporter.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block">Telepon</span>
                    <p className="text-sm">{feedback.reporter.phone}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistik</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ID Feedback</span>
                    <span className="font-semibold">#{feedback.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Jenis</span>
                    <span className="font-semibold">{feedback.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rating</span>
                    <span className="font-semibold">{feedback.rating}/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Jumlah Foto</span>
                    <span className="font-semibold">{feedback.photos.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Aksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    Balas Feedback
                  </Button>
                  <Button className="w-full" variant="outline">
                    Tandai Sebagai Prioritas
                  </Button>
                  <Button className="w-full" variant="outline">
                    Export PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeedbackDetail;
