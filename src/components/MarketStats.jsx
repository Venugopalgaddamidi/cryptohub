import { formatCurrency } from '../utils/formatCurrency';
import { useCurrency } from '../context/CurrencyContext';

export default function MarketStats({ data }) {
  const { currency } = useCurrency();
  if (!data) return null;

  const stats = [
    {
      label: 'Total Market Cap',
      value: formatCurrency(data.total_market_cap?.[currency.toLowerCase()], currency),
      color: 'var(--accent-color)',
    },
    {
      label: '24h Volume',
      value: formatCurrency(data.total_volume?.[currency.toLowerCase()], currency),
      color: 'var(--info-color)',
    },
    {
      label: 'BTC Dominance',
      value: data.market_cap_percentage?.btc ? `${data.market_cap_percentage.btc.toFixed(1)}%` : '—',
      color: '#f7931a',
    },
    {
      label: 'Active Cryptos',
      value: data.active_cryptocurrencies?.toLocaleString() || '—',
      color: 'var(--success-color)',
    },
  ];

  return (
    <div className="market-stats">
      {stats.map((s) => (
        <div key={s.label} className="market-stats__card">
          <div className="market-stats__bar" style={{ background: s.color }} />
          <div className="market-stats__content">
            <span className="market-stats__label">{s.label}</span>
            <span className="market-stats__value">{s.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
