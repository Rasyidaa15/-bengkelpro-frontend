import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
    pending: 'bg-amber-400/20 text-amber-400 border border-amber-400/20',
    processed: 'bg-blue-400/20 text-blue-400 border border-blue-400/20',
    shipped: 'bg-purple-400/20 text-purple-400 border border-purple-400/20',
    completed: 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/20',
    cancelled: 'bg-red-400/20 text-red-400 border border-red-400/20',
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/admin');
      setOrders(res.data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}`, { status: newStatus });
      toast.success('Status transaksi diupdate');
      fetchOrders();
    } catch {
      toast.error('Gagal update status');
    }
  };

  const getItemNames = (order) => {
    if (!order.OrderItems || order.OrderItems.length === 0) return '-';
    return order.OrderItems.map(item => {
      if (item.Product) return item.Product.name;
      if (item.Service) return item.Service.name;
      return 'Item';
    }).join(', ');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-crimson-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Transaksi</h1>
      <p className="text-text-muted mb-4 text-sm">Data masuk dari user saat checkout</p>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/50 border-b border-border">
              <tr className="text-text-muted">
                <th className="py-3 px-4 text-left font-medium">ID</th>
                <th className="py-3 px-4 text-left font-medium">User</th>
                <th className="py-3 px-4 text-left font-medium">Item</th>
                <th className="py-3 px-4 text-left font-medium">Total</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">Tanggal</th>
                <th className="py-3 px-4 text-left font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                  <td className="py-3 px-4 font-medium text-text-primary">#{o.id}</td>
                  <td className="py-3 px-4 text-text-secondary">{o.User?.name || 'Unknown'}</td>
                  <td className="py-3 px-4 text-text-secondary max-w-xs truncate" title={getItemNames(o)}>
                    {getItemNames(o)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-crimson-400">
                    {formatRupiah(o.total)}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 bg-transparent focus:ring-2 focus:ring-crimson-400/50 ${statusColors[o.status] || 'bg-surface-hover text-text-muted'}`}
                    >
                      <option value="pending">pending</option>
                      <option value="processed">processed</option>
                      <option value="shipped">shipped</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-text-muted">
                    {new Date(o.orderDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(o);
                        setDetailModal(true);
                      }}
                      className="p-1.5 text-crimson-400 hover:bg-crimson-400/10 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={detailModal} onClose={() => setDetailModal(false)} title="Detail Transaksi" size="lg">
        {selectedOrder && (
          <div className="space-y-4">
            <div><p className="text-sm text-text-muted">User</p><p className="font-medium text-text-primary">{selectedOrder.User?.name} ({selectedOrder.User?.email})</p></div>
            <div><p className="text-sm text-text-muted">Alamat</p><p className="text-text-primary">{selectedOrder.address}</p></div>
            <div><p className="text-sm text-text-muted">Telepon</p><p className="text-text-primary">{selectedOrder.phone}</p></div>
            <div><p className="text-sm text-text-muted">Metode Pembayaran</p><p className="text-text-primary">{selectedOrder.paymentMethod}</p></div>
            {selectedOrder.proof && (
              <div>
                <p className="text-sm text-text-muted">Bukti Transfer</p>
                <a href={`/uploads/${selectedOrder.proof}`} target="_blank" rel="noopener noreferrer" className="text-crimson-400 hover:underline flex items-center gap-2">
                  <Eye size={16} /> Lihat Bukti
                </a>
              </div>
            )}
            <div>
              <p className="text-sm text-text-muted">Item</p>
              <div className="bg-background/50 rounded-lg p-3 space-y-1">
                {selectedOrder.OrderItems?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{item.Product?.name || item.Service?.name || 'Item'} x{item.quantity}</span>
                    <span className="font-medium text-text-primary">{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-crimson-400">{formatRupiah(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-text-muted">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedOrder.status] || 'bg-surface-hover text-text-muted'}`}>
                {selectedOrder.status}
              </span>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="ghost" onClick={() => setDetailModal(false)}>Tutup</Button>
              {selectedOrder.status !== 'completed' && (
                <Button onClick={() => { handleUpdateStatus(selectedOrder.id, 'completed'); setDetailModal(false); }}>
                  Tandai Selesai
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrders;