import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- PATH BENAR
import { User, Mail, Lock } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Nama lengkap wajib diisi');
      return;
    }
    if (!email.trim()) {
      toast.error('Email wajib diisi');
      return;
    }
    if (password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }
    if (password !== confirm) {
      toast.error('Password tidak cocok');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Pendaftaran berhasil!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8 w-full max-w-md border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mb-3">BP</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Daftar Akun</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Buat akun baru untuk mulai berbelanja</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Nama Lengkap" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required icon={<User size={18} />} />
          <Input label="Email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required icon={<Mail size={18} />} />
          <Input label="Password" type="password" placeholder="Minimal 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required icon={<Lock size={18} />} />
          <Input label="Konfirmasi Password" type="password" placeholder="Ulangi password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required icon={<Lock size={18} />} />
          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>Daftar</Button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Sudah punya akun? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;