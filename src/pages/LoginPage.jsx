import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Email wajib diisi');
      return;
    }
    if (!password.trim()) {
      toast.error('Password wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Selamat datang, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Login gagal';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-8 w-full max-w-md border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mb-3">
            BP
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Selamat Datang</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Masuk ke akun Anda</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail size={18} />}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<Lock size={18} />}
          />
          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Login
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Belum punya akun? <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Daftar</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;