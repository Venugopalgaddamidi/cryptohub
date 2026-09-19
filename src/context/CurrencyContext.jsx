import { createContext, useContext, useState, useEffect } from 'react';
import { getStorage, setStorage } from '../utils/storage';

const CurrencyContext = createContext();

const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP'];
const CURRENCY_MAP = { USD: 'usd', INR: 'inr', EUR: 'eur', GBP: 'gbp' };

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => getStorage('currency', 'USD'));

  useEffect(() => {
    setStorage('currency', currency);
  }, [currency]);

  const getApiCurrency = () => CURRENCY_MAP[currency] || 'usd';

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, getApiCurrency, CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
