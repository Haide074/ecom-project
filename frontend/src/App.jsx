import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import MainLayout from './components/MainLayout';
import Toast from './components/Toast';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminProductForm from './pages/AdminProductForm';
import AdminCategories from './pages/AdminCategories';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import AdminInventory from './pages/AdminInventory';
import MediaLibrary from './pages/MediaLibrary';
import AdminDiscounts from './pages/AdminDiscounts';
import ActivityLog from './pages/ActivityLog';
import AdminSettings from './pages/AdminSettings';
import AdminTheme from './pages/AdminTheme';
import About from './pages/About';
import Contact from './pages/Contact';
import WhatsAppButton from './components/WhatsAppButton';
import Banner from './components/Banner';
import './index.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toast />
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Auth Routes (No Banner/Footer needed or special handling) */}
          <Route path="/login" element={
            <div className="app">
              <Navbar />
              <main className="main-content">
                <Login />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/register" element={
            <div className="app">
              <Navbar />
              <main className="main-content">
                <Register />
              </main>
              <Footer />
            </div>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/edit/:id" element={<AdminProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="discounts" element={<AdminDiscounts />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="theme" element={<AdminTheme />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

