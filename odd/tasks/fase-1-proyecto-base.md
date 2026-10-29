# Fase 1 — Proyecto base

Estado: escrito, pendiente de prueba manual · Mirror Engram: `odd/fase-1-proyecto-base/tasks` · Fuente del plan: `SPEC.md` §5 + `portafolio-libro-kit/docs/07`.

## Objetivo
App Vite + React 18 + TypeScript (strict) + Tailwind v3 con tokens del kit, fuentes, contenido tipado en `src/content/portfolio.ts`, estado zustand y hash routing. `A11yContent` muestra las 9 secciones en HTML, visibles, con placeholders marcados (`outline: dashed`).

## Alcance autorizado
Solo Fase 1. Sin three/R3F (Fase 2). Sin Playwright/sharp (Fase 4). Sin ESLint (Fase 6). Raíz del repo = proyecto (`package.json` en raíz); `portafolio-libro-kit/` no se toca.

## Restricciones
- Contenido real solo el entregado por el usuario; lo demás `[PLACEHOLDER]` visible. Sin inventar citas, cifras, URLs.
- Artefactos técnicos en inglés (código, comentarios); textos de UI en español neutro; contenido del portafolio en español.
- Sin commits (SPEC §2: solo si el usuario lo pide). Sin ejecutar tests/build: el usuario prueba manualmente.
- TDD: no aplica (sin runner ni RED significativo; usuario valida manualmente en localhost). Verificación = estructural + manual del usuario.

## Mapa de spreads y hashes (fuente: SPEC §4/§7)
`page` 0 = libro cerrado · 1..9 = spreads · 10 = cerrado por detrás (contraportada).
| page | Contenido | Hash(es) |
|---|---|---|
| 0 | Escena inicial | `#inicio` |
| 1 | Índice \| Bienvenida + CV | `#bienvenida` |
| 2 | Acerca de mí \| Académica y laboral | `#sobre-mi`, `#experiencia` |
| 3 | Intro proyectos + ARGOS | `#proyectos` |
| 4 | ARGOS (deep dive, video hover) | `#proyectos/argos` |
| 5 | SegundoAire / FocusBlocks | `#proyectos/segundoaire` |
| 6 | ArcoFisio | `#proyectos/arcofisio` |
| 7 | Testimonios | `#testimonios` |
| 8 | Stack y Arquitectura | `#stack` |
| 9 | Respiro editorial (cara 18 vacía, 19 "Gracias por hojear") | `#fin` |
| 10 | Contraportada exterior = Contactos | `#contacto` |

## Tareas
- [x] **T1** Scaffold y config: `package.json`, `tsconfig*.json`, `vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `index.html`, `.gitignore`, `src/vite-env.d.ts`. _(escrito; pendiente de prueba manual)_
- [x] **T2** Tokens, fuentes y estilos: `src/styles/tokens.css` (copia de `design-system/`), `src/styles/index.css`, mapeo Tailwind, fuentes Google (Space Grotesk, Inter, JetBrains Mono, Instrument Serif Italic). _(escrito; pendiente de prueba manual)_
- [x] **T3** Contenido tipado: `src/content/portfolio.ts` con datos reales recibidos y placeholders. _(escrito; pendiente de prueba manual)_
- [x] **T4** Estado y hash routing: `src/lib/spreads.ts`, `src/store/useBook.ts` (page ↔ hash, popstate). _(escrito; pendiente de prueba manual)_
- [x] **T5** UI: `src/ui/A11yContent.tsx` (9 secciones, visible), `src/ui/Placeholder.tsx`, `src/ui/DebugHud.tsx`, `src/App.tsx`, `src/main.tsx`. _(escrito; pendiente de prueba manual)_

## Criterios de aceptación
- `npm install && npm run dev` arranca sin errores.
- Se ven las 9 secciones en HTML semántico con contenido real y placeholders con borde discontinuo.
- Cambiar el hash en la URL cambia `page` en el HUD y viceversa (botones del HUD cambian el hash); `popstate` funciona.
- `npm run typecheck` y `npm run build` deberían pasar (los ejecuta el usuario).

## Ruta y evidencia
Ruta: T1–T2 delegated direct (fork writer, cortado por modo plan); T3–T5 inline por decisión del usuario de reducir tokens.

## Verificación
Pendiente: prueba manual del usuario.

## Siguiente paso
Fase 2 — Escritorio (requiere: nada bloqueante; props como primitivas).
