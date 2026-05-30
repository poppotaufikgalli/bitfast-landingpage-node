'use client';

import React, { useState, useEffect } from 'react';
import '../admin.css';

interface Registration {
  id: number;
  package_id: number | null;
  package_name: string | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'pending' | 'contacted' | 'surveyed' | 'installed' | 'rejected';
  notes: string | null;
  created_at: string;
}

export default function RegistrationsAdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  
  // Modal Edit states
  const [editStatus, setEditStatus] = useState<'pending' | 'contacted' | 'surveyed' | 'installed' | 'rejected'>('pending');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/registrations');
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleOpenEdit = (reg: Registration) => {
    setSelectedReg(reg);
    setEditStatus(reg.status);
    setEditNotes(reg.notes || '');
  };

  const handleSave = async () => {
    if (!selectedReg) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedReg.id,
          status: editStatus,
          notes: editNotes,
        }),
      });

      if (res.ok) {
        setSelectedReg(null);
        fetchRegistrations();
      } else {
        alert('Gagal memperbarui data.');
      }
    } catch (err) {
      console.error('Error updating registration:', err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lead ini secara permanen?')) return;
    
    try {
      const res = await fetch(`/api/admin/registrations?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchRegistrations();
        if (selectedReg?.id === id) {
          setSelectedReg(null);
        }
      } else {
        alert('Gagal menghapus data.');
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
      alert('Koneksi bermasalah.');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'badge-pending';
      case 'contacted': return 'badge-contacted';
      case 'surveyed': return 'badge-surveyed';
      case 'installed': return 'badge-installed';
      case 'rejected': return 'badge-rejected';
      default: return '';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  };

  const filteredRegistrations = statusFilter === 'all' 
    ? registrations 
    : registrations.filter(r => r.status === statusFilter);

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Daftar Pendaftaran Lead</h2>
          
          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <select 
              className="admin-input" 
              style={{ width: 'auto', padding: '8px 16px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="contacted">Hubungi (Contacted)</option>
              <option value="surveyed">Survei Lokasi (Surveyed)</option>
              <option value="installed">Terpasang (Installed)</option>
              <option value="rejected">Ditolak (Rejected)</option>
            </select>
            <button className="btn-admin-secondary" onClick={fetchRegistrations}>Refresh</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
            Sedang memuat data lead...
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tanggal Masuk</th>
                  <th>Nama Lengkap</th>
                  <th>Nomor Kontak</th>
                  <th>Paket Pilihan</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '24px' }}>
                      Tidak ditemukan pendaftaran lead.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id}>
                      <td>{formatDate(reg.created_at)}</td>
                      <td>
                        <strong>{reg.name}</strong>
                        <br />
                        <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{reg.email}</span>
                      </td>
                      <td>{reg.phone}</td>
                      <td>{reg.package_name || <span style={{ fontStyle: 'italic', color: 'var(--admin-text-muted)' }}>Belum Pilih</span>}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(reg.status)}`}>
                          {reg.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn-admin-edit" onClick={() => handleOpenEdit(reg)}>Kelola</button>
                        <button className="btn-admin-danger" onClick={() => handleDelete(reg.id)}>Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DETIL & UPDATE STATUS */}
      {selectedReg && (
        <div className="admin-modal-overlay" onClick={() => setSelectedReg(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Kelola Detail Lead Pendaftaran</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontSize: '14px' }}>
              <div>
                <span style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '11px', fontWeight: 600 }}>NAMA PELANGGAN</span>
                <strong>{selectedReg.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '11px', fontWeight: 600 }}>ALAMAT EMAIL</span>
                {selectedReg.email}
              </div>
              <div>
                <span style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '11px', fontWeight: 600 }}>NO. HP / WHATSAPP</span>
                <strong>{selectedReg.phone}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '11px', fontWeight: 600 }}>PAKET PILIHAN</span>
                {selectedReg.package_name || 'Tidak memilih paket'}
              </div>
            </div>

            <div style={{ marginBottom: '24px', fontSize: '14px' }}>
              <span style={{ color: 'var(--admin-text-muted)', display: 'block', fontSize: '11px', fontWeight: 600 }}>ALAMAT PEMASANGAN LENGKAP</span>
              <p style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginTop: '4px', whiteSpace: 'pre-wrap' }}>
                {selectedReg.address}
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--admin-border)', margin: '20px 0' }} />

            <div className="admin-input-group">
              <label>Update Status Proses</label>
              <select 
                className="admin-input"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as any)}
              >
                <option value="pending">Pending (Baru Masuk)</option>
                <option value="contacted">Hubungi Customer (Contacted)</option>
                <option value="surveyed">Jadwal Survei Lokasi (Surveyed)</option>
                <option value="installed">Selesai Pasang (Installed)</option>
                <option value="rejected">Dibatalkan / Ditolak (Rejected)</option>
              </select>
            </div>

            <div className="admin-input-group">
              <label>Catatan Admin & Tim Lapangan</label>
              <textarea 
                className="admin-input" 
                rows={4}
                placeholder="Tulis detail jadwal survei, kendala lokasi, atau nomor router di sini..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
              />
            </div>

            <div className="admin-modal-actions">
              <button className="btn-admin-secondary" onClick={() => setSelectedReg(null)}>Kembali</button>
              <button className="btn-admin" onClick={handleSave} disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Pembaruan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
