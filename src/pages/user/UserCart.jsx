import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, Wrench, Package } from 'lucide-react';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const UserCart = () => {
  const [cart, setCart] = useState([]);
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

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(data);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleRemove = (id, type) => {
    const key = type === 'service' ? 'serviceId' : 'productId';
    const newCart = cart.filter(item => item[key] !== id);
    updateCart(newCart);
    toast.success('Item dihapus');
  };

  const handleQuantityChange = (id, type, delta) => {
    const key = type === 'service' ? 'serviceId' : 'productId';
    const newCart = cart.map(item => {
      if (item[key] === id) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return null;
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean);
    updateCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center py-12 text-gray-500 dark:text-gray-400">
        <ShoppingCart size={64} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg">Keranjang kosong</p>
        <button onClick={() => navigate('/user/products')} className="text-blue-600 dark:text-blue-400 hover:underline mt-2">Mulai Belanja</button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Keranjang Belanja</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200/50 dark:border-gray-700/50">
                <th className="py-3 px-4 text-left">Item</th>
                <th className="py-3 px-4 text-left">Tipe</th>
                <th className="py-3 px-4 text-left">Harga</th>
                <th className="py-3 px-4 text-left">Jumlah</th>
                <th className="py-3 px-4 text-left">Subtotal</th>
                <th className="py-3 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => {
                const id = item.productId || item.serviceId;
                const type = item.type || (item.productId ? 'product' : 'service');
                return (
                  <tr key={id + type} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">{item.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${type === 'service' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                        {type === 'service' ? 'Jasa' : 'Produk'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{formatRupiah(item.price)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleQuantityChange(id, type, -1)} className="p-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100"><Minus size={14} /></button>
                        <span className="w-8 text-center text-gray-800 dark:text-white">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(id, type, 1)} className="p-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100"><Plus size={14} /></button>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">{formatRupiah(item.price * item.quantity)}</td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleRemove(id, type)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <td colSpan="4" className="py-3 px-4 text-right font-semibold text-gray-800 dark:text-white">Total</td>
                <td className="py-3 px-4 font-bold text-lg text-blue-600 dark:text-blue-400">{formatRupiah(total)}</td>
                <td className="py-3 px-4">
                  <Button onClick={() => navigate('/user/checkout')}>Checkout</Button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserCart;