# SPEC — Portafolio "Libro Interactivo" (Juan José)

> Fuente de verdad del plan de trabajo. El detalle de diseño vive en `portafolio-libro-kit/` (`CLAUDE.md` + `docs/01`–`07`). Este documento define **cómo lo construimos por fases** y **qué falta por definir**.

## 1. Objetivo

Portafolio de una sola página: un libro de tapa dura 3D sobre un escritorio oscuro, cámara cinematográfica, páginas que se hojean con clic y "respiran" con hover. Cada spread es una sección. Referencia: "Ubernatural – Interactive Portfolio" (`reference/`). Replicamos estilo, cámara, luz y ritmo; **no** su logo, textos ni imágenes.

## 2. Acuerdo de trabajo

- Se construye **fase por fase**. Cada fase termina en algo visible en `localhost`.
- Claude escribe el código **sin ejecutar pruebas ni build**. Las pruebas son manuales (Juan José) y los desajustes se reportan en la conversación.
- Al cerrar una fase, Claude entrega: qué se hizo, comandos para correrlo y una **lista de qué revisar**.
- No se avanza a la siguiente fase sin visto bueno.
- Nunca se inventan datos, métricas, testimonios ni fechas: se usa `[PLACEHOLDER]` visible (`outline: dashed`).
- Commits: Conventional Commits, sin atribución de IA. Solo se hacen cuando Juan José lo pida.

## 3. Stack (fijo)

Vite + React 18 + TypeScript (strict) · three + @react-three/fiber + drei (+ postprocessing) · framer-motion · maath · zustand · Tailwind CSS · Playwright + sharp (export de páginas a textura) · Node 24 / npm 11 (ya instalados).

Estructura de carpetas, pipeline de texturas, modelo del libro y estado: `docs/03`. Timings y animaciones: `docs/04`. Tokens: `docs/05`.

## 4. Las 9 secciones (orden fijo)

| # | Sección | Dónde vive | Hash |
|---|---|---|---|
| 1 | Menú de navegación | Overlay UI + página Índice | — |
| 2 | Bienvenida / Hero + CV | Escena 0 + Spread 1 der. | `#inicio`, `#bienvenida` |
| 3 | Acerca de mí | Spread 2 | `#sobre-mi` |
| 4 | Proyectos (ARGOS, SegundoAire, ArcoFisio) | Spreads 3–5 | `#proyectos/<id>` |
| 5 | Testimonios | Spread 6 | `#testimonios` |
| 6 | Experiencia académica y laboral | Spread 7 | `#experiencia` |
| 7 | Contactos | Contraportada exterior (libro cerrado por detrás) + formulario del overlay | `#contacto` |
| 8 | Stack & Laboratorio (propuesta) | Spread 9 | `#laboratorio` |
| 9 | Pie de página | Contraportada + footer UI | `#fin` |

## 5. Fases y qué verás en localhost

| Fase | Entregable | Qué revisas tú |
|---|---|---|
| **1 · Base** | Proyecto Vite/TS/Tailwind, tokens, fuentes, `content/portfolio.ts`, zustand, hash routing, `A11yContent` con las 9 secciones en HTML | La app arranca; ves las 9 secciones en HTML con placeholders visibles; el hash cambia el estado |
| **2 · Escritorio** | Canvas, madera PBR, luz cálida, viñeta, props, `CameraRig` "cerrado" | Encuadre vs `01-hero-libro-cerrado.jpg`: pool de luz, esquinas negras, props cortados por el borde |
| **3 · Libro 3D** | Tapas, lomo, hojas con huesos, texturas numeradas de prueba, abrir/cerrar, paso de página con curvatura, hover de esquina, teclado | La hoja se curva y proyecta sombra; ← → Enter Esc funcionan; fluidez |
| **4 · 20 caras** | Componentes de página 1600×1100, `npm run pages:export`, hotspots generados | Cada spread parece un case study editorial; alternancia claro/oscuro |
| **5 · Interacción** | Hotspots (CV, links, índice), video en hover, menú, "Contáctame", formulario, footer, deep-links | Todo funciona con mouse y teclado; `#proyectos/argos` abre ese spread |
| **6 · Pulido** | Loader, secuencia de entrada, postpro, deriva de cámara, móvil, reduced-motion, fallback sin WebGL | 60 fps; móvil una página a la vez; Lighthouse (Perf ≥ 80, A11y ≥ 95, SEO ≥ 95) |
| **7 · Deploy** | Vercel, OG image, README | URL pública funcionando |

## 6. Información que falta (se pide cuando la fase la necesita)

**Recibido**
- Nombre: Juan José Perez Bravo, 19 años (la edad no se publica salvo que se pida).
- Perfil: Estudiante de Ingeniería de Software, 5.º semestre, UCC Pasto.
- Línea de tiempo (hitos a destacar): Hackathon Talento Tech Pasto (nov 2025) · Hackathon Concurso de Innovación ParqueSoft (dic 2024) · Diplomado en la U. Mariana (2025).
- Proyectos: ARGOS (Mesa de Crisis, arquitectura C4I; escritorio Tauri + React + TypeScript, portal público Vite, Supabase, Mapbox/MapLibre) · SegundoAire / FocusBlocks (Android nativo, Kotlin, Room, AccessibilityService) · ArcoFisio (smartwatch, UI analógica, goniómetro, Web Audio API, háptica).
- Testimonios: colaboradores Luis Díaz, Juan Diego Vázquez, Juan Gallego (arquitectura de software y metodologías ágiles). **Faltan las citas.**
- Stack: Java, Kotlin, R3F, AWS Lambda, Docker, PostgreSQL; enfoque en UML, vistas lógicas modulares y documentación en Markdown.
- Cierre: cara 18 vacía (espacio negativo) + cara 19 con "Gracias por hojear".

**Aún falta — Fase 1–2**
- Disponibilidad (proyectos / empleo). Ciudad: ¿Pasto, Colombia?
- Logo / isotipo "JJ" (si no hay, wordmark provisional).

**Aún falta — Fase 4** (diseño de caras)
- Bio (2 párrafos), foto/retrato, cifras reales (años, nº de proyectos) si se quieren mostrar.
- Por proyecto: tagline, problema, solución, rol, año, URL, repo, capturas/mockups. Colores de acento propuestos: ARGOS cian, SegundoAire verde/azul, ArcoFisio ámbar.
- Testimonios: **aún no existen**. El Spread 7 se diseña con el bloque "¿Trabajamos juntos? Tu testimonio aquí" (sin citas ni nombres inventados). Cuando lleguen las citas de Luis Díaz, Juan Diego Vázquez y Juan Gallego (con cargo/relación y permiso), se rellenan en `portfolio.ts` y se regenera la página.
- Fechas y detalle de cada hito de la línea de tiempo (rol/logro). Experiencia laboral: ¿hay algo más aparte de hackathons y diplomado?
- Stack & Arquitectura: ¿hay diagramas UML / vistas propias para mostrar?

**Fase 5**
- Email, LinkedIn, WhatsApp (opcional), PDF del CV (`public/cv/JuanJose-CV.pdf`).
- Videos de 6–10 s por proyecto (≤ 2 MB, 720p, sin audio).
- Formulario: `mailto:` o Formspree.

Ya conocido: GitHub `https://github.com/JuanJoseP-B`.

## 7. Decisiones abiertas / ambigüedades del kit

1. **Mapa de caras (cambió con la info recibida).** Nuevo orden: spread *k* = caras `2k` y `2k+1`. Spread 3 = Intro + ARGOS (6–7) · 4 = ARGOS deep dive, video en hover (8–9) · 5 = SegundoAire (10–11) · 6 = ArcoFisio (12–13) · 7 = Testimonios (14–15) · 8 = Stack y Arquitectura (16–17) · 9 = "Respiro editorial": cara 18 vacía + cara 19 "Gracias por hojear" (18–19). Esto **resuelve** la ambigüedad de la página final (cabe en 20 caras). Caras 0–5 quedarían para: tapa, Índice, Bienvenida + CV, Acerca de mí / Académica y laboral.
   **Resuelto:** Contactos vive en la **contraportada exterior** (email, links, QR/vCard) y el botón "Contáctame" del overlay lleva ahí, con su mini-formulario real en DOM. La contraportada exterior se modela como textura aparte de las 20 caras interiores (a confirmar en Fase 3). Spread 8 del kit (Contactos) desaparece.
2. **Ubicación del proyecto.** *Propuesta:* scaffold en la raíz del repo (`package.json` en raíz) y `portafolio-libro-kit/` queda como documentación de referencia.
3. **Sección 8.** "Stack & Laboratorio" es propuesta del kit; alternativas: "Certificaciones" o "Ahora mismo".
4. **Stack de los proyectos.** El kit sugiere Tauri (ARGOS), Kotlin (SegundoAire), Supabase (ArcoFisio) como ejemplos; confirmar con datos reales.
5. **Props 3D** (taza, lápiz, maceta, tarjeta): modelos CC0 `.glb` o primitivas modeladas. *Propuesta:* primitivas en Fase 2, sustituir por `.glb` si luego se consiguen.
6. **Texturas de madera:** CC0 (ambientCG / Poly Haven). Se descargan en Fase 2.
7. **Tipografía de página.** Instrument Serif Italic (serif de contraste) se añadió respecto al kit original; ya está en `docs/05`.

## 8. Definición de terminado

- Las 9 secciones existen, en orden, navegables desde menú, índice y teclado.
- Calidad estética a la par de la referencia (escena, luz, libro, ritmo editorial).
- CV descargable desde la escena inicial y desde el Spread 1.
- Sin datos inventados; placeholders visibles donde falte información.
- Accesible (versión HTML completa, teclado, reduced-motion) y a 60 fps en laptop media.

## 9. Rúbrica obligatoria (actualización del usuario) — estado: adaptación propuesta, pendiente de aprobar

Los requisitos "tradicionales" (scroll, formularios, enlaces `_blank`) se resuelven con **dos capas**:
- **Overlay 2D (DOM, fijo):** navbar (logo/iniciales + hamburguesa en móvil; los enlaces llaman a `setTarget(page)` y el libro hojea hasta ese spread; no usan anclas con scroll) y footer fijo (nombre, © año, redes, "Volver arriba" → `setTarget(0)`, crédito).
- **Libro 3D:** la página es textura (aspecto impreso, curvatura, luz, postproceso). El contenido interactivo del spread visible (enlaces, formulario, texto seleccionable) va en `<Html transform>` de drei **solo cuando el libro está quieto**; durante el giro se oculta (fade) y se ve la textura. `A11yContent` sigue siendo la versión accesible/SEO canónica.

Por qué no todo en `<Html>`: es una capa DOM con `matrix3d` plana sobre el canvas; no se curva con los huesos de la hoja, no recibe luz, sombras ni postproceso, y muchas instancias penalizan el rendimiento.

| Sección | Requisito | Dónde | Datos que faltan |
|---|---|---|---|
| Navbar | fija, logo, hamburguesa móvil, enlaces → hojear | Overlay | logo |
| Hero + CV | título, nombre, rol, botón CV | Escena 0 (overlay) + spread 1 der. | PDF del CV, titular |
| Acerca de mí | 3–5 líneas 1.ª persona, foto, habilidades, ubicación/semestre | Spread 2 izq. | bio, foto, ciudad |
| Proyectos | tarjeta con imagen, tecnologías, botón GitHub y botón demo, `target="_blank"` | Spreads 3–6 | URLs, repos, imágenes; definir "demo" para Android y smartwatch |
| Experiencia | académica **y** laboral/prácticas, orden inverso, fechas, institución, cargo, logros | Spread 2 der. | experiencia laboral/prácticas (hoy solo hackathons y diplomado) |
| Testimonios | mínimo 3: nombre, cargo, avatar, texto | Spread 7 | 3 citas reales con permiso |
| Sección adicional | stack y aficiones, antes de contactos | Spread 8 | aficiones |
| Contactos | formulario (nombre, correo, mensaje; `required`, `type="email"`), confirmación, enlaces correo/LinkedIn/GitHub | Contraportada (page 10) | email, LinkedIn, servicio de envío (Formspree/EmailJS/mailto) |
| Footer | fijo; nombre, © año, redes, "Volver arriba", crédito | Overlay | crédito exacto (ver abajo) |

Nota: el crédito pedido "Hecho con Next.js + Tailwind" no corresponde al stack real (Vite + React + R3F + Tailwind). Por defecto se usa "Hecho con React Three Fiber + Tailwind" salvo indicación contraria.
