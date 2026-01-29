# ASABRI Mail Management System - Design Prompts

## 1. Halaman Login
**Prompt:** "Design a high-fidelity login page for 'ASABRI Mail Management System'. Background color: #002B7F (Deep Blue). Central login card with white-transparent glassmorphism effect. Include ASABRI logo at the top. Primary button: #C9A227 (Gold) with deep blue text. Minimalist, secure, and professional vibe."

## 2. Dashboard Utama
**Prompt:** "Create a modern admin dashboard for ASABRI. Vertical sidebar in #002B7F (Deep Blue). Sidebar Menu Items: Dashboard, Surat Masuk, Surat Keluar, Laporan, Manajemen User. Active menu item highlighted in #C9A227 (Gold). Clean white background for the main content area. Include 4 statistics cards at the top (Total Surat, Surat Masuk, Surat Keluar, Pending) and a large 'Recent Activity' table. No charts or graphics. Typography: Inter or Montserrat Bold."

## 3. Tabel Surat Masuk
**Prompt:** "Enterprise-grade data table UI for ASABRI Incoming Mail (Surat Masuk). Header row in #002B7F. 'Add New' button in #C9A227. Columns: No, Tanggal, Tujuan, Perihal, No. Surat, Status (Badge), Detail (Button to trigger Modal Detail). Aksi Column: Includes 3 dedicated buttons: Disposisi (Send/Paper-plane icon), Edit, and Hapus. Vibe: Organized and modular. High-fidelity ASABRI branding."

## 4. Form Tambah Surat Masuk
**Prompt:** "Design a high-fidelity 'Buat Berkas Baru' (Add New Document) form. Theme: ASABRI Corporate Professional. Colors: #002B7F (Labels) and #C9A227 (Gold button). Specific Fields:
- Nomor Surat (Input)
- Tanggal Surat (Date Picker)
- Tanggal Surat Diterima (Date Picker)
- Pengirim (Input)
- Perihal (Textarea)
- Keterangan (Textarea)
- Kategori Berkas (Dropdown)
- Upload Berkas (File Upload zone)
Layout: 12-column grid, labels on left (30%), inputs on right (70%). A large Gold button 'Tambah Dokumen' at the bottom."

## 5. Tabel Surat Keluar (ASABRI Style - CRUD & Detail)
**Prompt:** "Enterprise-grade data table UI for ASABRI Outgoing Mail (Surat Keluar). Header row in #002B7F. 'Add New' button in #C9A227. Columns: No, Tanggal, Tujuan, Perihal, No. Surat, Status (Badge), Detail (Button/Icon). Aksi Column: Includes 2 dedicated buttons: Edit and Hapus. Vibe: Professional and consistent with the Surat Masuk layout. Ensure Prompt #10 modal is triggered when clicking 'Detail'."

## 6. Form Tambah Surat Keluar (ASABRI Style)
**Prompt:** "Design a high-fidelity 'Buat Surat Keluar' (Create Outgoing Mail) form that mirrors the structure of the Incoming Mail form. Theme: ASABRI Corporate Professional. Colors: #002B7F (Labels) and #C9A227 (Gold button). Specific Fields:
- Nomor Surat (Input)
- Tanggal Surat (Date Picker)
- Tanggal Surat Dikirim (Date Picker)
- Tujuan / Penerima (Input)
- Perihal (Textarea)
- Keterangan (Textarea)
- Kategori Berkas (Dropdown)
- Upload Berkas (File Upload zone)
Layout: 12-column grid, labels on left (30%), inputs on right (70%). A large Gold button 'Simpan & Kirim' at the bottom."

## 7. Halaman Rekap / Laporan
**Prompt:** "Design a modern reporting/recap page for ASABRI Mail System. Header: 'Laporan & Rekapitulasi Surat'. Filter Section: Range Date Picker (Harian, Bulanan, Periode), Dropdown 'Jenis Surat' (Semua, Masuk, Keluar), Dropdown 'Status'. Action Buttons: 'Tampilkan Laporan' (Blue) and 'Export to Excel' (Gold #C9A227). Content Area: A clean summary table showing the filtered mail list. Vibe: Professional, administrative, and data-driven."

## 8. Halaman Manajemen User
**Prompt:** "Design a 'Manage Users' page for ASABRI admin. Header: 'Manajemen Pengguna'. Action: Top-right button '+ Tambah User' (Gold #C9A227). Table Columns: No, Nama Lengkap, NRP/Username, Role (Badge: Admin/Staff), Status (Active/Inactive), Aksi (Edit, Delete, Reset Password). Vibe: Professional, secure, and organized administrative interface. Use Deep Blue (#002B7F) for header row and clean Inter typography."

## 9. Modal Disposisi
**Prompt:** "Design a high-fidelity 'Lembar Disposisi' (Disposition Form) as a standard-sized modal for ASABRI. Features:
- Header section showing No. Surat and Perihal.
- Form fields: 'Diteruskan kepada' (Checkboxes), 'Instruksi Khusus' (Dropdown/Checkboxes: Segera, Tindak Lanjuti, dll), and 'Catatan Tambahan' (Textarea).
- Footer Actions: 'Kirim' button with a Send/Paper-plane icon (Gold #C9A227) and 'Batal'.
Vibe: Formal, administrative, and distinct from the mail detail view."

## 10. Modal Detail Surat
**Prompt:** "Design a high-fidelity 'Mail Detail Modal' for ASABRI that displays ALL data from the input forms. Layout:
- Header: 'Detail Surat: [No. Surat]'.
- Body: Two panes.
  - Left Pane (45%) (Data Fields List):
    - Nomor Surat
    - Tanggal Surat
    - Tanggal Surat Diterima (untuk Surat Masuk)
    - Pengirim / Penerima
    - Kategori Berkas
    - Urgensi & Klasifikasi
    - Perihal (Full Text)
    - Keterangan (Full Text)
    - Status (Badge)
    - Riwayat Disposisi (List/Timeline)
  - Right Pane (55%): Large PDF Preview window.
- Footer: Buttons: 'Download PDF' and 'Cetak'.
Vibe: Clean, informative, and professional. Ensure the field labels match the 'Tambah Surat' forms exactly for consistency."
