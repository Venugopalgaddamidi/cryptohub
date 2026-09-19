import { formatCurrency, formatPercent } from '../utils/formatCurrency';
import { useCurrency } from '../context/CurrencyContext';

export default function TrendingCoins({ coins }) {
  const { currency } = useCurrency();
  if (!coins || coins.length === 0) return null;

  return (
    <div className="trending-coins">
      {coins.map((item, i) => {
        const coin = item.item;
        const pct = coin.data?.price_change_percentage_24h;
        const cls = (pct ?? 0) >= 0 ? 'positive' : 'negative';
        return (
          <div key={coin.id} className="trending-coin">
            <div className="trending-coin__rank">#{i + 1}</div>
            <img src={coin.small} alt={coin.name} className="trending-coin__img" />
            <div className="trending-coin__info">
              <span className="trending-coin__name">{coin.name}</span>
              <span className="trending-coin__symbol">{coin.symbol}</span>
            </div>
            <div className="trending-coin__data">
              <span className="trending-coin__price">{formatCurrency(coin.data?.price, currency)}</span>
              {pct != null && <span className={`trending-coin__change ${cls}`}>{formatPercent(pct)}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
