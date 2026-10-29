# Zoom inmersivo continuo (rueda + arrastre)

Estado: escrito (tsc OK; 2× exportado para las caras 1–4); pendiente de validación visual del usuario · Decisión del usuario: zoom **continuo con rueda y arrastre** (no por niveles) para las dos páginas del spread abierto, para hacerlo más inmersivo y legible.

## Comportamiento
- **Rueda:** zoom continuo de 1× (encaje) a ~2.5×, hacia el punto bajo el cursor (el punto del libro bajo el cursor permanece bajo el cursor). Solo con el libro abierto (páginas 1–9). `preventDefault` en la rueda sobre el canvas; no actúa sobre el overlay.
- **Arrastrar:** desplaza la vista cuando hay zoom (> ~1.05×). Con límites para no salirse del libro (margen pequeño). Distinguir clic de arrastre (umbral ~5 px): un arrastre no pasa página ni dispara hover.
- **Doble clic:** alterna 1× ↔ ~2× en el punto del cursor. Teclas: `Z` alterna, `+` / `-` ajustan, `0` restablece.
- **Con zoom ≥ ~1.3×:** el clic en la página NO pasa de hoja (así se podrán usar enlaces y seleccionar texto en la Fase 5); ← → siguen pasando páginas y aparecen flechas visibles en los bordes de la pantalla. El hover de esquina se desactiva con zoom.
- **Esc:** si hay zoom, primero restablece el zoom; con zoom 1×, mantiene el comportamiento actual (cerrar libro).
- **Inclinación:** al subir el zoom, la cámara se va enderezando hacia una vista casi cenital (menos escorzo = texto más legible). Interpolar entre la pose `open` y una pose cenital según el nivel de zoom.
- **Parallax del mouse** (si existe) se reduce o apaga con zoom.
- **Movimiento:** todo con `maath` damp en `useFrame` y refs; cero `setState` por frame. Con `prefers-reduced-motion`, sin amortiguación (salto directo).
- **Cambio de página con zoom:** el zoom se conserva; el desplazamiento se recentra suavemente en el nuevo spread.
- **UI mínima (overlay):** control de zoom discreto abajo-derecha (lupa, nivel "1.0×", botón restablecer), flechas laterales visibles solo con zoom ≥ 1.3×, cursor `zoom-in`/`grab`/`grabbing` según estado. Estilo glass del kit, sin competir con el libro.

## Nitidez (texturas 2×)
- El script `npm run pages:export` debe poder exportar `page-NN@2x.webp` (3200×2200, calidad ~85) con `--scale=2` (y por defecto exportar también el 2× de las caras ya diseñadas) y registrarlas en `manifest.json`.
- En runtime, cargar bajo demanda las texturas 2× **solo del spread visible** cuando el zoom pase de ~1.4×; liberarlas (`dispose`) al volver a ≤ 1.2× o al alejarse más de un spread. Máximo ~4 caras 2× residentes. Mantener anisotropía y sRGB. Si no hay 2× para una cara, usar la 1×.

## Alcance
Solo el zoom y lo necesario (cámara, entrada de puntero, texturas 2×, controles overlay). No tocar el diseño de las caras ni la lógica de giro de hojas salvo lo imprescindible para ignorar clics durante arrastre/zoom.

## Tareas
- [x] **T1** Estado de zoom (nivel, centro/desplazamiento) en una estructura no reactiva (ref/módulo) con suscripción puntual para la UI; hook de entrada (rueda, arrastre, doble clic, teclas) en el canvas.
- [x] **T2** `CameraRig`: aplicar zoom hacia el cursor, pan con límites, enderezado progresivo, damp.
- [x] **T3** `Book.tsx` / `useBookKeys.ts`: ignorar clics tras arrastre y con zoom ≥ 1.3×; desactivar hover con zoom; Esc en dos pasos; flechas siguen funcionando.
- [x] **T4** `export-pages.ts` con 2× + manifest; `bookTextures.ts` con carga/liberación perezosa de 2× según zoom y spread.
- [x] **T5** `src/ui/ZoomControls.tsx` (lupa, nivel, restablecer, flechas laterales) montado en `Overlay`/`App`.
- [x] **T6** Exportar con `npm run pages:export` las caras 0–4 a 2×.

## Criterios de aceptación (los revisa el usuario)
- La rueda hace zoom suave hacia el cursor y arrastrar mueve la vista; doble clic y `Z` alternan.
- Con zoom, el texto de las páginas se ve claramente más nítido que sin zoom.
- Con zoom no se pasa página por accidente; ← → y las flechas visibles sí; Esc restablece.
- Sin zoom todo funciona como antes (clic pasa página, hover, saltos por hash).
- Sin errores en consola; sin caídas notables de fps.

## Ruta
**delegated direct** — un writer (fork), trigger: ≥ 2 archivos no triviales.

## Desviaciones respecto al diseño inicial
- **Doble clic solo restablece el zoom** (no acerca desde el encaje): en 1× cada clic pasa de hoja, así que un doble clic pasaría dos páginas. Para acercar: rueda, `Z`, `+` o los botones.
- **El desplazamiento se conserva al cambiar de página** (en vez de recentrarse): el libro abierto está siempre en el mismo sitio, así que se sigue leyendo la misma zona.
- Cara 0 (tapa) no tiene versión 2×: nunca se ve con zoom.

## Constantes de ajuste
| Dónde | Constante | Valor | Qué hace |
|---|---|---|---|
| `src/scene/zoomCamera.ts` | `ZOOM_MIN` / `ZOOM_MAX` | 1 / 2.5 | Límites del zoom |
| | `WHEEL_SENSITIVITY` | 0.0016 | `zoom *= exp(-delta·k)`; una muesca de 100 px ≈ ±17 % |
| | `PINCH_SENSITIVITY` | 0.012 | Pellizco del trackpad (rueda con Ctrl) |
| | `BUTTON_ZOOM_STEP` | 1.25 | Pasos de `+` / `-` y botones |
| | `TOGGLE_ZOOM_LEVEL` | 2 | Zoom de la tecla `Z` desde el encaje |
| | `ZOOM_SNAP_FIT` | 1.03 | Por debajo vuelve exactamente a 1 y recentra |
| | `PAN_MIN_LEVEL` | 1.05 | Desde aquí el arrastre desplaza |
| | `DRAG_THRESHOLD_PX` | 5 | Recorrido para que un clic sea arrastre |
| | `ZOOM_CLICK_BLOCK` | 1.3 | Desde aquí el clic no pasa de hoja y no hay hover de esquina |
| | `ZOOM_SMOOTH_TIME` / `INPUT_ACTIVE_MS` | 0.28 s / 1000 ms | Suavizado rápido durante el zoom (los cambios de pose siguen con 0.7 s) |
| | `STRAIGHTEN_FROM/TO/MAX` | 1 / 2.2 / 0.75 | Enderezado hacia vista cenital (MAX < 1: nunca exactamente vertical) |
| | `PAN_MARGIN` | 0.12 | Escritorio extra visible al borde del libro |
| `src/scene/bookTextures.ts` | `HIRES_LOAD_LEVEL` / `HIRES_RELEASE_LEVEL` | 1.4 / 1.2 | Histéresis de carga / liberación de las caras 2× |
| | `HIRES_MAX_FACES` / `HIRES_KEEP_SPREADS` | 4 / 1 | Caras 2× en GPU a la vez / spreads de distancia que se conservan |
| `src/scene/CameraRig.tsx` | `REDUCED_MOTION_SMOOTH_TIME` | 0.0001 | Con `prefers-reduced-motion` el zoom sigue al objetivo sin suavizado |
| `scripts/export-pages.ts` | `HIRES_QUALITY` / `HIRES_SKIP` | 85 / {0} | Calidad del 2× y caras sin 2× |

## Cómo se comporta
- Rueda: zoom hacia el cursor (el punto del escritorio bajo el cursor se mantiene). Arrastrar: desplaza con captura de puntero. `Z` alterna, `+`/`-` ajustan, `0` restablece, doble clic restablece, `Esc` restablece primero y luego cierra el libro.
- Con zoom ≥ 1.3×: clic no pasa de hoja, sin hover de esquina; ← → y flechas laterales siguen pasando de página. Al salir del libro abierto (página 0 o 10) el zoom se restablece solo.
- Controles: abajo a la derecha (− nivel + restablecer) y flechas laterales con zoom ≥ 1.3×.
- Texturas 2× (`page-NN@2x.webp`, 3200×2200) solo del spread visible y solo con zoom > 1.4×; se liberan por debajo de 1.2× o a más de un spread de distancia (máx. 4 caras).

## Gotchas
- Toda la matemática usa la cámara *objetivo* (no la suavizada), por eso la rueda repetida no deriva. El punto anclado converge al cursor con el suavizado.
- Para el clic tras arrastre se usa `zoomState.dragged` (se reinicia en el siguiente `pointerdown`), no el filtro interno de R3F.
- La cara 2× reemplaza los píxeles del mismo `Texture` (`dispose()` + `image` + `needsUpdate`) y al liberar vuelve a la imagen 1× guardada; nunca se sondea la URL (Vite devuelve `index.html` con 200 si no existe): la lista `hires` del `manifest.json` es la fuente de verdad.
- Las 2× de las caras de la 4B se generan con `npm run pages:export` (por defecto exporta 1× y 2×; `--scale=2` solo las 2×).
- No verificado visualmente: sensación de la rueda (sensibilidad), recorte del pan en ventanas muy anchas o estrechas, y la nitidez real del 2× en pantalla.
