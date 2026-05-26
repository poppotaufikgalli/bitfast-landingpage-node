<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\Post;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Admin User
        $admin = User::create([
            'name' => 'Admin Bitfast',
            'email' => 'admin@bitfast.id',
            'password' => Hash::make('password'),
        ]);

        // 2. Seed Packages
        Package::create([
            'name' => 'Bitfast Home Lite',
            'slug' => 'bitfast-home-lite',
            'speed' => '30 Mbps',
            'price' => 249000,
            'category' => 'home',
            'features' => [
                'Unlimited Tanpa Kuota / FUP',
                'Kecepatan download/upload stabil',
                'Cocok untuk 1 - 4 perangkat',
                'Free Router & ONT Dual-Band',
                'Layanan bantuan teknis 24/7'
            ],
            'is_popular' => false,
            'is_active' => true,
        ]);

        Package::create([
            'name' => 'Bitfast Home Gamer',
            'slug' => 'bitfast-home-gamer',
            'speed' => '100 Mbps',
            'price' => 449000,
            'category' => 'home',
            'features' => [
                'Kecepatan super cepat 100 Mbps',
                'Unlimited Tanpa Kuota / FUP',
                'Optimasi Ping khusus gaming & streaming',
                'Cocok untuk 5 - 10+ perangkat bersamaan',
                'Free ONT & Router Premium',
                'Dukungan prioritas dari teknisi'
            ],
            'is_popular' => true,
            'is_active' => true,
        ]);

        Package::create([
            'name' => 'Bitfast Business Pro',
            'slug' => 'bitfast-business-pro',
            'speed' => '150 Mbps',
            'price' => 899000,
            'category' => 'business',
            'features' => [
                'Symmetric Speed 1:1 (Upload/Download)',
                'SLA 99.9% Jaminan Uptime Jaringan',
                'Dapatkan IP Public Dinamis/Statis',
                'Bandwidth Dedicated tanpa bagi-bagi',
                'Prioritas Penanganan Gangguan 4 Jam',
                'Termasuk Router khusus bisnis'
            ],
            'is_popular' => false,
            'is_active' => true,
        ]);

        Package::create([
            'name' => 'Bitfast Enterprise Max',
            'slug' => 'bitfast-enterprise-max',
            'speed' => '500 Mbps',
            'price' => 2499000,
            'category' => 'business',
            'features' => [
                'Symmetric Speed 1:1 Hingga 500 Mbps',
                'SLA 99.95% Jaminan Uptime Jaringan',
                'IP Public Block /29 (4 IP Usable)',
                'Dedicated Fiber Optik langsung ke kantor',
                'Dukungan Account Manager khusus',
                'Waktu Respon Gangguan Maksimal 2 Jam'
            ],
            'is_popular' => true,
            'is_active' => true,
        ]);

        // 3. Seed Testimonials
        Testimonial::create([
            'name' => 'Budi Santoso',
            'role_or_company' => 'Freelance Web Developer',
            'rating' => 5,
            'content' => 'Semenjak pakai Bitfast Home, kerjaan remote saya lancar tanpa kendala. Upload file gigabyte cuma hitungan menit, dan koneksinya sangat stabil dibanding ISP tetangga.',
            'avatar' => null,
            'is_featured' => true,
            'is_active' => true,
        ]);

        Testimonial::create([
            'name' => 'Siti Rahma',
            'role_or_company' => 'Ibu Rumah Tangga (4 Anak)',
            'rating' => 4,
            'content' => 'Anak-anak sekolah online dan streaming kartun barengan tetap lancar jaya. Pelayanan pasang barunya juga cepat, besoknya langsung dikirim teknisi untuk instalasi.',
            'avatar' => null,
            'is_featured' => true,
            'is_active' => true,
        ]);

        Testimonial::create([
            'name' => 'Rian Hidayat',
            'role_or_company' => 'Pemilik Kopi Bahagia',
            'rating' => 5,
            'content' => 'Kami menyediakan Free Wi-Fi untuk pelanggan kafe kami. Dengan Bitfast Business Pro, 50+ pengunjung kafe bisa browsing dan main game barengan tanpa lemot. Bisnis makin rame!',
            'avatar' => null,
            'is_featured' => true,
            'is_active' => true,
        ]);

        // 4. Seed Posts
        Post::create([
            'user_id' => $admin->id,
            'title' => 'Mengenal Teknologi Fiber Optik dan Mengapa Lebih Cepat',
            'slug' => 'mengenal-teknologi-fiber-optik-dan-mengapa-lebih-cepat',
            'excerpt' => 'Ingin tahu rahasia di balik internet super cepat? Simak bagaimana kabel kaca fiber optik menghantarkan data secepat cahaya ke rumah Anda.',
            'content' => '<p>Apakah Anda sering bertanya-tanya mengapa koneksi internet fiber optik jauh lebih cepat dan stabil dibandingkan dengan koneksi kabel tembaga biasa? Jawabannya terletak pada fisika transmisi data.</p><p>Fiber optik menggunakan cahaya untuk mengirimkan informasi, yang bergerak melalui tabung kaca murni yang sangat halus. Kecepatan cahaya ini memungkinkan transfer data yang hampir seketika, dengan redaman sinyal yang sangat minim bahkan untuk jarak yang sangat jauh.</p><p>Bitfast menggunakan 100% jaringan fiber optik murni (FTTH - Fiber To The Home) untuk memastikan bandwidth penuh sampai ke dalam rumah Anda. Keunggulannya meliputi:</p><ul><li>Koneksi simetris untuk download dan upload yang seimbang.</li><li>Kebal terhadap gangguan elektromagnetik (petir, hujan, dsb).</li><li>Latensi (ping) jauh lebih rendah dan responsif.</li></ul>',
            'cover_image' => null,
            'is_published' => true,
            'published_at' => now(),
        ]);

        Post::create([
            'user_id' => $admin->id,
            'title' => 'Tips Memaksimalkan Wi-Fi Router di Rumah Anda',
            'slug' => 'tips-memaksimalkan-wifi-router-di-rumah-anda',
            'excerpt' => 'Posisi router menentukan prestasi! Berikut adalah 5 tips praktis meletakkan dan mengatur Wi-Fi router agar sinyal kuat ke seluruh sudut ruangan.',
            'content' => '<p>Pernahkah Anda merasa sinyal Wi-Fi di kamar tidur lebih lemah daripada di ruang tamu? Hal ini sangat dipengaruhi oleh posisi penempatan router Anda. Berikut tips dari tim teknis Bitfast:</p><ol><li><strong>Letakkan Router di Area Terbuka dan Tengah Rumah</strong>: Jangan menyembunyikan router di dalam lemari kayu, laci, atau di balik TV besar karena akan meredam sinyal secara signifikan.</li><li><strong>Hindari Penghalang Logam dan Dinding Tebal</strong>: Bahan padat seperti beton dan logam dapat menyerap sinyal Wi-Fi dengan cepat.</li><li><strong>Jauhkan dari Perangkat Elektronik Lain</strong>: Microwave, telepon nirkabel rumah, dan monitor bayi memancarkan gelombang radio yang dapat menginterferensi frekuensi sinyal Wi-Fi Anda.</li><li><strong>Atur Posisi Antena</strong>: Jika router memiliki beberapa antena, atur posisinya (satu tegak lurus vertikal dan satu mendatar horizontal) untuk menyebarkan gelombang radio ke berbagai arah secara merata.</li><li><strong>Lakukan Reboot Berkala</strong>: Me-restart router seminggu sekali membantu menyegarkan memori router Anda dan membersihkan cache sisa koneksi perangkat yang menumpuk.</li></ol>',
            'cover_image' => null,
            'is_published' => true,
            'published_at' => now(),
        ]);

        Post::create([
            'user_id' => $admin->id,
            'title' => 'Mengapa Ping Rendah Sangat Penting untuk Gaming Online',
            'slug' => 'mengapa-ping-rendah-sangat-penting-untuk-gaming-online',
            'excerpt' => 'Ping tinggi bikin lag saat push rank? Pelajari apa itu ping, latensi, dan bagaimana Bitfast mengoptimalkan routing khusus untuk para gamer.',
            'content' => '<p>Bagi seorang gamer online, bandwidth besar (seperti 100 Mbps) tidak akan berarti banyak jika latensi atau ping Anda sangat tinggi. Ping adalah waktu yang dibutuhkan untuk mengirimkan satu paket data dari komputer Anda ke server game dan kembali lagi, diukur dalam milidetik (ms).</p><p>Latensi yang rendah memastikan respon karakter Anda di dalam game terasa instan dan bebas delay. Jika ping Anda tinggi, Anda akan mengalami "lag" atau "teleportasi" di mana karakter Anda tiba-tiba berpindah posisi secara mendadak.</p><p>Bitfast mengimplementasikan custom routing policy dan peering langsung ke berbagai server game populer (seperti Mobile Legends, Valorant, PUBG, dll) untuk memastikan ping serendah mungkin bagi pelanggan kami. Dengan koneksi stabil 100% fiber optik Bitfast, Anda bisa bermain dengan tenang tanpa takut putus koneksi di momen-momen krusial permainan.</p>',
            'cover_image' => null,
            'is_published' => true,
            'published_at' => now(),
        ]);
    }
}
