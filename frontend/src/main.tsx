import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import SellerRegistrationPage from './pages/SellerRegistrationPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import StorePage from './pages/StorePage';
import ProductPage from './pages/ProductPage';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import SellerGuard from './components/SellerGuard';
import OrdersPage from './pages/OrdersPage';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<HomePage />} />
                <Route path="discover" element={<DiscoverPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="profile/:username" element={<ProfilePage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="my-orders" element={<OrdersPage />} />
                <Route path="store/:storeId" element={<StorePage />} />
                <Route path="products/:productId" element={<ProductPage />} />

                <Route element={<SellerGuard />}>
                  <Route path="dashboard" element={<SellerDashboardPage />} />
                </Route>
                <Route path="become-creator" element={<SellerRegistrationPage />} />

                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="admin" element={<AdminPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
