import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const UserSettings = () => {
  const { user } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Password baru tidak cocok');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }
    toast.success('Password berhasil diubah!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary">⚙️ Pengaturan</h1>
      <p className="text-text-muted text-sm">Kelola preferensi dan konfigurasi akun Anda</p>

      {/* Ganti Password */}
      <div className="bg-surface rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-semibold text-text-primary mb-4">🔐 Ganti Password</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <Input
            label="Password Saat Ini"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            placeholder="Masukkan password lama"
          />
          <Input
            label="Password Baru"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            placeholder="Minimal 6 karakter"
          />
          <Input
            label="Konfirmasi Password Baru"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            placeholder="Ulangi password baru"
          />
          <Button type="submit" variant="primary">Ganti Password</Button>
        </form>
      </div>

      {/* Preferensi */}
      <div className="bg-surface rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-semibold text-text-primary mb-4">🎨 Preferensi</h2>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Mode Gelap</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-crimson-400' : 'bg-text-muted'}`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}
            ></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;