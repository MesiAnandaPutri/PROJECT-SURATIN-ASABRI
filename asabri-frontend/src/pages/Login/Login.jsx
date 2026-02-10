import React, { useState } from 'react';
import './Login.css';
import api from '../../services/api';
import LogoAsabri2 from '../image/LogoAsabri2.png';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { addToast } = useToast();

    const validate = () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'Username wajib diisi';
        }
        if (!password) {
            newErrors.password = 'Password wajib diisi';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/login', { username: email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            navigate('/dashboard');

        } catch (err) {
            console.error('Login error details:', err);
            let msg = 'Login gagal.';
            if (err.code === 'ERR_NETWORK') {
                msg = 'Kesalahan Jaringan: Server tidak dapat dijangkau.';
            } else if (err.response) {
                if (err.response.status === 401) {
                    msg = 'Username atau password salah.';
                } else {
                    msg = err.response.data?.message || `Kesalahan Server: ${err.response.status}`;
                }
            }
            setError(msg);
            addToast(msg, 'error', 'Login Gagal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-left">
                    <div className="overlay"></div>
                    <div className="brand-watermark">
                        <img src="" alt="" className="watermark-img" />
                    </div>
                </div>

                <div className="login-right">
                    <div className="login-header">
                        <div className="logo-container">
                            <img src={LogoAsabri2} alt="ASABRI Logo" className="main-logo" />
                            <h2 className="logo-text">Asabri Suratin</h2>
                        </div>

                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        {error && <div className="error-alert">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                className={errors.email ? 'input-error' : ''}
                                placeholder="Masukkan username"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                                }}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className={errors.password ? 'input-error' : ''}
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                                }}
                            />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        <div className="form-links">
                            <a href="/forgot-password" className="forgot-password">Lupa Password?</a>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Memproses...' : 'Login'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>&copy; 2026 ASABRI - Portal Internal</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
