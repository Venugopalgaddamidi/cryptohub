import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import CoinDetails from './pages/CoinDetails';
import Trending from './pages/Trending';
import Watchlist from './pages/Watchlist';
import Portfolio from './pages/Portfolio';
import Categories from './pages/Categories';
import Exchanges from './pages/Exchanges';
import Settings from './pages/Settings';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
        <div className="app__layout">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/coin/:id" element={<CoinDetails />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/exchanges" element={<Exchanges />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
            <Footer />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
