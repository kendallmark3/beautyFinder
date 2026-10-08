// Feature 002: Shade Finder. See intent/features/002-shade-finder.md
// Rules: context/business-rules.md (BR-SM-1..BR-SM-5). SEC-2: never log or store the inputs.
import { getFoundationShades } from './catalog.js';

export const UNDERTONES = ['cool', 'neutral', 'warm'];
const MAX_MATCHES = 3;
const CONSULTATION_ABOVE = 1.5;

export function validateInput(input) {
  const fields = {};
  const depth = input?.depth;
  if (typeof depth !== 'number' || !Number.isFinite(depth) || depth < 1 || depth > 10) {
    fields.depth = 'Depth must be a number from 1 (lightest) to 10 (deepest).';
  }
  if (!UNDERTONES.includes(input?.undertone)) {
    fields.undertone = `Undertone must be one of: ${UNDERTONES.join(', ')}.`;
  }
  return Object.keys(fields).length ? fields : null;
}

// BR-SM-2: same = 0, neutral vs cool or warm = 0.5, cool vs warm = 1.5.
function undertonePenalty(a, b) {
  if (a === b) return 0;
  return a === 'neutral' || b === 'neutral' ? 0.5 : 1.5;
}

// BR-SM-4
function confidence(score) {
  if (score <= 0.5) return 'excellent';
  if (score <= 1.0) return 'good';
  return 'fair';
}

export function matchShades({ depth, undertone }, shades = getFoundationShades()) {
  const matches = shades
    .map((shade) => {
      const gap = Math.abs(depth - shade.depth);
      const score = Math.round((gap + undertonePenalty(undertone, shade.undertone)) * 100) / 100;
      return { shade, gap, score };
    })
    // BR-SM-3: lowest score, then smaller depth gap, then shade code ascending.
    .sort((a, b) => a.score - b.score || a.gap - b.gap || a.shade.code.localeCompare(b.shade.code))
    .slice(0, MAX_MATCHES)
    .map(({ shade, score }) => ({ ...shade, score, confidence: confidence(score) }));

  // BR-SM-5
  return { matches, consultation: matches.length > 0 && matches[0].score > CONSULTATION_ABOVE };
}
