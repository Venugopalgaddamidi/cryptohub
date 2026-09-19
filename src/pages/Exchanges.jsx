import { useState, useEffect, useCallback } from 'react';
import { getExchanges } from '../services/coinGeckoApi';
import { formatCurrency } from '../utils/formatCurrency';
import { useCurrency } from '../context/CurrencyContext';
import { SkeletonTable } from '../components/Skeleton';
import ErrorMessage from '../components/ErrorMessage';

export default function Exchanges() {
  const { currency } = useCurrency();
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExchanges({ page, perPage: 20 });
      setExchanges(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div className="page exchanges-page">
      <h1 className="page-title">Exchanges</h1>
      <p className="page-desc">Top cryptocurrency exchanges ranked by trust score and trading volume</p>

      {loading ? (
        <SkeletonTable rows={10} />
      ) : (
        <div className="coin-table-wrap">
          <table className="coin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Exchange</th>
                <th>Trust Score</th>
                <th>24h Volume</th>
                <th>Country</th>
                <th>Website</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.map((ex) => (
                <tr key={ex.id}>
                  <td>{ex.trust_score_rank}</td>
                  <td>
                    <span className="coin-table__coin">
                      <img src={ex.image} alt={ex.name} className="coin-table__img" />
                      <span className="coin-table__name">{ex.name}</span>
                    </span>
                  </td>
                  <td>
                    <span className={`trust-score trust-score--${ex.trust_score >= 8 ? 'high' : ex.trust_score >= 5 ? 'mid' : 'low'}`}>
                      {ex.trust_score}/10
                    </span>
                  </td>
                  <td>{formatCurrency(ex.trade_volume_24h_btc, currency)}</td>
                  <td>{ex.country || '—'}</td>
                  <td>
                    {ex.url ? (
                      <a href={ex.url} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--small">
                        Visit
                      </a>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button className="pagination__btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          &laquo; Prev
        </button>
        <span className="pagination__info">Page {page}</span>
        <button className="pagination__btn" onClick={() => setPage(page + 1)}>
          Next &raquo;
        </button>
      </div>
    </div>
  );
}
