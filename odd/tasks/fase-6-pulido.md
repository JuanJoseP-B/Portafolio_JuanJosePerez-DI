# Fase 6 — Pulido (loader, entrada, móvil, reduced-motion, fallback, rendimiento)

Estado: escrita (tsc OK; sin build ni servidor; pendiente de validación visual del usuario) · Continúa `odd/tasks/fase-5-interaccion.md` (validada por el usuario; ajuste posterior: la franja inferior pasó a la versión texto) · Meta de SPEC §6: 60 fps, móvil una página a la vez, Lighthouse Perf ≥ 80, A11y ≥ 95, SEO ≥ 95.

## Instrucción del usuario
"Sigue con la siguiente fase." Las pruebas visuales las hace el usuario; no ejecutar build ni servidor (solo `npx tsc --noEmit` una vez al final; se puede usar `sharp`/ffmpeg para medios). Lighthouse lo corre el usuario en su navegador. Sin commits. Datos faltantes siguen como placeholder (CV).

## Tareas
- [x] **T1 Loader.** Pantalla de carga sobre el canvas con isotipo "JJ", barra de progreso real (texturas del manifest, fuentes y modelo con `useProgress`/precarga propia) y salida con fundido. Duración mínima corta para evitar parpadeo; texto accesible (`role="status"`); con `prefers-reduced-motion` sin animaciones. No bloquear la versión texto.
- [x] **T2 Secuencia de entrada y deriva.** Tras el loader, entrada breve de cámara/libro hacia la pose cerrada (sin `setState` por frame) y un leve movimiento de respiración/deriva de cámara con el libro cerrado que se apaga al abrir, con zoom o con reduced-motion. El título hero entra después del libro.
- [x] **T3 Móvil (una página a la vez).** En pantallas estrechas/retrato (≈ < 768 px): el libro se encuadra para leer **una cara a la vez** (usar texturas `@mobile`), con swipe horizontal para pasar de cara/hoja (sin romper la lógica de spreads, hash ni `setTarget`), botones de anterior/siguiente accesibles, zoom por pellizco y arrastre sin pasar hoja por accidente, hotspots y formulario utilizables con el dedo (áreas táctiles ≥ 44 px donde sea posible), navbar con hamburguesa y botón "Ver versión texto" sin solapes. En escritorio nada cambia.
- [x] **T4 Reduced-motion global.** Revisar giro de hojas, cámara, zoom, hover de esquina, videos y loader: con `prefers-reduced-motion` movimientos instantáneos o muy cortos, sin deriva, videos solo con clic.
- [x] **T5 Fallback sin WebGL.** Detectar falta de WebGL o pérdida de contexto y envolver el `<Canvas>` en un error boundary: mostrar la versión texto (`A11yContent visible`) como página principal con un aviso breve, sin pantalla en blanco. Si el WebGL se pierde a mitad de sesión, mensaje y opción de reintentar.
- [x] **T6 Rendimiento, SEO y accesibilidad.** Optimizar `public/imagenAvaarJJ.jpg` (1.9 MB) a WebP (≤ ~150 KB, con tamaño suficiente para la cara "Sobre mí" y la versión texto) y actualizar sus referencias (conservar el JPG original fuera de `public` o en `.gitignore`); cargar de forma diferida lo pesado (video `preload="none"`, texturas 2× ya diferidas, `lazy` de la escena si ayuda al LCP); limitar `dpr` del canvas y suspender el render cuando la pestaña está oculta; `index.html` con `lang="es"`, `<title>`, `meta description`, Open Graph/Twitter básicos (la imagen OG se crea en la Fase 7), `theme-color`, favicon; encabezados y landmarks correctos, contraste, foco visible, `alt` en imágenes, `aria-label` en controles; revisar que no haya errores de consola evitables.
- [x] **T7 Cierre.** `npx tsc --noEmit` una vez; actualizar este documento con constantes, gotchas y qué revisar (incluida una guía para que el usuario corra Lighthouse en móvil y escritorio).

## Alcance autorizado
`src/**`, `index.html`, `public/**` (solo la foto y favicon/metadatos), `scripts/**`, `.gitignore`, `odd/tasks/fase-6-pulido.md`. No rediseñar las caras ni cambiar el contenido salvo lo imprescindible (p. ej. la ruta de la foto).

## Criterios de aceptación (los revisa el usuario)
- Hay loader con progreso y la entrada al libro se siente cuidada; sin parpadeos.
- En un teléfono (o ventana angosta en modo móvil) se ve una página a la vez, con swipe y botones; todo se puede leer, pulsar y rellenar.
- Con movimiento reducido activado, no hay animaciones largas ni deriva.
- Sin WebGL se ve la versión texto completa con un aviso.
- La foto pesa mucho menos y la página carga más rápido; Lighthouse cerca de las metas.

## Ruta
**delegated direct** — un writer (fork), trigger: ≥ 2 archivos no triviales.

## Gotchas previstos
- Vite devuelve `index.html` con 200 para rutas inexistentes: no sondear archivos; usar el manifest/banderas.
- `<Html transform>` (hotspots/formulario) debe seguir alineado al cambiar el encuadre móvil.
- Cero `setState` por frame en la escena; usar refs y `maath` damp.
- Texturas 2× y `@mobile` ya existen (manifest); no re-exportar caras salvo necesidad.

## Qué se hizo (por tarea)
- **T1 Loader** — `src/ui/Loader.tsx` + `src/lib/loadProgress.ts`. Progreso real: manifiesto (5 %) + texturas base de las caras (85 %, cuenta también las que fallan para no colgarse) + fuentes (10 %). Mínimo visible 700 ms, fundido de 600 ms, red de seguridad de 12 s. `role="progressbar"` y aviso `role="status"` por cuartos. Botón "Ver versión texto" dentro del propio loader; con la versión texto abierta el loader no se monta. Para que pinte antes que three.js, `Experience` se carga con `lazy` + `Suspense` (chunk aparte).
- **T2 Entrada y deriva** — `CameraRig.tsx`: al empezar en la tapa la cámara está alejada (`INTRO_PULLBACK`/`INTRO_RISE`) y llega a la pose cerrada cuando el loader empieza a desvanecerse (`markEntered`). Con el libro cerrado (solo pose `closed`) hay una deriva suave (`DRIFT_*`) que se apaga al abrir. El título hero aparece 900 ms después (`delay-[900ms]` en `Overlay`). Sin entrada si se llega por un hash (deep link) ni con reduced-motion.
- **T3 Móvil: una página a la vez** — ver "Enfoque móvil" abajo.
- **T4 Reduced-motion** — `src/lib/motion.ts` (`motion.reduced`, vivo con el cambio de preferencia): hojas casi instantáneas (×0.01), sin escalonado, sin levantar esquinas, libro y cámara sin suavizado, sin entrada ni deriva; CSS global que deja transiciones/animaciones en 0.01 ms y sin retardo; capa de botones sin fundido; videos solo con clic (ya estaba); loader sin fundido.
- **T5 Fallback sin WebGL** — `src/lib/webgl.ts` (`hasWebGL`), `src/scene/SceneBoundary.tsx` (error boundary, también cubre el fallo del chunk lazy) y `src/ui/SceneNotices.tsx`. Sin WebGL o con error: la versión texto es la página, con aviso (`role="alert"`) y, si fue un error, botón "Reintentar el libro 3D". Si el navegador pierde el contexto a mitad de sesión: diálogo "Se perdió la escena 3D" con Reintentar (remonta la escena) y "Ver versión texto"; si el contexto vuelve solo, el diálogo desaparece.
- **T6 Rendimiento, SEO, A11y** — foto `imagenAvaarJJ.jpg` 1899 KB → `imagenAvaarJJ.webp` 93 KB (900 px de ancho, calidad 82; `node scripts/optimize-photo.mjs`; el original quedó en `scripts/source-images/`, ignorado por git); `person.photo` apunta al WebP. Canvas: `frameloop="never"` con la pestaña oculta; en móvil `dpr` máx. 1.5, sombra 1024, ContactShadows 512 y sin MSAA. `index.html`: `lang="es"`, título y descripción con tilde (Pérez), `theme-color`, `color-scheme`, Open Graph y Twitter básicos (sin imagen: la OG va en la Fase 7), favicon SVG (`public/favicon.svg`), `<noscript>`. El hero del overlay ya no es un `<h1>` (el h1 único está en la versión texto). Imagen de la versión texto con `width/height`, `lazy` y `decoding="async"`.
- **T7 Cierre** — `npx tsc --noEmit` limpio (sin build ni servidor).

## Enfoque móvil (decisión del writer)
- **Cuándo:** `COMPACT_QUERY` en `useBook.ts`: `(max-width: 767px), (max-aspect-ratio: 4/5)` (teléfonos y ventanas angostas o en retrato). Se lee al arrancar y `useCompactMode` lo mantiene al girar el equipo.
- **Encuadre:** el libro sigue siendo el mismo (mismos giros de hoja, hash y `setTarget`); solo cambia la cámara. Con un spread abierto la cámara casi cenital (`COMPACT_OPEN_POSE`) encuadra **una cara** (`COMPACT_FILL` 0.96 del ancho) centrada en la izquierda o la derecha según `faceSide` (nuevo en el store, izquierda o derecha, vuelve a la izquierda cuando cambia el spread). Cerrado (tapa / contraportada) la cámara se aleja hasta que el libro cabe en el ancho (`COMPACT_CLOSED_FILL` 0.9) y se centra en él.
- **Navegación:** `nextFace`/`prevFace` (izquierda → derecha del spread → siguiente spread; al retroceder cae en la cara derecha del anterior). Swipe horizontal rápido con el zoom en 1× (`SWIPE_MIN_PX` 48, `SWIPE_MAX_MS` 800, `SWIPE_HORIZONTAL_RATIO` 1.5) y botones ‹ › de 44 px (`FaceNav.tsx`) con el nombre de la sección y dos puntos izquierda/derecha. Las flechas del teclado también avanzan por caras. Tocar la página con un spread abierto no pasa de hoja (en tapa y contraportada sí abre/cierra).
- **Zoom:** pellizco con dos dedos (zoom al punto medio) y arrastre con un dedo cuando hay zoom; cada cambio de cara restablece el zoom. `ZoomView.spanHalf` limita el desplazamiento a la cara visible.
- **Texturas:** en móvil se cargan las `@mobile` (800×550) como base y, al hacer zoom ≥ 1.4×, las de 1600×1100 en lugar de las 2× (mismo mecanismo y límites de memoria). Se decide al crear el libro; girar el equipo después no recarga.
- **Botones táctiles:** las zonas pequeñas crecen alrededor de su centro hacia 44 px (máx. ×1.8 para no pisar a las vecinas, `TOUCH_TARGET_PX`/`TOUCH_MAX_GROWTH` en `SpreadHotspots.tsx`); con pellizco se agrandan más. El formulario impreso de la contraportada mide unas decenas de píxeles en un teléfono, así que ahí hay un botón grande "Escribir un mensaje" que abre `ContactSheet.tsx` (misma `ContactForm`, `role="dialog"`, Esc/botón/fondo cierran).
- **Overlay:** el botón "Ver versión texto" pasa a la izquierda sobre la fila de botones del pie; el zoom queda a la derecha; el botón "Contacto" de la barra se oculta bajo 480 px (el menú hamburguesa lo tiene).

## Constantes de ajuste
| Dónde | Constante | Valor |
|---|---|---|
| `src/lib/loadProgress.ts` | `SAFETY_MS` / `FONTS_MAX_MS` / pesos | 12000 / 3000 / 5-85-10 % |
| `src/ui/Loader.tsx` | `MIN_VISIBLE_MS` / `FADE_MS` | 700 / 600 |
| `src/scene/CameraRig.tsx` | `INTRO_PULLBACK` / `INTRO_RISE` / `INTRO_SMOOTH` | 0.55 / 0.9 / 0.9 s |
| | `DRIFT_AMPLITUDE` / `DRIFT_SPEED` / `DRIFT_FADE` | [0.07, 0.025, 0.04] / 0.33 / 1.2 s |
| | `COMPACT_FILL` / `COMPACT_CLOSED_FILL` / `COMPACT_OPEN_POSE` | 0.96 / 0.9 / [0, 3.3, 0.78] → [0, 0, 0.4] |
| `src/scene/Book.tsx` | `REDUCED_FLIP_SCALE` / `REDUCED_LAYOUT_SMOOTH` | 0.01 / 0.0001 |
| `src/scene/ZoomInput.tsx` | `SWIPE_MIN_PX` / `SWIPE_MAX_MS` / `SWIPE_HORIZONTAL_RATIO` | 48 / 800 / 1.5 |
| `src/scene/Experience.tsx` | `DPR_RANGE_COMPACT`, `SHADOW_MAP`, `CONTACT_SHADOW_RESOLUTION`, `MSAA_SAMPLES` | [1, 1.5], 2048/1024, 1024/512, 4/0 |
| `src/scene/SpreadHotspots.tsx` | `TOUCH_TARGET_PX` / `TOUCH_MAX_GROWTH` | 44 / 1.8 |

## Gotchas
- En desarrollo `StrictMode` crea los materiales/texturas dos veces: el loader cuenta las descargas de las dos copias y puede llegar al 100 % algo antes. En producción no pasa.
- `drei <Html>` monta su propio root de React: el contexto de React no llega a la capa de botones, por eso `touchPx`/`compact` se pasan por props.
- El `stopPropagation` de React dentro de la capa Html evita que `ZoomInput` (escucha en el contenedor de R3F) reciba el puntero del formulario; en `ContactSheet` se usa el mismo truco para que Esc no cierre además el libro.
- `isEntered()` se lee sin suscribirse dentro de `useFrame`; la entrada de cámara depende de que el loader llame a `markEntered` (también lo hace al saltar a la versión texto).
- `COMPACT_QUERY` incluye ventanas de escritorio muy angostas: ahí también se ve una página a la vez (intencional).
- Al girar el teléfono a horizontal (ratio > 4/5) vuelve el spread completo, pero con las texturas `@mobile` que ya se cargaron.
- `ContactShadows frames={Infinity}` sigue repintando cada cuadro (mantiene la sombra del libro al abrirlo); en móvil solo bajé su resolución.
- Lighthouse puede marcar "Los elementos `<video>` no tienen `<track>`" en la versión texto (videos mudos con controles); si aparece, añadir pistas vacías o quitarlos de esa vista.
- Nada de esto se vio en un navegador: el encuadre móvil (`COMPACT_OPEN_POSE`, `COMPACT_FILL`), la sensación del swipe y el tamaño real de las zonas táctiles son lo primero que puede necesitar ajuste.

## Qué revisar (usuario)
1. Carga: loader con barra y "JJ", sin parpadeo; al salir, la cámara se acerca al libro y el título aparece un poco después. Con la versión texto abierta desde el loader no debe quedar nada tapando.
2. Móvil (DevTools → modo dispositivo, 390×844, o un teléfono): una cara por pantalla, swipe y botones ‹ ›, pellizco para ampliar, tocar los botones de las páginas, abrir "Escribir un mensaje" en la contraportada, menú hamburguesa y "Ver versión texto" sin solaparse. Probar también volver a escritorio redimensionando.
3. Reduced-motion (DevTools → Rendering → Emulate prefers-reduced-motion): hojas y cámara instantáneas, sin deriva ni entrada, videos solo con clic.
4. Sin WebGL: desactivar la aceleración por hardware del navegador (o usar uno sin WebGL) → versión texto con aviso. Para probar la pérdida de contexto, en la consola: `document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()`.
5. Foto: la cara "Sobre mí" y la versión texto muestran la foto nítida (93 KB).
6. Consola (F12) sin errores en rojo.

## Guía Lighthouse (la corre el usuario)
- Ejecutar sobre el build, no sobre el servidor de desarrollo: `npm run build && npm run preview` y abrir `http://localhost:4173` en una ventana de incógnito (sin extensiones).
- DevTools → Lighthouse. Dos pasadas: **Móvil** y **Escritorio**; categorías Performance, Accessibility, Best Practices y SEO; modo "Navegación".
- Metas (SPEC §6): Performance ≥ 80, Accessibility ≥ 95, SEO ≥ 95. En móvil, el rendimiento dependerá de la GPU del equipo; la nota del escritorio es la referencia principal. Repetir 2–3 veces y tomar la mediana.
- Si el SEO baja por "no tiene enlace canónico" u "Open Graph sin imagen/URL": son de la Fase 7 (despliegue). Si Performance se queda corto, lo más probable es el peso de three.js (chunk de la escena) y las texturas; pasarme el informe y se ajusta.
