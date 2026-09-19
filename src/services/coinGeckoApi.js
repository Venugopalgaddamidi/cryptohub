import axios from 'axios';

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
  params: API_KEY ? { x_cg_demo_api_key: API_KEY } : {},
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.status === 429
        ? 'Rate limit exceeded. Please wait and try again.'
        : err.response?.status === 404
        ? 'Resource not found.'
        : 'Network error. Please check your connection.';
    return Promise.reject(new Error(msg));
  }
);

export async function getMarkets({
  currency = 'usd',
  page = 1,
  perPage = 50,
  order = 'market_cap_desc',
} = {}) {
  const { data } = await api.get('/coins/markets', {
    params: {
      vs_currency: currency,
      order,
      per_page: perPage,
      page,
      sparkline: false,
      price_change_percentage: '1h,24h,7d',
    },
  });
  return data;
}

export async function getCoinDetails(id, currency = 'usd') {
  const { data } = await api.get(`/coins/${id}`, {
    params: {
      vs_currency: currency,
      localization: false,
      tickers: false,
      market_data: true,
      community_data: true,
      developer_data: false,
      sparkline: false,
    },
  });
  return data;
}

export async function getCoinMarketChart(id, currency = 'usd', days = 7) {
  const { data } = await api.get(`/coins/${id}/market_chart`, {
    params: { vs_currency: currency, days, interval: days <= 1 ? '' : 'daily' },
  });
  return data;
}

export async function getSimplePrice(ids, currencies = ['usd']) {
  const { data } = await api.get('/simple/price', {
    params: {
      ids: Array.isArray(ids) ? ids.join(',') : ids,
      vs_currencies: Array.isArray(currencies) ? currencies.join(',') : currencies,
      include_24hr_change: true,
      include_market_cap: true,
    },
  });
  return data;
}

export async function getTrending() {
  const { data } = await api.get('/search/trending');
  return data;
}

export async function searchCoins(query) {
  if (!query || query.trim().length === 0) return { coins: [] };
  const { data } = await api.get('/search', { params: { query } });
  return data;
}

export async function getGlobalData() {
  const { data } = await api.get('/global');
  return data.data;
}

export async function getCategories() {
  const { data } = await api.get('/coins/categories');
  return data;
}

export async function getMarketsByCategory({
  currency = 'usd',
  category,
  page = 1,
  perPage = 50,
} = {}) {
  const { data } = await api.get('/coins/markets', {
    params: {
      vs_currency: currency,
      category,
      order: 'market_cap_desc',
      per_page: perPage,
      page,
      sparkline: false,
      price_change_percentage: '1h,24h,7d',
    },
  });
  return data;
}

export async function getExchanges({ page = 1, perPage = 20 } = {}) {
  const { data } = await api.get('/exchanges', {
    params: { per_page: perPage, page },
  });
  return data;
}

export async function getExchangeById(id) {
  const { data } = await api.get(`/exchanges/${id}`);
  return data;
}
