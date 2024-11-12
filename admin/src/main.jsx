// Override console.warn to hide specific warnings
const originalWarn = console.warn;

console.warn = (message, ...args) => {
  // Suppress the React Router future flag warning by filtering its specific content
  if (
    typeof message === 'string' &&
    message.includes('React Router Future Flag Warning:')
  ) {
    return;
  }

  // For other warnings, call the original console.warn
  originalWarn(message, ...args);
};

import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
