import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Clock, ShoppingCart, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UserServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const formatRupiah = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value).replace(/\s/g, '');
  };

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/services');
      setServices(res.data || []);
    } catch {
      setError('Gagal memuat data jasa. Silakan refresh.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddToCart = (service) => {
    try {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(item => item.serviceId === service.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          serviceId: service.id,
          name: service.name,
          price: service.price,
          quantity: 1,
          duration: service.duration,
          type: 'service'
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      toast.success(`${service.name} ditambahkan ke keranjang`);
    } catch {
      toast.error('Gagal menambahkan ke keranjang');
    }
  };

  const filtered = services.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-crimson-400 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle size={48} className="text-crimson-400 mb-4" />
        <p className="text-text-secondary">{error}</p>
        <button onClick={fetchServices} className="mt-4 px-4 py-2 bg-crimson-gradient text-white rounded-xl hover:shadow-glow transition-all">
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-text-primary">Jasa Servis</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari jasa..." className="flex-1" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-surface rounded-2xl border border-border card-hover transition-all hover:border-crimson-400/40 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-crimson-400/10 border border-crimson-400/20 text-crimson-400">
                <Wrench size={24} />
              </div>
              <span className="text-xs font-medium bg-crimson-400/10 text-crimson-400 px-2 py-1 rounded-full border border-crimson-400/20">
                {s.duration || 0} menit
              </span>
            </div>
            <h3 className="font-semibold text-text-primary text-lg">{s.name}</h3>
            <p className="text-text-muted text-sm mt-1">{s.description || 'Tidak ada deskripsi'}</p>
            <p className="text-2xl font-bold text-crimson-400 mt-3">{formatRupiah(s.price)}</p>
            <button
              onClick={() => handleAddToCart(s)}
              className="w-full mt-4 px-4 py-2.5 bg-crimson-gradient text-white rounded-xl hover:shadow-glow transition-all flex items-center justify-center gap-2 font-medium"
            >
              <ShoppingCart size={18} /> Tambah
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <Wrench size={64} className="mx-auto mb-4 opacity-50" />
          <p>Tidak ada jasa ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default UserServices;