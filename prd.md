Berikut PRD (Product Requirements Document) yang telah diperbarui untuk **Auct-Simply**. Fokus pada kemudahan penggunaan, performa tinggi, dan integrasi modern menggunakan Prisma serta Supabase.

---

# **PRD — Auct-Simply: Premium Anonymous Auction**

## 1. **Executive Summary**

Auct-Simply adalah platform jual ringan yang dirancang untuk konversi tinggi dengan menghilangkan hambatan login bagi penawar. Fokus utama adalah kecepatan, privasi penawar, dan kemudahan pengelolaan bagi admin.

*   **Zero Friction**: Penawar tidak perlu membuat akun.
*   **Privacy First**: Identitas penawar dianonimkan di ruang publik.
*   **Admin Power**: Dashboard lengkap untuk mengelola barang dan memantau penawar asli.
*   **Modern Stack**: Next.js, Prisma ORM, dan Supabase Storage.

---

## 2. **User Persona**

### 2.1 Admin (Penjual)
*   Mengelola inventaris barang jual.
*   Mengunggah foto produk berkualitas tinggi.
*   Melihat detail penawar (Nama & WhatsApp) untuk proses *closing*.

### 2.2 User (Penawar)
*   Melihat daftar barang yang tersedia.
*   Melakukan penawaran (*bidding*) secara instan.
*   Identitas publik disamarkan (misal: `J***` untuk `Joko`).

---

## 3. **Fitur Utama**

### 3.1 Public Interface (Bidding Experience)
*   **Modern Homepage**: Grid layout yang menampilkan barang dengan gambar berkualitas tinggi dari Supabase.
*   **Live Countdown & Stats**: Menampilkan harga tertinggi saat ini dan jumlah penawar.
*   **Instant Bid Form**: Input Nama, WhatsApp, dan Harga. Data Nama & WhatsApp disimpan di `localStorage` untuk kemudahan di penawaran berikutnya.
*   **Anonymization Logic**: Menampilkan inisial depan (contoh: `Budi` -> `B***`).

### 3.2 Admin Dashboard (Management)
*   **Secure Authentication**: Menggunakan **Better Auth** untuk proteksi akses admin.
*   **Item Management**: 
    *   Formulir pembuatan barang dengan integrasi **Supabase Storage** untuk unggah gambar.
    *   Edit dan hapus barang jual.
*   **Real-time Bid Tracking**: List penawaran masuk dengan data lengkap (Nama Asli & WhatsApp) untuk kebutuhan verifikasi dan transaksi.

---

## 4. **Teknologi & Arsitektur**

### 4.1 Core Stack
*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **Styling**: Vanilla CSS / Tailwind CSS (Optional)

### 4.2 Data & Storage
*   **ORM**: **Prisma** (Modern, Type-safe database access)
*   **Database**: PostgreSQL (Supabase / Neon)
*   **Object Storage**: **Supabase Storage** (Untuk menyimpan foto barang jual)

### 4.3 Auth
*   **Library**: Better Auth

---

## 5. **Struktur Database (Prisma Schema)**

### Model: `User` (Admin)
*   `id`: String (UUID)
*   `email`: String (Unique)
*   `password`: String (Hashed)

### Model: `Item` (Barang jual)
*   `id`: String (UUID)
*   `title`: String
*   `description`: Text
*   `basePrice`: Decimal (Optional)
*   `imageUrl`: String (URL dari Supabase Storage)
*   `imagePath`: String (Path file di Supabase untuk manajemen penghapusan)
*   `createdAt`: DateTime
*   `updatedAt`: DateTime

### Model: `Bid` (Penawaran)
*   `id`: String (UUID)
*   `itemId`: String (Relation to Item)
*   `name`: String
*   `phone`: String
*   `amount`: Decimal
*   `createdAt`: DateTime

---

## 6. **Flow Pengunggahan Gambar (Supabase)**

1.  Admin memilih gambar di form "Create Item".
2.  Client/Server mengirim file ke **Supabase Storage Bucket** (`auction-items`).
3.  Supabase mengembalikan `publicUrl` atau path file.
4.  Path/URL disimpan ke database PostgreSQL melalui **Prisma**.
5.  Gambar ditampilkan di halaman publik menggunakan optimasi gambar Next.js.

---

## 7. **Saran Implementasi & Keamanan**

### 1. Penanganan Spam
*   Implementasi **Rate Limiting** pada endpoint `/api/bids`.
*   Validasi nomor WhatsApp (format minimal).

### 2. Integritas Data (Race Condition)
*   Gunakan **Prisma Transaction** saat menyimpan penawaran baru.
*   Pastikan `amount` yang dikirim lebih besar dari penawaran tertinggi terakhir di sisi server, bukan hanya di client.

### 3. Performa Gambar
*   Gunakan transformasi gambar Supabase (jika tersedia) atau Next.js `Image` component untuk *lazy loading* dan *resizing* otomatis.

---

## 8. **MVP Scope (Fase 1)**

*   [ ] Integrasi Prisma dengan PostgreSQL.
*   [ ] Setup Supabase Storage Bucket untuk Gambar.
*   [ ] Halaman Utama & Detail Barang (Public).
*   [ ] Form Bidding dengan anonimitas.
*   [ ] Admin Panel: Login, Tambah Barang (dengan Upload Gambar), & List Penawaran.

---
**Kesimpulan**: Dengan menggunakan Prisma dan Supabase, Auct-Simply akan memiliki infrastruktur yang skalabel dan mudah dikelola, sambil tetap menjaga performa maksimal untuk user.