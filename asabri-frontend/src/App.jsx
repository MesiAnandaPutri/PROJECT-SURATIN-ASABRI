import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import SuratMasuk from './pages/SuratMasuk/Form Utama/SuratMasuk';
import TambahSuratMasuk from './pages/SuratMasuk/TambahSuratMasuk/TambahSuratMasuk';
import EditSuratMasuk from './pages/SuratMasuk/EditSurat/EditSuratMasuk';
import SuratKeluar from './pages/SuratKeluar/FormUtama/SuratKeluar';
import TambahSuratKeluar from './pages/SuratKeluar/TambahSuratKeluar/TambahSuratKeluar';
import EditSuratKeluar from './pages/SuratKeluar/EditSurat/EditSuratKeluar';
import Laporan from './pages/Laporan/Laporan';
import ManageUser from './pages/ManageUser/ManageUser';
import TambahUser from './pages/ManageUser/TambahUser/TambahUser';
import EditUser from './pages/ManageUser/EditUser/EditUser';
import './App.css';

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/surat-masuk" element={<SuratMasuk />} />
            <Route path="/surat-masuk/tambah" element={<TambahSuratMasuk />} />
            <Route path="/surat-masuk/edit/:id" element={<EditSuratMasuk />} />
            <Route path="/surat-keluar" element={<SuratKeluar />} />
            <Route path="/surat-keluar/tambah" element={<TambahSuratKeluar />} />
            <Route path="/surat-keluar/edit/:id" element={<EditSuratKeluar />} />
            <Route path="/laporan" element={<Laporan />} />
            <Route path="/users" element={<ManageUser />} />
            <Route path="/users/tambah" element={<TambahUser />} />
            <Route path="/users/edit/:id" element={<EditUser />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
