import type { ComponentType } from 'react';
import { BACK_COVER_ID, DESIGNED_FACE_IDS } from './faceIds';
import { Face00Cover } from './faces/Face00Cover';
import { Face01Index } from './faces/Face01Index';
import { Face02Welcome } from './faces/Face02Welcome';
import { Face03About } from './faces/Face03About';
import { Face04Experience } from './faces/Face04Experience';
import { Face05Projects } from './faces/Face05Projects';
import { Face06Argos } from './faces/Face06Argos';
import { Face07ArgosShot } from './faces/Face07ArgosShot';
import { Face08ArgosStack } from './faces/Face08ArgosStack';
import { Face09SegundoAireShot } from './faces/Face09SegundoAireShot';
import { Face10SegundoAire } from './faces/Face10SegundoAire';
import { Face11ArcoShot } from './faces/Face11ArcoShot';
import { Face12ArcoFisio } from './faces/Face12ArcoFisio';
import { Face13TestimonialsLead } from './faces/Face13TestimonialsLead';
import { Face14TestimonialsGrid } from './faces/Face14TestimonialsGrid';
import { Face15Stack } from './faces/Face15Stack';
import { Face16Architecture } from './faces/Face16Architecture';
import { Face18Thanks } from './faces/Face18Thanks';
import { FaceBackCover } from './faces/FaceBackCover';
import { FaceBlank } from './faces/FaceBlank';

/** Face id (see src/scene/bookLayout.ts; BACK_COVER_ID = back cover exterior) -> design component. */
export const FACE_COMPONENTS: Record<number, ComponentType> = {
  0: Face00Cover,
  1: Face01Index,
  2: Face02Welcome,
  3: Face03About,
  4: Face04Experience,
  5: Face05Projects,
  6: Face06Argos,
  7: Face07ArgosShot,
  8: Face08ArgosStack,
  9: Face09SegundoAireShot,
  10: Face10SegundoAire,
  11: Face11ArcoShot,
  12: Face12ArcoFisio,
  13: Face13TestimonialsLead,
  14: Face14TestimonialsGrid,
  15: Face15Stack,
  16: Face16Architecture,
  17: FaceBlank,
  18: Face18Thanks,
  19: FaceBlank,
  [BACK_COVER_ID]: FaceBackCover,
};

if (import.meta.env.DEV) {
  const missing = DESIGNED_FACE_IDS.filter((id) => !FACE_COMPONENTS[id]);
  if (missing.length) console.warn('[pages-design] faces listed in faceIds.ts without a component:', missing);
}
