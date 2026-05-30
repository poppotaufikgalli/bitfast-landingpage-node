import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

let dbPool: mysql.Pool | null = null;

export async function getPool(): Promise<mysql.Pool> {
  if (!dbPool) {
    const dbName = process.env.DB_DATABASE || 'db_bitfast_landingpage';
    try {
      // Connect without db to ensure db exists
      const connection = await mysql.createConnection(poolConfig);
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
      await connection.end();

      dbPool = mysql.createPool({
        ...poolConfig,
        database: dbName,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      // Initialize database schemas and seed default data
      await initDatabase(dbPool);
    } catch (error) {
      console.error('MySQL database connection failed:', error);
      throw error;
    }
  }
  return dbPool;
}

export async function query(sql: string, params?: any[]) {
  const pool = await getPool();
  const [results] = await pool.execute(sql, params);
  return results;
}

async function initDatabase(pool: mysql.Pool) {
  // 1. Create tables
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS packages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      speed VARCHAR(255) NOT NULL,
      price DECIMAL(12, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      features JSON NULL,
      is_popular BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role_or_company VARCHAR(255) NULL,
      rating TINYINT UNSIGNED DEFAULT 5,
      content TEXT NOT NULL,
      avatar VARCHAR(255) NULL,
      is_featured BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      excerpt TEXT NULL,
      content LONGTEXT NOT NULL,
      cover_image VARCHAR(255) NULL,
      is_published BOOLEAN DEFAULT FALSE,
      published_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      package_id INT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      status VARCHAR(255) DEFAULT 'pending',
      notes TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // 2. Seed data if tables are empty
  
  // Seed User
  const [users] = await pool.query('SELECT * FROM users LIMIT 1') as any[];
  let adminId = 1;
  if (users.length === 0) {
    const passwordHash = bcrypt.hashSync('password', 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      ['Admin Bitfast', 'admin@bitfast.id', passwordHash]
    ) as any;
    adminId = result.insertId;
  } else {
    adminId = users[0].id;
  }

  // Seed Packages
  const [pkgs] = await pool.query('SELECT * FROM packages LIMIT 1') as any[];
  if (pkgs.length === 0) {
    const defaultPackages = [
      {
        name: 'Bitfast Home Lite',
        slug: 'bitfast-home-lite',
        speed: '30 Mbps',
        price: 249000,
        category: 'home',
        features: JSON.stringify([
          'Unlimited Tanpa Kuota / FUP',
          'Kecepatan download/upload stabil',
          'Cocok untuk 1 - 4 perangkat',
          'Free Router & ONT Dual-Band',
          'Layanan bantuan teknis 24/7'
        ]),
        is_popular: false,
        is_active: true,
      },
      {
        name: 'Bitfast Home Gamer',
        slug: 'bitfast-home-gamer',
        speed: '100 Mbps',
        price: 449000,
        category: 'home',
        features: JSON.stringify([
          'Kecepatan super cepat 100 Mbps',
          'Unlimited Tanpa Kuota / FUP',
          'Optimasi Ping khusus gaming & streaming',
          'Cocok untuk 5 - 10+ perangkat bersamaan',
          'Free ONT & Router Premium',
          'Dukungan prioritas dari teknisi'
        ]),
        is_popular: true,
        is_active: true,
      },
      {
        name: 'Bitfast Business Pro',
        slug: 'bitfast-business-pro',
        speed: '150 Mbps',
        price: 899000,
        category: 'business',
        features: JSON.stringify([
          'Symmetric Speed 1:1 (Upload/Download)',
          'SLA 99.9% Jaminan Uptime Jaringan',
          'Dapatkan IP Public Dinamis/Statis',
          'Bandwidth Dedicated tanpa bagi-bagi',
          'Prioritas Penanganan Gangguan 4 Jam',
          'Termasuk Router khusus bisnis'
        ]),
        is_popular: false,
        is_active: true,
      },
      {
        name: 'Bitfast Enterprise Max',
        slug: 'bitfast-enterprise-max',
        speed: '500 Mbps',
        price: 2499000,
        category: 'business',
        features: JSON.stringify([
          'Symmetric Speed 1:1 Hingga 500 Mbps',
          'SLA 99.95% Jaminan Uptime Jaringan',
          'IP Public Block /29 (4 IP Usable)',
          'Dedicated Fiber Optik langsung ke kantor',
          'Dukungan Account Manager khusus',
          'Waktu Respon Gangguan Maksimal 2 Jam'
        ]),
        is_popular: true,
        is_active: true,
      }
    ];

    for (const pkg of defaultPackages) {
      await pool.query(
        'INSERT INTO packages (name, slug, speed, price, category, features, is_popular, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [pkg.name, pkg.slug, pkg.speed, pkg.price, pkg.category, pkg.features, pkg.is_popular, pkg.is_active]
      );
    }
  }

  // Seed Testimonials
  const [testis] = await pool.query('SELECT * FROM testimonials LIMIT 1') as any[];
  if (testis.length === 0) {
    const defaultTestimonials = [
      {
        name: 'Budi Santoso',
        role_or_company: 'Freelance Web Developer',
        rating: 5,
        content: 'Semenjak pakai Bitfast Home, kerjaan remote saya lancar tanpa kendala. Upload file gigabyte cuma hitungan menit, dan koneksinya sangat stabil dibanding ISP tetangga.',
        avatar: null,
        is_featured: true,
        is_active: true,
      },
      {
        name: 'Siti Rahma',
        role_or_company: 'Ibu Rumah Tangga (4 Anak)',
        rating: 4,
        content: 'Anak-anak sekolah online dan streaming kartun barengan tetap lancar jaya. Pelayanan pasang barunya juga cepat, besoknya langsung dikirim teknisi untuk instalasi.',
        avatar: null,
        is_featured: true,
        is_active: true,
      },
      {
        name: 'Rian Hidayat',
        role_or_company: 'Pemilik Kopi Bahagia',
        rating: 5,
        content: 'Kami menyediakan Free Wi-Fi untuk pelanggan kafe kami. Dengan Bitfast Business Pro, 50+ pengunjung kafe bisa browsing dan main game barengan tanpa lemot. Bisnis makin rame!',
        avatar: null,
        is_featured: true,
        is_active: true,
      }
    ];

    for (const t of defaultTestimonials) {
      await pool.query(
        'INSERT INTO testimonials (name, role_or_company, rating, content, avatar, is_featured, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [t.name, t.role_or_company, t.rating, t.content, t.avatar, t.is_featured, t.is_active]
      );
    }
  }

  // Seed Posts
  const [posts] = await pool.query('SELECT * FROM posts LIMIT 1') as any[];
  if (posts.length === 0) {
    const defaultPosts = [
      {
        user_id: adminId,
        title: 'Mengenal Teknologi Fiber Optik dan Mengapa Lebih Cepat',
        slug: 'mengenal-teknologi-fiber-optik-dan-mengapa-lebih-cepat',
        excerpt: 'Ingin tahu rahasia di balik internet super cepat? Simak bagaimana kabel kaca fiber optik menghantarkan data secepat cahaya ke rumah Anda.',
        content: '<p>Apakah Anda sering bertanya-tanya mengapa koneksi internet fiber optik jauh lebih cepat dan stabil dibandingkan dengan koneksi kabel tembaga biasa? Jawabannya terletak pada fisika transmisi data.</p><p>Fiber optik menggunakan cahaya untuk mengirimkan informasi, yang bergerak melalui tabung kaca murni yang sangat halus. Kecepatan cahaya ini memungkinkan transfer data yang hampir seketika, dengan redaman sinyal yang sangat minim bahkan untuk jarak yang sangat jauh.</p><p>Bitfast menggunakan 100% jaringan fiber optik murni (FTTH - Fiber To The Home) untuk memastikan bandwidth penuh sampai ke dalam rumah Anda. Keunggulannya meliputi:</p><ul><li>Koneksi simetris untuk download dan upload yang seimbang.</li><li>Kebal terhadap gangguan elektromagnetik (petir, hujan, dsb).</li><li>Latensi (ping) jauh lebih rendah dan responsif.</li></ul>',
        cover_image: null,
        is_published: true,
        published_at: new Date(),
      },
      {
        user_id: adminId,
        title: 'Tips Memaksimalkan Wi-Fi Router di Rumah Anda',
        slug: 'tips-memaksimalkan-wifi-router-di-rumah-anda',
        excerpt: 'Posisi router menentukan prestasi! Berikut adalah 5 tips praktis meletakkan dan mengatur Wi-Fi router agar sinyal kuat ke seluruh sudut ruangan.',
        content: '<p>Pernahkah Anda merasa sinyal Wi-Fi di kamar tidur lebih lemah daripada di ruang tamu? Hal ini sangat dipengaruhi oleh posisi penempatan router Anda. Berikut tips dari tim teknis Bitfast:</p><ol><li><strong>Letakkan Router di Area Terbuka dan Tengah Rumah</strong>: Jangan menyembunyikan router di dalam lemari kayu, laci, atau di balik TV besar karena akan meredam sinyal secara signifikan.</li><li><strong>Hindari Penghalang Logam dan Dinding Tebal</strong>: Bahan padat seperti beton dan logam dapat menyerap sinyal Wi-Fi dengan cepat.</li><li><strong>Jauhkan dari Perangkat Elektronik Lain</strong>: Microwave, telepon nirkabel rumah, dan monitor bayi memancarkan gelombang radio yang dapat menginterferensi frekuensi sinyal Wi-Fi Anda.</li><li><strong>Atur Posisi Antena</strong>: Jika router memiliki beberapa antena, atur posisinya (satu tegak lurus vertikal dan satu mendatar horizontal) untuk menyebarkan gelombang radio ke berbagai arah secara merata.</li><li><strong>Lakukan Reboot Berkala</strong>: Me-restart router seminggu sekali membantu menyegarkan memori router Anda dan membersihkan cache sisa koneksi perangkat yang menumpuk.</li></ol>',
        cover_image: null,
        is_published: true,
        published_at: new Date(),
      },
      {
        user_id: adminId,
        title: 'Mengapa Ping Rendah Sangat Penting untuk Gaming Online',
        slug: 'mengapa-ping-rendah-sangat-penting-untuk-gaming-online',
        excerpt: 'Ping tinggi bikin lag saat push rank? Pelajari apa itu ping, latensi, dan bagaimana Bitfast mengoptimalkan routing khusus untuk para gamer.',
        content: '<p>Bagi seorang gamer online, bandwidth besar (seperti 100 Mbps) tidak akan berarti banyak jika latensi atau ping Anda sangat tinggi. Ping adalah waktu yang dibutuhkan untuk mengirimkan satu paket data dari komputer Anda ke server game dan kembali lagi, diukur dalam milidetik (ms).</p><p>Latensi yang rendah memastikan respon karakter Anda di dalam game terasa instan dan bebas delay. Jika ping Anda tinggi, Anda akan mengalami "lag" atau "teleportasi" di mana karakter Anda tiba-tiba berpindah posisi secara mendadak.</p><p>Bitfast mengimplementasikan custom routing policy dan peering langsung ke various server game populer (seperti Mobile Legends, Valorant, PUBG, dll) untuk memastikan ping serendah mungkin bagi pelanggan kami. Dengan koneksi stabil 100% fiber optik Bitfast, Anda bisa bermain dengan tenang tanpa takut putus koneksi di momen-momen krusial permainan.</p>',
        cover_image: null,
        is_published: true,
        published_at: new Date(),
      }
    ];

    for (const post of defaultPosts) {
      await pool.query(
        'INSERT INTO posts (user_id, title, slug, excerpt, content, cover_image, is_published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [post.user_id, post.title, post.slug, post.excerpt, post.content, post.cover_image, post.is_published, post.published_at]
      );
    }
  }
}
