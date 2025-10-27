# 📚 E-LIBRARY FRONTEND – REACT APPLICATION

> *"A book a day keeps the boredom away!"* 🎯

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Node](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

**Aplikasi frontend modern untuk sistem e-library berbasis React**  
*Terintegrasi dengan Laravel Backend API*

</div>

---

## 👥 Tim Pengembang

| Role | Nama | Status |
|------|------|--------|
| 🔧 Backend Developer | **Adinda Salsabila** | *The API Wizard* |
| 🎨 Frontend Developer | **Meidiyana** | *The UI Maestro* |
| 🎨 Frontend Developer | **Keysha Dwi Nova Rohima** | *The Component Queen* |
| 🎨 Frontend Developer | **M. Ayustio Riswansyah** | *The React Ninja* |

---

## 🚀 Quick Start Guide

### 📋 Prasyarat

Pastikan kamu sudah punya ini dulu ya:

- ✅ Node.js v16 atau lebih baru
- ✅ npm atau yarn (pilih salah satu, jangan berantem!)
- ✅ Backend Laravel di `http://localhost:8000` *(optional tapi sangat direkomendasikan)*
- ☕ Kopi atau teh (wajib biar semangat!)

### 🛠️ Instalasi dalam 4 Langkah Mudah

```bash
# 1️⃣ Clone repository ini dan Repo Backend
git clone https://github.com/RaionClaire/Library-Management-Frontend-React.git

git clone https://github.com/RaionClaire/Library-Management-Backend.git

# 2️⃣ Masuk ke folder project
cd e-library

# 3️⃣ Install dependencies 
npm install

# 4️⃣ Jalankan development server
npm start
```

**🎊 Selamat!** Aplikasi sekarang berjalan di: `http://localhost:1234`

---

## ⚙️ Konfigurasi Backend

Buka file `src/utils/api.js` dan sesuaikan URL backend:

```javascript
const API_BASE_URL = "http://localhost:8000/api"
```

> 💡 **Pro Tip:** Jangan lupa nyalakan backend Laravel-nya dulu ya! Kalau tidak, nanti frontend-nya kesepian 😢

```bash
# Di folder backend Laravel
php artisan serve
```

---

## ✨ Fitur-Fitur Keren

### 👤 Untuk Member (Pembaca Setia)

| Fitur | Deskripsi | Icon |
|-------|-----------|------|
| **Browse Buku** | Jelajahi koleksi buku dengan mudah | 📖 |
| **Search & Filter** | Cari buku berdasarkan kategori/penulis | 🔍 |
| **Detail Buku** | Lihat info lengkap sebelum pinjam | 📋 |
| **Peminjaman** | Pinjam buku favorit (max 3 buku!) | 🤝 |
| **Notifikasi** | Pengingat jatuh tempo & overdue | 🔔 |
| **Manajemen Denda** | Lihat & bayar denda (semoga tidak ada!) | 💸 |
| **Edit Profil** | Update data diri & ganti password | 👤 |

### 🛡️ Untuk Admin (Sang Penjaga Perpustakaan)

**Admin punya SEMUA fitur Member PLUS:**

| Fitur Extra | Deskripsi | Icon |
|-------------|-----------|------|
| **CRUD Penulis** | Kelola data penulis | ✍️ |
| **CRUD Kategori** | Atur kategori buku | 📂 |
| **CRUD Buku** | Tambah/edit/hapus buku | 📚 |
| **Approve Peminjaman** | Setujui permintaan peminjaman | ✅ |
| **Return/Extend** | Proses pengembalian & perpanjangan | 🔄 |
| **Manajemen Denda** | Kelola sistem denda | 💰 |
| **Laporan Lengkap** | Statistik & analisis perpustakaan | 📊 |

### 📊 Jenis Laporan Admin

- 🏆 Buku terpopuler (yang paling sering dipinjam)
- 📈 Statistik peminjaman (grafik keren!)
- 🎖️ Member paling aktif (pembaca sejati!)
- ⚠️ Daftar overdue (yang harus diingatkan)
- 💵 Laporan denda (semoga sedikit!)

---

## 🔐 Sistem Autentikasi (Laravel Sanctum)

### Flow Login

```mermaid
graph LR
    A[Login] --> B{Valid?}
    B -->|Yes| C[Dapat Token]
    C --> D{Role?}
    D -->|Admin| E[/admin-dashboard]
    D -->|Member| F[/home]
    B -->|No| G[Error Message]
```

### Response Login

```json
{
  "token": "1|abc123xyz...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

### Redirect Rules

- 🔴 **Admin** → `/admin-dashboard`
- 🔵 **Member** → `/home`
- 🚪 **Logout** → hapus localStorage → `/login`

---

## 🐛 Troubleshooting Guide

### Masalah Umum & Solusinya

| ❌ Error | 💡 Solusi | 🎯 Command |
|---------|----------|-----------|
| **Network Error** | Backend belum jalan | `php artisan serve` |
| **401 Unauthorized** | Token kadaluarsa/hilang | Login ulang |
| **403 Forbidden** | Role tidak sesuai akses | Cek role user |
| **404 Not Found** | URL API salah | Cek `api.js` |
| **CORS Error** | CORS belum dikonfigurasi | Update backend Laravel |

### Debug Mode 🔍

```javascript
// Tambahkan di src/utils/api.js untuk debugging
console.log('API Request:', config);
console.log('API Response:', response);
```

---

## 🏗️ Build untuk Production

### Langkah Build

```bash
# Build aplikasi
npm run build

# Output ada di folder /dist
# Ukuran kecil, performa maksimal! ⚡
```

### Deploy Options

| Platform | Gratis? | Kesulitan | Rekomendasi |
|----------|---------|-----------|-------------|
| **Vercel** | ✅ Yes | 🟢 Easy | ⭐⭐⭐⭐⭐ |
| **Netlify** | ✅ Yes | 🟢 Easy | ⭐⭐⭐⭐⭐ |
| **GitHub Pages** | ✅ Yes | 🟡 Medium | ⭐⭐⭐⭐ |
| **cPanel** | ❌ Paid | 🟡 Medium | ⭐⭐⭐ |

---

## 🛠️ Tech Stack

<div align="center">

| Technology | Version | Purpose |
|------------|---------|---------|
| ⚛️ **React** | 19 | Frontend Framework |
| 🧭 **React Router** | 6 | Navigation |
| 📡 **Axios** | Latest | HTTP Client |
| 📦 **Parcel** | Latest | Bundler |
| 🎨 **CSS3** | - | Styling |
| 🔐 **Sanctum** | - | Authentication |

</div>

---

## 🎯 Roadmap & Future Features

- [ ] 🌙 Dark mode (untuk yang suka baca malam)
- [ ] 📱 Progressive Web App (install di HP!)
- [ ] 🌍 Multi-bahasa (Indonesia & English)
- [ ] 📸 Upload foto profil
- [ ] 💬 Review & rating buku
- [ ] 🔖 Bookmark favorit
- [ ] 📧 Email notifikasi
- [ ] 🤖 Rekomendasi buku AI

---

## 📜 License

MIT License - Bebas digunakan dan dimodifikasi! 🎉

---

<div align="center">

**Made with ❤️ and lots of ☕ by Tim E-Library**

*"Reading is to the mind what exercise is to the body"* - Joseph Addison

⭐ **Jangan lupa kasih star kalau suka!** ⭐

</div>

---
