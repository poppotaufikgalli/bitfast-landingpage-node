'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Package {
  id: number;
  name: string;
  slug: string;
  speed: string;
  price: number;
  category: 'home' | 'business';
  features: string[];
  is_popular: boolean;
  is_active: boolean;
}

interface Testimonial {
  id: number;
  name: string;
  role_or_company: string;
  rating: number;
  content: string;
  avatar: string | null;
  is_featured: boolean;
  is_active: boolean;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  is_published: boolean;
  published_at: string;
}

interface Konfigs {
  id: number;
  jns: string;
  judul: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface LandingPageClientProps {
  initialPackages: Package[];
  initialTestimonials: Testimonial[];
  initialPosts: Post[];
  initialCoverage: Konfigs[];
  initialLinks: Konfigs[];
  initialSosmed: Konfigs[];
}

export default function LandingPageClient({
  initialPackages,
  initialTestimonials,
  initialPosts,
  initialCoverage,
  initialLinks,
  initialSosmed,
}: LandingPageClientProps) {
  // --- STATES ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNavLink, setActiveNavLink] = useState('home');

  // Hero speed gauge animation
  const [gaugeSpeed, setGaugeSpeed] = useState(150);
  const speedIndexRef = useRef(3); // start index at 3 (150 Mbps)
  const speeds = [30, 50, 100, 150, 300, 500, 750, 1000];

  // Packages tab filter
  const [packageCategory, setPackageCategory] = useState<'home' | 'business'>('home');

  // Lead Form
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPackageId, setFormPackageId] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Coverage Checker
  const [coverageQuery, setCoverageQuery] = useState('');
  const [coverageResult, setCoverageResult] = useState<{
    text: string;
    type: 'success' | 'error' | '';
  }>({ text: '', type: '' });

  // Blog Modal
  const [activePost, setActivePost] = useState<Post | null>(null);

  // --- EFFECTS ---

  // Header Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Speed Gauge Countup loop — uses a ref for currentVal to avoid stale closures
  const gaugeSpeedRef = useRef(150);

  useEffect(() => {
    let counterTimer: ReturnType<typeof setInterval> | null = null;

    const interval = setInterval(() => {
      const nextIdx = (speedIndexRef.current + 1) % speeds.length;
      speedIndexRef.current = nextIdx;
      const targetSpeed = speeds[nextIdx];

      if (counterTimer) clearInterval(counterTimer);

      counterTimer = setInterval(() => {
        const curr = gaugeSpeedRef.current;
        const step = curr < targetSpeed ? 5 : -5;
        const next = curr + step;

        if ((step > 0 && next >= targetSpeed) || (step < 0 && next <= targetSpeed)) {
          gaugeSpeedRef.current = targetSpeed;
          setGaugeSpeed(targetSpeed);
          if (counterTimer) clearInterval(counterTimer);
        } else {
          gaugeSpeedRef.current = next;
          setGaugeSpeed(next);
        }
      }, 20);
    }, 3500);

    return () => {
      clearInterval(interval);
      if (counterTimer) clearInterval(counterTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Body overflow locking when blog modal is open
  useEffect(() => {
    if (activePost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [activePost]);

  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePost(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- HANDLERS ---

  // Nav link click smooth scroll
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setActiveNavLink(id);

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Choose package button
  const handleChoosePackage = (packageId: number) => {
    setFormPackageId(packageId.toString());
    const registerSection = document.getElementById('register');
    if (registerSection) {
      registerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Coverage Checker Search
  const handleCheckCoverage = () => {
    const query = coverageQuery.trim().toLowerCase();

    if (query.length < 3) {
      setCoverageResult({
        text: 'Silakan masukkan minimal 3 karakter untuk pengecekan.',
        type: 'error'
      });
      return;
    }

    // const coveredAreas = [
    //   'jakarta', 'jakarta selatan', 'jakarta timur', 'jakarta barat', 'jakarta utara', 'jakarta pusat',
    //   'tangerang', 'tangerang selatan', 'bsd', 'ciputat', 'pamulang', 'karawaci', 'ciledug',
    //   'bekasi', 'bekasi timur', 'bekasi barat', 'cikarang', 'tambun',
    //   'depok', 'margonda', 'cinere', 'sawangan', 'cibinong',
    //   'bogor', 'sentul', 'bogor timur', 'bogor utara',
    //   'bandung', 'dago', 'buah batu', 'lembang', 'cimahi',
    //   'surabaya', 'rungkut', 'dharmahusada', 'wonokromo',
    //   'semarang', 'simpang lima', 'tembalang'
    // ];

    // const isCovered = coveredAreas.some(area => area.includes(query) || query.includes(area));
    const isCovered = initialCoverage.filter(c => c.judul.toLowerCase() == query).length > 0;

    if (isCovered) {
      setCoverageResult({
        text: `Selamat! Wilayah "${coverageQuery}" sudah sepenuhnya tercover jaringan Fiber Optik Bitfast. Silakan isi form di bawah untuk melakukan pendaftaran.`,
        type: 'success'
      });
    } else {
      setCoverageResult({
        text: `Maaf! Wilayah "${coverageQuery}" belum tercover langsung jaringan Fiber Optik utama. Anda tetap dapat mengisi form di bawah agar tim planning kami dapat mensurvei potensi penarikan kabel ke wilayah Anda.`,
        type: 'error'
      });
    }
  };

  // Lead Registration submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          package_id: formPackageId || null,
          address: formAddress,
        }),
      });

      const data = await response.json();

      if (response.status === 200 && data.success) {
        setSuccessMessage(data.message);
        setShowSuccessOverlay(true);
        // Reset form
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormPackageId('');
        setFormAddress('');
      } else if (response.status === 422 && data.errors) {
        // Map Laravel/Next validation errors
        const mappedErrors: Record<string, string> = {};
        for (const key in data.errors) {
          mappedErrors[key] = data.errors[key][0];
        }
        setFormErrors(mappedErrors);
      } else {
        alert(data.message || 'Terjadi kesalahan sistem. Silakan hubungi kami melalui WhatsApp.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Koneksi internet bermasalah. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helpers
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(price);
  };

  const getInitials = (name: string) => {
    const words = name.split(' ');
    let initials = '';
    for (const w of words) {
      if (w[0]) initials += w[0];
    }
    return initials.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  const formatLongDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  // Filter packages
  const filteredPackages = initialPackages.filter(p => p.category === packageCategory);

  return (
    <>
      {/* --- HEADER / NAVIGATION --- */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`} id="header">
        <div className="container nav-container">
          <a href="#" className="logo" onClick={(e) => handleNavClick(e, 'home')}>
            <img src="/Logo2.png" alt="BITFAST" width="150" />
          </a>

          <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`} id="nav-menu">
            <li>
              <a
                href="#"
                className={`nav-link ${activeNavLink === 'home' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, 'home')}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#packages"
                className={`nav-link ${activeNavLink === 'packages' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, 'packages')}
              >
                Paket
              </a>
            </li>
            <li>
              <a
                href="#coverage"
                className={`nav-link ${activeNavLink === 'coverage' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, 'coverage')}
              >
                Coverage
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                className={`nav-link ${activeNavLink === 'testimonials' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, 'testimonials')}
              >
                Testimoni
              </a>
            </li>
            <li>
              <a
                href="#blog"
                className={`nav-link ${activeNavLink === 'blog' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, 'blog')}
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#register"
                className="btn btn-nav"
                onClick={(e) => handleNavClick(e, 'register')}
              >
                Daftar Sekarang
              </a>
            </li>
          </ul>

          <button
            className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
            id="menu-toggle"
            aria-label="Toggle Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="hero" id="home">
        <div className="container hero-grid">
          <div className="hero-content">
            <h1>
              Internet Cepat<br />
              <span className="gradient-text">Ora Ngadat</span>
            </h1>
            <p>
              Nikmati kebebasan berinternet dengan jaringan 100% Fiber Optik murni dari Bitfast. Tanpa batasan kuota (FUP), latensi ultra rendah, dan kecepatan simetris untuk kebutuhan rumah serta bisnis Anda.
            </p>
            <div className="hero-btns">
              <a href="#packages" className="btn btn-primary" onClick={(e) => handleNavClick(e, 'packages')}>Lihat Paket</a>
              <a href="#register" className="btn btn-outline" onClick={(e) => handleNavClick(e, 'register')}>Langganan Baru</a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <h3 id="stat-speed">1 Gbps</h3>
                <p>Kec. Maksimal</p>
              </div>
              <div className="stat-item">
                <h3>99.9%</h3>
                <p>Jaminan Uptime</p>
              </div>
              <div className="stat-item">
                <h3>100%</h3>
                <p>Fiber Optik</p>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="gauge-container">
              <div className="gauge-inner">
                <span className="gauge-speed" id="gauge-speed-val">{gaugeSpeed}</span>
                <span className="gauge-unit">Mbps</span>
                <div className="gauge-node"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PACKAGES SECTION --- */}
      <section className="section" id="packages">
        <div className="container">
          <div className="section-title">
            <h2>Paket Internet Tersedia</h2>
            <p>Temukan paket internet terbaik yang dirancang khusus untuk kenyamanan berselancar keluarga Anda atau untuk mendongkrak performa bisnis Anda.</p>
          </div>

          <div className="packages-toggle">
            <button
              className={`toggle-tab ${packageCategory === 'home' ? 'active_a' : ''}`}
              onClick={() => setPackageCategory('home')}
            >
              Untuk Rumah (Home)
            </button>
            <button
              className={`toggle-tab ${packageCategory === 'business' ? 'active_a' : ''}`}
              onClick={() => setPackageCategory('business')}
            >
              Untuk Bisnis (Business)
            </button>
          </div>

          {/* Packages Grid */}
          <div className="packages-grid package-group-view">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className={`package-card ${pkg.is_popular ? 'popular' : ''}`}>
                {pkg.is_popular ? (
                  <div className="package-popular-badge">Populer</div>
                ) : <></>}
                <span className="package-category">
                  {pkg.category === 'home' ? 'HOME BROADBAND' : 'BUSINESS DEDICATED'}
                </span>
                <h3 className="package-name">{pkg.name}</h3>

                <div className="package-price-box">
                  <div className="package-price">
                    Rp {formatPrice(pkg.price)}<span>/bulan</span>
                  </div>
                  <div className="package-speed">
                    {pkg.category === 'home' ? `Up to ${pkg.speed}` : `${pkg.speed} Simetris`}
                  </div>
                </div>

                <ul className="package-features">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="package-feature-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`btn ${pkg.is_popular ? 'btn-primary' : 'btn-outline'} btn-package`}
                  onClick={() => handleChoosePackage(pkg.id)}
                >
                  Pilih Paket
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- COVERAGE SECTION --- */}
      <section className="section" id="coverage">
        <div className="container">
          <div className="coverage-box">
            <div className="coverage-grid">
              <div className="coverage-content">
                <h3>Cek Coverage Area Anda</h3>
                <p>Jaringan serat optik Bitfast terus berekspansi dengan cepat ke berbagai kota dan kecamatan. Masukkan wilayah tinggal Anda untuk memeriksa apakah layanan kami sudah dapat dipasang.</p>

                <div className="coverage-list">
                  {initialCoverage.filter(c => c.jns === 'coverage_area').map((coverage, idx) => (
                    <div key={coverage.id} className="coverage-city"><span></span>{coverage.judul}</div>
                  ))}
                </div>
              </div>

              <div className="coverage-checker">
                <div className="checker-form">
                  <label style={{ fontWeight: 600, fontSize: '14px' }}>CARI WILAYAH ANDA</label>
                  <div className="checker-input-wrapper">
                    <input
                      type="text"
                      id="coverage-query"
                      className="checker-input"
                      placeholder="Masukkan nama Kota atau Kecamatan..."
                      value={coverageQuery}
                      onChange={(e) => setCoverageQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCheckCoverage()}
                    />
                  </div>
                  <button
                    id="btn-check-coverage"
                    className="btn btn-primary btn-checker"
                    onClick={handleCheckCoverage}
                  >
                    Cek Jaringan
                  </button>

                  {coverageResult.type && (
                    <div className={`checker-result ${coverageResult.type}`} style={{ display: 'block' }}>
                      <span dangerouslySetInnerHTML={{ __html: coverageResult.text }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="section" id="testimonials">
        <div className="container">
          <div className="section-title">
            <h2>Apa Kata Pelanggan Kami</h2>
            <p>Mereka yang telah beralih ke Bitfast dan merasakan kecepatan internet yang sesungguhnya tanpa drama koneksi putus-putus.</p>
          </div>

          <div className="testimonials-grid">
            {initialTestimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="testimonial-content">
                  "{t.content}"
                </p>
                <div className="testimonial-client">
                  <div className="client-avatar">
                    <div className="client-avatar-inner">
                      {t.avatar ? (
                        <img src={`/storage/${t.avatar}`} alt={t.name} />
                      ) : (
                        getInitials(t.name)
                      )}
                    </div>
                  </div>
                  <div className="client-info">
                    <h4>{t.name}</h4>
                    <p>{t.role_or_company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BLOG SECTION --- */}
      <section className="section" id="blog">
        <div className="container">
          <div className="section-title">
            <h2>Artikel & Edukasi Terkini</h2>
            <p>Dapatkan tips seputar teknologi, panduan mengoptimalkan Wi-Fi, serta info promo menarik dari Bitfast.</p>
          </div>

          <div className="blog-grid">
            {initialPosts.map((post) => (
              <div key={post.id} className="blog-card">
                <div className="blog-img-wrapper">
                  {post.cover_image ? (
                    <img src={`/uploads/${post.cover_image}`} alt={post.title} />
                  ) : (
                    <div className="blog-img-placeholder">BITFAST BLOG</div>
                  )}
                </div>
                <div className="blog-body">
                  <span className="blog-date">{formatDate(post.published_at)}</span>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>

                  <span
                    className="blog-read-more"
                    onClick={() => setActivePost(post)}
                  >
                    Baca Selengkapnya
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- REGISTRATION SECTION (FORM) --- */}
      <section className="section" id="register">
        <div className="container">
          <div className="register-box">
            <div className="register-grid">
              <div className="register-info">
                <h3>Daftar Langganan Baru</h3>
                <p>Mengisi formulir pendaftaran hanya membutuhkan waktu 2 menit. Setelah formulir terkirim, tim kami akan segera menghubungi Anda dalam 1x24 jam untuk konfirmasi dan penjadwalan survei.</p>

                <div className="register-steps">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-details">
                      <h4>Isi Formulir Pendaftaran</h4>
                      <p>Masukkan data diri lengkap dan alamat pemasangan secara detail.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-details">
                      <h4>Konfirmasi & Survei Lokasi</h4>
                      <p>Tim admin akan menelepon untuk validasi data dan menjadwalkan kunjungan teknisi.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-details">
                      <h4>Pemasangan & Aktivasi</h4>
                      <p>Teknisi menarik kabel fiber optik, setting router, dan internet Anda aktif hari itu juga.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="register-form-container">
                {/* Success View Overlay */}
                {showSuccessOverlay && (
                  <div className="form-success-overlay" style={{ display: 'flex' }}>
                    <div className="success-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022z" />
                      </svg>
                    </div>
                    <h3 style={{ marginBottom: '12px', fontSize: '24px' }}>Pendaftaran Berhasil!</h3>
                    <p id="success-overlay-msg" style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                      {successMessage}
                    </p>
                    <button className="btn btn-outline" onClick={() => setShowSuccessOverlay(false)}>Isi Ulang Form</button>
                  </div>
                )}

                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="form-name">NAMA LENGKAP</label>
                    <input
                      type="text"
                      id="form-name"
                      className="form-control"
                      placeholder="Nama sesuai KTP..."
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                    {formErrors.name && <span className="form-feedback" style={{ display: 'block' }}>{formErrors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="form-email">ALAMAT EMAIL</label>
                    <input
                      type="email"
                      id="form-email"
                      className="form-control"
                      placeholder="emailanda@gmail.com..."
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                    />
                    {formErrors.email && <span className="form-feedback" style={{ display: 'block' }}>{formErrors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="form-phone">NOMOR WHATSAPP / TELEPON</label>
                    <input
                      type="tel"
                      id="form-phone"
                      className="form-control"
                      placeholder="08xxxxxxxxxx..."
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                    {formErrors.phone && <span className="form-feedback" style={{ display: 'block' }}>{formErrors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="form-package">PILIHAN PAKET INTERNET</label>
                    <select
                      id="form-package"
                      className="form-control"
                      value={formPackageId}
                      onChange={(e) => setFormPackageId(e.target.value)}
                    >
                      <option value="">Pilih Paket Internet (Opsional)</option>
                      <optgroup label="Home Packages">
                        {initialPackages.filter(p => p.category === 'home').map(pkg => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} - ({pkg.speed} / Rp {formatPrice(pkg.price)})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Business Packages">
                        {initialPackages.filter(p => p.category === 'business').map(pkg => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} - ({pkg.speed} / Rp {formatPrice(pkg.price)})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    {formErrors.package_id && <span className="form-feedback" style={{ display: 'block' }}>{formErrors.package_id}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="form-address">ALAMAT PEMASANGAN LENGKAP</label>
                    <textarea
                      id="form-address"
                      className="form-control"
                      rows={4}
                      placeholder="Ketik nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota..."
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                    ></textarea>
                    {formErrors.address && <span className="form-feedback" style={{ display: 'block' }}>{formErrors.address}</span>}
                  </div>

                  <button type="submit" className="btn btn-primary btn-submit" disabled={isSubmitting}>
                    Kirim Pendaftaran
                    {isSubmitting && <span className="spinner" style={{ display: 'inline-block' }}></span>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-about">
            <a href="#" className="logo" onClick={(e) => handleNavClick(e, 'home')}>
              <img src="/logo.jpeg" alt="BITFAST" width="150" />
            </a>
            <p>BitFast menyediakan layanan internet cepat dan terjangkau dengan dukungan teknisi lokal yang siap membantu 24 jam.
              <br />Memberikan koneksi internet berkualitas dengan harga kompetitif.
              <br />Menjangkau daerah yang masih terbatas akses internetnya.
              <br />Menyediakan layanan pelanggan yang responsif dan handal.</p>
          </div>
          <div className="footer-links">
            <h4>Navigasi</h4>
            <ul>
              <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
              <li><a href="#packages" onClick={(e) => handleNavClick(e, 'packages')}>Paket Internet</a></li>
              <li><a href="#coverage" onClick={(e) => handleNavClick(e, 'coverage')}>Coverage Area</a></li>
              <li><a href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')}>Testimoni Customer</a></li>
              <li><a href="#blog" onClick={(e) => handleNavClick(e, 'blog')}>Blog & Edukasi</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Hubungi Kami</h4>
            <ul style={{ color: 'var(--text-muted)', fontSize: '14px', gap: '8px' }}>
              <li>Email: info@bitfast.id</li>
              <li>WhatsApp: 0822-9888-0909</li>
              <li>Sales Call: 0822-9888-0909</li>
              <li>Kantor Pusat: <br />Jalan Ring Road - Jalan Raya Bubulak Nomor A-4, Desa/Kelurahan Bubulak, Kec. Bogor Barat, Kota Bogor, Provinsi Jawa Barat, Kode Pos: 16115.</li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Link Terkait</h4>
            <ul style={{ color: 'var(--text-muted)', fontSize: '14px', gap: '8px' }}>
              {initialLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.content} target="_blank" rel="noopener noreferrer">{link.judul}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-social">
            <h4>Media Sosial</h4>

            <div className="social-links">
              {initialSosmed.map((sosmed, idx) => (
                <a key={idx} href={sosmed.content} aria-label={sosmed.judul}>
                  {sosmed.judul == 'instagram' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" stroke="currentColor">
                      <path d="M10.202,2.098c-1.49,.07-2.507,.308-3.396,.657-.92,.359-1.7,.84-2.477,1.619-.776,.779-1.254,1.56-1.61,2.481-.345,.891-.578,1.909-.644,3.4-.066,1.49-.08,1.97-.073,5.771s.024,4.278,.096,5.772c.071,1.489,.308,2.506,.657,3.396,.359,.92,.84,1.7,1.619,2.477,.779,.776,1.559,1.253,2.483,1.61,.89,.344,1.909,.579,3.399,.644,1.49,.065,1.97,.08,5.771,.073,3.801-.007,4.279-.024,5.773-.095s2.505-.309,3.395-.657c.92-.36,1.701-.84,2.477-1.62s1.254-1.561,1.609-2.483c.345-.89,.579-1.909,.644-3.398,.065-1.494,.081-1.971,.073-5.773s-.024-4.278-.095-5.771-.308-2.507-.657-3.397c-.36-.92-.84-1.7-1.619-2.477s-1.561-1.254-2.483-1.609c-.891-.345-1.909-.58-3.399-.644s-1.97-.081-5.772-.074-4.278,.024-5.771,.096m.164,25.309c-1.365-.059-2.106-.286-2.6-.476-.654-.252-1.12-.557-1.612-1.044s-.795-.955-1.05-1.608c-.192-.494-.423-1.234-.487-2.599-.069-1.475-.084-1.918-.092-5.656s.006-4.18,.071-5.656c.058-1.364,.286-2.106,.476-2.6,.252-.655,.556-1.12,1.044-1.612s.955-.795,1.608-1.05c.493-.193,1.234-.422,2.598-.487,1.476-.07,1.919-.084,5.656-.092,3.737-.008,4.181,.006,5.658,.071,1.364,.059,2.106,.285,2.599,.476,.654,.252,1.12,.555,1.612,1.044s.795,.954,1.051,1.609c.193,.492,.422,1.232,.486,2.597,.07,1.476,.086,1.919,.093,5.656,.007,3.737-.006,4.181-.071,5.656-.06,1.365-.286,2.106-.476,2.601-.252,.654-.556,1.12-1.045,1.612s-.955,.795-1.608,1.05c-.493,.192-1.234,.422-2.597,.487-1.476,.069-1.919,.084-5.657,.092s-4.18-.007-5.656-.071M21.779,8.517c.002,.928,.755,1.679,1.683,1.677s1.679-.755,1.677-1.683c-.002-.928-.755-1.679-1.683-1.677,0,0,0,0,0,0-.928,.002-1.678,.755-1.677,1.683m-12.967,7.496c.008,3.97,3.232,7.182,7.202,7.174s7.183-3.232,7.176-7.202c-.008-3.97-3.233-7.183-7.203-7.175s-7.182,3.233-7.174,7.203m2.522-.005c-.005-2.577,2.08-4.671,4.658-4.676,2.577-.005,4.671,2.08,4.676,4.658,.005,2.577-2.08,4.671-4.658,4.676-2.577,.005-4.671-2.079-4.676-4.656h0"></path>
                    </svg>
                  )}

                  {sosmed.judul == 'facebook' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" stroke="currentColor">
                      <path d="M16,2c-7.732,0-14,6.268-14,14,0,6.566,4.52,12.075,10.618,13.588v-9.31h-2.887v-4.278h2.887v-1.843c0-4.765,2.156-6.974,6.835-6.974,.887,0,2.417,.174,3.043,.348v3.878c-.33-.035-.904-.052-1.617-.052-2.296,0-3.183,.87-3.183,3.13v1.513h4.573l-.786,4.278h-3.787v9.619c6.932-.837,12.304-6.74,12.304-13.897,0-7.732-6.268-14-14-14Z"></path>
                    </svg>
                  )}

                  {sosmed.judul == 'tiktok' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" stroke="currentColor">
                      <path d="M24.562,7.613c-1.508-.983-2.597-2.557-2.936-4.391-.073-.396-.114-.804-.114-1.221h-4.814l-.008,19.292c-.081,2.16-1.859,3.894-4.039,3.894-.677,0-1.315-.169-1.877-.465-1.288-.678-2.169-2.028-2.169-3.582,0-2.231,1.815-4.047,4.046-4.047,.417,0,.816,.069,1.194,.187v-4.914c-.391-.053-.788-.087-1.194-.087-4.886,0-8.86,3.975-8.86,8.86,0,2.998,1.498,5.65,3.783,7.254,1.439,1.01,3.19,1.606,5.078,1.606,4.886,0,8.86-3.975,8.86-8.86V11.357c1.888,1.355,4.201,2.154,6.697,2.154v-4.814c-1.345,0-2.597-.4-3.647-1.085Z"></path>
                    </svg>
                  )}

                  {sosmed.judul == 'twitter' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" stroke="currentColor">
                      <path d="M18.42,14.009L27.891,3h-2.244l-8.224,9.559L10.855,3H3.28l9.932,14.455L3.28,29h2.244l8.684-10.095,6.936,10.095h7.576l-10.301-14.991h0Zm-3.074,3.573l-1.006-1.439L6.333,4.69h3.447l6.462,9.243,1.006,1.439,8.4,12.015h-3.447l-6.854-9.804h0Z"></path>
                    </svg>
                  )}

                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>&copy; {new Date().getFullYear()} Bitfast ISP (bitfast.id). All Rights Reserved.</p>
          <p>Built for speed and reliability.</p>
        </div>
      </footer>

      {/* --- BLOG READER OVERLAY MODAL --- */}
      {activePost && (
        <div className="modal-overlay open" onClick={() => setActivePost(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActivePost(null)} aria-label="Tutup">✕</button>
            <div className="modal-img-wrapper">
              {activePost.cover_image ? (
                <img src={`/uploads/${activePost.cover_image}`} alt={activePost.title} />
              ) : (
                <div className="blog-img-placeholder" style={{ opacity: 0.1, fontSize: '48px' }}>BITFAST</div>
              )}
            </div>
            <div className="modal-body">
              <span className="modal-date">{formatDate(activePost.published_at)}</span>
              <h2 className="modal-title">{activePost.title}</h2>
              <div className="modal-author">
                Ditulis oleh <strong>Admin</strong>
              </div>
              <div
                className="modal-content"
                dangerouslySetInnerHTML={{ __html: activePost.content }}
              />
            </div>
          </div>
        </div>
      )}
      <a
        href="https://wa.me/6282298880909"
        target="_blank"
        className="whatsapp-float"
        aria-label="Chat via WhatsApp"
      >
        {/* Icon WhatsApp */}

        {/* Tooltip teks yang muncul saat di-hover (Opsional) */}
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
          <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6	C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path><path fill="#fff" d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6	C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3	L5,43.8C5,43.8,4.9,43.8,4.9,43.8z"></path><path fill="#cfd8dc" d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3	L4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24	c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2	c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z"></path><path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8	l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path><path fill="#fff" fillRule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0	s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3	c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9	c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8	c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" clipRule="evenodd"></path>
        </svg>
      </a>
    </>
  );
}
