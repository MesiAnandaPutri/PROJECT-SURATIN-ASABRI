import React, { useState, useEffect } from 'react';
import { X, Send, Search, CheckSquare, Square } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import './DisposisiModal.css';

const DisposisiModal = ({ isOpen, onClose, onSubmit, suratId }) => {
    if (!isOpen) return null;

    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [instruction, setInstruction] = useState('');
    const [note, setNote] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await api.get('/users');
            setAvailableUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleToggleRecipient = (userName) => {
        setSelectedRecipients(prev => {
            if (prev.includes(userName)) {
                return prev.filter(name => name !== userName);
            } else {
                return [...prev, userName];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedRecipients.length === filteredUsers.length) {
            setSelectedRecipients([]);
        } else {
            setSelectedRecipients(filteredUsers.map(u => u.name));
        }
    };

    const handleSend = () => {

        if (selectedRecipients.length === 0 || !instruction) {
            Swal.fire({
                icon: 'warning',
                title: 'Data Belum Lengkap',
                text: 'Mohon pilih minimal satu tujuan dan instruksi disposisi.',
                confirmButtonColor: '#002966'
            });
            return;
        }


        const payload = {
            surat_id: suratId,
            recipients: selectedRecipients,
            instruksi: instruction,
            note
        };
        onSubmit(payload);
    };

    const filteredUsers = availableUsers.filter(u =>
        (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.role || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const instructionOptions = [
        "ACC/Setuju",
        "Agar ditindaklanjuti",
        "Buat resume",
        "Koordinasikan",
        "Sebagai Info",
        "Laksanakan Sesuai Dengan Ketentuan",
        "Lakukan Kajian",
        "Menghadap",
        "Monitor Perkembangannya",
        "Pelajari/Ajukan Saran",
        "Selesaikan",
        "Simpan",
        "Untuk Diketahui",
        "Untuk Dilaksanakan",
        "Copy"
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-container disposisi-modal">
                <div className="modal-header">
                    <h2>Lembar Disposisi</h2>
                    <button className="btn-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="diteruskan-section">
                        <h3>Diteruskan Kepada</h3>

                        <div className="user-search-box">
                            <Search size={16} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari user..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="user-list-container">
                            {loadingUsers ? (
                                <p className="text-muted text-sm p-4">Loading users...</p>
                            ) : (
                                <>
                                    <div
                                        className="user-list-item select-all"
                                        onClick={handleSelectAll}
                                    >
                                        {selectedRecipients.length > 0 && selectedRecipients.length === filteredUsers.length ? (
                                            <CheckSquare size={18} className="text-primary" />
                                        ) : (
                                            <Square size={18} className="text-gray-300" />
                                        )}
                                        <span>Pilih Semua</span>
                                    </div>

                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map(user => (
                                            <div
                                                key={user.id}
                                                className={`user-list-item ${selectedRecipients.includes(user.name) ? 'selected' : ''}`}
                                                onClick={() => handleToggleRecipient(user.name)}
                                            >
                                                {selectedRecipients.includes(user.name) ? (
                                                    <CheckSquare size={18} className="text-primary" />
                                                ) : (
                                                    <Square size={18} className="text-gray-300" />
                                                )}
                                                <div className="user-item-info">
                                                    <span className="user-item-name">{user.name}</span>
                                                    <span className="user-item-role">{user.role}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted text-center py-4 text-xs">User tidak ditemukan.</p>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="selected-count">
                            {selectedRecipients.length} user dipilih
                        </div>
                    </div>

                    <div className="instruction-section">
                        <h3>Instruksi Khusus</h3>
                        <div className="instruction-select-wrapper">
                            <select
                                value={instruction}
                                onChange={(e) => setInstruction(e.target.value)}
                                className="instruction-select"
                            >
                                <option value="" disabled>Pilih Instruksi...</option>
                                {instructionOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="note-section">
                        <h3>Catatan Tambahan</h3>
                        <textarea
                            placeholder="Masukkan catatan atau instruksi tambahan untuk disposisi..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Batal</button>
                    <button className="btn-submit-disposisi" onClick={handleSend} disabled={loadingUsers}>
                        <Send size={16} />
                        Kirim Disposisi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DisposisiModal;
