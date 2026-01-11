import React, { useState, useEffect, useCallback } from 'react';
// Common UI Components
import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import HeroCarousel from './components/HeroCarousel';
import HomeSearch from './components/HomeSearch';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

// User Flow Components
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import UserProfile from './components/UserProfile';
import MyOrders from './components/MyOrders';
import Cart from './components/Cart';
import Login from './components/Login';
import Signup from './components/Signup';
import TermsAndCondition from './components/TermsAndCondition';
import PrivacyPolicy from './components/PrivacyPolicy';
import RefundPolicy from './components/RefundPolicy';
import ShippingPolicy from './components/ShippingPolicy';
import OrderPage from './components/OrderPage';
import ShippingPage from './components/ShippingPage';
import PaymentPage from './components/PaymentPage';
import SummaryPage from './components/SummaryPage';
import ProductSkeleton from './components/ProductSkeleton';

// Administrative Components
import AdminDashboard from './components/AdminDashboard';
import SellerDashboard from './components/SellerDashboard';

// Seller Flow Components
import SellersLandingPage from './components/SellersLandingPage';
import SellersLoginPage from './components/SellersLoginPage';
import SellerForgotPassword from './components/SellerForgotPassword';
import SellerSignup from './components/SellerSignup';

// Data and Constants
import { PRODUCTS } from './constants';
import { User, AuthView, Product, ShippingAddress, Order } from './types';
import { api } from './mockApi';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AuthView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true); 
  
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [finalOrder, setFinalOrder] = useState<Order | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      const savedUser = localStorage.getItem('beauzead_current_user');
      if (savedUser) setUser(JSON.parse(savedUser));
      
      try {
        const items = await api.getCart();
        setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
      } catch (e) {}

      const staticLoader = document.getElementById('initial-loader');
      if (staticLoader) {
        staticLoader.classList.add('fade-out');
        setTimeout(() => staticLoader.remove(), 600);
      }
      
      setIsGlobalLoading(false);
    };

    initializeApp();
  }, []);

  const navigateWithLoading = useCallback(async (view: AuthView, productData: Product | null = null) => {
    setIsGlobalLoading(true);
    await new Promise(r => setTimeout(r, 400));
    if (productData) setSelectedProduct(productData);
    setCurrentView(view);
    window.scrollTo(0, 0);
    setIsGlobalLoading(false);
  }, []);

  const handleLogout = async () => {
    setIsGlobalLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setUser(null);
    localStorage.removeItem('beauzead_current_user');
    localStorage.removeItem('beauzead_auth_token');
    setCurrentView('home');
    setIsGlobalLoading(false);
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = searchQuery 
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const isAll = !activeCategory || activeCategory === 'All';
    const matchesCategory = isAll ? true : p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = async (query: string) => {
    setIsProductsLoading(true);
    setSearchQuery(query);
    setCurrentView('home');
    await new Promise(r => setTimeout(r, 400));
    setIsProductsLoading(false);
  };

  const handleCategorySelect = async (category: string) => {
    setIsProductsLoading(true);
    setActiveCategory(category);
    setCurrentView('home');
    await new Promise(r => setTimeout(r, 300));
    setIsProductsLoading(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'sellers_landing': return <SellersLandingPage onStartSelling={() => navigateWithLoading('sellers_login')} onBack={() => navigateWithLoading('home')} />;
      case 'sellers_login': return <SellersLoginPage onSuccess={(u) => { setUser(u); navigateWithLoading('admin_dashboard'); }} onNavigate={navigateWithLoading} />;
      case 'sellers_forgot_password': return <SellerForgotPassword onBackToLogin={() => navigateWithLoading('sellers_login')} />;
      case 'sellers_signup': return <SellerSignup onNavigate={navigateWithLoading} />;
      case 'login': return <Login onSuccess={(u) => { setUser(u); navigateWithLoading(u.role === 'admin' ? 'admin_dashboard' : u.role === 'seller' ? 'admin_dashboard' : 'home'); }} onNavigate={navigateWithLoading} />;
      case 'signup': return <Signup onPending={() => {}} onNavigate={navigateWithLoading} />;
      case 'user_profile': return user ? <UserProfile user={user} onUpdate={setUser} onBack={() => navigateWithLoading('home')} /> : null;
      case 'my_orders': return user ? <MyOrders user={user} /> : null;
      case 'product_details': return selectedProduct ? <ProductDetails product={selectedProduct} onBack={() => navigateWithLoading('home')} onViewAllReviews={() => navigateWithLoading('reviews_page')} user={user} onLoginRequest={() => navigateWithLoading('login')} onBuyNow={(p) => { setSelectedProduct(p); if(!user) { navigateWithLoading('login'); } else { navigateWithLoading('checkout_order'); } }} onAddToCart={async (p, q) => { await api.addToCart(p, q); setCartCount(prev => prev + q); }} /> : null;
      case 'checkout_order': return selectedProduct ? <OrderPage product={selectedProduct} onContinue={(q) => { setOrderQuantity(q); navigateWithLoading('checkout_shipping'); }} onCancel={() => navigateWithLoading('product_details')} /> : null;
      case 'checkout_shipping': return <ShippingPage onContinue={(addr, charge) => { setShippingAddress(addr); setDeliveryCharge(charge); navigateWithLoading('checkout_payment'); }} onBack={() => navigateWithLoading('checkout_order')} />;
      case 'checkout_payment': return (selectedProduct && shippingAddress) ? <PaymentPage product={selectedProduct} quantity={orderQuantity} deliveryCharge={deliveryCharge} platformFee={0.50} address={shippingAddress} onPay={() => navigateWithLoading('checkout_summary')} onBack={() => navigateWithLoading('checkout_shipping')} /> : null;
      case 'checkout_summary': return finalOrder ? <SummaryPage order={finalOrder} onDone={() => navigateWithLoading('home')} /> : <div className="text-center py-20">Payment Processing...</div>;
      case 'checkout_cart': return <Cart onBack={() => navigateWithLoading('home')} onCheckout={() => navigateWithLoading('checkout_shipping')} onCartChange={setCartCount} userCountry={user?.country} />;
      case 'admin_dashboard': 
        if (user?.role === 'admin') return <AdminDashboard user={user} onBack={() => navigateWithLoading('home')} onNavigateProduct={(p) => navigateWithLoading('product_details', p)} />;
        if (user?.role === 'seller') return <SellerDashboard user={user} onLogout={handleLogout} onBack={() => navigateWithLoading('home')} />;
        return null;
      case 'home':
      default:
        return (
          <>
            <HeroCarousel />
            <CategoryBar onCategorySelect={handleCategorySelect} activeCategory={activeCategory} />
            <HomeSearch onSearch={handleSearch} />
            <section className="home-section-bg py-10 min-h-[60vh]">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {isProductsLoading ? Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />) : filteredProducts.map(p => <ProductCard key={p.id} product={p} onClick={(p) => navigateWithLoading('product_details', p)} />)}
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      {isGlobalLoading && <LoadingScreen />}
      {currentView !== 'admin_dashboard' && (
        <Header onLogoClick={() => navigateWithLoading('home')} onAuthClick={() => navigateWithLoading('login')} onLogout={handleLogout} onNavigate={navigateWithLoading} onSearch={handleSearch} user={user} cartCount={cartCount} isSellerView={['sellers_landing', 'sellers_login', 'sellers_signup'].includes(currentView)} />
      )}
      <main className="flex-grow">{renderView()}</main>
      {currentView !== 'admin_dashboard' && <Footer onNavigate={navigateWithLoading} />}
    </div>
  );
};

export default App;