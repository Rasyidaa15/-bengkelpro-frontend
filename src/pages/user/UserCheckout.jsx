import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UserCheckout = () => {
  const [form, setForm] = useState({ address: '', phone: '', paymentMethod: 'COD' });
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // DATA REKENING BENGKEL
  const bankAccounts = [
    { bank: 'BNI', accountNumber: '1234567890', owner: 'BengkelPro' },
    { bank: 'BCA', accountNumber: '0987654321', owner: 'BengkelPro' },
  ];

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(data);
  }, []);

  const hasProduct = cart.some(item => item.productId);
  const onlyServices = cart.length > 0 && !hasProduct;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasProduct && !form.address.trim()) {
      toast.error('Alamat pengiriman wajib diisi untuk pembelian produk');
      return;
    }
    if (!form.phone.trim()) {
      toast.error('Nomor HP wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const items = cart.map(item => {
        if (item.productId) return { productId: item.productId, quantity: item.quantity };
        if (item.serviceId) return { serviceId: item.serviceId, quantity: item.quantity };
        return null;
      }).filter(Boolean);

      const payload = {
        items,
        address: onlyServices ? '-' : form.address,
        phone: form.phone,
        paymentMethod: form.paymentMethod,
      };

      const orderRes = await api.post('/orders', payload);
      const orderId = orderRes.data.id;

      // Jika metode Transfer, tampilkan nomor rekening
      if (form.paymentMethod === 'Transfer') {
        toast.success('Pesanan berhasil dibuat! Silakan transfer ke rekening di bawah ini.');
        localStorage.removeItem('cart');
        navigate(`/user/orders`);
        return;
      }

      // COD langsung sukses
      toast.success('Pesanan berhasil dibuat!');
      localStorage.removeItem('cart');
      navigate('/user/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Checkout</h1>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-orange-200/30 dark:border-orange-800/30 p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Info */}
          {onlyServices ? (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-700 dark:text-orange-300 text-sm border border-orange-200 dark:border-orange-800">
              <p className="font-semibold">📌 Anda hanya memesan jasa servis.</p>
              <p className="mt-1">Silakan datang langsung ke bengkel kami di:</p>
              <p className="mt-1 font-medium">Klinik Motor, Desa Gedung Mulya RT 01 RW 01 Gedung Mulya, Mesuji</p>
            </div>
          ) : (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-sm text-orange-700 dark:text-orange-300">
              📦 Alamat untuk pengiriman sparepart.
            </div>
          )}

          {/* Alamat (hanya jika ada produk) */}
          {hasProduct && (
            <Input
              label="Alamat Pengiriman"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Jl. Bengkel No. 123, Jakarta"
              required
            />
          )}

          {/* Nomor HP */}
          <Input
            label="Nomor HP"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="0812345678"
            required
          />

          {/* Metode Pembayaran (HANYA COD & TRANSFER) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['COD', 'Transfer'].map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: method })}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                    form.paymentMethod === method
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-300'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Nomor Rekening (hanya jika pilih Transfer) */}
          {form.paymentMethod === 'Transfer' && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <p className="font-semibold text-amber-800 dark:text-amber-300">💳 Transfer ke Rekening Berikut:</p>
              <div className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {bankAccounts.map((acc, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-amber-200/50 dark:border-amber-800/50 py-1">
                    <span>{acc.bank}</span>
                    <span className="font-mono font-bold">{acc.accountNumber}</span>
                    <span>a/n {acc.owner}</span>
                  </div>
                ))}
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  ⚠️ Setelah transfer, upload bukti di halaman Riwayat Pesanan.
                </p>
              </div>
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Konfirmasi Pesanan
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserCheckout;