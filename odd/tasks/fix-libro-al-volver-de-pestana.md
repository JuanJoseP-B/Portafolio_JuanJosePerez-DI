# Fix — el libro se desordena al volver de otra pestaña

Estado: escrito (tsc OK; repro con Playwright antes/después en headless con GL por software); pendiente de validación del usuario · Reporte del usuario: "cuando abro un link de demo y vuelvo al portafolio, se bugea con las páginas del libro: algunas se interponen, otras desaparecen, y el navegador de caras de la esquina inferior izquierda a veces no las reconoce y queda en un bucle donde presionar una página no ejecuta ninguna acción. Cada página debe quedarse donde está y no sobreponerse a otras."

## Contexto y sospechas (a verificar, no asumir)
- Los enlaces de demo abren en pestaña nueva (`target="_blank"`), así que el usuario vuelve tras tener la pestaña oculta (`visibilitychange`, `blur/focus`, posible pérdida de rAF).
- Fase 6 añadió: render suspendido con la pestaña oculta, `frameloop`, loader/entrada, modo compacto (una cara a la vez), `FaceNav` (botones abajo a la izquierda), capa `<Html>` de hotspots que se desmonta mientras gira.
- Sospechas: (1) un `delta` enorme tras reanudar el bucle que salta o descompone la animación de hojas (`leafRig`, damp/`maath`), (2) máquina de estados `page`/`target`/giros en curso desincronizada si el bucle se pausa a mitad de un giro o si un `setTimeout` se acelera/ralentiza en segundo plano, (3) `hashchange`/`popstate`/`pageshow` (bfcache) que reescribe `target` por el eco del hash, (4) el estado de zoom/arrastre/puntero que se queda "pegado" (pointer capture perdido, `dragged`, hover de esquina) y bloquea clics, (5) `<Html>` o hotspots montados sobre un spread viejo, (6) orden de dibujado/`renderOrder`/z-fighting de hojas que quedan a medio camino.

## Tareas
- [x] **T1 Reproducir y diagnosticar.** Intentar reproducir con Playwright (una sola vez, puerto libre o el 5173 si ya está activo; apagar lo que se lance): abrir el libro, pasar varias hojas, simular ocultar/mostrar la pestaña (anulando `document.hidden` y disparando `visibilitychange`, y abriendo/cerrando una pestaña real con `context.newPage()`), y comprobar el estado (`page`, `target`, ángulos de hojas, `renderOrder`). Si no se puede reproducir en headless, razonar por código y dejar la evidencia. Registrar la causa raíz con `archivo:línea`.
- [x] **T2 Corregir la causa raíz.** Que cada hoja termine siempre en su posición de reposo (izquierda o derecha, apilada) sin solaparse, que la máquina de estados siempre pueda converger (`page === target` y sin giros pendientes) y que no se produzca un bucle donde los clics no hagan nada. Medidas probables, a confirmar con T1: acotar `delta`; al volver a ser visible, reconciliar (asentar de golpe las hojas al estado de `page`/`target` y limpiar giros, zoom/arrastre/hover pegados); no depender de timers para avanzar el estado; un vigilante que detecte desincronización (hojas en tránsito sin giro activo) y la resuelva.
- [x] **T3 FaceNav y entrada.** Revisar el navegador de caras de la esquina inferior izquierda (modo compacto y escritorio): que reconozca siempre el spread/cara actual, que nunca quede en un estado donde ignora pulsaciones, y que respete `page`/`target` tras volver de otra pestaña.
- [x] **T4 Verificación y cierre.** `npx tsc --noEmit`; la repro de T1 (si fue posible) pasando; documentar causa, arreglo, constantes y qué debe probar el usuario (abrir demo, volver, pasar páginas, usar el navegador de caras, repetir varias veces y con la pestaña oculta mucho tiempo).

## Alcance autorizado
`src/scene/**`, `src/store/useBook.ts`, `src/ui/FaceNav.tsx`, `src/ui/Overlay.tsx`, `src/ui/SceneNotices.tsx`, `src/lib/**`, `scripts/` (solo scripts de repro desechables dentro del scratchpad, no en el repo) y este documento. No cambiar el diseño de las caras ni el contenido.

## Criterios de aceptación (los revisa el usuario)
- Tras abrir un enlace de demo (pestaña nueva) y volver, todas las hojas están en su sitio, sin solaparse ni desaparecer.
- El navegador de caras responde siempre y los clics en las páginas siguen pasando de hoja.
- Pasar páginas rápido, ocultar la pestaña a mitad de un giro y volver no rompe el libro.

## Ruta
**delegated direct** — un writer (fork), trigger: mapeo + ≥ 2 archivos no triviales.

## Resultado

### Causa raíz (confirmada, no solo razonada)
- `src/scene/Experience.tsx:79` cambia `frameloop` a `'never'` cuando la pestaña se oculta y vuelve a `'always'` al mostrarla.
- En R3F 8.18 `setFrameloop` hace `clock.stop(); clock.elapsedTime = 0` (`node_modules/@react-three/fiber/dist/events-*.cjs.dev.js:1408-1416`, invocado desde la línea ~2042 al cambiar la prop).
- `src/scene/Book.tsx` usaba ese reloj como tiempo absoluto: `now = state.clock.elapsedTime`, `a.t0 = now + …` al programar cada giro y `u = clamp((now - a.t0) / a.dur, 0, 1)`. Tras el reinicio `now` vuelve a ~0 pero los `t0` de los giros ya hechos siguen siendo grandes: `u` pasa a 0 y `a.p = a.from`. Todas las hojas que se habían girado **retroceden a su posición de partida** (libro "cerrado" aunque `page`/`target` dicen 5) y vuelven a girar solas cuando el reloj alcanza de nuevo sus `t0` (decenas de segundos después). Eso son las páginas que se solapan, desaparecen y reaparecen.
- El "buscador" de la esquina inferior izquierda es el panel de depuración (`src/ui/DebugHud.tsx`, solo en desarrollo; en compacto es `FaceNav`). Hace `setTarget(n)`: si `n === target` (el store cree que ya está ahí) no cambia nada y `Book` no programa giros (`want === wantRef.current`), así que con las hojas desincronizadas pulsar la página actual "no hace nada" y pulsar otra solo reprograma las hojas intermedias, dejando el resto mal. Ese es el bucle.
- Evidencia (repro `repro.mjs`, scratchpad): antes del arreglo, tras ocultar/mostrar la pestaña el HUD decía `page 5 · target 5` y la captura mostraba el libro cerrado; 12 s después reaparecía abierto en el spread 5. Después del arreglo la captura inmediata muestra el spread 5 intacto.

### Arreglo
- `Book.tsx`: línea de tiempo propia `timeRef` que solo avanza con `delta` (acotado por `MAX_FRAME_DELTA = 0.25 s`), en vez de `clock.elapsedTime`. Ningún `t0` queda en el futuro tras un reinicio del reloj y una pausa larga ya no salta ni descompone la animación.
- `Book.tsx` (guardián en `useFrame`): una hoja en reposo (`u >= 1`) cuyo destino no coincide con el que dicta `target` se coloca de inmediato en su sitio (`from = to = p = rest`), y `p` se fija exactamente a `to` al terminar. Así el libro siempre converge a `page`/`target`, aunque otra causa lo desincronice.
- `Book.tsx`: al volver a estar visible (`visibilitychange`) o restaurarse de bfcache (`pageshow` persistido) se olvidan `hoveredSide` y `hoveredHotspot`: el `pointerleave` nunca llegó mientras la pestaña estaba oculta (el hotspot del enlace pulsado quedaba "hover" y apagaba el levantamiento de esquina).
- `ZoomInput.tsx`: al ocultarse la pestaña se cancelan pan/pellizco/swipe en curso (el `pointerup` del clic en el enlace nunca llega), igual que ya hacía `blur`.
- `CameraRig.tsx`: la deriva usa su propio acumulador (`fx.time`) en vez de `clock.elapsedTime`, para que no salte de fase al reanudar.
- `FaceNav`/`useBook`: sin cambios; con las hojas siempre convergiendo, `page`/`target`/`faceSide` vuelven a describir lo que se ve.

### Constantes
| Dónde | Constante | Valor | Qué hace |
|---|---|---|---|
| `src/scene/Book.tsx` | `MAX_FRAME_DELTA` | 0.25 s | Paso máximo de la línea de tiempo de giros por fotograma |

### Gotchas
- Cualquier animación que guarde instantes absolutos (`t0`) debe usar un reloj propio: `state.clock.elapsedTime` se reinicia a 0 en cada cambio de `frameloop`.
- Con `frameloop='never'` no hay fotogramas, así que un giro a medias al ocultar la pestaña continúa donde se quedó al volver (no se corta ni se salta).
- En el entorno de la repro (SwiftShader, sin GPU) el render va a ~1 fps: los giros largos no terminaban dentro del tiempo de espera de los tests; solo el caso "volver a la pestaña con el libro asentado" quedó verificado visualmente.

### Qué debe probar el usuario
1. Ir a un spread lejano (p. ej. proyectos), abrir un enlace de demo (pestaña nueva), esperar 10–30 s, volver: las hojas deben estar exactamente como las dejó, sin solaparse ni parpadear.
2. Repetirlo varias veces y con la pestaña oculta mucho tiempo (varios minutos).
3. Ocultar la pestaña a mitad de un salto de varios spreads y volver: el giro termina y queda asentado.
4. Pulsar en el panel inferior izquierdo (dev) la página actual y otras: siempre responde. En móvil, probar `FaceNav` igual.
5. Comprobar que zoom, arrastre, hotspots y el hover de esquina siguen igual, y la consola sin errores.
