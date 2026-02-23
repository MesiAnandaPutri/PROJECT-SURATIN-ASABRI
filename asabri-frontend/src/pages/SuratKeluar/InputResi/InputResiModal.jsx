import React, { useState, useEffect } from 'react';
import { X, Truck, PackageCheck, PackageX } from 'lucide-react';
import api from '../../../services/api';
import './InputResiModal.css';

const InputResiModal = ({ isOpen, onClose, onSuccess, surat }) => {
    const [pilihanResi, setPilihanResi] = useState(null); // null | 'ada' | 'tidak'
    const [noResi, setNoResi] = useState('');
    const [fileResi, setFileResi] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && surat) {
            // If already has resi, default to 'ada'
            setPilihanResi(surat.no_resi ? 'ada' : null);
            setNoResi(surat.no_resi || '');
            setFileResi(null);
        }
    }, [isOpen, surat]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setFileResi(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');

            if (pilihanResi === 'ada') {
                formData.append('no_resi', noResi);
                if (fileResi) formData.append('file_resi', fileResi);
            } else {
                // Tidak ada resi — kosongkan field resi
                formData.append('no_resi', '');
                formData.append('tidak_ada_resi', '1');
            }

            await api.post(`/surat-keluar/${surat.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating resi:', error);
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

                    {/* Pilihan Card */}
                    <div className="resi-choice-container">
                        <div
                            className={`resi-choice-card ${pilihanResi === 'ada' ? 'active' : ''}`}
                            onClick={() => setPilihanResi('ada')}
                        >
                            <PackageCheck size={28} />
                            <span>Ada Resi</span>
                            <div className={`resi-radio ${pilihanResi === 'ada' ? 'checked' : ''}`} />
                        </div>
                        <div
                            className={`resi-choice-card ${pilihanResi === 'tidak' ? 'active tidak' : ''}`}
                            onClick={() => setPilihanResi('tidak')}
                        >
                            <PackageX size={28} />
                            <span>Tidak Ada Resi</span>
                            <div className={`resi-radio ${pilihanResi === 'tidak' ? 'checked tidak' : ''}`} />
                        </div>
                    </div>

                    {/* Form input resi — hanya muncul jika pilih "Ada Resi" */}
                    {pilihanResi === 'ada' && (
                        <>
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
                            </div>

                            <div className="form-group">
                                <label>Upload Bukti Resi (Opsional)</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    className="resi-file-input"
                                />
                                <small className="help-text" style={{ marginTop: '4px', display: 'block' }}>
                                    Max 10MB. (PDF, JPG, PNG, DOCX)
                                </small>
                            </div>

                            <div className="form-group">
                                <small className="help-text">
                                    Mengisi nomor resi atau mengupload bukti akan otomatis mengubah status menjadi <strong>Terkirim</strong>.
                                </small>
                            </div>
                        </>
                    )}

                    {pilihanResi === 'tidak' && (
                        <div className="form-group">
                            <small className="help-text" style={{ color: '#1976D2' }}>
                                Surat akan ditandai sebagai <strong>Selesai</strong>.
                            </small>
                        </div>
                    )}

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="btn-submit-resi"
                            disabled={loading || pilihanResi === null}
                        >
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InputResiModal;
