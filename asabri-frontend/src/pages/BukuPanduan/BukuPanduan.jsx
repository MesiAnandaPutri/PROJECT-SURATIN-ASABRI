import React, { useState } from 'react';
import {
    Info,
    AlertTriangle,
    Lightbulb,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Eye,
    Printer,
    Edit,
    Trash2,
    Truck,
    FileText
} from 'lucide-react';
import './BukuPanduan.css';

import imgDashboard from '../../assets/images/panduan/dashboard.png';
import imgSuratMasukList from '../../assets/images/panduan/surat-masuk-main.png';
import imgDetailSuratMasuk from '../../assets/images/panduan/detail-surat-masuk.png';
import imgTambahSuratMasuk from '../../assets/images/panduan/tambah-surat-masuk.png';
import imgSuratKeluarList from '../../assets/images/panduan/surat-keluar-main.png';
import imgDetailSuratKeluar from '../../assets/images/panduan/detail-surat-keluar.png';
import imgInputResi from '../../assets/images/panduan/input-resi.png';
import imgManajemenUser from '../../assets/images/panduan/management-user.png';
import imgDisposisi from '../../assets/images/panduan/disposisi.png';
import imgTambahSuratKeluar from '../../assets/images/panduan/tambah-surat-keluar.png'; // New Import
import imgLaporan from '../../assets/images/panduan/laporan.png';
import imgTambahUser from '../../assets/images/panduan/tambah-pengguna.png';
import imgEditUser from '../../assets/images/panduan/edit-pengguna.png';

const BukuPanduan = () => {
    // Current slide index
    const [currentIndex, setCurrentIndex] = useState(0);

    // Helper for rendering images
    const PandaunImage = ({ src, alt, caption }) => (
        <div className="panduan-image-container">
            <div className="image-frame">
                <img src={src} alt={alt} className="panduan-screenshot" />
            </div>
            {caption && <p className="image-caption">{caption}</p>}
        </div>
    );

    // --- SLIDE CONTENT COMPONENTS ---

    // 1. INTRO
    const SlideIntro = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Buku Panduan ASABRI E-Dharma</h1>
                <p className="panduan-subtitle">Panduan Lengkap Penggunaan Website Surat ASABRI E-Dharma</p>
            </div>
            <div className="panduan-section">
                <h3>Pendahuluan</h3>
                <p className="panduan-text">
                    E-Dharma (Electronic Digitalisasi Handling Administrasi & Registrasi Manajemen Arsip) adalah aplikasi berbasis web yang dirancang untuk mempermudah,
                    mempercepat, dan mengamankan pengelolaan arsip surat menyurat.
                </p>
                <div className="panduan-note">
                    <Info size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                    <strong>Info:</strong> Aplikasi ini digunakan khusus untuk kebutuhan pengelolaan surat resmi di lingkungan ASABRI Kancab Denpasar.
                </div>
                <p className="panduan-text">
                    Gunakan tombol navigasi <strong>"Berikutnya"</strong> di bawah untuk memulai tur panduan ini langkah demi langkah.
                </p>
            </div>
        </>
    );

    // 2. DASHBOARD
    const SlideDashboard = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Dashboard</h1>
            </div>
            <div className="panduan-section">
                <PandaunImage
                    src={imgDashboard}
                    alt="Tampilan Dashboard"
                    caption="Halaman Dashboard Utama"
                />

                <h3>Elemen Dashboard</h3>
                <ul className="panduan-list">
                    <li><strong>Total Surat:</strong> Menampilkan jumlah keseluruhan surat masuk dan surat keluar.</li>
                    <li><strong>Surat Masuk:</strong> Menampilkan total data surat masuk yang sudah diinput.</li>
                    <li><strong>Surat Keluar:</strong> Menampilkan total data surat keluar yang sudah diinput.</li>
                    <li><strong>Pending Masuk:</strong> Surat masuk yang belum didisposisi oleh Pimpinan (status Proses).</li>
                    <li><strong>Pending Keluar:</strong> Surat keluar yang masih berstatus Draft.</li>
                    <li><strong>Aktivitas Terbaru:</strong> Menampilkan daftar surat terbaru beserta tanggal, tipe, perihal, dan statusnya.</li>
                </ul>
            </div>
        </>
    );

    // 3. SURAT MASUK LIST
    const SlideSuratMasukList = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Daftar Surat Masuk</h1>
            </div>
            <div className="panduan-section">
                <PandaunImage
                    src={imgSuratMasukList}
                    alt="Tabel Surat Masuk"
                    caption="Halaman Daftar Surat Masuk"
                />

                <h3>Fitur Utama</h3>
                <ul className="panduan-list">
                    <li>Tersedia fitur <strong>filter tahun</strong> untuk menampilkan surat berdasarkan tahun tertentu.</li>
                    <li>Terdapat fitur <strong>pencarian</strong> untuk mencari surat berdasarkan pengirim, perihal, atau nomor surat.</li>
                    <li>Tersedia juga <strong>filter tanggal</strong> (dari–sampai) untuk menampilkan surat sesuai rentang waktu tertentu.</li>
                    <li>Data yang ditampilkan meliputi No, Nomor Surat, Tanggal Terima, Tanggal Surat, Pengirim, Perihal, dan Status.</li>
                    <li><strong>Status surat</strong> terdiri dari <strong>Proses</strong> (belum didisposisi) dan <strong>Disposisi</strong> (sudah diberikan instruksi oleh Pimpinan).</li>
                    <li>Terdapat tombol <strong>Detail</strong> untuk melihat isi surat sepenuhnya.</li>
                </ul>

                <h3>Tombol Aksi</h3>
                <ul className="panduan-list">
                    <li>
                        Pada kolom <strong>Aksi</strong>, tersedia fitur:
                        <div style={{ display: 'flex', gap: '15px', marginTop: '8px', marginBottom: '8px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#f59e0b' }}><Edit size={16} /> Edit</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#ef4444' }}><Trash2 size={16} /> Hapus</span>
                        </div>
                    </li>
                    <li>Tombol <strong>Edit</strong> dan <strong>Hapus</strong> digunakan untuk mengelola data surat.</li>
                </ul>
                <div className="panduan-note">
                    <strong>Akses:</strong> Tombol Aksi (Edit dan Hapus) hanya dapat dilakukan oleh <strong>Admin</strong> dan <strong>Staff</strong>.
                </div>
            </div>
        </>
    );

    // 4. DETAIL SURAT MASUK
    const SlideDetailSuratMasuk = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Detail Surat Masuk</h1>
            </div>
            <div className="panduan-section">
                <PandaunImage
                    src={imgDetailSuratMasuk}
                    alt="Detail Surat Masuk"
                    caption="Tampilan Detail Surat Masuk"
                />

                <h3>Fitur di Halaman Detail:</h3>
                <ul className="panduan-list">
                    <li><strong>Data Lengkap:</strong> Menampilkan seluruh informasi surat termasuk Nomor Agenda, Tanggal Terima, dan Keterangan.</li>
                    <li><strong>Preview Dokumen:</strong> Melihat langsung file surat yang di-upload tanpa perlu download.</li>
                    <li><strong>Riwayat Disposisi:</strong> Melacak perjalanan surat, siapa yang mendisposisikan, kepada siapa, dan apa instruksinya.</li>
                </ul>

                <h3>Tombol Aksi:</h3>
                <ul className="panduan-list">
                    <li><strong style={{ color: '#0ea5e9' }}><Printer size={16} style={{ verticalAlign: 'middle' }} /> Print Disposisi:</strong> Mencetak lembar disposisi untuk keperluan arsip fisik atau tanda tangan basah.</li>
                </ul>
            </div>
        </>
    );

    // 5. ADD SURAT MASUK
    const SlideSuratMasukAdd = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Menambah Surat Masuk</h1>
            </div>
            <div className="panduan-section">
                <PandaunImage
                    src={imgTambahSuratMasuk}
                    alt="Form Tambah Surat Masuk"
                    caption="Formulir Tambah Surat Masuk"
                />

                <h3>Langkah-langkah:</h3>
                <ul className="panduan-list">
                    <li><strong>Form yang diisi meliputi:</strong> Tanggal Terima Surat, Tanggal Surat Masuk, Pengirim, Nomor Surat, Perihal, Sumber Berkas (Internal/Eksternal), dan Keterangan.</li>
                    <li><strong>Fitur Upload Dokumen:</strong> Tersedia untuk mengunggah file surat (PDF/Dokumen) ke dalam sistem dan akan tersimpan di detail.</li>
                </ul>

                <div className="panduan-note">
                    <strong>Validasi:</strong> Semua field harus diisi kecuali keterangan yang bersifat opsional untuk dapat bisa menambahkan data.
                </div>
                <div className="panduan-note">
                    <strong>Akses:</strong> Menambah/Mengedit surat masuk hanya dapat dilakukan oleh <strong>Admin</strong> dan <strong>Staff</strong>.
                </div>
            </div>
        </>
    );

    // 6. DISPOSISI SURAT
    const SlideDisposisi = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Disposisi Surat</h1>
            </div>
            <div className="panduan-section">
                <PandaunImage
                    src={imgDisposisi}
                    alt="Menu Disposisi"
                    caption="Tampilan Halaman Disposisi"
                />

                <h3>Langkah Melakukan Disposisi:</h3>
                <ol className="panduan-steps">
                    <li>Klik tombol <strong>Disposisi</strong> pada surat yang ingin diteruskan.</li>
                    <li><strong>Pilih Penerima:</strong> Centang nama-nama pegawai yang akan menerima.</li>
                    <li><strong>Pilih Instruksi:</strong> Pilih perintah dari dropdown.</li>
                    <li>Klik <strong>Kirim Disposisi</strong>.</li>
                </ol>

                <div className="panduan-note">
                    <strong>Akses:</strong> Fitur Disposisi hanya tersedia untuk <strong>Pimpinan</strong>.
                </div>
            </div>
        </>
    );

    // 7. SURAT KELUAR LIST
    const SlideSuratKeluarList = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Daftar Surat Keluar</h1>
            </div>
            <div className="panduan-section">
                <PandaunImage
                    src={imgSuratKeluarList}
                    alt="Tabel Surat Keluar"
                    caption="Halaman Daftar Surat Keluar"
                />
                <h3>Fitur Utama</h3>
                <ul className="panduan-list">
                    <li>Tersedia fitur <strong>filter tahun, filter tanggal (dari–sampai), filter klasifikasi, dan filter tingkatan</strong> untuk mempermudah pencarian data.</li>
                    <li>Data yang ditampilkan meliputi Nomor Surat, Tanggal, Tujuan, Perihal, dan Status.</li>
                    <li><strong>Status surat</strong> meliputi <strong>Terkirim</strong>, <strong>Selesai</strong>, dan <strong>Draft</strong>.</li>
                    <li>Terdapat tombol <strong>Detail</strong> untuk melihat isi surat sepenuhnya dan bukti pengiriman.</li>
                </ul>

                <h3>Tombol Aksi</h3>
                <ul className="panduan-list">
                    <li>
                        Pada kolom <strong>Aksi</strong>, tersedia fitur:
                        <div style={{ display: 'flex', gap: '15px', marginTop: '8px', marginBottom: '8px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#f59e0b' }}><Edit size={16} /> Edit</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#ef4444' }}><Trash2 size={16} /> Hapus</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#3b82f6' }}><Truck size={16} /> Kirim Nomor Resi</span>
                        </div>
                    </li>
                    <li>Saat mengirim nomor resi, pengguna dapat mengunggah file bukti pengiriman.</li>
                    <li>File bukti resi yang diunggah akan tersimpan dan dapat dilihat pada menu <strong>Detail Surat Keluar</strong> sebagai bukti pengiriman.</li>
                </ul>
                <div className="panduan-note">
                    <strong>Akses:</strong> Tombol Aksi (Edit, Hapus, dan Kirim Resi) hanya dapat dilakukan oleh <strong>Admin</strong> dan <strong>Staff</strong>.
                </div>
            </div>
        </>
    );

    // 8. ADD SURAT KELUAR (NEW)
    const SlideSuratKeluarAdd = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Menambah Surat Keluar</h1>
            </div>
            <div className="panduan-section">
                <PandaunImage
                    src={imgTambahSuratKeluar}
                    alt="Form Tambah Surat Keluar"
                    caption="Formulir Tambah Surat Keluar"
                />

                <h3>Langkah-langkah:</h3>
                <ul className="panduan-list">
                    <li><strong>Form yang diisi meliputi:</strong> Tanggal Pembuatan, Kategori Berkas, Nomor Surat, Tujuan/Penerima, Perihal, Tingkat Urgensi Penyelesaian, dan Klasifikasi Surat Dinas.</li>
                    <li>Tersedia kolom <strong>Keterangan</strong> untuk menambahkan informasi tambahan (opsional).</li>
                    <li>Dapat mengunggah dokumen surat melalui fitur <strong>Pilih Dokumen</strong>.</li>
                    <li>Surat yang baru ditambahkan akan tersimpan dengan status <strong>Draft</strong> sebelum dikirim.</li>
                </ul>

                <div className="panduan-note">
                    <strong>Validasi:</strong> Semua field wajib diisi kecuali tingkat urgensi dan klasifikasi untuk menambahkan data.
                </div>
                <div className="panduan-note">
                    <strong>Akses:</strong> Menambah/Mengedit surat keluar hanya dapat dilakukan oleh <strong>Admin</strong> dan <strong>Staff</strong>.
                </div>
            </div>
        </>
    );

    // 9. DETAIL SURAT KELUAR
    const SlideDetailSuratKeluar = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Detail Surat Keluar</h1>
            </div>
            <div className="panduan-section">
                <PandaunImage
                    src={imgDetailSuratKeluar}
                    alt="Detail Surat Keluar"
                    caption="Tampilan Detail Surat Keluar"
                />

                <h3>Fitur di Halaman Detail:</h3>
                <ul className="panduan-list">
                    <li>Pada halaman <strong>Detail Surat Keluar</strong>, ditampilkan informasi lengkap surat seperti no surat, penerima, kategori berkas, nomor resi, urgensi dan klasifikasi, perihal, serta nama pengguna yang menginput surat tersebut.</li>
                    <li>Surat keluar dilengkapi dengan nomor resi dan bukti resi sebagai bukti pengiriman.</li>
                    <li>Sistem juga menyediakan fitur untuk mengunduh dokumen dan mencetak surat.</li>
                </ul>

                <h3>Tombol Aksi:</h3>
            </div>
        </>
    );

    // 10. INPUT RESI
    const SlideInputResi = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Input Resi Pengiriman</h1>
            </div>
            <div className="panduan-section">
                <PandaunImage
                    src={imgInputResi}
                    alt="Modal Input Resi"
                    caption="Form Input Resi pada Surat Keluar"
                />
                <h3>Cara Menginput Resi:</h3>
                <ol className="panduan-steps">
                    <li>Klik tombol <strong>Input Resi</strong> (Ikon Paket/Truck) pada surat keluar di tabel.</li>
                    <li>
                        <strong>Pilihan A: Ada Resi</strong>
                        <br /> Masukkan nomor resi & upload foto. Status &rarr; <strong>TERKIRIM</strong>.
                    </li>
                    <li>
                        <strong>Pilihan B: Tidak Ada Resi</strong>
                        <br /> Pilih opsi ini jika surat tidak ada no resi. Status &rarr; <strong>SELESAI</strong>.
                    </li>
                    <li>Klik <strong>Simpan</strong>.</li>
                </ol>
                <div className="panduan-note">
                    <strong>Akses:</strong> Input Resi pengiriman hanya dapat dilakukan oleh <strong>Admin</strong> dan <strong>Staff</strong>.
                </div>
            </div>
        </>
    );

    // 10A. LAPORAN
    const SlideLaporan = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Laporan</h1>
            </div>
            <div className="panduan-section">
                <PandaunImage
                    src={imgLaporan}
                    alt="Halaman Laporan"
                    caption="Halaman Laporan"
                />
                <h3>Fitur Laporan:</h3>
                <ul className="panduan-list">
                    <li>Filter laporan dapat berdasarkan periode harian, bulanan, dan tahunan.</li>
                    <li>Jenis surat dapat difilter menjadi <strong>Surat Masuk</strong> atau <strong>Surat Keluar</strong>.</li>
                    <li>Status surat dapat difilter berdasarkan <strong>Disposisi</strong>, <strong>Proses</strong>, <strong>Draft</strong>, <strong>Terkirim</strong>, dan <strong>Selesai</strong>.</li>
                    <li>Tersedia tombol <strong>Export to Excel (.xlsx)</strong> untuk mengunduh data laporan.</li>
                    <li>Bagian <strong>Data Laporan</strong> menampilkan detail surat seperti Nomor Surat, Tanggal, Jenis, Dari/Kepada, Perihal, Kategori, dan Status.</li>
                </ul>
            </div>
        </>
    );

    // 11. MANAJEMEN USER
    const SlideUserMan = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Manajemen User</h1>
            </div>
            <div className="panduan-section">
                <PandaunImage
                    src={imgManajemenUser}
                    alt="Halaman Manajemen User"
                    caption="Tampilan Kelola Pengguna"
                />

                <h3>Langkah-langkah</h3>
                <ul className="panduan-list">
                    <li>Manajemen User digunakan untuk mengelola seluruh akun pengguna dalam sistem.</li>
                    <li>Admin dapat menambah user baru, mengedit data user, dan menghapus user.</li>
                    <li>Data yang ditampilkan meliputi Nama Lengkap, Username/Email, Role, dan Status.</li>
                    <li>Role pengguna dapat diubah, misalnya dari Staff menjadi Admin atau sebaliknya.</li>
                    <li>Status akun dapat diatur menjadi Aktif atau Nonaktif sesuai kebutuhan.</li>
                </ul>

                <h3>Tombol Aksi</h3>
                <ul className="panduan-list">
                    <li>
                        Pada kolom <strong>Aksi</strong>, tersedia fitur:
                        <div style={{ display: 'flex', gap: '15px', marginTop: '8px', marginBottom: '8px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#f59e0b' }}><Edit size={16} /> Edit</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#ef4444' }}><Trash2 size={16} /> Hapus</span>
                        </div>
                    </li>
                    <li>Tombol <strong>Edit</strong> dan <strong>Hapus</strong> digunakan untuk mengelola akun pengguna.</li>
                </ul>
                <div className="panduan-note">
                    <strong>Akses:</strong> Halaman Manajemen User hanya dapat dilakukan oleh <strong>Admin</strong>.
                </div>
            </div>
        </>
    );

    // 11A. TAMBAH USER
    const SlideTambahUser = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Menambah Manajemen User</h1>
            </div>
            <div className="panduan-section">
                <PandaunImage
                    src={imgTambahUser}
                    alt="Form Tambah User"
                    caption="Formulir Tambah Pengguna Baru"
                />
                <h3>Langkah-langkah:</h3>
                <ul className="panduan-list">
                    <li>Masuk ke menu <strong>Manajemen User</strong> dan klik tombol <strong>+ Tambah User</strong>.</li>
                    <li>Isi <strong>Nama Lengkap</strong>, <strong>Username</strong>, <strong>Email</strong>, dan <strong>Role</strong> (Admin/Staff/Pimpinan).</li>
                    <li>Masukkan <strong>Password</strong> untuk akun tersebut.</li>
                    <li>Klik <strong>Tambah User</strong> untuk membuat akun baru.</li>
                </ul>
            </div>
        </>
    );

    // 11B. EDIT USER
    const SlideEditUser = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Edit Manajemen User</h1>
            </div>
            <div className="panduan-section">
                <PandaunImage
                    src={imgEditUser}
                    alt="Form Edit User"
                    caption="Formulir Edit Data User"
                />
                <h3>Langkah-langkah:</h3>
                <ul className="panduan-list">
                    <li>Klik tombol <strong>Edit</strong> (ikon pensil) pada baris nama pengguna.</li>
                    <li>Anda dapat mengubah <strong>Nama</strong>, <strong>Email</strong>, atau <strong>Role</strong> pengguna.</li>
                    <li>Klik <strong>Update</strong> untuk menyimpan perubahan.</li>
                </ul>
                <div className="panduan-note">
                    <strong>Khusus Role Pimpinan:</strong>
                    <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                        <li>Hanya Role <strong>Pimpinan</strong> yang dapat melakukan upload <strong>TTD Digital</strong> (format PNG/JPG).</li>
                        <li>TTD digital yang diunggah akan tersimpan dan digunakan untuk persetujuan atau disposisi surat.</li>
                        <li>Jika terjadi pergantian Pimpinan, Admin cukup mengganti role dan mengunggah TTD terbaru melalui upload TTD ini.</li>
                    </ul>
                </div>
            </div>
        </>
    );

    // 12. PENUTUP
    const SlideOutro = () => (
        <>
            <div className="panduan-header">
                <h1 className="panduan-title">Selesai</h1>
                <p className="panduan-subtitle">Terima Kasih</p>
            </div>
            <div className="panduan-section" style={{ textAlign: 'center' }}>
                <div style={{ margin: '40px auto', width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                    <CheckCircle size={40} />
                </div>
                <p className="panduan-text">
                    Anda telah mempelajari seluruh fitur Aplikasi Website ASABRI E-Dharma.
                </p>
            </div>
        </>
    );


    // --- SLIDES CONFIGURATION ---
    const slides = [
        { id: 'intro', component: <SlideIntro /> },
        { id: 'dashboard', component: <SlideDashboard /> },
        { id: 'surat-masuk-list', component: <SlideSuratMasukList /> },
        { id: 'surat-masuk-detail', component: <SlideDetailSuratMasuk /> },
        { id: 'surat-masuk-add', component: <SlideSuratMasukAdd /> },
        { id: 'surat-keluar-list', component: <SlideSuratKeluarList /> },
        { id: 'surat-keluar-add', component: <SlideSuratKeluarAdd /> },
        { id: 'surat-keluar-detail', component: <SlideDetailSuratKeluar /> },
        { id: 'input-resi', component: <SlideInputResi /> },
        { id: 'laporan', component: <SlideLaporan /> },
        { id: 'manajemen-user', component: <SlideUserMan /> },
        { id: 'tambah-user', component: <SlideTambahUser /> },
        { id: 'edit-user', component: <SlideEditUser /> },
        { id: 'disposisi', component: <SlideDisposisi /> },
        { id: 'outro', component: <SlideOutro /> }
    ];

    const currentSlide = slides[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === slides.length - 1;

    const prevSlide = () => {
        if (!isFirst) setCurrentIndex(prev => prev - 1);
    };

    const nextSlide = () => {
        if (!isLast) setCurrentIndex(prev => prev + 1);
    };

    return (
        <div className="buku-panduan-container">
            {/* Main Slide Content */}
            <div className="panduan-content-area">
                {currentSlide.component}
            </div>

            {/* Bottom Navigation Bar */}
            <div className="panduan-navigation">
                <div className="nav-progress">
                    Halaman {currentIndex + 1} dari {slides.length}
                </div>
                <div className="nav-buttons">
                    <button
                        className={`btn-nav prev ${isFirst ? 'disabled' : ''}`}
                        onClick={prevSlide}
                        disabled={isFirst}
                    >
                        <ChevronLeft size={20} />
                        <span>Kembali</span>
                    </button>
                    <button
                        className={`btn-nav next ${isLast ? 'disabled' : ''}`}
                        onClick={nextSlide}
                        disabled={isLast}
                    >
                        <span>{isLast ? 'Selesai' : 'Berikutnya'}</span>
                        {!isLast && <ChevronRight size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BukuPanduan;
