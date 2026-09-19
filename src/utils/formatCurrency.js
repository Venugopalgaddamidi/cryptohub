const SYMBOLS = { USD: '$', INR: '₹', EUR: '€', GBP: '£' };

function toNumber(value) {
  if (value == null || value === '') return NaN;
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : NaN;
}

export function formatCurrency(value, currency = 'USD') {
  const num = toNumber(value);
  if (Number.isNaN(num)) return '—';
  const symbol = SYMBOLS[currency] || '$';
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (abs >= 1e12) return `${sign}${symbol}${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}${symbol}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${symbol}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}${symbol}${(abs / 1e3).toFixed(2)}K`;
  if (abs >= 1) return `${sign}${symbol}${abs.toFixed(2)}`;
  if (abs >= 0.01) return `${sign}${symbol}${abs.toFixed(4)}`;
  return `${sign}${symbol}${abs.toFixed(8)}`;
}

export function formatNumber(value) {
  const num = toNumber(value);
  if (Number.isNaN(num)) return '—';
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  if (abs >= 1e12) return `${sign}${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(2)}K`;
  return `${sign}${abs.toLocaleString('en-US')}`;
}

export function formatPercent(value) {
  const num = toNumber(value);
  if (Number.isNaN(num)) return '—';
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

export function formatPrice(value) {
  const num = toNumber(value);
  if (Number.isNaN(num)) return '—';
  if (num >= 1) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (num >= 0.01) return num.toFixed(4);
  return num.toFixed(8);
}
