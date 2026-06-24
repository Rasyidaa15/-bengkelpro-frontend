import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, Wrench } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import Mascot from '../../components/common/Mascot';
import api from '../../services/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.slice(0, 6));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        type: 'product'
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const handleView = (product) => {
    navigate(`/user/products/${product.id}`);
  };

  const categories = [
    { name: 'Perkakas', icon: <Package size={24} />, path: '/user/products?category=Perkakas' },
    { name: 'Ban', icon: <Package size={24} />, path: '/user/products?category=Ban' },
    { name: 'Oli', icon: <Package size={24} />, path: '/user/products?category=Oli' },
    { name: 'Jasa', icon: <Wrench size={24} />, path: '/user/services' },
    { name: 'Sparepart', icon: <Package size={24} />, path: '/user/products?category=Sparepart' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-crimson-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-crimson-400/20 p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            Halo, {user?.name} 👋
            <span className="text-sm font-normal text-text-muted">
              | {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </h1>
          <p className="text-text-secondary">Temukan kebutuhan bengkel Anda</p>
        </div>
        <Mascot size="md" />
      </div>

      {/* Kategori Bisa Diklik */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((cat, i) => (
          <div
            key={i}
            onClick={() => navigate(cat.path)}
            className="bg-surface rounded-2xl p-4 border border-border text-center cursor-pointer transition-all hover:border-crimson-400/40 hover:shadow-glow"
          >
            <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-2 ${
              cat.name === 'Jasa'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-crimson-400/10 text-crimson-400 border border-crimson-400/20'
            }`}>
              {cat.icon}
            </div>
            <span className="text-sm font-medium text-text-primary">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Produk Terbaru */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-text-primary">🔥 Produk Terbaru</h2>
        <button
          onClick={() => navigate('/user/products')}
          className="text-sm text-crimson-400 hover:text-crimson-300 transition-colors font-medium"
        >
          Lihat Semua →
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={() => handleAddToCart(p)}
            onView={() => handleView(p)}
          />
        ))}
      </div>

      {/* Banner Jasa */}
      <div className="bg-surface rounded-2xl p-5 border border-crimson-400/20 bg-gradient-to-r from-crimson-400/5 to-amber-500/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-crimson-400/20 border border-crimson-400/30">
            <Wrench className="w-8 h-8 text-crimson-400" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Butuh Jasa Servis?</h3>
            <p className="text-sm text-text-muted">Lihat layanan jasa bengkel kami</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/user/services')}
          className="px-5 py-2.5 bg-crimson-gradient text-white rounded-xl hover:shadow-glow transition-all font-medium"
        >
          Lihat Jasa
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;