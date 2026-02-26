import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import './EditSuratKeluar.css';

const EditSuratKeluar = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const [options, setOptions] = useState({});
    const [formData, setFormData] = useState({
        no_surat: '',
        tanggal_pembuatan: '',
        tujuan: '',
        kategori_berkas: '',
        klasifikasi_surat_dinas: '',
        tingkat_urgensi_penyelesaian: '',
        perihal: '',
        keterangan: '',
        file: null
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role === 'pimpinan') {
            Swal.fire({
                icon: 'error',
                title: 'Akses Ditolak',
                text: 'Pimpinan tidak dapat mengedit surat.',
                confirmButtonColor: '#002966'
            }).then(() => {
                navigate('/surat-keluar');
            });
            return;
        }

        fetchOptions();
        fetchSuratKeluarDetail();
    }, [id]);

    const fetchOptions = async () => {
        try {
            const response = await api.get('/enum-options');
            if (response.data) {
                setOptions(response.data);
            }
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const fetchSuratKeluarDetail = async () => {
        try {
            const response = await api.get(`/surat-keluar/${id}`);
            if (response.data) {
                const data = response.data;
                const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';

                setFormData({
                    no_surat: data.no_surat || '',
                    tanggal_pembuatan: formatDate(data.tanggal_pembuatan),
                    tujuan: data.tujuan || '',
                    kategori_berkas: data.kategori_berkas || '',
                    klasifikasi_surat_dinas: data.klasifikasi_surat_dinas || '',
                    tingkat_urgensi_penyelesaian: data.tingkat_urgensi_penyelesaian || '',
                    perihal: data.perihal || '',
                    keterangan: data.keterangan || '',
                    no_resi: data.no_resi || '',
                    file: null
                });
            }
        } catch (error) {
            console.error('Error fetching surat keluar detail:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Gagal mengambil data surat keluar.',
                confirmButtonColor: '#002966'
            }).then(() => {
                navigate('/surat-keluar');
            });
        } finally {
            setLoading(false);
        }
    };

    const PREFIXES = {
        'berita acara': 'BA/',
        'memo': 'Memo/',
        'mou': 'MoU/',
        'nota dinas': 'ND/',
        'pemberitahuan': 'Pem/',
        'pengumuman': 'Peng/',
        'surat dinas': 'S/',
        'surat edaran': 'SE/',
        'surat keterangan': 'SKET/',
        'surat kuasa': 'SKU/',
        'surat perintah': 'SPRIN/',
        'surat perintah perjalanan dinas': 'SPPD/',
        'surat perjanjian kerja sama': 'SPKS/',
        'tinjau skep': 'S/',
        'surat pengantar': 'P/',
        'sppi/pendaftaran keluarga': 'S/',
        'surat gaji terusan': 'S/',
    };

    const currentYear = new Date().getFullYear();
    const minDate = `${currentYear}-01-01`;
    const maxDate = `${currentYear}-12-31`;

    const handleChange = async (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setFormData(prev => ({ ...prev, file: files[0] }));
            return;
        }

        if (name === 'tanggal_pembuatan') {
            const selectedYear = new Date(value).getFullYear();
            if (selectedYear !== currentYear) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Tanggal Tidak Valid',
                    text: `Tanggal surat harus berada di tahun ${currentYear}.`,
                    confirmButtonColor: '#002966'
                });
                return;
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'kategori_berkas' && value) {
            // New logic: preserve number, change prefix
            const currentNoSurat = formData.no_surat;
            const newPrefix = PREFIXES[value.toLowerCase()];

            if (newPrefix && currentNoSurat) {
                // Find the first digit to split prefix and number/rest
                const match = currentNoSurat.match(/(\d+.*)$/);
                if (match) {
                    const numberPart = match[1];
                    const newNoSurat = newPrefix + numberPart;
                    setFormData(prev => ({ ...prev, no_surat: newNoSurat }));
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = new FormData();

            payload.append('no_surat', formData.no_surat);
            if (formData.tanggal_pembuatan) payload.append('tanggal_pembuatan', formData.tanggal_pembuatan);
            if (formData.tujuan) payload.append('tujuan', formData.tujuan);
            if (formData.kategori_berkas) payload.append('kategori_berkas', formData.kategori_berkas);
            if (formData.klasifikasi_surat_dinas) payload.append('klasifikasi_surat_dinas', formData.klasifikasi_surat_dinas);
            if (formData.tingkat_urgensi_penyelesaian) payload.append('tingkat_urgensi_penyelesaian', formData.tingkat_urgensi_penyelesaian);
            if (formData.perihal) payload.append('perihal', formData.perihal);
            if (formData.keterangan) payload.append('keterangan', formData.keterangan);
            if (formData.no_resi) payload.append('no_resi', formData.no_resi);

            if (formData.file) {
                payload.append('file', formData.file);
            }

            // Required for Laravel to treat it as a PUT request when using FormData
            payload.append('_method', 'PUT');

            await api.post(`/surat-keluar/${id}`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Surat keluar berhasil diperbarui!',
                confirmButtonColor: '#002966'
            }).then(() => {
                navigate('/surat-keluar');
            });
        } catch (error) {
            console.error('Error updating surat keluar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Update',
                text: 'Gagal memperbarui data surat keluar.',
                confirmButtonColor: '#002966'
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-container">Loading data...</div>;

    return (
        <div className="tambah-surat-container">
            <div className="form-header">
                <button className="btn-back" onClick={() => navigate('/surat-keluar')}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1>Edit Surat Keluar</h1>
                    <p>Perbarui informasi surat keluar</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-card">
                <div className="form-section">
                    <div className="form-row">
                        <label>Tanggal Pembuatan</label>
                        <input
                            type="date"
                            name="tanggal_pembuatan"
                            value={formData.tanggal_pembuatan}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <label>Kategori Berkas</label>
                        <select name="kategori_berkas" value={formData.kategori_berkas} onChange={handleChange} required>
                            <option value="">Pilih Kategori Berkas</option>
                            {(options.surat_keluar_kategori_berkas || []).map(opt => (
                                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <label>Nomor Surat</label>
                        <input
                            type="text"
                            name="no_surat"
                            value={formData.no_surat}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Tujuan / Penerima</label>
                        <input
                            type="text"
                            name="tujuan"
                            value={formData.tujuan}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Perihal</label>
                        <input
                            type="text"
                            name="perihal"
                            value={formData.perihal}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Klasifikasi Surat Dinas</label>
                        <select name="klasifikasi_surat_dinas" value={formData.klasifikasi_surat_dinas} onChange={handleChange} required>
                            <option value="">Pilih Klasifikasi</option>
                            {(options.surat_keluar_klasifikasi_surat_dinas || []).map(opt => (
                                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <label>Tingkat Urgensi Penyelesaian</label>
                        <select name="tingkat_urgensi_penyelesaian" value={formData.tingkat_urgensi_penyelesaian} onChange={handleChange} required>
                            <option value="">Pilih Tingkat</option>
                            {(options.surat_keluar_tingkat_urgensi_penyelesaian || []).map(opt => (
                                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <label>Keterangan</label>
                        <input
                            type="text"
                            name="keterangan"
                            value={formData.keterangan}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row" style={{ marginBottom: '10px' }}>
                        <label>Nomor Resi (Opsional)</label>
                        <input
                            type="text"
                            name="no_resi"
                            value={formData.no_resi || ''}
                            onChange={handleChange}
                            placeholder="Masukkan nomor resi jika sudah ada"
                        />
                    </div>

                    <div className="form-row">
                        <label>Pilih Dokumen Baru (Abaikan jika tidak ingin mengganti file)</label>
                        <div className="upload-box" style={{ padding: '24px' }}>
                            <input
                                type="file"
                                name="file"
                                onChange={handleChange}
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                className="file-input-visible"
                                id="file-upload"
                                style={{ display: 'block', margin: '0 auto', fontSize: '14px' }}
                            />
                            <div style={{ marginTop: '16px' }}>
                                <p style={{ fontSize: '14px', color: '#64748b' }}>
                                    {formData.file ? formData.file.name : 'Saat ini dokumen lama masih tersimpan'}
                                </p>
                                <span className="upload-hint">(Max Upload File 50 MB)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={submitting}>
                        {submitting ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditSuratKeluar;
