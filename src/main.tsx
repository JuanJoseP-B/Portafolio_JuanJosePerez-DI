import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useLanguage } from './store/useLanguage';
import './styles/tokens.css';
import './styles/index.css';

const root = createRoot(document.getElementById('root')!);

if (window.location.pathname === '/__pages') {
  document.documentElement.lang = new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'es';
  // Isolated face renderer used by `npm run pages:export`; not part of the public app.
  // Both branches use dynamic imports so this route never loads the 3D scene.
  void import('./pages-design').then(({ PageRoute }) =>
    root.render(
      <StrictMode>
        <PageRoute />
      </StrictMode>,
    ),
  );
} else {
  document.documentElement.lang = useLanguage.getState().lang;
  useLanguage.subscribe(({ lang }) => { document.documentElement.lang = lang; });
  void import('./App').then(({ default: App }) =>
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
  );
}
