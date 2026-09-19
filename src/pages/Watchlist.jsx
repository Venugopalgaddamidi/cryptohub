import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getMarkets } from '../services/coinGeckoApi';
import { useWatchlist } from '../context/WatchlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency, formatPercent } from '../utils/formatCurrency';
import ErrorMessage from '../components/ErrorMessage';

export default function Watchlist() {
  const { watchlist, toggleWatch } = useWatchlist();
  const { currency, getApiCurrency } = useCurrency();
  const [coins, setCoins] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (watchlist.length === 0) {
      setCoins([]);
      return;
    }
    setError(null);
    try {
      const data = await getMarkets({ currency: getApiCurrency(), perPage: 250, page: 1 });
      const filtered = data.filter((c) => watchlist.includes(c.id));
      setCoins(filtered);
    } catch (err) {
      setError(err.message);
    }
  }, [watchlist, getApiCurrency]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div className="page watchlist-page">
      <h1 className="page-title">Watchlist</h1>
      <p className="page-desc">Your favorite cryptocurrencies</p>

      {watchlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">&#9734;</div>
          <h3>Your watchlist is empty</h3>
          <p>Start adding coins by clicking the star icon on any coin.</p>
          <Link to="/markets" className="btn btn--primary">Explore Markets</Link>
        </div>
      ) : (
        <div className="watchlist-table">
          <table className="coin-table">
            <thead>
              <tr>
                <th>Coin</th>
                <th>Price</th>
                <th>24h Change</th>
                <th>Market Cap</th>
                <th>Volume</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => {
                const pct = coin.price_change_percentage_24h;
                return (
                  <tr key={coin.id}>
                    <td>
                      <Link to={`/coin/${coin.id}`} className="coin-table__coin">
                        <img src={coin.image} alt={coin.name} className="coin-table__img" />
                        <span className="coin-table__name">{coin.name}</span>
                        <span className="coin-table__symbol">{coin.symbol?.toUpperCase()}</span>
                      </Link>
                    </td>
                    <td>{formatCurrency(coin.current_price, currency)}</td>
                    <td>
                      <span className={(pct ?? 0) >= 0 ? 'positive' : 'negative'}>
                        {formatPercent(pct)}
                      </span>
                    </td>
                    <td>{formatCurrency(coin.market_cap, currency)}</td>
                    <td>{formatCurrency(coin.total_volume, currency)}</td>
                    <td>
                      <button className="btn btn--danger btn--small" onClick={() => toggleWatch(coin.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
