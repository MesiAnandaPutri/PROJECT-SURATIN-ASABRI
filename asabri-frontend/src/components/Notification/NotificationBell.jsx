import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './NotificationBell.css';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data);

            // Calculate unread from list or fetch separate count
            const unread = response.data.filter(n => !n.is_read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await api.get('/notifications/unread-count');
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Poll every 5 seconds for near real-time updates
        const interval = setInterval(async () => {
            try {
                const response = await api.get('/notifications');
                const latestData = response.data;
                const newUnreadCount = latestData.filter(n => !n.is_read).length;

                setNotifications(prev => {
                    if (prev.length > 0 && latestData.length > 0) {
                        const lastId = prev[0].id;
                        const latestId = latestData[0].id;

                        if (latestId !== lastId) {
                            window.dispatchEvent(new CustomEvent('new-notification', { detail: latestData[0] }));
                        }
                    } else if (prev.length === 0 && latestData.length > 0) {
                        window.dispatchEvent(new CustomEvent('new-notification', { detail: latestData[0] }));
                    }
                    return latestData;
                });

                setUnreadCount(newUnreadCount);
            } catch (error) {
                console.error('Error polling notifications:', error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.is_read) {
                await api.put(`/notifications/${notification.id}/read`);
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
            }

            setIsOpen(false);

            if (notification.surat_masuk_id) {
                navigate('/surat-masuk', {
                    state: { targetSuratId: notification.surat_masuk_id }
                });
            } else if (notification.surat_keluar_id) {
                navigate('/surat-keluar', {
                    state: { targetSuratId: notification.surat_keluar_id }
                });
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    return (
        <div className="notification-container" ref={dropdownRef}>
            <div className="notification-bell-wrapper" onClick={() => setIsOpen(!isOpen)}>
                <Bell size={20} className="notification-bell" />
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </div>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h4>Notifikasi</h4>
                        <button className="mark-all-btn" onClick={handleMarkAllRead}>
                            Tandai semua dibaca
                        </button>
                    </div>
                    <ul className="notification-list">
                        {notifications.length === 0 ? (
                            <li className="notification-empty">Tidak ada notifikasi</li>
                        ) : (
                            notifications.map((notification) => (
                                <li
                                    key={notification.id}
                                    className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-content-wrapper">
                                        <div className="notification-text">
                                            <span className="notification-title">{notification.title}</span>
                                            <span className="notification-message">{notification.message}</span>
                                            <span className="notification-time">
                                                {new Date(notification.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        {!notification.is_read && <span className="unread-dot"></span>}
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
