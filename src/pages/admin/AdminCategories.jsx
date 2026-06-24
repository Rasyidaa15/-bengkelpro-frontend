import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error('❌ Error fetch categories:', err);
      setError('Gagal memuat data kategori. Silakan refresh halaman.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        toast.error('Nama kategori wajib diisi');
        return;
      }

      if (editing) {
        await api.put(`/categories/${editing}`, { name: name.trim() });
        toast.success('Kategori berhasil diupdate');
      } else {
        await api.post('/categories', { name: name.trim() });
        toast.success('Kategori berhasil ditambahkan');
      }
      setModalOpen(false);
      setEditing(null);
      setName('');
      await fetchCategories();
    } catch (err) {
      console.error('❌ Error save category:', err);
      toast.error(err.response?.data?.message || 'Gagal menyimpan kategori');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus kategori ini?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Kategori dihapus');
      await fetchCategories();
    } catch {
      toast.error('Gagal menghapus kategori');
    }
  };

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
          onClick={fetchCategories}
          className="mt-4 px-4 py-2 bg-crimson-gradient text-white rounded-xl hover:shadow-glow transition-all"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Kategori</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setName('');
            setModalOpen(true);
          }}
        >
          <Plus size={16} className="mr-2" /> Tambah Kategori
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-surface rounded-2xl p-4 border border-border flex items-center justify-between hover:border-crimson-400/40 transition-all"
          >
            <span className="font-medium text-text-primary">{cat.name}</span>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setEditing(cat.id);
                  setName(cat.name);
                  setModalOpen(true);
                }}
                className="p-1.5 text-crimson-400 hover:bg-crimson-400/10 rounded-lg transition-colors"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? 'Edit Kategori' : 'Tambah Kategori'}
      >
        <Input
          label="Nama Kategori"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama kategori"
        />
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

export default AdminCategories;