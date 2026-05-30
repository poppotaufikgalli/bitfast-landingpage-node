'use client';

import React, { useState, useEffect } from 'react';
import '../admin.css';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  is_published: boolean;
  published_at: string | null;
  author_name: string;
  created_at: string;
}

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  is_published: false,
};

export default function PostsAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
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

  const handleOpenEdit = (post: Post) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      cover_image: post.cover_image || '',
      is_published: Boolean(post.is_published),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      alert('Judul dan konten artikel wajib diisi.');
      return;
    }
    if (!form.slug) {
      setForm((f) => ({ ...f, slug: generateSlug(form.title) }));
    }
    setSaving(true);
    try {
      const payload = { ...form, id: editingId };
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/posts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        fetchPosts();
      } else {
        const data = await res.json();
        alert(data.message || 'Gagal menyimpan artikel.');
      }
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Koneksi bermasalah.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus artikel ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPosts();
      } else {
        alert('Gagal menghapus artikel.');
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
          <h2>Manajemen Artikel Blog</h2>
          <button className="btn-admin" onClick={handleOpenCreate}>
            + Tulis Artikel Baru
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
            Memuat daftar artikel...
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Judul Artikel</th>
                  <th>Penulis</th>
                  <th>Tanggal Terbit</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '24px' }}>
                      Belum ada artikel.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <strong>{post.title}</strong>
                        {post.excerpt && (
                          <span style={{ display: 'block', fontSize: '12px', color: 'var(--admin-text-muted)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '360px' }}>
                            {post.excerpt}
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)' }}>{post.author_name || 'Admin'}</td>
                      <td>{formatDate(post.published_at)}</td>
                      <td>
                        <span className={`badge ${post.is_published ? 'badge-installed' : 'badge-pending'}`}>
                          {post.is_published ? 'Diterbitkan' : 'Draft'}
                        </span>
                      </td>
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
            <h3>{editingId ? 'Edit Artikel Blog' : 'Tulis Artikel Baru'}</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="admin-input-group">
                <label>Judul Artikel</label>
                <input
                  className="admin-input"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      title: e.target.value,
                      slug: generateSlug(e.target.value),
                    }))
                  }
                  placeholder="cth. Tips Memaksimalkan Wi-Fi Router di Rumah Anda"
                />
              </div>


              <div className="admin-input-group">
                <label>Slug URL</label>
                <input
                  className="admin-input"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="tips-memaksimalkan-wifi-router"
                />
              </div>
            </div>
            <div className="admin-input">
              <label>Gambar Cover</label>
              {form.cover_image
                && <img src={'/uploads/' + form.cover_image} alt={form.cover_image} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
              }
              <input
                type="file"
                name="file"
                accept='image/*'
                onChange={async (e) => {
                  if (e.target.files) {
                    const formData = new FormData();
                    Object.values(e.target.files).forEach((file) => {
                      formData.append("file", file);
                    });

                    const response = await fetch("/api/admin/upload", {
                      method: "POST",
                      body: formData,
                    });

                    const result = await response.json();
                    if (result.success) {
                      setForm((f) => ({ ...f, cover_image: result.name }));
                    } else {
                      alert("Upload failed");
                    }
                  }
                }}
              />
            </div>

            <div className="admin-input-group">
              <label>Ringkasan / Excerpt</label>
              <textarea
                className="admin-input"
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="Ringkasan singkat artikel untuk ditampilkan di kartu blog (1-2 kalimat)..."
              />
            </div>

            <div className="admin-input-group">
              <label>
                Konten Artikel (HTML diperbolehkan){' '}
                <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: 400 }}>
                  — gunakan &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;h3&gt;, dsb.
                </span>
              </label>
              <textarea
                className="admin-input"
                rows={12}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="<p>Tulis konten artikel di sini...</p>"
                style={{ fontFamily: 'monospace', fontSize: '13px' }}
              />
            </div>

            <label className="admin-checkbox-label" style={{ marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
              />
              Publikasikan artikel sekarang (tampilkan di website)
            </label>

            <div className="admin-modal-actions">
              <button className="btn-admin-secondary" onClick={() => setShowModal(false)}>
                Batal
              </button>
              <button className="btn-admin" onClick={handleSave} disabled={saving}>
                {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Publikasikan Artikel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
