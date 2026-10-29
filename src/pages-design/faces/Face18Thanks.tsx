import { portfolio, ui } from '../../content/portfolio';
import { PageFrame } from '../PageFrame';
import { LogoMark } from '../parts';

const { person } = portfolio;

/** Face 18 — closing page (right page of spread 9, light): the editorial breath before the back cover. */
export function Face18Thanks() {
  return (
    <PageFrame theme="light" side="R">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ paddingLeft: 90 }}>
        <LogoMark size={120} ring="#1b1813" ink="#1b1813" />
        <p className="mt-14 font-serif text-[170px] italic leading-[0.92] text-paper-ink">{ui.thanks}</p>
        <p className="mt-14 font-mono text-[22px] uppercase tracking-[0.18em] text-paper-muted">
          © 2026 {person.name}
        </p>
      </div>
    </PageFrame>
  );
}
