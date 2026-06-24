import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import Mascot from '../components/common/Mascot';
import { Package, Wrench } from 'lucide-react';
import api from '../services/api';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.slice(0, 4));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formatRupiah = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value).replace(/\s/g, '');
  };

  const categories = [
    { name: 'Perkakas', icon: <Package size={24} />, count: '34 produk' },
    { name: 'Ban', icon: <Package size={24} />, count: '28 produk' },
    { name: 'Oli', icon: <Package size={24} />, count: '19 produk' },
    { name: 'Sparepart', icon: <Package size={24} />, count: '47 produk' },
    { name: 'Jasa', icon: <Wrench size={24} />, count: '12 layanan' },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors duration-300">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <section className="relative overflow-hidden bg-gradient-to-br from-crimson-400/20 via-background to-amber-500/10 py-20 px-4 border-b border-border">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-crimson-400 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber-500 blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6"><Mascot size="lg" /></div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary leading-tight mb-4">
            Bengkel<span className="text-crimson-400">Pro</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto mb-4">
            Alat, Sparepart & Jasa Bengkel Berkualitas
          </p>
          <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto mb-8">
            Temukan kebutuhan bengkel Anda dari ribuan produk berkualitas dengan harga terbaik.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="shadow-glow hover:shadow-glow-strong"
            onClick={() => navigate(user ? (user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard') : '/login')}
          >
            {user ? 'Dashboard' : 'Lihat Produk'}
          </Button>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-text-primary text-center mb-4">Kategori</h2>
        <p className="text-text-muted text-center mb-10">Temukan produk & jasa berdasarkan kategori</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="bg-surface rounded-2xl p-6 border border-border text-center card-hover cursor-pointer transition-all hover:border-crimson-400/40"
              onClick={() => navigate('/login')}
            >
              <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
                cat.name === 'Jasa'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-crimson-400/10 text-crimson-400 border border-crimson-400/20'
              }`}>
                {cat.icon}
              </div>
              <h4 className="font-semibold text-text-primary">{cat.name}</h4>
              <p className="text-sm text-text-muted">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-text-primary text-center mb-4">🔥 Produk Terbaru</h2>
        <p className="text-text-muted text-center mb-10">Pilihan produk unggulan untuk bengkel Anda</p>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-crimson-400 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-surface rounded-2xl overflow-hidden border border-border card-hover cursor-pointer group transition-all hover:border-crimson-400/40"
                onClick={() => navigate('/login')}
              >
                <div className="relative h-48 bg-background/50 overflow-hidden">
                  <img
                    src={p.image || `https://picsum.photos/seed/${p.id}/200/200`}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://picsum.photos/seed/fallback${p.id}/200/200`;
                    }}
                  />
                  <span className="absolute top-2 right-2 bg-crimson-400 text-white text-xs px-2 py-1 rounded-full">{p.stock} stok</span>
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-crimson-400 bg-crimson-400/10 px-2 py-0.5 rounded-full border border-crimson-400/20">
                    {p.Category?.name || 'Umum'}
                  </span>
                  <h3 className="font-semibold text-text-primary text-sm mt-1">{p.name}</h3>
                  <p className="text-lg font-bold text-crimson-400 mt-1">{formatRupiah(p.price)}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/login'); }}
                    className="w-full mt-3 px-3 py-2 text-sm font-medium bg-crimson-gradient text-white rounded-lg hover:shadow-glow transition-all"
                  >
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;