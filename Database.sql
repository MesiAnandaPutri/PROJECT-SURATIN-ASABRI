CREATE DATABASE asabri_suratin

USE asabri_suratin;

-- ===============================
-- TABLE: users
-- ===============================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','staff','pimpinan') NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===============================
-- TABLE: surat_keluar
-- ===============================
CREATE TABLE surat_keluar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sumber_berkas ENUM('internal','eksternal') NOT NULL,
    kirim_sebagai VARCHAR(255) NOT NULL,
    tanggal_pembuatan DATE NOT NULL,
    kategori_berkas ENUM(
        'berita acara','format','keputusan','memo','mou','nota dinas',
        'pemberitahuan','pengumuman','peraturan','petunjuk pelaksana',
        'rahasia','risalah rapat','sppi/pendaftaran keluarga','surat dinas',
        'surat edaran','surat gaji terusan','surat keterangan','surat kuasa',
        'surat perintah','surat perintah perjalanan dinas',
        'surat perjanjian kerja sama','tinjau skep'
    ) NOT NULL,
    no_surat VARCHAR(100) NOT NULL,
    status ENUM('terkirim','draft') NOT NULL,
    perihal TEXT,
    tingkat_urgensi_penyelesaian ENUM('tinggi','sedang','rendah') NOT NULL,
    klasifikasi_surat_dinas ENUM('biasa','terbatas','rahasia','sangat rahasia') NOT NULL,
    keterangan TEXT,
    dokumen VARCHAR(255),
    nama_lampiran VARCHAR(255),
    lampiran VARCHAR(255),
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ===============================
-- TABLE: surat_masuk
-- ===============================
CREATE TABLE surat_masuk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pengirim VARCHAR(255) NOT NULL,
    dari_tanggal DATE NOT NULL,
    sampai_tanggal DATE NOT NULL,
    perihal TEXT,
    no_surat VARCHAR(100) NOT NULL,
    status ENUM('proses','selesai','disposisi') NOT NULL,
    klasifikasi ENUM('biasa','terbatas','rahasia','sangat rahasia') NOT NULL,
    tingkat ENUM('tinggi','sedang','rendah') NOT NULL,
    sumber_berkas ENUM(
        'berita acara','format','keputusan','memo','mou','nota dinas',
        'pemberitahuan','pengumuman','peraturan','petunjuk pelaksana',
        'rahasia','risalah rapat','sppi/pendaftaran keluarga','surat dinas',
        'surat edaran','surat gaji terusan','surat keterangan','surat kuasa',
        'surat perintah','surat perintah perjalanan dinas',
        'surat perjanjian kerja sama','tinjau skep'
    ) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;