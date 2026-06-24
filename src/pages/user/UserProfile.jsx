import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {};
      if (form.name) payload.name = form.name;
      if (form.email) payload.email = form.email;
      if (form.password) payload.password = form.password;

      await api.put('/users/profile', payload);
      toast.success('Profil berhasil diupdate!');
      
      const updatedUser = { ...user, name: form.name, email: form.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setForm({ ...form, password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal update profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">👤 Profil Saya</h1>
      
      <div className="bg-surface rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-crimson-gradient flex items-center justify-center text-white text-2xl font-bold shadow-glow">
            {form.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold text-text-primary">{form.name || user?.name}</p>
            <p className="text-sm text-text-muted">{form.email || user?.email}</p>
            <p className="text-xs text-text-muted mt-0.5">Role: {user?.role || 'user'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama lengkap"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="email@example.com"
          />
          <Input
            label="Password Baru"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Kosongkan jika tidak diubah"
          />
          <Button type="submit" variant="primary" isLoading={loading} className="w-full">
            Update Profil
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;