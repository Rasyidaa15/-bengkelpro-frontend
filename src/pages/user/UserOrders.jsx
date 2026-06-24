import React, { useState, useEffect } from 'react';
import { Receipt, Package, Wrench, Upload, Eye } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);

  const formatRupiah = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value).replace(/\s/g, '');
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    processed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    shipped: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    completed: 'bg-green-500/20 text-green-400 border border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleUploadProof = async (orderId, file) => {
    if (!file) return;
    setUploading(orderId);
    const formData = new FormData();
    formData.append('proof', file);
    formData.append('orderId', orderId);

    try {
      await api.post('/upload/proof', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Bukti transfer berhasil diupload!');
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal upload bukti');
    } finally {
      setUploading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-crimson-400 border-t-transparent"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center py-12 text-text-muted">
        <Receipt size={64} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg">Belum ada pesanan</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-text-primary">Riwayat Pesanan</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-surface rounded-2xl border border-border p-6 transition-all hover:border-crimson-400/40">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-semibold text-text-primary">#{order.id}</p>
                <p className="text-sm text-text-muted">
                  {new Date(order.orderDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400'}`}>
                  {order.status}
                </span>
                <span className="font-bold text-lg text-crimson-400">
                  {formatRupiah(order.total)}
                </span>
              </div>
            </div>

            {/* Item */}
            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Item:</p>
              <div className="space-y-2">
                {order.OrderItems && order.OrderItems.length > 0 ? (
                  order.OrderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {item.Product ? (
                          <Package size={14} className="text-crimson-400" />
                        ) : item.Service ? (
                          <Wrench size={14} className="text-amber-400" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full bg-text-muted"></span>
                        )}
                        <span className="text-text-primary">
                          {item.Product?.name || item.Service?.name || 'Item'}
                          <span className="text-text-muted ml-1">x{item.quantity}</span>
                        </span>
                      </div>
                      <span className="text-text-secondary font-medium">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-text-muted">Tidak ada item</p>
                )}
              </div>
            </div>

            {/* Alamat */}
            {order.address && order.address !== '-' && (
              <div className="mt-2 text-xs text-text-muted border-t border-border pt-2">
                📦 {order.address}
              </div>
            )}

            {/* Upload Bukti */}
            {order.status === 'pending' && (order.paymentMethod === 'Transfer' || order.paymentMethod === 'QRIS') && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-sm font-medium text-text-secondary mb-2">
                  💳 Upload Bukti Transfer / QRIS
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="cursor-pointer px-4 py-2 bg-crimson-400/10 border border-crimson-400/20 text-crimson-400 rounded-xl text-sm font-medium hover:bg-crimson-400/20 transition-colors flex items-center gap-2">
                    <Upload size={16} />
                    Pilih File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleUploadProof(order.id, file);
                      }}
                    />
                  </label>
                  {uploading === order.id && (
                    <span className="text-sm text-text-muted">Uploading...</span>
                  )}
                  {order.proof && (
                    <button
                      onClick={() => window.open(`/uploads/${order.proof}`, '_blank')}
                      className="px-3 py-1.5 text-sm text-crimson-400 hover:underline flex items-center gap-1"
                    >
                      <Eye size={14} /> Lihat Bukti
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrders;