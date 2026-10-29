# Fase 4A — Pipeline de caras + primeras caras diseñadas

Estado: escrito, exportado y pendiente de prueba manual · Fuente: `SPEC.md` §5/§9 + `portafolio-libro-kit/docs/02, 03, 05` (ya conocidos) · Aprobado por el usuario: enfoque híbrido (textura + `<Html>` solo con el libro quieto; el `<Html>` llega en Fase 5).
La Fase 4 se entrega en dos tandas para poder validar el pipeline pronto: **4A** (esta: infraestructura + caras de portada, Índice, Bienvenida, Acerca de mí, Experiencia) y **4B** (proyectos, testimonios, stack, cierre y contraportada).

## Objetivo
Cada cara del libro se diseña como componente React de 1600×1100 px, se exporta a WebP con Playwright y el libro 3D la usa como textura (reemplazando los placeholders numerados). Las caras aún no diseñadas siguen con su placeholder.

## Alcance autorizado
Solo 4A. Sin `<Html>`/formulario/videos/menú (Fase 5). Sin caras de proyectos, testimonios, stack, cierre ni contraportada (4B).

## Infraestructura (T1–T3)
- **T1** `src/pages-design/`: `PageFrame.tsx` (1600×1100 exactos, fondo claro u oscuro, `data-hotspot="id"` en elementos interactivos), `index.tsx` con la ruta de ruta aislada `/__pages?n=K` (sin router: se decide en `main.tsx` por `location.pathname`), registro `faces.ts` que mapea número de cara física → componente según `src/scene/bookLayout.ts`.
- **T2** `scripts/export-pages.ts` + script `npm run pages:export`: Playwright (Chromium, `deviceScaleFactor: 1`) abre `/__pages?n=K` contra el dev server en `http://localhost:5173` (si no responde, arranca Vite en otro puerto), espera `document.fonts.ready` e imágenes, captura PNG, `sharp` → `public/textures/pages/page-NN.webp` (calidad 88) y versión móvil 800×550, escribe `public/textures/pages/manifest.json` (lista de caras disponibles) y `hotspots.generated.json` (bounding boxes de los `data-hotspot`). Dependencias: `playwright`, `sharp`, `tsx` (dev). Instalar Chromium con `npx playwright install chromium`.
- **T3** `src/scene/bookTextures.ts`: cargar `page-NN.webp` solo si aparece en `manifest.json` (en Vite dev una ruta inexistente devuelve `index.html` con 200: NO probar existencia por fetch de la imagen); fallback al placeholder por cara; sRGB y anisotropía como ahora; reemplazar el flag `USE_PAGE_FILES` por esta lógica por cara.

## Caras a diseñar en 4A (usar el número de cara de `bookLayout.ts`)
Reglas de diseño comunes: tokens del kit (`void`, `paper`, `paper-white`, `paper-ink`, `accent`, tipografías Space Grotesk / Instrument Serif italic / Inter / JetBrains Mono), titulares gigantes mezclando grotesca en mayúsculas apretadas y serif itálica, a sangre completa, alternancia claro/oscuro, mini-nav "de sitio web" impresa arriba, detalles de metadatos. Todo texto del usuario **literal** de `src/content/portfolio.ts` (importar; no copiar). Lo faltante se imprime como placeholder con borde discontinuo.
- **Tapa (cara 0, exterior):** negro mate `cover`, logo/isotipo "JJ" provisional (SVG: círculo + iniciales) en foil cian sutil, "Juan José Pérez Bravo — Portafolio 2026".
- **Spread 1 izquierda — Índice** (`paper-white`): "Índice" serif itálica 64 px, lista en 2 columnas con nº de capítulo, nombre y nº de página; entradas: Bienvenida, Sobre mí, Experiencia, Proyectos (ARGOS, SegundoAire, ArcoFisio), Testimonios, Stack y Arquitectura, Contacto. `data-hotspot` por línea (destino = página del libro).
- **Spread 1 derecha — Bienvenida** (oscura): retrato `/imagenAvaarJJ.jpg` tratado con luz cian lateral, "HOLA, SOY / JUAN JOSÉ" mega, rol "Ingeniero de Software" en serif itálica, 3 datos (Pasto, Nariño, Colombia · Quinto Semestre · Intereses), pill blanco "Descargar CV ↓" (`data-hotspot="cv"`). Sin QR (no hay URL real).
- **Spread 2 izquierda — Acerca de mí** (clara): "Detrás del código" serif itálica enorme, bio literal, datos rápidos, habilidades, y los tres principios PRECISIÓN / CLARIDAD / CURIOSIDAD como detalle tipográfico.
- **Spread 2 derecha — Experiencia** (oscura): encabezado estilo "CONTROLLED EDGE"; dos bloques ("Experiencia Académica" y "Experiencia Laboral / Práctica Competitiva") con línea de tiempo vertical, años en JetBrains Mono, orden cronológico inverso.

## Tareas
- [x] **T1** `src/pages-design/` (frame, ruta aislada, registro de caras) _(hecho; pendiente de prueba manual)_
- [x] **T2** `scripts/export-pages.ts` + `pages:export` + dependencias y Chromium _(hecho; pendiente de prueba manual)_
- [x] **T3** `bookTextures.ts` con manifest y fallback por cara _(hecho; pendiente de prueba manual)_
- [x] **T4** Caras 4A: tapa, Índice, Bienvenida, Acerca de mí, Experiencia _(hecho; pendiente de prueba manual)_
- [x] **T5** Ejecutar `npm run pages:export` una vez y dejar los `.webp`, `manifest.json` y `hotspots.generated.json` generados en `public/textures/pages/` _(hecho; pendiente de prueba manual)_

## Criterios de aceptación (los revisa el usuario)
- `npm run pages:export` funciona y deja las imágenes de las 5 caras.
- Al abrir el libro se ven las caras diseñadas en tapa, spread 1 y spread 2; el resto sigue con placeholder numerado.
- Texto legible y nítido sobre la hoja; sin espejado; alternancia claro/oscuro; ningún texto inventado.
- La ruta `http://localhost:5173/__pages?n=1` muestra la cara aislada.

## Ruta
**delegated direct** — un writer (fork), trigger: ≥ 2 archivos no triviales.

## Pendiente para 4B
Capturas de proyectos (se intentarán capturas con Playwright de las demos públicas de ARGOS y ArcoFisio; SegundoAire está en Appetize y necesita imagen del usuario o captura), aficiones, texto de intro de "Mis proyectos" (no inventar: usar solo nombres y tecnologías), formulario de contacto reservado como rectángulo en la contraportada.

## Resultado (4A)
- `npm run pages:export` exportó las caras 0–4 a `public/textures/pages/` (`page-NN.webp` 1600×1100, `page-NN@mobile.webp` 800×550, `manifest.json`, `hotspots.generated.json`). Tamaños: 14–105 KB por cara. `tsc --noEmit` limpio. Las caras se revisaron visualmente como imágenes exportadas; **no** se vieron todavía sobre el libro 3D.
- Hotspots generados: 10 líneas del Índice (`goto`, con `page`) en la cara 1 y el botón de CV (`download`) en la cara 2.
- Caras sin diseño (5–19) y contraportada siguen con su placeholder numerado.

## Constantes de ajuste
- Tamaño y tema de la hoja, grano y sombra del lomo: `src/pages-design/PageFrame.tsx` (`BACKGROUND`, `GRAIN`, `GUTTER_PX`).
- Calidad de exportación: `scripts/export-pages.ts` (`WEBP_QUALITY`, `MOBILE_QUALITY`, `MOBILE_SIZE`).
- Qué caras se exportan: `src/pages-design/faceIds.ts` (`DESIGNED_FACE_IDS`) + registro `faces.ts`.
- Entradas del Índice (cara de inicio y página del libro): `Face01Index.tsx` (`ENTRIES`).
- Los tamaños tipográficos son mayores que la escala del kit (cuerpo 21–26 px en vez de 18) para que se lea sobre la hoja a ~0,36× en pantalla.

## Gotchas
- Re-exportar tras cambiar un diseño o `portfolio.ts`: `npm run pages:export` (usa el dev server de :5173 o arranca Vite en :5199). `--faces=3,4` exporta solo esas y fusiona el manifiesto.
- La escena carga `manifest.json` y reemplaza cada placeholder por su `page-NN.webp` (misma `Texture`, `dispose()` previo porque cambia el tamaño). Recargar con Ctrl+F5 tras exportar (el manifiesto lleva `version` para romper la caché).
- En Vite dev una ruta estática inexistente devuelve `index.html` con 200: por eso se decide por manifiesto y no por existencia de archivo.
- `main.tsx` importa `App` y `pages-design` de forma dinámica: la ruta `/__pages?n=K` no carga la escena 3D.
- La foto del usuario es un avatar sobre fondo blanco; en página oscura se muestra dentro de un arco con fondo cian y `mix-blend-mode: multiply`.
- Orientación de las texturas sobre las hojas sin verificar en 3D (la UV del dorso la resuelve `leafRig.ts`); si algún texto sale espejado, avisar.
