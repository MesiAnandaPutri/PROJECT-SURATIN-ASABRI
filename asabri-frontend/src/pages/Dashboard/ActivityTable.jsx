import React from 'react';
import { Link } from 'react-router-dom';
import './ActivityTable.css';

const ActivityTable = ({ activities }) => {
    return (
        <div className="activity-section">
            <div className="activity-header">
                <h3>Aktivitas Terbaru</h3>
                <Link to="/laporan" className="view-all">Lihat Semua →</Link>
            </div>

            <div className="table-responsive">
                <table className="activity-table">
                    <thead>
                        <tr>
                            <th>TANGGAL</th>
                            <th>TIPE</th>
                            <th>DARI/KEPADA</th>
                            <th>PERIHAL</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="date-cell">
                                        <span className="date">{item.tanggal}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`type-badge ${item.tipe === 'Surat Masuk' ? 'type-in' : 'type-out'}`}>
                                        {item.tipe}
                                    </span>
                                </td>
                                <td className="font-medium">{item.dari_kepada}</td>
                                <td className="subject-cell">{item.perihal}</td>
                                <td>
                                    <span className={`status-badge status-${(item.status || '').toLowerCase()}`}>
                                        {item.status}
                                    </span>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivityTable;
