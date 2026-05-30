import React from 'react';
import { query } from '@/lib/db';

export const revalidate = 0;

export default async function AdminDashboard() {
  let stats = {
    totalLeads: 0,
    pendingLeads: 0,
    installedLeads: 0,
    totalPackages: 0,
    activeTestimonials: 0,
    publishedPosts: 0,
  };
  
  let latestRegistrations: any[] = [];

  try {
    const totalLeadsRes = await query('SELECT COUNT(*) as count FROM registrations') as any[];
    const pendingLeadsRes = await query("SELECT COUNT(*) as count FROM registrations WHERE status = 'pending'") as any[];
    const installedLeadsRes = await query("SELECT COUNT(*) as count FROM registrations WHERE status = 'installed'") as any[];
    const totalPackagesRes = await query('SELECT COUNT(*) as count FROM packages') as any[];
    const activeTestimonialsRes = await query('SELECT COUNT(*) as count FROM testimonials WHERE is_active = 1') as any[];
    const publishedPostsRes = await query('SELECT COUNT(*) as count FROM posts WHERE is_published = 1') as any[];

    stats = {
      totalLeads: totalLeadsRes[0]?.count || 0,
      pendingLeads: pendingLeadsRes[0]?.count || 0,
      installedLeads: installedLeadsRes[0]?.count || 0,
      totalPackages: totalPackagesRes[0]?.count || 0,
      activeTestimonials: activeTestimonialsRes[0]?.count || 0,
      publishedPosts: publishedPostsRes[0]?.count || 0,
    };

    latestRegistrations = await query(`
      SELECT registrations.*, packages.name as package_name 
      FROM registrations 
      LEFT JOIN packages ON registrations.package_id = packages.id 
      ORDER BY registrations.id DESC 
      LIMIT 5
    `) as any[];
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
  }

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

  const formatDate = (dateVal: Date | string) => {
    if (!dateVal) return '';
    const date = new Date(dateVal);
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  };

  return (
    <div>
      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3>Total Pendaftaran</h3>
          <div className="admin-stat-value">{stats.totalLeads}</div>
        </div>
        <div className="admin-stat-card" style={{ borderColor: 'rgba(251, 191, 36, 0.2)' }}>
          <h3>Lead Pending</h3>
          <div className="admin-stat-value" style={{ color: 'var(--status-pending)' }}>{stats.pendingLeads}</div>
        </div>
        <div className="admin-stat-card" style={{ borderColor: 'rgba(52, 211, 153, 0.2)' }}>
          <h3>Terpasang (Installed)</h3>
          <div className="admin-stat-value" style={{ color: 'var(--status-installed)' }}>{stats.installedLeads}</div>
        </div>
        <div className="admin-stat-card">
          <h3>Paket Internet</h3>
          <div className="admin-stat-value">{stats.totalPackages}</div>
        </div>
        <div className="admin-stat-card">
          <h3>Testimoni Aktif</h3>
          <div className="admin-stat-value">{stats.activeTestimonials}</div>
        </div>
        <div className="admin-stat-card">
          <h3>Artikel Blog</h3>
          <div className="admin-stat-value">{stats.publishedPosts}</div>
        </div>
      </div>

      {/* Latest Registrations Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Pendaftaran Lead Terbaru (Maks. 5)</h2>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama Lengkap</th>
                <th>No. HP / WA</th>
                <th>Paket Pilihan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {latestRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '24px' }}>
                    Belum ada pendaftaran lead masuk.
                  </td>
                </tr>
              ) : (
                latestRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>{formatDate(reg.created_at)}</td>
                    <td><strong>{reg.name}</strong><br /><span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{reg.email}</span></td>
                    <td>{reg.phone}</td>
                    <td>{reg.package_name || <span style={{ fontStyle: 'italic', color: 'var(--admin-text-muted)' }}>Belum Pilih</span>}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(reg.status)}`}>
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
