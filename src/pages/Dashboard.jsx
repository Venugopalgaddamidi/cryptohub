import { useState, useEffect, useCallback } from 'react';
import { getMarkets, getGlobalData, getTrending } from '../services/coinGeckoApi';
import { getTopGainers, getTopLosers } from '../utils/calculations';
import { useCurrency } from '../context/CurrencyContext';
import MarketStats from '../components/MarketStats';
import CoinTable from '../components/CoinTable';
import TrendingCoins from '../components/TrendingCoins';
import TopGainers from '../components/TopGainers';
import TopLosers from '../components/TopLosers';
import { SkeletonStat, SkeletonCard } from '../components/Skeleton';
import ErrorMessage from '../components/ErrorMessage';

export default function Dashboard() {
  const { getApiCurrency } = useCurrency();
  const [globalData, setGlobalData] = useState(null);
  const [coins, setCoins] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const curr = getApiCurrency();
      const [g, m, t] = await Promise.all([
        getGlobalData(),
        getMarkets({ currency: curr, perPage: 100 }),
        getTrending(),
      ]);
      setGlobalData(g);
      setCoins(m);
      setTrending(t.coins || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getApiCurrency]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  const gainers = getTopGainers(coins, 5);
  const losers = getTopLosers(coins, 5);

  return (
    <div className="page dashboard">
      <div className="dashboard__hero">
        <h1 className="dashboard__title">CryptoHub</h1>
        <p className="dashboard__subtitle">Track the crypto market in real time</p>
      </div>

      <section className="dashboard__section">
        {loading ? (
          <div className="market-stats"><SkeletonStat /><SkeletonStat /><SkeletonStat /><SkeletonStat /></div>
        ) : (
          <MarketStats data={globalData} />
        )}
      </section>

      <section className="dashboard__section">
        <h2 className="section-title">Trending Coins</h2>
        {loading ? (
          <div className="trending-coins">
            {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <TrendingCoins coins={trending} />
        )}
      </section>

      <div className="dashboard__columns">
        <section className="dashboard__section dashboard__section--half">
          <h2 className="section-title">Top Gainers (24h)</h2>
          {loading ? (
            <div className="top-list">
              {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <TopGainers coins={gainers} />
          )}
        </section>
        <section className="dashboard__section dashboard__section--half">
          <h2 className="section-title">Top Losers (24h)</h2>
          {loading ? (
            <div className="top-list">
              {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <TopLosers coins={losers} />
          )}
        </section>
      </div>

      <section className="dashboard__section">
        <h2 className="section-title">Market Overview</h2>
        {loading ? null : <CoinTable coins={coins.slice(0, 20)} />}
      </section>
    </div>
  );
}
