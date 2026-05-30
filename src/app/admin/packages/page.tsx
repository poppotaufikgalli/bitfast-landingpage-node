'use client';

import React, { useState, useEffect } from 'react';
import '../admin.css';

interface Package {
  id: number;
  name: string;
  slug: string;
  speed: string;
  price: number;
  category: 'home' | 'business';
  features: string | string[];
  is_popular: boolean;
  is_active: boolean;
}

const emptyForm = {
  name: '',
  slug: '',
  speed: '',
  price: '',
  category: 'home' as 'home' | 'business',
  features: [''],
  is_popular: false,
  is_active: true,
};

export default function PackagesAdminPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/packages');
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const parseFeatures = (features: string | string[]): string[] => {
    if (Array.isArray(features)) return features;
    try {
      const parsed = JSON.parse(features);
      return Array.isArray(parsed) ? parsed : [''];
    } catch {
      return [''];
    }
  };

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const handleOpenEdit = (pkg: Package) => {
    setEditingId(pkg.id);
    setForm({
      name: pkg.name,
      slug: pkg.slug,
      speed: pkg.speed,
      price: String(pkg.price),
      category: pkg.category,
      features: parseFeatures(pkg.features),
      is_popular: Boolean(pkg.is_popular),
      is_active: Boolean(pkg.is_active),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.speed || !form.price) {
      alert('Nama, slug, kecepatan, dan harga wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        features: form.features.filter((f) => f.trim() !== ''),
        id: editingId,
      };

      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/packages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        fetchPackages();
      } else {
        const data = await res.json();
        alert(data.message || 'Gagal menyimpan data.');
      }
    } catch (err) {
      console.error('Error saving package:', err);
      alert('Koneksi bermasalah.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus paket ini? Aksi ini tidak dapat dibatalkan.')) return;
    try {
      const res = await fetch(`/api/admin/packages?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPackages();
      } else {
        alert('Gagal menghapus paket.');
      }
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const addFeatureRow = () => setForm((f) => ({ ...f, features: [...f.features, ''] }));
  const removeFeatureRow = (idx: number) =>
    setForm((f) => ({ ...f, features: f.features.filter((_, i) => i !== idx) }));
  const updateFeature = (idx: number, val: string) =>
    setForm((f) => {
      const updated = [...f.features];
      updated[idx] = val;
      return { ...f, features: updated };
    });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(price);

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Manajemen Paket Internet</h2>
          <button className="btn-admin" onClick={handleOpenCreate}>
            + Tambah Paket Baru
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
            Memuat data paket...
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama Paket</th>
                  <th>Kategori</th>
                  <th>Kecepatan</th>
                  <th>Harga / Bulan</th>
                  <th>Populer?</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {packages.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '24px' }}>
                      Belum ada paket.
                    </td>
                  </tr>
                ) : (
                  packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td><strong>{pkg.name}</strong></td>
                      <td>
                        <span className="badge" style={{
                          background: pkg.category === 'home' ? 'rgba(96,165,250,0.1)' : 'rgba(192,132,252,0.1)',
                          color: pkg.category === 'home' ? '#60a5fa' : '#c084fc',
                          border: `1px solid ${pkg.category === 'home' ? 'rgba(96,165,250,0.2)' : 'rgba(192,132,252,0.2)'}`,
                        }}>
                          {pkg.category}
                        </span>
                      </td>
                      <td>{pkg.speed}</td>
                      <td>Rp {formatPrice(pkg.price)}</td>
                      <td>
                        <span className={`badge ${pkg.is_popular ? 'badge-installed' : ''}`} style={!pkg.is_popular ? { background: 'rgba(255,255,255,0.05)', color: 'var(--admin-text-muted)', border: '1px solid var(--admin-border)' } : {}}>
                          {pkg.is_popular ? 'Populer' : 'Normal'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${pkg.is_active ? 'badge-installed' : 'badge-rejected'}`}>
                          {pkg.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn-admin-edit" onClick={() => handleOpenEdit(pkg)}>Edit</button>
                        <button className="btn-admin-danger" onClick={() => handleDelete(pkg.id)}>Hapus</button>
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
          <div className="admin-modal" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Paket Internet' : 'Tambah Paket Baru'}</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-input-group">
                <label>Nama Paket</label>
                <input
                  className="admin-input"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: generateSlug(e.target.value) }))}
                  placeholder="cth. Bitfast Home Lite"
                />
              </div>
              <div className="admin-input-group">
                <label>Slug URL</label>
                <input
                  className="admin-input"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="bitfast-home-lite"
                />
              </div>
              <div className="admin-input-group">
                <label>Kecepatan</label>
                <input
                  className="admin-input"
                  value={form.speed}
                  onChange={(e) => setForm((f) => ({ ...f, speed: e.target.value }))}
                  placeholder="cth. 30 Mbps"
                />
              </div>
              <div className="admin-input-group">
                <label>Harga per Bulan (Rp)</label>
                <input
                  className="admin-input"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="249000"
                />
              </div>
              <div className="admin-input-group">
                <label>Kategori</label>
                <select
                  className="admin-input"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as 'home' | 'business' }))}
                >
                  <option value="home">Home (Rumah)</option>
                  <option value="business">Business (Bisnis)</option>
                </select>
              </div>
              <div className="admin-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'flex-end' }}>
                <label className="admin-checkbox-label">
                  <input type="checkbox" checked={form.is_popular} onChange={(e) => setForm((f) => ({ ...f, is_popular: e.target.checked }))} />
                  Tandai sebagai Paket Populer
                </label>
                <label className="admin-checkbox-label">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
                  Paket Aktif (tampilkan di website)
                </label>
              </div>
            </div>

            <div className="admin-input-group">
              <label>Fitur Unggulan Paket</label>
              <div className="features-builder-list">
                {form.features.map((feat, idx) => (
                  <div key={idx} className="features-builder-item">
                    <input
                      className="admin-input"
                      value={feat}
                      onChange={(e) => updateFeature(idx, e.target.value)}
                      placeholder={`Fitur #${idx + 1}...`}
                    />
                    {form.features.length > 1 && (
                      <button
                        className="btn-admin-danger"
                        style={{ flexShrink: 0 }}
                        onClick={() => removeFeatureRow(idx)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button className="btn-admin-secondary" onClick={addFeatureRow} style={{ fontSize: '13px', padding: '8px 16px' }}>
                + Tambah Fitur
              </button>
            </div>

            <div className="admin-modal-actions">
              <button className="btn-admin-secondary" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-admin" onClick={handleSave} disabled={saving}>
                {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Buat Paket'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
