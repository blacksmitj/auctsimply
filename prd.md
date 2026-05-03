Berikut PRD (Product Requirements Document) yang telah diperbarui untuk **Auct-Simply** agar sesuai dengan kondisi aplikasi saat ini. Fokus pada kemudahan penggunaan, performa tinggi, dan integrasi modern menggunakan Prisma, Better Auth, serta Supabase.

---

# **PRD — Auct-Simply: Premium Anonymous Auction**

## 1. **Executive Summary**

Auct-Simply adalah platform lelang ringan yang dirancang untuk konversi tinggi dengan menghilangkan hambatan login bagi penawar. Fokus utama adalah kecepatan, privasi penawar, dan kemudahan pengelolaan bagi admin.

*   **Zero Friction**: Penawar tidak perlu membuat akun untuk melakukan bid.
*   **Privacy First**: Identitas penawar dianonimkan di ruang publik (inisial).
*   **Admin Power**: Dashboard lengkap untuk mengelola barang dan memantau data penawar asli.
*   **Modern Stack**: Next.js 16, React 19, Prisma ORM, Better Auth, dan Supabase Storage.

---

## 2. **User Persona**

### 2.1 Admin (Penjual)
*   Mengelola inventaris barang lelang (Create, Read, Update, Delete).
*   Mengunggah foto produk melalui integrasi S3/Supabase.
*   Memantau statistik penjualan dan detail penawar untuk proses *closing*.

### 2.2 User (Penawar)
*   Menjelajah daftar barang dalam tampilan grid yang responsif.
*   Melakukan penawaran (*bidding*) secara instan tanpa login.
*   Data identitas disimpan di `localStorage` untuk kemudahan penawaran berikutnya.

---

## 3. **Fitur Utama**

### 3.1 Public Interface (Bidding Experience)
*   **Responsive Homepage**: Grid layout menampilkan barang dengan desain kartu premium (Image on left, Info on right pada mobile/desktop).
*   **Optimized Images**: Menggunakan `next/image` dengan properti `sizes` yang tepat untuk performa maksimal.
*   **Instant Bid Form**: Validasi ketat menggunakan Zod untuk Nama, WhatsApp, dan Harga.
*   **Anonymization Logic**: Menampilkan inisial (contoh: `J***` untuk `Joko`) pada daftar penawaran publik.

### 3.2 Admin Dashboard (Management)
*   **Secure Authentication**: Menggunakan **Better Auth** dengan proteksi rute di `proxy.ts`.
*   **Item Management**: 
    *   Formulir canggih dengan `react-hook-form` dan `zod`.
    *   Integrasi **Supabase Storage** melalui Server Actions untuk unggah gambar.
*   **Real-time Stats**: Dashboard dengan ringkasan Total Barang, Total Penawaran, Bid Tertinggi, dan Penawar Unik.
*   **Feedback System**: Menggunakan **Sonner** untuk notifikasi aksi yang sukses atau gagal.

---

## 4. **Teknologi & Arsitektur**

### 4.1 Core Stack
*   **Framework**: Next.js 16.2 (App Router)
*   **UI Library**: React 19.2
*   **Styling**: Tailwind CSS v4 (Utility-first modern styling)
*   **Icons**: Lucide React
*   **Components**: Shadcn UI (Radix UI based)

### 4.2 Data & Storage
*   **ORM**: **Prisma 7.8** (Type-safe access)
*   **Database**: PostgreSQL
*   **State Management**: TanStack Query v5 (Server-state synchronization)
*   **Object Storage**: Supabase Storage (S3-compatible)

### 4.3 Auth & Security
*   **Library**: Better Auth 1.6
*   **Security Pattern**: `proxy.ts` untuk manajemen redirect dan proteksi admin rute.

---

## 5. **Struktur Database (Prisma Schema)**

### Model: `Item` (Barang lelang)
*   `id`: String (CUID)
*   `title`: String
*   `description`: String
*   `basePrice`: Decimal (Mapped as `base_price`)
*   `imageUrl`: String (URL dari Supabase)
*   `imagePath`: String (Internal path untuk cleanup)
*   `createdAt` & `updatedAt`: DateTime

### Model: `Bid` (Penawaran)
*   `id`: String (CUID)
*   `itemId`: Relation to Item
*   `name`: String
*   `phone`: String
*   `amount`: Decimal
*   `createdAt`: DateTime

### Auth Models (Better Auth)
*   `User`, `Session`, `Account`, `Verification`.

---

## 6. **Flow Pengunggahan Gambar**

1.  Admin memilih gambar via `FileUpload01` component.
2.  Client memanggil Server Action `uploadImage`.
3.  Server mengunggah file ke Supabase Bucket menggunakan S3 SDK.
4.  Database menyimpan `imageUrl` dan `imagePath`.
5.  Komponen `Image` Next.js merender gambar dengan optimasi otomatis.

---

## 7. **Implementasi & Keamanan Terkini**

1.  **Handling Decimal**: Konversi otomatis tipe `Decimal` Prisma ke `number` sebelum dikirim ke Client Component untuk mencegah error serialisasi.
2.  **Mobile First**: Seluruh antarmuka telah diaudit dan dioptimasi untuk perangkat mobile.
3.  **Accessibility**: Penggunaan komponen `Field`, `Label`, dan `FieldError` yang aksesibel untuk pembaca layar (Screen Reader).
4.  **Route Protection**: Logika autentikasi terpusat di `proxy.ts` untuk menangani redirect login/dashboard secara efisien.

---

## 8. **Status Milestone (Fase 1 - SELESAI)**

*   [x] Integrasi Prisma dengan PostgreSQL.
*   [x] Setup Supabase Storage Bucket & S3 SDK.
*   [x] Migrasi ke Better Auth & Implementasi `proxy.ts`.
*   [x] Halaman Utama & Detail Barang (Responsive Grid).
*   [x] Form Bidding dengan anonimitas & LocalStorage.
*   [x] Admin Panel: Dashboard Stats, CRUD Barang, & List Penawaran.
*   [x] Optimasi Performa (Image Sizes, React Compiler).

---
**Kesimpulan**: Auct-Simply kini telah memiliki fondasi yang sangat kuat dan modern. Aplikasi siap untuk digunakan dengan performa tinggi dan pengalaman pengguna yang premium baik di sisi penawar maupun admin.