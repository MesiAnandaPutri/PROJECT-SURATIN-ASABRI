import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import './EditSuratKeluar.css';

const EditSuratKeluar = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
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
            alert('Akses Ditolak. Pimpinan tidak dapat mengedit surat.');
            navigate('/surat-keluar');
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
            alert('Gagal mengambil data surat keluar.');
            navigate('/surat-keluar');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'kategori_berkas' && value) {
            try {
                const response = await api.get(`/surat-keluar-next-number?category=${value}`);
                if (response.data && response.data.number) {
                    setFormData(prev => ({ ...prev, no_surat: response.data.number }));
                }
            } catch (error) {
                console.error('Error fetching next number:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...formData };
            delete payload.file;

            await api.put(`/surat-keluar/${id}`, payload);
            alert('Surat keluar berhasil diperbarui!');
            navigate('/surat-keluar');
        } catch (error) {
            console.error('Error updating surat keluar:', error);
            alert('Gagal memperbarui data surat keluar.');
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

                    <div className="form-row">
                        <label>Nomor Resi (Opsional)</label>
                        <input
                            type="text"
                            name="no_resi"
                            value={formData.no_resi || ''}
                            onChange={handleChange}
                            placeholder="Masukkan nomor resi jika sudah ada"
                        />
                    </div>
                </div>
                <div className="form-section">
                    <h2 className="section-title">DOKUMEN</h2>
                    <div className="form-row">
                        <label>Pilih Dokumen</label>
                        <div className="upload-box">
                            <Upload size={24} className="upload-icon" />
                            <p>Klik untuk upload atau drag & drop file</p>
                            <span className="upload-hint">(Max Upload File 50 MB)</span>
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
