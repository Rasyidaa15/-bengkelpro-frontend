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

        let data = [];

        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          data = res.data.data;
        }

        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Fetch products error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatRupiah = (value) => {
    if (!value) return 'Rp0';

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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

      <Navbar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-crimson-400/20 via-background to-amber-500/10 py-20 px-4 border-b border-border">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-crimson-400 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber-500 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Mascot size="lg" />
          </div>

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
            onClick={() =>
              navigate(
                user
                  ? user.role === 'admin'
                    ? '/admin/dashboard'
                    : '/user/dashboard'
                  : '/login'
              )
            }
          >
            {user ? 'Dashboard' : 'Lihat Produk'}
          </Button>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-text-primary text-center mb-4">
          Kategori
        </h2>

        <p className="text-text-muted text-center mb-10">
          Temukan produk & jasa berdasarkan kategori
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-surface rounded-2xl p-6 border border-border text-center cursor-pointer hover:border-crimson-400 transition"
              onClick={() => navigate('/login')}
            >
              <div
                className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
                  cat.name === 'Jasa'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-crimson-400/10 text-crimson-400'
                }`}
              >
                {cat.icon}
              </div>

              <h4 className="font-semibold">{cat.name}</h4>
              <p className="text-sm text-text-muted">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          🔥 Produk Terbaru
        </h2>

        <p className="text-center text-text-muted mb-10">
          Pilihan produk unggulan untuk bengkel Anda
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {products.length > 0 ? (
              products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate('/login')}
                  className="bg-surface rounded-2xl overflow-hidden border border-border cursor-pointer"
                >
                  <img
                    src={p.image || `https://picsum.photos/seed/${p.id}/300/300`}
                    alt={p.name}
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-4">

                    <span className="text-xs text-crimson-400">
                      {p.Category?.name || 'Umum'}
                    </span>

                    <h3 className="font-semibold mt-2">
                      {p.name}
                    </h3>

                    <p className="font-bold text-crimson-400 mt-2">
                      {formatRupiah(p.price)}
                    </p>

                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-10 text-gray-500">
                Belum ada produk.
              </div>
            )}

          </div>
        )}
      </section>

      <Footer />

    </div>
  );
};

export default LandingPage;