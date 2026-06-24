import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data || []);
    } catch (err) {
      console.error('❌ Error fetch suppliers:', err);
      setError('Gagal memuat data supplier. Silakan refresh halaman.');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSave = async () => {
    try {
      if (!form.name.trim()) {
        toast.error('Nama supplier wajib diisi');
        return;
      }

      const payload = {
        name: form.name.trim(),
        contact: form.phone || '',
        address: form.address || '',
      };

      if (editing) {
        await api.put(`/suppliers/${editing}`, payload);
        toast.success('Supplier berhasil diupdate');
      } else {
        await api.post('/suppliers', payload);
        toast.success('Supplier berhasil ditambahkan');
      }
      setModalOpen(false);
      setEditing(null);
      setForm({ name: '', phone: '', address: '' });
      await fetchSuppliers();
    } catch (err) {
      console.error('❌ Error save supplier:', err);
      toast.error(err.response?.data?.message || 'Gagal menyimpan supplier');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus supplier ini?')) return;
    try {
      await api.delete(`/suppliers/${id}`);
      toast.success('Supplier dihapus');
      await fetchSuppliers();
    } catch {
      toast.error('Gagal menghapus supplier');
    }
  };

  const filtered = suppliers.filter((s) =>
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
          onClick={fetchSuppliers}
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
        <h1 className="text-2xl font-bold text-text-primary">Supplier</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cari supplier..."
            className="w-full sm:w-64"
          />
          <Button
            onClick={() => {
              setEditing(null);
              setForm({ name: '', phone: '', address: '' });
              setModalOpen(true);
            }}
          >
            <Plus size={16} className="mr-2" /> Tambah Supplier
          </Button>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-hover border-b border-border">
              <tr className="text-text-muted">
                <th className="py-3 px-4 text-left font-medium">Nama</th>
                <th className="py-3 px-4 text-left font-medium">Telepon</th>
                <th className="py-3 px-4 text-left font-medium">Alamat</th>
                <th className="py-3 px-4 text-left font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-text-muted">
                    <p>Tidak ada supplier ditemukan</p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                    <td className="py-3 px-4 font-medium text-text-primary">{s.name}</td>
                    <td className="py-3 px-4 text-text-secondary">{s.contact || '-'}</td>
                    <td className="py-3 px-4 text-text-secondary">{s.address || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditing(s.id);
                            setForm({
                              name: s.name,
                              phone: s.contact || '',
                              address: s.address || '',
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
        title={editing ? 'Edit Supplier' : 'Tambah Supplier'}
        size="lg"
      >
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Nama"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama supplier"
            required
          />
          <Input
            label="Telepon"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Nomor telepon"
          />
          <Input
            label="Alamat"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Alamat supplier"
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

export default AdminSuppliers;