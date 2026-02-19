import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import './TambahSuratMasuk.css';

const TambahSuratMasuk = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState({
        sumber_berkas: [],
        klasifikasi: [],
        tingkat: [],
        status: []
    });
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        pengirim: '',
        no_surat: '',
        tanggal_terima_surat: '',
        tanggal_surat_masuk: '',
        sumber_berkas: 'internal',
        perihal: '',
        keterangan: '',
        file: null
    });

    useEffect(() => {
        fetchOptions();
    }, []);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, file: file }));
            if (errors.file) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.file;
                    return newErrors;
                });
            }
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.no_surat) newErrors.no_surat = ['Nomor surat wajib diisi'];

        if (!formData.tanggal_terima_surat) newErrors.tanggal_terima_surat = ['Tanggal terima surat wajib diisi'];
        if (!formData.tanggal_surat_masuk) newErrors.tanggal_surat_masuk = ['Tanggal surat masuk wajib diisi'];
        if (!formData.pengirim) newErrors.pengirim = ['Pengirim wajib diisi'];
        if (!formData.perihal) newErrors.perihal = ['Perihal wajib diisi'];
        if (!formData.file) newErrors.file = ['Berkas surat wajib diunggah'];

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            const data = new FormData();

            Object.keys(formData).forEach(key => {
                if (key === 'file') {
                    if (formData[key]) {
                        data.append('file', formData[key]);
                    }
                } else {
                    data.append(key, formData[key] || '');
                }
            });

            console.log('Sending request to /surat-masuk...');
            const response = await api.post('/surat-masuk', data);
            console.log('Response received:', response);

            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Surat masuk berhasil ditambahkan!',
                confirmButtonColor: '#002966',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('User confirmed. Navigating to /surat-masuk');
                    navigate('/surat-masuk');
                } else {
                    // Fallback in case of other closing methods
                    navigate('/surat-masuk');
                }
            });
        } catch (error) {
            console.error('Error adding surat masuk (Detailed):', error);
            const responseData = error.response?.data;

            if (responseData?.errors) {
                setErrors(responseData.errors);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: responseData?.message || 'Gagal menambahkan surat masuk.',
                    confirmButtonColor: '#002966'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tambah-surat-container">
            <div className="form-header">
                <button className="btn-back" onClick={() => navigate('/surat-masuk')}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1>Buat Berkas Baru</h1>
                    <p>Tambahkan dokumen surat masuk baru ke sistem</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-card">
                <div className="form-section">
                    <div className="form-row">
                        <label>Tanggal Terima Surat</label>
                        <input
                            type="date"
                            name="tanggal_terima_surat"
                            className={errors.tanggal_terima_surat ? 'input-error' : ''}
                            value={formData.tanggal_terima_surat}
                            onChange={handleChange}
                        />
                        {errors.tanggal_terima_surat && <span className="error-message">{errors.tanggal_terima_surat[0]}</span>}
                    </div>

                    <div className="form-row">
                        <label>Tanggal Surat Masuk</label>
                        <input
                            type="date"
                            name="tanggal_surat_masuk"
                            className={errors.tanggal_surat_masuk ? 'input-error' : ''}
                            value={formData.tanggal_surat_masuk}
                            onChange={handleChange}
                        />
                        {errors.tanggal_surat_masuk && <span className="error-message">{errors.tanggal_surat_masuk[0]}</span>}
                    </div>

                    <div className="form-row">
                        <label>Pengirim</label>
                        <input
                            type="text"
                            name="pengirim"
                            className={errors.pengirim ? 'input-error' : ''}
                            placeholder="Masukkan pengirim surat"
                            value={formData.pengirim}
                            onChange={handleChange}
                        />
                        {errors.pengirim && <span className="error-message">{errors.pengirim[0]}</span>}
                    </div>

                    <div className="form-row">
                        <label>Nomor Surat</label>
                        <input
                            type="text"
                            name="no_surat"
                            className={errors.no_surat ? 'input-error' : ''}
                            placeholder="Contoh: ND/001/I/2026"
                            value={formData.no_surat}
                            onChange={handleChange}
                        />
                        {errors.no_surat && <span className="error-message">{errors.no_surat[0]}</span>}
                    </div>

                    <div className="form-row">
                        <label>Perihal</label>
                        <input
                            type="text"
                            name="perihal"
                            className={errors.perihal ? 'input-error' : ''}
                            placeholder="Masukkan perihal surat"
                            value={formData.perihal}
                            onChange={handleChange}
                        />
                        {errors.perihal && <span className="error-message">{errors.perihal[0]}</span>}
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
                        {errors.sumber_berkas && <span className="error-message">{errors.sumber_berkas[0]}</span>}
                    </div>

                    <div className="form-row" style={{ marginBottom: '10px' }}>
                        <label>Keterangan</label>
                        <input
                            type="text"
                            name="keterangan"
                            className={errors.keterangan ? 'input-error' : ''}
                            placeholder="Masukkan keterangan tambahan (opsional)"
                            value={formData.keterangan}
                            onChange={handleChange}
                        />
                        {errors.keterangan && <span className="error-message">{errors.keterangan[0]}</span>}
                    </div>
                    <div className="form-row">
                        <label>Pilih Dokumen</label>
                        <input
                            type="file"
                            id="file-upload"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                        />
                        <div
                            className={`upload-box ${errors.file ? 'input-error' : ''}`}
                            onClick={() => document.getElementById('file-upload').click()}
                            style={{ border: formData.file ? '1px solid #0A2E5C' : (errors.file ? '1px solid #dc2626' : '1px dashed #CBD5E1') }}
                        >
                            <Upload size={24} className="upload-icon" color={errors.file ? '#dc2626' : (formData.file ? '#0A2E5C' : '#64748B')} />
                            <p>{formData.file ? formData.file.name : 'Klik untuk upload atau drag & drop file'}</p>
                            <span className="upload-hint">
                                {errors.file ? errors.file[0] : (formData.file ? `${(formData.file.size / (1024 * 1024)).toFixed(2)} MB` : '(Max Upload File 50 MB)')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'MENYIMPAN...' : 'TAMBAH DOKUMEN'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TambahSuratMasuk;
