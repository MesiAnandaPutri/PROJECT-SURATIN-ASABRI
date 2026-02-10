import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Lock, Briefcase, AtSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
            alert('Akses Ditolak. Hanya Admin yang dapat menambah user.');
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await api.post('/users', formData);
            alert('User berhasil ditambahkan!');
            navigate('/users');
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
                alert(fullMsg);
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
