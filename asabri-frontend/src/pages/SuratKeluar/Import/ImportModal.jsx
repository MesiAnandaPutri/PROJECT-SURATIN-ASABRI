import React, { useState } from 'react';
import { Upload, X, Download, FileText } from 'lucide-react';
import api from '../../../services/api';
import './ImportModal.css';

const ImportModal = ({ isOpen, onClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validExtensions = ['.csv', '.xlsx', '.xls'];
            const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

            if (!validExtensions.includes(fileExtension)) {
                alert('Hanya file CSV, XLSX, atau XLS yang diperbolehkan');
                return;
            }
            setFile(selectedFile);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Pilih file terlebih dahulu');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/surat-keluar/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResult(response.data);

            if (response.data.imported > 0) {
                setTimeout(() => {
                    onSuccess();
                    handleClose();
                }, 2000);
            }
        } catch (error) {
            console.error('Import error:', error);
            alert(error.response?.data?.message || 'Gagal mengimport file');
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setResult(null);
        onClose();
    };

    const downloadTemplate = () => {
        const headers = [
            'created_by_name',
            'no_surat',
            'tanggal_pembuatan',
            'kategori_berkas',
            'tujuan',
            'no_resi',
            'perihal',
            'tingkat_urgensi_penyelesaian',
            'klasifikasi_surat_dinas',
            'keterangan'
        ];

        const exampleRow = [
            'Nama Pembuat',
            'SK/001/II/2026',
            '2026-02-01',
            'surat dinas',
            'Kementerian Pertahanan RI',
            '123456789',
            'Permohonan Kerjasama Bidang Teknologi',
            'biasa',
            'terbatas',
            'Catatan tambahan'
        ];

        const csvContent = [headers.join(','), exampleRow.join(',')].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'template_surat_keluar.csv';
        link.click();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content import-modal">
                <div className="modal-header">
                    <h2>Upload file</h2>
                    <button className="close-btn" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {!result ? (
                        <>
                            <div className="upload-section">
                                <label className="file-input-label">
                                    <input
                                        type="file"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                    />
                                    <div className="file-input-display">
                                        {file ? (
                                            <>
                                                <FileText size={40} className="file-icon-large" />
                                                <p className="file-name">{file.name}</p>
                                                <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                                            </>
                                        ) : (
                                            <>
                                                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/%3E%3Cpolyline points='14 2 14 8 20 8'/%3E%3Cline x1='12' y1='18' x2='12' y2='12'/%3E%3Cline x1='9' y1='15' x2='15' y2='15'/%3E%3C/svg%3E" alt="Excel" className="excel-icon" />
                                                <p className="upload-text">Drag/Drop file here or <span className="choose-file">Choose file</span></p>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>

                            <div className="file-info-section">
                                <p className="supported-formats">Supported formats: .XLS .XLSX .CSV</p>
                                <p className="max-size">Maximum size: 25 MB</p>
                            </div>

                            <div className="template-section">
                                <h3>Template</h3>
                                <p className="template-note">
                                    You can download template as starting point for your own file.
                                </p>
                                <button className="btn-download-template" onClick={downloadTemplate}>
                                    <Download size={18} />
                                    Download
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={`result-section ${result.errors.length > 0 ? 'has-errors' : 'success'}`}>
                            <h3>Hasil Import:</h3>
                            <p className="result-summary">
                                ✓ {result.imported} data berhasil diimport
                            </p>
                            {result.errors.length > 0 && (
                                <div className="error-list">
                                    <h4>Error ({result.errors.length}):</h4>
                                    <ul>
                                        {result.errors.slice(0, 10).map((error, idx) => (
                                            <li key={idx}>{error}</li>
                                        ))}
                                        {result.errors.length > 10 && (
                                            <li>... dan {result.errors.length - 10} error lainnya</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={handleClose} disabled={uploading}>
                        Cancel
                    </button>
                    <button
                        className="btn-upload"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                    >
                        {uploading ? 'Importing...' : 'Import'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportModal;
