# Fase 2 — Escena del escritorio

Estado: escrito, pendiente de prueba manual · Brief: `odd/briefs/fase-2.md` · Sin build/tests (el usuario prueba en localhost).

## Checklist
- [x] T1 Dependencias: three, @react-three/fiber@^8, @react-three/drei@^9, @react-three/postprocessing@^2, maath, @types/three
- [x] T2 `src/scene/Desk.tsx` (madera procedural CanvasTexture; `public/textures/desk/` listo para PBR)
- [x] T3 `src/scene/Props.tsx` (taza + plato, lápiz, maceta, tarjeta JJ)
- [x] T4 `src/scene/ClosedBook.tsx` (libro provisional, rotZ ≈ -8°, corrido a la derecha)
- [x] T5 `src/scene/CameraRig.tsx` (pose "cerrado", damp con maath, sin setState por frame)
- [x] T6 `src/scene/Experience.tsx` (Canvas, SpotLight, ContactShadows, Vignette/Bloom/Noise, dpr, AdaptiveDpr, PerformanceMonitor)
- [x] T7 `src/ui/Overlay.tsx` + `A11yContent` sr-only con toggle + `App.tsx` + `index.css`
- [x] T8 Actualizar `odd/STATE.md`

## Verificación (manual, usuario)
Escritorio oscuro con pool de luz central y esquinas negras, props cortados por bordes, libro cerrado rotado (ref. 01); overlay con logo, "Contáctame" y titular; toggle de texto; sin errores en consola.

## Resultado (Fase 2 escrita)
Estado: escrita; `tsc --noEmit` y `npm run build` OK (verificados por el orquestador); pendiente de validación visual del usuario en http://localhost:5173 (no se levantó con `--host 127.0.0.1`: en Windows `localhost` puede resolver a ::1).

## Constantes de ajuste
- Luz: `KEY_LIGHT`, `FILL`, `POST` en `src/scene/Experience.tsx`.
- Cámara: `CAMERA_POSES.closed`, `CAMERA_FOV` en `src/scene/CameraRig.tsx`.
- Props: `CUP`, `PENCIL`, `PLANT`, `CARDS` en `src/scene/Props.tsx`.
- Libro provisional: `BOOK_POSITION`, `BOOK_YAW_DEG` y medidas en `src/scene/ClosedBook.tsx`.
- Madera: `TEXTURE_REPEAT`, `BUMP_SCALE` en `src/scene/Desk.tsx` (procedural; PBR real → soltar mapas en `public/textures/desk/`).

## Gotchas
- Luces físicas (three 0.180): el foco va en candelas; intensidades de cientos.
- `ContactShadows` en `frames={90}` (estático): pasar a continuo cuando el libro se anime (Fase 3).
- Orientación del logo en la tapa sin verificar visualmente.
- `body` con `overflow: hidden`; la versión texto hace scroll en su contenedor.
- Versiones: React 18.3, Vite 7, TS 5.9, Tailwind 3.4, zustand 5, three 0.180, fiber 8.18, drei 9.122, postprocessing 2.19, maath 0.10.

## Siguiente
Fase 3 — Libro 3D (sustituye `ClosedBook`; tapas, lomo, hojas con huesos, abrir/cerrar, paso de página, hover, teclado). Decisión pendiente: contraportada exterior como textura aparte.
