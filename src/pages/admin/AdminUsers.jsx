import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/users/${editing}`, form);
        toast.success('User berhasil diupdate');
      } else {
        await api.post('/auth/register', form);
        toast.success('User berhasil ditambahkan');
      }
      setModalOpen(false);
      setEditing(null);
      setForm({ name: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus user ini?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User dihapus');
      fetchUsers();
    } catch {
      toast.error('Gagal menghapus user');
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-crimson-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-text-primary">User</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Cari user..." className="w-full sm:w-64" />
          <Button onClick={() => { setEditing(null); setForm({ name: '', email: '', password: '', role: 'user' }); setModalOpen(true); }}>
            <Plus size={16} className="mr-2" /> Tambah User
          </Button>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/50 border-b border-border">
              <tr className="text-text-muted">
                <th className="py-3 px-4 text-left font-medium">Nama</th>
                <th className="py-3 px-4 text-left font-medium">Email</th>
                <th className="py-3 px-4 text-left font-medium">Role</th>
                <th className="py-3 px-4 text-left font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                  <td className="py-3 px-4 font-medium text-text-primary">{u.name}</td>
                  <td className="py-3 px-4 text-text-secondary">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.role === 'admin'
                        ? 'bg-crimson-400/20 text-crimson-400 border border-crimson-400/20'
                        : 'bg-blue-400/20 text-blue-400 border border-blue-400/20'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditing(u.id); setForm({ name: u.name, email: u.email, password: '', role: u.role }); setModalOpen(true); }} className="p-1.5 text-crimson-400 hover:bg-crimson-400/10 rounded-lg">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit User' : 'Tambah User'}>
        <div className="space-y-4">
          <Input label="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama lengkap" />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editing ? 'Kosongkan jika tidak diubah' : 'Password'} />
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-crimson-400/50">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => { setModalOpen(false); setEditing(null); }}>Batal</Button>
          <Button onClick={handleSave}>Simpan</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;