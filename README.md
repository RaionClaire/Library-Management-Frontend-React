# E-LIBRARY FRONTEND – REACT APPLICATION
## Kelompok: 
### Adinda Salsabila as Backend Developer
### Meidiyana as Frontend Developer
### Keysha Dwi Nova Rohima as Frontend Developer
### M. Ayustio Riswansyah as Frontend Developer

Aplikasi frontend modern untuk sistem e-library berbasis React, terintegrasi dengan Laravel Backend API. 
Mendukung role Admin & Member.

======================================================================
CARA MENJALANKAN
======================================================================
Prasyarat
- Node.js v16+
- npm atau yarn
- (Opsional) Backend Laravel berjalan di http://localhost:8000

Instalasi & Development
1) git clone https://github.com/RaionClaire/Library-Management-Frontend-React.git
2) cd e-library
3) npm install
4) npm start

Aplikasi berjalan di: http://localhost:1234

======================================================================
KONFIGURASI BACKEND
======================================================================
Edit src/utils/api.js:

- API_BASE_URL  = "http://localhost:8000/api"  

======================================================================
FITUR UTAMA
======================================================================
Fitur Member
- Browse & cari buku, filter kategori/penulis
- Detail buku & peminjaman
- Lihat peminjaman aktif
- Notifikasi (jatuh tempo & overdue)
- Lihat & bayar denda
- Edit profil & ubah password

Fitur Admin
- Semua fitur Member
- CRUD Penulis, Kategori, Buku
- Approve / Return / Extend peminjaman
- Manajemen denda
- Laporan: buku terpopuler, statistik peminjaman, member aktif, overdue, dsb.

======================================================================
AUTENTIKASI (SANCTUM)
======================================================================
- Login mengembalikan: { token, user { id, name, email, role } }
- Simpan token & user di localStorage
- Redirect:
  - admin  -> /admin-dashboard
  - member -> /home
- Logout: POST /logout -> hapus localStorage -> ke /login

======================================================================
TROUBLESHOOTING SINGKAT
======================================================================
- "Network Error": backend belum jalan -> php artisan serve
- 401 Unauthorized: token hilang/kadaluarsa -> login ulang
- 403 Forbidden: role tidak sesuai akses

======================================================================
BUILD PRODUCTION
======================================================================
npm run build
Output: /dist (upload ke hosting: cPanel, Vercel, Netlify, dll.)

======================================================================
STACK TEKNOLOGI
======================================================================
- React 19 + React Router 6
- Axios (HTTP Client)
- Parcel bundler
- Role-based access
- Mock Mode
- Desain responsif & siap produksi

