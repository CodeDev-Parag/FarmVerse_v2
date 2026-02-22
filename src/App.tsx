import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { MandiTicker } from './components/MandiTicker';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { FarmerLogin } from './pages/FarmerLogin';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { Checkout } from './pages/Checkout';
import { Cart } from './components/Cart';

import { Placeholder } from './pages/Placeholder';
import { CategoryPage } from './pages/CategoryPage';
import { ConsumerLogin } from './pages/ConsumerLogin';
import { AboutUs, HowItWorks, FarmerDirectory, GovernmentSchemes, ContactUs, FAQ, TermsOfService } from './pages/FooterPages';
import { MyOrders } from './pages/MyOrders';
import { supabase } from './lib/supabase';
import { useStore } from './store/useStore';

function AuthListener() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useStore();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && !isAuthenticated) {
        const user = session.user;
        let role = user.user_metadata?.role;

        // In Google OAuth, metadata role is usually empty on the first sign in. 
        // We infer it based on the URL they were redirected back to after authentication.
        if (!role) {
          role = window.location.pathname.includes('farmer') ? 'farmer' : 'consumer';
          // Save this to Supabase so we know their role when they refresh the page tomorrow
          supabase.auth.updateUser({ data: { role } });
        }

        login(user.email || '', role);

        // Only explicitly navigate if they are stuck on a login page form
        if (window.location.pathname.includes('/login')) {
          if (role === 'farmer') {
            navigate('/farmer/dashboard', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [login, navigate, isAuthenticated]);

  return null;
}

export default function App() {
  return (
    <Router>
      <AuthListener />
      <main className="min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Fixed Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
          <MandiTicker />
        </div>
        {/* Spacer to prevent content from hiding behind fixed navbar */}
        <div className="h-[120px]" />
        <Cart />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/farmer/login" element={<FarmerLogin />} />
          <Route path="/consumer/login" element={<ConsumerLogin />} />
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/supplies/:categoryName" element={<CategoryPage />} />

          {/* Quick Links & Footer Routes */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/directory" element={<FarmerDirectory />} />
          <Route path="/schemes" element={<GovernmentSchemes />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/api" element={<Placeholder />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
        <Footer />
      </main>
    </Router>
  );
}
