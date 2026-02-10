import React, { useState, useEffect } from 'react';
import { X, Truck } from 'lucide-react';
import api from '../../../services/api';
import './InputResiModal.css';

const InputResiModal = ({ isOpen, onClose, onSuccess, surat }) => {
    const [noResi, setNoResi] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && surat) {
            setNoResi(surat.no_resi || '');
        }
    }, [isOpen, surat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put(`/surat-keluar/${surat.id}`, {
                ...surat,
                no_resi: noResi
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating resi:', error);
            alert('Gagal mengupdate nomor resi.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !surat) return null;

    return (
        <div className="modal-overlay">
            <div className="resi-modal-container">
                <div className="modal-header">
                    <h2>Input Nomor Resi</h2>
                    <button className="btn-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <p className="surat-info">Surat Ke: <strong>{surat.tujuan}</strong> ({surat.no_surat})</p>

                    <div className="form-group">
                        <label>Nomor Resi / Bukti Pengiriman</label>
                        <div className="input-with-icon">
                            <Truck size={20} className="input-icon" />
                            <input
                                type="text"
                                value={noResi}
                                onChange={(e) => setNoResi(e.target.value)}
                                placeholder="Masukkan nomor resi..."
                                className="resi-input"
                                autoFocus
                            />
                        </div>
                        <small className="help-text">
                            Mengisi nomor resi akan otomatis mengubah status menjadi <strong>Terkirim</strong>.
                        </small>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                            Batal
                        </button>
                        <button type="submit" className="btn-submit-resi" disabled={loading}>
                            {loading ? 'Menyimpan...' : 'Simpan Resi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InputResiModal;
