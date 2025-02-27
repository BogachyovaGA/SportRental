import React from 'react';
// Импортируем компоненты для маршрутизации
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Импортируем компоненты публичных страниц
import HomePage from './pages/home/HomePage';                    // Главная страница
import CatalogPage from './pages/catalog/CatalogPage';          // Каталог товаров
import ProductPage from './pages/product/ProductPage';          // Страница товара
import LoginPage from './pages/auth/login/LoginPage';           // Страница входа
import RegisterPage from './pages/auth/register/RegisterPage';  // Страница регистрации
import CartPage from './pages/cart/CartPage';                   // Корзина
import OrdersPage from './pages/orders/OrdersPage';             // Заказы пользователя

// Импортируем компоненты административной панели
import DashboardPage from './pages/admin/dashboard/DashboardPage';                    // Панель управления
import ProductsManagementPage from './pages/admin/products/ProductsManagementPage';   // Управление товарами
import CategoriesManagementPage from './pages/admin/categories/CategoriesManagementPage'; // Управление категориями
import OrdersManagementPage from './pages/admin/orders/OrdersManagementPage';        // Управление заказами

// Добавьте импорт USER_MOCK и ADMIN_MOCK
import { USER_MOCK, ADMIN_MOCK } from './mocks/apiMocks';

/**
 * Компонент для защиты маршрутов, требующих авторизации
 */
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Проверяем наличие токена в localStorage
  const token = localStorage.getItem('token');
  
  // Если есть токен, считаем пользователя авторизованным
  const isAuthenticated = !!token;
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

/**
 * Компонент для защиты маршрутов администратора
 */
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Проверяем наличие токена в localStorage
  const token = localStorage.getItem('token');
  
  // Проверяем, соответствует ли токен админскому
  const isAdmin = token === ADMIN_MOCK.token;
  
  return isAdmin ? <>{children}</> : <Navigate to="/" />;
};

/*
Главный компонент приложения
Содержит все маршруты и их защиту
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные маршруты (доступны всем) */}
        <Route path="/" element={<HomePage />} />                    //Главная страница
        <Route path="/catalog" element={<CatalogPage />} />         // Каталог
        <Route path="/product/:id" element={<ProductPage />} />     // Страница товара с динамическим ID
        <Route path="/login" element={<LoginPage />} />             // Страница входа
        <Route path="/register" element={<RegisterPage />} />       // Страница регистрации

        {/* Защищенные маршруты (только для авторизованных пользователей) */}
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

        {/* Защищенные маршруты администратора */}
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

        {/* Маршрут по умолчанию - перенаправление на главную страницу */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
/*
Использует React Router для маршрутизации
Имеет компоненты защиты маршрутов (PrivateRoute и AdminRoute)
Поддерживает динамические маршруты (например, /product/:id)
Перенаправляет несуществующие маршруты на главную страницу
Разделяет доступ по уровням авторизации
*/
