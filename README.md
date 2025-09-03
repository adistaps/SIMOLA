# SIMOLA 110
## Sistem Informasi Monitoring Layanan 110 - Kepolisian Daerah Istimewa Yogyakarta

SIMOLA 110 adalah platform terintegrasi untuk monitoring dan pengelolaan layanan darurat 110 yang memungkinkan pelaporan, tracking, dan analisis data secara real-time di wilayah Kepolisian Daerah Istimewa Yogyakarta.

## Fitur Utama

### Laporan
- **Kelola Laporan Darurat**: Penerimaan dan pengelolaan laporan darurat secara terpusat
- **Upload Excel**: Import data laporan dalam format Excel untuk efisiensi data entry
- **Real-time Tracking**: Pemantauan status laporan secara real-time
- **Kategorisasi**: Pengelompokan laporan berdasarkan jenis kejadian

### Pengguna
- **Manajemen Petugas**: Pengelolaan data petugas dan dispatcher sistem
- **Role Management**: Pengaturan hak akses berdasarkan peran pengguna
- **Activity Logging**: Pencatatan aktivitas pengguna untuk audit trail

### Statistik
- **Analisis Kinerja**: Laporan kinerja layanan 110 secara komprehensif
- **Dashboard Visualisasi**: Grafik dan chart untuk analisis data
- **Report Generation**: Generate laporan dalam berbagai format
- **Trend Analysis**: Analisis tren kejadian dan response time

### Feedback
- **Evaluasi Kepuasan**: Sistem feedback dari masyarakat
- **Rating System**: Penilaian kualitas layanan
- **Improvement Insights**: Data untuk peningkatan layanan

## Teknologi yang Digunakan

### Frontend
- **Framework**: React 18 dengan TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite untuk fast development & build
- **State Management**: React Query untuk server state management
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form dengan validasi
- **Icons**: Lucide React
- **Charts**: Recharts untuk visualisasi data

### Backend & Database
- **Backend as a Service**: Supabase
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth dengan Row Level Security
- **Storage**: Supabase Storage untuk file uploads
- **Real-time**: Supabase Realtime subscriptions
- **API**: Auto-generated REST API dari Supabase

## 🚀 Installation & Setup

### Prasyarat
- Node.js (versi 16 atau lebih baru)
- npm atau yarn package manager
- Akun Supabase (untuk database & backend services)

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-repo/simola-110.git
   cd simola-110
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Supabase Setup**
   - Buat project baru di [Supabase](https://supabase.com)
   - Copy URL dan anon key dari project settings
   - Setup database tables menggunakan SQL migrations (lihat `/supabase` folder)

4. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit file `.env` dengan konfigurasi Supabase:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Database Migration**
   ```bash
   # Install Supabase CLI (opsional)
   npm install -g supabase
   
   # Atau import SQL file ke Supabase Dashboard
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

7. **Akses Aplikasi**
   Buka browser dan akses `http://localhost:5173`

## 📁 Struktur Proyek

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── Header.tsx      # Application header
│   └── ...
├── pages/              # Page components
│   ├── Reports.tsx     # Laporan page
│   ├── Users.tsx       # Pengguna page
│   ├── Statistics.tsx  # Statistik page
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useReports.ts   # Reports API hooks
│   ├── useAuth.ts      # Authentication hooks
│   └── ...
├── lib/                # Utility functions
│   ├── supabase.ts     # Supabase client configuration
│   └── utils.ts        # Helper functions
├── types/              # TypeScript type definitions
│   ├── database.ts     # Supabase generated types
│   └── ...
├── supabase/           # Database schema & migrations
│   ├── migrations/     # SQL migration files
│   └── seed.sql        # Initial data seeding
└── App.tsx             # Main application component
```

## 🗄️ Database Schema

### Tables Utama

```sql
-- Tabel Laporan
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_laporan VARCHAR UNIQUE NOT NULL,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  kategori VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'menunggu',
  prioritas VARCHAR DEFAULT 'sedang',
  lokasi TEXT,
  koordinat POINT,
  pelapor_nama VARCHAR,
  pelapor_telp VARCHAR,
  pelapor_email VARCHAR,
  petugas_id UUID REFERENCES auth.users(id),
  tanggal_laporan TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Pengguna (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nama_lengkap VARCHAR NOT NULL,
  nip VARCHAR UNIQUE,
  jabatan VARCHAR,
  unit_kerja VARCHAR,
  telepon VARCHAR,
  role VARCHAR DEFAULT 'petugas',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Feedback
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  komentar TEXT,
  nama_pemberi VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policies untuk reports
CREATE POLICY "Users can view reports" ON reports
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert reports" ON reports
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies untuk profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
```

```bash
# Development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🎨 UI Components

Project ini menggunakan [shadcn/ui](https://ui.shadcn.com/) sebagai foundation UI components:

- **Form Components**: Input, Select, Button, Checkbox
- **Data Display**: Table, Card, Badge, Avatar
- **Navigation**: Sidebar, Breadcrumb
- **Feedback**: Toast, Alert, Dialog
- **Layout**: Container, Grid, Flex utilities

## 📱 Responsive Design

Aplikasi dirancang dengan pendekatan mobile-first dan fully responsive:

- **Mobile**: Optimized untuk smartphone (320px+)
- **Tablet**: Layout yang disesuaikan untuk tablet (768px+)  
- **Desktop**: Full experience untuk desktop (1024px+)

## 🔒 Security Features

- **Authentication**: Supabase Auth dengan email/password
- **Authorization**: Row Level Security (RLS) di PostgreSQL
- **Role-based Access**: Pembatasan akses berdasarkan role pengguna
- **Data Validation**: Validasi input di frontend dan database level
- **Audit Trail**: Logging aktivitas dengan Supabase triggers
- **Secure Storage**: File uploads dengan signed URLs

## 🚀 Deployment

### Build Production
```bash
npm run build
```

### Deploy Frontend
Hasil build dalam folder `dist/` dapat di-deploy ke:
- **Vercel** (Recommended)
  ```bash
  # Install Vercel CLI
  npm i -g vercel
  
  # Deploy
  vercel --prod
  ```
- **Netlify**
- **GitHub Pages**  
- **Web server konvensional**

### Supabase Production Setup
1. **Database Migration**
   - Deploy SQL schemas ke production database
   - Setup environment variables untuk production

2. **Environment Variables**
   ```env
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_anon_key
   ```

3. **Domain Configuration**
   - Setup custom domain di Supabase Dashboard
   - Configure redirect URLs untuk authentication

## 📊 Monitoring & Analytics

- **Performance Monitoring**: Supabase Dashboard untuk database metrics
- **Error Logging**: Built-in error tracking dengan Supabase
- **Real-time Analytics**: Dashboard monitoring dengan Supabase Realtime
- **Usage Analytics**: Custom analytics menggunakan Supabase Functions
- **Database Monitoring**: Query performance dan optimization insights

## 🤝 Contributing

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail lengkap.

## 👥 Tim Pengembang
Adista Putra Suyatno


## 🔄 Changelog

### Version 1.0.0 (2025)
- ✅ Implementasi sistem laporan darurat
- ✅ Dashboard monitoring real-time dengan Supabase Realtime
- ✅ Manajemen pengguna dan petugas dengan Supabase Auth
- ✅ Sistem statistik dan reporting
- ✅ Feedback dan evaluasi layanan
- ✅ Upload Excel dan file management dengan Supabase Storage
- ✅ Row Level Security untuk data protection

---

**© 2025 SIMOLA 110 - Kepolisian Daerah Istimewa Yogyakarta**

*Platform terpadu untuk monitoring dan pengelolaan layanan darurat 110 yang memungkinkan pelaporan, tracking, dan analisis data secara real-time.*
