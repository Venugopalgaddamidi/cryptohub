import { useState, useEffect, useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import { getMarkets } from '../services/coinGeckoApi';
import { useCurrency } from '../context/CurrencyContext';
import { getStorage, setStorage } from '../utils/storage';
import { formatCurrency, formatPercent } from '../utils/formatCurrency';
import { calculateROI, calculateProfitLoss } from '../utils/calculations';

const COLORS = ['#00d4aa', '#6c5ce7', '#f7931a', '#e74c3c', '#0984e3', '#fdcb6e', '#e84393', '#00b894', '#d63031', '#a29bfe'];

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export default function Portfolio() {
  const { currency, getApiCurrency } = useCurrency();
  const [holdings, setHoldings] = useState(() => getStorage('portfolio', []));
  const [coinList, setCoinList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ coinId: '', quantity: '', buyPrice: '' });

  useEffect(() => {
    setStorage('portfolio', holdings);
  }, [holdings]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMarkets({ currency: getApiCurrency(), perPage: 200, page: 1 });
        setCoinList(data);
      } catch { /* silent */ }
    })();
  }, [getApiCurrency]);

  const openAdd = () => {
    setEditing(null);
    setForm({ coinId: '', quantity: '', buyPrice: '' });
    setModalOpen(true);
  };
  const openEdit = (h) => {
    setEditing(h.id);
    setForm({ coinId: h.coinId, quantity: String(h.quantity), buyPrice: String(h.buyPrice) });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const saveHolding = () => {
    if (!form.coinId || !form.quantity || !form.buyPrice) return;
    if (editing) {
      setHoldings((prev) =>
        prev.map((h) =>
          h.id === editing ? { ...h, coinId: form.coinId, quantity: parseFloat(form.quantity), buyPrice: parseFloat(form.buyPrice) } : h
        )
      );
    } else {
      setHoldings((prev) => [
        ...prev,
        { id: genId(), coinId: form.coinId, quantity: parseFloat(form.quantity), buyPrice: parseFloat(form.buyPrice) },
      ]);
    }
    closeModal();
  };

  const deleteHolding = (id) => setHoldings((prev) => prev.filter((h) => h.id !== id));

  const portfolio = useMemo(() => {
    return holdings.map((h) => {
      const coin = coinList.find((c) => c.id === h.coinId);
      const currentPrice = coin?.current_price || 0;
      const investment = h.quantity * h.buyPrice;
      const currentValue = h.quantity * currentPrice;
      const pl = calculateProfitLoss(currentValue, investment);
      const roi = calculateROI(currentValue, investment);
      return { ...h, coin, currentPrice, investment, currentValue, pl, roi };
    });
  }, [holdings, coinList]);

  const totals = useMemo(() => {
    const investment = portfolio.reduce((s, h) => s + h.investment, 0);
    const current = portfolio.reduce((s, h) => s + h.currentValue, 0);
    const pl = current - investment;
    const roi = investment > 0 ? (pl / investment) * 100 : 0;
    return { investment, current, pl, roi };
  }, [portfolio]);

  const pieData = useMemo(() => {
    return portfolio
      .filter((h) => h.currentValue > 0)
      .map((h, i) => ({
        name: h.coin?.name || h.coinId,
        value: h.currentValue,
        color: COLORS[i % COLORS.length],
      }));
  }, [portfolio]);

  const selectedCoin = coinList.find((c) => c.id === form.coinId);

  return (
    <div className="page portfolio-page">
      <div className="portfolio-page__header">
        <h1 className="page-title">Portfolio</h1>
        <button className="btn btn--primary" onClick={openAdd}>+ Add Holding</button>
      </div>

      <div className="portfolio-summary">
        {[
          { label: 'Total Investment', value: formatCurrency(totals.investment, currency) },
          { label: 'Current Value', value: formatCurrency(totals.current, currency) },
          { label: 'Total Profit/Loss', value: formatCurrency(totals.pl, currency), cls: totals.pl >= 0 ? 'positive' : 'negative' },
          { label: 'ROI', value: formatPercent(totals.roi), cls: totals.roi >= 0 ? 'positive' : 'negative' },
        ].map((s) => (
          <div key={s.label} className="portfolio-summary__card">
            <span className="portfolio-summary__label">{s.label}</span>
            <span className={`portfolio-summary__value ${s.cls || ''}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {pieData.length > 0 && (
        <div className="portfolio-chart">
          <h2 className="section-title">Allocation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v, currency)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {holdings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">&#128200;</div>
          <h3>Your portfolio is empty</h3>
          <p>Add your first holding to start tracking.</p>
          <button className="btn btn--primary" onClick={openAdd}>+ Add Holding</button>
        </div>
      ) : (
        <div className="portfolio-table-wrap">
          <table className="coin-table">
            <thead>
              <tr>
                <th>Coin</th>
                <th>Quantity</th>
                <th>Buy Price</th>
                <th>Current Price</th>
                <th>Investment</th>
                <th>Current Value</th>
                <th>Profit/Loss</th>
                <th>ROI</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((h) => (
                <tr key={h.id}>
                  <td>
                    {h.coin ? (
                      <span className="coin-table__coin">
                        <img src={h.coin.image} alt="" className="coin-table__img" />
                        <span className="coin-table__name">{h.coin.name}</span>
                      </span>
                    ) : h.coinId}
                  </td>
                  <td>{h.quantity}</td>
                  <td>{formatCurrency(h.buyPrice, currency)}</td>
                  <td>{formatCurrency(h.currentPrice, currency)}</td>
                  <td>{formatCurrency(h.investment, currency)}</td>
                  <td>{formatCurrency(h.currentValue, currency)}</td>
                  <td className={h.pl >= 0 ? 'positive' : 'negative'}>{formatCurrency(h.pl, currency)}</td>
                  <td className={h.roi >= 0 ? 'positive' : 'negative'}>{formatPercent(h.roi)}</td>
                  <td className="coin-table__actions">
                    <button className="btn btn--outline btn--small" onClick={() => openEdit(h)}>Edit</button>
                    <button className="btn btn--danger btn--small" onClick={() => deleteHolding(h.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">{editing ? 'Edit Holding' : 'Add Holding'}</h2>
            <div className="modal__form">
              <label className="modal__label">
                Coin
                <select className="modal__select" value={form.coinId} onChange={(e) => setForm({ ...form, coinId: e.target.value })}>
                  <option value="">Select a coin</option>
                  {coinList.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>
                  ))}
                </select>
              </label>
              {selectedCoin && (
                <p className="modal__hint">Current price: {formatCurrency(selectedCoin.current_price, currency)}</p>
              )}
              <label className="modal__label">
                Quantity
                <input className="modal__input" type="number" step="any" placeholder="0.00" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </label>
              <label className="modal__label">
                Buy Price (per coin in {currency})
                <input className="modal__input" type="number" step="any" placeholder="0.00" value={form.buyPrice} onChange={(e) => setForm({ ...form, buyPrice: e.target.value })} />
              </label>
              <div className="modal__actions">
                <button className="btn btn--outline" onClick={closeModal}>Cancel</button>
                <button className="btn btn--primary" onClick={saveHolding}>{editing ? 'Save' : 'Add'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
