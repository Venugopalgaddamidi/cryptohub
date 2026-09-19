export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton--circle" />
      <div className="skeleton skeleton--text skeleton--w60" />
      <div className="skeleton skeleton--text skeleton--w40" />
      <div className="skeleton skeleton--text skeleton--w80" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-table__row">
          <div className="skeleton skeleton--circle" />
          <div className="skeleton skeleton--text skeleton--w100" />
          <div className="skeleton skeleton--text skeleton--w60" />
          <div className="skeleton skeleton--text skeleton--w40" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="skeleton-stat">
      <div className="skeleton skeleton--text skeleton--w50" />
      <div className="skeleton skeleton--text skeleton--w70" />
    </div>
  );
}
