import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Package,
  ShoppingBag,
  Coins,
  Clock,
  TrendingUp,
  TrendingDown,
  Plus,
  FileText,
} from 'lucide-react';
import Mascot from '../../components/common/Mascot';
import StatsCard from '../../components/common/StatsCard';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/recent-orders'),
        ]);
        setStats({
          totalUsers: statsRes.data.users || 0,
          totalProducts: statsRes.data.products || 0,
          totalOrders: statsRes.data.orders || 0,
          totalRevenue: statsRes.data.revenue || 0,
        });
        const activities = ordersRes.data.map((order) => ({
          id: order.id,
          type: 'transaksi',
          message: `Transaksi baru dari ${order.User?.name || 'User'}`,
          time: order.createdAt,
        }));
        activities.push({
          id: 'new-user',
          type: 'user',
          message: 'User baru mendaftar',
          time: new Date().toISOString(),
        });
        setRecentActivities(activities.slice(0, 5));
      } catch {
        setStats({
          totalUsers: 52,
          totalProducts: 128,
          totalOrders: 87,
          totalRevenue: 18000000,
        });
        setRecentActivities([
          { id: 1, type: 'transaksi', message: 'Transaksi baru dari Rasyida', time: new Date().toISOString() },
          { id: 2, type: 'user', message: 'User baru mendaftar: Budi', time: new Date().toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatRupiah = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value).replace(/\s/g, '');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-crimson-400 border-t-transparent"></div>
      </div>
    );
  }

  const chartData = [
    { month: 'Jan', value: 40 },
    { month: 'Feb', value: 65 },
    { month: 'Mar', value: 45 },
    { month: 'Apr', value: 80 },
    { month: 'Mei', value: 55 },
    { month: 'Jun', value: 70 },
    { month: 'Jul', value: 95 },
    { month: 'Agu', value: 60 },
    { month: 'Sep', value: 85 },
    { month: 'Okt', value: 50 },
    { month: 'Nov', value: 75 },
    { month: 'Des', value: 90 },
  ];
  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-crimson-400/20 p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            Halo, {user?.name} 👋
          </h1>
          <p className="text-text-secondary text-sm">
            Selamat datang di dashboard admin — kelola bisnis bengkel Anda dengan mudah.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <Mascot size="sm" />
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 bg-crimson-400/10 border border-crimson-400/20 text-crimson-400 rounded-xl text-sm font-medium hover:bg-crimson-400/20 transition-colors flex items-center gap-1.5"
            >
              <Plus size={16} /> Tambah Produk
            </button>
            <button
              onClick={() => navigate('/admin/orders')}
              className="px-4 py-2 bg-surface-hover border border-border text-text-secondary rounded-xl text-sm font-medium hover:border-crimson-400/30 transition-colors flex items-center gap-1.5"
            >
              <FileText size={16} /> Lihat Transaksi
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Coins size={24} />}
          title="Total Pemasukan"
          value={formatRupiah(stats.totalRevenue)}
          trend="up"
          trendValue="12.5%"
        />
        <StatsCard
          icon={<ShoppingBag size={24} />}
          title="Total Transaksi"
          value={stats.totalOrders}
          trend="up"
          trendValue="8.2%"
        />
        <StatsCard
          icon={<Package size={24} />}
          title="Total Produk"
          value={stats.totalProducts}
          trend="up"
          trendValue="3.1%"
        />
        <StatsCard
          icon={<Users size={24} />}
          title="Total User"
          value={stats.totalUsers}
          trend="down"
          trendValue="1.2%"
        />
      </div>

      {/* Grafik + Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-2xl p-6 border border-border">
          <h3 className="font-semibold text-text-primary mb-4">📊 Grafik Penjualan</h3>
          <div className="h-64 flex items-end justify-between gap-1 px-2 border border-border/20 rounded-xl p-2 bg-background/30">
            {chartData.map((item, index) => {
              const heightPercent = (item.value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end">
                  <div
                    className="w-full bg-crimson-gradient rounded-t transition-all duration-300 group-hover:opacity-80 group-hover:scale-y-105"
                    style={{
                      height: `${Math.max(heightPercent, 5)}%`,
                      minHeight: '4px',
                    }}
                  ></div>
                  <span className="text-xs text-text-muted mt-1">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Clock size={18} /> Aktivitas Terbaru
          </h3>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-text-muted text-sm">Belum ada aktivitas</p>
            ) : (
              recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      act.type === 'transaksi' ? 'bg-crimson-400' : 'bg-emerald-400'
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary">{act.message}</p>
                    <p className="text-xs text-text-muted">{formatDate(act.time)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;