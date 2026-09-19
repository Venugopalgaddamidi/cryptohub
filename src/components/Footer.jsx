import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">&#x25C8; CryptoHub</span>
          <p className="footer__tagline">Cryptocurrency market intelligence dashboard</p>
        </div>
        <div className="footer__links">
          <Link to="/">Dashboard</Link>
          <Link to="/markets">Markets</Link>
          <Link to="/trending">Trending</Link>
          <Link to="/watchlist">Watchlist</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/exchanges">Exchanges</Link>
        </div>
        <div className="footer__credit">
          <p>Market data provided by <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer">CoinGecko</a></p>
          <p className="footer__copy">&copy; {new Date().getFullYear()} CryptoHub. For educational purposes.</p>
        </div>
      </div>
    </footer>
  );
}
