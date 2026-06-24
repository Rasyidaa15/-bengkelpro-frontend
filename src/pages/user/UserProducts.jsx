import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Produk</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Cari produk..." className="flex-1" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        >
          <option value="">Semua Kategori</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
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
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <p>Tidak ada produk ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default UserProducts;