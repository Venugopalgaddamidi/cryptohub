import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { WatchlistProvider } from './context/WatchlistContext';
import './styles/main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <CurrencyProvider>
        <WatchlistProvider>
          <App />
        </WatchlistProvider>
      </CurrencyProvider>
    </ThemeProvider>
  </React.StrictMode>
);
