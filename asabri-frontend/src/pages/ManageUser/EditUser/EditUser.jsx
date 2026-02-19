
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Lock, Briefcase, AtSign, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import './EditUser.css';

const EditUser = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        role: '',
        status: 'aktif'
    });
    const [ttdFile, setTtdFile] = useState(null);
    const [currentTtdPath, setCurrentTtdPath] = useState(null);

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
                text: 'Hanya Admin yang dapat mengedit user.',
                confirmButtonColor: '#002966'
            }).then(() => {
                navigate('/dashboard');
            });
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${id}`);
                const userData = response.data;
                setFormData({
                    name: userData.nama_lengkap || userData.name,
                    username: userData.username,
                    role: userData.role,
                    status: (userData.status || 'aktif').toLowerCase(),
                    password: ''
                });
                if (userData.ttd_path) {
                    setCurrentTtdPath(userData.ttd_path);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Gagal mengambil data user.',
                    confirmButtonColor: '#002966'
                }).then(() => {
                    navigate('/users');
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, navigate]);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        setTtdFile(file);
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = ['Nama lengkap wajib diisi'];
        if (!formData.username.trim()) newErrors.username = ['Username / NRP wajib diisi'];
        if (formData.password && formData.password.length < 6) {
            newErrors.password = ['Password minimal 6 karakter'];
        }
        if (!formData.role) newErrors.role = ['Role wajib dipilih'];

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setSaving(true);

        const dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('username', formData.username);
        dataToSend.append('role', formData.role);
        dataToSend.append('status', formData.status);
        if (formData.password) {
            dataToSend.append('password', formData.password);
        }

        // Append _method PUT needed for Laravel multipart/form-data update
        dataToSend.append('_method', 'PUT');

        if (formData.role === 'pimpinan' && ttdFile) {
            dataToSend.append('ttd_file', ttdFile);
        }

        try {
            await api.post(`/users/${id}`, dataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data user berhasil diperbarui!',
                confirmButtonColor: '#002966'
            }).then(() => {
                navigate('/users');
            });
        } catch (error) {
            console.error('Error updating user:', error);
            const responseData = error.response?.data;
            if (responseData?.errors) {
                setErrors(responseData.errors);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: responseData?.message || 'Gagal memperbarui data user.',
                    confirmButtonColor: '#002966'
                });
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading-container">Memuat data...</div>;
    }

    return (
        <div className="edit-user-container">
            <div className="form-header">
                <button className="btn-back" onClick={() => navigate('/users')}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1>Edit Pengguna</h1>
                    <p>Perbarui informasi akun pengguna</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-card" autoComplete="off">
                <div className="form-group">
                    <label>Nama Lengkap</label>
                    <div className={`input-wrapper ${errors.name ? 'input-error' : ''} `}>
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
                    <div className={`input-wrapper ${errors.username ? 'input-error' : ''} `}>
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
                    <label>Password (Kosongkan jika tidak ingin mengubah)</label>
                    <div className={`input-wrapper ${errors.password ? 'input-error' : ''} `}>
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
                    <div className={`input-wrapper ${errors.role ? 'input-error' : ''} `}>
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

                <div className="form-group">
                    <label>Status Pengguna</label>
                    <div className={`input-wrapper ${errors.status ? 'input-error' : ''} `}>
                        <Briefcase className="input-icon" size={20} />
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="aktif">Aktif</option>
                            <option value="nonaktif">Nonaktif</option>
                        </select>
                    </div>
                </div>

                {formData.role === 'pimpinan' && (
                    <div className="form-group">
                        <label>Upload TTD Baru (Format: PNG/JPG)</label>
                        {currentTtdPath && (
                            <div style={{ marginBottom: '10px' }}>
                                <p style={{ fontSize: '12px', color: '#666' }}>TTD Saat Ini:</p>
                                <img src={currentTtdPath} alt="Current TTD" style={{ maxHeight: '60px', border: '1px solid #ccc' }} />
                            </div>
                        )}
                        <div className={`input-wrapper ${errors.ttd_file ? 'input-error' : ''} `}>
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
                        {loading ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUser;
