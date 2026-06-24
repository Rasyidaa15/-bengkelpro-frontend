import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSuppliers from './pages/admin/AdminSuppliers';
import AdminServices from './pages/admin/AdminServices';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReports from './pages/admin/AdminReports';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';

import UserLayout from './layouts/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import UserProducts from './pages/user/UserProducts';
import UserServices from './pages/user/UserServices';
import UserProductDetail from './pages/user/UserProductDetail';
import UserCart from './pages/user/UserCart';
import UserCheckout from './pages/user/UserCheckout';
import UserOrders from './pages/user/UserOrders';
import UserProfile from './pages/user/UserProfile';
import UserSettings from './pages/user/UserSettings';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="suppliers" element={<AdminSuppliers />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="/user" element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/user/dashboard" />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="products" element={<UserProducts />} />
              <Route path="services" element={<UserServices />} />
              <Route path="products/:id" element={<UserProductDetail />} />
              <Route path="cart" element={<UserCart />} />
              <Route path="checkout" element={<UserCheckout />} />
              <Route path="orders" element={<UserOrders />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="settings" element={<UserSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;