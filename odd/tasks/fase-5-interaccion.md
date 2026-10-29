# Fase 5 — Interacción (+ datos nuevos: videos y demo de SegundoAire)

Estado: escrita (tsc OK; caras 7, 9, 10 y 11 re-exportadas 1× y 2×); pendiente de validación visual del usuario · Continúa `odd/tasks/fase-4b-caras-restantes.md` · Arquitectura híbrida aprobada en `SPEC.md` §9 (texturas para el aspecto + `<Html transform>` solo en el spread visible con el libro quieto + overlay 2D para navbar/footer) · Zoom ya hecho (`odd/tasks/zoom-inmersivo.md`).

## Instrucción del usuario
"Acabo de cargarte los videos de los 2 proyectos que faltaban, además aquí está la demo del app móvil: https://segundoaire-demo.vercel.app/. Sigue con la fase que corresponde y añade esos datos." Las pruebas visuales las hace el usuario; no ejecutar build ni servidor (solo `npx tsc --noEmit` una vez al final; el servidor de desarrollo lo arranca el orquestador cuando el usuario lo pida).

## Datos nuevos
- `imagenes_proyectos/videAPPmobile.mp4` — SegundoAire, 480×936 vertical, 1:03, 7.5 MB.
- `imagenes_proyectos/VideoSmartwatch.mp4` — ArcoFisio, 1080×1816 vertical, 1:15, 11 MB.
- Demo de SegundoAire: `https://segundoaire-demo.vercel.app/` (sustituye al enlace de appetize.io).
- Ya existe `public/video/argos.mp4` (+ poster). Falta el PDF del CV (`public/cv/JuanJose-CV.pdf`): mientras no exista, el botón de CV se muestra como placeholder deshabilitado y visible, nunca un enlace roto (Vite devuelve `index.html` con 200 para rutas inexistentes).

## Tareas
- [x] **T0 Datos y medios.** Elegir el tramo más representativo de cada video (extraer fotogramas con ffmpeg y mirarlos; 8–12 s de uso real de la app, no pantallas estáticas), comprimir con `node scripts/compress-video.mjs <in> <out> <start> <dur> <maxMB>` a `public/video/segundoaire.mp4` y `public/video/arcofisio.mp4` (≤ ~1.2 MB cada uno; para verticales conservar el formato vertical) y generar sus posters. Actualizar `portfolio.ts` (`video`, `demo` de SegundoAire, `cover` de SegundoAire usando el póster como captura optimizada a WebP en `public/img/projects/segundoaire.webp`). Sustituir el placeholder de `Face09SegundoAireShot.tsx` por la captura dentro del marco de teléfono, reservar el rectángulo de video con `data-hotspot` (`video-segundoaire`) y hacer lo mismo con `video-arcofisio` en `Face11ArcoShot.tsx` (sobre la pantalla del smartwatch). Actualizar `scripts/optimize-project-images.mjs` si hace falta, `A11yContent` (capturas/videos con `controls`, `preload="none"`, `muted`) y añadir `imagenes_proyectos/*.mp4` al `.gitignore`. Re-exportar las caras afectadas (`npm run pages:export -- --faces=…`, 1× y 2×).
- [x] **T1 Navbar y footer (overlay 2D).** Navbar fija (logo JJ + enlaces a Inicio, Sobre mí, Experiencia, Proyectos, Testimonios, Stack, Contacto) con hamburguesa en pantallas estrechas; cada enlace llama a `setTarget` del spread correspondiente (mapa en `src/lib/spreads.ts`) y actualiza el hash. Footer fijo discreto: nombre, © 2026, iconos de LinkedIn/GitHub/correo, "Volver arriba" → `setTarget(0)` y crédito "Hecho con React Three Fiber + Tailwind". No taparán el libro abierto (reservar márgenes en `CameraRig` solo si hace falta).
- [x] **T2 Capa de hotspots (`<Html transform>`).** Para el spread visible, cuando el libro está quieto (no girando, y sin arrastrar), montar sobre cada cara anclas transparentes en las posiciones de `hotspots.generated.json` (convertir rectángulos de la cara 1600×1100 al plano de la página). Tipos: `goto` → `setTarget`, `link` → `<a target="_blank" rel="noopener noreferrer">`, `email` → `mailto:` sin target, `cv` → descarga o placeholder, `video`, `form`. `pointer-events` solo en las anclas (el resto de la página sigue pasando de hoja con clic); cursor pointer, foco visible, `aria-label`, navegación por teclado. Desmontar mientras gira el libro o con la cámara en movimiento.
- [x] **T3 Video al pasar el mouse.** En los rectángulos `video-argos`, `video-segundoaire` y `video-arcofisio`: `<video muted loop playsInline preload="none" poster>` que carga y reproduce al hacer hover/foco y se pausa al salir; con `prefers-reduced-motion` no reproduce solo (clic para reproducir). Un único video activo a la vez; liberar al cambiar de spread.
- [x] **T4 Formulario de contacto en la contraportada.** Montar `ContactForm.tsx` con `<Html transform>` en `FORM_RECT` (x=880, y=440, 610×520) de la contraportada (página 10, vista desde atrás: respetar la orientación del plano). `required`, `type="email"`, éxito simulado con `role="status"`; estilos legibles sobre fondo negro; foco y teclado correctos; que escribir no pase de hoja ni dispare atajos del libro (`Z`, `+`, `-`, flechas, `Esc`).
- [x] **T5 CV y enlaces.** Botón de CV en las caras donde ya está (Bienvenida/Sobre mí): enlazar a `/cv/JuanJose-CV.pdf` solo cuando el archivo exista (bandera en `portfolio.ts`, p. ej. `cv.available = false`); si no, placeholder deshabilitado `[CV PRÓXIMAMENTE]`. Verificar que todos los enlaces externos llevan `target="_blank" rel="noopener noreferrer"`.
- [x] **T6 Cierre.** Deep links por hash siguen funcionando, `A11yContent` al día con videos/demo, `npx tsc --noEmit` una vez, y actualizar este documento con constantes, gotchas y qué revisar.

## Resultado (qué se hizo)
- **Medios:** `public/video/segundoaire.mp4` = `videAPPmobile.mp4` desde 0:50, 12.5 s, recorte `crop=468:920:0:10` (quita franjas de estado y la barra de scroll), 0.45 MB (CRF 22); `public/video/arcofisio.mp4` = `VideoSmartwatch.mp4` desde 0:49, 14 s, recorte cuadrado `crop=1030:1030:0:433` centrado en el reloj, 720×720, 0.39 MB. Pósters `*-poster.jpg`; captura de SegundoAire `public/img/projects/segundoaire.webp` = su póster. `compress-video.mjs` acepta un 6.º argumento (filtro de video) y `optimize-project-images.mjs` ya incluye SegundoAire.
- **Datos:** demo de SegundoAire = `https://segundoaire-demo.vercel.app/` (sustituye al enlace de appetize.io); `Project.poster` nuevo; `person.cvAvailable = false` (placeholder visible del CV); `ui.backToTop` y `ui.credit`.
- **Caras:** cara 9 con la captura dentro del teléfono (+ rectángulo `video-segundoaire`); cara 11 rediseñada: panel beige con el reloj en un cuadrado a la derecha (captura recortada para coincidir con el recorte del video, borde izquierdo con degradado) y la frase literal "Interfaz analógica, sin elementos digitales." a la izquierda (+ `video-arcofisio`); `BrowserFrame` (parts.tsx) ahora marca como hotspot solo la pantalla (no la barra de título), así `video-argos` = 1286×607 en (112, 403).
- **Capa de hotspots:** `src/scene/SpreadHotspots.tsx` (montada en `Book.tsx`): un `<Html transform>` por cara visible, tendido sobre el papel (`rotation -π/2`, `distanceFactor = ancho_mundo/1600·400` para que 1 px de cara = 1 px CSS), con las anclas en los rectángulos de `src/lib/hotspots.generated.json`. Solo existe con el libro quieto (`useBook.moving === false`) y aparece con un fundido de 200 ms.
  - `goto` → `<a href="#hash">` + `setTarget`; `link` → `<a target="_blank" rel="noopener noreferrer">` (mailto sin target); el href se lee de `portfolio.ts` (no del json) para que no quede viejo; `download` (CV) → descarga real si `person.cvAvailable`, si no un recuadro ámbar discontinuo `[CV PRÓXIMAMENTE]`; `video` → `<button>` con `<video muted loop playsInline preload="none">` que se reproduce al pasar el mouse / foco y se detiene (y vuelve al inicio) al salir; con `prefers-reduced-motion` solo con clic; `form` → `ContactForm variant="book"`.
  - Todas las anclas hacen `stopPropagation` del clic (no pasa de hoja), respetan `zoomState.dragged` y apagan el levantamiento de esquina del libro mientras el puntero está encima (`hoveredHotspot` en el store, leído por `Book.tsx`).
- **Contraportada:** formulario real en el rectángulo `contact-form` (880, 440, 610×520) de la cara 20, `required`, `type="email"`, éxito simulado con `role="status"`; tamaños de letra de la cara (24 px); `pointerdown`/clic del formulario no llegan al zoom ni al libro; los atajos del libro ya ignoran INPUT/TEXTAREA.
- **Navbar y footer:** `src/ui/Navbar.tsx` (logo, enlaces Inicio · Sobre mí · Experiencia · Proyectos · Testimonios · Stack + "Contáctame"; hamburguesa bajo `lg` con todos los enlaces, Esc y clic fuera cierran; `aria-current` en el activo; los enlaces llaman a `setTarget` y conservan su alias de hash con `replaceState`) y `src/ui/Footer.tsx` (fija abajo: © 2026 + crédito, iconos LinkedIn/GitHub/correo con `_blank`, "Ver versión texto" y "Volver arriba" → `setTarget(0)`). `Overlay.tsx` los monta; el botón de versión texto se movió al footer. `NAV_LINKS`/`currentHash` en `src/lib/spreads.ts`.
- **Zoom:** `ZoomInput.tsx` escucha ahora en el contenedor exterior de R3F (el que también contiene las capas `<Html>`), así la rueda y el arrastre funcionan también sobre anclas y video; la captura de puntero sigue en el canvas.
- **Versión texto:** `A11yContent` muestra el video (`controls`, `preload="none"`, `muted`, póster) y el CV como placeholder deshabilitado mientras no exista el PDF.
- **Exportador:** `export-pages.ts` escribe también `src/lib/hotspots.generated.json` (importado en tiempo de build).
- `.gitignore`: `imagenes_proyectos/*.mp4`.

## Verificación
- `npx tsc --noEmit`: sin errores (se ejecutó dos veces: la primera detectó una constante sin usar, ya eliminada).
- Exportadas y revisadas a mano las imágenes 07, 09 y 11 (sin solapes ni cortes). No se corrió build ni se vio en el navegador: lo relativo a `<Html transform>`, video y formulario **no está verificado visualmente**.

## Constantes de ajuste
| Dónde | Constante | Valor | Qué hace |
|---|---|---|---|
| `SpreadHotspots.tsx` | `distanceFactorFor` | `ancho_mundo/1600·400` (0.32 páginas, 0.3328 contraportada) | Escala de la capa: 1 px de cara = 1 px CSS |
| | `SURFACE_LIFT` | 0.001 | Separación sobre el papel |
| | `FADE_MS` | 200 | Fundido de entrada de la capa |
| | `VIDEO_SHAPE` | por proyecto | Recorte del video (esquinas del marco / degradado del reloj) |
| `ContactForm.tsx` | `STYLES.book` | 24 px campos, 20 px etiquetas | Tamaños en el espacio de cara 1600×1100 |
| `useBook.ts` | `moving` | bool | Lo pone en `true` `setTarget`/`syncFromHash` y lo apaga `Book` cuando ninguna hoja se mueve |

## Gotchas
- `<Html transform>` mide el mundo en "px": 1 px CSS = `distanceFactor/400` unidades; para un lienzo de 1600 px sobre una página de 1.28 u → `distanceFactor = 0.32`. El contenido no se curva, ni recibe luz ni postproceso: por eso solo existe con el libro quieto.
- drei añade la capa `<Html>` al contenedor exterior de R3F (`events.connected`), **no** al padre del canvas: por eso `ZoomInput` usa `el.parentElement.parentElement`. El `stopPropagation` de React en el clic evita que el clic llegue al `onClick` de la malla del libro.
- La textura de la cara 11 y el video del reloj se funden con el mismo beige (#e9dcc4); si cambia el recorte del video hay que recalcular `CAPTURE` en `Face11ArcoShot.tsx` (lado 432 px = diámetro 410 / 0.95).
- Los `href` guardados en `hotspots.generated.json` pueden quedar viejos; la capa los resuelve desde `portfolio.ts`, pero conviene re-exportar las caras si cambian.
- Al enfocar un control dentro de la capa, el navegador puede desplazar contenedores recortados: `FaceDom` los devuelve a 0 en `onFocusCapture`.
- El levantamiento de esquina del libro se apaga mientras el puntero está sobre un hotspot, porque la capa plana no seguiría la curvatura.
- Sin CV: el botón impreso de la cara 2 sigue diciendo "Descargar CV ↓"; encima aparece el recuadro `[CV PRÓXIMAMENTE]`. Al soltar el PDF en `public/cv/JuanJose-CV.pdf` basta poner `cvAvailable: true` en `portfolio.ts`.

## Qué revisar (el usuario)
1. Recarga fuerte y abre el libro: tras cada giro, pasar el mouse por los botones GitHub / Demo en vivo y por el índice debe mostrar un aro cian y funcionar (externos en pestaña nueva, el índice cambia de página). Que el aro coincida con el botón impreso (si hay desfase, es la escala de la capa).
2. Spreads 4 (ARGOS), 5 (SegundoAire) y 6 (ArcoFisio): al pasar el mouse por la captura / teléfono / reloj se reproduce el video; al salir se detiene. La rueda debe seguir haciendo zoom encima del video.
3. Contraportada (#contacto): escribir en el formulario (sin que gire la hoja ni salten atajos), enviar vacío (validación del navegador), correo inválido y envío correcto ("Gracias…").
4. Navbar: enlaces, hamburguesa (reducir la ventana bajo ~1024 px), Esc y clic fuera; footer: iconos, "Ver versión texto" y "Volver arriba".
5. Que el libro no se sienta más lento y que no haya errores en consola.

## Alcance autorizado
`src/ui/*`, `src/scene/*` (solo lo necesario para la capa Html y el overlay), `src/pages-design/faces/*` (solo caras 9 y 11 y hotspots), `src/content/portfolio.ts`, `src/lib/*`, `scripts/*`, `public/video`, `public/img/projects`, `.gitignore`, `odd/tasks/`. No cambiar el diseño de las demás caras ni la lógica de giro/zoom salvo lo imprescindible.

## Criterios de aceptación (los revisa el usuario)
- Navbar con hamburguesa y footer fijo con "Volver arriba" funcionan y el libro gira al spread elegido.
- Los botones de las páginas (GitHub, Demo, índice, correo, LinkedIn) responden; los externos abren en pestaña nueva.
- Al pasar el mouse por la captura de cada proyecto se reproduce su video corto.
- El formulario de la contraportada se puede rellenar, valida y muestra confirmación simulada.
- Sin errores en consola; el libro no se siente más lento; sin la capa Html mientras gira.

## Ruta
**delegated direct** — un writer (fork), trigger: ≥ 2 archivos no triviales.

## Gotchas previstos
- `<Html transform>` es una capa DOM plana (sin curvatura, luz ni postproceso): usarla solo con el libro quieto y para elementos pequeños.
- Vite devuelve `index.html` con 200 para rutas inexistentes: nunca sondear archivos; usar banderas en el contenido.
- Los enlaces internos `#hash` mantienen la misma pestaña; mailto sin target.
- Con zoom ≥ 1.3× el clic no pasa de hoja: las anclas deben funcionar igual con zoom.

## Ajuste posterior (petición del usuario)
- La franja inferior del libro (© nombre, crédito, iconos sociales, "Volver arriba") se quitó de la pantalla del libro: ahora vive solo en el pie de la versión texto (`A11yContent`), con "Volver arriba" que sube el scroll de esa vista.
- En la pantalla del libro queda únicamente el botón flotante "Ver versión texto" (`src/ui/TextVersionButton.tsx`, abajo a la derecha; `Footer.tsx` eliminado). `ZoomControls` sube un poco para no solaparlo.
- Nota para §9 de SPEC: el footer fijo de la rúbrica se cumple en la versión texto; en la escena 3D el equivalente es la contraportada (Contactos) y el botón flotante.

## Clips de video rehechos (petición del usuario: tramos más largos y representativos)
Originales (no versionados, `videos/*.mp4` en `.gitignore`): `videos/videoMobile.mp4` (SegundoAire, 480×936, 1:03) y `videos/videoSmartwatch.mp4` (ArcoFisio, 1080×1816, 1:15). Mismo recorte y calidad que ARGOS (720 de alto, 24 fps, H.264, sin audio, CRF 22 bastó); solo cambió el tramo.

| Clip | Inicio | Duración | Tamaño | Recorte | Qué muestra |
|---|---|---|---|---|---|
| `public/video/segundoaire.mp4` | 37 s | 26.5 s | 0.70 MB (366×720) | `crop=468:920:0:10,scale=-2:720` | "Echa raíces" (compromiso) → crear cuenta → "Todo listo" → elegir apps → Panel → Bloques → Progreso → Perfil (final natural en la pantalla de Perfil). |
| `public/video/arcofisio.mp4` | 46 s | 27.6 s | 0.91 MB (720×720) | `crop=1030:1030:0:433,scale=720:720` | Ángulo objetivo (90° → 135°) → repeticiones/series → medición en vivo (33° … 131°) → descanso 0:03 → "¡Listo!". |

Comandos exactos (regenerables mientras existan los originales):
```
node scripts/compress-video.mjs videos/videoMobile.mp4 public/video/segundoaire.mp4 37 26.5 1.0 "crop=468:920:0:10,scale=-2:720"
node scripts/compress-video.mjs videos/videoSmartwatch.mp4 public/video/arcofisio.mp4 46 27.6 1.0 "crop=1030:1030:0:433,scale=720:720"
```
- El póster de SegundoAire cambió ("Echa raíces" en vez de "Elige las apps"): se regeneró `public/img/projects/segundoaire.webp` con sharp (ancho 1600 sin ampliar, calidad 86; mismo ajuste que `optimize-project-images.mjs`, que ya no se puede ejecutar completo porque `imagenes_proyectos/` ya no existe) y se re-exportó solo la cara 9 (1× y 2×); es la única cara que usa esa captura.
- El póster de ArcoFisio cambió (dial "Ángulo objetivo") pero solo lo usan el `<video poster>` de la versión texto y el hover; la captura impresa de la cara 11 sigue siendo `arcofisio.webp` (bienvenida).
- Los clips anteriores (12.5 s y 14 s) quedaron respaldados en el scratchpad de la sesión, no en el repo.
