import { useState, useEffect, useMemo, useCallback } from 'react';
import { getMarkets } from '../services/coinGeckoApi';
import { paginate, totalPages } from '../utils/calculations';
import { useCurrency } from '../context/CurrencyContext';
import CoinTable from '../components/CoinTable';
import { SkeletonTable } from '../components/Skeleton';
import ErrorMessage from '../components/ErrorMessage';

export default function Markets() {
  const { getApiCurrency } = useCurrency();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_desc');
  const [filter, setFilter] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMarkets({ currency: getApiCurrency(), perPage: 250, page: 1 });
      setCoins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getApiCurrency]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    let list = [...coins];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      );
    }

    if (filter === 'gainers') list = list.filter((c) => (c.price_change_percentage_24h ?? 0) > 0);
    if (filter === 'losers') list = list.filter((c) => (c.price_change_percentage_24h ?? 0) < 0);

    const [field, dir] = sortBy.split('_');
    list.sort((a, b) => {
      let va = a[field] ?? 0;
      let vb = b[field] ?? 0;
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [coins, search, sortBy, filter]);

  const paginated = useMemo(() => paginate(filtered, page, perPage), [filtered, page, perPage]);
  const pages = useMemo(() => totalPages(filtered.length, perPage), [filtered, perPage]);

  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div className="page markets">
      <h1 className="page-title">Markets</h1>
      <div className="markets__controls">
        <input
          className="markets__search"
          type="text"
          placeholder="Search coins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="markets__select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="market_cap_desc">Market Cap (High to Low)</option>
          <option value="market_cap_asc">Market Cap (Low to High)</option>
          <option value="current_price_desc">Price (High to Low)</option>
          <option value="current_price_asc">Price (Low to High)</option>
          <option value="price_change_percentage_24h_desc">24h Change (High to Low)</option>
          <option value="price_change_percentage_24h_asc">24h Change (Low to High)</option>
          <option value="total_volume_desc">Volume (High to Low)</option>
          <option value="total_volume_asc">Volume (Low to High)</option>
        </select>
        <select className="markets__select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="gainers">Gainers Only</option>
          <option value="losers">Losers Only</option>
        </select>
        <select className="markets__select" value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
          <option value={10}>10 / page</option>
          <option value={25}>25 / page</option>
          <option value={50}>50 / page</option>
          <option value={100}>100 / page</option>
        </select>
      </div>
      <div className="markets__info">
        <span>Showing {filtered.length} coins</span>
      </div>
      {loading ? <SkeletonTable rows={10} /> : <CoinTable coins={paginated} />}
      {pages > 1 && (
        <div className="pagination">
          <button className="pagination__btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            &laquo; Prev
          </button>
          <span className="pagination__info">Page {page} of {pages}</span>
          <button className="pagination__btn" disabled={page >= pages} onClick={() => setPage(page + 1)}>
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
}
