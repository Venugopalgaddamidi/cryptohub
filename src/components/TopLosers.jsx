import { formatCurrency } from '../utils/formatCurrency';
import { useCurrency } from '../context/CurrencyContext';
import { Link } from 'react-router-dom';

export default function TopLosers({ coins }) {
  const { currency } = useCurrency();
  if (!coins || coins.length === 0) return null;

  return (
    <div className="top-list top-list--losers">
      {coins.map((coin) => (
        <Link key={coin.id} to={`/coin/${coin.id}`} className="top-list__item">
          <img src={coin.image} alt={coin.name} className="top-list__img" />
          <div className="top-list__info">
            <span className="top-list__name">{coin.name}</span>
            <span className="top-list__symbol">{coin.symbol?.toUpperCase()}</span>
          </div>
          <div className="top-list__right">
            <span className="top-list__price">{formatCurrency(coin.current_price, currency)}</span>
            <span className="top-list__change negative">
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
