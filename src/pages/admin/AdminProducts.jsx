import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    categoryId: '',
    supplierId: '',
  });

  const formatRupiah = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value).replace(/\s/g, '');
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/products');
      setProducts(res.data || []);
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Gagal memuat produk. Silakan refresh halaman.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async () => {
    try {
      if (!form.name.trim()) {
        toast.error('Nama produk wajib diisi');
        return;
      }
      if (!form.price || parseFloat(form.price) <= 0) {
        toast.error('Harga wajib diisi dan lebih dari 0');
        return;
      }
      if (!form.categoryId || parseInt(form.categoryId) <= 0) {
        toast.error('Kategori ID wajib diisi');
        return;
      }
      if (!form.supplierId || parseInt(form.supplierId) <= 0) {
        toast.error('Supplier ID wajib diisi');
        return;
      }

      const payload = {
        name: form.name.trim(),
        description: form.description || '',
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        image: form.image || '',
        categoryId: parseInt(form.categoryId),
        supplierId: parseInt(form.supplierId),
      };

      if (editing) {
        await api.put(`/products/${editing}`, payload);
        toast.success('Produk berhasil diupdate');
      } else {
        await api.post('/products', payload);
        toast.success('Produk berhasil ditambahkan');
      }
      setModalOpen(false);
      setEditing(null);
      setForm({ name: '', description: '', price: '', stock: '', image: '', categoryId: '', supplierId: '' });
      await fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan produk');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Produk dihapus');
      await fetchProducts();
    } catch {
      toast.error('Gagal menghapus produk');
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
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
          onClick={fetchProducts}
          className="mt-4 px-4 py-2 bg-crimson-gradient text-white rounded-xl hover:shadow-glow transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Produk</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Cari produk..." className="w-full sm:w-64" />
          <Button onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', stock: '', image: '', categoryId: '', supplierId: '' }); setModalOpen(true); }}>
            <Plus size={16} className="mr-2" /> Tambah Produk
          </Button>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/50 border-b border-border">
              <tr className="text-text-muted">
                <th className="py-3 px-4 text-left font-medium">Foto</th>
                <th className="py-3 px-4 text-left font-medium">Nama</th>
                <th className="py-3 px-4 text-left font-medium">Kategori</th>
                <th className="py-3 px-4 text-left font-medium">Supplier</th>
                <th className="py-3 px-4 text-left font-medium">Harga</th>
                <th className="py-3 px-4 text-left font-medium">Stok</th>
                <th className="py-3 px-4 text-left font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-text-muted">
                    <Package size={32} className="mx-auto mb-2 opacity-50" />
                    <p>Tidak ada produk ditemukan</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-text-muted">
                        {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-lg" /> : <Package size={20} />}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-text-primary">{p.name}</td>
                    <td className="py-3 px-4 text-text-secondary">{p.Category?.name || '-'}</td>
                    <td className="py-3 px-4 text-text-secondary">{p.Supplier?.name || '-'}</td>
                    <td className="py-3 px-4 font-bold text-crimson-400">{formatRupiah(p.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.stock > 5 ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/20' :
                        p.stock > 0 ? 'bg-amber-400/20 text-amber-400 border border-amber-400/20' :
                        'bg-red-400/20 text-red-400 border border-red-400/20'
                      }`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditing(p.id); setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, image: p.image || '', categoryId: p.categoryId, supplierId: p.supplierId }); setModalOpen(true); }} className="p-1.5 text-crimson-400 hover:bg-crimson-400/10 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
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

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit Produk' : 'Tambah Produk'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama produk" required />
          <Input label="Kategori ID" type="number" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} placeholder="ID Kategori" required />
          <Input label="Supplier ID" type="number" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} placeholder="ID Supplier" required />
          <Input label="Harga" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Harga" required />
          <Input label="Stok" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stok" />
          <Input label="Foto (URL)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="URL gambar" />
          <div className="md:col-span-2"><Input label="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi produk" /></div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => { setModalOpen(false); setEditing(null); }}>Batal</Button>
          <Button onClick={handleSave}>Simpan</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProducts;