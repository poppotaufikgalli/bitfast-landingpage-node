'use client';

import React, { useState, useEffect } from 'react';
import '../admin.css';
import { redirect } from 'next/dist/server/api-utils';
import router from 'next/router';

interface Profile {
    id: number;
    email: string;
}

interface Password {
    id: number;
    oldpassword: string;
    newpassword: string;
    newpasswordConfirm: string;
}

const emptyFormProfile = {
    id: null,
    email: '',
};

const emptyFormPassword = {
    id: null,
    oldpassword: '',
    newpassword: '',
    newpasswordConfirm: '',
};

export default function ProfileAdminPage() {
    const [profile, setProfile] = useState<Profile[]>([]);
    const [password, setPassword] = useState<Password[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formProfile, setFormProfile] = useState(emptyFormProfile);
    const [formPassword, setFormPassword] = useState(emptyFormPassword);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/profile');
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setFormProfile({
                    id: data.id,
                    email: data.email,
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // const handleSave = async () => {
    //     if (!form.email || !form.oldpassword || !form.newpassword) {
    //         alert('Email dan kata sandi wajib diisi.');
    //         return;
    //     }
    //     setSaving(true);
    //     try {
    //         const payload = { ...form, id: editingId };
    //         const method = editingId ? 'PUT' : 'POST';
    //         const res = await fetch('/api/admin/profile', {
    //             method,
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(payload),
    //         });

    //         if (res.ok) {
    //             setShowModal(false);
    //             fetchPosts();
    //         } else {
    //             const data = await res.json();
    //             alert(data.message || 'Gagal menyimpan artikel.');
    //         }
    //     } catch (err) {
    //         console.error('Error saving post:', err);
    //         alert('Koneksi bermasalah.');
    //     } finally {
    //         setSaving(false);
    //     }
    // };

    const handleEmailChange = async () => {
        if (!formProfile.email) {
            alert('Email wajib diisi.');
            return;
        }
        setSaving(true);
        try {
            const payload = { ...formProfile };
            const method = 'PUT';
            const res = await fetch('/api/admin/profile', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert('Email berhasil diupdate. silahkan logout untuk mencoba email');
                fetchPosts();
            } else {
                const data = await res.json();
                alert(data.message || 'Gagal menyimpan email.');
            }
        } catch (err) {
            console.error('Error updating email:', err);
            alert('Koneksi bermasalah.');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!formPassword.oldpassword || !formPassword.newpassword) {
            alert('Kata sandi wajib diisi.');
            return;
        }

        if (formPassword.newpassword !== formPassword.newpasswordConfirm) {
            alert('Konfirmasi kata sandi tidak cocok.');
            return;
        }
        setSaving(true);
        try {
            const payload = { ...formPassword };
            const method = 'PUT';
            const res = await fetch('/api/admin/password', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                // setShowModal(false);
                alert('Password berhasil diupdate. silahkan logout untuk mencoba password');
                setFormPassword(emptyFormPassword);
                fetchPosts();
                //router.push('/admin/logout');
            } else {
                const data = await res.json();
                alert(data.message || 'Gagal menyimpan kata sandi.');
            }
        } catch (err) {
            console.error('Error updating password:', err);
            alert('Koneksi bermasalah.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="admin-card">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                        Memuat informasi profil...
                    </div>
                ) : (
                    <>
                        <div className="admin-input-group">
                            <label>
                                Email
                            </label>
                            <input
                                className="admin-input"
                                value={formProfile.email}
                                onChange={(e) => setFormProfile((f) => ({ ...f, email: e.target.value }))}
                                placeholder="Masukkan email Anda"
                                style={{ fontFamily: 'monospace', fontSize: '13px' }}
                            />
                        </div>
                        <div className="admin-input-group">
                            <button onClick={handleEmailChange} className="btn btn-primary" disabled={saving}>
                                {saving ? 'Mengupdate Email...' : 'Update Email'}
                            </button>
                        </div>
                    </>
                )}
            </div>
            <div className="admin-card">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                        Memuat informasi kata sandi...
                    </div>
                ) : (
                    <>
                        <div className="admin-input-group">
                            <label>
                                Kata Sandi Lama
                            </label>
                            <input
                                className="admin-input"
                                value={formPassword.oldpassword}
                                onChange={(e) => setFormPassword((f) => ({ ...f, oldpassword: e.target.value }))}
                                placeholder="Masukkan kata sandi Anda"
                                style={{ fontFamily: 'monospace', fontSize: '13px' }}
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>
                                Kata Sandi Baru
                            </label>
                            <input
                                className="admin-input"
                                value={formPassword.newpassword}
                                onChange={(e) => setFormPassword((f) => ({ ...f, newpassword: e.target.value }))}
                                placeholder="Masukkan kata sandi Anda"
                                style={{ fontFamily: 'monospace', fontSize: '13px' }}
                            />
                        </div>
                        <div className="admin-input-group">
                            <label>
                                Konfirmasi Kata Sandi Baru
                            </label>
                            <input
                                className="admin-input"
                                value={formPassword.newpasswordConfirm}
                                onChange={(e) => setFormPassword((f) => ({ ...f, newpasswordConfirm: e.target.value }))}
                                placeholder="Masukkan kata sandi Anda"
                                style={{ fontFamily: 'monospace', fontSize: '13px' }}
                            />
                        </div>
                        <div className="admin-input-group">
                            <button onClick={handlePasswordChange} className="btn btn-primary" disabled={saving}>
                                {saving ? 'Mengupdate Kata Sandi...' : 'Update Kata Sandi'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
