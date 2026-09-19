import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const PERIODS = [
  { label: '1D', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 },
  { label: 'MAX', days: 'max' },
];

const CUTOFFS = { '1D': 1, '7D': 7, '30D': 30, '90D': 90, '1Y': 365 };

const DATA_TYPES = [
  { key: 'prices', label: 'Price' },
  { key: 'market_caps', label: 'Market Cap' },
  { key: 'total_volumes', label: 'Volume' },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const formatted = val >= 1e9
    ? `$${(val / 1e9).toFixed(2)}B`
    : val >= 1e6
    ? `$${(val / 1e6).toFixed(2)}M`
    : val >= 1
    ? `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${val.toFixed(6)}`;

  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip__date">{label}</span>
      <span className="chart-tooltip__val">{formatted}</span>
    </div>
  );
}

export default function PriceChart({ data }) {
  const [period, setPeriod] = useState('7D');
  const [dataType, setDataType] = useState('prices');

  const chartData = useMemo(() => {
    const raw = data?.[dataType] || [];
    const days = CUTOFFS[period];
    if (days == null) return raw;
    const dayMs = 86400000;
    return raw.filter(([t]) => t >= (Date.now() - days * dayMs));
  }, [data, dataType, period]);

  const formattedData = useMemo(
    () =>
      chartData.map(([t, v]) => ({
        time: new Date(t).toLocaleDateString(),
        value: v,
      })),
    [chartData]
  );

  const gradientId = `gradient-${dataType}`;
  const color =
    dataType === 'prices' ? 'var(--accent-color)' :
    dataType === 'market_caps' ? 'var(--info-color)' :
    'var(--warning-color)';

  return (
    <div className="price-chart">
      <div className="price-chart__controls">
        <div className="price-chart__tabs">
          {PERIODS.map((p) => (
            <button
              key={p.label}
              className={`price-chart__tab ${period === p.label ? 'price-chart__tab--active' : ''}`}
              onClick={() => setPeriod(p.label)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="price-chart__types">
          {DATA_TYPES.map((dt) => (
            <button
              key={dt.key}
              className={`price-chart__type ${dataType === dt.key ? 'price-chart__type--active' : ''}`}
              onClick={() => setDataType(dt.key)}
            >
              {dt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="price-chart__container">
        {formattedData.length === 0 ? (
          <div className="price-chart__empty">No chart data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="time" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <Tooltip content={<CustomTooltip type={dataType} />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
