import React, { useState } from 'react';
import { X, Printer, Download, FileText, ExternalLink } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import './DetailSuratModal.css';

const DetailSuratModal = ({ isOpen, onClose, surat }) => {
    const [downloading, setDownloading] = useState(false);

    if (!isOpen || !surat) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const handleDownloadDisposisi = async () => {
        setDownloading(true);
        try {
            const response = await api.get(`/surat-masuk/${surat.id}/disposisi/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const filename = `Lembar_Disposisi_${surat.no_surat?.replace(/[\/\\]/g, '_') || 'doc'}.pdf`;
            link.setAttribute('download', filename);

            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            let errorMessage = 'Gagal mengunduh lembar disposisi.';

            if (error.response && error.response.data instanceof Blob) {
                try {
                    const text = await error.response.data.text();
                    const json = JSON.parse(text);
                    errorMessage = json.message || json.error || errorMessage;
                } catch (e) {
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Download Gagal',
                text: errorMessage,
                confirmButtonColor: '#002966'
            });
        } finally {
            setDownloading(false);
        }
    };

    const handleDownloadSingleDisposisi = async (disposisiId) => {
        try {
            const response = await api.get(`/disposisi/${disposisiId}/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Lembar_Disposisi_${surat.no_surat?.replace(/[\/\\]/g, '_') || 'doc'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Download Gagal',
                text: 'Gagal mengunduh lembar disposisi.',
                confirmButtonColor: '#002966'
            });
        }
    };

    const hasMultipleDisposisi = surat.disposisi && surat.disposisi.length > 1;

    return (
        <div className="modal-overlay">
            <div className="detail-modal-container">
                <div className="modal-header">
                    <h2>Detail Surat: {surat.no_surat || '-'}</h2>
                    <button className="btn-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="detail-modal-body">
                    <div className="detail-content-grid">
                        <div className="detail-left">
                            <h3 className="section-title">Data Surat Lengkap</h3>

                            <div className="data-group">
                                <label>Nomor Surat</label>
                                <div className="data-value font-medium">{surat.no_surat || '-'}</div>
                            </div>

                            <div className="data-group">
                                <label>Tanggal Terima Surat</label>
                                <div className="data-value">{formatDate(surat.tanggal_terima_surat)}</div>
                            </div>

                            <div className="data-group">
                                <label>Tanggal Surat Masuk</label>
                                <div className="data-value">{formatDate(surat.tanggal_surat_masuk)}</div>
                            </div>

                            <div className="data-group">
                                <label>Pengirim</label>
                                <div className="data-value font-bold">{surat.pengirim || '-'}</div>
                            </div>

                            <div className="data-group">
                                <label>Sumber Berkas</label>
                                <div className="data-value capitalize">{surat.sumber_berkas || '-'}</div>
                            </div>




                            <div className="data-group">
                                <label>Perihal</label>
                                <div className="data-value font-medium">{surat.perihal || '-'}</div>
                            </div>

                            <div className="data-group">
                                <label>Keterangan</label>
                                <div className="data-value text-muted">
                                    {surat.keterangan || 'Permohonan klaim asuransi kesehatan untuk perawatan rawat inap...'}
                                </div>
                            </div>

                            <div className="data-group">
                                <label>Status</label>
                                <span className={`status-badge status-${(surat.status || '').toLowerCase()}`}>
                                    {surat.status || 'Proses'}
                                </span>
                            </div>

                            <div className="riwayat-section">
                                <div className="riwayat-header">
                                    <h4>Riwayat Disposisi</h4>
                                </div>
                                <div className="riwayat-list">
                                    {surat.disposisi && surat.disposisi.length > 0 ? (
                                        surat.disposisi.map((disp, index) => (
                                            <div className="riwayat-item" key={disp.id || index}>
                                                <div className="riwayat-dot"></div>
                                                <div className="riwayat-content">
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span className="riwayat-date">
                                                            {new Date(disp.created_at).toLocaleString('id-ID', {
                                                                day: '2-digit', month: 'short', year: 'numeric',
                                                                hour: '2-digit', minute: '2-digit'
                                                            }).replace(/\./g, ':')}
                                                        </span>
                                                        {hasMultipleDisposisi && (
                                                            <button
                                                                className="btn-download-disposisi"
                                                                onClick={() => handleDownloadSingleDisposisi(disp.id)}
                                                                title="Download Lembar Disposisi ini"
                                                                style={{
                                                                    background: 'none',
                                                                    border: '1px solid #cbd5e1',
                                                                    borderRadius: '6px',
                                                                    padding: '4px 8px',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px',
                                                                    fontSize: '11px',
                                                                    color: '#475569',
                                                                    transition: 'all 0.2s'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.background = '#f1f5f9';
                                                                    e.target.style.borderColor = '#002966';
                                                                    e.target.style.color = '#002966';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.background = 'none';
                                                                    e.target.style.borderColor = '#cbd5e1';
                                                                    e.target.style.color = '#475569';
                                                                }}
                                                            >
                                                                <Download size={12} /> PDF
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="riwayat-users">
                                                        <span className="font-semibold">{disp.user?.nama_lengkap || 'Admin'}</span>
                                                        {' → '}
                                                        <span className="font-semibold">
                                                            {Array.isArray(disp.diteruskan_kepada)
                                                                ? disp.diteruskan_kepada.join(', ')
                                                                : disp.diteruskan_kepada}
                                                        </span>
                                                    </p>
                                                    <p className="riwayat-instruction font-medium" style={{ color: '#D97706', marginTop: '4px' }}>
                                                        {disp.instruksi}
                                                    </p>
                                                    {disp.catatan && (
                                                        <p className="riwayat-note text-muted italic">
                                                            "{disp.catatan}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-riwayat">
                                            <p className="text-muted text-sm italic">Belum ada riwayat disposisi.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="detail-right">
                            <div className="preview-header">
                                <h3>Preview Dokumen</h3>
                                {surat.file_path && (
                                    <a
                                        href={`http://localhost:8000/storage/${surat.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-expand"
                                    >
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                            <div className="pdf-preview-container">
                                <div className="pdf-placeholder">
                                    <div className="pdf-icon-bg">
                                        <FileText size={48} color="#E11D48" />
                                    </div>
                                    <p className="pdf-label">
                                        {surat.file_path ? 'Dokumen Tersedia' : 'Tidak Ada Dokumen'}
                                    </p>
                                    <p className="pdf-filename">
                                        {surat.file_path ? surat.file_path.split('/').pop() : `${surat.no_surat?.replace(/\//g, '_')}.pdf`}
                                    </p>
                                    <p className="pdf-sub">
                                        {surat.file_path ? 'Klik tombol di bawah untuk mengunduh' : 'Pratinjau dokumen tidak tersedia'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer centered-footer">
                    {surat.file_path ? (
                        <a
                            href={`http://localhost:8000/storage/${surat.file_path}`}
                            download
                            className="btn-action btn-download"
                            style={{ textDecoration: 'none' }}
                        >
                            <Download size={16} />
                            Download Dokumen
                        </a>
                    ) : (
                        <button className="btn-action btn-download" disabled title="Tidak ada file untuk didownload">
                            <Download size={16} />
                            No File
                        </button>
                    )}
                    <button className="btn-action btn-print" onClick={handleDownloadDisposisi} disabled={downloading}>
                        <FileText size={16} />
                        {downloading ? 'Mengunduh...' : 'Lembar Disposisi'}
                    </button>
                    <button className="btn-action btn-print">
                        <Printer size={16} />
                        Cetak
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailSuratModal;
