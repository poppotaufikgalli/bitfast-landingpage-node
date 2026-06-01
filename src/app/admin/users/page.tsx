'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import '../admin.css'

interface User {
    id: string
    name: string
    email: string
    password: string
}

const emptyForm = {
    id: '',
    name: '',
    email: '',
    password: '',
};

export default function UserPage() {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (res.ok) {
                const data = await res.json()
                //console.log(data)
                setUsers(data || [])
            } else {
                console.error('Failed to fetch users')
            }
        } catch (err) {
            console.error('Error fetching users:', err)
        } finally {
            setLoading(false)
        }
    }

    const openModal = (user: User) => {
        setSelectedUser(user)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedUser(null)
        setIsModalOpen(false)
    }

    const deleteUser = async (userId: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return

        try {
            const res = await fetch('/api/admin/user', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            })

            if (res.ok) {
                fetchUsers()
                alert('User berhasil dihapus!')
            } else {
                alert('Gagal menghapus user')
            }
        } catch (err) {
            console.error('Error deleting user:', err)
            alert('Gagal menghapus user')
        }
    }

    const handleOpenCreate = () => {
        setEditingId(null);
        setForm({ ...emptyForm });
        setShowModal(true);
    };

    const saveUser = async () => {
        if (!form.name || !form.email) {
            alert('Nama dan email wajib diisi.');
            return;
        }

        setSaving(true);
        try {
            const payload = { ...form, id: editingId };
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch('/api/admin/user', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                //alert('User berhasil diupdate!')
                //closeModal()
                setShowModal(false);
                fetchUsers()
            } else {
                const data = await res.json();
                alert(data.message || 'Gagal menyimpan.');
            }
        } catch (err) {
            console.error('Error updating user:', err)
            alert('Gagal mengupdate user')
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-content">
                <div className="admin-card">
                    <div className="text-center py-8">Loading...</div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="admin-card">
                <div className="admin-card-header">
                    <h1 className="admin-title">User</h1>
                    <button
                        className="btn-admin"
                        onClick={handleOpenCreate}
                    >
                        + Tambah User Baru
                    </button>
                </div>

                <div className="admin-table-container">
                    {/* {JSON.stringify(users)} */}
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID User</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8">
                                        Belum ada data user
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td className="flex gap-2">
                                            <button
                                                onClick={() => openModal(user)}
                                                className="btn-admin-edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="btn-admin-danger"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
                    <div
                        className="admin-modal"
                        style={{ maxWidth: '780px', maxHeight: '92vh' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ color: 'var(--admin-text-muted)' }}>{editingId ? 'Edit User' : 'Tambah User Baru'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="admin-input-group">
                                <label>
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    className="admin-input"
                                />
                            </div>

                            <div className="admin-input-group">
                                <label>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                    className="admin-input"
                                />
                            </div>

                            <div className="admin-input-group">
                                <label>
                                    Password
                                </label>
                                <input
                                    type="text"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({ ...form, password: e.target.value })
                                    }
                                    className="admin-input"
                                />
                            </div>
                            <div className="admin-modal-actions">
                                <button className="btn-admin-secondary" onClick={() => setShowModal(false)}>
                                    Batal
                                </button>
                                <button className="btn-admin" onClick={saveUser} disabled={saving}>
                                    {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Simpan User'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}