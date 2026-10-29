# Integración del contenido final (datos del usuario)

Estado: escrito, tsc OK, pendiente de prueba manual · Fuente de datos: mensaje del usuario "INFO_PERSONAL_FINAL" (texto literal, ver abajo) + `SPEC.md` §9. Sin build/tests por parte de Claude salvo un `tsc --noEmit` final.

## Objetivo
Sustituir los placeholders de `src/content/portfolio.ts` por el contenido final y reflejarlo en la versión de texto (`A11yContent`), `Overlay` y props que lo usen. Todos los enlaces **externos** con `target="_blank" rel="noopener noreferrer"`; los enlaces internos (`#hash`) NO abren pestaña nueva.

## Datos literales
- Nombre: Juan José Pérez Bravo · Título: Ingeniero de Software · Foto: `/imagenAvaarJJ.jpg` (en `public/`, 1.9 MB: optimizar en Fase 6).
- GitHub https://github.com/JuanJoseP-B · LinkedIn https://www.linkedin.com/in/juan-josé-pérez-819160424 · Email jjperezbravo123@gmail.com
- Bio: "Soy estudiante de Ingeniería de Software apasionado por el diseño de arquitecturas limpias, el modelado de bases de datos relacionales y los despliegues en la nube. Disfruto transformar requerimientos complejos en soluciones modulares y eficientes, priorizando siempre la escalabilidad y una documentación impecable."
- Datos rápidos: Pasto, Nariño, Colombia · Quinto Semestre · Intereses: Arquitectura Cloud, Bases de Datos, Clean Code.
- Proyectos (descripción · tecnologías · GitHub · demo):
  1. ARGOS (Mesa de Crisis) · "Plataforma C4I de escritorio y web para la gestión táctica de emergencias con mapas interactivos." · Tauri, React, TypeScript, Vite, Supabase, Mapbox · https://github.com/JuanJoseP-B/APP-ESCRITORIO-MESA_DE_CRISIS-Di.git · https://app-escritorio-mesadecrisis-di.vercel.app/
  2. SegundoAire (FocusBlocks) · "Aplicación nativa de productividad para Android que intercepta eventos del sistema para bloquear distracciones." · Kotlin, AccessibilityService, Room Database, Jetpack Compose · https://github.com/JuanJoseP-B/SegundoAire-PrMobile-DI.git · https://appetize.io/app/b_evb2uwt37p5wqbaamkhmdhi6qa
  3. ArcoFisio · "Aplicación para smartwatch orientada a la rehabilitación física mediante tracking analógico y retroalimentación háptica." · React, TypeScript, Web Audio API, Sensores de movimiento · https://github.com/JuanJoseP-B/ArcoFisio-PROY-SMARTWATHC-DI.git · https://arco-fisio-proy-smartwathc-di.vercel.app/
- Académica: Ingeniería de Software (5to Semestre) — Universidad Cooperativa de Colombia, Campus Pasto (Actualmente) · Diplomado en Contabilidad Básica bajo NIIF — Universidad Mariana (2025).
- Laboral / Práctica competitiva: "Desarrollador Frontend/Backend" — Hackathon Talento Tech Pasto, Nov 2025: "Desarrollo de prototipos tecnológicos bajo presión, aplicando metodologías ágiles en equipo." · "Desarrollador" — Hackathon Concurso de Innovación ParqueSoft, Dic 2024: "Estructuración de soluciones tecnológicas viables y despliegues rápidos en la nube." Orden cronológico inverso.
- Testimonios (6): **REEMPLAZADOS** — el usuario confirmó que son reales y autorizó su publicación; el set anterior (por proyecto, con calificaciones y roles anónimos) se descartó. Campos: nombre, relación, texto (sin calificación ni agrupación por proyecto; avatar = círculo de iniciales). Textos exactos en `src/content/portfolio.ts`: Luis Díaz (Compañero de clase), Carlos Bravo (Familiar), Juan Diego Vázquez (Estudiante de cuarto semestre), Juan Gallego (Compañero de clase), Bayron Bravo (Familiar), Andrés Felipe (Estudiante de cuarto semestre).
- Contacto: formulario con Nombre, Correo, Mensaje obligatorios (`required`, `type="email"`), mensaje de éxito simulado al enviar, sin backend.

## Pendiente (no inventar)
Imágenes/capturas de proyecto, videos de hover, PDF del CV (`public/cv/JuanJose-CV.pdf`), aficiones de la sección adicional, crédito del footer (Fase 5; por defecto "Hecho con React Three Fiber + Tailwind"). Estos siguen como `[PLACEHOLDER]`.
Testimonios: confirmados como reales y autorizados por el usuario (ya no hay nada que verificar).

## Tareas
- [x] **T1** `src/content/portfolio.ts`: actualizar tipos y datos (proyectos con `description`, `demo`/`repo`; testimonios con `project`, `rating`, `relation`; quitar campos que ya no se piden: problem/solution/role/year, o hacerlos opcionales y ocultos si faltan; `person.cv` se mantiene con placeholder visible del PDF faltante; sección extra con stack real y aficiones `[PLACEHOLDER]`). _(escrito; tsc OK; pendiente de prueba manual)_
- [x] **T2** `src/ui/ContactForm.tsx` (reutilizable): campos `required`, `type="email"`, estado de envío simulado con mensaje de confirmación accesible (`role="status"`), sin backend. _(escrito; tsc OK; pendiente de prueba manual)_
- [x] **T3** `src/ui/A11yContent.tsx`: tarjetas de proyecto (imagen o placeholder, tecnologías, botones GitHub y Demo `_blank`), testimonios (6; nombre, relación, avatar con iniciales o foto, texto, calificación), experiencia con dos bloques "Experiencia Académica" y "Experiencia Laboral / Práctica Competitiva", acerca de mí con foto y datos rápidos, contacto con `ContactForm` y enlaces, footer con redes. Revisar `Overlay.tsx` y `src/scene/Props.tsx` por si usan campos cambiados (nombre con tilde, título). _(escrito; tsc OK; pendiente de prueba manual)_

## Verificación
`npx tsc --noEmit` al final (lo corre el writer). Prueba manual del usuario en la versión de texto ("Ver versión texto").
