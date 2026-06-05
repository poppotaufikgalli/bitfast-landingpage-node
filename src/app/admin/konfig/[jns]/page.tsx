'use client';

import React, { useState, useEffect } from 'react';
import '../../admin.css';
//import router from 'next/router';
import { useRouter, useParams } from 'next/navigation';

interface Konfig {
    id: number;
    judul: string;
    jns: string;
    content: string;
    author_name: string;
    created_at: string;
}

const emptyForm = {
    judul: '',
    jns: '',
    content: '',
};

export default function KonfigsAdminPage() {
    const router = useRouter();
    const [konfigs, setKonfigs] = useState<Konfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });
    const { jns } = useParams();

    const fetchKonfig = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/konfig?jns=' + jns);
            if (res.ok) {
                const data = await res.json();
                setKonfigs(data);
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKonfig();
    }, []);

    const generateSlug = (title: string) =>
        title
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

    const handleOpenEdit = (konfig: Konfig) => {
        setEditingId(konfig.id);
        setForm({
            judul: konfig.judul,
            jns: konfig.jns,
            content: konfig.content,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.judul || (jns !== 'coverage_area' && !form.content)) {
            alert('Judul dan konten artikel wajib diisi.');
            return;
        }
        setSaving(true);
        try {
            form.jns = jns as string;
            const payload = { ...form, id: editingId };
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch(`/api/admin/konfig?jns=` + jns, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setShowModal(false);
                fetchKonfig();
            } else {
                const data = await res.json();
                alert(data.message || 'Gagal menyimpan konfigurasi ' + jns);
            }
        } catch (err) {
            console.error('Error saving post:', err);
            alert('Koneksi bermasalah.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus konfigurasi ini secara permanen?')) return;
        try {
            const res = await fetch(`/api/admin/konfig?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchKonfig();
            } else {
                alert('Gagal menghapus konfigurasi ' + jns);
            }
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date);
    };

    return (
        <div>
            <div className="admin-card">
                <div className="admin-card-header">
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <a className={`admin-nav-link ${jns === 'coverage_area' ? 'active' : ''}`} onClick={() => router.push('/admin/konfig/coverage_area')}>Coverage Area</a>
                        <a className={`admin-nav-link ${jns === 'link' ? 'active' : ''}`} onClick={() => router.push('/admin/konfig/link')}>Link</a>
                        <a className={`admin-nav-link ${jns === 'media_sosial' ? 'active' : ''}`} onClick={() => router.push('/admin/konfig/media_sosial')}>Media Sosial</a>
                    </div>
                    <button className="btn-admin" onClick={handleOpenCreate}>
                        + Tambah {jns === 'link' ? 'Link' : jns === 'coverage_area' ? 'Coverage Area' : 'Media Sosial'}
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                        Memuat daftar {jns === 'link' ? 'Link' : jns === 'coverage_area' ? 'Coverage Area' : 'Media Sosial'}...
                    </div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>{jns === 'coverage_area' ? 'Coverage Area' : 'Judul'}</th>
                                    {jns !== 'coverage_area' && (
                                        <th style={{ textAlign: 'center' }}>Konten</th>
                                    )}
                                    <th style={{ textAlign: 'right' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {konfigs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '24px' }}>
                                            Belum ada {jns === 'link' ? 'Link' : jns === 'coverage_area' ? 'Coverage Area' : 'Media Sosial'}.
                                        </td>
                                    </tr>
                                ) : (
                                    konfigs.map((post) => (
                                        <tr key={post.id}>
                                            <td><strong>{post.judul}</strong></td>
                                            {jns !== 'coverage_area' && (
                                                <td style={{ color: 'var(--admin-text-muted)' }}>{post.content}</td>
                                            )}
                                            <td style={{ textAlign: 'right' }}>
                                                <button className="btn-admin-edit" onClick={() => handleOpenEdit(post)}>Edit</button>
                                                <button className="btn-admin-danger" onClick={() => handleDelete(post.id)}>Hapus</button>
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
                    <div
                        className="admin-modal"
                        style={{ maxWidth: '780px', maxHeight: '92vh' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ color: 'var(--admin-text-muted)' }}>
                            {editingId ? 'Edit ' + (jns === 'link' ? 'Link' : jns === 'coverage_area' ? 'Coverage Area' : 'Media Sosial') : 'Tulis ' + (jns === 'link' ? 'Link' : jns === 'coverage_area' ? 'Coverage Area' : 'Media Sosial')}
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {jns == 'link' && (
                                <>
                                    <div className="admin-input-group">
                                        <label>Judul</label>
                                        <input
                                            className="admin-input"
                                            value={form.judul}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    judul: e.target.value,
                                                    slug: generateSlug(e.target.value),
                                                }))
                                            }
                                            placeholder="cth. Facebook"
                                        />
                                    </div>
                                    <div className="admin-input-group">
                                        <label>Slug URL</label>
                                        <input
                                            className="admin-input"
                                            value={form.content}
                                            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                                            placeholder="https://facebook.com"
                                        />
                                    </div>
                                </>
                            )}

                            {jns == 'media_sosial' && (
                                <>
                                    <div className="admin-input-group">
                                        <label>Media Sosial</label>
                                        <select
                                            className="admin-input"
                                            value={form.judul}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    judul: e.target.value,
                                                    slug: generateSlug(e.target.value),
                                                }))
                                            }
                                        >
                                            <option value="">Pilih Media Sosial</option>
                                            <option value="facebook">Facebook</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="twitter">Twitter</option>
                                            <option value="youtube">Youtube</option>
                                            <option value="tiktok">Tiktok</option>
                                        </select>
                                    </div>
                                    <div className="admin-input-group">
                                        <label>URL</label>
                                        <input
                                            className="admin-input"
                                            value={form.content}
                                            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                                            placeholder="https://facebook.com"
                                        />
                                    </div>
                                </>
                            )}
                            {jns == 'coverage_area' && (
                                <>
                                    <div className="admin-input-group">
                                        <label>Coverage Area</label>
                                        <input
                                            className="admin-input"
                                            value={form.judul}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    judul: e.target.value,
                                                    slug: generateSlug(e.target.value),
                                                }))
                                            }
                                            placeholder="cth. Batam"
                                        />
                                    </div>
                                </>
                            )}

                        </div>

                        <div className="admin-modal-actions">
                            <button className="btn-admin-secondary" onClick={() => setShowModal(false)}>
                                Batal
                            </button>
                            <button className="btn-admin" onClick={handleSave} disabled={saving}>
                                {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}
