export function calculateROI(currentValue, investment) {
  if (!investment || investment === 0) return 0;
  return ((currentValue - investment) / investment) * 100;
}

export function calculateProfitLoss(currentValue, investment) {
  return currentValue - investment;
}

export function getTopGainers(coins, limit = 5) {
  return [...coins]
    .filter((c) => c.price_change_percentage_24h != null)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, limit);
}

export function getTopLosers(coins, limit = 5) {
  return [...coins]
    .filter((c) => c.price_change_percentage_24h != null)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, limit);
}

export function paginate(array, page, perPage) {
  const start = (page - 1) * perPage;
  return array.slice(start, start + perPage);
}

export function totalPages(total, perPage) {
  return Math.ceil(total / perPage);
}
