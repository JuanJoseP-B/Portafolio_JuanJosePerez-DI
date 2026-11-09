import { getPortfolio, getUi } from '../content/portfolio';

// The export route is loaded afresh for each capture; the query selects the printed language.
export const pageLang = new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'es';
export const portfolio = getPortfolio(pageLang);
export const ui = getUi(pageLang);

const english: Record<string, string> = {
  'Portafolio 2026': 'Portfolio 2026', 'Bienvenida': 'Welcome', 'Sobre mí': 'About me',
  'Experiencia': 'Experience', 'Proyectos': 'Projects', 'Testimonios': 'Testimonials',
  'Contacto': 'Contact', 'Inicio': 'Home', 'Ubicación': 'Location', 'Semestre': 'Semester',
  'Intereses': 'Interests', 'Hola, soy': 'Hi, I am', 'Detrás': 'Behind', 'del código': 'the code',
  'académica y laboral': 'academic & professional', 'Experiencia Académica': 'Academic Experience',
  'Experiencia Laboral / Práctica Competitiva': 'Professional / Competitive Experience',
  'Mis': 'My', 'proyectos': 'projects', 'Escritorio y web': 'Desktop & web', 'Android nativo': 'Native Android',
  'Proyecto 01': 'Project 01', 'Proyecto 02': 'Project 02', 'Proyecto 03': 'Project 03',
  'Arquitectura': 'Architecture', 'Cómo está hecho': 'How it is built', '01 · Pantalla de acceso': '01 · Login screen',
  'Acceso de operadores': 'Operator access', '▶ Demo en video': '▶ Video demo',
  '· Android nativo': '· Native Android',
  'Más voces': 'More voices', 'opiniones': 'reviews', 'y arquitectura': '& architecture',
  'En mis proyectos': 'In my projects', 'Enfoque de ingeniería': 'Engineering approach',
  'Fuera del código': 'Outside the code', 'Correo': 'Email',
  'Hecho con React Three Fiber + Tailwind · © 2026': 'Built with React Three Fiber + Tailwind · © 2026',
};

/** Translate fixed printed labels after React has rendered the export-only page. */
export function localizePrintedLabels(root: Element): void {
  if (pageLang !== 'en') return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const original = node.nodeValue ?? '';
    const text = original.trim();
    const replacement = english[text];
    if (replacement) node.nodeValue = original.replace(text, replacement);
  }
}
