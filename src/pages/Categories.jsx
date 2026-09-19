import { useState, useEffect, useCallback } from 'react';
import { getCategories, getMarketsByCategory } from '../services/coinGeckoApi';
import { formatCurrency, formatPercent } from '../utils/formatCurrency';
import { useCurrency } from '../context/CurrencyContext';
import CoinTable from '../components/CoinTable';
import { SkeletonCard } from '../components/Skeleton';
import ErrorMessage from '../components/ErrorMessage';

export default function Categories() {
  const { currency, getApiCurrency } = useCurrency();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [catCoins, setCatCoins] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const fetchCategoryCoins = useCallback(async (catId) => {
    setCatLoading(true);
    setCatError(null);
    try {
      const data = await getMarketsByCategory({
        currency: getApiCurrency(),
        category: catId,
        perPage: 50,
      });
      setCatCoins(data);
    } catch (err) {
      setCatError(err.message);
    } finally {
      setCatLoading(false);
    }
  }, [getApiCurrency]);

  useEffect(() => {
    if (selected) {
      fetchCategoryCoins(selected);
    } else {
      setCatCoins([]);
    }
  }, [selected, fetchCategoryCoins]);

  if (error) return <ErrorMessage message={error} onRetry={fetchCategories} />;

  const selectedCat = categories.find((c) => c.id === selected);

  return (
    <div className="page categories-page">
      <h1 className="page-title">Categories</h1>
      <p className="page-desc">Browse cryptocurrency categories and sectors</p>

      {selected && (
        <div className="categories__selected">
          <button className="btn btn--outline" onClick={() => setSelected(null)}>&larr; All Categories</button>
          <h2 className="section-title">{selectedCat?.name || selected}</h2>
          {selectedCat && (
            <div className="categories__stats-bar">
              {selectedCat.data?.market_cap != null && (
                <span className="categories__stat">
                  MCap: {formatCurrency(selectedCat.data.market_cap, currency)}
                </span>
              )}
              {selectedCat.coins_count != null && (
                <span className="categories__stat">{selectedCat.coins_count} coins</span>
              )}
              {selectedCat.data?.market_cap_change_24h != null && (
                <span className={`categories__stat ${
                  selectedCat.data.market_cap_change_24h >= 0 ? 'positive' : 'negative'
                }`}>
                  24h: {formatPercent(selectedCat.data.market_cap_change_24h)}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="categories-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : !selected ? (
        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => setSelected(cat.id)}
            >
              <h3 className="category-card__name">{cat.name}</h3>
              <div className="category-card__stats">
                <span className="category-card__coins">{cat.coins_count} coins</span>
                {cat.data?.market_cap != null && (
                  <span className="category-card__mcap">
                    MCap: {formatCurrency(cat.data.market_cap, currency)}
                  </span>
                )}
              </div>
              {cat.data?.market_cap_change_24h != null && (
                <span
                  className={`category-card__change ${
                    cat.data.market_cap_change_24h >= 0 ? 'positive' : 'negative'
                  }`}
                >
                  {formatPercent(cat.data.market_cap_change_24h)}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="categories__coins">
          {catLoading ? (
            <div className="loading">
              <div className="loading__spinner" />
              <span className="loading__text">Loading coins...</span>
            </div>
          ) : catError ? (
            <ErrorMessage message={catError} onRetry={() => fetchCategoryCoins(selected)} />
          ) : catCoins.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">&#128269;</div>
              <h3>No coins found</h3>
              <p>This category has no coins to display.</p>
            </div>
          ) : (
            <CoinTable coins={catCoins} />
          )}
        </div>
      )}
    </div>
  );
}
