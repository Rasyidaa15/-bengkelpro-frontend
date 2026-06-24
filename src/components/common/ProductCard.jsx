import React from 'react';
import { Package, Star, ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onView }) => {
  if (!product) return null;

  const formatRupiah = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value).replace(/\s/g, '');
  };

  return (
    <div className="bg-surface rounded-2xl overflow-hidden border border-border card-hover group transition-all hover:border-crimson-400/40">
      <div className="relative h-48 bg-background/50 overflow-hidden">
        <img
          src={product.image || `https://picsum.photos/seed/${product.id}/200/200`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
          }}
        />
        {product.stock < 5 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-crimson-400 text-white text-xs px-2 py-1 rounded-full">Stok Terbatas</span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">Habis</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-crimson-400 bg-crimson-400/10 px-2 py-0.5 rounded-full border border-crimson-400/20">
            {product.Category?.name || 'Umum'}
          </span>
          <div className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
          </div>
        </div>
        <h3 className="font-semibold text-text-primary text-sm line-clamp-1">{product.name}</h3>
        <p className="text-lg font-bold text-crimson-400 mt-1">{formatRupiah(product.price)}</p>
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => onView?.(product)}
            className="flex-1 px-3 py-2 text-sm font-medium border border-border text-text-secondary rounded-lg hover:border-crimson-400 hover:text-crimson-400 transition-all flex items-center justify-center gap-1"
          >
            <Eye size={16} /> Detail
          </button>
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={product.stock === 0}
            className="flex-1 px-3 py-2 text-sm font-medium bg-crimson-gradient text-white rounded-lg hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <ShoppingCart size={16} /> Tambah
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;