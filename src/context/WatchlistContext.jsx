import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStorage, setStorage } from '../utils/storage';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => getStorage('watchlist', []));

  useEffect(() => {
    setStorage('watchlist', watchlist);
  }, [watchlist]);

  const toggleWatch = useCallback((coinId) => {
    setWatchlist((prev) =>
      prev.includes(coinId) ? prev.filter((id) => id !== coinId) : [...prev, coinId]
    );
  }, []);

  const isWatching = useCallback((coinId) => watchlist.includes(coinId), [watchlist]);

  const clearWatchlist = useCallback(() => setWatchlist([]), []);

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleWatch, isWatching, clearWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
