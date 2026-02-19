import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import './TambahSuratKeluar.css';

const TambahSuratKeluar = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState({});
    const [errors, setErrors] = useState({});
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
                text: 'Pimpinan tidak dapat membuat surat.',
                confirmButtonColor: '#002966'
            }).then(() => {
                navigate('/surat-keluar');
            });
            return;
        }

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

    const currentYear = new Date().getFullYear();
    const minDate = `${currentYear}-01-01`;
    const maxDate = `${currentYear}-12-31`;

    const handleChange = async (e) => {
        const { name, value } = e.target;

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


        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        if (name === 'kategori_berkas' || name === 'tanggal_pembuatan') {
            const category = name === 'kategori_berkas' ? value : formData.kategori_berkas;
            const date = name === 'tanggal_pembuatan' ? value : formData.tanggal_pembuatan;

            if (category) {
                try {
                    const response = await api.get(`/surat-keluar-next-number?category=${category}&date=${date}`);
                    if (response.data && response.data.number) {
                        setFormData(prev => ({ ...prev, no_surat: response.data.number }));
                    }
                } catch (error) {
                    console.error('Error fetching next number:', error);
                }
            }
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFormData(prev => ({ ...prev, file: selectedFile }));
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
        if (!formData.tanggal_pembuatan) newErrors.tanggal_pembuatan = ['Tanggal pembuatan wajib diisi'];
        if (!formData.kategori_berkas) newErrors.kategori_berkas = ['Kategori berkas wajib dipilih'];
        if (!formData.tujuan) newErrors.tujuan = ['Tujuan / Penerima wajib diisi'];
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

            await api.post('/surat-keluar', data);
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Surat keluar berhasil ditambahkan!',
                confirmButtonColor: '#002966'
            }).then(() => {
                navigate('/surat-keluar');
            });
        } catch (error) {
            console.error('Error adding surat keluar:', error);
            const responseData = error.response?.data;

            if (responseData?.errors) {
                setErrors(responseData.errors);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: responseData?.message || 'Gagal menambahkan surat keluar.',
                    confirmButtonColor: '#002966'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const renderOptions = (optionList) => {
        if (!Array.isArray(optionList)) return null;
        return optionList.map(opt => (
            <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
        ));
    };

    return (
        <div className="tambah-surat-container">
            <div className="form-header">
                <button className="btn-back" onClick={() => navigate('/surat-keluar')}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1>Buat Surat Keluar</h1>
                    <p>Tambahkan dokumen surat keluar baru ke sistem</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-card">
                <div className="form-section">
                    <div className="form-row">
                        <label>Tanggal Pembuatan</label>
                        <input
                            type="date"
                            name="tanggal_pembuatan"
                            className={errors.tanggal_pembuatan ? 'input-error' : ''}
                            value={formData.tanggal_pembuatan}
                            onChange={handleChange}
                        />
                        {errors.tanggal_pembuatan && <span className="error-message">{errors.tanggal_pembuatan[0]}</span>}
                    </div>

                    <div className="form-row">
                        <label>Kategori Berkas</label>
                        <select
                            name="kategori_berkas"
                            className={errors.kategori_berkas ? 'input-error' : ''}
                            value={formData.kategori_berkas}
                            onChange={handleChange}
                        >
                            <option value="">Pilih Kategori Berkas</option>
                            {renderOptions(options.surat_keluar_kategori_berkas)}
                        </select>
                        {errors.kategori_berkas && <span className="error-message">{errors.kategori_berkas[0]}</span>}
                    </div>

                    <div className="form-row">
                        <label>Nomor Surat</label>
                        <input
                            type="text"
                            name="no_surat"
                            className={errors.no_surat ? 'input-error' : ''}
                            placeholder="Contoh: NO/001/I/2026"
                            value={formData.no_surat}
                            onChange={handleChange}
                        />
                        {errors.no_surat && <span className="error-message">{errors.no_surat[0]}</span>}
                    </div>

                    <div className="form-row">
                        <label>Tujuan / Penerima</label>
                        <input
                            type="text"
                            name="tujuan"
                            className={errors.tujuan ? 'input-error' : ''}
                            placeholder="Contoh: Kementerian Pertahanan RI"
                            value={formData.tujuan}
                            onChange={handleChange}
                        />
                        {errors.tujuan && <span className="error-message">{errors.tujuan[0]}</span>}
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
                        <label>Tingkat Urgensi Penyelesaian</label>
                        <select
                            name="tingkat_urgensi_penyelesaian"
                            className={errors.tingkat_urgensi_penyelesaian ? 'input-error' : ''}
                            value={formData.tingkat_urgensi_penyelesaian}
                            onChange={handleChange}
                        >
                            <option value="">Pilih Tingkat</option>
                            {renderOptions(options.surat_keluar_tingkat_urgensi_penyelesaian)}
                        </select>
                        {errors.tingkat_urgensi_penyelesaian && <span className="error-message">{errors.tingkat_urgensi_penyelesaian[0]}</span>}
                    </div>

                    <div className="form-row">
                        <label>Klasifikasi Surat Dinas</label>
                        <select
                            name="klasifikasi_surat_dinas"
                            className={errors.klasifikasi_surat_dinas ? 'input-error' : ''}
                            value={formData.klasifikasi_surat_dinas}
                            onChange={handleChange}
                        >
                            <option value="">Pilih Klasifikasi</option>
                            {renderOptions(options.surat_keluar_klasifikasi_surat_dinas)}
                        </select>
                        {errors.klasifikasi_surat_dinas && <span className="error-message">{errors.klasifikasi_surat_dinas[0]}</span>}
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
                        <div
                            className={`upload-box ${formData.file ? 'has-file' : ''} ${errors.file ? 'input-error' : ''}`}
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            <input
                                type="file"
                                id="file-input"
                                hidden
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                            />
                            <Upload size={24} className="upload-icon" />
                            {formData.file ? (
                                <div className="file-info">
                                    <p className="file-name">{formData.file.name}</p>
                                    <p className="file-size">{(formData.file.size / 1024).toFixed(2)} KB</p>
                                </div>
                            ) : (
                                <>
                                    <p>{errors.file ? <span className="error-message" style={{ margin: 0 }}>{errors.file[0]}</span> : 'Klik untuk upload atau drag & drop file'}</p>
                                    <span className="upload-hint">(Max Upload File 50 MB)</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'MENYIMPAN & MENGIRIM...' : 'SIMPAN & KIRIM'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TambahSuratKeluar;
