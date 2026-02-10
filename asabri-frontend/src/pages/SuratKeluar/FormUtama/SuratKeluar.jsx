import React, { useState, useEffect } from 'react';
import { Search, Plus, Send, Edit2, Trash2, ChevronLeft, ChevronRight, Upload, Truck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../services/api';
import DetailSuratKeluarModal from '../DetailSurat/DetailSuratKeluarModal';
import HapusSuratKeluarModal from '../HapusSurat/HapusSuratKeluarModal';
import ImportModal from '../Import/ImportModal';
import InputResiModal from '../InputResi/InputResiModal';
import { useToast } from '../../../context/ToastContext';
import './SuratKeluar.css';

const SuratKeluar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isPimpinan = user.role === 'pimpinan';

    const [suratData, setSuratData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState({
        surat_keluar_klasifikasi_surat_dinas: [],
        surat_keluar_tingkat_urgensi_penyelesaian: []
    });
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        klasifikasi_surat_dinas: '',
        tingkat_urgensi_penyelesaian: ''
    });

    const [showDetail, setShowDetail] = useState(false);
    const [selectedSuratDetail, setSelectedSuratDetail] = useState(null);

    const [showHapus, setShowHapus] = useState(false);
    const [selectedSuratHapus, setSelectedSuratHapus] = useState(null);

    const [showImport, setShowImport] = useState(false);

    const [showResi, setShowResi] = useState(false);
    const [selectedSuratResi, setSelectedSuratResi] = useState(null);

    const { addToast } = useToast();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    useEffect(() => {
        fetchSuratKeluar();
        fetchOptions();
    }, []);

    useEffect(() => {
        if (location.state?.targetSuratId && suratData.length > 0) {
            const targetSurat = suratData.find(s => s.id === location.state.targetSuratId);
            if (targetSurat) {
                handleOpenDetail(targetSurat);
                // navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [location.state, suratData]);

    const fetchOptions = async () => {
        try {
            const response = await api.get('/enum-options');
            if (response.data) {
                setOptions(response.data);
            }
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const fetchSuratKeluar = async () => {
        try {
            const response = await api.get('/surat-keluar');
            setSuratData(response.data);
        } catch (error) {
            console.error('Error fetching surat keluar:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = suratData.filter(item => {
        const matchesSearch = (
            (item.perihal || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.no_surat || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.tujuan || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        let matchesDateRange = true;
        if (filters.startDate || filters.endDate) {
            const itemDate = new Date(item.tanggal_pembuatan);
            itemDate.setHours(0, 0, 0, 0);

            if (filters.startDate) {
                const start = new Date(filters.startDate);
                start.setHours(0, 0, 0, 0);
                if (itemDate < start) matchesDateRange = false;
            }

            if (filters.endDate) {
                const end = new Date(filters.endDate);
                end.setHours(23, 59, 59, 999);
                if (itemDate > end) matchesDateRange = false;
            }
        }

        const matchesKlasifikasi = filters.klasifikasi_surat_dinas === '' || item.klasifikasi_surat_dinas === filters.klasifikasi_surat_dinas;
        const matchesTingkat = filters.tingkat_urgensi_penyelesaian === '' || item.tingkat_urgensi_penyelesaian === filters.tingkat_urgensi_penyelesaian;

        return matchesSearch && matchesDateRange && matchesKlasifikasi && matchesTingkat;
    }).sort((a, b) => b.id - a.id);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const handleOpenDetail = (item) => {
        setSelectedSuratDetail(item);
        setShowDetail(true);
    };

    const handleCloseDetail = () => {
        setShowDetail(false);
        setSelectedSuratDetail(null);
    };

    const handleDelete = (item) => {
        setSelectedSuratHapus(item);
        setShowHapus(true);
    };

    const handleConfirmHapus = async () => {
        if (!selectedSuratHapus) return;

        try {
            await api.delete(`/surat-keluar/${selectedSuratHapus.id}`);
            setSuratData(prev => prev.filter(item => item.id !== selectedSuratHapus.id));
            setShowHapus(false);
            setSelectedSuratHapus(null);
            alert('Surat berhasil dihapus.');
        } catch (error) {
            console.error('Error deleting surat:', error);
            alert('Gagal menghapus surat.');
        }
    };

    return (
        <div className="surat-keluar-container">
            <div className="page-header">
                {!isPimpinan && (
                    <div className="header-actions">
                        <button className="btn-import" onClick={() => setShowImport(true)}>
                            <Upload size={18} />
                            IMPORT EXCEL/CSV
                        </button>
                        <button className="btn-create-keluar" onClick={() => navigate('/surat-keluar/tambah')}>
                            <Plus size={18} />
                            BUAT SURAT BARU
                        </button>
                    </div>
                )}
                <div></div>
            </div>

            <div className="content-card">
                <div className="search-filter-container">
                    <div className="search-bar">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan tujuan, perihal, atau nomor surat..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-dropdowns">
                        <div className="date-filter">
                            <label>Dari:</label>
                            <input
                                type="date"
                                className="filter-date"
                                value={filters.startDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                            />
                        </div>
                        <div className="date-filter">
                            <label>Sampai:</label>
                            <input
                                type="date"
                                className="filter-date"
                                value={filters.endDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                            />
                        </div>

                        <select
                            className="filter-select"
                            value={filters.klasifikasi_surat_dinas}
                            onChange={(e) => setFilters(prev => ({ ...prev, klasifikasi_surat_dinas: e.target.value }))}
                        >
                            <option value="">Semua Klasifikasi</option>
                            {(options.surat_keluar_klasifikasi_surat_dinas || []).map(opt => (
                                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                            ))}
                        </select>

                        <select
                            className="filter-select"
                            value={filters.tingkat_urgensi_penyelesaian}
                            onChange={(e) => setFilters(prev => ({ ...prev, tingkat_urgensi_penyelesaian: e.target.value }))}
                        >
                            <option value="">Semua Tingkat</option>
                            {(options.surat_keluar_tingkat_urgensi_penyelesaian || []).map(opt => (
                                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>No</th>
                                <th>No. Surat</th>
                                <th>Tanggal</th>
                                <th>Tujuan</th>
                                <th>Perihal</th>
                                <th>Status</th>
                                <th>Detail</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center">Loading data...</td>
                                </tr>
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{startIndex + index + 1}</td>
                                        <td className="font-bold">{item.no_surat}</td>
                                        <td>{formatDate(item.tanggal_pembuatan)}</td>
                                        <td>{item.tujuan}</td>
                                        <td>{item.perihal}</td>
                                        <td>
                                            <span className={`status-badge status-${item.status.toLowerCase()}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-detail"
                                                onClick={() => handleOpenDetail(item)}
                                            >
                                                Detail
                                            </button>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {!isPimpinan ? (
                                                    <>
                                                        <button
                                                            className="btn-icon edit"
                                                            onClick={() => navigate(`/surat-keluar/edit/${item.id}`)}
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            className="btn-icon delete"
                                                            title="Hapus"
                                                            onClick={() => handleDelete(item)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-muted text-xs">View Only</span>
                                                )}
                                                {!isPimpinan && (
                                                    <button
                                                        className="btn-icon resi"
                                                        title="Input Resi"
                                                        onClick={() => {
                                                            setSelectedSuratResi(item);
                                                            setShowResi(true);
                                                        }}
                                                    >
                                                        <Truck size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">Tidak ada data surat keluar.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <p>Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredData.length)} dari {filteredData.length} data</p>
                    <div className="pagination-controls">
                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {(() => {
                            let pages = [];
                            if (totalPages <= 5) {
                                pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                            } else {
                                if (currentPage <= 3) {
                                    pages = [1, 2, 3, 4, '...', totalPages];
                                } else if (currentPage >= totalPages - 2) {
                                    pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                                } else {
                                    pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
                                }
                            }
                            return pages.map((page, index) => (
                                <button
                                    key={index}
                                    className={`page-btn ${currentPage === page ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                    disabled={page === '...'}
                                >
                                    {page}
                                </button>
                            ));
                        })()}

                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <DetailSuratKeluarModal
                isOpen={showDetail}
                onClose={handleCloseDetail}
                surat={selectedSuratDetail}
            />

            <HapusSuratKeluarModal
                isOpen={showHapus}
                onClose={() => setShowHapus(false)}
                onConfirm={handleConfirmHapus}
                suratName={selectedSuratHapus?.no_surat || ''}
            />

            <ImportModal
                isOpen={showImport}
                onClose={() => setShowImport(false)}
                onSuccess={() => {
                    fetchSuratKeluar();
                    addToast('Data surat keluar berhasil diimport!', 'success');
                }}
            />

            <InputResiModal
                isOpen={showResi}
                onClose={() => {
                    setShowResi(false);
                    setSelectedSuratResi(null);
                }}
                onSuccess={() => {
                    fetchSuratKeluar();
                    addToast('Nomor resi berhasil diupdate!', 'success');
                }}
                surat={selectedSuratResi}
            />
        </div>
    );
};

export default SuratKeluar;
