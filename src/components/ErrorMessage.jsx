export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message">
      <div className="error-message__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <h3 className="error-message__title">Something went wrong</h3>
      <p className="error-message__text">{message || 'Unable to load data. Please try again.'}</p>
      {onRetry && (
        <button className="btn btn--primary error-message__retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
