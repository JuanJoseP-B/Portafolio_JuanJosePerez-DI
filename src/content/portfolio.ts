// Single source of truth for all portfolio content.
// Any value written as "[SOMETHING]" is a placeholder the author still has to fill in.
// Never invent figures, quotes, URLs or dates here.

export type ProjectId = 'argos' | 'segundoaire' | 'arcofisio';

export interface Person {
  name: string;
  shortName: string;
  role: string;
  level: string;
  institution: string;
  location: string;
  heroTitle: [string, string];
  bio: string[];
  interests: string[];
  principles: string[];
  photo: string;
  photoAlt: string;
  cv: string;
  /** True once the PDF exists in public/cv/. Until then the CV button is a visible placeholder. */
  cvAvailable: boolean;
  /** Short institution label used in the text version ("UCC Campus Pasto"). */
  institutionShort: string;
  /** Short city label ("Pasto, Nariño") and decorative blueprint coordinates. */
  city: string;
  coordinates: { lat: string; lon: string };
  /** IANA zone for the live clock in the text version. */
  timeZone: string;
  /** Current semester out of the total (drives the "build" bar). */
  semester: { current: number; total: number };
  /** Phrases of `bio[0]` highlighted with a marker underline (each must appear verbatim in the bio). */
  bioMarkers: string[];
}

export interface Project {
  id: ProjectId;
  name: string;
  subtitle: string;
  description: string;
  /** Extra facts for the deep-dive spreads (Phase 4); not shown in the cards. */
  highlights: string[];
  stack: string[];
  repo: string;
  demo: string;
  cover: string;
  /** Short demo clip (muted, played on hover). */
  video: string;
  /** First frame of the clip, shown by the text version before it plays. */
  poster: string;
  accent: string;
  /** Case-file code and status shown on the text-version card ("EXP-001 · ARGOS"). */
  code: string;
  status: string;
}

export interface Testimonial {
  name: string;
  relation: string;
  quote: string;
}

export interface TimelineEntry {
  years: string;
  title: string;
  institution: string;
  note: string;
}

export interface Contact {
  email: string;
  linkedin: string;
  github: string;
}

export interface Hobby {
  title: string;
  /** One short line (about 10 words). */
  line: string;
}

/** One engineering-approach item: only the title is shown; the detail is kept as source copy. */
export interface ApproachItem {
  title: string;
  detail: string;
}

export interface Extra {
  title: string;
  stack: Record<string, string[]>;
  approach: ApproachItem[];
  hobbies: Hobby[];
}

/** One entry of the "git log" timeline in the text version. The hash is decorative. */
export interface LogEntry {
  hash: string;
  date: string;
  branch: string;
  /** Dot color: cyan for milestones, amber for project / event commits. */
  tone: 'accent' | 'warm';
  /** Read by screen readers so the academic / work split of the old layout is not lost. */
  kind: 'academic' | 'work';
  message: string;
  detail: string;
}

export interface Key {
  name: string;
  /** Logo file under /icons/tech (see the README there for sources and licenses). */
  icon: string;
  /** The "pressed" keycap. */
  pressed?: boolean;
}

/** One row of the "keyboard" stack wall in the text version. */
export interface KeyRow {
  layer: string;
  keys: Key[];
}

export interface Portfolio {
  person: Person;
  projects: Project[];
  testimonials: Testimonial[];
  /** Reverse chronological order. */
  education: TimelineEntry[];
  /** Reverse chronological order. */
  experience: TimelineEntry[];
  contact: Contact;
  extra: Extra;
  /** Text-version timeline mixing milestones, projects and the real academic / work entries. */
  log: LogEntry[];
  keyboard: KeyRow[];
}

export const portfolio: Portfolio = {
  person: {
    name: 'Juan José Pérez Bravo',
    shortName: 'Juan José',
    role: 'Ingeniero de Software',
    level: 'Quinto Semestre',
    institution: 'Universidad Cooperativa de Colombia, Campus Pasto',
    location: 'Pasto, Nariño, Colombia',
    heroTitle: ['Juan José Pérez Bravo', 'Ingeniero de Software'],
    bio: [
      'Soy estudiante de Ingeniería de Software apasionado por el diseño de arquitecturas limpias, el modelado de bases de datos relacionales y los despliegues en la nube. Disfruto transformar requerimientos complejos en soluciones modulares y eficientes, priorizando siempre la escalabilidad y una documentación impecable.',
    ],
    interests: ['Arquitectura Cloud', 'Bases de Datos', 'Clean Code'],
    principles: ['PRECISIÓN', 'CLARIDAD', 'CURIOSIDAD'],
    photo: '/imagenAvaarJJ.webp',
    photoAlt: 'Retrato de Juan José Pérez Bravo',
    cv: '/cv/JuanJose-CV.pdf',
    cvAvailable: true, // public/cv/JuanJose-CV.pdf is in place; set to false to show the CV button as a placeholder
    institutionShort: 'UCC Campus Pasto',
    city: 'Pasto, Nariño',
    coordinates: { lat: '1.2136° N', lon: '77.2811° O' },
    timeZone: 'America/Bogota',
    semester: { current: 5, total: 10 },
    bioMarkers: ['arquitecturas limpias', 'bases de datos relacionales', 'documentación impecable'],
  },

  projects: [
    {
      id: 'argos',
      name: 'ARGOS',
      subtitle: 'Mesa de Crisis',
      description:
        'Plataforma C4I de escritorio y web para la gestión táctica de emergencias con mapas interactivos.',
      highlights: [
        'Arquitectura C4I.',
        'Aplicación de escritorio con Tauri, React y TypeScript.',
        'Portal público con Vite.',
        'Integración con Supabase y Mapbox / MapLibre.',
      ],
      stack: ['Tauri', 'React', 'TypeScript', 'Vite', 'Supabase', 'Mapbox'],
      repo: 'https://github.com/JuanJoseP-B/APP-ESCRITORIO-MESA_DE_CRISIS-Di.git',
      demo: 'https://app-escritorio-mesadecrisis-di.vercel.app/',
      cover: '/img/projects/argos.webp',
      video: '/video/argos.mp4',
      poster: '/video/argos-poster.jpg',
      accent: '#5ce1e6',
      code: 'EXP-001 · ARGOS',
      status: 'EN PRODUCCIÓN',
    },
    {
      id: 'segundoaire',
      name: 'SegundoAire',
      subtitle: 'FocusBlocks',
      description:
        'Aplicación nativa de productividad para Android que intercepta eventos del sistema para bloquear distracciones.',
      highlights: [
        'App de productividad nativa para Android.',
        'Kotlin y Room Database.',
        'Manipulación profunda del sistema con AccessibilityService.',
      ],
      stack: ['Kotlin', 'AccessibilityService', 'Room Database', 'Jetpack Compose'],
      repo: 'https://github.com/JuanJoseP-B/SegundoAire-PrMobile-DI.git',
      demo: 'https://segundoaire-demo.vercel.app/',
      cover: '/img/projects/segundoaire.webp',
      video: '/video/segundoaire.mp4',
      poster: '/video/segundoaire-poster.jpg',
      // Proposal (green/blue "air"); confirm with the author.
      accent: '#58d68d',
      code: 'EXP-002 · SEGUNDOAIRE',
      status: '[ESTADO]',
    },
    {
      id: 'arcofisio',
      name: 'ArcoFisio',
      subtitle: 'Rehabilitación en smartwatch',
      description:
        'Aplicación para smartwatch orientada a la rehabilitación física mediante tracking analógico y retroalimentación háptica.',
      highlights: [
        'Aplicación de rehabilitación para smartwatch.',
        'Interfaz analógica, sin elementos digitales.',
        'Seguimiento de ángulos con goniómetro.',
        'Web Audio API y retroalimentación háptica.',
      ],
      stack: ['React', 'TypeScript', 'Web Audio API', 'Sensores de movimiento'],
      repo: 'https://github.com/JuanJoseP-B/ArcoFisio-PROY-SMARTWATHC-DI.git',
      demo: 'https://arco-fisio-proy-smartwathc-di.vercel.app/',
      cover: '/img/projects/arcofisio.webp',
      video: '/video/arcofisio.mp4',
      poster: '/video/arcofisio-poster.jpg',
      accent: '#ffb547',
      code: 'EXP-003 · ARCOFISIO',
      status: '[ESTADO]',
    },
  ],

  testimonials: [
    {
      name: 'Luis Díaz',
      relation: 'Compañero de clase',
      quote:
        'Trabajar con Juan José es sinónimo de orden. Sus diagramas y vistas lógicas facilitan muchísimo el desarrollo en equipo.',
    },
    {
      name: 'Carlos Bravo',
      relation: 'Familiar',
      quote:
        'Siempre pruebo sus aplicaciones. Todo funciona muy rápido y las interfaces son muy fáciles de entender.',
    },
    {
      name: 'Juan Diego Vázquez',
      relation: 'Estudiante de cuarto semestre',
      quote:
        'Tiene una visión muy clara para estructurar el código y resolver problemas técnicos complejos.',
    },
    {
      name: 'Juan Gallego',
      relation: 'Compañero de clase',
      quote:
        'Sus entregas son impecables y siempre se enfoca en cumplir exactamente con los requerimientos del proyecto.',
    },
    {
      name: 'Bayron Bravo',
      relation: 'Familiar',
      quote:
        'Se nota su gran dedicación. Siempre busca la forma de hacer que las aplicaciones sean realmente útiles y sin errores.',
    },
    {
      name: 'Andrés Felipe',
      relation: 'Estudiante de cuarto semestre',
      quote:
        'Maneja muy bien las bases de datos y la arquitectura, lo que hace que sus proyectos sean muy organizados.',
    },
  ],

  education: [
    {
      years: 'Actualmente',
      title: 'Ingeniería de Software (5to Semestre)',
      institution: 'Universidad Cooperativa de Colombia, Campus Pasto',
      note: '',
    },
    {
      years: '2025',
      title: 'Diplomado en Contabilidad Básica bajo NIIF',
      institution: 'Universidad Mariana',
      note: '',
    },
  ],

  experience: [
    {
      years: 'Nov 2025',
      title: 'Desarrollador Frontend/Backend',
      institution: 'Hackathon Talento Tech Pasto',
      note: 'Desarrollo de prototipos tecnológicos bajo presión, aplicando metodologías ágiles en equipo.',
    },
    {
      years: 'Dic 2024',
      title: 'Desarrollador',
      institution: 'Hackathon Concurso de Innovación ParqueSoft',
      note: 'Estructuración de soluciones tecnológicas viables y despliegues rápidos en la nube.',
    },
  ],

  contact: {
    email: 'jjperezbravo123@gmail.com',
    linkedin: 'https://www.linkedin.com/in/juan-josé-pérez-819160424',
    github: 'https://github.com/JuanJoseP-B',
  },

  extra: {
    title: 'Stack y Arquitectura',
    stack: {
      Lenguajes: ['Java', 'Kotlin'],
      '3D en la web': ['React Three Fiber'],
      'Nube e infraestructura': ['AWS Lambda', 'Docker'],
      Datos: ['PostgreSQL'],
    },
    // Only `title` is rendered (book face 16 and text version); `detail` is the author's full wording.
    approach: [
      {
        title: 'System Design & Escalabilidad',
        detail:
          'Diseño de arquitecturas tolerantes a fallos (FastAPI, PostgreSQL 16) validadas mediante pruebas de estrés rigurosas (k6) y orquestadas en entornos contenerizados (Docker Compose).',
      },
      {
        title: 'Cloud & Event-Driven Architectures',
        detail:
          'Automatización de flujos de procesamiento asíncrono utilizando infraestructuras serverless en AWS (Lambda, S3 event triggers, monitoreo con CloudWatch).',
      },
      {
        title: 'Low-Level System Integration',
        detail:
          'Experiencia directa manipulando el hardware y el sistema operativo, desde la intercepción de capas de accesibilidad en Android hasta el procesamiento de acelerómetros y motores hápticos en wearables.',
      },
      {
        title: 'Rendimiento Híbrido C4I',
        detail:
          'Integración de lenguajes de sistemas (Rust a través de Tauri) con interfaces web para lograr rendimiento nativo en aplicaciones de misión crítica.',
      },
    ],
    // Copy written for the author (sport, gym, hard techno, entrepreneurship); no facts invented.
    hobbies: [
      { title: 'Deporte', line: 'Moverme es la forma más rápida de despejar la cabeza.' },
      { title: 'Gimnasio', line: 'Disciplina bajo la barra, la misma que llevo al código.' },
      { title: 'Hard techno', line: 'Graves duros y ritmo sin freno: así suena mi enfoque.' },
      { title: 'Emprendimientos', line: 'Me apasiona emprender: convertir una idea en algo real.' },
    ],
  },

  // Real academic / work entries only, most recent first. Hashes are decorative.
  log: [
    {
      hash: '5d2b8f3',
      date: 'Nov 2025',
      branch: 'hackathon',
      tone: 'warm',
      kind: 'work',
      message: 'feat: Hackathon Talento Tech Pasto — Desarrollador Frontend/Backend',
      detail: 'Desarrollo de prototipos tecnológicos bajo presión, aplicando metodologías ágiles en equipo.',
    },
    {
      hash: 'e91a47c',
      date: '2025',
      branch: 'academico',
      tone: 'accent',
      kind: 'academic',
      message: 'docs: Diplomado en Contabilidad Básica bajo NIIF',
      detail: 'Universidad Mariana.',
    },
    {
      hash: '3c68d0a',
      date: 'Dic 2024',
      branch: 'hackathon',
      tone: 'warm',
      kind: 'work',
      message: 'feat: Hackathon Concurso de Innovación ParqueSoft — Desarrollador',
      detail: 'Estructuración de soluciones tecnológicas viables y despliegues rápidos en la nube.',
    },
  ],

  keyboard: [
    {
      layer: 'FRONTEND',
      keys: [
        { name: 'React', icon: '/icons/tech/react.svg' },
        { name: 'TypeScript', icon: '/icons/tech/typescript.svg' },
        { name: 'React Three Fiber', icon: '/icons/tech/threejs.svg', pressed: true },
        { name: 'Jetpack Compose', icon: '/icons/tech/jetpackcompose.svg' },
      ],
    },
    {
      layer: 'BACKEND · NATIVO',
      keys: [
        { name: 'Java', icon: '/icons/tech/java.svg' },
        { name: 'Kotlin', icon: '/icons/tech/kotlin.svg' },
        { name: 'Tauri', icon: '/icons/tech/tauri.svg' },
      ],
    },
    {
      layer: 'DATOS',
      keys: [
        { name: 'PostgreSQL', icon: '/icons/tech/postgresql.svg' },
        { name: 'Supabase', icon: '/icons/tech/supabase.svg' },
        { name: 'Room', icon: '/icons/tech/sqlite.svg' },
      ],
    },
    {
      layer: 'NUBE · INFRA',
      keys: [
        { name: 'AWS Lambda', icon: '/icons/tech/awslambda.svg' },
        { name: 'Docker', icon: '/icons/tech/docker.svg' },
      ],
    },
  ],
};

// Fixed UI copy (Spanish).
export const ui = {
  contact: 'Contáctame',
  downloadCv: 'Descargar CV',
  hint: 'Haz clic en el libro para abrirlo · pasa el mouse sobre las páginas',
  index: 'Índice',
  github: 'GitHub ↗',
  liveDemo: 'Demo en vivo ↗',
  letsTalk: 'HABLEMOS.',
  thanks: 'Gracias por hojear.',
  reopen: 'Volver a abrir ↺',
  textVersion: 'Ver versión texto',
  backToTop: 'Volver arriba',
  credit: 'Hecho con React Three Fiber + Tailwind',
} as const;
