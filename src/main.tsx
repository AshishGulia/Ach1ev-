import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { initPwaSupport } from './utils/pwaInstall.ts';
import './index.css';

initPwaSupport();

// Apply saved user font family & size spectrum
try {
  const savedFont = localStorage.getItem('medden_app_font') || 'Plus Jakarta Sans';
  const savedScale = localStorage.getItem('medden_font_scale') || '100%';
  document.documentElement.style.setProperty('--app-font-family', `'${savedFont}', system-ui, -apple-system, sans-serif`);
  document.documentElement.style.setProperty('--app-font-scale', savedScale);
} catch {}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ErrorBoundary>
);
