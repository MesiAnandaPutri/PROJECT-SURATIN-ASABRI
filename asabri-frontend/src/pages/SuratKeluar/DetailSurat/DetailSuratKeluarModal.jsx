import React from 'react';
import { X, Printer, Download, FileText, ExternalLink } from 'lucide-react';
import './DetailSuratKeluarModal.css';

const DetailSuratKeluarModal = ({ isOpen, onClose, surat }) => {
    if (!isOpen || !surat) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

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
                                <label>Tanggal Surat</label>
                                <div className="data-value">{formatDate(surat.tanggal_pembuatan)}</div>
                            </div>

                            <div className="data-group">
                                <label>Penerima</label>
                                <div className="data-value font-bold">{surat.tujuan || '-'}</div>
                            </div>

                            <div className="data-group">
                                <label>Kategori Berkas</label>
                                <div className="data-value">{surat.kategori_berkas || '-'}</div>
                            </div>

                            <div className="data-group">
                                <label>Nomor Resi</label>
                                <div className="data-value" style={{ color: '#2563eb', fontWeight: 500 }}>
                                    {surat.no_resi || '-'}
                                </div>
                            </div>

                            {surat.file_resi && (
                                <div className="data-group">
                                    <label>Bukti Resi</label>
                                    <div className="data-value">
                                        <a
                                            href={`http://localhost:8000/storage/${surat.file_resi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="resi-link"
                                            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#dc2626', textDecoration: 'none', fontSize: '0.9rem' }}
                                        >
                                            <FileText size={16} />
                                            Lihat Bukti
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="data-group">
                                <label>Urgensi & Klasifikasi</label>
                                <div className="badge-row">
                                    <span className={`badge-urgensi ${surat.tingkat_urgensi_penyelesaian?.toLowerCase() || 'biasa'}`}>
                                        {surat.tingkat_urgensi_penyelesaian || 'Biasa'}
                                    </span>
                                    <span className="badge-klasifikasi">{surat.klasifikasi_surat_dinas || 'Rahasia'}</span>
                                </div>
                            </div>

                            <div className="data-group">
                                <label>Input By</label>
                                <div className="data-value font-medium">
                                    {surat.created_by_name || (surat.user ? surat.user.nama_lengkap : '-')}
                                </div>
                            </div>

                            <div className="data-group">
                                <label>Perihal</label>
                                <div className="data-value font-medium">{surat.perihal || '-'}</div>
                            </div>

                            <div className="data-group">
                                <label>Keterangan</label>
                                <div className="data-value text-muted">
                                    {surat.keterangan || '-'}
                                </div>
                            </div>

                            <div className="data-group">
                                <label>Status</label>
                                <span className={`status-badge status-${(surat.status || '').toLowerCase()}`}>
                                    {surat.status || 'Draft'}
                                </span>
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
                    <button className="btn-action btn-print">
                        <Printer size={16} />
                        Cetak
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailSuratKeluarModal;
