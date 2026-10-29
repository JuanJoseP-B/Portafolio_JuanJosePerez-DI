# Fase 7 — Despliegue en Vercel

Estado: preparación lista; despliegue pendiente (lo hace el orquestador con la CLI de Vercel) · Pendientes de la fase: imagen OG (`og-image`, 1200×630) y README (no hechos).

## Objetivo
Publicar el portafolio (SPA Vite + React Three Fiber) en Vercel con caché adecuada y subida ligera.

## Hecho (preparación)
- `npm run build` (`tsc -b && vite build`) pasa en ~1m22s. `dist` pesa ~8.0 MB: `assets` 1.3 MB (App 900 kB / 246 kB gzip, Experience 132 kB, index 144 kB + 34 kB, CSS 36 kB), `textures` 3.8 MB, `video` 2.7 MB, `cv` 113 kB. Aviso de Vite por chunk > 500 kB (App, por three.js y drei): no bloquea.
- `.vercelignore`: excluye `node_modules`, `dist`, `.git`, `.atl`, `.codegraph`, `.claude`, `.env*`, `odd`, `SPEC.md`, `portafolio-libro-kit`, `portfolio-redesign-handoff`, `videos`, `imagenes_proyectos`, `scripts/source-images`. Se sube ~7.5 MB (`public` 6.8 MB, `src`, `scripts` sin originales, configuración y `package-lock.json`).
- `vercel.json`: `framework: vite`, `installCommand: npm ci --ignore-scripts` (evita el postinstall de `ffmpeg-static`, que descarga un binario y falló en esta máquina; `sharp`/`esbuild` usan binarios por dependencias opcionales), `buildCommand: npm run build`, `outputDirectory: dist` y cabeceras: `/assets/*` inmutable 1 año; `manifest.json` y `hotspots.generated.json` siempre revalidados; resto de `/textures/*` 1 h + SWR; `/video/*` 1 día + SWR; `/icons` y `/img` 1 semana + SWR; foto y CV 1 día + SWR. Sin reescrituras (el router usa hash).
- `npm ci --dry-run --ignore-scripts` valida que `package-lock.json` está sincronizado.
- Revisión de referencias: todas las rutas absolutas (`/textures/pages`, `/video/*`, `/img/projects/*`, `/icons/tech/*`, `/cv/JuanJose-CV.pdf`, `/imagenAvaarJJ.webp`, `/favicon.svg`) existen con la misma capitalización (Vercel distingue mayúsculas). `/__pages` es solo del exportador: en producción Vercel responde 404, no hay que tocarlo. `index.html` tiene `lang`, title, description, Open Graph/Twitter y `noscript` coherentes; las fuentes vienen de Google Fonts.

## Comandos de despliegue (CLI; requiere sesión del usuario)
```
npx vercel login            # una vez, interactivo (el usuario: ! npx vercel login)
npx vercel link --yes --project portafolio-libro --scope juanjosep-bs-projects
npx vercel deploy           # vista previa
npx vercel deploy --prod    # producción
```
Equipo detectado por el conector: `juanjosep-bs-projects` (plan Hobby).

## Falta
- Imagen OG `public/og-image.png` (1200×630) y `og:image` / `twitter:image` (+ `summary_large_image`) en `index.html`, con URL absoluta tras conocer el dominio.
- README.
- Cambiar `.gitignore`/commit inicial si se conecta GitHub.

## Riesgos
- El chunk `App` (900 kB) pesa en móvil; el loader ya se pinta antes de cargarlo.
- Los originales de `videos/` y `scripts/source-images` solo existen en disco local.
