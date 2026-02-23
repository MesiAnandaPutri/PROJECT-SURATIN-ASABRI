import React, { useState, useEffect } from 'react';
import { Mail, Inbox, Send, Clock, Calendar } from 'lucide-react';
import StatsCard from './StatsCard';
import ActivityTable from './ActivityTable';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/dashboard');
                const data = response.data || {};

                const rawStats = data.stats || { total: '0', masuk: '0', keluar: '0', pending_masuk: '0', pending_keluar: '0' };
                const statsData = [
                    { icon: Mail, title: 'Total Surat', value: rawStats.total, subtitle: 'Keseluruhan dokumen', color: 'blue' },
                    { icon: Inbox, title: 'Surat Masuk', value: rawStats.masuk, subtitle: 'Dokumen masuk', color: 'green' },
                    { icon: Send, title: 'Surat Keluar', value: rawStats.keluar, subtitle: 'Dokumen keluar', color: 'red' },
                    { icon: Clock, title: 'Pending Surat Masuk', value: rawStats.pending_masuk, subtitle: 'Surat masuk menunggu disposisi', color: 'orange', link: '/surat-masuk?status=proses' },
                    { icon: Clock, title: 'Pending Surat Keluar', value: rawStats.pending_keluar, subtitle: 'Surat keluar menunggu proses', color: 'yellow', link: '/surat-keluar?status=draft' },
                ];

                setStats(statsData);
                setActivities(data.activities || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);



    if (loading) {
        return <div className="dashboard-loading">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="stats-row">
                {stats.slice(0, 3).map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>
            <div className="stats-row">
                {stats.slice(3).map((stat, index) => (
                    <StatsCard key={index + 3} {...stat} />
                ))}
            </div>

            <ActivityTable activities={activities} />
        </div>
    );
};

export default Dashboard;
