import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Inbox, Send, FileBarChart, Users, LogOut, X } from 'lucide-react';
import Swal from 'sweetalert2';
import './Sidebar.css';
import LogoAsabri2 from '../../pages/image/LogoAsabri2.png';
import AsabriText from '../../pages/image/Asabri.png';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    let user = {};
    try {
        user = JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
        console.error('Error parsing user data:', error);
        user = {};
    }
    const isAdmin = (user.role || '').toLowerCase() === 'admin';

    const displayName = user.nama_lengkap || user.name || user.username || 'User';
    const userRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Staff';
    const userInitial = displayName.charAt(0).toUpperCase();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Keluar dari Sistem?',
            text: 'Apakah Anda yakin ingin keluar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#002966',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Keluar',
            cancelButtonText: 'Batal',
            borderRadius: '12px',
        });

        if (result.isConfirmed) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header-row">
                <div className="sidebar-logo-container">
                    <div className="logo-box">
                        <img src={LogoAsabri2} alt="ASABRI Logo" className="sidebar-logo" />
                    </div>
                    <div className="sidebar-brand-text">
                        <img src={AsabriText} alt="ASABRI" className="sidebar-brand-img" />
                    </div>
                </div>
                <button className="sidebar-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/surat-masuk" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Inbox size={20} />
                    <span>Surat Masuk</span>
                </NavLink>

                <NavLink to="/surat-keluar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Send size={20} />
                    <span>Surat Keluar</span>
                </NavLink>

                <NavLink to="/laporan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <FileBarChart size={20} />
                    <span>Laporan</span>
                </NavLink>

                {isAdmin && (
                    <>
                        <div className="nav-group-title">Admin</div>
                        <NavLink to="/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Users size={20} />
                            <span>Manajemen User</span>
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">{userInitial}</div>
                    <div className="user-info">
                        <h4>{displayName}</h4>
                        <p>{userRole}</p>
                    </div>
                    <button
                        type="button"
                        className="logout-btn"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
