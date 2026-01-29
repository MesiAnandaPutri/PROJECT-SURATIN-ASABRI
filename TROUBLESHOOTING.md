# ⚠️ MASALAH PHP VERSION & SOLUSI

## 🔴 Root Cause
XAMPP Anda menggunakan **PHP 8.0.30**, tapi dependency terbaru Laravel memerlukan **PHP 8.2+**  
Error: `PHP Parse error in symfony/console/Output/AnsiColorMode.php line 20`

---

## ✅ SOLUSI 1: Update PHP di XAMPP (RECOMMENDED)

### Download & Install PHP 8.2
1. Download PHP 8.2 untuk Windows: https://windows.php.net/download/
   - Pilih: **PHP 8.2.x VC15 x64 Thread Safe** (ZIP)
   
2. Extract ke folder baru: `D:\xampp\php82`

3. Update `start_server.bat`:
   ```bat
   set PHP_PATH=D:\xampp\php82\php.exe
   ```

4. Jalankan ulang `fix_vendor.bat`

---

## ✅ SOLUSI 2: Manual Database Setup (QUICK FIX)

Jika tidak bisa install PHP baru, setup database manual via XAMPP phpMyAdmin:

### 1. Buka phpMyAdmin
   - Browser: `http://localhost/phpmyadmin`
   - Login menggunakan MySQL credentials Anda

### 2. Buat Database
   ```sql
   CREATE DATABASE IF NOT EXISTS `asabri_mail`;
   USE `asabri_mail`;
   ```

### 3. Run SQL Script
   Copy paste SQL script di bawah ini ke phpMyAdmin SQL tab:

```sql
-- Create personal_access_tokens table (untuk Sanctum authentication)
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create users table
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `nrp` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff','pimpinan') NOT NULL DEFAULT 'staff',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_nrp_unique` (`nrp`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create categories table
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` enum('masuk','keluar','both') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create surat_masuk table
CREATE TABLE `surat_masuk` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nomor_surat` varchar(100) NOT NULL,
  `tanggal_surat` date NOT NULL,
  `tanggal_terima` date NOT NULL,
  `perihal` text NOT NULL,
  `pengirim` varchar(255) NOT NULL,
  `penerima` varchar(255) NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `priority` enum('rendah','sedang','tinggi') NOT NULL DEFAULT 'sedang',
  `status` enum('belum_dibaca','sudah_dibaca','diproses','selesai') NOT NULL DEFAULT 'belum_dibaca',
  `file_path` varchar(255) DEFAULT NULL,
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `surat_masuk_nomor_surat_unique` (`nomor_surat`),
  KEY `surat_masuk_category_id_foreign` (`category_id`),
  CONSTRAINT `surat_masuk_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert test users (password untuk semua: "password")
INSERT INTO `users` (`name`, `nrp`, `email`, `password`, `role`, `status`, `created_at`, `updated_at`) VALUES
('Administrator', 'admin123', 'admin@asabri.co.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active', NOW(), NOW()),
('Staf Tata Usaha', 'staff01', 'staff@asabri.co.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff', 'active', NOW(), NOW()),
('Kepala Divisi', 'pimpinan01', 'pimpinan@asabri.co.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pimpinan', 'active', NOW(), NOW());

-- Insert categories
INSERT INTO `categories` (`name`, `type`, `created_at`, `updated_at`) VALUES
('Surat Keputusan', 'both', NOW(), NOW()),
('Nota Dinas', 'both', NOW(), NOW()),
('Surat Perintah', 'keluar', NOW(), NOW()),
('Undangan', 'masuk', NOW(), NOW()),
('Surat Edaran', 'both', NOW(), NOW()),
('Laporan Berkala', 'masuk', NOW(), NOW());
```

### 4. Cek Database
- Pastikan ada 6 tables: `personal_access_tokens`, `users`, `categories`, `surat_masuk`, dll
- Pastikan ada 3 users dan 6 categories

---

## ✅ SOLUSI 3: Gunakan Laragon (Alternative to XAMPP)

Laragon sudah include PHP 8.2+ by default:
1. Download: https://laragon.org/download/
2. Install Laragon
3. Update batch files untuk gunakan Laragon PHP path
4. Laragon lebih mudah untuk switch PHP versions

---

## 🎯 Setelah Database Ready

1. **Generate Application Key**:
   - Buka `.env`
   - Pastikan ada line: `APP_KEY=base64:...`
   - Jika kosong, isi manual dengan random 32 character string

2. **Start Server**:
   - Double-click: `start_server.bat`
   - Server jalan di: `http://127.0.0.1:8000`

3. **Test API di Postman**:
   - Request: **POST** `http://127.0.0.1:8000/api/login`
   - Body:
     ```json
     {
         "email": "admin@asabri.co.id",
         "password": "password"
     }
     ```
   - Expect: Token + user data

---

## 📞 Pilih Solusi Anda

**Jika punya akses install software baru**:  
→ Gunakan **SOLUSI 1** atau **SOLUSI 3**

**Jika tidak bisa install dan butuh quick fix**:  
→ Gunakan **SOLUSI 2** (Manual DB Setup)

Kasih tahu saya solusi mana yang akan Anda gunakan!
