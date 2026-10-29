# Fase 4B — Caras restantes (proyectos, testimonios, stack, cierre, contraportada)

Estado: escrita (tsc OK; caras 5–19 y contraportada exportadas 1× y 2×); pendiente de validación visual del usuario · Continúa `odd/tasks/fase-4a-caras-infra.md` (pipeline ya hecho) · Estándar tipográfico y de ajuste visual en `odd/tasks/ajuste-visual-brillo-tamano.md` (cuerpo ≥ 26 px, todo lo demás ≥ 20 px en el espacio de la cara 1600×1100) · Zoom ya implementado (exportar también 2×).

## Instrucción del usuario
"Usa solo la información que te envié." Lo que falte queda como placeholder visible (SegundoAire sin captura). Para las aficiones: agregar "labia" (frases cortas con gancho), que se vea **completo pero no saturado**, de lectura rápida.

## Datos y medios disponibles
- Contenido: `src/content/portfolio.ts` (proyectos con `description`, `highlights`, tecnologías, GitHub y demo; 6 testimonios con nombre/relación/texto; `extra.stack` y `extra.approach`; contacto con email, LinkedIn y GitHub).
- Medios en `imagenes_proyectos/`: `Login-Argos_MesaCrisis.png` (ARGOS), `Bienvenida-ArcoFisio.png` (ArcoFisio). Video ARGOS ya comprimido en `public/video/argos.mp4` y `public/video/argos-poster.jpg` (se reproducirá en hover en la Fase 5: reservar el rectángulo del video con `data-hotspot="video-argos"`). **No hay captura de SegundoAire**: mostrar un marco de teléfono con placeholder discontinuo `[CAPTURA DE SEGUNDOAIRE]`.
- Aficiones (dato del usuario): deporte, gimnasio, música (en especial hard techno) y pasión por tener emprendimientos. Redactar 4 líneas cortas (≤ 12 palabras cada una, tono seguro y con ritmo), **sin inventar hechos** (ni negocios concretos, ni logros, ni cifras). Guardarlas en `portfolio.ts` (`extra.hobbies`) para que también salgan en la versión de texto. Título sugerido de la franja: "Fuera del código".

## Caras (usar el mapa de caras de `src/scene/bookLayout.ts`; el contenido va por spread)
Reglas: tokens del kit, alternancia claro/oscuro, titulares gigantes (grotesca en mayúsculas apretadas + serif itálica), a sangre completa, mini-nav "de sitio web" impresa, `data-hotspot` en cada enlace/botón/zona clicable (GitHub, Demo, correo, LinkedIn, GitHub personal, video, formulario). Texto del usuario literal desde `portfolio.ts`. Sin saturar: jerarquía clara, aire, máx. 1 idea principal por cara.
- **Spread 3 izq. — Mis proyectos** (clara): "MIS PROYECTOS" mega, contador "03", los tres nombres con su plataforma (escritorio y web · Android · smartwatch) y tecnologías clave. Sin párrafos inventados.
- **Spread 3 der. — ARGOS** (oscura, acento cian): nombre mega, "Mesa de Crisis" serif itálica, descripción literal, insignia "C4I", chips de tecnologías, botones pill "GitHub ↗" y "Demo en vivo ↗".
- **Spread 4 izq. — ARGOS captura** (oscura): la captura `Login-Argos_MesaCrisis.png` a sangre como "pantalla de producto" dentro de una ventana de navegador impresa; rectángulo del video reservado.
- **Spread 4 der. — ARGOS cómo está hecho** (clara): los `highlights` como lista de arquitectura (escritorio con Tauri+React+TypeScript, portal público con Vite, Supabase, Mapbox/MapLibre) en formato escaneable; botones.
- **Spread 5 izq. — SegundoAire** (oscura, acento verde `#58d68d`): marco de teléfono con placeholder discontinuo; **Spread 5 der.** (clara): nombre "SegundoAire" + "FocusBlocks", descripción literal, highlights, chips (Kotlin, AccessibilityService, Room Database, Jetpack Compose), botones.
- **Spread 6 izq. — ArcoFisio captura** (oscura, acento ámbar): `Bienvenida-ArcoFisio.png` dentro de un marco de smartwatch circular/redondeado; **Spread 6 der.** (clara): nombre, descripción literal, highlights (interfaz analógica, goniómetro, Web Audio API, háptica), chips, botones.
- **Spread 7 — Testimonios:** izquierda (clara): 2 citas grandes en serif itálica (Luis Díaz y Juan Gallego) con avatar de iniciales; derecha (oscura): grilla 2×2 con las otras 4. Nombre + relación en cada una.
- **Spread 8 — Stack y Arquitectura:** izquierda (oscura): muro de chips por categorías (`extra.stack` + tecnologías de los proyectos, sin duplicar), derecha (clara): "Enfoque de ingeniería" (UML, vistas lógicas modulares, documentación en Markdown), intereses (Arquitectura Cloud, Bases de Datos, Clean Code) y la franja "Fuera del código" con las 4 aficiones como mini-tarjetas.
- **Spread 9 — Cierre:** izquierda vacía (espacio negativo, papel limpio), derecha: "Gracias por hojear." serif itálica centrada, isotipo JJ y © 2026. Cara 19 en blanco.
- **Contraportada exterior — Contactos** (negra mate `cover`): "HABLEMOS." mega, correo grande, LinkedIn y GitHub como líneas con `data-hotspot`, **rectángulo reservado** para el formulario real (`data-hotspot="contact-form"`; lo montará la Fase 5 con `<Html>`), y una línea foil pequeña: "Hecho con React Three Fiber + Tailwind" · © 2026 Juan José Pérez Bravo.

## Imágenes
Optimizar las capturas a WebP en `public/img/projects/` con `sharp` (ancho máx. ~1600) y actualizar `projects[].cover` en `portfolio.ts` (SegundoAire sigue con placeholder). La versión de texto (`A11yContent`) debe mostrar las capturas y las aficiones.

## Tareas
- [x] **T1** `portfolio.ts`: `extra.hobbies` (4 entradas con título y línea corta), `cover` de ARGOS y ArcoFisio, `video` de ARGOS (`/video/argos.mp4`); `A11yContent`: mostrar capturas y aficiones.
- [x] **T2** Optimizar capturas → `public/img/projects/*.webp`.
- [x] **T3** Caras de proyectos (spreads 3–6).
- [x] **T4** Caras de testimonios (spread 7) y stack/arquitectura/aficiones (spread 8).
- [x] **T5** Cierre (spread 9, cara 19 en blanco) y contraportada exterior (Contactos).
- [x] **T6** `bookLayout.ts`/registro de caras: conectar todas las caras nuevas y la contraportada; `npm run pages:export` (1× y 2×) y revisar al menos 3 imágenes exportadas para detectar solapes o textos cortados.

## Criterios de aceptación (los revisa el usuario)
- Todos los spreads 1–9 y la contraportada muestran su diseño (ya no quedan placeholders numerados), alternando claro/oscuro.
- El texto es legible y no hay solapes ni cortes; nada se ve saturado.
- Hay un rectángulo reservado para el video (ARGOS) y otro para el formulario (contraportada).
- Las aficiones suenan con personalidad y se leen rápido.

## Ruta
**delegated direct** — un writer (fork), trigger: ≥ 2 archivos no triviales.

## Gotchas (Fase 4B)
- **Contraportada = id 20** (`BACK_COVER_ID` en `faceIds.ts`): se exporta como `back-cover.webp` (y `@mobile`), no entra en `manifest.faces` sino en `manifest.backCover`, y no tiene 2×. `bookTextures.ts` ya la cargaba por ese flag.
- **Colores por spread** siguen `bookLayout.ts` (alternancia sp.3 claro|oscuro, sp.4 oscuro|claro, sp.5 claro|oscuro, sp.6 oscuro|claro), no el orden del doc original para el spread 5.
- Caras 17 y 19 son papel en blanco (`FaceBlank`); la 18 es "Gracias por hojear".
- `data-hotspot` generados (`hotspots.generated.json`): Índice (goto), Mis proyectos (goto 4/5/6), pills GitHub/Demo por proyecto (`link` + `data-href`), `video-argos` (`video`), contraportada: `email`, `linkedin`, `github` (`link`) y `contact-form` (`form`, rectángulo 610×520 en x=880,y=440 = `FORM_RECT` en `FaceBackCover.tsx`) para el `<Html>` de la Fase 5.
- Resaltes tipográficos: Space Grotesk 700 en mayúsculas junta "AB" y "ND" aunque se aflojó el tracking (kerning de la fuente); los titulares gigantes usan tracking −0.01 a −0.05 em según la cara.
- SegundoAire no tiene captura: marco de teléfono con placeholder `[CAPTURA DE SEGUNDOAIRE]`; al soltar la imagen en `imagenes_proyectos/` basta añadirla a `scripts/optimize-project-images.mjs`, a `projects[].cover` y cambiar `Face09SegundoAireShot.tsx`.
- Capturas optimizadas con `node scripts/optimize-project-images.mjs` → `public/img/projects/{argos,arcofisio}.webp`.
- Las aficiones (`extra.hobbies`) son texto escrito por Claude a petición del usuario (sin hechos inventados); editables en `portfolio.ts`.
