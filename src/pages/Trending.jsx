import { useState, useEffect, useCallback } from 'react';
import { getTrending } from '../services/coinGeckoApi';
import TrendingCoins from '../components/TrendingCoins';
import { SkeletonCard } from '../components/Skeleton';
import ErrorMessage from '../components/ErrorMessage';

export default function Trending() {
  const [trending, setTrending] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTrending();
      setTrending(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div className="page trending-page">
      <h1 className="page-title">Trending</h1>
      <p className="page-desc">Trending coins searched by CoinGecko users in the last 24 hours</p>

      <section className="trending-page__section">
        <h2 className="section-title">Trending Coins</h2>
        {loading ? (
          <div className="trending-coins">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <TrendingCoins coins={trending?.coins || []} />
        )}
      </section>

      {trending?.nfts && trending.nfts.length > 0 && (
        <section className="trending-page__section">
          <h2 className="section-title">Trending NFTs</h2>
          <div className="trending-nfts">
            {trending.nfts.map((nft) => (
              <div key={nft.id} className="trending-nft">
                <img src={nft.thumb} alt={nft.name} className="trending-nft__img" />
                <div className="trending-nft__info">
                  <span className="trending-nft__name">{nft.name}</span>
                  <span className="trending-nft__symbol">{nft.symbol}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {trending?.categories && trending.categories.length > 0 && (
        <section className="trending-page__section">
          <h2 className="section-title">Trending Categories</h2>
          <div className="trending-categories">
            {trending.categories.map((cat, i) => (
              <div key={i} className="trending-category">
                <span className="trending-category__name">{cat.name}</span>
                <span className="trending-category__coins">{cat.coins_count} coins</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
