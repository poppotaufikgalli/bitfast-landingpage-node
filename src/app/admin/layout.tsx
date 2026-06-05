'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './admin.css';
import { request } from 'http';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [userName, setUserName] = React.useState('');

  React.useEffect(() => {
    async function checkAdmin() {
      const res = await fetch('/api/admin/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { id, name } = await res.json();
      console.log(name);
      setIsAdmin(id === 1);
      setUserName(name);
    }
    checkAdmin();
  }, []);

  // Don't show layout on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    if (!confirm('Apakah Anda yakin ingin logout dari CMS?')) return;

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'logout' }),
      });

      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Logout error:', err);
      alert('Gagal logout. Hubungi IT Support.');
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  // const isAdmin = async () => {
  //   try {
  //     const res = await fetch('/api/admin/profile', {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     const data = await res.json();
  //     return data.id === 1;
  //   } catch (err) {
  //     console.error('Admin check error:', err);
  //     return false;
  //   }
  // };

  return (
    <div className="admin-body">
      <div className="admin-container">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-logo">
            BITFAST<span>.</span>ADMIN
          </div>

          <nav className="admin-nav">
            <a
              className={`admin-nav-link ${isActive('/admin') && !isActive('/admin/') ? 'active' : ''}`}
              onClick={() => router.push('/admin')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              Dashboard
            </a>

            <a
              className={`admin-nav-link ${isActive('/admin/registrations') ? 'active' : ''}`}
              onClick={() => router.push('/admin/registrations')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Pendaftaran Lead
            </a>

            <a
              className={`admin-nav-link ${isActive('/admin/packages') ? 'active' : ''}`}
              onClick={() => router.push('/admin/packages')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Paket Internet
            </a>

            <a
              className={`admin-nav-link ${isActive('/admin/testimonials') ? 'active' : ''}`}
              onClick={() => router.push('/admin/testimonials')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Testimoni Klien
            </a>

            <a
              className={`admin-nav-link ${isActive('/admin/posts') ? 'active' : ''}`}
              onClick={() => router.push('/admin/posts')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2zM12 11l3 3m0 0l-3 3m3-3H8" />
              </svg>
              Artikel Blog
            </a>

            <a
              className={`admin-nav-link ${isActive('/admin/konfig') ? 'active' : ''}`}
              onClick={() => router.push('/admin/konfig/link')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2zM12 11l3 3m0 0l-3 3m3-3H8" />
              </svg>
              Config Aplikasi
            </a>

            {isAdmin && (
              <a
                className={`admin-nav-link ${isActive('/admin/users') ? 'active' : ''}`}
                onClick={() => router.push('/admin/users')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                  <path d="M9 10a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
                </svg>
                User
              </a>
            )}

            <a
              className="admin-nav-link"
              onClick={() => window.open('/', '_blank')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Lihat Website
            </a>

            <a className="admin-nav-link logout-btn" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Header info */}
          <div className="admin-header">
            <h1>CMS Bitfast</h1>
            <div className="admin-user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Masuk sebagai: <button onClick={() => router.push('/admin/profile')}
                className="admin-nav-link">{userName}</button>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
