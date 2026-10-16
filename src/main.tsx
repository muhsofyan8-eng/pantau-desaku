// Defensive guard for environments where window.fetch has only a getter on Window.prototype
if (typeof window !== 'undefined') {
  try {
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc || !desc.set) {
      let _fetch = window.fetch ? window.fetch.bind(window) : undefined;
      Object.defineProperty(window, 'fetch', {
        get() {
          return _fetch;
        },
        set(val) {
          _fetch = val;
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch {
    // Ignore if unconfigurable
  }
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
