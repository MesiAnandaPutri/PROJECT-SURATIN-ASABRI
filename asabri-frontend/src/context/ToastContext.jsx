import React, { createContext, useState, useContext, useCallback } from 'react';
import Toast from '../components/UI/Toast';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', title = '', options = {}) => {
        const id = options.id || Date.now().toString();

        setToasts(prev => {
            const filtered = prev.filter(t => t.id !== id);
            return [...filtered, { id, message, type, title }];
        });
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container-wrapper">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        title={toast.title}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
