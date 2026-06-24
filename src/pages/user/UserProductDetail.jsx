import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard';
import SearchBar from '../../components/common/SearchBar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // BACA FILTER DARI URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setFilter(category);
    } else {
      setFilter('');
    }
  }, [location.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data || []);
    } catch (error) {
      console.error('Fetch products error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const handleView = (product) => {
    navigate(`/user/products/${product.id}`);
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) &&
    (filter === '' || p.Category?.name === filter)
  );

  const categories = [...new Set(products.map(p => p.Category?.name).filter(Boolean))];

  // FUNGSI HAPUS FILTER
  const clearFilter = () => {
    setFilter('');
    navigate('/user/products');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-crimson-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-text-primary">Produk</h1>
      
      {/* FILTER DAN SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari produk..." className="flex-1" />
        <select
          value={filter}
          onChange={(e) => {
            const val = e.target.value;
            setFilter(val);
            if (val) {
              navigate(`/user/products?category=${encodeURIComponent(val)}`);
            } else {
              navigate('/user/products');
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-crimson-400/50 focus:border-crimson-400"
        >
          <option value="">Semua Kategori</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* INDIKATOR FILTER AKTIF */}
      {filter && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">Filter aktif:</span>
          <span className="px-3 py-1 bg-crimson-400/10 text-crimson-400 border border-crimson-400/30 rounded-full text-sm font-medium">
            {filter}
          </span>
          <button
            onClick={clearFilter}
            className="text-sm text-text-muted hover:text-crimson-400 transition-colors"
          >
            ✕ Hapus filter
          </button>
        </div>
      )}

      {/* GRID PRODUK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={() => handleAddToCart(p)}
            onView={() => handleView(p)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p>Tidak ada produk ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default UserProducts;