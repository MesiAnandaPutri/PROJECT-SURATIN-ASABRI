import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Calendar, User as UserIcon, Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import NotificationBell from '../Notification/NotificationBell';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import './MainLayout.css';

const MainLayout = () => {
    const location = useLocation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const getPageTitle = (path) => {
        if (path.includes('/dashboard')) return 'DASHBOARD';
        if (path.includes('/surat-masuk')) return 'SURAT MASUK';
        if (path.includes('/surat-keluar')) return 'SURAT KELUAR';
        if (path.includes('/users')) return 'MANAJEMEN USER';
        if (path.includes('/laporan')) return 'LAPORAN';
        return 'SISTEM SURATIN';
    };

    const getPageSubtitle = (path) => {
        if (path.includes('/dashboard')) return 'Selamat datang kembali di ASABRI SWALAPATRA';
        if (path.includes('/surat-masuk')) return 'Kelola surat masuk';
        if (path.includes('/surat-keluar')) return 'Kelola surat keluar';
        if (path.includes('/users')) return 'Kelola pengguna sistem';
        if (path.includes('/laporan')) return 'Laporan rekapitulasi surat';
        return '';
    };

    const title = getPageTitle(location.pathname);
    const subtitle = getPageSubtitle(location.pathname);

    const { addToast } = useToast();

    const userString = localStorage.getItem('user');
    let user = {};
    try {
        user = JSON.parse(userString || '{}');
    } catch (e) {
        console.error('Failed to parse user data');
    }
    const userName = user.name || user.nama_lengkap || 'User Internal';
    const userRole = (user.role || 'Super User').toUpperCase();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="main-layout">
            <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="main-content">
                <div className="top-bar">
                    <div className="header-left">
                        <button className="hamburger-btn" onClick={toggleSidebar}>
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="header-title">{title}</h1>
                            {subtitle && <span className="header-subtitle">{subtitle}</span>}
                        </div>
                    </div>

                    <div className="header-right">
                        <div className="date-pill">
                            <Calendar size={16} />
                            <span>
                                {currentDate.toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}, {currentDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </div>

                        <NotificationBell />
                    </div>
                </div>
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
