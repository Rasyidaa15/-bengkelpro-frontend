import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Search, Bell, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // STATE NOTIFIKASI (dengan read/unread)
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Pesanan baru #42 dari ecy', time: '2 menit lalu', read: false },
    { id: 2, message: 'Stok Oli Castrol tersisa 3 unit', time: '15 menit lalu', read: false },
    { id: 3, message: 'User baru mendaftar: andi123', time: '1 jam lalu', read: true },
  ]);

  // HITUNG JUMLAH BELUM DIBACA
  const unreadCount = notifications.filter(n => !n.read).length;

  // FUNGSI TANDAI SEMUA SUDAH DIBACA
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  return (
    <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border transition-colors duration-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-surface-hover transition-colors lg:hidden"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-crimson-gradient flex items-center justify-center text-white font-bold text-sm shadow-glow">
                BP
              </div>
              <span className="text-xl font-bold text-text-primary hidden sm:block">
                Bengkel<span className="text-crimson-400">Pro</span>
              </span>
            </Link>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Cari produk, pesanan..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-crimson-400/50 focus:border-crimson-400 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-surface-hover transition-colors md:hidden"
            >
              <Search size={20} />
            </button>

            {/* NOTIFIKASI */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-lg hover:bg-surface-hover transition-colors relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-crimson-400 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-surface rounded-xl shadow-card border border-border py-2 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <span className="font-semibold text-text-primary">Notifikasi</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-text-muted text-sm">Tidak ada notifikasi</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 hover:bg-surface-hover transition-colors cursor-pointer ${
                            !n.read ? 'border-l-2 border-crimson-400' : ''
                          }`}
                        >
                          <p className="text-sm text-text-primary">{n.message}</p>
                          <p className="text-xs text-text-muted mt-1">{n.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && unreadCount > 0 && (
                    <div className="px-4 py-2 border-t border-border text-center">
                      <button
                        onClick={() => {
                          markAllAsRead();
                          setNotifOpen(false); // tutup dropdown setelah klik
                        }}
                        className="text-xs text-crimson-400 hover:underline"
                      >
                        Tandai semua sudah dibaca
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
            >
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-text-secondary" />}
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-hover transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-crimson-gradient flex items-center justify-center text-white font-semibold text-sm shadow-glow">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="text-sm font-medium text-text-secondary hidden sm:block">
                  {user?.name || 'Admin'}
                </span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-card border border-border py-1 z-50">
                  <button
                    onClick={() => {
                      navigate('/user/profile');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors flex items-center gap-2"
                  >
                    <User size={16} /> Profil
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-crimson-400 hover:bg-surface-hover transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Cari..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-crimson-400/50"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;