import React from 'react';
import { AlertCircle, Trash2, X } from 'lucide-react';
import './HapusSuratMasukModal.css';

const HapusSuratMasukModal = ({ isOpen, onClose, onConfirm, suratName }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="delete-modal-container">
                <div className="modal-header-danger">
                    <div className="header-icon">
                        <AlertCircle size={24} color="#EF4444" />
                    </div>
                    <button className="btn-close-light" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="delete-modal-body">
                    <div className="trash-icon-container">
                        <Trash2 size={48} color="#EF4444" />
                    </div>
                    <h3>Hapus Surat Masuk?</h3>
                    <p>
                        Apakah Anda yakin ingin menghapus surat <strong>{suratName}</strong>?
                        Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen.
                    </p>
                </div>

                <div className="delete-modal-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        Batal
                    </button>
                    <button className="btn-danger" onClick={onConfirm}>
                        Hapus Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HapusSuratMasukModal;
