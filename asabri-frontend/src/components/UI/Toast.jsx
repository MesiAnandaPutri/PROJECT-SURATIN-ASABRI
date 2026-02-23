import React, { useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info, Bell } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, title }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 10000); // Auto close after 10s

        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle className="toast-icon success" size={24} />,
        error: <AlertCircle className="toast-icon error" size={24} />,
        info: <Bell className="toast-icon info" size={24} />
    };

    const friendlyTitles = {
        success: 'Saved Successfully',
        error: 'Error Occurred',
        info: 'Information'
    };

    return (
        <div className={`toast-card toast-${type}`}>
            <div className="toast-content">
                <div className="toast-icon-wrapper">
                    {icons[type]}
                </div>
                <div className="toast-text">
                    <h4 className="toast-title">{title || friendlyTitles[type]}</h4>
                    <p className="toast-message">{message}</p>
                </div>
                <button className="toast-close" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>
            <div className={`toast-progress toast-progress-${type}`}></div>
        </div>
    );
};

export default Toast;
