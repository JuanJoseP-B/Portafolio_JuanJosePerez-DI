# Ajustes — Arquitectura (solo títulos), "Mi teclado" con logos y "git log" sin entradas de relleno

Estado: escrito (tsc OK; cara 16 re-exportada 1× y 2×); pendiente de validación visual del usuario · Pedido del usuario: "pequeños cambios para que el portafolio se mire mejor".

## Qué pidió el usuario (literal resumido)
1. **"Stack y Arquitectura":** reemplazar el bloque UML / vistas lógicas / Markdown ("Enfoque de ingeniería") por estos cuatro ítems, **mostrando solo los títulos** (sin las descripciones):
   - System Design & Escalabilidad
   - Cloud & Event-Driven Architectures
   - Low-Level System Integration
   - Rendimiento Híbrido C4I
   (Descripciones completas que dio el usuario, para guardarlas en los datos sin mostrarlas: FastAPI + PostgreSQL 16 validados con k6 y Docker Compose; flujos asíncronos serverless en AWS con Lambda, S3 event triggers y CloudWatch; manipulación del hardware y del SO desde la accesibilidad de Android hasta acelerómetros y motores hápticos; Rust vía Tauri con interfaces web para rendimiento nativo en aplicaciones críticas.)
2. **"Mi teclado" (stack):** buscar en la web el icono de cada lenguaje/herramienta y mostrar en cada tecla **solo el logo y el nombre**; quitar el subtexto de cada tecla (p. ej. "2 expedientes", "SegundoAire", "ARGOS", "[USO]").
3. **"git log — mi camino":** quitar las cinco entradas de relleno del handoff: `HEAD` (Quinto semestre en curso), `a3f9c21` (feat/argos), `7be04d8` (feat/segundoaire), `c51e7a0` (feat/arcofisio) y `init` (la última). Quedan solo las entradas reales (hackathons y diplomado).

## Alcance y decisiones
- **Arquitectura (1):** aplica a donde exista "Enfoque de ingeniería": la cara 16 del libro (spread 8, derecha; `Face16Architecture`) y la versión texto. Mantener el resto de esa cara (intereses y franja "Fuera del código"). Si los textos viven en `portfolio.ts` (`extra.approach` u otro), cambiar los datos (con campo `title` y la descripción guardada en `detail`, sin renderizarla) para que ambas vistas queden alineadas; **re-exportar la cara 16** (1× y 2×) y revisar la imagen (cuerpo ≥ 26 px, nada < 20 px, sin solapes).
- **Teclado (2):** solo la versión texto (sección "Mi teclado"). El muro de chips del libro (cara 15) no se toca. Los logos se **descargan al repo** (p. ej. `public/icons/tech/*.svg`) para no depender de un CDN en producción; fuentes recomendadas con licencia libre: `simple-icons` (CC0) y `devicon` (MIT), vía jsDelivr o npm solo para obtener los SVG. Para marcas que falten (p. ej. Java, Jetpack Compose, React Three Fiber, Room, AWS Lambda) buscar la alternativa más fiel; si no existe un logo oficial, usar el más cercano y **dejarlo anotado en este documento** (p. ej. Three.js para R3F, SQLite/Android para Room). Dejar un `README` corto en la carpeta de iconos con fuente y licencia. Tecla "presionada" de R3F se mantiene. Logos con buen contraste sobre la tecla oscura (color de marca; para logos oscuros usar variante clara), `alt=""`/`aria-hidden` en el icono con el nombre como texto accesible, tamaños ~28–32 px, sin romper el layout a 390 px.
- **Log (3):** eliminar esas cinco entradas de los datos de `portfolio.ts` y de la UI; no tocar las caras del libro ni `education`/`experience`. Con ello desaparecen los pendientes `[AÑO]`, `[TU ROL…]`, `[PRIMER HITO…]` y `[ESTADO]`/`[USO]` ligados a esas entradas/teclas; actualizar la lista de pendientes.
- No inventar contenido; solo lo que dio el usuario.

## Tareas
- [x] **T1 Datos y arquitectura:** actualizar `portfolio.ts` (cuatro ítems con `title` + `detail` guardado, sin mostrar detalle), versión texto y cara 16; re-exportar la cara 16 y revisarla.
- [x] **T2 Teclado con logos:** buscar y guardar los SVG, mapearlos en los datos del stack, quitar subtextos y `[USO]`, aplicar estilo; documentar fuentes/licencias y sustituciones.
- [x] **T3 Log:** quitar las cinco entradas de datos y UI.
- [x] **T4 Cierre:** `npx tsc --noEmit`; actualizar este documento (archivos, sustituciones de logos, pendientes que ya no aplican).

## Criterios de aceptación (los revisa el usuario)
- La cara 16 y la versión texto muestran solo los cuatro títulos en lugar de UML/Markdown; sin solapes ni cortes.
- "Mi teclado" muestra cada tecla con su logo y su nombre, sin subtexto.
- El "git log" ya no tiene HEAD, los tres proyectos ni `init`.

## Ruta
**delegated direct** — un writer (fork), trigger: ≥ 2 archivos no triviales + investigación web.

## Resultado
- **T1:** `extra.approach` ahora es `{ title, detail }[]` (tipo `ApproachItem`); solo se muestra `title` (cara 16 en 4 columnas de 34 px, sin solapes; versión texto en el panel "Enfoque de ingeniería"). `detail` guarda la redacción completa del usuario y no se renderiza. Cara 16 re-exportada (1× y 2×) y revisada con la imagen exportada.
- **T2:** logo + nombre en cada tecla (`Key.icon` reemplaza a `usage`; se quitaron "2 expedientes", "SegundoAire", "ARGOS" y los `[USO]`). SVG descargados a `public/icons/tech/` con README de fuentes y licencias; sin CDN en runtime. Icono decorativo (`alt=""`, `aria-hidden`) de 32 px; el nombre es la etiqueta accesible. La tecla presionada de R3F se mantiene.
- **T3:** eliminadas del dato `log` las cinco entradas (`HEAD`, `a3f9c21`, `7be04d8`, `c51e7a0`, `0000001`); quedan los dos hackathons y el diplomado. `LogEntry.kind` ya no tiene `project`.
- **T4:** `npx tsc --noEmit` pasa.

## Logos (herramienta → fuente) y sustituciones
| Tecla | Archivo | Fuente | Sustitución / nota |
|---|---|---|---|
| React | react.svg | simple-icons (CC0) | — |
| TypeScript | typescript.svg | simple-icons | — |
| React Three Fiber | threejs.svg | simple-icons (Three.js) | No hay logo oficial de R3F: Three.js, en blanco (la marca es negra) |
| Jetpack Compose | jetpackcompose.svg | simple-icons | — |
| Java | java.svg | devicon (MIT) | simple-icons ya no incluye Java |
| Kotlin | kotlin.svg | simple-icons | — |
| Tauri | tauri.svg | simple-icons | — |
| PostgreSQL | postgresql.svg | simple-icons | — |
| Supabase | supabase.svg | simple-icons | — |
| Room | sqlite.svg | simple-icons (SQLite) | Room no tiene logo; SQLite en azul claro `#0F80CC` (la marca `#003B57` es muy oscura sobre la tecla) |
| AWS Lambda | awslambda.svg | gilbarbara/logos (CC0) | simple-icons ya no incluye los logos de AWS |
| Docker | docker.svg | simple-icons | — |

## Pendientes que ya no aplican
`[AÑO]`, `[TU ROL Y LO QUE APRENDISTE EN ESTE PROYECTO]`, `[PRIMER HITO…]` y los `[USO]` de Java, PostgreSQL, AWS Lambda y Docker. Siguen abiertos: `[FECHA DE REVISIÓN]` del CV y `[ESTADO]` de SegundoAire y ArcoFisio si aparecen en otras vistas.

## Gotchas
- El muro de chips del libro (cara 15) y `extra.stack` no se tocaron; el teclado solo existe en la versión texto.
- Los scripts largos con muchas comillas fallan con heredocs de Bash: se escriben en el scratchpad con Write/Edit.
