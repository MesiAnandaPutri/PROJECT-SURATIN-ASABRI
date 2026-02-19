import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Key, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../services/api';
import HapusUser from './HapusUser/HapusUser';
import './ManageUser.css';

const ManageUser = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();

    let user = {};
    try {
        user = JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
        user = {};
    }

    useEffect(() => {
        if ((user.role || '').toLowerCase() !== 'admin') {
            Swal.fire({
                icon: 'error',
                title: 'Akses Ditolak',
                text: 'Halaman ini hanya untuk Admin.',
                confirmButtonColor: '#002966'
            }).then(() => {
                navigate('/dashboard');
            });
            return;
        }

        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            console.log('API Response /users:', response.data);
            if (response.data && Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                console.warn('API returned non-array data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            const backendMsg = error.response?.data?.message || 'Gagal mengambil data user.';
            const backendError = error.response?.data?.error || '';
            Swal.fire({
                icon: 'error',
                title: 'Gagal Memuat Data',
                text: `${backendMsg}\n${backendError}\nStatus: ${error.response?.status}`,
                confirmButtonColor: '#002966'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        try {
            setIsDeleting(true);
            await api.delete(`/users/${userToDelete.id}`);
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (error) {
            console.error('Error deleting user:', error);
            const msg = error.response?.data?.message || 'Gagal menghapus user.';
            Swal.fire({
                icon: 'error',
                title: 'Gagal Menghapus',
                text: msg,
                confirmButtonColor: '#002966'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    console.log('Current User Check:', user);

    const filteredUsers = users.filter(user =>
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.username || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-user-container">
            <div className="page-header">
                <div></div>
                <button className="btn-add-user" onClick={() => navigate('/users/tambah')}>
                    <Plus size={18} />
                    TAMBAH USER
                </button>
            </div>

            <div className="search-card">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama atau Username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="content-card">
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>No</th>
                                <th>Nama Lengkap</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th style={{ width: '150px' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center">Memuat data pengguna...</td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.username}</td>
                                        <td>
                                            <span className={`role-badge role-${(user.role || 'staff').toLowerCase()}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                backgroundColor: (user.status || 'aktif').toLowerCase() === 'aktif' ? '#e6f4ea' : '#fce8e6',
                                                color: (user.status || 'aktif').toLowerCase() === 'aktif' ? '#1e7e34' : '#c53030'
                                            }}>
                                                {user.status || 'Aktif'}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <button
                                                className="btn-icon btn-edit"
                                                title="Edit User"
                                                onClick={() => navigate(`/users/edit/${user.id}`)}
                                            >
                                                <Edit2 size={16} />
                                            </button>

                                            <button
                                                className="btn-icon btn-delete"
                                                title="Hapus User"
                                                onClick={() => handleDeleteClick(user)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="empty-state">
                                        Tidak ada pengguna ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pagination">
                    <p>Menampilkan {filteredUsers.length > 0 ? `1 - ${filteredUsers.length}` : '0'} dari {users.length} data</p>
                    <div className="pagination-controls">
                        <button className="page-btn"><ChevronLeft size={16} /></button>
                        <button className="page-btn active">1</button>
                        <button className="page-btn"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
            <HapusUser
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                userName={userToDelete?.name}
                loading={isDeleting}
            />
        </div>
    );
};

export default ManageUser;
