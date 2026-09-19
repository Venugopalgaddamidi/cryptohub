import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useWatchlist } from '../context/WatchlistContext';
import { setStorage } from '../utils/storage';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency, CURRENCIES } = useCurrency();
  const { clearWatchlist } = useWatchlist();

  const clearPortfolio = () => {
    setStorage('portfolio', []);
    window.location.reload();
  };

  const resetAll = () => {
    clearWatchlist();
    clearPortfolio();
    setTheme('dark');
    setCurrency('USD');
    window.location.reload();
  };

  return (
    <div className="page settings-page">
      <h1 className="page-title">Settings</h1>
      <p className="page-desc">Customize your CryptoHub experience</p>

      <div className="settings-section">
        <h2 className="section-title">Appearance</h2>
        <div className="settings-row">
          <span className="settings-row__label">Theme</span>
          <div className="settings-row__control">
            <button
              className={`btn btn--toggle ${theme === 'dark' ? 'btn--toggle--active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
            <button
              className={`btn btn--toggle ${theme === 'light' ? 'btn--toggle--active' : ''}`}
              onClick={() => setTheme('light')}
            >
              Light
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="section-title">Currency</h2>
        <div className="settings-row">
          <span className="settings-row__label">Display Currency</span>
          <select className="settings-row__select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="section-title">Data</h2>
        <div className="settings-row">
          <span className="settings-row__label">Clear Watchlist</span>
          <button className="btn btn--danger btn--small" onClick={clearWatchlist}>Clear</button>
        </div>
        <div className="settings-row">
          <span className="settings-row__label">Clear Portfolio</span>
          <button className="btn btn--danger btn--small" onClick={clearPortfolio}>Clear</button>
        </div>
        <div className="settings-row">
          <span className="settings-row__label">Reset All Settings</span>
          <button className="btn btn--danger btn--small" onClick={resetAll}>Reset</button>
        </div>
      </div>
    </div>
  );
}
