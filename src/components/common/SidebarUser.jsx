import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Package,
  Wrench,
  ShoppingCart,
  Receipt,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';

const SidebarUser = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme();

  const getActive = () => {
    const path = location.pathname.split('/').pop();
    return path || 'dashboard';
  };
  const active = getActive();

  const toggleDark = () => setDarkMode(!darkMode);

  const menuGroups = [
    {
      label: 'MENU UTAMA',
      items: [
        { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { id: 'products', icon: <Package size={20} />, label: 'Produk' },
        { id: 'services', icon: <Wrench size={20} />, label: 'Jasa' },
      ],
    },
    {
      label: 'TRANSAKSI',
      items: [
        { id: 'cart', icon: <ShoppingCart size={20} />, label: 'Keranjang' },
        { id: 'orders', icon: <Receipt size={20} />, label: 'Riwayat' },
      ],
    },
    {
      label: 'AKUN',
      items: [
        { id: 'profile', icon: <User size={20} />, label: 'Profil' },
        { id: 'settings', icon: <Settings size={20} />, label: 'Pengaturan' },
      ],
    },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-background border-r border-border z-30 transition-all duration-300 shadow-xl ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-crimson-gradient flex items-center justify-center text-white font-bold text-sm shadow-glow">BP</div>
            <span className="text-xl font-bold text-text-primary">Bengkel<span className="text-crimson-400">Pro</span></span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted transition-colors">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu */}
      <div className="p-3 space-y-4 overflow-y-auto h-[calc(100vh-8rem)]">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            {!collapsed && <p className="text-xs font-bold text-text-muted uppercase tracking-wider px-3 mb-2">{group.label}</p>}
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/user/${item.id}`)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    active === item.id
                      ? 'bg-crimson-400/10 text-crimson-400 border border-crimson-400/30'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  {item.icon}
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border space-y-1 bg-background/95">
        <button onClick={toggleDark} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors">
          {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
          {!collapsed && <span className="text-sm font-medium">Mode {darkMode ? 'Terang' : 'Gelap'}</span>}
        </button>
        <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-crimson-400 hover:bg-crimson-400/10 transition-colors">
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default SidebarUser;