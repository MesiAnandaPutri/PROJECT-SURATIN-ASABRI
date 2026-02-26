import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calendar, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import './EditSuratMasuk.css';

const EditSuratMasuk = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const [options, setOptions] = useState({
        sumber_berkas: [],
        klasifikasi: [],
        tingkat: [],
        status: []
    });

    const [formData, setFormData] = useState({
        pengirim: '',
        no_surat: '',
        tanggal_terima_surat: '',
        tanggal_surat_masuk: '',
        sumber_berkas: '',
        perihal: '',
        keterangan: '',
        file: null
    });

    useEffect(() => {
        fetchOptions();
        fetchSuratDetail();
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

    const fetchSuratDetail = async () => {
        try {
            const response = await api.get(`/surat-masuk/${id}`);
            const data = response.data;
            if (data) {
                const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().split('T')[0] : '';

                setFormData({
                    pengirim: data.pengirim || '',
                    no_surat: data.no_surat || '',
                    tanggal_terima_surat: formatDate(data.tanggal_terima_surat),
                    tanggal_surat_masuk: formatDate(data.tanggal_surat_masuk),
                    sumber_berkas: data.sumber_berkas || '',
                    perihal: data.perihal || '',
                    keterangan: data.keterangan || '',
                    file: null
                });
            }
        } catch (error) {
            console.error('Error fetching surat detail:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Gagal mengambil data surat. Pastikan data ada.',
                confirmButtonColor: '#002966'
            }).then(() => {
                navigate('/surat-masuk');
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({ ...prev, file: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = new FormData();
            payload.append('pengirim', formData.pengirim);
            payload.append('no_surat', formData.no_surat);
            if (formData.tanggal_terima_surat) payload.append('tanggal_terima_surat', formData.tanggal_terima_surat);
            if (formData.tanggal_surat_masuk) payload.append('tanggal_surat_masuk', formData.tanggal_surat_masuk);
            if (formData.sumber_berkas) payload.append('sumber_berkas', formData.sumber_berkas);
            if (formData.perihal) payload.append('perihal', formData.perihal);
            if (formData.keterangan) payload.append('keterangan', formData.keterangan);

            if (formData.file) {
                payload.append('file', formData.file);
            }

            // Required for Laravel to treat it as a PUT request when using FormData
            payload.append('_method', 'PUT');

            await api.post(`/surat-masuk/${id}`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Surat masuk berhasil diperbarui!',
                confirmButtonColor: '#002966'
            }).then(() => {
                navigate('/surat-masuk');
            });
        } catch (error) {
            console.error('Error updating surat masuk:', error);
            const msg = error.response?.data?.message || 'Gagal memperbarui surat masuk.';
            Swal.fire({
                icon: 'error',
                title: 'Gagal Update',
                text: msg,
                confirmButtonColor: '#002966'
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading-container">Loading data...</div>;
    }

    return (
        <div className="tambah-surat-container">
            <div className="form-header">
                <button className="btn-back" onClick={() => navigate('/surat-masuk')}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1>Edit Surat Masuk</h1>
                    <p>Perbarui informasi surat masuk</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-card">
                <div className="form-section">
                    <div className="form-row">
                        <label>Tanggal Terima Surat</label>
                        <input
                            type="date"
                            name="tanggal_terima_surat"
                            value={formData.tanggal_terima_surat}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Tanggal Surat Masuk</label>
                        <input
                            type="date"
                            name="tanggal_surat_masuk"
                            value={formData.tanggal_surat_masuk}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Pengirim</label>
                        <input
                            type="text"
                            name="pengirim"
                            placeholder="Masukkan pengirim surat"
                            value={formData.pengirim}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Nomor Surat</label>
                        <input
                            type="text"
                            name="no_surat"
                            placeholder="Contoh: ND/001/I/2026"
                            value={formData.no_surat}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Perihal</label>
                        <input
                            type="text"
                            name="perihal"
                            placeholder="Masukkan perihal surat"
                            value={formData.perihal}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Sumber Berkas</label>
                        <div className="radio-group">
                            <label className={formData.sumber_berkas === 'internal' ? 'active' : ''}>
                                <input
                                    type="radio"
                                    name="sumber_berkas"
                                    value="internal"
                                    checked={formData.sumber_berkas === 'internal'}
                                    onChange={handleChange}
                                /> Internal
                            </label>
                            <label className={formData.sumber_berkas === 'eksternal' ? 'active' : ''}>
                                <input
                                    type="radio"
                                    name="sumber_berkas"
                                    value="eksternal"
                                    checked={formData.sumber_berkas === 'eksternal'}
                                    onChange={handleChange}
                                /> Eksternal
                            </label>
                        </div>
                    </div>

                    <div className="form-row" style={{ marginBottom: '10px' }}>
                        <label>Keterangan</label>
                        <input
                            type="text"
                            name="keterangan"
                            placeholder="Masukkan keterangan tambahan (opsional)"
                            value={formData.keterangan}
                            onChange={handleChange}
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

export default EditSuratMasuk;
