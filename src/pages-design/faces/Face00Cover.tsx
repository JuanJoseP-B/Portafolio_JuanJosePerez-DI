import { portfolio } from '../../content/portfolio';
import { PageFrame } from '../PageFrame';
import { LogoMark } from '../parts';

const { person } = portfolio;

/** Face 0 — front cover (exterior): matte cloth, foil monogram, title. */
export function Face00Cover() {
  return (
    <PageFrame theme="cover">
      {/* Debossed frame, a few px inside the board edge. */}
      <div
        className="absolute rounded-[10px]"
        style={{ inset: 60, border: '2px solid rgba(255,255,255,0.05)' }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div style={{ filter: 'drop-shadow(0 0 16px rgba(92,225,230,0.35))' }}>
          <LogoMark size={210} ring="#5ce1e6" ink="#f4f6fb" />
        </div>
        <p
          className="mt-12 font-mono text-[34px] uppercase tracking-[0.2em]"
          style={{
            background: 'linear-gradient(90deg, #8ff0f3, #2fb8be)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {person.name}
        </p>
        <p className="mt-4 font-mono text-[26px] uppercase tracking-[0.3em] text-muted">
          Portafolio 2026
        </p>
      </div>
    </PageFrame>
  );
}
