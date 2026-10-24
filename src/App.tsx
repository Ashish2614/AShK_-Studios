import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { CheckoutSuccess } from './pages/CheckoutSuccess';
import { CheckoutFailure } from './pages/CheckoutFailure';
import { CheckoutCancelled } from './pages/CheckoutCancelled';
import { Contact } from './pages/Contact';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { RefundPolicy } from './pages/RefundPolicy';
import { Resume } from './pages/Resume';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1F2421]">
          <Navbar />
          <CartDrawer />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/failure" element={<CheckoutFailure />} />
              <Route path="/checkout/cancelled" element={<CheckoutCancelled />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/resume" element={<Resume />} />
              <Route
                path="*"
                element={
                  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
                    <h1 className="font-serif text-3xl font-bold text-[#1B3B2B] mb-2">Page Not Found</h1>
                    <p className="text-sm text-[#6B7280] mb-6">The page you are looking for does not exist.</p>
                    <a href="/" className="px-5 py-2.5 bg-[#1B3B2B] text-[#FBF9F5] rounded-md text-xs font-semibold hover:bg-[#2A563F]">
                      Return Home
                    </a>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
