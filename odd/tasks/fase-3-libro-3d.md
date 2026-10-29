# Fase 3 — Libro 3D

Estado: escrita; `tsc --noEmit` limpio; pendiente de validación visual del usuario · Fuente: `SPEC.md` §5 + `portafolio-libro-kit/docs/03` (modelo 3D) y `docs/04` (timings). Sin build/tests por parte de Claude (el usuario prueba en localhost).

## Objetivo
Sustituir `ClosedBook` por el libro real: tapas, lomo, hojas con `SkinnedMesh` y 30 huesos, texturas placeholder numeradas, abrir/cerrar, paso de página con curvatura y sombra, hover de esquina y teclado. Cada spread del mapa `src/lib/spreads.ts` debe poder mostrarse.

## Alcance autorizado
Solo Fase 3. Sin texturas finales de página (Fase 4), sin hotspots/video/menú/formulario (Fase 5), sin móvil/loader/reduced-motion (Fase 6).

## Contrato del libro (modelo físico)
- 10 hojas giratorias `L0..L9`. Cada hoja tiene frente y dorso → 20 caras, numeradas por cara física: `face(2i)` = frente de `Li`, `face(2i+1)` = dorso de `Li`.
- `L0` = tapa delantera: frente = textura de tapa (logo JJ); dorso = cara 1.
- Spread `k` (k = 1..9) muestra: izquierda = dorso de `L(k-1)` = cara `2k-1`; derecha = frente de `Lk` = cara `2k`. Hojas `L0..L(k-1)` giradas a la izquierda; el resto a la derecha.
- `page` 0 = ninguna hoja girada (libro cerrado, corrido a la derecha, rotZ ≈ -8°). `page` 10 = todas giradas y el libro cerrado mostrando la **contraportada exterior** (textura aparte `back-cover`, no una de las 20 caras). Cara 19 (dorso de `L9`) es papel en blanco.
- Los números de cara son físicos; el **contenido** va por spread (mapa de `docs/02` + contenido recibido): sp.1 Índice|Bienvenida, sp.2 Acerca de mí|Académica y laboral, sp.3 Intro+ARGOS, sp.4 ARGOS deep dive, sp.5 SegundoAire, sp.6 ArcoFisio, sp.7 Testimonios, sp.8 Stack y Arquitectura, sp.9 vacía|"Gracias por hojear".
- Un único archivo de configuración (`src/scene/bookLayout.ts`) define hojas, caras y qué textura va en cada una, para poder cambiar la numeración sin tocar la escena.

## Tareas
- [x] **T1** `bookLayout.ts` + texturas placeholder numeradas (canvas; número grande, etiqueta del spread, alternancia claro/oscuro) y textura de tapa y contraportada. Estructura lista para cargar `public/textures/pages/page-NN.webp` si existe, con fallback al placeholder.
- [x] **T2** `Page.tsx`: `SkinnedMesh` (BoxGeometry 1.28×0.88×0.003, 30 segmentos X, 30 huesos en cadena, x=0 en el lomo), materiales frente/dorso/canto; curvatura `bend·sin(πt)·(i/N)` durante el giro; sombra proyectada.
- [x] **T3** `Book.tsx`: tapas (+4 %, grosor 0.02, material cover), lomo, pila de hojas con grosor real (offset Z por índice), libro rotado/centrado según estado abierto/cerrado. Sustituye a `ClosedBook.tsx`.
- [x] **T4** Animación en `useFrame` con refs y `maath` (cero `setState` por frame): giro de hoja 0.9 s, apertura de tapa 1.1 s, encadenado de hojas cada 120 ms al saltar varios spreads, cierre por detrás (page 10) con rotación del libro.
- [x] **T5** Interacción: clic mitad derecha/izquierda (adelante/atrás; clic en la tapa cerrada abre), hover de esquina (se levanta ~-0.12 rad, cursor `pointer`), teclado ← → Enter Esc, `useBook` extendido con lo mínimo (p. ej. `next`/`prev`), sincronía con hash y `DebugHud`.
- [x] **T6** `CameraRig`: poses `closed`, `open`, `closedBack` con transición suave (más cerca y más cenital abierto); `ContactShadows` continuo; el titular del `Overlay` hace fade al abrir.

## Criterios de aceptación (los revisa el usuario)
- Clic en el libro cerrado → la tapa se abre con curvatura y la cámara se acerca.
- Clic derecha/izquierda pasa/retrocede una hoja con curvatura y sombra; se ve el dorso al cruzar.
- Saltar desde el panel de debug o el hash a `#proyectos/argos` hojea varias hojas encadenadas.
- Cada spread muestra sus dos caras placeholder numeradas con su etiqueta; page 10 muestra la contraportada; Esc cierra.
- Hover levanta la esquina libre; cursor `pointer`.
- 60 fps en laptop media; sin errores en consola.

## Ruta y evidencia
Ruta: **delegated direct** — un writer (fork), trigger: ≥ 2 archivos no triviales. Exploración previa hecha en el padre.

## Verificación
Pendiente: prueba manual del usuario.

## Siguiente paso
Fase 4 — 20 caras diseñadas (necesita datos: bio, foto, proyectos, etc.; se piden antes de empezar).

## Constantes de ajuste
- `src/scene/Book.tsx`: `FLIP_SECONDS`, `COVER_FLIP_SECONDS`, `STAGGER_SECONDS`, `BEND_TOTAL` (curvatura), `HOVER_LIFT`, `HOVER_SMOOTH`, `LAYOUT_SMOOTH`, `LAYOUTS` (posición del lomo y giro del libro cerrado / abierto / cerrado por detrás), `HIT_HEIGHT`.
- `src/scene/leafRig.ts`: `RIGID_FRACTION` (parte de la hoja que casi no se curva), `COVER_STIFFNESS`.
- `src/scene/bookLayout.ts`: medidas (`PAGE_W/H`, `COVER_*`), `PITCH` (separación entre hojas), `STACK_BASE_Y`, mapa de caras `FACES`, `USE_PAGE_FILES`.
- `src/scene/CameraRig.tsx`: `CAMERA_POSES.open` / `closedBack`, `SMOOTH_TIME`.

## Gotchas
- Decisión: la contraportada es una hoja giratoria más (`L10`, 11 hojas en total): al pasar de la página 9 a la 10 se giran `L9` y `L10`, y el libro queda cerrado por detrás mostrando la textura `backCover` (Contactos). El dorso de `L9` (cara 19) es papel en blanco y solo se ve durante el giro.
- Numeración física de caras: spread k = caras 2k-1 y 2k. El contenido de las "caras 18 y 19" del texto original (vacía + "Gracias por hojear") corresponde a las caras 17 y 18. Fase 4 debe nombrar los componentes con esta numeración.
- Eje de giro = eje z (lomo) en el plano del escritorio; la curvatura usa `sin(2πp)` (positiva al inicio, negativa al final) para que la punta nunca atraviese la pila.
- La cara trasera de cada hoja tiene UVs recalculadas para leerse derecha al girarla; en `L0` se mapea al tamaño de página (el margen de la tapa repite el borde de la textura).
- `ContactShadows` ahora corre en continuo (`frames={Infinity}`): vigilar el rendimiento.
- Texturas: placeholders de 768×528 por canvas; `USE_PAGE_FILES = false` evita 20 peticiones 404 hasta que existan `public/textures/pages/page-NN.webp`.
- El estado `page` sigue igualando a `target` (salto inmediato); la animación vive en `Book.tsx` con refs.
- Verificado solo con `tsc --noEmit` (limpio); nunca se vio en pantalla.
