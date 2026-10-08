// Feature 002: Shade Finder. See intent/features/002-shade-finder.md
// Business rules: context/business-rules.md (BR-SM-1..BR-SM-5)
import { getFoundationShades } from './catalog.js';

export const UNDERTONES = ['cool', 'neutral', 'warm'];
const UNDERTONE_PENALTY = {
  cool: { cool: 0, neutral: 0.5, warm: 1.5 },
  neutral: { cool: 0.5, neutral: 0, warm: 0.5 },
  warm: { cool: 1.5, neutral: 0.5, warm: 0 },
};
export const CONSULTATION_THRESHOLD = 1.5;
const MAX_RESULTS = 3;

export function validateInput(input) {
  const errors = {};
  const depth = input?.depth;
  if (typeof depth !== 'number' || Number.isNaN(depth) || depth < 1 || depth > 10) {
    errors.depth = 'depth must be a number from 1 (lightest) to 10 (deepest)';
  }
  if (!UNDERTONES.includes(input?.undertone)) {
    errors.undertone = `undertone must be one of: ${UNDERTONES.join(', ')}`;
  }
  return Object.keys(errors).length ? errors : null;
}

function confidence(score) {
  if (score <= 0.5) return 'excellent';
  if (score <= 1.0) return 'good';
  return 'fair';
}

export function matchShades({ depth, undertone }, shades = getFoundationShades()) {
  const ranked = shades
    .map((s) => {
      const depthGap = Math.abs(depth - s.depth);
      const score = Number((depthGap + UNDERTONE_PENALTY[undertone][s.undertone]).toFixed(2));
      return { ...s, depthGap, score };
    })
    .sort((a, b) => a.score - b.score || a.depthGap - b.depthGap || a.code.localeCompare(b.code))
    .slice(0, MAX_RESULTS)
    .map(({ depthGap, ...s }) => ({ ...s, confidence: confidence(s.score) }));

  return { matches: ranked, consultation: ranked[0].score > CONSULTATION_THRESHOLD };
}
