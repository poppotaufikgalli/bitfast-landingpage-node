'use client';

import React, { useState, useEffect } from 'react';
import '../admin.css';

interface Testimonial {
  id: number;
  name: string;
  role_or_company: string;
  rating: number;
  content: string;
  avatar: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

const emptyForm = {
  name: '',
  role_or_company: '',
  rating: 5,
  content: '',
  avatar: '',
  is_featured: false,
  is_active: true,
};

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      role_or_company: t.role_or_company || '',
      rating: t.rating,
      content: t.content,
      avatar: t.avatar || '',
      is_featured: Boolean(t.is_featured),
      is_active: Boolean(t.is_active),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.content) {
      alert('Nama dan konten testimoni wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, id: editingId };
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        fetchTestimonials();
      } else {
        const data = await res.json();
        alert(data.message || 'Gagal menyimpan.');
      }
    } catch (err) {
      console.error('Error saving:', err);
      alert('Koneksi bermasalah.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus testimoni ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTestimonials();
      } else {
        alert('Gagal menghapus.');
      }
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const getInitials = (name: string) => {
    const words = name.split(' ');
    let initials = '';
    for (const w of words) if (w[0]) initials += w[0];
    return initials.substring(0, 2).toUpperCase();
  };

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Manajemen Testimoni Pelanggan</h2>
          <button className="btn-admin" onClick={handleOpenCreate}>
            + Tambah Testimoni
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
            Memuat data testimoni...
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pelanggan</th>
                  <th>Jabatan / Perusahaan</th>
                  <th>Rating</th>
                  <th>Kutipan</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '24px' }}>
                      Belum ada testimoni.
                    </td>
                  </tr>
                ) : (
                  testimonials.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #00ffff, #a855f7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '13px', fontWeight: 700, color: '#000', flexShrink: 0
                          }}>
                            {getInitials(t.name)}
                          </div>
                          <strong>{t.name}</strong>
                        </div>
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)' }}>{t.role_or_company || '-'}</td>
                      <td>
                        <span style={{ color: '#f59e0b', letterSpacing: '2px' }}>
                          {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                        </span>
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          "{t.content}"
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${t.is_active ? 'badge-installed' : 'badge-rejected'}`}>
                          {t.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn-admin-edit" onClick={() => handleOpenEdit(t)}>Edit</button>
                        <button className="btn-admin-danger" onClick={() => handleDelete(t.id)}>Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CREATE/EDIT */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: 'var(--admin-text-muted)' }}>{editingId ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-input-group">
                <label>Nama Pelanggan</label>
                <input
                  className="admin-input"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="cth. Budi Santoso"
                />
              </div>
              <div className="admin-input-group">
                <label>Jabatan / Perusahaan</label>
                <input
                  className="admin-input"
                  value={form.role_or_company}
                  onChange={(e) => setForm((f) => ({ ...f, role_or_company: e.target.value }))}
                  placeholder="cth. Freelance Developer"
                />
              </div>
            </div>

            <div className="admin-input-group">
              <label>Rating Bintang (1 - 5)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setForm((f) => ({ ...f, rating: star }))}
                    style={{
                      fontSize: '28px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: star <= form.rating ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                      lineHeight: 1,
                      transition: 'color 0.2s',
                    }}
                  >
                    ★
                  </button>
                ))}
                <span style={{ marginLeft: '8px', color: 'var(--admin-text-muted)', fontSize: '13px' }}>
                  {form.rating} / 5 bintang
                </span>
              </div>
            </div>

            <div className="admin-input-group">
              <label>Kutipan Testimoni</label>
              <textarea
                className="admin-input"
                rows={4}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Tulis kalimat testimoni lengkap dari pelanggan..."
              />
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
              <label className="admin-checkbox-label" style={{ color: 'var(--admin-text-muted)' }}>
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                />
                Tampilkan di halaman utama (Featured)
              </label>
              <label className="admin-checkbox-label" style={{ color: 'var(--admin-text-muted)' }}>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                />
                Aktif (Tampilkan di website)
              </label>
            </div>

            <div className="admin-modal-actions">
              <button className="btn-admin-secondary" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-admin" onClick={handleSave} disabled={saving}>
                {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Testimoni'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
