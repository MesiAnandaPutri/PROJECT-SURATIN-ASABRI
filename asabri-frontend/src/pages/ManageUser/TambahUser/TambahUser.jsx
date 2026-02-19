import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Lock, Briefcase, AtSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import './TambahUser.css';

const TambahUser = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        role: ''
    });
    const [ttdFile, setTtdFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        let user = {};
        try {
            user = JSON.parse(localStorage.getItem('user') || '{}');
        } catch (error) {
            user = {};
        }

        if ((user.role || '').toLowerCase() !== 'admin') {
            Swal.fire({
                icon: 'error',
                title: 'Akses Ditolak',
                text: 'Hanya Admin yang dapat menambah user.',
                confirmButtonColor: '#002966'
            }).then(() => {
                navigate('/dashboard');
            });
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setTtdFile(file);
        if (errors.ttd_file) {
            setErrors(prev => ({ ...prev, ttd_file: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const data = new FormData();
        data.append('name', formData.name);
        data.append('username', formData.username);
        data.append('password', formData.password);
        data.append('role', formData.role);
        if (formData.role === 'pimpinan' && ttdFile) {
            data.append('ttd_file', ttdFile);
        }

        try {
            await api.post('/users', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'User berhasil ditambahkan!',
                confirmButtonColor: '#002966'
            }).then(() => {
                navigate('/users');
            });
        } catch (error) {
            console.error('Error adding user:', error);
            const msg = error.response?.data?.message || 'Gagal menambahkan user.';
            const backendErrors = error.response?.data?.errors || {};
            setErrors(backendErrors);

            let fullMsg = msg;
            if (Object.keys(backendErrors).length > 0) {
                const errorList = Object.values(backendErrors).flat();
                fullMsg += '\n' + errorList.join('\n');
            }

            if (!Object.keys(backendErrors).length) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: fullMsg,
                    confirmButtonColor: '#002966'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tambah-user-container">
            <div className="form-header">
                <button className="btn-back" onClick={() => navigate('/users')}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1>Tambah Pengguna Baru</h1>
                    <p>Buat akun baru untuk akses sistem</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-card" autoComplete="off">
                <div className="form-group">
                    <label>Nama Lengkap</label>
                    <div className={`input-wrapper ${errors.name ? 'input-error' : ''}`}>
                        <User className="input-icon" size={20} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Contoh: Budi Santoso"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </div>
                    {errors.name && <span className="error-message">{errors.name[0]}</span>}
                </div>

                <div className="form-group">
                    <label>Username / NRP</label>
                    <div className={`input-wrapper ${errors.username ? 'input-error' : ''}`}>
                        <AtSign className="input-icon" size={20} />
                        <input
                            type="text"
                            name="username"
                            placeholder="Contoh: 12345678"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="off"
                        />
                    </div>
                    {errors.username && <span className="error-message">{errors.username[0]}</span>}
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <div className={`input-wrapper ${errors.password ? 'input-error' : ''}`}>
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Minimal 6 karakter"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>
                    {errors.password && <span className="error-message">{errors.password[0]}</span>}
                </div>

                <div className="form-group">
                    <label>Role</label>
                    <div className={`input-wrapper ${errors.role ? 'input-error' : ''}`}>
                        <Briefcase className="input-icon" size={20} />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="">Pilih Role</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                            <option value="pimpinan">Pimpinan</option>
                        </select>
                    </div>
                    {errors.role && <span className="error-message">{errors.role[0]}</span>}
                </div>

                {formData.role === 'pimpinan' && (
                    <div className="form-group">
                        <label>Upload TTD (Format: PNG/JPG, Transparan lebih baik)</label>
                        <div className={`input-wrapper ${errors.ttd_file ? 'input-error' : ''}`}>
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleFileChange}
                                style={{ padding: '10px' }}
                            />
                        </div>
                        {errors.ttd_file && <span className="error-message">{errors.ttd_file[0]}</span>}
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'MENYIMPAN...' : 'TAMBAH USER'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TambahUser;
