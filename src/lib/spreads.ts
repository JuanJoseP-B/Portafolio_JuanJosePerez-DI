// Page <-> hash map. page 0 = closed, 1..9 = spreads, 10 = closed from behind (back cover).

export interface SpreadDef {
  page: number;
  label: string;
  /** First entry is the canonical hash; the rest are aliases. */
  hashes: string[];
}

export const LAST_PAGE = 10;

export const SPREADS: readonly SpreadDef[] = [
  { page: 0, label: 'Inicio', hashes: ['inicio'] },
  { page: 1, label: 'Índice y bienvenida', hashes: ['bienvenida'] },
  { page: 2, label: 'Sobre mí y experiencia', hashes: ['sobre-mi', 'experiencia'] },
  { page: 3, label: 'Proyectos', hashes: ['proyectos'] },
  { page: 4, label: 'ARGOS', hashes: ['proyectos/argos'] },
  { page: 5, label: 'SegundoAire', hashes: ['proyectos/segundoaire'] },
  { page: 6, label: 'ArcoFisio', hashes: ['proyectos/arcofisio'] },
  { page: 7, label: 'Testimonios', hashes: ['testimonios'] },
  { page: 8, label: 'Stack y Arquitectura', hashes: ['stack'] },
  { page: 9, label: 'Fin', hashes: ['fin'] },
  { page: 10, label: 'Contacto', hashes: ['contacto'] },
];

export const clampPage = (n: number): number => Math.min(LAST_PAGE, Math.max(0, Math.round(n)));

const normalize = (hash: string): string => hash.replace(/^#\/?/, '').replace(/\/$/, '').toLowerCase();

/** Unknown or empty hash -> page 0. */
export function pageFromHash(hash: string): number {
  const key = normalize(hash);
  const spread = SPREADS.find((s) => s.hashes.includes(key));
  return spread ? spread.page : 0;
}

export function hashFromPage(page: number): string {
  return `#${SPREADS[clampPage(page)].hashes[0]}`;
}

export interface NavLink {
  label: string;
  /** Spread the link opens. */
  page: number;
  /** Hash written to the address bar (an alias when two links share a spread). */
  hash: string;
}

/** Sections shown in the navbar, in reading order. */
export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Inicio', page: 0, hash: 'inicio' },
  { label: 'Sobre mí', page: 2, hash: 'sobre-mi' },
  { label: 'Experiencia', page: 2, hash: 'experiencia' },
  { label: 'Proyectos', page: 3, hash: 'proyectos' },
  { label: 'Testimonios', page: 7, hash: 'testimonios' },
  { label: 'Stack', page: 8, hash: 'stack' },
  { label: 'Contacto', page: 10, hash: 'contacto' },
];

/** Current location.hash without "#" or a leading slash, lowercase. */
export const currentHash = (): string =>
  typeof window === 'undefined' ? '' : normalize(window.location.hash);
