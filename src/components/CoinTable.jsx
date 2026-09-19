import { Link } from 'react-router-dom';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatCurrency';
import { useCurrency } from '../context/CurrencyContext';
import { useWatchlist } from '../context/WatchlistContext';

export default function CoinTable({ coins, showActions = true }) {
  const { currency } = useCurrency();
  const { toggleWatch, isWatching } = useWatchlist();

  if (!coins || coins.length === 0) {
    return (
      <div className="empty-state">
        <p>No coins to display.</p>
      </div>
    );
  }

  return (
    <div className="coin-table-wrap">
      <table className="coin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Coin</th>
            <th>Price</th>
            <th>1h</th>
            <th>24h</th>
            <th>7d</th>
            <th>Market Cap</th>
            <th>Volume (24h)</th>
            <th>Circulating Supply</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => {
            const pct24 = coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h;
            const pct7d = coin.price_change_percentage_7d_in_currency;
            return (
              <tr key={coin.id}>
                <td>{coin.market_cap_rank}</td>
                <td>
                  <Link to={`/coin/${coin.id}`} className="coin-table__coin">
                    <img src={coin.image} alt={coin.name} className="coin-table__img" />
                    <span className="coin-table__name">{coin.name}</span>
                    <span className="coin-table__symbol">{coin.symbol?.toUpperCase()}</span>
                  </Link>
                </td>
                <td className="coin-table__price">{formatCurrency(coin.current_price, currency)}</td>
                <td>
                  <span className={pct24 >= 0 ? 'positive' : 'negative'}>{formatPercent(pct24)}</span>
                </td>
                <td>
                  <span className={(coin.price_change_percentage_24h ?? 0) >= 0 ? 'positive' : 'negative'}>
                    {formatPercent(coin.price_change_percentage_24h)}
                  </span>
                </td>
                <td>
                  <span className={(pct7d ?? 0) >= 0 ? 'positive' : 'negative'}>{formatPercent(pct7d)}</span>
                </td>
                <td>{formatCurrency(coin.market_cap, currency)}</td>
                <td>{formatCurrency(coin.total_volume, currency)}</td>
                <td>{formatNumber(coin.circulating_supply)} {coin.symbol?.toUpperCase()}</td>
                {showActions && (
                  <td className="coin-table__actions">
                    <button
                      className={`star-btn ${isWatching(coin.id) ? 'star-btn--active' : ''}`}
                      onClick={() => toggleWatch(coin.id)}
                    >
                      {isWatching(coin.id) ? '\u2605' : '\u2606'}
                    </button>
                    <Link to={`/coin/${coin.id}`} className="btn btn--small btn--primary">
                      View
                    </Link>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
