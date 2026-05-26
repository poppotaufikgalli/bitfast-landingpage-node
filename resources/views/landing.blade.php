<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>Bitfast ISP | Koneksi Internet Fiber Optik Tercepat & Stabil</title>
    <meta name="description" content="Bitfast.id menyediakan layanan internet broadband fiber optik unlimited tanpa batas kuota (FUP) untuk rumah dan bisnis. Nikmati internet super cepat sekarang!">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="{{ asset('css/landing.css') }}">
</head>
<body>

    <!-- --- HEADER / NAVIGATION --- -->
    <header class="header" id="header">
        <div class="container nav-container">
            <a href="#" class="logo">
                BITFAST<span class="logo-dot">.</span>
            </a>
            
            <ul class="nav-menu" id="nav-menu">
                <li><a href="#" class="nav-link active">Home</a></li>
                <li><a href="#packages" class="nav-link">Paket</a></li>
                <li><a href="#coverage" class="nav-link">Coverage</a></li>
                <li><a href="#testimonials" class="nav-link">Testimoni</a></li>
                <li><a href="#blog" class="nav-link">Blog</a></li>
                <li><a href="#register" class="btn btn-nav">Daftar Sekarang</a></li>
            </ul>

            <button class="menu-toggle" id="menu-toggle" aria-label="Toggle Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </header>

    <!-- --- HERO SECTION --- -->
    <section class="hero" id="home">
        <div class="container hero-grid">
            <div class="hero-content">
                <h1>
                    Koneksi Internet <br>
                    <span class="gradient-text">Super Cepat & Tanpa Batas</span>
                </h1>
                <p>
                    Nikmati kebebasan berinternet dengan jaringan 100% Fiber Optik murni dari Bitfast. Tanpa batasan kuota (FUP), latensi ultra rendah, dan kecepatan simetris untuk kebutuhan rumah serta bisnis Anda.
                </p>
                <div class="hero-btns">
                    <a href="#packages" class="btn btn-primary">Lihat Paket</a>
                    <a href="#register" class="btn btn-outline">Langganan Baru</a>
                </div>
                
                <div class="hero-stats">
                    <div class="stat-item">
                        <h3 id="stat-speed">1 Gbps</h3>
                        <p>Kec. Maksimal</p>
                    </div>
                    <div class="stat-item">
                        <h3>99.9%</h3>
                        <p>Jaminan Uptime</p>
                    </div>
                    <div class="stat-item">
                        <h3>100%</h3>
                        <p>Fiber Optik</p>
                    </div>
                </div>
            </div>

            <div class="hero-visual">
                <div class="gauge-container">
                    <div class="gauge-inner">
                        <span class="gauge-speed" id="gauge-speed-val">150</span>
                        <span class="gauge-unit">Mbps</span>
                        <div class="gauge-node"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- --- PACKAGES SECTION --- -->
    <section class="section" id="packages">
        <div class="container">
            <div class="section-title">
                <h2>Paket Internet Tersedia</h2>
                <p>Temukan paket internet terbaik yang dirancang khusus untuk kenyamanan berselancar keluarga Anda atau untuk mendongkrak performa bisnis Anda.</p>
            </div>

            <div class="packages-toggle">
                <button class="toggle-tab active" data-target="home-packages">Untuk Rumah (Home)</button>
                <button class="toggle-tab" data-target="business-packages">Untuk Bisnis (Business)</button>
            </div>

            <!-- Home Packages Group -->
            <div class="packages-grid package-group-view" id="home-packages">
                @foreach($packages->where('category', 'home') as $package)
                    <div class="package-card {{ $package->is_popular ? 'popular' : '' }}">
                        @if($package->is_popular)
                            <div class="package-popular-badge">Populer</div>
                        @endif
                        <span class="package-category">HOME BROADBAND</span>
                        <h3 class="package-name">{{ $package->name }}</h3>
                        
                        <div class="package-price-box">
                            <div class="package-price">
                                Rp {{ number_format($package->price, 0, ',', '.') }}<span>/bulan</span>
                            </div>
                            <div class="package-speed">Up to {{ $package->speed }}</div>
                        </div>

                        <ul class="package-features">
                            @if(is_array($package->features))
                                @foreach($package->features as $feature)
                                    <li class="package-feature-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {{ $feature }}
                                    </li>
                                @endforeach
                            @endif
                        </ul>

                        <button class="btn {{ $package->is_popular ? 'btn-primary' : 'btn-outline' }} btn-package" data-id="{{ $package->id }}" data-name="{{ $package->name }}">
                            Pilih Paket
                        </button>
                    </div>
                @endforeach
            </div>

            <!-- Business Packages Group (Hidden initially by CSS/JS) -->
            <div class="packages-grid package-group-view" id="business-packages" style="display: none;">
                @foreach($packages->where('category', 'business') as $package)
                    <div class="package-card {{ $package->is_popular ? 'popular' : '' }}">
                        @if($package->is_popular)
                            <div class="package-popular-badge">Populer</div>
                        @endif
                        <span class="package-category">BUSINESS DEDICATED</span>
                        <h3 class="package-name">{{ $package->name }}</h3>
                        
                        <div class="package-price-box">
                            <div class="package-price">
                                Rp {{ number_format($package->price, 0, ',', '.') }}<span>/bulan</span>
                            </div>
                            <div class="package-speed">{{ $package->speed }} Simetris</div>
                        </div>

                        <ul class="package-features">
                            @if(is_array($package->features))
                                @foreach($package->features as $feature)
                                    <li class="package-feature-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {{ $feature }}
                                    </li>
                                @endforeach
                            @endif
                        </ul>

                        <button class="btn {{ $package->is_popular ? 'btn-primary' : 'btn-outline' }} btn-package" data-id="{{ $package->id }}" data-name="{{ $package->name }}">
                            Pilih Paket
                        </button>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- --- COVERAGE SECTION --- -->
    <section class="section" id="coverage">
        <div class="container">
            <div class="coverage-box">
                <div class="coverage-grid">
                    <div class="coverage-content">
                        <h3>Cek Coverage Area Anda</h3>
                        <p>Jaringan serat optik Bitfast terus berekspansi dengan cepat ke berbagai kota dan kecamatan. Masukkan wilayah tinggal Anda untuk memeriksa apakah layanan kami sudah dapat dipasang.</p>
                        
                        <div class="coverage-list">
                            <div class="coverage-city"><span></span>Jakarta</div>
                            <div class="coverage-city"><span></span>Tangerang</div>
                            <div class="coverage-city"><span></span>Bekasi</div>
                            <div class="coverage-city"><span></span>Depok</div>
                            <div class="coverage-city"><span></span>Bogor</div>
                            <div class="coverage-city"><span></span>Bandung</div>
                            <div class="coverage-city"><span></span>Surabaya</div>
                            <div class="coverage-city"><span></span>Semarang</div>
                        </div>
                    </div>

                    <div class="coverage-checker">
                        <div class="checker-form">
                            <label style="font-weight:600; font-size:14px; color:var(--text-muted);">CARI WILAYAH ANDA</label>
                            <div class="checker-input-wrapper">
                                <input type="text" id="coverage-query" class="checker-input" placeholder="Masukkan nama Kota atau Kecamatan...">
                            </div>
                            <button id="btn-check-coverage" class="btn btn-primary btn-checker">Cek Jaringan</button>
                            
                            <div class="checker-result" id="checker-result"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- --- TESTIMONIALS SECTION --- -->
    <section class="section" id="testimonials">
        <div class="container">
            <div class="section-title">
                <h2>Apa Kata Pelanggan Kami</h2>
                <p>Mereka yang telah beralih ke Bitfast dan merasakan kecepatan internet yang sesungguhnya tanpa drama koneksi putus-putus.</p>
            </div>

            <div class="testimonials-grid">
                @foreach($testimonials as $testimonial)
                    <div class="testimonial-card">
                        <div class="testimonial-stars">
                            @for($i = 0; $i < $testimonial->rating; $i++)
                                ★
                            @endfor
                        </div>
                        <p class="testimonial-content">
                            "{{ $testimonial->content }}"
                        </p>
                        <div class="testimonial-client">
                            <div class="client-avatar">
                                <div class="client-avatar-inner">
                                    @if($testimonial->avatar)
                                        <img src="{{ asset('storage/' . $testimonial->avatar) }}" alt="{{ $testimonial->name }}">
                                    @else
                                        <!-- Generates initials like BS for Budi Santoso -->
                                        @php
                                            $words = explode(' ', $testimonial->name);
                                            $initials = '';
                                            foreach($words as $w) {
                                                $initials .= $w[0] ?? '';
                                            }
                                            echo strtoupper(substr($initials, 0, 2));
                                        @endphp
                                    @endif
                                </div>
                            </div>
                            <div class="client-info">
                                <h4>{{ $testimonial->name }}</h4>
                                <p>{{ $testimonial->role_or_company }}</p>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- --- BLOG SECTION --- -->
    <section class="section" id="blog">
        <div class="container">
            <div class="section-title">
                <h2>Artikel & Edukasi Terkini</h2>
                <p>Dapatkan tips seputar teknologi, panduan mengoptimalkan Wi-Fi, serta info promo menarik dari Bitfast.</p>
            </div>

            <div class="blog-grid">
                @foreach($posts as $post)
                    <div class="blog-card">
                        <div class="blog-img-wrapper">
                            @if($post->cover_image)
                                <img src="{{ asset('storage/' . $post->cover_image) }}" alt="{{ $post->title }}">
                            @else
                                <div class="blog-img-placeholder">BITFAST BLOG</div>
                            @endif
                        </div>
                        <div class="blog-body">
                            <span class="blog-date">{{ $post->published_at ? $post->published_at->format('d M Y') : '' }}</span>
                            <h3 class="blog-title">{{ $post->title }}</h3>
                            <p class="blog-excerpt">{{ $post->excerpt }}</p>
                            
                            <!-- Save post details inside HTML data attributes to inject into modal without ajax -->
                            <span class="blog-read-more" 
                                  data-title="{{ $post->title }}"
                                  data-date="{{ $post->published_at ? $post->published_at->format('d F Y') : '' }}"
                                  data-author="{{ $post->user->name ?? 'Admin' }}"
                                  data-image="{{ $post->cover_image ? asset('storage/' . $post->cover_image) : '' }}"
                                  data-content="{{ $post->content }}">
                                Baca Selengkapnya 
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                </svg>
                            </span>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- --- REGISTRATION SECTION (FORM) --- -->
    <section class="section" id="register">
        <div class="container">
            <div class="register-box">
                <div class="register-grid">
                    <div class="register-info">
                        <h3>Daftar Langganan Baru</h3>
                        <p>Mengisi formulir pendaftaran hanya membutuhkan waktu 2 menit. Setelah formulir terkirim, tim kami akan segera menghubungi Anda dalam 1x24 jam untuk konfirmasi dan penjadwalan survei.</p>
                        
                        <div class="register-steps">
                            <div class="step-item">
                                <div class="step-number">1</div>
                                <div class="step-details">
                                    <h4>Isi Formulir Pendaftaran</h4>
                                    <p>Masukkan data diri lengkap dan alamat pemasangan secara detail.</p>
                                </div>
                            </div>
                            <div class="step-item">
                                <div class="step-number">2</div>
                                <div class="step-details">
                                    <h4>Konfirmasi & Survei Lokasi</h4>
                                    <p>Tim admin akan menelepon untuk validasi data dan menjadwalkan kunjungan teknisi.</p>
                                </div>
                            </div>
                            <div class="step-item">
                                <div class="step-number">3</div>
                                <div class="step-details">
                                    <h4>Pemasangan & Aktivasi</h4>
                                    <p>Teknisi menarik kabel fiber optik, setting router, dan internet Anda aktif hari itu juga.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="register-form-container">
                        <!-- Success View Overlay -->
                        <div class="form-success-overlay" id="form-success-overlay">
                            <div class="success-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022z"/>
                                </svg>
                            </div>
                            <h3 style="margin-bottom: 12px; font-size:24px;">Pendaftaran Berhasil!</h3>
                            <p id="success-overlay-msg" style="color:var(--text-muted); font-size:14px; margin-bottom: 24px;"></p>
                            <button class="btn btn-outline" id="btn-success-reset">Isi Ulang Form</button>
                        </div>

                        <form id="lead-form">
                            <div class="form-group">
                                <label for="form-name">NAMA LENGKAP</label>
                                <input type="text" id="form-name" name="name" class="form-control" placeholder="Nama sesuai KTP...">
                                <span class="form-feedback" id="error-name"></span>
                            </div>

                            <div class="form-group">
                                <label for="form-email">ALAMAT EMAIL</label>
                                <input type="email" id="form-email" name="email" class="form-control" placeholder="emailanda@gmail.com...">
                                <span class="form-feedback" id="error-email"></span>
                            </div>

                            <div class="form-group">
                                <label for="form-phone">NOMOR WHATSAPP / TELEPON</label>
                                <input type="tel" id="form-phone" name="phone" class="form-control" placeholder="08xxxxxxxxxx...">
                                <span class="form-feedback" id="error-phone"></span>
                            </div>

                            <div class="form-group">
                                <label for="form-package">PILIHAN PAKET INTERNET</label>
                                <select id="form-package" name="package_id" class="form-control">
                                    <option value="">Pilih Paket Internet (Opsional)</option>
                                    <optgroup label="Home Packages">
                                        @foreach($packages->where('category', 'home') as $package)
                                            <option value="{{ $package->id }}">{{ $package->name }} - ({{ $package->speed }} / Rp {{ number_format($package->price, 0, ',', '.') }})</option>
                                        @endforeach
                                    </optgroup>
                                    <optgroup label="Business Packages">
                                        @foreach($packages->where('category', 'business') as $package)
                                            <option value="{{ $package->id }}">{{ $package->name }} - ({{ $package->speed }} / Rp {{ number_format($package->price, 0, ',', '.') }})</option>
                                        @endforeach
                                    </optgroup>
                                </select>
                                <span class="form-feedback" id="error-package_id"></span>
                            </div>

                            <div class="form-group">
                                <label for="form-address">ALAMAT PEMASANGAN LENGKAP</label>
                                <textarea id="form-address" name="address" class="form-control" rows="4" placeholder="Ketik nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota..."></textarea>
                                <span class="form-feedback" id="error-address"></span>
                            </div>

                            <button type="submit" class="btn btn-primary btn-submit" id="btn-form-submit">
                                Kirim Pendaftaran <span class="spinner" id="form-spinner"></span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- --- FOOTER --- -->
    <footer class="footer">
        <div class="container footer-grid">
            <div class="footer-about">
                <a href="#" class="logo">BITFAST<span class="logo-dot">.</span></a>
                <p>Penyedia layanan internet fiber optik murni ultra cepat dan tanpa batas FUP di Indonesia. Koneksi cepat, cerdas, dan andal.</p>
            </div>
            <div class="footer-links">
                <h4>Navigasi</h4>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#packages">Paket Internet</a></li>
                    <li><a href="#coverage">Coverage Area</a></li>
                    <li><a href="#testimonials">Testimoni Customer</a></li>
                    <li><a href="#blog">Blog & Edukasi</a></li>
                </ul>
            </div>
            <div class="footer-links">
                <h4>Hubungi Kami</h4>
                <ul style="color:var(--text-muted); font-size:14px; gap:8px;">
                    <li>Email: support@bitfast.id</li>
                    <li>WhatsApp: +62 811-2222-3333</li>
                    <li>Sales Call: (021) 5050-6060</li>
                    <li>Kantor Pusat: Gedung Bitfast Tower Lt. 12, Jakarta Selatan, DKI Jakarta.</li>
                </ul>
            </div>
        </div>
        <div class="container footer-bottom">
            <p>&copy; {{ date('Y') }} Bitfast ISP (bitfast.id). All Rights Reserved.</p>
            <p>Built for speed and reliability.</p>
        </div>
    </footer>

    <!-- --- BLOG READER OVERLAY MODAL --- -->
    <div class="modal-overlay" id="blog-modal">
        <div class="modal-container">
            <button class="modal-close" id="modal-close" aria-label="Tutup">✕</button>
            <div class="modal-img-wrapper" id="modal-img-wrapper">
                <img id="modal-img" src="" alt="Blog Cover">
            </div>
            <div class="modal-body">
                <span class="modal-date" id="modal-date"></span>
                <h2 class="modal-title" id="modal-title"></h2>
                <div class="modal-author" id="modal-author"></div>
                <div class="modal-content" id="modal-content"></div>
            </div>
        </div>
    </div>

    <!-- --- CORE INTERACTIVE JAVASCRIPT --- -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            
            // --- HEADER SCROLL ACTION ---
            const header = document.getElementById('header');
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

            // --- MOBILE MENU TOGGLE ---
            const menuToggle = document.getElementById('menu-toggle');
            const navMenu = document.getElementById('nav-menu');
            
            menuToggle.addEventListener('click', function() {
                menuToggle.classList.toggle('open');
                navMenu.classList.toggle('open');
            });

            // Close mobile menu on nav link clicks
            const navLinks = document.querySelectorAll('.nav-link, .btn-nav');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    menuToggle.classList.remove('open');
                    navMenu.classList.remove('open');
                    
                    // Set active state
                    if(link.classList.contains('nav-link')) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                });
            });

            // --- HERO GAUGE INTERACTIVE ANIME ---
            const gaugeSpeedVal = document.getElementById('gauge-speed-val');
            const speeds = [30, 50, 100, 150, 300, 500, 750, 1000];
            let speedIdx = 0;
            setInterval(() => {
                speedIdx = (speedIdx + 1) % speeds.length;
                let targetSpeed = speeds[speedIdx];
                let currentVal = parseInt(gaugeSpeedVal.innerText);
                let step = currentVal < targetSpeed ? 5 : -5;
                
                let counter = setInterval(() => {
                    currentVal += step;
                    if ((step > 0 && currentVal >= targetSpeed) || (step < 0 && currentVal <= targetSpeed)) {
                        currentVal = targetSpeed;
                        clearInterval(counter);
                    }
                    gaugeSpeedVal.innerText = currentVal;
                }, 20);
            }, 3500);

            // --- PACKAGES TABS TOGGLE ---
            const toggleTabs = document.querySelectorAll('.toggle-tab');
            const packageGroups = document.querySelectorAll('.package-group-view');

            toggleTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    toggleTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');

                    const target = tab.getAttribute('data-target');
                    packageGroups.forEach(group => {
                        if (group.id === target) {
                            group.style.display = 'grid';
                        } else {
                            group.style.display = 'none';
                        }
                    });
                });
            });

            // --- CHOOSE PACKAGE ACTION (SCROLL & SELECT) ---
            const choosePackageBtns = document.querySelectorAll('.btn-package');
            const packageSelect = document.getElementById('form-package');

            choosePackageBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const packageId = btn.getAttribute('data-id');
                    
                    // Select option in dropdown
                    packageSelect.value = packageId;
                    
                    // Scroll to registration
                    document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
                });
            });

            // --- INTERACTIVE COVERAGE CHECKER ---
            const checkBtn = document.getElementById('btn-check-coverage');
            const queryInput = document.getElementById('coverage-query');
            const resultDiv = document.getElementById('checker-result');
            
            // Seed list of covered cities/kecamatan in lowercase for substring searches
            const coveredAreas = [
                'jakarta', 'jakarta selatan', 'jakarta timur', 'jakarta barat', 'jakarta utara', 'jakarta pusat',
                'tangerang', 'tangerang selatan', 'bsd', 'ciputat', 'pamulang', 'karawaci', 'ciledug',
                'bekasi', 'bekasi timur', 'bekasi barat', 'cikarang', 'tambun',
                'depok', 'margonda', 'cinere', 'sawangan', 'cibinong',
                'bogor', 'sentul', 'bogor timur', 'bogor utara',
                'bandung', 'dago', 'buah batu', 'lembang', 'cimahi',
                'surabaya', 'rungkut', 'dharmahusada', 'wonokromo',
                'semarang', 'simpang lima', 'tembalang'
            ];

            checkBtn.addEventListener('click', function() {
                const query = queryInput.value.trim().toLowerCase();
                
                if (query.length < 3) {
                    resultDiv.innerHTML = "Silakan masukkan minimal 3 karakter untuk pengecekan.";
                    resultDiv.className = "checker-result error";
                    resultDiv.style.display = "block";
                    return;
                }

                // Check if any covered keyword is contained in the user input or vice versa
                const isCovered = coveredAreas.some(area => area.includes(query) || query.includes(area));
                
                if (isCovered) {
                    resultDiv.innerHTML = `<strong>Selamat!</strong> Wilayah "${queryInput.value}" sudah sepenuhnya tercover jaringan Fiber Optik Bitfast. Silakan isi form di bawah untuk melakukan pendaftaran.`;
                    resultDiv.className = "checker-result success";
                } else {
                    resultDiv.innerHTML = `<strong>Maaf!</strong> Wilayah "${queryInput.value}" belum tercover langsung jaringan Fiber Optik utama. Anda tetap dapat mengisi form di bawah agar tim planning kami dapat mensurvei potensi penarikan kabel ke wilayah Anda.`;
                    resultDiv.className = "checker-result error";
                }
                
                resultDiv.style.display = "block";
            });

            // --- BLOG ARTICLE READ MODAL ---
            const readBtns = document.querySelectorAll('.blog-read-more');
            const blogModal = document.getElementById('blog-modal');
            const modalClose = document.getElementById('modal-close');
            
            const modalImg = document.getElementById('modal-img');
            const modalImgWrapper = document.getElementById('modal-img-wrapper');
            const modalDate = document.getElementById('modal-date');
            const modalTitle = document.getElementById('modal-title');
            const modalAuthor = document.getElementById('modal-author');
            const modalContent = document.getElementById('modal-content');

            readBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const title = btn.getAttribute('data-title');
                    const date = btn.getAttribute('data-date');
                    const author = btn.getAttribute('data-author');
                    const image = btn.getAttribute('data-image');
                    const content = btn.getAttribute('data-content');

                    modalTitle.innerText = title;
                    modalDate.innerText = date;
                    modalAuthor.innerHTML = `Ditulis oleh <strong>${author}</strong>`;
                    modalContent.innerHTML = content;

                    if (image) {
                        modalImg.src = image;
                        modalImgWrapper.style.display = "flex";
                    } else {
                        modalImgWrapper.style.display = "none";
                    }

                    blogModal.classList.add('open');
                    document.body.style.overflow = "hidden"; // disable scroll
                });
            });

            // Close modal functions
            function closeModal() {
                blogModal.classList.remove('open');
                document.body.style.overflow = "auto"; // enable scroll
            }

            modalClose.addEventListener('click', closeModal);
            blogModal.addEventListener('click', function(e) {
                if (e.target === blogModal) {
                    closeModal();
                }
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === "Escape" && blogModal.classList.contains('open')) {
                    closeModal();
                }
            });

            // --- AJAX REGISTRATION LEAD SUBMISSION ---
            const leadForm = document.getElementById('lead-form');
            const submitBtn = document.getElementById('btn-form-submit');
            const spinner = document.getElementById('form-spinner');
            const successOverlay = document.getElementById('form-success-overlay');
            const successMsg = document.getElementById('success-overlay-msg');
            const resetBtn = document.getElementById('btn-success-reset');

            leadForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Reset errors
                document.querySelectorAll('.form-feedback').forEach(el => {
                    el.style.display = 'none';
                    el.innerText = '';
                });

                // Disable submit button & show spinner
                submitBtn.disabled = true;
                spinner.style.display = 'inline-block';

                const formData = new FormData(leadForm);
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

                fetch('{{ route("register.lead") }}', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json'
                    },
                    body: formData
                })
                .then(response => response.json().then(data => ({ status: response.status, body: data })))
                .then(res => {
                    if (res.status === 200 && res.body.success) {
                        // Success!
                        successMsg.innerText = res.body.message;
                        successOverlay.style.display = 'flex';
                        leadForm.reset();
                    } else if (res.status === 422) {
                        // Validation errors
                        const errors = res.body.errors;
                        for (const key in errors) {
                            const feedbackEl = document.getElementById(`error-${key}`);
                            if (feedbackEl) {
                                feedbackEl.innerText = errors[key][0];
                                feedbackEl.style.display = 'block';
                            }
                        }
                    } else {
                        alert('Terjadi kesalahan sistem. Silakan hubungi kami melalui WhatsApp.');
                    }
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    alert('Koneksi internet bermasalah. Silakan coba lagi.');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    spinner.style.display = 'none';
                });
            });

            // Reset success overlay
            resetBtn.addEventListener('click', function() {
                successOverlay.style.display = 'none';
            });
        });
    </script>
</body>
</html>
