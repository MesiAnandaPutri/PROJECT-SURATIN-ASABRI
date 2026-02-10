import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './HapusUser.css';

const HapusUser = ({ isOpen, onClose, onConfirm, userName, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="hapus-modal-overlay">
            <div className="hapus-modal-content">
                <div className="hapus-icon-wrapper">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="hapus-title">Hapus Pengguna?</h2>
                <p className="hapus-message">
                    Apakah Anda yakin ingin menghapus pengguna <strong>{userName}</strong>?
                    Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="hapus-actions">
                    <button
                        className="btn-cancel"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Batal
                    </button>
                    <button
                        className="btn-confirm-delete"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Menghapus...' : 'Hapus User'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HapusUser;
