import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', duration: '' });

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/services');
      setServices(res.data || []);
    } catch (err) {
      console.error('❌ Error fetch services:', err);
      setError('Gagal memuat data jasa. Silakan refresh halaman.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
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

  const handleSave = async () => {
    try {
      if (!form.name.trim()) {
        toast.error('Nama jasa wajib diisi');
        return;
      }
      if (!form.price || parseFloat(form.price) <= 0) {
        toast.error('Harga wajib diisi dan lebih dari 0');
        return;
      }

      const payload = {
        name: form.name.trim(),
        description: form.description || '',
        price: parseFloat(form.price),
        duration: parseInt(form.duration) || 0,
      };

      if (editing) {
        await api.put(`/services/${editing}`, payload);
        toast.success('Jasa berhasil diupdate');
      } else {
        await api.post('/services', payload);
        toast.success('Jasa berhasil ditambahkan');
      }
      setModalOpen(false);
      setEditing(null);
      setForm({ name: '', description: '', price: '', duration: '' });
      await fetchServices();
    } catch (err) {
      console.error('❌ Error save service:', err);
      toast.error(err.response?.data?.message || 'Gagal menyimpan jasa');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus jasa ini?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Jasa dihapus');
      await fetchServices();
    } catch {
      toast.error('Gagal menghapus jasa');
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
        <button
          onClick={fetchServices}
          className="mt-4 px-4 py-2 bg-crimson-gradient text-white rounded-xl hover:shadow-glow transition-all"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Jasa Servis</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari jasa..."
            className="w-full sm:w-64"
          />
          <Button
            onClick={() => {
              setEditing(null);
              setForm({ name: '', description: '', price: '', duration: '' });
              setModalOpen(true);
            }}
          >
            <Plus size={16} className="mr-2" /> Tambah Jasa
          </Button>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-hover border-b border-border">
              <tr className="text-text-muted">
                <th className="py-3 px-4 text-left font-medium">Nama</th>
                <th className="py-3 px-4 text-left font-medium">Deskripsi</th>
                <th className="py-3 px-4 text-left font-medium">Harga</th>
                <th className="py-3 px-4 text-left font-medium">Durasi (menit)</th>
                <th className="py-3 px-4 text-left font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-text-muted">
                    <p>Tidak ada jasa ditemukan</p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                    <td className="py-3 px-4 font-medium text-text-primary">{s.name}</td>
                    <td className="py-3 px-4 text-text-secondary">{s.description || '-'}</td>
                    <td className="py-3 px-4 font-semibold text-crimson-400">
                      {formatRupiah(s.price)}
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{s.duration || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditing(s.id);
                            setForm({
                              name: s.name,
                              description: s.description || '',
                              price: s.price,
                              duration: s.duration,
                            });
                            setModalOpen(true);
                          }}
                          className="p-1.5 text-crimson-400 hover:bg-crimson-400/10 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? 'Edit Jasa' : 'Tambah Jasa'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nama"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama jasa"
            required
          />
          <Input
            label="Deskripsi"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Deskripsi jasa"
          />
          <Input
            label="Harga"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Harga (contoh: 150000)"
            required
          />
          <Input
            label="Durasi (menit)"
            type="number"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            placeholder="Estimasi menit"
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => { setModalOpen(false); setEditing(null); }}>
            Batal
          </Button>
          <Button onClick={handleSave}>Simpan</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminServices;