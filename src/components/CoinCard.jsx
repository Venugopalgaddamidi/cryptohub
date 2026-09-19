import { Link } from 'react-router-dom';
import { formatCurrency, formatPercent } from '../utils/formatCurrency';
import { useCurrency } from '../context/CurrencyContext';
import { useWatchlist } from '../context/WatchlistContext';

export default function CoinCard({ coin }) {
  const { currency } = useCurrency();
  const { toggleWatch, isWatching } = useWatchlist();
  const pct = coin.price_change_percentage_24h;
  const cls = pct >= 0 ? 'positive' : 'negative';

  return (
    <div className={`coin-card ${cls}`}>
      <div className="coin-card__top">
        <Link to={`/coin/${coin.id}`} className="coin-card__link">
          <img src={coin.image} alt={coin.name} className="coin-card__img" />
          <div className="coin-card__meta">
            <span className="coin-card__name">{coin.name}</span>
            <span className="coin-card__symbol">{coin.symbol?.toUpperCase()}</span>
          </div>
        </Link>
        <button
          className={`coin-card__star ${isWatching(coin.id) ? 'coin-card__star--active' : ''}`}
          onClick={() => toggleWatch(coin.id)}
          aria-label="Toggle watchlist"
        >
          {isWatching(coin.id) ? '\u2605' : '\u2606'}
        </button>
      </div>
      <div className="coin-card__bottom">
        <span className="coin-card__price">{formatCurrency(coin.current_price, currency)}</span>
        <span className={`coin-card__change ${cls}`}>{formatPercent(pct)}</span>
      </div>
    </div>
  );
}
