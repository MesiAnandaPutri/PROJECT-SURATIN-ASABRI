import React, { useState, useEffect } from 'react';
import { Search, Plus, Send, Edit2, Trash2, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import api from '../../../services/api';
import DisposisiModal from '../Disposisi/DisposisiModal';
import DetailSuratModal from '../DetailSurat/DetailSuratModal';
import HapusSuratMasukModal from '../HapusSurat/HapusSuratMasukModal';
import ImportModal from '../Import/ImportModal';
import { useToast } from '../../../context/ToastContext';
import Swal from 'sweetalert2';
import './SuratMasuk.css';

const SuratMasuk = () => {
    const { addToast } = useToast();
    const [suratData, setSuratData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: ''
    });
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [years, setYears] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

    useEffect(() => {
        fetchYears();
    }, []);

    const fetchYears = async () => {
        try {
            const response = await api.get('/enum-options');
            if (response.data && response.data.surat_masuk_years) {
                setYears(response.data.surat_masuk_years);
            }
        } catch (error) {
            console.error('Error fetching years:', error);
        }
    };

    const [selectedSuratId, setSelectedSuratId] = useState(null);
    const [showDisposisi, setShowDisposisi] = useState(false);

    const [showDetail, setShowDetail] = useState(false);
    const [selectedSuratDetail, setSelectedSuratDetail] = useState(null);

    const [showHapus, setShowHapus] = useState(false);
    const [selectedSuratHapus, setSelectedSuratHapus] = useState(null);

    const [showImport, setShowImport] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchSuratMasuk();
    }, [selectedYear]);

    useEffect(() => {
        if (location.state?.targetSuratId && suratData.length > 0) {
            const targetSurat = suratData.find(s => s.id === location.state.targetSuratId);
            if (targetSurat) {
                handleOpenDetail(targetSurat);
                // navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [location.state, suratData]);

    const fetchSuratMasuk = async () => {
        setLoading(true);
        try {
            const response = await api.get('/surat-masuk', {
                params: { year: selectedYear }
            });
            setSuratData(response.data);
        } catch (error) {
            console.error('Error fetching surat masuk:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setStatusFilter(searchParams.get('status') || '');
    }, [searchParams]);

    const filteredData = suratData.filter(item => {
        const matchesSearch = (
            (item.perihal || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.no_surat || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.pengirim || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        let matchesDateRange = true;
        if (filters.startDate || filters.endDate) {
            const itemDate = new Date(item.tanggal_terima_surat);
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

        const itemStatus = item.status || 'Proses';
        const matchesStatus = statusFilter
            ? itemStatus.toLowerCase() === statusFilter.toLowerCase()
            : true;

        return matchesSearch && matchesDateRange && matchesStatus;
    });

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

    const handleOpenDisposisi = (id) => {
        console.log('Opening Disposisi for ID:', id);
        setSelectedSuratId(id);
        setShowDisposisi(true);
    };

    const handleCloseDisposisi = () => {
        setShowDisposisi(false);
        setSelectedSuratId(null);
    };

    const handleSubmitDisposisi = async (data) => {
        try {
            console.log('Sending Disposisi Data:', data);

            const payload = {
                diteruskan_kepada: data.recipients,
                instruksi: data.instruksi,
                catatan: data.note
            };

            await api.post(`/surat-masuk/${selectedSuratId}/disposisi`, payload);

            setSuratData(prevData => prevData.map(item =>
                item.id === selectedSuratId
                    ? { ...item, status: 'Disposisi' }
                    : item
            ));

            addToast('Disposisi berhasil dikirim dan tersimpan!', 'success');
            handleCloseDisposisi();

            try {
                const res = await api.get(`/surat-masuk/${selectedSuratId}`);
                if (res.data) {
                    setSuratData(prevData => prevData.map(item =>
                        item.id === selectedSuratId ? res.data : item
                    ));
                }
            } catch (err) {
                console.error('Failed to refresh data:', err);
            }
        } catch (error) {
            console.error('Gagal mengirim disposisi:', error);
            const msg = error.response?.data?.message || 'Terjadi kesalahan saat memproses disposisi.';
            Swal.fire({
                icon: 'error',
                title: 'Gagal Disposisi',
                text: msg,
                confirmButtonColor: '#002966'
            });
        }
    };

    const handleOpenDetail = async (item) => {
        try {
            // Fetch fresh data including disposisi relationship
            const res = await api.get(`/surat-masuk/${item.id}`);
            setSelectedSuratDetail(res.data);
        } catch (error) {
            // Fallback to list data if fetch fails
            setSelectedSuratDetail(item);
        }
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
            await api.delete(`/surat-masuk/${selectedSuratHapus.id}`);
            setSuratData(prev => prev.filter(item => item.id !== selectedSuratHapus.id));
            setShowHapus(false);
            setSelectedSuratHapus(null);
            addToast('Surat berhasil dihapus.', 'success');
        } catch (error) {
            console.error('Error deleting surat:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menghapus',
                text: 'Gagal menghapus surat.',
                confirmButtonColor: '#002966'
            });
        }
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isPimpinan = (user.role || '').toLowerCase() === 'pimpinan';

    return (
        <div className="surat-masuk-container">
            <div className="page-header">
                {!isPimpinan && (
                    <div className="header-actions">
                        <button className="btn-import" onClick={() => setShowImport(true)}>
                            <Upload size={18} />
                            IMPORT EXCEL/CSV
                        </button>
                        <Link to="/surat-masuk/tambah" className="btn-create">
                            <Plus size={18} />
                            BUAT BERKAS BARU
                        </Link>
                    </div>
                )}
            </div>

            <div className="content-card">
                <div className="search-filter-container">
                    <div className="search-bar">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan pengirim, perihal, atau nomor surat..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-dropdowns">
                        <select
                            className="filter-select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            style={{ width: '150px' }}
                        >
                            <option value="">Semua Tahun</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>

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
                    </div>
                </div>

                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>No</th>
                                <th style={{ width: '15%' }}>No. Surat</th>
                                <th style={{ width: '10%' }}>Tgl. Terima</th>
                                <th style={{ width: '10%' }}>Tgl. Masuk</th>
                                <th style={{ width: '14%' }}>Pengirim</th>
                                <th style={{ width: '18%' }}>Perihal</th>
                                <th style={{ width: '8%' }}>Status</th>
                                <th style={{ width: '7%' }}>Detail</th>
                                <th style={{ width: '80px' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="text-center">Loading data...</td>
                                </tr>
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{startIndex + index + 1}</td>
                                        <td>
                                            <span className="font-bold text-sm text-dark">{item.no_surat}</span>
                                        </td>
                                        <td>{formatDate(item.tanggal_terima_surat)}</td>
                                        <td>{formatDate(item.tanggal_surat_masuk)}</td>
                                        <td>{item.pengirim}</td>
                                        <td>{item.perihal}</td>
                                        <td>
                                            <span className={`status-badge status-${(item.status || 'proses').toLowerCase()}`}>
                                                {item.status || 'Proses'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-detail-small"
                                                onClick={() => handleOpenDetail(item)}
                                            >
                                                Detail
                                            </button>
                                        </td>
                                        <td>
                                            <div className="action-buttons">

                                                {isPimpinan && (
                                                    <button
                                                        className="btn-icon send"
                                                        title="Disposisi"
                                                        onClick={() => handleOpenDisposisi(item.id)}
                                                    >
                                                        <Send size={16} />
                                                    </button>
                                                )}

                                                {!isPimpinan && (
                                                    <>
                                                        <button
                                                            className="btn-icon edit"
                                                            title="Edit"
                                                            onClick={() => navigate(`/surat-masuk/edit/${item.id}`)}
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
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center">Tidak ada data surat masuk.</td>
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
            </div >

            <DisposisiModal
                isOpen={showDisposisi}
                onClose={handleCloseDisposisi}
                onSubmit={handleSubmitDisposisi}
                suratId={selectedSuratId}
            />

            <DetailSuratModal
                isOpen={showDetail}
                onClose={handleCloseDetail}
                surat={selectedSuratDetail}
            />

            <HapusSuratMasukModal
                isOpen={showHapus}
                onClose={() => setShowHapus(false)}
                onConfirm={handleConfirmHapus}
                suratName={selectedSuratHapus?.no_surat || ''}
            />

            <ImportModal
                isOpen={showImport}
                onClose={() => setShowImport(false)}
                onSuccess={() => {
                    fetchSuratMasuk();
                    addToast('Data berhasil diimport!', 'success');
                }}
            />
        </div >
    );
};

export default SuratMasuk;
