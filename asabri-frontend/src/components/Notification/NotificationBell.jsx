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
    const latestIdRef = useRef(0);

    const audioCtxRef = useRef(null);

    // Unlock AudioContext on first user interaction (browser autoplay policy)
    // Initialize and Unlock AudioContext
    useEffect(() => {
        const initAudio = () => {
            if (!audioCtxRef.current) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    audioCtxRef.current = new AudioContext();
                }
            }
        };

        const unlock = () => {
            initAudio();
            if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
        };

        // Try to initialize immediately (might be suspended)
        initAudio();

        window.addEventListener('click', unlock, { once: false });
        window.addEventListener('keydown', unlock, { once: false });

        return () => {
            window.removeEventListener('click', unlock);
            window.removeEventListener('keydown', unlock);
        };
    }, []);

    const playNotificationSound = () => {
        try {
            // Ensure context exists
            if (!audioCtxRef.current) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    audioCtxRef.current = new AudioContext();
                }
            }

            const ctx = audioCtxRef.current;
            if (!ctx) return;
            if (ctx.state === 'suspended') ctx.resume();

            const now = ctx.currentTime;

            // First tone
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(880, now);
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc1.start(now);
            osc1.stop(now + 0.3);

            // Second tone (slightly higher, delayed)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1100, now + 0.15);
            gain2.gain.setValueAtTime(0.25, now + 0.15);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            osc2.start(now + 0.15);
            osc2.stop(now + 0.5);
        } catch (e) {
            // Silently fail if audio is not supported
        }
    };

    const processNotifications = (data) => {
        // Ensure data is sorted by ID descending (newest first)
        const sortedData = [...data].sort((a, b) => b.id - a.id);

        if (sortedData.length > 0) {
            const currentLatestId = sortedData[0].id;

            // Handle initial load (login)
            if (latestIdRef.current === 0) {
                const unreadItems = sortedData.filter(n => !n.is_read);
                if (unreadItems.length > 0) {
                    // Play sound once for all unread
                    playNotificationSound();

                    // Show up to 3 most recent unread as individual toasts
                    // Reverse so they appear in chronological order (oldest of the 3 first)
                    const toShow = unreadItems.slice(0, 3).reverse();
                    toShow.forEach(item => {
                        window.dispatchEvent(new CustomEvent('new-notification', { detail: item }));
                    });

                    // If there are more than 3, show a summary
                    if (unreadItems.length > 3) {
                        setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('new-notification', {
                                detail: {
                                    id: `summary-${Date.now()}`,
                                    title: 'Notifikasi Lainnya',
                                    message: `Anda memiliki ${unreadItems.length - 3} notifikasi lain yang belum dibaca.`
                                }
                            }));
                        }, 500); // Small delay after individual toasts
                    }
                }
                latestIdRef.current = currentLatestId;
            }
            // Handle new notifications during polling
            else if (currentLatestId > latestIdRef.current) {
                // Current behavior: show only the very latest one
                window.dispatchEvent(new CustomEvent('new-notification', { detail: sortedData[0] }));
                playNotificationSound();
                latestIdRef.current = currentLatestId;
            }
        }

        return sortedData;
    };

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            const sorted = processNotifications(response.data);
            setNotifications(sorted);

            // Calculate unread from list or fetch separate count
            const unread = sorted.filter(n => !n.is_read).length;
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
        fetchUnreadCount();

        // Poll every 5 seconds for near real-time updates
        const interval = setInterval(async () => {
            try {
                // Fetch notifications list (for dropdown display)
                const response = await api.get('/notifications');
                const sorted = processNotifications(response.data);
                setNotifications(sorted);

                // Fetch true unread count from dedicated endpoint (not capped by list limit)
                const countResponse = await api.get('/notifications/unread-count');
                setUnreadCount(countResponse.data.count);
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
