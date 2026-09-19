import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCoins } from '../services/coinGeckoApi';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const debouncedSearch = useCallback((q) => {
    clearTimeout(timerRef.current);
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const data = await searchCoins(q);
        setResults((data.coins || []).slice(0, 8));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, []);

  useEffect(() => {
    debouncedSearch(query);
    return () => clearTimeout(timerRef.current);
  }, [query, debouncedSearch]);

  const handleSelect = (id) => {
    setQuery('');
    setResults([]);
    setOpen(false);
    navigate(`/coin/${id}`);
  };

  return (
    <div className="search-bar" ref={ref}>
      <div className="search-bar__input-wrap">
        <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          className="search-bar__input"
          type="text"
          placeholder="Search coins..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query && setOpen(true)}
        />
        {query && (
          <button className="search-bar__clear" onClick={() => { setQuery(''); setResults([]); setOpen(false); }}>
            &times;
          </button>
        )}
      </div>
      {open && (query.trim().length > 0) && (
        <div className="search-bar__dropdown">
          {loading ? (
            <div className="search-bar__loading">Searching...</div>
          ) : results.length === 0 ? (
            <div className="search-bar__empty">No coins found</div>
          ) : (
            results.map((coin) => (
              <button key={coin.id} className="search-bar__item" onClick={() => handleSelect(coin.id)}>
                <img src={coin.thumb} alt={coin.name} className="search-bar__thumb" />
                <div className="search-bar__info">
                  <span className="search-bar__name">{coin.name}</span>
                  <span className="search-bar__symbol">{coin.symbol.toUpperCase()}</span>
                </div>
                <span className="search-bar__rank">#{coin.market_cap_rank || '—'}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
