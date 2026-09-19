import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCoinDetails, getCoinMarketChart } from '../services/coinGeckoApi';
import { useCurrency } from '../context/CurrencyContext';
import { useWatchlist } from '../context/WatchlistContext';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatCurrency';
import PriceChart from '../components/PriceChart';
import ErrorMessage from '../components/ErrorMessage';
import { SkeletonStat } from '../components/Skeleton';

export default function CoinDetails() {
  const { id } = useParams();
  const { currency, getApiCurrency } = useCurrency();
  const { toggleWatch, isWatching } = useWatchlist();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const curr = getApiCurrency();
      const [details, chart] = await Promise.all([
        getCoinDetails(id, curr),
        getCoinMarketChart(id, curr, 7),
      ]);
      setCoin(details);
      setChartData(chart);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, getApiCurrency]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  if (loading) {
    return (
      <div className="page coin-details">
        <div className="coin-details__skeleton">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonStat key={i} />)}
        </div>
      </div>
    );
  }
  if (!coin) return <ErrorMessage message="Coin not found." />;

  const md = coin.market_data || {};
  const pct = md.price_change_percentage_24h;
  const cls = (pct ?? 0) >= 0 ? 'positive' : 'negative';

  const infoRows = [
    { label: 'Market Cap', value: formatCurrency(md.market_cap?.[currency.toLowerCase()], currency) },
    { label: '24h Volume', value: formatCurrency(md.total_volume?.[currency.toLowerCase()], currency) },
    { label: 'Circulating Supply', value: `${formatNumber(md.circulating_supply)} ${coin.symbol?.toUpperCase()}` },
    { label: 'Total Supply', value: md.total_supply ? `${formatNumber(md.total_supply)} ${coin.symbol?.toUpperCase()}` : 'N/A' },
    { label: 'Max Supply', value: md.maximum_supply ? `${formatNumber(md.maximum_supply)} ${coin.symbol?.toUpperCase()}` : 'N/A' },
    { label: 'ATH', value: `${formatCurrency(md.ath?.[currency.toLowerCase()], currency)} (${md.ath_date?.[currency.toLowerCase()]?.slice(0, 10) || '—'})` },
    { label: 'ATL', value: `${formatCurrency(md.atl?.[currency.toLowerCase()], currency)} (${md.atl_date?.[currency.toLowerCase()]?.slice(0, 10) || '—'})` },
    { label: 'Market Cap Rank', value: `#${coin.market_cap_rank || '—'}` },
  ];

  return (
    <div className="page coin-details">
      <div className="coin-details__header">
        <Link to="/markets" className="coin-details__back">&larr; Markets</Link>
        <div className="coin-details__title-row">
          <img src={coin.image?.large} alt={coin.name} className="coin-details__img" />
          <div>
            <h1 className="coin-details__name">
              {coin.name}
              <span className="coin-details__symbol">{coin.symbol?.toUpperCase()}</span>
            </h1>
            <span className="coin-details__rank">Rank #{coin.market_cap_rank || '—'}</span>
          </div>
          <button
            className={`btn btn--icon ${isWatching(coin.id) ? 'btn--watched' : ''}`}
            onClick={() => toggleWatch(coin.id)}
          >
            {isWatching(coin.id) ? '\u2605 Watching' : '\u2606 Add to Watchlist'}
          </button>
        </div>
        <div className="coin-details__price-row">
          <span className="coin-details__price">{formatCurrency(md.current_price?.[currency.toLowerCase()], currency)}</span>
          <span className={`coin-details__change ${cls}`}>{formatPercent(pct)}</span>
        </div>
      </div>

      <div className="coin-details__chart">
        <PriceChart data={chartData} />
      </div>

      <div className="coin-details__info">
        <h2 className="section-title">Market Information</h2>
        <div className="coin-details__grid">
          {infoRows.map((row) => (
            <div key={row.label} className="coin-details__item">
              <span className="coin-details__item-label">{row.label}</span>
              <span className="coin-details__item-value">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {coin.description?.en && (
        <div className="coin-details__desc">
          <h2 className="section-title">About {coin.name}</h2>
          <div
            className="coin-details__desc-content"
            dangerouslySetInnerHTML={{ __html: coin.description.en }}
          />
        </div>
      )}

      {(coin.links?.homepage?.[0] || coin.links?.blockchain_site?.[0]) && (
        <div className="coin-details__links">
          <h2 className="section-title">Links</h2>
          <div className="coin-details__link-list">
            {coin.links.homepage?.filter(Boolean).map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
                Website
              </a>
            ))}
            {coin.links.blockchain_site?.filter(Boolean).slice(0, 3).map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
                Explorer
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
