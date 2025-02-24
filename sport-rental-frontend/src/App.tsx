import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Импорт компонентов страниц
import HomePage from './pages/home/HomePage';
import CatalogPage from './pages/catalog/CatalogPage';
import ProductPage from './pages/product/ProductPage';
import LoginPage from './pages/auth/login/LoginPage';
import RegisterPage from './pages/auth/register/RegisterPage';
import CartPage from './pages/cart/CartPage';
import OrdersPage from './pages/orders/OrdersPage';

// Импорт админских страниц
import DashboardPage from './pages/admin/dashboard/DashboardPage';
import ProductsManagementPage from './pages/admin/products/ProductsManagementPage';
import CategoriesManagementPage from './pages/admin/categories/CategoriesManagementPage';
import OrdersManagementPage from './pages/admin/orders/OrdersManagementPage';

// Защищенный маршрут для авторизованных пользователей
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = false; // Здесь будет проверка аутентификации
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Защищенный маршрут для администраторов
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAdmin = false; // Здесь будет проверка прав администратора
  return isAdmin ? <>{children}</> : <Navigate to="/" />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Защищенные маршруты для авторизованных пользователей */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />

        {/* Защищенные маршруты для администраторов */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <DashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <ProductsManagementPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <CategoriesManagementPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <OrdersManagementPage />
            </AdminRoute>
          }
        />

        {/* Маршрут для несуществующих страниц */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
