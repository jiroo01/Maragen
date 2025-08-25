import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './Dashboard'; 
import './index.css'; // Pastikan untuk mengimpor file CSS Anda

function App() {
  // State untuk mengontrol tampilan: 'landing' atau 'dashboard'
  const [view, setView] = useState('landing'); 

  // State untuk modal login/register
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authForm, setAuthForm] = useState('login'); // 'login' atau 'register

  // --- Fungsi Handler ---

  const showDashboard = () => {
    setAuthModalOpen(false);
    setView('dashboard');
  };
  
  const showLanding = () => {
    setView('landing');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Logika login simulasi
    const email = e.target.loginEmail.value;
    const password = e.target.loginPassword.value;
    if (email === "user@example.com" && password === "password123") {
      alert("Login berhasil!");
      showDashboard();
    } else {
      alert("Email atau kata sandi salah.");
    }
  };
  
  const handleRegister = (e) => {
      e.preventDefault();
      // Logika registrasi simulasi
      const password = e.target.registerPassword.value;
      const confirmPassword = e.target.confirmPassword.value;
      if (password !== confirmPassword) {
          alert("Kata sandi tidak cocok.");
          return;
      }
      alert("Registrasi berhasil! Silakan masuk.");
      setAuthForm('login');
  };
  
  const handleLogout = () => {
    // Logika logout
    showLanding();
    alert("Anda telah berhasil keluar.");
  };

  // --- Komponen-Komponen Kecil ---
  
  const Header = () => (
    <header className="header-bg py-4 px-6 flex justify-between items-center fixed top-0 left-0 w-full z-10">
      <div className="flex items-center">
        <img src="https://placehold.co/40x40/142F32/E5FFCC?text=M" alt="Logo Maragen" className="h-8 w-8 mr-2 rounded-full" />
        <span className="text-2xl font-bold text-gray-800">Maragen</span>
      </div>
      <nav className="hidden md:flex space-x-8">
        <a href="#beranda" className="text-gray-600 hover:text-gray-900 font-medium">Beranda</a>
        <a href="#tentang" className="text-gray-600 hover:text-gray-900 font-medium">Tentang</a>
        <a href="#layanan" className="text-gray-600 hover:text-gray-900 font-medium">Layanan</a>
        <a href="#kontak" className="text-gray-600 hover:text-gray-900 font-medium">Kontak</a>
      </nav>
      <button onClick={() => setAuthModalOpen(true)} className="button-sign-up px-6 py-2 rounded-lg font-semibold hidden md:block">
        Daftar
      </button>
      <button className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none">
        <i className="fas fa-bars text-2xl"></i>
      </button>
    </header>
  );

  const LandingPage = () => (
    <div id="landingPage" className="landing-page-content">
      {/* Hero Section */}
      <section className="hero-section pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight text-gray-900">
                Masa Depan Otomatisasi dengan <span className="text-142F32">Teknologi Terbaru</span>
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-gray-600">
                Ahli teknologi untuk meningkatkan bisnis Anda. Mari bawa bisnis Anda lebih jauh.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setAuthModalOpen(true)}
                  className="button-primary px-8 py-4 text-lg sm:text-xl font-semibold rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
                >
                    Mulai Sekarang
                </button>
                <button 
                  onClick={showDashboard}
                  className="button-secondary px-8 py-4 text-lg sm:text-xl font-semibold rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50"
                >
                    Coba Demo
                </button>
            </div>
            <div className="mt-6 flex items-center justify-center text-gray-600">
                <i className="fas fa-star text-yellow-400 mr-1"></i>
                <i className="fas fa-star text-yellow-400 mr-1"></i>
                <i className="fas fa-star text-yellow-400 mr-1"></i>
                <i className="fas fa-star text-yellow-400 mr-1"></i>
                <i className="fas fa-star-half-alt text-yellow-400 mr-2"></i>
                <span>5.0</span>
                <span className="ml-2">dari 80+ ulasan</span>
            </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="max-w-6xl mx-auto stats-grid mt-16 px-4">
            <div className="stat-card overflow-hidden">
                <img src="https://placehold.co/400x300/142F32/E5FFCC?text=Otomatisasi" alt="Otomatisasi Visual" className="card-image" />
                <div className="p-4 text-center">
                    <p className="text-gray-700 font-semibold">Visual Otomatisasi</p>
                </div>
            </div>

            <div className="stat-card p-6 dark-bg">
                <div className="flex items-center mb-2">
                    <i className="fas fa-users text-E5FFCC text-2xl mr-3"></i>
                    <p className="text-3xl font-bold text-white">100+</p>
                </div>
                <p className="text-gray-400 text-sm">Klien & Mitra Terhormat Kami</p>
            </div>

            <div className="stat-card p-6">
                <div className="flex items-center mb-2">
                    <i className="fas fa-project-diagram text-142F32 text-2xl mr-3"></i>
                    <p className="text-3xl font-bold text-gray-800">1951+</p>
                </div>
                <p className="text-gray-600 text-sm">Total Proyek <span className="text-green-500">↑126 bulan ini</span></p>
            </div>

            <div className="stat-card p-6 dark-bg">
                <div className="flex items-center mb-2">
                    <i className="fas fa-calendar-alt text-E5FFCC text-2xl mr-3"></i>
                    <p className="text-3xl font-bold text-white">6+</p>
                </div>
                <p className="text-gray-400 text-sm">Tahun Layanan Khusus</p>
            </div>
        </div>
      </section>
      
      {/* Bottom Section (Layanan Otomatisasi) */}
      <section className="bottom-section">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white">
                Layanan Otomatisasi yang Efisien dan Terintegrasi
            </h2>
            <p className="text-lg sm:text-xl mb-12 opacity-80">
                Sederhanakan operasi Anda dengan layanan berkualitas dan berorientasi efisiensi.
            </p>

            <div className="bottom-grid">
                <div className="bottom-card">
                    <div className="flex items-center justify-between mb-4">
                        <i className="fas fa-robot text-E5FFCC text-3xl"></i>
                        <i className="fas fa-arrow-up-right-from-square text-gray-500 hover:text-E5FFCC cursor-pointer"></i>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Alur Kerja Otomatis</h3>
                    <p className="text-gray-400 text-sm">
                        Detail tentang proses otomatisasi, kemampuan integrasi, dan jenis alur kerja yang didukung.
                    </p>
                </div>
                <div className="bottom-card">
                    <div className="flex items-center justify-between mb-4">
                        <i className="fas fa-cogs text-E5FFCC text-3xl"></i>
                        <i className="fas fa-arrow-up-right-from-square text-gray-500 hover:text-E5FFCC cursor-pointer"></i>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Kustomisasi Solusi</h3>
                    <p className="text-gray-400 text-sm">
                        Pembuatan solusi otomatisasi khusus dengan opsi desain dan kustomisasi.
                    </p>
                </div>
                <div className="bottom-card">
                    <div className="flex items-center justify-between mb-4">
                        <i className="fas fa-chart-line text-E5FFCC text-3xl"></i>
                        <i className="fas fa-arrow-up-right-from-square text-gray-500 hover:text-E5FFCC cursor-pointer"></i>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">Pemantauan & Analisis</h3>
                    <p className="text-gray-400 text-sm">
                        Prosedur dan sistem untuk memastikan kualitas output otomatisasi yang tinggi.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="key-benefits-section">
          <div className="benefits-image-card">
              <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-800 font-semibold">Total Proyek</span>
                  <span className="text-green-500 text-sm">↑56%</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex justify-between">
                      <span>Selesai</span>
                      <span>10%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '10%'}}></div>
                  </div>
                  <div className="flex justify-between">
                      <span>Sedang Berjalan</span>
                      <span>13%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{width: '13%'}}></div>
                  </div>
                  <div className="flex justify-between">
                      <span>Ditolak</span>
                      <span>11%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{width: '11%'}}></div>
                  </div>
              </div>
              <div className="stat-card p-6 dark-bg p-4 mt-4">
                  <div className="flex items-center mb-2">
                      <i className="fas fa-project-diagram text-E5FFCC text-2xl mr-3"></i>
                      <p className="text-3xl font-bold text-white">1951+</p>
                  </div>
                  <p className="text-gray-400 text-sm">Peningkatan <span className="text-green-500">↑126 bulan ini</span></p>
              </div>
          </div>

          <div className="benefits-content">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-gray-900">
                  Manfaat Utama Sistem Kami untuk <span className="text-142F32">Efisiensi Bisnis Anda</span>
              </h2>
              <p className="text-lg sm:text-xl mb-8 text-gray-600">
                  Sistem kami meningkatkan produktivitas, mengurangi biaya, dan mendorong pertumbuhan bisnis.
              </p>

              <div className="space-y-6">
                  <div className="benefit-item">
                      <i className="fas fa-check-circle text-142F32"></i>
                      <div>
                          <h3 className="text-xl font-semibold text-gray-800">Meningkatkan Kualitas dengan Teknologi</h3>
                          <p className="text-gray-600 text-base">
                              Dengan teknologi canggih, kami membantu Anda mencapai kualitas produk terbaik. Pelajari bagaimana kami dapat meningkatkan standar Anda.
                          </p>
                      </div>
                  </div>
                  <div className="benefit-item">
                      <i className="fas fa-check-circle text-142F32"></i>
                      <div>
                          <h3 className="text-xl font-semibold text-gray-800">Optimasi Proses Produksi</h3>
                          <p className="text-gray-600 text-base">
                              Meningkatkan efisiensi dan produktivitas pabrik dengan solusi inovatif kami. Lihat bagaimana teknologi terbaru dapat memaksimalkan output Anda.
                          </p>
                      </div>
                  </div>
                  <div className="benefit-item">
                      <i className="fas fa-check-circle text-142F32"></i>
                      <div>
                          <h3 className="text-xl font-semibold text-gray-800">Produksi Berbasis AI</h3>
                          <p className="text-gray-600 text-base">
                              Manfaatkan kekuatan AI untuk mengubah proses manufaktur Anda, mencapai hasil yang lebih cepat dan efektif.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Tailored Plans Section */}
      <section className="tailored-plans-section">
          <div className="max-w-4xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white">
                  Paket yang Disesuaikan untuk <span className="text-E5FFCC">Skala Bisnis Anda</span>
              </h2>
              <p className="text-lg sm:text-xl opacity-80">
                  Harga fleksibel untuk setiap ukuran bisnis.
              </p>
          </div>

          <div className="pricing-grid">
              <div className="pricing-card">
                  <h3 className="text-2xl font-semibold mb-2 text-white">Starter</h3>
                  <p className="text-gray-400 text-base mb-4">
                      Paket ini menawarkan fitur dasar yang Anda butuhkan untuk memulai.
                  </p>
                  <div className="flex items-baseline mb-6">
                      <span className="price">$39</span>
                      <span className="price-per-month">/ bulan</span>
                  </div>
                  <button className="button-primary w-full py-3 rounded-lg font-semibold text-lg">
                      Mulai Sekarang
                  </button>
                  <div className="feature-list mt-6">
                      <div className="feature-item"><i className="fas fa-check-circle text-E5FFCC"></i><span>Produksi hingga 10.000 unit per bulan</span></div>
                      <div className="feature-item"><i className="fas fa-check-circle text-E5FFCC"></i><span>Dukungan teknis 24/7</span></div>
                      <div className="feature-item"><i className="fas fa-check-circle text-E5FFCC"></i><span>Akses ke dasbor produksi</span></div>
                      <div className="feature-item"><i className="fas fa-check-circle text-E5FFCC"></i><span>Pengaturan awal</span></div>
                  </div>
              </div>

              <div className="pricing-card">
                  <h3 className="text-2xl font-semibold mb-2 text-white">Enterprise</h3>
                  <p className="text-gray-400 text-base mb-4">
                      Paket ini menyediakan akses penuh ke semua fitur premium.
                  </p>
                  <div className="flex items-baseline mb-6">
                      <span className="price">$99</span>
                      <span className="price-per-month">/ bulan</span>
                  </div>
                  <button className="button-primary w-full py-3 rounded-lg font-semibold text-lg">
                      Mulai Sekarang
                  </button>
                  <div className="feature-list mt-6">
                      <div className="feature-item"><i className="fas fa-check-circle text-E5FFCC"></i><span>Unit produksi tak terbatas</span></div>
                      <div className="feature-item"><i className="fas fa-check-circle text-E5FFCC"></i><span>Manajer akun khusus</span></div>
                      <div className="feature-item"><i className="fas fa-check-circle text-E5FFCC"></i><span>Solusi manufaktur yang disesuaikan</span></div>
                      <div className="feature-item"><i className="fas fa-check-circle text-E5FFCC"></i><span>Optimalisasi produksi prediktif</span></div>
                  </div>
              </div>
          </div>
      </section>

      {/* Seamless Integrations Section */}
      <section className="integrations-section">
          <div className="integrations-content">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-gray-900">
                  Memberdayakan Perusahaan Top dengan <span className="text-142F32">Integrasi Tanpa Batas</span>
              </h2>
              <p className="text-lg sm:text-xl mb-8 text-gray-600">
                  Rasakan koneksi tanpa batas dengan solusi inovatif kami, dirancang untuk berintegrasi dengan mudah dengan sistem Anda yang ada, meningkatkan produktivitas, dan mendorong bisnis Anda menuju kesuksesan yang lebih besar.
              </p>
              <button className="button-primary px-8 py-4 text-lg sm:text-xl font-semibold rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50">
                  Bekerja Bersama Kami
              </button>
          </div>
          <div className="integrations-visual">
              <div className="integration-icon-grid">
                  <div className="integration-icon"><i className="fab fa-slack"></i></div>
                  <div className="integration-icon"><i className="fab fa-google-drive"></i></div>
                  <div className="integration-icon"><i className="fab fa-dropbox"></i></div>
                  <div className="integration-icon"><i className="fab fa-jira"></i></div>
                  <div className="integration-icon"><i className="fab fa-github"></i></div>
                  <div className="integration-icon"><i className="fab fa-trello"></i></div>
                  <div className="integration-icon"><i className="fab fa-salesforce"></i></div>
                  <div className="integration-icon"><i className="fab fa-microsoft"></i></div>
                  <div className="integration-icon"><i className="fab fa-aws"></i></div>
              </div>
          </div>
      </section>

      {/* From Idea to Production Section */}
      <section className="idea-to-production-section">
          <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white">
                  Dari Ide ke Produksi dalam Hitungan Hari
              </h2>
              <p className="text-lg sm:text-xl mb-8 opacity-80">
                  Percepat produksi Anda dengan teknologi kami. Kurangi waktu henti dan optimalkan biaya. Dapatkan penawaran spesial sekarang!
              </p>
              <button className="button-primary px-8 py-4 text-lg sm:text-xl font-semibold rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50">
                  Bekerja Bersama Kami
              </button>
          </div>
      </section>
      
      <Footer />
    </div>
  );
  
  const Footer = () => (
    <footer className="footer-section">
      <div className="max-w-6xl mx-auto footer-grid">
          <div className="footer-col">
              <div className="flex items-center mb-4">
                  <img src="https://placehold.co/40x40/142F32/E5FFCC?text=P" alt="Logo Maragen" className="h-8 w-8 mr-2 rounded-full"/>
                  <span className="text-2xl font-bold text-white">Maragen</span>
              </div>
              <p className="mb-4">
                  Solusi kami membuat produksi lebih cepat dan lebih murah. Hubungi kami untuk informasi lebih lanjut.
              </p>
          </div>
          <div className="footer-col">
              <h3>Perusahaan</h3>
              <ul>
                  <li><a href="#">Tentang Kami</a></li>
                  <li><a href="#">Pelanggan</a></li>
                  <li><a href="#">Berita</a></li>
                  <li><a href="#">Acara</a></li>
              </ul>
          </div>
          <div className="footer-col">
              <h3>Industri</h3>
              <ul>
                  <li><a href="#">Manufaktur Logam Presisi</a></li>
                  <li><a href="#">Manufaktur Industri</a></li>
                  <li><a href="#">Teknologi Tinggi & Elektronik</a></li>
                  <li><a href="#">Dirgantara</a></li>
              </ul>
          </div>
          <div className="footer-col">
              <h3>Produk</h3>
              <ul>
                  <li><a href="#">Sistem Eksekusi Manufaktur</a></li>
                  <li><a href="#">Perencanaan Sumber Daya Perusahaan</a></li>
                  <li><a href="#">Sistem Manajemen Kualitas</a></li>
                  <li><a href="#">Perencanaan Rantai Pasokan</a></li>
              </ul>
          </div>
          <div className="footer-col">
              <h3>Hubungi Kami</h3>
              <p className="mb-4">halo@maragen.com</p>
              <div className="social-icons">
                  <a href="#"><i className="fab fa-linkedin"></i></a>
                  <a href="#"><i className="fab fa-instagram"></i></a>
                  <a href="#"><i className="fab fa-facebook"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
              </div>
          </div>
      </div>
      <div className="text-center mt-8 pt-8 border-t border-gray-700">
          <p>&copy; 2024 Maragen. Semua hak dilindungi undang-undang.</p>
          <div className="flex justify-center space-x-4 mt-2">
              <a href="#" className="hover:text-white">Syarat & Ketentuan</a>
              <a href="#" className="hover:text-white">Kebijakan Privasi</a>
          </div>
      </div>
    </footer>
  );
  
  const AuthModal = () => (
    <div className={`modal ${isAuthModalOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close-button" onClick={() => setAuthModalOpen(false)}>&times;</span>
        <h2 className="text-3xl font-extrabold mb-6 text-gray-900">Masuk atau Daftar</h2>
        
        {authForm === 'login' ? (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" name="loginEmail" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-142F32" required defaultValue="user@example.com"/>
              <input type="password" name="loginPassword" placeholder="Kata Sandi" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-142F32" required defaultValue="password123"/>
              <button type="submit" className="button-primary w-full py-3 rounded-lg font-semibold">Masuk</button>
            </form>
            <p className="mt-4 text-gray-600">
              Belum punya akun? <a href="#" onClick={(e) => { e.preventDefault(); setAuthForm('register'); }} className="text-142F32 font-semibold hover:underline">Daftar di sini</a>
            </p>
          </>
        ) : (
          <>
            <form onSubmit={handleRegister} className="space-y-4">
              <input type="email" name="registerEmail" placeholder="Email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-142F32" required/>
              <input type="password" name="registerPassword" placeholder="Kata Sandi" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-142F32" required/>
              <input type="password" name="confirmPassword" placeholder="Konfirmasi Kata Sandi" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-142F32" required/>
              <button type="submit" className="button-primary w-full py-3 rounded-lg font-semibold">Daftar</button>
            </form>
            <p className="mt-4 text-gray-600">
              Sudah punya akun? <a href="#" onClick={(e) => { e.preventDefault(); setAuthForm('login'); }} className="text-142F32 font-semibold hover:underline">Masuk di sini</a>
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Header />
      {view === 'landing' && <LandingPage />}
      {view === 'dashboard' && <Dashboard />}
      {isAuthModalOpen && <AuthModal />}
    </>
  );
};

export default App;