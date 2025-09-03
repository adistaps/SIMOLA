
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithEmail, signUpWithEmail, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Login Gagal",
        description: "Silakan isi email dan password",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await signInWithEmail(email, password);
      
      if (error) {
        toast({
          title: "Login Gagal",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang di SIMOLA 110",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Login Gagal",
        description: "Terjadi kesalahan yang tidak terduga",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !nama) {
      toast({
        title: "Registrasi Gagal",
        description: "Silakan isi semua field",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await signUpWithEmail(email, password, nama);
      
      if (error) {
        toast({
          title: "Registrasi Gagal",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registrasi Berhasil",
          description: "Silakan check email untuk konfirmasi akun",
        });
        // Clear form after successful registration
        setEmail("");
        setPassword("");
        setNama("");
      }
    } catch (error) {
      toast({
        title: "Registrasi Gagal",
        description: "Terjadi kesalahan yang tidak terduga",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/image/ef233736-ae43-43ec-bc55-a51913d43b87.png')`
      }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between max-w-7xl">
        {/* Left Side - Welcome Text */}
        <div className="flex-1 text-white mr-8 hidden lg:block">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            SIMOLA<br />
            110
          </h1>
          <p className="text-lg mb-8 max-w-md leading-relaxed opacity-90">
            Sistem Informasi Monitoring Layanan 110 Kepolisian Daerah Istimewa Yogyakarta
          </p>
        </div>

        {/* Right Side - Login/Register Form */}
        <div className="w-full max-w-md">
          <Card className="bg-white bg-opacity-30 backdrop-blur-md shadow-2xl border-white border-opacity-20">
            <CardHeader className="text-center pb-4">
              <h2 className="text-2xl font-bold text-white">SIMOLA 110</h2>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleEmailLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 bg-white bg-opacity-20 border-white border-opacity-30 focus:border-white focus:ring-white text-white placeholder-gray-300"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white font-medium">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 bg-white bg-opacity-20 border-white border-opacity-30 focus:border-white focus:ring-white text-white placeholder-gray-300"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember" 
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                          className="border-white border-opacity-50 data-[state=checked]:bg-white data-[state=checked]:text-black"
                        />
                        <Label htmlFor="remember" className="text-sm text-white">
                          Remember Me
                        </Label>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-base"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign in now"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleEmailSignup} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nama" className="text-white font-medium">
                        Nama Lengkap
                      </Label>
                      <Input
                        id="nama"
                        type="text"
                        placeholder="Enter your full name"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        className="h-12 bg-white bg-opacity-20 border-white border-opacity-30 focus:border-white focus:ring-white text-white placeholder-gray-300"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="text-white font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 bg-white bg-opacity-20 border-white border-opacity-30 focus:border-white focus:ring-white text-white placeholder-gray-300"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="text-white font-medium">
                        Password
                      </Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 bg-white bg-opacity-20 border-white border-opacity-30 focus:border-white focus:ring-white text-white placeholder-gray-300"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-base"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
