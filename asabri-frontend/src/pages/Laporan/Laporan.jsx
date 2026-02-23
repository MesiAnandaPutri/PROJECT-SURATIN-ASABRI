import React, { useState, useEffect } from 'react';
import { Search, Download, FileText, Filter, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import api from '../../services/api';
import './Laporan.css';

const Laporan = () => {
    const [loading, setLoading] = useState(true);
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [filters, setFilters] = useState({
        periodeType: '', // '', Harian, Bulanan, Tahunan
        tanggal: new Date().toISOString().split('T')[0],
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
        jenis: '',
        status: ''
    });

    const [statusOptions, setStatusOptions] = useState([]);

    useEffect(() => {
        fetchData();
        fetchEnumOptions();
    }, []);

    const fetchEnumOptions = async () => {
        try {
            const response = await api.get('/enum-options');
            if (response.data) {
                const masukStatuses = response.data.surat_masuk_status || [];
                const keluarStatuses = response.data.surat_keluar_status || [];
                const combined = [...new Set([...masukStatuses, ...keluarStatuses])];
                setStatusOptions(combined);
            }
        } catch (error) {
            const masukStatuses = ['Proses', 'Selesai', 'Disposisi'];
            const keluarStatuses = ['Draft', 'Terkirim', 'Arsip'];
            setStatusOptions([...masukStatuses, ...keluarStatuses]);
            console.error('Error fetching enum options:', error);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [resMasuk, resKeluar] = await Promise.all([
                api.get('/surat-masuk'),
                api.get('/surat-keluar')
            ]);

            const normalizedMasuk = (resMasuk.data || []).map(item => ({
                ...item,
                id: `M-${item.id}`,
                raw_id: item.id,
                tipe: 'Surat Masuk',
                no_surat: item.no_surat,
                tanggal: item.tanggal_surat_masuk || item.tanggal_terima_surat,
                dari_kepada: item.pengirim,
                perihal: item.perihal,
                kategori: item.kategori_berkas || 'Nota Dinas',
                status: item.status || 'Proses',
                file_path: item.file_path,
                sumber_berkas: item.sumber_berkas,
                dibuat_oleh: item.created_by_name
            }));

            const normalizedKeluar = (resKeluar.data || []).map(item => ({
                ...item,
                id: `K-${item.id}`,
                raw_id: item.id,
                tipe: 'Surat Keluar',
                no_surat: item.no_surat,
                tanggal: item.tanggal_pembuatan,
                dari_kepada: item.tujuan,
                perihal: item.perihal,
                kategori: item.kategori_berkas,
                status: item.status || 'Draft',
                file_path: item.file_path,
                dibuat_oleh: item.created_by_name
            }));

            const combined = [...normalizedMasuk, ...normalizedKeluar];
            combined.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

            setAllData(combined);
            setFilteredData(combined);
        } catch (error) {
            console.error('Error fetching data for report:', error);
            setAllData([]);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };

    const [availableYears, setAvailableYears] = useState([]);

    useEffect(() => {
        if (allData.length > 0) {
            const years = [...new Set(allData.map(item => {
                if (!item.tanggal) return null;
                return new Date(item.tanggal).getFullYear();
            }))]
                .filter(y => y !== null)
                .sort((a, b) => b - a);

            setAvailableYears(years);
        }
    }, [allData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        let res = [...allData];

        if (filters.jenis) {
            res = res.filter(item => item.tipe === filters.jenis);
        }

        if (filters.status) {
            res = res.filter(item => item.status.toLowerCase() === filters.status.toLowerCase());
        }

        if (filters.periodeType === 'Harian') {
            const selectedDate = filters.tanggal;
            if (selectedDate) {
                res = res.filter(item => item.tanggal && item.tanggal.startsWith(selectedDate));
            }
        } else if (filters.periodeType === 'Bulanan') {
            // Use selected month and year
            res = res.filter(item => {
                if (!item.tanggal) return false;
                // Parse YYYY-MM explicitly from substring to avoid timezone issues
                // Assuming format YYYY-MM-DD
                const itemYear = parseInt(item.tanggal.substring(0, 4));
                const itemMonth = parseInt(item.tanggal.substring(5, 7));

                const filterBulan = filters.bulan ? parseInt(filters.bulan) : (new Date().getMonth() + 1);
                const filterTahun = filters.tahun ? parseInt(filters.tahun) : new Date().getFullYear();

                return itemMonth === filterBulan && itemYear === filterTahun;
            });
        } else if (filters.periodeType === 'Tahunan') {
            // Use selected year
            res = res.filter(item => {
                if (!item.tanggal) return false;
                const itemYear = parseInt(item.tanggal.substring(0, 4));
                const filterTahun = filters.tahun ? parseInt(filters.tahun) : new Date().getFullYear();
                return itemYear === filterTahun;
            });
        }

        setFilteredData(res);
    };

    useEffect(() => {
        applyFilters();
    }, [filters, allData]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const stats = {
        total: allData.length,
        masuk: allData.filter(i => i.tipe === 'Surat Masuk').length,
        keluar: allData.filter(i => i.tipe === 'Surat Keluar').length
    };

    const exportToExcel = () => {
        if (filteredData.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Data Kosong',
                text: 'Tidak ada data untuk diexport.',
                confirmButtonColor: '#002966'
            });
            return;
        }

        const wb = XLSX.utils.book_new();
        const STORAGE_URL = `${window.location.origin}/storage/`;

        // Helper to format data
        // Helper to format data for Surat Masuk
        const formatMasukForSheet = (data) => {
            return data.map((item, index) => ({
                'No': index + 1,
                'No. Surat': item.no_surat,
                'Pengirim': item.pengirim,
                'Tanggal Terima Surat': formatDate(item.tanggal_terima_surat),
                'Tanggal Surat Masuk': formatDate(item.tanggal_surat_masuk),
                'Perihal': item.perihal,
                'Status': item.status,
                'Sumber Berkas': item.sumber_berkas,
                'Link Download': item.file_path || '-'
            }));
        };

        // Helper to format data for Surat Keluar
        const formatKeluarForSheet = (data) => {
            return data.map((item, index) => ({
                'No': index + 1,
                'Dibuat Oleh': item.dibuat_oleh || '-',
                'No. Surat': item.no_surat,
                'Tanggal Pembuatan': formatDate(item.tanggal_pembuatan),
                'Kategori Berkas': item.kategori_berkas,
                'Tujuan': item.tujuan,
                'No. Resi': item.no_resi,
                'Status': item.status,
                'Perihal': item.perihal,
                'Tingkat Urgensi': item.tingkat_urgensi_penyelesaian || '-',
                'Klasifikasi': item.klasifikasi_surat_dinas || '-',
                'Keterangan': item.keterangan || '-',
                'Link Download': item.file_path || '-'
            }));
        };

        // Helper for hyperlinks
        const addHyperlinks = (worksheet, data, colIndex) => {
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            for (let R = range.s.r + 1; R <= range.e.r; ++R) {
                const dataItem = data[R - 1];
                if (dataItem && dataItem['Link Download'] && dataItem['Link Download'] !== '-') {
                    const filePath = dataItem['Link Download'];
                    const cleanPath = filePath.replace(/^public\//, '');
                    const fullUrl = `${STORAGE_URL}${cleanPath}`;
                    const cellAddress = XLSX.utils.encode_cell({ r: R, c: colIndex });

                    if (!worksheet[cellAddress]) worksheet[cellAddress] = { t: 's', v: 'Download' };
                    worksheet[cellAddress].l = { Target: fullUrl };
                    worksheet[cellAddress].v = 'Download';
                    worksheet[cellAddress].t = 's';
                }
            }
        };

        const masukData = filteredData.filter(i => i.tipe === 'Surat Masuk').sort((a, b) => a.raw_id - b.raw_id);
        if (masukData.length > 0) {
            const masukFormatted = formatMasukForSheet(masukData);
            const wsMasuk = XLSX.utils.json_to_sheet(masukFormatted);
            const headersMasuk = Object.keys(masukFormatted[0]);
            const linkIndexMasuk = headersMasuk.indexOf('Link Download');
            if (linkIndexMasuk !== -1) {
                addHyperlinks(wsMasuk, masukFormatted, linkIndexMasuk);
            }
            XLSX.utils.book_append_sheet(wb, wsMasuk, "Surat Masuk");
        }

        const keluarData = filteredData.filter(i => i.tipe === 'Surat Keluar').sort((a, b) => a.raw_id - b.raw_id);
        if (keluarData.length > 0) {
            const keluarFormatted = formatKeluarForSheet(keluarData);
            const wsKeluar = XLSX.utils.json_to_sheet(keluarFormatted);
            const headersKeluar = Object.keys(keluarFormatted[0]);
            const linkIndexKeluar = headersKeluar.indexOf('Link Download');
            if (linkIndexKeluar !== -1) {
                addHyperlinks(wsKeluar, keluarFormatted, linkIndexKeluar);
            }
            XLSX.utils.book_append_sheet(wb, wsKeluar, "Surat Keluar");
        }

        const dateStr = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `Laporan_Surat_Lengkap_${dateStr}.xlsx`);
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const changePage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="laporan-container">
            <div className="page-header">
                <div></div>
            </div>
            <div className="filter-card">
                <div className="filter-header">
                    <div className="flex items-center gap-2">
                        <Filter size={18} />
                        <span>Filter Laporan</span>
                    </div>
                </div>
                <div className="filter-grid-3-cols">
                    <div className="filter-input-group" style={{ minWidth: '300px' }}>
                        <label>Periode Laporan</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select
                                name="periodeType"
                                value={filters.periodeType}
                                onChange={handleFilterChange}
                                style={{ flex: 1 }}
                            >
                                <option value="">Semua Waktu</option>
                                <option value="Harian">Harian</option>
                                <option value="Bulanan">Bulanan</option>
                                <option value="Tahunan">Tahunan</option>
                            </select>

                            {filters.periodeType === 'Bulanan' && (
                                <>
                                    <select
                                        name="bulan"
                                        value={filters.bulan}
                                        onChange={handleFilterChange}
                                        style={{ flex: 1 }}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        name="tahun"
                                        value={filters.tahun}
                                        onChange={handleFilterChange}
                                        style={{ flex: 1 }}
                                    >
                                        {availableYears.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </>
                            )}

                            {filters.periodeType === 'Tahunan' && (
                                <select
                                    name="tahun"
                                    value={filters.tahun}
                                    onChange={handleFilterChange}
                                    style={{ flex: 1 }}
                                >
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                    <div className="filter-input-group">
                        <label>Jenis Surat</label>
                        <select name="jenis" value={filters.jenis} onChange={handleFilterChange}>
                            <option value="">Semua Jenis</option>
                            <option value="Surat Masuk">Surat Masuk</option>
                            <option value="Surat Keluar">Surat Keluar</option>
                        </select>
                    </div>
                    <div className="filter-input-group">
                        <label>Status</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="">Semua Status</option>
                            {statusOptions.map(opt => (
                                <option key={opt} value={opt}>
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="filter-actions-row">
                    <button className="btn-gold" onClick={exportToExcel}>
                        <Download size={18} />
                        EXPORT TO EXCEL
                    </button>
                </div>
            </div>
            <div className="stats-grid">
                <div className="report-stats-card">
                    <span className="stats-label">Total Surat</span>
                    <span className="stats-value highlight-blue">{stats.total}</span>
                </div>
                <div className="report-stats-card">
                    <span className="stats-label">Surat Masuk</span>
                    <span className="stats-value highlight-green">{stats.masuk}</span>
                </div>
                <div className="report-stats-card">
                    <span className="stats-label">Surat Keluar</span>
                    <span className="stats-value highlight-blue">{stats.keluar}</span>
                </div>
            </div>
            <div className="content-card">
                <div className="card-header-row">
                    <h2>Data Laporan</h2>
                </div>
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>No</th>
                                <th>No. Surat</th>
                                <th>Tanggal</th>
                                <th>Jenis</th>
                                <th>Dari/Kepada</th>
                                <th>Perihal</th>
                                <th>Kategori</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" className="text-center">Memuat data...</td></tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td className="font-bold">{item.no_surat}</td>
                                        <td>{formatDate(item.tanggal)}</td>
                                        <td>
                                            <span className={`type-badge ${item.tipe === 'Surat Masuk' ? 'masuk' : 'keluar'}`}>
                                                {item.tipe === 'Surat Masuk' ? 'Surat Masuk' : 'Surat Keluar'}
                                            </span>
                                        </td>
                                        <td>{item.dari_kepada}</td>
                                        <td>{item.perihal}</td>
                                        <td>{item.kategori}</td>
                                        <td>
                                            <span className={`status-badge status-${item.status.toLowerCase()}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" className="text-center">Tidak ada data ditemukan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <p>Menampilkan {currentItems.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredData.length)}` : '0'} dari {filteredData.length} data</p>
                    <div className="pagination-controls">
                        <button
                            className="page-btn"
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {/* Simple page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => {
                                // Show first, last, current, and adjacent pages
                                return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                            })
                            .map((page, index, array) => (
                                <React.Fragment key={page}>
                                    {index > 0 && array[index - 1] !== page - 1 && <span className="ellipsis">...</span>}
                                    <button
                                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                        onClick={() => changePage(page)}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            ))
                        }

                        <button
                            className="page-btn"
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Laporan;
