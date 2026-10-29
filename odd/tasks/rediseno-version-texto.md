# Rediseño de la versión texto ("Bitácora de ingeniero")

Estado: escrito (tsc OK; verificado una vez con Playwright a 1440 y 390 px); pendiente de validación visual del usuario · Fuente: `portfolio-redesign-handoff/` (`HANDOFF.md`, `reference/index.html` = fuente de verdad visual, capturas `reference/screenshot-desktop-1440.png` y `…-mobile-390.png`, `design-system/tokens.css|json`) · Pedido del usuario: "esto rediseña el texto, no el libro; implementa el handoff; también cargué el CV en `public`".

## Alcance
Rediseñar **solo** la versión texto (`src/ui/A11yContent.tsx`, la vista a la que se llega con "Ver versión texto" y que también es el respaldo sin WebGL) para que quede visualmente idéntica a `reference/index.html`. **No tocar** el libro 3D, las caras exportadas (`src/pages-design/**`), ni `src/scene/**`. Esta fase es estática: dejar los ganchos `data-anim` del HANDOFF §6, sin implementar animaciones (salvo el reloj real de "Ubicación").

## Decisiones del orquestador (conflictos entre el handoff y el proyecto)
1. **Contenido real manda sobre los corchetes del handoff.** `src/content/portfolio.ts` es la única fuente. Donde el handoff trae un `[PLACEHOLDER]` y el repo ya tiene el dato real del usuario (correo, experiencia/educación, URLs de GitHub/demo, textos de proyectos y testimonios, aficiones), se usa el dato real; donde no existe, se deja el corchete visible y se lista al final. Nunca inventar. Los testimonios y descripciones del handoff coinciden con los del repo: verificar y usar los del repo.
2. **Hamburguesa:** la rúbrica del curso exige navbar con menú hamburguesa; el handoff dice "sin hamburguesa en móvil". Mantener la rúbrica: en escritorio (≥ 768 px) la píldora del handoff tal cual; por debajo, la misma píldora con botón hamburguesa que despliega los enlaces. Sin scroll horizontal a 390 px.
3. **Pie de página:** el usuario ya decidió que "Volver arriba", iconos sociales, © y crédito viven en el pie de la versión texto. Combinar: línea mono del handoff (`© 2026 Juan José Pérez Bravo` · `EOF · hecho a mano en Pasto`) + iconos LinkedIn/GitHub/correo + crédito ("Hecho con React Three Fiber + Tailwind") + botón "Volver arriba" (ya existe `backToTop` en `A11yContent`).
4. **Anclas:** conservar los `id` actuales (`#inicio`, `#sobre-mi`, `#proyectos`, `#testimonios`, `#experiencia`, `#stack`, `#contacto`, `#fin`): los comparte el sincronizador de hash del libro. Los enlaces con numeración `01…06` del handoff apuntan a esos ids.
5. **Navbar:** conservar "Volver al libro" (acción existente) y "Contáctame". Sticky dentro del contenedor de scroll de la versión texto.
6. **Formulario:** `ContactForm.tsx` también lo usan la contraportada (`<Html>`) y la hoja móvil. No cambiar su comportamiento: añadir una variante visual `terminal` (prop) usada solo en la versión texto; mantener `required`, `type="email"`, éxito simulado y `role="status"`. Labels con forma de comando (`$ git config user.name`, …) y botón `$ git push origin juanjose`.
7. **Medios:** usar los del repo, no los recortes del handoff: avatar `public/imagenAvaarJJ.webp`; capturas `public/img/projects/*.webp`; videos `public/video/{argos,segundoaire,arcofisio}.mp4` con póster (`<video muted loop playsInline preload="none" poster>`, reproducir al hover/foco; con reduced-motion solo con clic).
8. **CV:** el usuario dejó `public/cv/CV Juan José Pérez Bravo.pdf`. Renombrarlo a `public/cv/JuanJose-CV.pdf` (nombre sin espacios ni acentos para la URL; es un `git mv`/`mv`, no cambia el contenido), poner `person.cvAvailable = true` y comprobar que el botón de CV del libro (hero y hotspot de la cara 2) y el de la versión texto pasan a ser el enlace real de descarga. `[FECHA DE REVISIÓN]` queda como pendiente visible (no se conoce la fecha).
9. **Tokens:** integrar `design-system/tokens.css` **acotado a un contenedor** (p. ej. `.text-site`) para no alterar variables ya usadas por el overlay/libro (`--void`, `--accent`, etc.); en componentes usar variables/clases Tailwind mapeadas, sin hex sueltos. Cargar las cuatro familias (Space Grotesk, Instrument Serif itálica, Inter, JetBrains Mono) sin degradar la carga del libro (revisar qué ya existe en `index.html`/CSS).
10. **Datos tipados:** ampliar `portfolio.ts` (solo añadir campos, no cambiar los existentes, porque las caras exportadas ya los usan): commits/línea de tiempo, capas del stack con su uso, habilidades, intereses rotativos, semestre (5 de 10), estado de proyectos. Reutilizar `experience`/`education` reales donde correspondan; los demás campos del handoff quedan con corchete.
11. **Accesibilidad/SEO:** mantener el único `<h1>` de la versión texto, landmarks, `<nav aria-label>`, `<label>` envolviendo inputs, `alt`, `aria-hidden` en decoraciones, objetivos táctiles ≥ 44 px; la versión sigue siendo `sr-only` cuando no está visible (el contenido semántico no puede perderse ni cargar videos: `preload="none"`).

## Tareas
- [x] **T0 Inspección y base.** Leer completo `HANDOFF.md`, `reference/index.html`, tokens y las dos capturas; inspeccionar `A11yContent.tsx`, `ContactForm.tsx`, CSS/Tailwind y `index.html`. Renombrar el CV, activar `cvAvailable`, integrar tokens acotados y fuentes. Anotar en este documento qué se reutilizó.
- [x] **T1 Datos.** Ampliar `portfolio.ts` (decisión 10) y tipos.
- [x] **T2 Navbar, Hero, Sobre mí y "Detrás del código".** Incluye reloj real `America/Bogota`, barra de semestre calculada, intereses, retrato con "FIG. 01", mini terminal y botón CV estilo ficha.
- [x] **T3 Proyectos ("Expedientes de caso") y Testimonios ("Notas en el margen").**
- [x] **T4 Experiencia ("git log"), Stack ("Mi teclado"), Contacto (terminal + firma SVG exacta de la referencia) y Pie de página.**
- [x] **T5 Ganchos `data-anim`, responsive y accesibilidad.** Sin scroll horizontal a 390 px; foco visible; `prefers-reduced-motion`; verificar que "Volver al libro", los saltos por hash y la vista `sr-only` siguen funcionando.
- [x] **T6 Verificación y cierre.** `npx tsc --noEmit`. Autorizado por el handoff (§7), una sola vez: levantar Vite en un puerto libre, capturar la versión texto con Playwright a 1440 y 390 px, compararla con las capturas de referencia, corregir diferencias evidentes y **apagar el servidor** (la máquina ya cerró un servidor por poca memoria; no dejarlo corriendo ni lanzar builds). Actualizar este documento con archivos tocados, constantes, gotchas y la lista de pendientes entre corchetes.

## Criterios de aceptación (los revisa el usuario)
- La versión texto se ve igual que la referencia a 1440 px y 390 px (fuentes, colores, espaciados, tarjetas, línea de tiempo, teclas, formulario-terminal).
- El libro 3D y sus caras no cambian; "Volver al libro", el botón de CV con el PDF real y el formulario de la contraportada siguen funcionando.
- Sin scroll horizontal a 390 px; las cuatro fuentes cargan; consola limpia.
- Los pendientes siguen visibles entre corchetes y están listados.

## Ruta
**delegated direct** — un writer (fork), trigger: ≥ 2 archivos no triviales.

## Gotchas previstos
- `portfolio.ts` alimenta las caras ya exportadas: solo añadir campos; si se tocara un texto existente habría que re-exportar caras (no hacerlo).
- Las variables del handoff colisionan en nombre con las del proyecto: acotarlas.
- Vite devuelve `index.html` con 200 para rutas inexistentes: la existencia del CV se controla con la bandera, no sondeando.
- `A11yContent` está montado siempre (sr-only): cualquier recurso pesado debe ser perezoso.

## Resultado (T0–T6)

### Archivos tocados
- Nuevos `src/ui/text/`: `shared.tsx`, `TextNav.tsx`, `TextHero.tsx`, `TextAbout.tsx` (Hola soy + Detrás del código + reloj), `ProjectMedia.tsx`, `TextProjects.tsx`, `TextTestimonials.tsx`, `TextExperience.tsx`, `TextStack.tsx`, `TextContact.tsx`, `TextFooter.tsx`.
- `src/ui/A11yContent.tsx`: ahora solo es el contenedor (scroll, `sr-only` / visible, "Volver arriba") que monta las secciones.
- `src/ui/ContactForm.tsx`: tercera variante `terminal` (card con barra `~/contacto — zsh`, labels como comandos que envuelven el input); `page` y `book` quedan igual.
- `src/content/portfolio.ts` (solo se añadieron campos): `person.{institutionShort, city, coordinates, timeZone, semester, bioMarkers}`, `Project.{code, status}`, `log` (línea de tiempo), `keyboard` (teclas del stack) y `cvAvailable: true`.
- `src/styles/tokens.css` (tokens que faltaban), `src/styles/index.css` (`.blueprint`, `.marker`, `.on-paper .placeholder`), `tailwind.config.ts` (`success`, `accent-hover`, `keycap-shadow`, `shadow-note`), `index.html` (pesos de fuentes: Inter 400–600, JetBrains Mono 400–500, Space Grotesk 400–700, Instrument Serif normal + cursiva).
- `public/cv/CV Juan José Pérez Bravo.pdf` → `public/cv/JuanJose-CV.pdf` (solo renombrado). Sin otras referencias al nombre anterior.

### Reutilizado del repo vs del handoff
- Del repo: todo el contenido (textos de proyectos, testimonios, bio, correo, URLs, hackathons y diplomado), foto `imagenAvaarJJ.webp`, capturas/videos/pósters, `ContactForm` (lógica simulada), `Placeholder`, `motion.reduced`.
- Del handoff: estructura, medidas, tipografía, colores, firma SVG (path exacto), textos de diseño ("Diseño sistemas que se explican solos.", "Expedientes de caso", "Notas en el margen", "git log --mi-camino", "Mi teclado", "Hagamos un commit juntos."), códigos `EXP-00N`, estado "EN PRODUCCIÓN" de ARGOS, hashes decorativos y las teclas del stack.
- Los tokens del proyecto ya coincidían con los del handoff (mismos nombres y valores), así que no hizo falta acotarlos a un contenedor: solo se añadieron los que faltaban.

### Decisiones y desviaciones respecto a la referencia
- **Hamburguesa** por debajo de 768 px (rúbrica); desde `md` es la píldora del handoff.
- **Anclas:** "Hola, soy…" lleva `#sobre-mi` (con un ancla vacía `#bienvenida` dentro); "Detrás del código" usa `#detras-del-codigo`. `#fin` está en el pie. Los demás ids no cambian.
- **Línea de tiempo:** 8 entradas (las 5 del handoff + hackathon Talento Tech, diplomado NIIF y hackathon ParqueSoft, que son datos reales). Cada una lleva un texto solo para lectores de pantalla ("Experiencia académica", "Experiencia laboral / práctica competitiva", "Proyecto") para no perder la división de la rúbrica.
- **Stack:** debajo del teclado se conservan "Enfoque de ingeniería" y "Fuera del código" (aficiones), que no estaban en el handoff pero sí en el libro y en la versión anterior.
- **Pie combinado:** línea mono del handoff + iconos + crédito + "Volver arriba". Se omitió "Gracias por hojear." del pie.
- **Videos (requisito posterior del coordinador):** los tres se reproducen. Escritorio: hover o foco; táctil: ≥ 50 % visible (IntersectionObserver); con `prefers-reduced-motion` solo con el botón. Botón play/pausa visible de 44 px con `aria-label` y `aria-pressed`; un solo video activo a la vez (módulo `ProjectMedia`); sin observar ni reproducir nada mientras la versión texto está oculta (`enabled`). Los verticales/cuadrado se muestran completos (`object-contain`) sobre un fondo con el color del expediente; para que el teléfono y el reloj se vean grandes, **el escenario de los tres es 4:3 (no 16:9)**, así que las tarjetas son ~70 px más altas que la referencia.
- Reloj real `America/Bogota` (`role="timer"`, `aria-live="off"`): solo avanza cuando la versión texto es visible.

### Verificación (Playwright, una sola vez; servidor en 5199, ya apagado)
- Se simuló "sin WebGL" para abrir la versión texto sin cargar three.js. Chrome instalado (H.264 disponible).
- 1440 px: se parece mucho a la captura de referencia; es más alta (6890 px frente a 5988) por las 3 entradas extra del log, el bloque de enfoque/aficiones, la segunda fila del pie y el escenario 4:3.
- 390 px: sin scroll horizontal (`scrollWidth` 390; desbordamiento del documento 0). Menú hamburguesa abre y cierra (8 enlaces visibles).
- Videos al hover: ARGOS, SegundoAire y ArcoFisio pasan de `paused: true` a `false` (`currentTime` ≈ 1.5 s, `readyState` 4, sin error; 1280×720, 366×720, 720×720) y vuelven a pausa al salir del cursor. En táctil (390 px) el IntersectionObserver reproduce la tarjeta visible.
- Formulario: correo inválido y campos vacíos los frena la validación nativa; con datos válidos aparece "¡Gracias, Prueba! Tu mensaje fue enviado."
- CV: enlace `/cv/JuanJose-CV.pdf` con `download`; 8 enlaces `_blank` con `noopener noreferrer`; un solo `<h1>`; existen todos los ids.
- Consola sin errores en ambos tamaños.
- Sin comprobar: que solo un video suene a la vez en una prueba real (el intento dio `false,false,false` por un artefacto del test: el cursor al moverse pausaba el anterior). La lógica está en `start()` de `ProjectMedia.tsx`, que pausa el video activo antes de reproducir otro.
- Sin comprobar: las fuentes en un navegador sin caché (`document.fonts.check` no sirve para pesos que la página no usa) y Lighthouse.

### Pendientes entre corchetes (siguen visibles en la página)
- `[FECHA DE REVISIÓN]` del CV (el PDF ya existe).
- `[ESTADO]` de SegundoAire y ArcoFisio.
- `[AÑO]` y `[TU ROL Y LO QUE APRENDISTE EN ESTE PROYECTO]` de ARGOS, SegundoAire y ArcoFisio; `[AÑO]` y `[PRIMER HITO: CURSO, CERTIFICACIÓN O PRÁCTICA]` del `init`. Cuando se conozcan los años habrá que reordenar el log.
- `[USO]` de Java, PostgreSQL, AWS Lambda y Docker.
- (resuelto) `[TU CORREO]`: ya resuelto con `jjperezbravo123@gmail.com` (dato del repo).
- Imágenes de alta resolución de los proyectos y del avatar (la foto actual es la WebP de 93 KB).

### Gotchas
- `portfolio.ts` alimenta las caras ya exportadas: solo se añadieron campos; no hizo falta re-exportar nada.
- Los hashes de commit del log son decorativos (los del handoff y los tres nuevos son inventados como adorno, no datos).
- `document.fonts.check()` devuelve `false` para pesos no usados; no sirve para verificar la carga.
- Los heredocs largos con muchas comillas fallan en este shell: los scripts de edición van a archivos.
- Los ganchos `data-anim` están en: hero (`grid-draw`, `decode`, `dimension`), barra de semestre (`build-fill`), interés (`rotate-word`), `.marker` (`marker`), chips (`type`), grid de proyectos (`pin-horizontal`), código EXP (`count`), notas (`stick`), log (`graph-draw`, hash `type`), teclas (`keypress`), correo (`magnetic`), firma (`sign`). Sin implementar.

### Qué revisar
1. Versión texto (botón "Ver versión texto"): comparar con la referencia a 1440 y 390 px.
2. Hover sobre las tres tarjetas de proyecto: el video se reproduce y el botón play/pausa funciona; en el móvil, se reproduce el que está en pantalla.
3. Botón "Ficha técnica — CV" descarga el PDF; también el botón del libro (hero y cara 2) ahora es el enlace real.
4. Formulario terminal: envío simulado; el del libro (contraportada) sigue igual.
5. Hamburguesa en móvil y "Volver arriba" en el pie.
6. Decidir si el escenario de video debe volver a 16:9 (más fiel a la referencia, teléfono más pequeño).
