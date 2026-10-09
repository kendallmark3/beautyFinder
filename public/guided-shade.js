// Guided Shade Experience. See intent/features/Feature7.md
// Presentation only: which shades match is decided by POST /api/shade-match (BR-SM-1..BR-SM-5).
// SEC-2: depth and undertone stay in the page apart from that one request. Nothing here logs or stores them.
import { shadeColor } from './shade-color.js';

// Every depth the shopper can pick: 1 to 10 in half steps, lighter to deeper.
export const DEPTH_STOPS = Array.from({ length: 19 }, (_, i) => 1 + i * 0.5);

export const UNDERTONES = [
  { id: 'cool', label: 'Rosy', hint: 'Silver jewelry flatters me; I flush pink.' },
  { id: 'neutral', label: 'In between', hint: 'Both metals work, or I am not sure.' },
  { id: 'warm', label: 'Golden', hint: 'Gold jewelry flatters me; I tan easily.' },
];

export function depthWord(depth) {
  return depth <= 3.5 ? 'lighter' : depth <= 6.5 ? 'medium' : 'deeper';
}

// The colour that stands for the shopper's own complexion. Neutral until an undertone is chosen.
export function complexion(depth, undertone) {
  return shadeColor(depth, undertone ?? 'neutral');
}

export function complexionLabel(depth, undertone) {
  const tone = UNDERTONES.find((u) => u.id === undertone);
  return `${depthWord(depth)} depth${tone ? ` · ${tone.label.toLowerCase()} undertone` : ''}`;
}

// The API's order is kept as it is: first is the recommendation, the rest are alternatives.
export function presentMatches(result) {
  const [primary, ...alternatives] = result.matches;
  return { primary, alternatives, consultation: Boolean(result.consultation) };
}

export function confidenceLine(confidence) {
  return { excellent: 'An excellent match', good: 'A good match', fair: 'A fair match, worth trying in person' }[confidence];
}

// How an alternative differs from the shopper's own selection, in the skill's words (lighter / deeper).
export function difference(selection, shade) {
  const gap = shade.depth - selection.depth;
  const depth = gap === 0 ? 'your depth'
    : `${Math.abs(gap) <= 0.5 ? 'a touch' : Math.abs(gap) <= 1 ? 'a little' : 'noticeably'} ${gap < 0 ? 'lighter' : 'deeper'}`;
  const tone = shade.undertone === selection.undertone ? 'your undertone' : `${shade.undertone} undertone`;
  return `${depth}, ${tone}`;
}
