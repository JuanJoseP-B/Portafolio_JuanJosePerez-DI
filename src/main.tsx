import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/index.css';

const root = createRoot(document.getElementById('root')!);

if (window.location.pathname === '/__pages') {
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
  void import('./App').then(({ default: App }) =>
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
  );
}
