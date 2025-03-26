import React from 'react';
// Импортируем компоненты для маршрутизации
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Импортируем общий компонент Header
import Header from './components/Header/Header';

// Импортируем компоненты публичных страниц
import HomePage from './pages/home/HomePage';                    // Главная страница
import CatalogPage from './pages/catalog/CatalogPage';          // Каталог товаров
import ProductPage from './pages/product/ProductPage';          // Страница товара
import LoginPage from './pages/auth/login/LoginPage';           // Страница входа
import RegisterPage from './pages/auth/register/RegisterPage';  // Страница регистрации
import CartPage from './pages/cart/CartPage';                   // Корзина
import OrdersPage from './pages/orders/OrdersPage';             // Заказы пользователя
import FeedbackPage from './pages/feedback/FeedbackPage';       // Страница отзывов
import ContactsPage from './pages/contacts/ContactsPage';       // Страница контактов
import ProfilePage from './pages/profile/ProfilePage';          // Страница профиля пользователя
import CheckoutPage from './pages/checkout/CheckoutPage';       // Страница оформления заказа

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

// Компонент-обертка для добавления хедера к страницам
const WithHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

/*
Главный компонент приложения
Содержит все маршруты и их защиту
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные маршруты (доступны всем) с хедером */}
        <Route path="/" element={<WithHeader><HomePage /></WithHeader>} />
        <Route path="/catalog" element={<WithHeader><CatalogPage /></WithHeader>} />
        <Route path="/product/:id" element={<WithHeader><ProductPage /></WithHeader>} />
        <Route path="/feedback" element={<WithHeader><FeedbackPage /></WithHeader>} />
        <Route path="/contacts" element={<WithHeader><ContactsPage /></WithHeader>} />
        
        {/* Страницы авторизации без хедера */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Страница корзины доступна без авторизации */}
        <Route
          path="/cart"
          element={
            <WithHeader>
              <CartPage />
            </WithHeader>
          }
        />

        {/* Защищенные маршруты (только для авторизованных пользователей) с хедером */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <WithHeader>
                <ProfilePage />
              </WithHeader>
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <WithHeader>
                <CheckoutPage />
              </WithHeader>
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <WithHeader>
                <OrdersPage />
              </WithHeader>
            </PrivateRoute>
          }
        />

        {/* Защищенные маршруты администратора с хедером */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <WithHeader>
                <DashboardPage />
              </WithHeader>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <WithHeader>
                <ProductsManagementPage />
              </WithHeader>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <WithHeader>
                <CategoriesManagementPage />
              </WithHeader>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <WithHeader>
                <OrdersManagementPage />
              </WithHeader>
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
