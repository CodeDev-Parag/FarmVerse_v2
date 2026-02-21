import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <Router>
      <main className="min-h-screen flex flex-col relative overflow-x-hidden">
        <Header />
        <Cart />
        <MandiTicker />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/farmer/login" element={<FarmerLogin />} />
          <Route path="/consumer/login" element={<ConsumerLogin />} />
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
          <Route path="/checkout" element={<Checkout />} />
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
