'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../admin.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 200 && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Kredensial login salah.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Gagal menghubungkan ke server. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-body">
      <div className="login-container">
        <div className="login-box">
          <div className="login-logo">
            BITFAST<span>.</span>ADMIN
          </div>
          <div className="login-subtitle">Content Management System</div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="admin-input-group">
              <label htmlFor="login-email">Alamat Email</label>
              <input
                type="email"
                id="login-email"
                className="admin-input"
                placeholder="admin@bitfast.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="admin-input-group">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                className="admin-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-admin btn-login" disabled={loading}>
              {loading ? 'Memproses...' : 'Login Ke Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
